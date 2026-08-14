/**
 * Myclassroom Online Classroom Application Logic
 * Modern, Clean, Fluid, Real-Time Synchronized
 */

// Global State
let currentUser = null;
let activeLoginRole = 'teacher';
let activeNavView = 'dashboard';

// Realtime Cache Stores
let usersData = {};
let studentsData = {};
let coursesData = {};
let homeworkData = {};
let submissionsData = {};
let quizzesData = {};
let quizResultsData = {};
let announcementsData = {};

// Quiz Runner State
let activeQuizTimerInterval = null;
let activeQuizData = null;
let quizRemainingSeconds = 0;

// Dynamic Quiz Builder State
let quizQuestionsList = [];

/* -------------------------------------------------------------
   POPUP & NOTIFICATION HELPER ENGINE (SweetAlert2 Modern UI)
------------------------------------------------------------- */
function showPopupAlert(title, text = '', icon = 'info') {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'ตกลง',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'swal2-popup' }
    });
  } else {
    alert(text ? `${title}\n${text}` : title);
  }
}

function showPopupSuccess(title, text = '') {
  return showPopupAlert(title, text, 'success');
}

function showPopupWarning(title, text = '') {
  return showPopupAlert(title, text, 'warning');
}

function showPopupError(title, text = '') {
  return showPopupAlert(title, text, 'error');
}

function showPopupConfirm(title, text = '', confirmText = 'ยืนยัน', icon = 'warning') {
  if (typeof Swal !== 'undefined') {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      reverseButtons: true,
      customClass: { popup: 'swal2-popup' }
    }).then((result) => result.isConfirmed);
  } else {
    return Promise.resolve(confirm(text ? `${title}\n${text}` : title));
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  console.log("Myclassroom application starting...");
  
  // Recover local client cache (ag_homework) for instant offline startup
  try {
    const cachedHw = localStorage.getItem('ag_homework');
    if (cachedHw) {
      homeworkData = JSON.parse(cachedHw);
    }
  } catch (e) {
    console.warn("Failed reading ag_homework from localStorage:", e);
  }

  initRealtimeSync();
  checkSavedSession();
  
  // Initialize default quiz question builder with 1 question
  addQuizQuestionItem();
});

/* -------------------------------------------------------------
   1. REALTIME SYNCHRONIZATION & SEEDING
------------------------------------------------------------- */
function initRealtimeSync() {
  if (typeof listenToData !== 'function') return;

  // Listen to Users
  listenToData('users', (data) => {
    usersData = data || {};
    renderUsersTable();
    populateTeacherDropdowns();
    checkInitialSeedNeeded();
  });

  // Listen to Students Roster
  listenToData('students', (data) => {
    studentsData = data || {};
    updateClassFilterDropdowns();
    renderStudentsTable();
    updateDashboardStats();
    renderScoreReports();
  });

  // Listen to Courses
  listenToData('courses', (data) => {
    coursesData = data || {};
    renderCoursesList();
    updateCourseDropdowns();
    updateDashboardStats();
    renderScoreReports();
  });

  // Listen to Homework (Primary Firebase node + Local Client Cache)
  listenToData('homework', (data) => {
    homeworkData = data || {};
    try {
      localStorage.setItem('ag_homework', JSON.stringify(homeworkData));
    } catch (e) {
      console.warn("Failed saving ag_homework to localStorage:", e);
    }
    renderCoursesList();
    updateDashboardStats();
    renderScoreReports();
    renderDashboardHomeworkSummary();
  });

  // Listen to Homework Submissions
  listenToData('homework_submissions', (data) => {
    submissionsData = data || {};
    renderCoursesList();
    renderScoreReports();
    renderDashboardHomeworkSummary();
  });

  // Listen to Quizzes
  listenToData('quizzes', (data) => {
    quizzesData = data || {};
    renderQuizzesList();
    updateDashboardStats();
    renderScoreReports();
    renderDashboardQuizSummary();
  });

  // Listen to Quiz Results
  listenToData('quiz_results', (data) => {
    quizResultsData = data || {};
    renderQuizzesList();
    renderScoreReports();
  });

  // Listen to Announcements
  listenToData('announcements', (data) => {
    announcementsData = data || {};
    renderAnnouncements();
  });
}

/**
 * Seed initial database records if empty
 */
function checkInitialSeedNeeded() {
  // Always ensure admin user exists in DB with admin56 password
  if (!usersData['admin'] || usersData['admin'].password !== 'admin56') {
    saveData('users/admin', {
      username: "admin",
      name: "ผู้ดูแลระบบ (Admin)",
      password: "admin56",
      role: "admin"
    });
  }

  if (Object.keys(usersData).length === 0) {
    console.log("Seeding default initial users and system data...");
    
    // Seed default Admin & Teacher
    const initialUsers = {
      "admin": { username: "admin", name: "ผู้ดูแลระบบ (Admin)", password: "admin56", role: "admin" },
      "0812345678": { username: "0812345678", name: "คุณครูสมศักดิ์ รักเรียน", password: "123456", role: "teacher" }
    };
    
    // Seed sample Announcement
    const initialAnnounce = {
      title: "ยินดีต้อนรับสู่ระบบห้องเรียนออนไลน์ Myclassroom",
      content: "ขอให้นักเรียนทุกคนเข้าตรวจสอบรายวิชา การบ้าน และแบบทดสอบล่าสุดผ่านหน้าแดชบอร์ด ข้อมูลทุกอย่างจะอัปเดตสดแบบ Real-Time",
      updatedAt: new Date().toISOString()
    };

    saveData('users', initialUsers);
    saveData('announcements', initialAnnounce);
    saveData('_system_seeded', true);
  }
}


/* -------------------------------------------------------------
   2. AUTHENTICATION & LOGIN LOGIC (Unified Single Sign-On)
------------------------------------------------------------- */
function switchLoginRole(role) {
  // Kept for backward compatibility
  activeLoginRole = role;
}

function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    showPopupWarning("กรุณากรอกข้อมูล", "กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบถ้วน");
    return;
  }

  let foundUser = null;

  // 1. Embedded hardcoded Admin credentials check (for instant guaranteed login)
  if (username.toLowerCase() === 'admin' && (password === 'admin56' || password === 'admin123' || password === 'admin')) {
    foundUser = {
      username: "admin",
      name: "ผู้ดูแลระบบ (Admin)",
      password: "admin56",
      role: "admin"
    };
    saveData('users/admin', foundUser);
  }

  // 2. Direct key match in usersData (Teacher, Admin, or Student)
  if (!foundUser && usersData[username]) {
    const u = usersData[username];
    if (u.password === password || (u.role === 'student' && (u.studentId === password || password === username))) {
      foundUser = u;
    }
  }

  // 3. Search by username or studentId across all usersData
  if (!foundUser) {
    const matchedKey = Object.keys(usersData).find(k => {
      const u = usersData[k];
      return (u.username === username || u.studentId === username || k === username) && 
             (u.password === password || (u.role === 'student' && password === username));
    });
    if (matchedKey) {
      foundUser = usersData[matchedKey];
    }
  }

  // 4. Check in studentsData (Auto Student ID Login)
  if (!foundUser) {
    const std = studentsData[username] || Object.values(studentsData).find(s => s.studentId === username);
    if (std && (password === std.studentId || password === username)) {
      foundUser = {
        username: std.studentId,
        password: std.studentId,
        name: std.name,
        role: 'student',
        studentId: std.studentId,
        classLevel: std.classLevel
      };
      saveData(`users/${std.studentId}`, foundUser);
    }
  }

  if (foundUser) {
    currentUser = foundUser;
    sessionStorage.setItem('myclassroom_user', JSON.stringify(currentUser));
    showAppScreen();
    logActivity(`ผู้ใช้งาน ${currentUser.name} เข้าสู่ระบบแล้ว`);
  } else {
    showPopupError("เข้าสู่ระบบไม่สำเร็จ", "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (สำหรับนักเรียนให้ใช้รหัสประจำตัวเป็นทั้งชื่อผู้ใช้และรหัสผ่าน)");
  }
}

function checkSavedSession() {
  const saved = sessionStorage.getItem('myclassroom_user');
  if (saved) {
    try {
      currentUser = JSON.parse(saved);
      showAppScreen();
    } catch (e) {
      sessionStorage.removeItem('myclassroom_user');
    }
  }
}

function handleLogout() {
  showPopupConfirm("ยืนยันออกจากระบบ", "คุณต้องการออกจากระบบ Myclassroom ใช่หรือไม่?", "ออกจากระบบ", "warning").then((confirmed) => {
    if (confirmed) {
      currentUser = null;
      sessionStorage.removeItem('myclassroom_user');
      document.body.classList.remove('role-student', 'role-teacher');
      document.getElementById('app-screen').style.display = 'none';
      document.getElementById('login-screen').style.display = 'flex';
      showPopupSuccess("ออกจากระบบเรียบร้อย", "ขอบคุณที่ใช้งานระบบ Myclassroom");
    }
  });
}

function showAppScreen() {
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app-screen').style.display = 'flex';

  const isStudent = currentUser && currentUser.role === 'student';
  document.body.classList.toggle('role-student', isStudent);
  document.body.classList.toggle('role-teacher', !isStudent);

  // Set user profile in sidebar
  document.getElementById('sidebar-user-name').innerText = currentUser.name;
  document.getElementById('sidebar-user-avatar').innerText = currentUser.name.charAt(0);
  
  let roleText = "ครูผู้สอน";
  if (currentUser.role === 'admin') roleText = "ผู้ดูแลระบบ";
  if (currentUser.role === 'student') roleText = `นักเรียน (${currentUser.classLevel || 'เรียน'})`;
  document.getElementById('sidebar-user-role').innerText = roleText;

  // Toggle role-specific controls
  const teacherElements = document.querySelectorAll('.teacher-only');
  teacherElements.forEach(el => {
    if (isStudent) {
      el.style.setProperty('display', 'none', 'important');
    } else {
      if (el.classList.contains('nav-item')) {
        el.style.display = 'flex';
      } else if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
        el.style.display = 'inline-flex';
      } else {
        el.style.display = 'flex';
      }
    }
  });

  // Default view
  switchNav('dashboard');
}

function togglePasswordVisibility(inputId, buttonEl) {
  const input = document.getElementById(inputId);
  const icon = buttonEl.querySelector('i');
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fa-solid fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fa-solid fa-eye';
  }
}


/* -------------------------------------------------------------
   3. NAVIGATION & VIEW SWITCHING
------------------------------------------------------------- */
function switchNav(viewName) {
  // Security permission guard for students: only allowed dashboard, courses, quizzes
  if (currentUser && currentUser.role === 'student') {
    const studentAllowedViews = ['dashboard', 'courses', 'quizzes'];
    if (!studentAllowedViews.includes(viewName)) {
      viewName = 'dashboard';
    }
  }

  activeNavView = viewName;
  
  // Update sidebar active link
  document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  const navBtn = document.getElementById(`nav-${viewName}`);
  if (navBtn) navBtn.classList.add('active');

  // Hide all views, show selected
  document.querySelectorAll('.app-view').forEach(view => view.style.display = 'none');
  const targetView = document.getElementById(`view-${viewName}`);
  if (targetView) targetView.style.display = 'block';

  // Page title mapping
  const titleMap = {
    dashboard: "แดชบอร์ดภาพรวมระบบ",
    students: "รายชื่อนักเรียนในระบบ",
    courses: "รายวิชาและการบ้าน",
    quizzes: "คลังแบบทดสอบและข้อสอบ",
    reports: "สรุปรายงานคะแนนเก็บและคะแนนสอบ",
    users: "จัดการผู้ใช้งานในระบบ"
  };
  document.getElementById('page-title').innerText = titleMap[viewName] || "Myclassroom";

  // Trigger render functions for target view
  if (viewName === 'dashboard') updateDashboardStats();
  if (viewName === 'students') renderStudentsTable();
  if (viewName === 'courses') renderCoursesList();
  if (viewName === 'quizzes') renderQuizzesList();
  if (viewName === 'reports') renderScoreReports();
  if (viewName === 'users') renderUsersTable();

  // Close sidebar on mobile
  document.getElementById('sidebar').classList.remove('show');
}

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('show');
}


/* -------------------------------------------------------------
   4. DASHBOARD RENDERERS
------------------------------------------------------------- */
function updateDashboardStats() {
  const isStudent = currentUser && currentUser.role === 'student';
  const studentClass = (currentUser && currentUser.classLevel) ? currentUser.classLevel.trim() : '';

  const studentCount = Object.keys(studentsData).length;
  const courseCount = Object.keys(coursesData).length;
  const quizCount = Object.keys(quizzesData).length;

  if (isStudent) {
    // Filter homework for this student's class
    const myHwKeys = Object.keys(homeworkData).filter(id => {
      const hw = homeworkData[id];
      const targets = hw.targetClasses || (hw.targetClass ? hw.targetClass.split(',').map(s => s.trim()) : ['all']);
      return targets.includes('all') || targets.length === 0 || targets.includes(studentClass);
    });

    document.getElementById('stat-students-count').innerText = studentClass || 'นักเรียน';
    const lbl1 = document.querySelector('#stat-students-count + .stat-label');
    if (lbl1) lbl1.innerText = 'ห้องเรียนของฉัน';

    document.getElementById('stat-courses-count').innerText = courseCount;
    const lbl2 = document.querySelector('#stat-courses-count + .stat-label');
    if (lbl2) lbl2.innerText = 'รายวิชาทั้งหมด';

    document.getElementById('stat-homework-count').innerText = myHwKeys.length;
    const lbl3 = document.querySelector('#stat-homework-count + .stat-label');
    if (lbl3) lbl3.innerText = 'การบ้านห้องของฉัน';

    document.getElementById('stat-quizzes-count').innerText = quizCount;
    const lbl4 = document.querySelector('#stat-quizzes-count + .stat-label');
    if (lbl4) lbl4.innerText = 'แบบทดสอบที่เปิดทำ';
  } else {
    const homeworkCount = Object.keys(homeworkData).length;

    document.getElementById('stat-students-count').innerText = studentCount;
    const lbl1 = document.querySelector('#stat-students-count + .stat-label');
    if (lbl1) lbl1.innerText = 'นักเรียนในระบบ (คน)';

    document.getElementById('stat-courses-count').innerText = courseCount;
    const lbl2 = document.querySelector('#stat-courses-count + .stat-label');
    if (lbl2) lbl2.innerText = 'รายวิชาทั้งหมด';

    document.getElementById('stat-homework-count').innerText = homeworkCount;
    const lbl3 = document.querySelector('#stat-homework-count + .stat-label');
    if (lbl3) lbl3.innerText = 'การบ้านที่สั่งแล้ว';

    document.getElementById('stat-quizzes-count').innerText = quizCount;
    const lbl4 = document.querySelector('#stat-quizzes-count + .stat-label');
    if (lbl4) lbl4.innerText = 'แบบทดสอบที่สร้าง';
  }
}

function renderAnnouncements() {
  const heading = document.getElementById('announcement-heading');
  const body = document.getElementById('announcement-body');
  
  if (announcementsData.title) {
    heading.innerText = announcementsData.title;
    body.innerText = announcementsData.content;
  }
}

function openAnnouncementModal() {
  document.getElementById('announce-title').value = announcementsData.title || '';
  document.getElementById('announce-body').value = announcementsData.content || '';
  openModal('modal-announcement');
}

function saveAnnouncementForm(e) {
  e.preventDefault();
  const title = document.getElementById('announce-title').value.trim();
  const content = document.getElementById('announce-body').value.trim();

  saveData('announcements', {
    title,
    content,
    updatedAt: new Date().toISOString(),
    updatedBy: currentUser.name
  }).then(() => {
    closeModal('modal-announcement');
    showPopupSuccess("บันทึกประกาศสำเร็จ!", "ปรับปรุงประกาศข่าวสารห้องเรียนเรียบร้อยแล้ว");
    logActivity(`ปรับปรุงประกาศห้องเรียน: ${title}`);
  });
}

function renderDashboardHomeworkSummary() {
  const container = document.getElementById('dashboard-homework-summary');
  let hwKeys = Object.keys(homeworkData);
  const isStudent = currentUser && currentUser.role === 'student';
  const studentClass = (currentUser && currentUser.classLevel) ? currentUser.classLevel.trim() : '';

  if (isStudent) {
    hwKeys = hwKeys.filter(id => {
      const hw = homeworkData[id];
      const targets = hw.targetClasses || (hw.targetClass ? hw.targetClass.split(',').map(s => s.trim()) : ['all']);
      return targets.includes('all') || targets.length === 0 || targets.includes(studentClass);
    });
  }

  if (hwKeys.length === 0) {
    container.innerHTML = `<p class="text-muted" style="text-align:center; padding:20px;">ยังไม่มีข้อมูลการบ้าน (หรือไม่มีงานที่มอบหมายให้ห้องของคุณ)</p>`;
    return;
  }

  let html = `<div style="display:flex; flex-direction:column; gap:12px;">`;
  hwKeys.slice(-4).reverse().forEach(id => {
    const hw = homeworkData[id];
    const course = coursesData[hw.courseId] || { code: 'วิชา', name: '' };
    const subs = submissionsData[id] ? Object.keys(submissionsData[id]).length : 0;

    let statusBadge = '';
    if (isStudent) {
      const mySub = (submissionsData[id] && currentUser.studentId) ? submissionsData[id][currentUser.studentId] : null;
      if (mySub) {
        statusBadge = `<span class="badge badge-green"><i class="fa-solid fa-check"></i> ส่งแล้ว (${mySub.score !== undefined ? mySub.score + ' คะแนน' : 'รอตรวจ'})</span>`;
      } else {
        statusBadge = `<button class="btn btn-sm btn-primary" onclick="switchNav('courses')"><i class="fa-solid fa-paper-plane"></i> ส่งงาน</button>`;
      }
    } else {
      statusBadge = `<span class="badge badge-blue">ส่งแล้ว ${subs} คน</span>`;
    }

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8fafc; border-radius:12px; border:1px solid var(--border); flex-wrap:wrap; gap:8px;">
        <div>
          <div style="font-weight:700; color:#0f172a;">${hw.title}</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">${course.code} ${course.name} | กำหนดส่ง: ${hw.dueDate}</div>
        </div>
        <div style="text-align:right;">
          ${statusBadge}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function renderDashboardQuizSummary() {
  const container = document.getElementById('dashboard-quiz-summary');
  const qKeys = Object.keys(quizzesData);

  if (qKeys.length === 0) {
    container.innerHTML = `<p class="text-muted" style="text-align:center; padding:20px;">ยังไม่มีแบบทดสอบ</p>`;
    return;
  }

  let html = `<div style="display:flex; flex-direction:column; gap:12px;">`;
  qKeys.slice(-4).reverse().forEach(id => {
    const q = quizzesData[id];
    const course = coursesData[q.courseId] || { name: 'วิชา' };
    const doneCount = quizResultsData[id] ? Object.keys(quizResultsData[id]).length : 0;

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; background:#f8fafc; border-radius:12px; border:1px solid var(--border);">
        <div>
          <div style="font-weight:700; color:#0f172a;">${q.title}</div>
          <div style="font-size:0.85rem; color:var(--text-muted);">${course.name} | ${q.type} ตัวเลือก | เวลา ${q.duration} นาที</div>
        </div>
        <div>
          <span class="badge badge-green">ทำแล้ว ${doneCount} คน</span>
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function logActivity(text) {
  const feed = document.getElementById('activity-feed');
  if (!feed) return;

  const item = document.createElement('div');
  item.className = 'activity-item';
  const nowStr = new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
  
  item.innerHTML = `
    <div class="activity-icon"><i class="fa-solid fa-bell"></i></div>
    <div>
      <div class="activity-text">${text}</div>
      <div class="activity-time">${nowStr} น.</div>
    </div>
  `;
  feed.insertBefore(item, feed.firstChild);
}


/* -------------------------------------------------------------
   5. STUDENT ROSTER & CSV IMPORT
------------------------------------------------------------- */
function updateClassFilterDropdowns() {
  const classSet = new Set();
  Object.values(studentsData).forEach(s => {
    if (s.classLevel && s.classLevel.trim()) {
      classSet.add(s.classLevel.trim().replace(/^"|"$/g, ''));
    }
  });

  const sortedClasses = Array.from(classSet).sort((a, b) => a.localeCompare(b, 'th', { numeric: true }));

  const stdFilter = document.getElementById('student-class-filter');
  const repFilter = document.getElementById('report-class-filter');

  // Find preferred default room: ม.1/1 first, or the first available room
  let defaultRoom = '';
  if (sortedClasses.includes('ม.1/1')) {
    defaultRoom = 'ม.1/1';
  } else if (sortedClasses.length > 0) {
    defaultRoom = sortedClasses[0];
  }

  let stdOptions = '';
  sortedClasses.forEach(c => {
    stdOptions += `<option value="${c}">ห้อง ${c}</option>`;
  });
  stdOptions += `<option value="all">-- แสดงทุกห้องเรียน (${sortedClasses.length} ห้อง) --</option>`;

  if (stdFilter) {
    const currentVal = stdFilter.value;
    stdFilter.innerHTML = stdOptions;
    if (currentVal && (sortedClasses.includes(currentVal) || currentVal === 'all')) {
      stdFilter.value = currentVal;
    } else if (defaultRoom) {
      stdFilter.value = defaultRoom;
    }
  }

  let repOptions = `<option value="">-- ทุกระดับชั้น --</option>`;
  sortedClasses.forEach(c => {
    repOptions += `<option value="${c}">${c}</option>`;
  });
  if (repFilter) repFilter.innerHTML = repOptions;
}

function renderStudentsTable() {
  const tbody = document.getElementById('students-table-body');
  const summaryCard = document.getElementById('student-room-summary-card');
  const search = document.getElementById('student-search-input').value.toLowerCase().trim();
  const classFilter = document.getElementById('student-class-filter').value;

  const allStudents = Object.values(studentsData);
  if (allStudents.length === 0) {
    if (summaryCard) summaryCard.innerHTML = '';
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px;" class="text-muted"><i class="fa-solid fa-folder-open fa-2x" style="margin-bottom:8px; display:block; color:#94a3b8;"></i>ยังไม่มีข้อมูลนักเรียนในระบบ กรุณานำเข้าไฟล์ CSV หรือเพิ่มนักเรียนใหม่</td></tr>`;
    return;
  }

  // Filter students based on classroom and search
  const filteredStudents = allStudents.filter(std => {
    const cleanClass = (std.classLevel || '').trim().replace(/^"|"$/g, '');
    if (classFilter && classFilter !== 'all' && cleanClass !== classFilter) {
      return false;
    }
    if (search) {
      const searchStr = `${std.no || ''} ${std.studentId || ''} ${std.name || ''} ${std.classLevel || ''}`.toLowerCase();
      if (!searchStr.includes(search)) return false;
    }
    return true;
  });

  // Sort numerically by เลขที่ (no)
  filteredStudents.sort((a, b) => {
    const noA = parseInt(a.no) || 9999;
    const noB = parseInt(b.no) || 9999;
    if (noA !== noB) return noA - noB;
    return (a.studentId || '').localeCompare(b.studentId || '', 'th');
  });

  // Determine current room metadata
  let currentRoomTitle = classFilter && classFilter !== 'all' ? `ห้อง ${classFilter}` : `ทุกห้องเรียนทั้งหมด`;
  let advisors = new Set();
  filteredStudents.forEach(s => {
    if (s.advisor) advisors.add(s.advisor.trim().replace(/^"|"$/g, ''));
  });
  let advisorText = advisors.size > 0 ? Array.from(advisors).join(', ') : 'ยังไม่ระบุ';

  // Render Room Summary Card
  if (summaryCard) {
    summaryCard.innerHTML = `
      <div style="background:linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%); border:1px solid #bfdbfe; border-radius:14px; padding:14px 18px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; box-shadow:0 2px 6px rgba(37,99,235,0.06);">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <span class="badge badge-purple" style="font-size:0.95rem; padding:6px 14px; font-weight:800; border-radius:10px;">
            <i class="fa-solid fa-graduation-cap"></i> ${currentRoomTitle}
          </span>
          <div style="font-size:0.92rem; font-weight:700; color:#1e293b;">
            <i class="fa-solid fa-users" style="color:var(--primary);"></i> จำนวนนักเรียน: <span style="color:var(--primary);">${filteredStudents.length} คน</span>
          </div>
          <div style="font-size:0.9rem; color:#475569;">
            <i class="fa-solid fa-chalkboard-user" style="color:#0284c7;"></i> ครูที่ปรึกษา: <strong>${advisorText}</strong>
          </div>
        </div>
        <div style="font-size:0.82rem; color:#16a34a; font-weight:700; display:flex; align-items:center; gap:6px;">
          <i class="fa-solid fa-circle-check"></i> บัญชี Login ซิงค์อัตโนมัติ 100%
        </div>
      </div>
    `;
  }

  if (filteredStudents.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:36px;" class="text-muted"><i class="fa-solid fa-magnifying-glass fa-2x" style="margin-bottom:8px; display:block; color:#94a3b8;"></i>ไม่พบรายชื่อนักเรียนในห้องนี้ หรือไม่ตรงกับคำค้นหา</td></tr>`;
    return;
  }

  let html = '';
  filteredStudents.forEach(std => {
    const hasUserAccount = usersData[std.studentId] ? true : false;
    const accountBadge = hasUserAccount 
      ? `<span class="badge badge-green" style="padding:4px 10px; font-size:0.8rem;"><i class="fa-solid fa-circle-check"></i> พร้อมใช้งาน</span>`
      : `<span class="badge badge-yellow" style="padding:4px 10px; font-size:0.8rem;"><i class="fa-solid fa-clock"></i> รอดำเนินการ</span>`;

    const cleanAdvisor = (std.advisor || '-').trim().replace(/^"|"$/g, '');
    const cleanClass = (std.classLevel || '-').trim().replace(/^"|"$/g, '');

    html += `
      <tr style="transition:background 0.2s ease;">
        <td style="text-align:center; font-weight:800; color:#334155; font-size:0.95rem;">${std.no || '-'}</td>
        <td>
          <span style="font-family:monospace; font-size:0.95rem; font-weight:700; color:#1d4ed8; background:#eff6ff; padding:3px 8px; border-radius:6px; border:1px solid #bfdbfe;">
            ${std.studentId}
          </span>
        </td>
        <td>
          <div style="font-weight:700; color:#0f172a; font-size:0.95rem;">${std.name}</div>
        </td>
        <td style="text-align:center;">
          <span class="badge badge-purple" style="font-size:0.82rem; padding:3px 10px; font-weight:700;">
            ${cleanClass}
          </span>
        </td>
        <td style="color:#334155; font-size:0.9rem;">
          <i class="fa-solid fa-user-tie" style="color:#94a3b8; margin-right:4px;"></i> ${cleanAdvisor}
        </td>
        <td style="text-align:center;">${accountBadge}</td>
        <td class="teacher-only" style="text-align:center;">
          <button class="btn btn-sm btn-outline-danger" onclick="deleteStudent('${std.studentId}')" title="ลบข้อมูลนักเรียนคนนี้" style="padding:4px 8px; border-radius:8px;">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openBatchDeleteStudentsModal() {
  if (!currentUser || currentUser.role === 'student') {
    showPopupError("ไม่มีสิทธิ์", "นักเรียนไม่มีสิทธิ์ดำเนินการนี้");
    return;
  }

  const allStudents = Object.values(studentsData);
  if (allStudents.length === 0) {
    showPopupWarning("ไม่พบข้อมูล", "ยังไม่มีรายชื่อนักเรียนในระบบให้ลบ");
    return;
  }

  // Count students per classroom
  const classCountMap = {};
  allStudents.forEach(s => {
    const c = (s.classLevel || 'ไม่ระบุห้อง').trim().replace(/^"|"$/g, '');
    classCountMap[c] = (classCountMap[c] || 0) + 1;
  });

  const sortedRooms = Object.keys(classCountMap).sort((a, b) => a.localeCompare(b, 'th', { numeric: true }));

  let optionsHtml = '';
  sortedRooms.forEach(room => {
    optionsHtml += `<option value="${room}">ห้อง ${room} (${classCountMap[room]} คน)</option>`;
  });
  optionsHtml += `<option value="ALL_CLASSES" style="color:#ef4444; font-weight:bold;">⚠️ ลบนักเรียนทั้งหมดทุกห้อง (${allStudents.length} คน)</option>`;

  Swal.fire({
    title: '<span style="font-weight:800; color:#0f172a;"><i class="fa-solid fa-trash-can" style="color:#ef4444;"></i> เลือกลบรายชื่อนักเรียน</span>',
    html: `
      <div style="text-align:left; font-size:0.95rem; color:#475569; margin-bottom:14px; line-height:1.5;">
        กรุณาเลือกห้องเรียนที่ต้องการลบข้อมูลนักเรียนและบัญชีผู้ใช้งานออกจากระบบ:
      </div>
      <select id="swal-batch-delete-class" class="swal2-select" style="width:100%; padding:10px 14px; font-weight:700; border-radius:10px; border:1.5px solid #cbd5e1; font-size:1rem; color:#0f172a; margin:0 0 14px 0;">
        ${optionsHtml}
      </select>
      <div style="background:#fef2f2; border:1px solid #fecaca; border-radius:10px; padding:10px 14px; font-size:0.85rem; color:#991b1b; text-align:left;">
        <i class="fa-solid fa-triangle-exclamation"></i> <strong>คำเตือน:</strong> ข้อมูลนักเรียนและบัญชี Login ในห้องที่เลือกจะถูกลบออกจากฐานข้อมูลอย่างถาวร
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#64748b',
    confirmButtonText: '<i class="fa-solid fa-trash-can"></i> ยืนยันการลบข้อมูล',
    cancelButtonText: 'ยกเลิก',
    preConfirm: () => {
      const selectedClass = document.getElementById('swal-batch-delete-class').value;
      if (!selectedClass) {
        Swal.showValidationMessage('กรุณาเลือกห้องเรียนที่ต้องการลบ');
        return false;
      }
      return selectedClass;
    }
  }).then((result) => {
    if (result.isConfirmed && result.value) {
      const targetRoom = result.value;
      const studentsToDelete = allStudents.filter(s => {
        if (targetRoom === 'ALL_CLASSES') return true;
        const c = (s.classLevel || 'ไม่ระบุห้อง').trim().replace(/^"|"$/g, '');
        return c === targetRoom;
      });

      if (studentsToDelete.length === 0) {
        showPopupWarning("ไม่พบข้อมูล", "ไม่พบนักเรียนในห้องที่เลือก");
        return;
      }

      // Execute batch deletion
      const deletePromises = [];
      studentsToDelete.forEach(s => {
        deletePromises.push(deleteData(`students/${s.studentId}`));
        deletePromises.push(deleteData(`users/${s.studentId}`));
      });

      Promise.all(deletePromises).then(() => {
        const roomNameText = targetRoom === 'ALL_CLASSES' ? 'ทุกห้องเรียน' : `ห้อง ${targetRoom}`;
        showPopupSuccess("ลบรายชื่อสำเร็จ!", `ลบข้อมูลนักเรียน ${roomNameText} จำนวน ${studentsToDelete.length} คน เรียบร้อยแล้ว`);
        logActivity(`ลบรายชื่อนักเรียน ${roomNameText} จำนวน ${studentsToDelete.length} คน`);
        
        // Auto refresh
        updateClassFilterDropdowns();
        renderStudentsTable();
      });
    }
  });
}

function openAddStudentModal() {
  document.getElementById('std-no').value = '';
  document.getElementById('std-id').value = '';
  document.getElementById('std-name').value = '';
  document.getElementById('std-class').value = '';
  populateTeacherDropdowns();
  openModal('modal-add-student');
}

function saveStudentForm(e) {
  e.preventDefault();
  const no = document.getElementById('std-no').value;
  const studentId = document.getElementById('std-id').value.trim();
  const name = document.getElementById('std-name').value.trim();
  const classLevel = document.getElementById('std-class').value.trim();
  const advisor = document.getElementById('std-advisor').value.trim();

  // Save student record
  saveData(`students/${studentId}`, {
    no,
    studentId,
    name,
    classLevel,
    advisor
  });

  // Auto-sync Student Login User Credential (Username & Password = Student ID)
  saveData(`users/${studentId}`, {
    username: studentId,
    password: studentId,
    name: name,
    role: 'student',
    studentId: studentId,
    classLevel: classLevel
  });

  closeModal('modal-add-student');
  showPopupSuccess("บันทึกข้อมูลสำเร็จ!", `เพิ่มนักเรียน ${name} (รหัส ${studentId}) เข้าสู่ระบบเรียบร้อยแล้ว`);
  logActivity(`เพิ่มนักเรียนใหม่: ${name} (รหัส ${studentId})`);
}

function deleteStudent(studentId) {
  showPopupConfirm("ยืนยันลบข้อมูลนักเรียน", `คุณต้องการลบข้อมูลนักเรียนรหัส ${studentId} ใช่หรือไม่?`, "ลบข้อมูล", "warning").then((confirmed) => {
    if (confirmed) {
      deleteData(`students/${studentId}`);
      deleteData(`users/${studentId}`);
      showPopupSuccess("ลบข้อมูลสำเร็จ", `ลบข้อมูลนักเรียนรหัส ${studentId} เรียบร้อยแล้ว`);
      logActivity(`ลบข้อมูลนักเรียนรหัส ${studentId}`);
    }
  });
}

function openImportCsvModal() {
  document.getElementById('csv-file-input').value = '';
  openModal('modal-import-csv');
}

function processCsvImport(e) {
  e.preventDefault();
  const fileInput = document.getElementById('csv-file-input');
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const text = evt.target.result;
    parseAndImportCsvData(text);
  };
  reader.readAsText(file, 'UTF-8');
}

function parseAndImportCsvData(csvText) {
  // Normalize line endings
  const lines = csvText.split(/\r\n|\n|\r/);
  if (lines.length < 2) {
    showPopupWarning("ไม่พบข้อมูล", "ไฟล์ CSV ไม่มีข้อมูลเพียงพอ");
    return;
  }

  // Parse Headers
  const headers = lines[0].split(',').map(h => h.trim().replace(/^[\uFEFF]/, ''));
  
  // Required Header Names: เลขที่, รหัสประจำตัว, ชื่อ-สกุล, ระดับชั้น, ครูที่ปรึกษา
  const idxNo = headers.findIndex(h => h.includes('เลขที่'));
  const idxId = headers.findIndex(h => h.includes('รหัสประจำตัว') || h.includes('รหัส'));
  const idxName = headers.findIndex(h => h.includes('ชื่อ-สกุล') || h.includes('ชื่อ'));
  const idxClass = headers.findIndex(h => h.includes('ระดับชั้น') || h.includes('ชั้น'));
  const idxAdvisor = headers.findIndex(h => h.includes('ครูที่ปรึกษา') || h.includes('ครู'));

  if (idxId === -1 || idxName === -1) {
    showPopupError("รูปแบบไฟล์ไม่ถูกต้อง", "รูปแบบคอลัมน์ CSV ไม่ถูกต้อง กรุณาตรวจสอบหัวคอลัมน์: เลขที่, รหัสประจำตัว, ชื่อ-สกุล, ระดับชั้น, ครูที่ปรึกษา");
    return;
  }

  let importedCount = 0;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = line.split(',').map(cell => cell.trim().replace(/^"(.*)"$/, '$1'));
    const studentId = row[idxId];
    const name = row[idxName];

    if (studentId && name) {
      const no = idxNo !== -1 ? row[idxNo] : i;
      const classLevel = idxClass !== -1 ? row[idxClass] : '';
      const advisor = idxAdvisor !== -1 ? row[idxAdvisor] : '';

      // Save Student
      saveData(`students/${studentId}`, {
        no,
        studentId,
        name,
        classLevel,
        advisor
      });

      // Auto-create Student User Account (Username = Student ID, Password = Student ID)
      saveData(`users/${studentId}`, {
        username: studentId,
        password: studentId,
        name: name,
        role: 'student',
        studentId: studentId,
        classLevel: classLevel
      });

      importedCount++;
    }
  }

  closeModal('modal-import-csv');
  showPopupSuccess("นำเข้าข้อมูลสำเร็จ!", `นำข้อมูลนักเรียนเข้าสู่ระบบสำเร็จจำนวน ${importedCount} รายการ!`);
  logActivity(`นำเข้าข้อมูลนักเรียนด้วย CSV จำนวน ${importedCount} คน`);
}


/* -------------------------------------------------------------
   6. COURSES & HOMEWORK MANAGEMENT
------------------------------------------------------------- */
function populateTeacherDropdowns() {
  const courseTeacherSelect = document.getElementById('course-teacher');
  const editCourseTeacherSelect = document.getElementById('edit-course-teacher');
  const stdAdvisorSelect = document.getElementById('std-advisor');

  // Collect teachers and admins from usersData, coursesData, studentsData, and currentUser
  const teachers = [];

  // 1. From usersData
  Object.values(usersData).forEach(u => {
    if (u.name && (u.role === 'teacher' || u.role === 'admin' || !u.role)) {
      teachers.push(u.name.trim().replace(/^"|"$/g, ''));
    }
  });

  // 2. From coursesData
  Object.values(coursesData).forEach(c => {
    if (c.teacher && c.teacher.trim()) {
      teachers.push(c.teacher.trim().replace(/^"|"$/g, ''));
    }
  });

  // 3. From studentsData advisors
  Object.values(studentsData).forEach(s => {
    if (s.advisor && s.advisor.trim()) {
      teachers.push(s.advisor.trim().replace(/^"|"$/g, ''));
    }
  });

  // 4. Current user
  if (currentUser && currentUser.name) {
    teachers.push(currentUser.name.trim().replace(/^"|"$/g, ''));
  }

  // Unique teacher names
  const uniqueTeachers = Array.from(new Set(teachers.filter(Boolean))).sort((a, b) => a.localeCompare(b, 'th'));

  let optionsCourse = `<option value="">-- เลือกครูผู้สอน --</option>`;
  let optionsAdvisor = `<option value="">-- เลือกครูที่ปรึกษา --</option>`;

  uniqueTeachers.forEach(tName => {
    optionsCourse += `<option value="${tName}">${tName}</option>`;
    optionsAdvisor += `<option value="${tName}">${tName}</option>`;
  });

  if (courseTeacherSelect) {
    courseTeacherSelect.innerHTML = optionsCourse;
    if (currentUser && currentUser.name && uniqueTeachers.includes(currentUser.name)) {
      courseTeacherSelect.value = currentUser.name;
    }
  }

  if (editCourseTeacherSelect) {
    editCourseTeacherSelect.innerHTML = optionsCourse;
  }

  if (stdAdvisorSelect) {
    stdAdvisorSelect.innerHTML = optionsAdvisor;
  }
}

function renderTargetClassChips(containerId, courseId, selectedClasses = ['all']) {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Gather distinct classes from studentsData
  const classLevels = new Set();
  Object.values(studentsData).forEach(s => {
    if (s.classLevel && s.classLevel.trim()) {
      classLevels.add(s.classLevel.trim());
    }
  });

  // Also include course level if available
  const course = coursesData[courseId];
  if (course && course.level) {
    classLevels.add(course.level.trim());
  }

  // Sort classes
  const sortedClasses = Array.from(classLevels).sort((a, b) => a.localeCompare(b, 'th'));

  // Normalize selectedClasses
  if (typeof selectedClasses === 'string') {
    selectedClasses = selectedClasses.split(',').map(s => s.trim()).filter(Boolean);
  }
  if (!Array.isArray(selectedClasses) || selectedClasses.length === 0) {
    selectedClasses = ['all'];
  }

  const isAll = selectedClasses.includes('all');

  let html = `
    <label class="target-chip ${isAll ? 'active' : ''}" onclick="toggleTargetClassChip('${containerId}', 'all', this)">
      <input type="checkbox" value="all" ${isAll ? 'checked' : ''} style="display:none;">
      <i class="fa-solid fa-globe"></i> ทุกห้องเรียน (ทั้งหมด)
    </label>
  `;

  sortedClasses.forEach(cls => {
    const isChecked = !isAll && selectedClasses.includes(cls);
    html += `
      <label class="target-chip ${isChecked ? 'active' : ''}" onclick="toggleTargetClassChip('${containerId}', '${cls}', this)">
        <input type="checkbox" value="${cls}" ${isChecked ? 'checked' : ''} style="display:none;">
        <i class="fa-solid fa-graduation-cap"></i> ห้อง ${cls}
      </label>
    `;
  });

  container.innerHTML = html;
  updateTargetChipsSummary(containerId);
}

function toggleTargetClassChip(containerId, value, labelEl) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const chips = container.querySelectorAll('.target-chip');
  const allChip = container.querySelector('.target-chip input[value="all"]')?.parentElement;

  if (value === 'all') {
    // If clicking "all", select "all" and uncheck all specific rooms
    chips.forEach(chip => {
      const input = chip.querySelector('input');
      if (input.value === 'all') {
        input.checked = true;
        chip.classList.add('active');
      } else {
        input.checked = false;
        chip.classList.remove('active');
      }
    });
  } else {
    // Specific room chip toggled
    const input = labelEl.querySelector('input');
    const newState = !input.checked;
    input.checked = newState;
    if (newState) {
      labelEl.classList.add('active');
      // Uncheck "all"
      if (allChip) {
        allChip.querySelector('input').checked = false;
        allChip.classList.remove('active');
      }
    } else {
      labelEl.classList.remove('active');
    }

    // If no room is checked, revert back to "all"
    const anyChecked = Array.from(chips).some(chip => {
      const inp = chip.querySelector('input');
      return inp.value !== 'all' && inp.checked;
    });

    if (!anyChecked && allChip) {
      allChip.querySelector('input').checked = true;
      allChip.classList.add('active');
    }
  }

  updateTargetChipsSummary(containerId);
}

function updateTargetChipsSummary(containerId) {
  const selected = getSelectedTargetClasses(containerId);
  const summaryId = containerId === 'hw-target-chips-container' ? 'hw-target-summary' : 'edit-hw-target-summary';
  const summaryEl = document.getElementById(summaryId);
  if (!summaryEl) return;

  if (selected.includes('all')) {
    summaryEl.innerText = 'ทุกห้องเรียน';
  } else {
    summaryEl.innerText = `เลือกแล้ว (${selected.length} ห้อง): ${selected.join(', ')}`;
  }
}

function getSelectedTargetClasses(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return ['all'];

  const checkedInputs = Array.from(container.querySelectorAll('input:checked'));
  const values = checkedInputs.map(inp => inp.value);

  if (values.includes('all') || values.length === 0) {
    return ['all'];
  }
  return values;
}

function updateCourseDropdowns() {
  const hwCourseSelect = document.getElementById('hw-course-id');
  const quizCourseSelect = document.getElementById('quiz-course-id');
  const repCourseFilter = document.getElementById('report-course-filter');

  let options = `<option value="">-- เลือกรายวิชา --</option>`;
  Object.keys(coursesData).forEach(id => {
    const c = coursesData[id];
    options += `<option value="${id}">${c.code} ${c.name} (${c.level})</option>`;
  });

  if (hwCourseSelect) hwCourseSelect.innerHTML = options;
  if (quizCourseSelect) quizCourseSelect.innerHTML = options;
  if (repCourseFilter) repCourseFilter.innerHTML = `<option value="">-- ทุกรายวิชา --</option>` + options.replace('<option value="">-- เลือกรายวิชา --</option>', '');
}

function populateGradeLevelDropdowns(selectId, selectedValue = '') {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;

  // 1. Extract base grade levels from studentsData (e.g. 'ม.1/1' -> 'ม.1', 'ปวช.2/2' -> 'ปวช.2')
  const systemLevels = new Set();
  Object.values(studentsData).forEach(s => {
    if (s.classLevel && s.classLevel.trim()) {
      const fullClass = s.classLevel.trim();
      const baseLevel = fullClass.includes('/') ? fullClass.split('/')[0].trim() : fullClass;
      if (baseLevel) systemLevels.add(baseLevel);
    }
  });

  // 2. Extract existing levels from coursesData
  Object.values(coursesData).forEach(c => {
    if (c.level && c.level.trim()) {
      const courseLvl = c.level.includes('/') ? c.level.split('/')[0].trim() : c.level.trim();
      if (courseLvl) systemLevels.add(courseLvl);
    }
  });

  // If selectedValue is present, ensure it's included
  if (selectedValue && selectedValue.trim()) {
    systemLevels.add(selectedValue.trim());
  }

  // Fallback if system has no students or courses yet
  if (systemLevels.size === 0) {
    ['ม.1', 'ม.2', 'ม.3', 'ม.4', 'ม.5', 'ม.6', 'ปวช.1', 'ปวช.2', 'ปวช.3'].forEach(l => systemLevels.add(l));
  }

  // Sort natural Thai order
  const sortedLevels = Array.from(systemLevels).sort((a, b) => a.localeCompare(b, 'th'));

  let html = `<option value="">-- เลือกระดับชั้น --</option>`;
  sortedLevels.forEach(lvl => {
    html += `<option value="${lvl}">ระดับชั้น ${lvl}</option>`;
  });
  html += `<option value="__custom__">+ กำหนดระดับชั้นอื่น (เพิ่มใหม่)...</option>`;

  selectEl.innerHTML = html;

  if (selectedValue) {
    selectEl.value = selectedValue;
  }

  selectEl.onchange = function() {
    if (this.value === '__custom__') {
      promptCustomGradeLevel(selectId);
    }
  };
}

function promptCustomGradeLevel(selectId) {
  const selectEl = document.getElementById(selectId);
  if (!selectEl) return;

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      title: 'กำหนดระดับชั้นใหม่',
      text: 'กรอกชื่อระดับชั้นที่ต้องการ (เช่น ม.1, ม.2, ปวช.1, ปวช.2):',
      input: 'text',
      inputPlaceholder: 'เช่น ปวช.3 พิเศษ',
      showCancelButton: true,
      confirmButtonText: 'บันทึกระดับชั้น',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#2563eb',
      customClass: { popup: 'swal2-popup' },
      inputValidator: (value) => {
        if (!value || !value.trim()) {
          return 'กรุณากรอกชื่อระดับชั้น!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const customVal = result.value.trim();
        let opt = selectEl.querySelector(`option[value="${customVal}"]`);
        if (!opt) {
          opt = document.createElement('option');
          opt.value = customVal;
          opt.text = customVal;
          selectEl.insertBefore(opt, selectEl.lastElementChild);
        }
        selectEl.value = customVal;
      } else {
        selectEl.value = '';
      }
    });
  } else {
    const customVal = prompt('กรุณากรอกชื่อระดับชั้น (เช่น ม.1, ปวช.2):');
    if (customVal && customVal.trim()) {
      const val = customVal.trim();
      let opt = selectEl.querySelector(`option[value="${val}"]`);
      if (!opt) {
        opt = document.createElement('option');
        opt.value = val;
        opt.text = val;
        selectEl.appendChild(opt);
      }
      selectEl.value = val;
    } else {
      selectEl.value = '';
    }
  }
}

function openAddCourseModal() {
  document.getElementById('course-code').value = '';
  document.getElementById('course-name').value = '';
  populateGradeLevelDropdowns('course-level');
  populateTeacherDropdowns();
  openModal('modal-add-course');
}

function saveCourseForm(e) {
  e.preventDefault();
  const code = document.getElementById('course-code').value.trim();
  const name = document.getElementById('course-name').value.trim();
  const level = document.getElementById('course-level').value.trim();
  const teacher = document.getElementById('course-teacher').value.trim();

  pushData('courses', {
    code,
    name,
    level,
    teacher,
    createdAt: new Date().toISOString()
  }).then(() => {
    closeModal('modal-add-course');
    showPopupSuccess("สร้างรายวิชาสำเร็จ!", `สร้างรายวิชา ${code} ${name} เรียบร้อยแล้ว`);
    logActivity(`สร้างรายวิชาใหม่: ${code} ${name}`);
  });
}

function getYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;
  const str = url.trim();
  if (!str) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = str.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  if (str.includes('youtube.com/embed/')) {
    return str;
  }
  return null;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

function openCreateHomeworkModal() {
  document.getElementById('hw-title').value = '';
  document.getElementById('hw-desc').value = '';
  document.getElementById('hw-max-score').value = 10;
  document.getElementById('hw-due-date').value = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  document.getElementById('hw-youtube-url').value = '';
  document.getElementById('hw-img-file').value = '';

  const courseId = document.getElementById('hw-course-id') ? document.getElementById('hw-course-id').value : '';
  renderTargetClassChips('hw-target-chips-container', courseId, ['all']);

  openModal('modal-create-homework');
}

async function saveHomeworkForm(e) {
  e.preventDefault();
  const courseId = document.getElementById('hw-course-id').value;
  const targetClasses = getSelectedTargetClasses('hw-target-chips-container');
  const targetClass = targetClasses.join(', ');
  const title = document.getElementById('hw-title').value.trim();
  const desc = document.getElementById('hw-desc').value.trim();
  const maxScore = parseInt(document.getElementById('hw-max-score').value) || 10;
  const dueDate = document.getElementById('hw-due-date').value;
  const youtubeUrl = document.getElementById('hw-youtube-url').value.trim();
  const imgFile = document.getElementById('hw-img-file').files[0];

  const btnSave = document.getElementById('btn-save-hw');
  btnSave.disabled = true;
  btnSave.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกการบ้าน...`;

  let pdfs = null;
  let imageUrl = null;

  if (imgFile) {
    // Convert to Base64 Data URL via FileReader (data:application/pdf;base64,...)
    const base64Data = await readFileAsBase64(imgFile);
    imageUrl = base64Data;
    pdfs = [{ name: imgFile.name, url: base64Data, size: imgFile.size }];
  }

  const newHw = {
    courseId,
    targetClasses,
    targetClass,
    title,
    desc,
    maxScore,
    dueDate,
    youtubeUrl: youtubeUrl || null,
    imageUrl,
    pdfs,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.name
  };

  pushData('homework', newHw).then((newKey) => {
    btnSave.disabled = false;
    btnSave.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ประกาศการบ้าน`;
    closeModal('modal-create-homework');

    // Backup to local client cache (localStorage)
    if (newKey) {
      homeworkData[newKey] = newHw;
      try {
        localStorage.setItem('ag_homework', JSON.stringify(homeworkData));
      } catch (e) {}
    }

    showPopupSuccess("ประกาศการบ้านสำเร็จ!", `มอบหมายการบ้าน ${title} และบันทึกไฟล์เอกสารเรียบร้อยแล้ว`);
    logActivity(`สั่งการบ้านใหม่: ${title}`);
  });
}

function renderCoursesList() {
  const container = document.getElementById('courses-list-container');
  const courseKeys = Object.keys(coursesData);

  if (courseKeys.length === 0) {
    container.innerHTML = `<p class="text-muted" style="text-align:center; padding:30px;">ยังไม่มีรายวิชาในระบบ</p>`;
    return;
  }

  let html = '';
  courseKeys.forEach(courseId => {
    const course = coursesData[courseId];
    
    // Find homeworks for this course
    const courseHws = Object.keys(homeworkData)
      .filter(hwId => {
        const hw = homeworkData[hwId];
        if (hw.courseId !== courseId) return false;

        // Target classroom visibility filter for students
        if (currentUser && currentUser.role === 'student') {
          const studentClass = (currentUser.classLevel || '').trim();
          const targets = hw.targetClasses || (hw.targetClass ? hw.targetClass.split(',').map(s => s.trim()) : ['all']);
          if (!targets.includes('all') && targets.length > 0 && !targets.includes(studentClass)) {
            return false;
          }
        }
        return true;
      })
      .map(hwId => ({ id: hwId, ...homeworkData[hwId] }));

    html += `
      <div style="background:#ffffff; border:1px solid var(--border); border-radius:16px; padding:22px; margin-bottom:24px; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
          <div>
            <span class="badge badge-purple" style="font-size:0.9rem;">${course.code}</span>
            <h3 style="font-size:1.4rem; font-weight:700; color:#0f172a; margin-top:4px;">${course.name} (ระดับชั้น ${course.level})</h3>
            <div style="font-size:0.88rem; color:var(--text-muted);"><i class="fa-solid fa-chalkboard-user"></i> ครูผู้สอน: ${course.teacher}</div>
          </div>
          ${(currentUser && currentUser.role !== 'student') ? `
            <div style="display:flex; gap:8px;">
              <button class="btn btn-sm btn-outline-primary" onclick="openEditCourseModal('${courseId}')"><i class="fa-solid fa-pen-to-square"></i> แก้ไขวิชา</button>
              <button class="btn btn-sm btn-danger" onclick="deleteCourse('${courseId}')"><i class="fa-solid fa-trash"></i> ลบวิชา</button>
            </div>
          ` : ''}
        </div>

        <h4 style="font-size:1.1rem; font-weight:700; color:#334155; margin-bottom:12px; display:flex; align-items:center; gap:8px;">
          <i class="fa-solid fa-list-check" style="color:var(--primary);"></i> รายการการบ้านที่มอบหมาย (${courseHws.length} ชิ้น)
        </h4>
    `;

    if (courseHws.length === 0) {
      html += `<p class="text-muted" style="font-size:0.95rem; padding:10px 0;">ยังไม่มีการบ้านในวิชานี้ (หรือไม่มีงานที่มอบหมายให้ห้องของคุณ)</p>`;
    } else {
      html += `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:16px;">`;
      courseHws.forEach(hw => {
        const studentSub = (submissionsData[hw.id] && currentUser.studentId) 
          ? submissionsData[hw.id][currentUser.studentId] 
          : null;
        
        const subCount = submissionsData[hw.id] ? Object.keys(submissionsData[hw.id]).length : 0;
        
        // Extract PDF / Attachment file info
        let fileUrl = null;
        let fileName = hw.title || 'เอกสารคำสั่งงาน';
        if (hw.pdfs && Array.isArray(hw.pdfs) && hw.pdfs.length > 0 && hw.pdfs[0].url) {
          fileUrl = hw.pdfs[0].url;
          if (hw.pdfs[0].name) fileName = hw.pdfs[0].name;
        } else if (hw.imageUrl) {
          fileUrl = hw.imageUrl;
        }

        const isPdf = fileUrl && (fileUrl.includes('application/pdf') || fileUrl.includes('.pdf') || fileUrl.toLowerCase().includes('pdf'));
        const targets = hw.targetClasses || (hw.targetClass ? hw.targetClass.split(',').map(s => s.trim()) : ['all']);
        const isTargetAll = targets.includes('all') || targets.length === 0;
        const targetLabel = isTargetAll ? 'ทุกห้อง' : 'ห้อง ' + targets.join(', ');
        const embedUrl = getYouTubeEmbedUrl(hw.youtubeUrl);

        html += `
          <div style="background:#f8fafc; border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:6px;">
                <h5 style="font-size:1.1rem; font-weight:700; color:#0f172a;">${hw.title}</h5>
                <div style="display:flex; gap:6px; flex-wrap:wrap;">
                  <span class="badge ${isTargetAll ? 'badge-purple' : 'badge-yellow'}" style="font-size:0.78rem;">
                    <i class="fa-solid fa-users-rectangle"></i> ${targetLabel}
                  </span>
                  <span class="badge badge-blue">เต็ม ${hw.maxScore} คะแนน</span>
                </div>
              </div>
              <p style="font-size:0.92rem; color:var(--text-main); margin:8px 0;">${hw.desc || '-'}</p>

              ${embedUrl ? `
                <div style="margin:10px 0; border-radius:10px; overflow:hidden; border:1px solid var(--border); box-shadow:var(--shadow-sm); background:#000;">
                  <div style="position:relative; padding-bottom:56.25%; height:0;">
                    <iframe src="${embedUrl}" title="${hw.title || 'YouTube video'}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                  </div>
                </div>
              ` : ''}
              
              ${fileUrl ? `
                <div style="margin:10px 0;">
                  <button type="button" class="btn btn-sm ${isPdf ? 'btn-outline-danger' : 'btn-outline-primary'}" onclick="showPDFPreviewModal('${fileUrl.replace(/'/g, "\\'")}', '${fileName.replace(/'/g, "\\'")}')" style="display:inline-flex; align-items:center; gap:8px; font-weight:600; padding:6px 14px; border-radius:8px;">
                    <i class="${isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}" style="color:${isPdf ? '#ef4444' : '#2563eb'}; font-size:1.1rem;"></i> 
                    <span>📄 เอกสารแนบ ${isPdf ? 'PDF' : 'รูปภาพ'} (${fileName})</span>
                  </button>
                </div>
              ` : ''}

              <div style="font-size:0.82rem; color:var(--text-muted); margin-top:8px;">
                <i class="fa-solid fa-calendar"></i> กำหนดส่ง: ${hw.dueDate}
              </div>
            </div>

            <div style="margin-top:14px; padding-top:12px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
              ${currentUser.role === 'student' ? `
                ${studentSub ? `
                  <span class="badge badge-green"><i class="fa-solid fa-check"></i> ส่งแล้ว (${studentSub.score !== undefined ? studentSub.score + ' คะแนน' : 'รอตรวจ'})</span>
                ` : `
                  <button class="btn btn-sm btn-primary" onclick="openSubmitHomeworkModal('${hw.id}')">
                    <i class="fa-solid fa-paper-plane"></i> ส่งงาน
                  </button>
                `}
              ` : `
                <span class="badge badge-purple">ส่งแล้ว ${subCount} คน</span>
                <div style="display:flex; gap:6px;">
                  <button class="btn btn-sm btn-outline-primary" onclick="openEditHomeworkModal('${hw.id}')" title="แก้ไขการบ้าน"><i class="fa-solid fa-pen-to-square"></i> แก้ไข</button>
                  <button class="btn btn-sm btn-danger" onclick="deleteHomework('${hw.id}')" title="ลบการบ้าน"><i class="fa-solid fa-trash"></i> ลบ</button>
                  <button class="btn btn-sm btn-secondary" onclick="openGradeSubmissionsModal('${hw.id}')" title="ตรวจงานนักเรียน"><i class="fa-solid fa-pen-to-square"></i> ตรวจงาน</button>
                </div>
              `}
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    html += `</div>`;
  });

  container.innerHTML = html;
}

function deleteCourse(courseId) {
  if (!currentUser || currentUser.role === 'student') {
    showPopupError("ไม่มีสิทธิ์ดำเนินการ", "นักเรียนไม่มีสิทธิ์ลบรายวิชา");
    return;
  }
  showPopupConfirm("ยืนยันลบรายวิชา", "คุณต้องการลบรายวิชานี้และข้อมูลการบ้านทั้งหมดใช่หรือไม่?", "ลบรายวิชา", "warning").then((confirmed) => {
    if (confirmed) {
      deleteData(`courses/${courseId}`);
      showPopupSuccess("ลบรายวิชาสำเร็จ", "ลบข้อมูลรายวิชาเรียบร้อยแล้ว");
      logActivity(`ลบรายวิชา`);
    }
  });
}

function openEditCourseModal(courseId) {
  if (!currentUser || currentUser.role === 'student') {
    showPopupError("ไม่มีสิทธิ์ดำเนินการ", "นักเรียนไม่มีสิทธิ์แก้ไขรายวิชา");
    return;
  }
  const course = coursesData[courseId];
  if (!course) return;

  document.getElementById('edit-course-id').value = courseId;
  document.getElementById('edit-course-code').value = course.code || '';
  document.getElementById('edit-course-name').value = course.name || '';
  
  populateGradeLevelDropdowns('edit-course-level', course.level || '');
  populateTeacherDropdowns();

  const teacherSelect = document.getElementById('edit-course-teacher');
  if (teacherSelect) {
    const courseTeacher = (course.teacher || '').trim().replace(/^"|"$/g, '');
    if (courseTeacher) {
      let exists = Array.from(teacherSelect.options).some(opt => opt.value === courseTeacher);
      if (!exists) {
        const newOpt = document.createElement('option');
        newOpt.value = courseTeacher;
        newOpt.textContent = courseTeacher;
        teacherSelect.appendChild(newOpt);
      }
      teacherSelect.value = courseTeacher;
    }
  }

  openModal('modal-edit-course');
}

function saveEditCourseForm(e) {
  e.preventDefault();
  if (!currentUser || currentUser.role === 'student') {
    showPopupError("ไม่มีสิทธิ์ดำเนินการ", "นักเรียนไม่มีสิทธิ์แก้ไขรายวิชา");
    return;
  }
  const courseId = document.getElementById('edit-course-id').value;
  const code = document.getElementById('edit-course-code').value.trim();
  const name = document.getElementById('edit-course-name').value.trim();
  const level = document.getElementById('edit-course-level').value.trim();
  const teacher = document.getElementById('edit-course-teacher').value.trim();

  updateData(`courses/${courseId}`, {
    code,
    name,
    level,
    teacher,
    updatedAt: new Date().toISOString()
  }).then(() => {
    closeModal('modal-edit-course');
    showPopupSuccess("แก้ไขรายวิชาสำเร็จ!", `อัปเดตข้อมูลวิชา ${code} ${name} เรียบร้อยแล้ว`);
    logActivity(`แก้ไขรายวิชา: ${code} ${name}`);
  });
}

function openEditHomeworkModal(hwId) {
  const hw = homeworkData[hwId];
  if (!hw) return;

  document.getElementById('edit-hw-id').value = hwId;
  document.getElementById('edit-hw-title').value = hw.title || '';
  document.getElementById('edit-hw-desc').value = hw.desc || '';
  document.getElementById('edit-hw-max-score').value = hw.maxScore || 10;
  document.getElementById('edit-hw-due-date').value = hw.dueDate || '';
  document.getElementById('edit-hw-youtube-url').value = hw.youtubeUrl || '';
  document.getElementById('edit-hw-file').value = '';

  const selectedTargets = hw.targetClasses || (hw.targetClass ? hw.targetClass.split(',').map(s => s.trim()) : ['all']);
  renderTargetClassChips('edit-hw-target-chips-container', hw.courseId, selectedTargets);

  const currentFileDiv = document.getElementById('edit-hw-file-current');
  let currentFileUrl = null;
  let currentFileName = hw.title || 'ไฟล์แนบปัจจุบัน';
  if (hw.pdfs && Array.isArray(hw.pdfs) && hw.pdfs.length > 0 && hw.pdfs[0].url) {
    currentFileUrl = hw.pdfs[0].url;
    if (hw.pdfs[0].name) currentFileName = hw.pdfs[0].name;
  } else if (hw.imageUrl) {
    currentFileUrl = hw.imageUrl;
  }

  if (currentFileUrl) {
    const isPdf = currentFileUrl.includes('application/pdf') || currentFileUrl.includes('.pdf') || currentFileUrl.toLowerCase().includes('pdf');
    currentFileDiv.innerHTML = `
      <div style="font-size:0.88rem; color:var(--text-muted); margin-bottom:4px;">ไฟล์แนบปัจจุบัน:</div>
      <button type="button" class="btn btn-sm ${isPdf ? 'btn-outline-danger' : 'btn-outline-primary'}" onclick="showPDFPreviewModal('${currentFileUrl.replace(/'/g, "\\'")}', '${currentFileName.replace(/'/g, "\\'")}')">
        <i class="${isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}" style="color:${isPdf ? '#ef4444' : '#2563eb'};"></i> ดูตัวอย่างไฟล์แนบปัจจุบัน (${currentFileName})
      </button>
    `;
  } else {
    currentFileDiv.innerHTML = '<span style="font-size:0.85rem; color:var(--text-muted);">ยังไม่มีไฟล์แนบ</span>';
  }

  openModal('modal-edit-homework');
}

async function saveEditHomeworkForm(e) {
  e.preventDefault();
  const hwId = document.getElementById('edit-hw-id').value;
  const targetClasses = getSelectedTargetClasses('edit-hw-target-chips-container');
  const targetClass = targetClasses.join(', ');
  const title = document.getElementById('edit-hw-title').value.trim();
  const desc = document.getElementById('edit-hw-desc').value.trim();
  const maxScore = parseInt(document.getElementById('edit-hw-max-score').value) || 10;
  const dueDate = document.getElementById('edit-hw-due-date').value;
  const youtubeUrl = document.getElementById('edit-hw-youtube-url').value.trim();
  const fileInput = document.getElementById('edit-hw-file').files[0];

  const btnUpdate = document.getElementById('btn-update-hw');
  btnUpdate.disabled = true;
  btnUpdate.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...`;

  const existingHw = homeworkData[hwId] || {};
  let imageUrl = existingHw.imageUrl || null;
  let pdfs = existingHw.pdfs || null;

  if (fileInput) {
    const base64Data = await readFileAsBase64(fileInput);
    imageUrl = base64Data;
    pdfs = [{ name: fileInput.name, url: base64Data, size: fileInput.size }];
  }

  const updatedHw = {
    targetClasses,
    targetClass,
    title,
    desc,
    maxScore,
    dueDate,
    youtubeUrl: youtubeUrl || null,
    imageUrl,
    pdfs,
    updatedAt: new Date().toISOString()
  };

  updateData(`homework/${hwId}`, updatedHw).then(() => {
    btnUpdate.disabled = false;
    btnUpdate.innerHTML = `<i class="fa-solid fa-save"></i> บันทึกการแก้ไข`;
    closeModal('modal-edit-homework');

    // Backup to local client cache (localStorage)
    homeworkData[hwId] = { ...existingHw, ...updatedHw };
    try {
      localStorage.setItem('ag_homework', JSON.stringify(homeworkData));
    } catch (e) {}

    showPopupSuccess("แก้ไขการบ้านสำเร็จ!", `อัปเดตข้อมูลการบ้าน ${title} เรียบร้อยแล้ว`);
    logActivity(`แก้ไขการบ้าน: ${title}`);
  });
}

function deleteHomework(hwId) {
  const hw = homeworkData[hwId];
  const title = hw ? hw.title : 'การบ้าน';

  showPopupConfirm("ยืนยันลบการบ้าน", `คุณต้องการลบการบ้าน "${title}" ใช่หรือไม่?`, "ลบการบ้าน", "warning").then((confirmed) => {
    if (confirmed) {
      deleteData(`homework/${hwId}`);
      deleteData(`homework_submissions/${hwId}`);
      showPopupSuccess("ลบการบ้านสำเร็จ", `ลบการบ้าน "${title}" ออกจากระบบเรียบร้อยแล้ว`);
      logActivity(`ลบการบ้าน: ${title}`);
    }
  });
}

// Student Submit Homework - Live Preview & Upload Handling
let currentSelectedStudentFile = null;

function handleStudentFileSelection(input) {
  const file = input.files ? input.files[0] : null;
  const promptEl = document.getElementById('submit-dropzone-prompt');
  const previewContainer = document.getElementById('submit-preview-container');
  const statusBadge = document.getElementById('submit-file-status-badge');
  const dropzone = document.getElementById('submit-dropzone');

  if (!file) {
    clearStudentFileSelection();
    return;
  }

  currentSelectedStudentFile = file;
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2);
  const fileSizeText = file.size > 1024 * 1024 ? `${fileSizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

  if (dropzone) dropzone.classList.add('has-file');
  if (promptEl) promptEl.style.display = 'none';
  if (statusBadge) {
    statusBadge.className = isPdf ? 'badge badge-red' : 'badge badge-green';
    statusBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${isPdf ? 'เอกสาร PDF' : 'ไฟล์รูปภาพ'} (${fileSizeText})`;
  }

  if (isPdf) {
    // PDF File Selected Card
    previewContainer.style.display = 'block';
    previewContainer.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; background:#fff1f2; border:1px solid #fecdd3; padding:14px 18px; border-radius:14px; gap:12px;">
        <div style="display:flex; align-items:center; gap:14px; overflow:hidden;">
          <div style="width:46px; height:46px; border-radius:12px; background:#ef4444; color:#fff; display:flex; align-items:center; justify-content:center; font-size:1.4rem; flex-shrink:0; box-shadow:0 4px 10px rgba(239,68,68,0.25);">
            <i class="fa-solid fa-file-pdf"></i>
          </div>
          <div style="overflow:hidden;">
            <div style="font-weight:700; color:#0f172a; font-size:0.95rem; white-space:nowrap; text-overflow:ellipsis; overflow:hidden;">${file.name}</div>
            <div style="font-size:0.8rem; color:#e11d48; margin-top:2px;">เอกสาร PDF พร้อมส่ง • ${fileSizeText}</div>
          </div>
        </div>
        <button type="button" class="btn btn-sm btn-outline-danger" onclick="clearStudentFileSelection(event)" style="border-radius:8px; flex-shrink:0;">
          <i class="fa-solid fa-trash-can"></i> เปลี่ยนไฟล์
        </button>
      </div>
    `;
  } else {
    // Image Selected -> Read as Data URL & Show Instant Live Image Preview
    const reader = new FileReader();
    reader.onload = (e) => {
      previewContainer.style.display = 'block';
      previewContainer.innerHTML = `
        <div class="preview-image-card">
          <div style="width:100%; display:flex; justify-content:space-between; align-items:center; padding:4px 6px;">
            <div style="font-size:0.88rem; font-weight:700; color:#1e293b; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:70%;">
              <i class="fa-solid fa-image" style="color:var(--primary);"></i> ${file.name}
            </div>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="clearStudentFileSelection(event)" style="border-radius:8px; padding:4px 10px; font-size:0.8rem;">
              <i class="fa-solid fa-trash-can"></i> เปลี่ยนรูป
            </button>
          </div>
          <img src="${e.target.result}" class="preview-image-thumb" alt="ตัวอย่างรูปภาพที่เลือก">
          <span class="badge badge-green" style="font-size:0.78rem; font-weight:600;"><i class="fa-solid fa-check"></i> พร้อมอัปโหลดชิ้นงาน (${fileSizeText})</span>
        </div>
      `;
    };
    reader.readAsDataURL(file);
  }
}

function clearStudentFileSelection(e) {
  if (e) e.stopPropagation();
  const fileInput = document.getElementById('submit-img-file');
  if (fileInput) fileInput.value = '';
  currentSelectedStudentFile = null;

  const promptEl = document.getElementById('submit-dropzone-prompt');
  const previewContainer = document.getElementById('submit-preview-container');
  const statusBadge = document.getElementById('submit-file-status-badge');
  const dropzone = document.getElementById('submit-dropzone');

  if (dropzone) dropzone.classList.remove('has-file');
  if (promptEl) promptEl.style.display = 'flex';
  if (previewContainer) {
    previewContainer.style.display = 'none';
    previewContainer.innerHTML = '';
  }
  if (statusBadge) {
    statusBadge.className = 'badge badge-purple';
    statusBadge.innerText = 'ยังไม่ได้เลือกไฟล์';
  }
}

function openSubmitHomeworkModal(hwId) {
  const hw = homeworkData[hwId];
  if (!hw) return;

  const embedUrl = getYouTubeEmbedUrl(hw.youtubeUrl);
  
  let fileUrl = null;
  let fileName = hw.title || 'เอกสารคำสั่งงาน';
  if (hw.pdfs && Array.isArray(hw.pdfs) && hw.pdfs.length > 0 && hw.pdfs[0].url) {
    fileUrl = hw.pdfs[0].url;
    if (hw.pdfs[0].name) fileName = hw.pdfs[0].name;
  } else if (hw.imageUrl) {
    fileUrl = hw.imageUrl;
  }

  const isPdf = fileUrl && (fileUrl.includes('application/pdf') || fileUrl.includes('.pdf') || fileUrl.toLowerCase().includes('pdf'));

  let mediaHtml = '';
  if (embedUrl) {
    mediaHtml += `
      <div style="margin:12px 0; border-radius:12px; overflow:hidden; border:1px solid var(--border); background:#000; box-shadow:var(--shadow-sm);">
        <div style="position:relative; padding-bottom:56.25%; height:0;">
          <iframe src="${embedUrl}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
    `;
  }
  if (fileUrl) {
    mediaHtml += `
      <div style="margin:10px 0;">
        <button type="button" class="btn btn-sm ${isPdf ? 'btn-outline-danger' : 'btn-outline-primary'}" onclick="showPDFPreviewModal('${fileUrl.replace(/'/g, "\\'")}', '${fileName.replace(/'/g, "\\'")}')" style="display:inline-flex; align-items:center; gap:8px; font-weight:600; padding:6px 14px; border-radius:10px;">
          <i class="${isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}" style="color:${isPdf ? '#ef4444' : '#2563eb'}; font-size:1.1rem;"></i> 
          <span>📄 ดูเอกสารคำสั่งงาน (${fileName})</span>
        </button>
      </div>
    `;
  }

  document.getElementById('submit-hw-id').value = hwId;
  document.getElementById('submit-hw-details').innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:8px; margin-bottom:8px;">
      <h4 style="font-weight:800; color:#0f172a; font-size:1.2rem; margin:0;">${hw.title}</h4>
      <div style="display:flex; gap:6px; flex-wrap:wrap;">
        <span class="badge badge-blue"><i class="fa-solid fa-award"></i> เต็ม ${hw.maxScore} คะแนน</span>
        <span class="badge badge-yellow"><i class="fa-solid fa-calendar"></i> กำหนดส่ง ${hw.dueDate}</span>
      </div>
    </div>
    <div style="font-size:0.92rem; color:#334155; line-height:1.5; background:#ffffff; padding:10px 14px; border-radius:10px; border:1px solid #e2e8f0;">
      ${hw.desc || 'ไม่มีคำอธิบายเพิ่มเติม'}
    </div>
    ${mediaHtml}
  `;

  document.getElementById('submit-text-answer').value = '';
  clearStudentFileSelection();
  openModal('modal-submit-homework');
}

async function handleStudentHomeworkSubmit(e) {
  e.preventDefault();
  const hwId = document.getElementById('submit-hw-id').value;
  const textAnswer = document.getElementById('submit-text-answer').value.trim();
  const imgFile = document.getElementById('submit-img-file').files[0];

  const btnSubmit = document.getElementById('btn-do-submit-hw');
  btnSubmit.disabled = true;
  btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบีบอัดและอัปโหลดภาพ...`;

  let imageUrl = null;
  if (imgFile) {
    imageUrl = await uploadImageFile(imgFile);
  }

  btnSubmit.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึกข้อมูล...`;

  // Save submission non-conflicting key: homework_submissions/{hwId}/{studentId}
  const submissionPath = `homework_submissions/${hwId}/${currentUser.studentId}`;
  
  saveData(submissionPath, {
    studentId: currentUser.studentId,
    studentName: currentUser.name,
    classLevel: currentUser.classLevel || '',
    textAnswer,
    imageUrl,
    submittedAt: new Date().toLocaleString('th-TH'),
    status: 'submitted'
  }).then(() => {
    btnSubmit.disabled = false;
    btnSubmit.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ยืนยันการส่งงาน`;
    closeModal('modal-submit-homework');
    showPopupSuccess("ส่งการบ้านเรียบร้อย!", "ส่งการบ้านและอัปโหลดไฟล์ชิ้นงานเข้าสู่ระบบเรียบร้อยแล้ว");
    logActivity(`นักเรียน ${currentUser.name} ส่งการบ้านเรียบร้อยแล้ว`);
  });
}

// Teacher Grade Submissions
function openGradeSubmissionsModal(hwId) {
  const hw = homeworkData[hwId];
  if (!hw) return;

  document.getElementById('grade-hw-title').innerText = `${hw.title} (คะแนนเต็ม ${hw.maxScore} คะแนน)`;
  const tbody = document.getElementById('grade-submissions-body');
  
  const hwSubs = submissionsData[hwId] || {};
  const studentKeys = Object.keys(hwSubs);

  if (studentKeys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;" class="text-muted">ยังไม่มีนักเรียนส่งงานชิ้นนี้</td></tr>`;
  } else {
    let html = '';
    studentKeys.forEach(studentId => {
      const sub = hwSubs[studentId];
      const currentScore = sub.score !== undefined ? sub.score : '';
      const currentComment = sub.comment !== undefined ? sub.comment : '';

      html += `
        <tr>
          <td>
            <strong>${sub.studentName}</strong>
            <div style="font-size:0.8rem; color:var(--text-muted);">${sub.studentId} (${sub.classLevel})</div>
          </td>
          <td style="font-size:0.85rem;">${sub.submittedAt}</td>
          <td>
            <div>${sub.textAnswer || '-'}</div>
            ${sub.imageUrl ? `
              <button type="button" class="btn btn-sm btn-outline-primary" style="margin-top:4px;" onclick="showPDFPreviewModal('${sub.imageUrl.replace(/'/g, "\\'")}', '${sub.studentName.replace(/'/g, "\\'")}')">
                <i class="${(sub.imageUrl.includes('.pdf') || sub.imageUrl.includes('data:application/pdf')) ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}"></i> ดูไฟล์แนบชิ้นงาน
              </button>
            ` : ''}
          </td>
          <td>
            <input type="number" id="grade-score-${hwId}-${studentId}" class="form-control" style="padding:4px 8px; width:100px;" min="0" max="${hw.maxScore}" value="${currentScore}">
          </td>
          <td>
            <input type="text" id="grade-comment-${hwId}-${studentId}" class="form-control" style="padding:4px 8px;" placeholder="ข้อเสนอแนะ..." value="${currentComment}">
          </td>
          <td>
            <button type="button" class="btn btn-sm btn-success" onclick="saveSubmissionGrade('${hwId}', '${studentId}')">
              <i class="fa-solid fa-check"></i> บันทึก
            </button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  openModal('modal-grade-submissions');
}

function saveSubmissionGrade(hwId, studentId) {
  const scoreVal = document.getElementById(`grade-score-${hwId}-${studentId}`).value;
  const commentVal = document.getElementById(`grade-comment-${hwId}-${studentId}`).value.trim();

  if (scoreVal === '') {
    showPopupWarning("กรุณากรอกคะแนน", "กรุณากรอกคะแนนตัวเลขให้ถูกต้องก่อนบันทึก");
    return;
  }

  const scoreNum = parseFloat(scoreVal);
  updateData(`homework_submissions/${hwId}/${studentId}`, {
    score: scoreNum,
    comment: commentVal,
    gradedAt: new Date().toLocaleString('th-TH'),
    gradedBy: currentUser.name
  }).then(() => {
    showPopupSuccess("บันทึกคะแนนเรียบร้อย", "บันทึกผลการตรวจชิ้นงานเรียบร้อยแล้ว");
  });
}


/* -------------------------------------------------------------
   7. QUIZ / EXAM BUILDER & RUNNER
------------------------------------------------------------- */
function renderQuizQuestionsBuilder() {
  const container = document.getElementById('quiz-questions-builder-container');
  const quizType = document.getElementById('quiz-type').value; // 4 or 5 choices
  const choiceCount = parseInt(quizType);

  let html = '';
  quizQuestionsList.forEach((q, qIndex) => {
    html += `
      <div class="quiz-question-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
          <h5 style="font-weight:700; color:var(--primary);">ข้อที่ ${qIndex + 1}</h5>
          ${quizQuestionsList.length > 1 ? `
            <button type="button" class="btn btn-sm btn-danger" onclick="removeQuizQuestionItem(${qIndex})"><i class="fa-solid fa-trash"></i> ลบข้อนี้</button>
          ` : ''}
        </div>

        <div class="form-group">
          <label class="form-label">คำถาม ข้อที่ ${qIndex + 1} *</label>
          <input type="text" id="builder-question-${qIndex}" class="form-control" style="padding-left:14px;" value="${q.question || ''}" required placeholder="กรอกคำถาม...">
        </div>

        <div style="margin-bottom:10px; font-weight:600; font-size:0.95rem; color:#334155;">ตัวเลือกคำตอบ (ทำเครื่องหมายเลือกคำตอบที่ถูกต้อง):</div>
    `;

    const choiceLabels = choiceCount === 4 ? ['ก', 'ข', 'ค', 'ง'] : ['ก', 'ข', 'ค', 'ง', 'จ'];
    
    choiceLabels.forEach((label, cIndex) => {
      const isCorrect = q.correctIndex === cIndex;
      const choiceVal = (q.options && q.options[cIndex]) ? q.options[cIndex] : '';

      html += `
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px;">
          <input type="radio" name="builder-correct-${qIndex}" value="${cIndex}" ${isCorrect ? 'checked' : ''} style="width:20px; height:20px; accent-color:var(--primary);">
          <span style="font-weight:700; width:24px;">${label}.</span>
          <input type="text" id="builder-option-${qIndex}-${cIndex}" class="form-control" style="padding-left:14px;" value="${choiceVal}" placeholder="ข้อความตัวเลือก ${label}" required>
        </div>
      `;
    });

    html += `
        <div class="form-group" style="margin-top:12px;">
          <label class="form-label">คำอธิบายเฉลย (Explanation)</label>
          <input type="text" id="builder-explanation-${qIndex}" class="form-control" style="padding-left:14px;" value="${q.explanation || ''}" placeholder="เหตุผลคำอธิบายคำตอบที่ถูกต้อง...">
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function addQuizQuestionItem() {
  quizQuestionsList.push({ question: '', options: ['', '', '', '', ''], correctIndex: 0, explanation: '' });
  renderQuizQuestionsBuilder();
}

function removeQuizQuestionItem(index) {
  quizQuestionsList.splice(index, 1);
  renderQuizQuestionsBuilder();
}

function openCreateQuizModal() {
  quizQuestionsList = [{ question: '', options: ['', '', '', '', ''], correctIndex: 0, explanation: '' }];
  document.getElementById('quiz-title').value = '';
  document.getElementById('quiz-duration').value = 15;
  document.getElementById('quiz-pass-score').value = 50;
  renderQuizQuestionsBuilder();
  openModal('modal-create-quiz');
}

function saveQuizForm(e) {
  e.preventDefault();
  const courseId = document.getElementById('quiz-course-id').value;
  const title = document.getElementById('quiz-title').value.trim();
  const type = document.getElementById('quiz-type').value;
  const duration = parseInt(document.getElementById('quiz-duration').value) || 15;
  const passScore = parseInt(document.getElementById('quiz-pass-score').value) || 50;

  const choiceCount = parseInt(type);
  const compiledQuestions = [];

  for (let i = 0; i < quizQuestionsList.length; i++) {
    const qText = document.getElementById(`builder-question-${i}`).value.trim();
    const expText = document.getElementById(`builder-explanation-${i}`).value.trim();
    const correctRadios = document.getElementsByName(`builder-correct-${i}`);
    
    let selectedCorrectIndex = 0;
    correctRadios.forEach((r, idx) => {
      if (r.checked) selectedCorrectIndex = idx;
    });

    const optionsArr = [];
    for (let c = 0; c < choiceCount; c++) {
      const optVal = document.getElementById(`builder-option-${i}-${c}`).value.trim();
      optionsArr.push(optVal);
    }

    compiledQuestions.push({
      id: i + 1,
      question: qText,
      options: optionsArr,
      correctIndex: selectedCorrectIndex,
      explanation: expText
    });
  }

  pushData('quizzes', {
    courseId,
    title,
    type,
    duration,
    passScore,
    questions: compiledQuestions,
    createdAt: new Date().toISOString(),
    createdBy: currentUser.name
  }).then(() => {
    closeModal('modal-create-quiz');
    showPopupSuccess("สร้างแบบทดสอบสำเร็จ!", `สร้างแบบทดสอบ ${title} เรียบร้อยแล้ว`);
    logActivity(`สร้างแบบทดสอบใหม่: ${title}`);
  });
}

function renderQuizzesList() {
  const container = document.getElementById('quizzes-list-container');
  const quizKeys = Object.keys(quizzesData);

  if (quizKeys.length === 0) {
    container.innerHTML = `<p class="text-muted" style="text-align:center; padding:30px;">ยังไม่มีแบบทดสอบในระบบ</p>`;
    return;
  }

  let html = `<div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:20px;">`;
  quizKeys.forEach(quizId => {
    const q = quizzesData[quizId];
    const course = coursesData[q.courseId] || { name: 'วิชาทั่วไป' };
    const qCount = q.questions ? q.questions.length : 0;

    // Student Quiz attempt check (quiz_results/{quizId}/{studentId})
    const studentResult = (quizResultsData[quizId] && currentUser.studentId) 
      ? quizResultsData[quizId][currentUser.studentId]
      : null;

    html += `
      <div style="background:#ffffff; border:1px solid var(--border); border-radius:16px; padding:20px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <span class="badge badge-purple">${course.name}</span>
          <h4 style="font-size:1.25rem; font-weight:700; color:#0f172a; margin-top:6px;">${q.title}</h4>
          
          <div style="display:flex; gap:12px; margin:12px 0; font-size:0.9rem; color:var(--text-muted);">
            <span><i class="fa-solid fa-list-ol"></i> ${qCount} ข้อ</span>
            <span><i class="fa-solid fa-clock"></i> ${q.duration} นาที</span>
            <span><i class="fa-solid fa-bullseye"></i> ผ่านเกณฑ์ ${q.passScore}%</span>
          </div>
        </div>

        <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          ${currentUser.role === 'student' ? `
            ${studentResult ? `
              <div style="display:flex; align-items:center; gap:8px;">
                <span class="badge ${studentResult.passed ? 'badge-green' : 'badge-red'}">
                  ${studentResult.score}/${studentResult.totalScore} คะแนน (${studentResult.percentage}%)
                </span>
                <button class="btn btn-sm btn-outline-primary" onclick="viewQuizResultModal('${quizId}', '${currentUser.studentId}')">
                  เฉลย
                </button>
              </div>
            ` : `
              <button class="btn btn-sm btn-primary" onclick="startQuizRunner('${quizId}')">
                <i class="fa-solid fa-play"></i> เริ่มทำข้อสอบ
              </button>
            `}
          ` : `
            <span class="badge badge-blue">ทำแล้ว ${quizResultsData[quizId] ? Object.keys(quizResultsData[quizId]).length : 0} คน</span>
            <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${quizId}')"><i class="fa-solid fa-trash"></i> ลบ</button>
          `}
        </div>
      </div>
    `;
  });
  html += `</div>`;
  container.innerHTML = html;
}

function deleteQuiz(quizId) {
  showPopupConfirm("ยืนยันลบแบบทดสอบ", "คุณต้องการลบแบบทดสอบนี้ใช่หรือไม่?", "ลบข้อสอบ", "warning").then((confirmed) => {
    if (confirmed) {
      deleteData(`quizzes/${quizId}`);
      showPopupSuccess("ลบแบบทดสอบสำเร็จ", "ลบแบบทดสอบออกจากระบบเรียบร้อยแล้ว");
      logActivity(`ลบแบบทดสอบ`);
    }
  });
}

// Start Quiz Runner (Timer Engine)
function startQuizRunner(quizId) {
  const quiz = quizzesData[quizId];
  if (!quiz || !quiz.questions) return;

  activeQuizData = { ...quiz, id: quizId };
  quizRemainingSeconds = quiz.duration * 60;

  document.getElementById('runner-quiz-title').innerText = quiz.title;
  document.getElementById('runner-course-name').innerText = coursesData[quiz.courseId] ? coursesData[quiz.courseId].name : '';

  // Render questions
  const container = document.getElementById('quiz-runner-body');
  let html = '';
  
  const choiceLabels = parseInt(quiz.type) === 4 ? ['ก', 'ข', 'ค', 'ง'] : ['ก', 'ข', 'ค', 'ง', 'จ'];

  quiz.questions.forEach((q, idx) => {
    html += `
      <div style="background:#f8fafc; border:1px solid var(--border); border-radius:14px; padding:18px; margin-bottom:16px;">
        <h5 style="font-size:1.05rem; font-weight:700; color:#0f172a; margin-bottom:12px;">ข้อที่ ${idx + 1}. ${q.question}</h5>
    `;

    q.options.forEach((opt, oIdx) => {
      html += `
        <label class="choice-option" onclick="selectChoiceRadio(this)">
          <input type="radio" name="quiz-ans-${idx}" value="${oIdx}" class="choice-radio">
          <span><strong>${choiceLabels[oIdx]}.</strong> ${opt}</span>
        </label>
      `;
    });

    html += `</div>`;
  });

  container.innerHTML = html;

  // Start Countdown Timer
  clearInterval(activeQuizTimerInterval);
  updateTimerDisplay();
  
  activeQuizTimerInterval = setInterval(() => {
    quizRemainingSeconds--;
    updateTimerDisplay();

    if (quizRemainingSeconds <= 0) {
      clearInterval(activeQuizTimerInterval);
      showPopupWarning("หมดเวลาทำข้อสอบ", "หมดเวลาการทำแบบทดสอบ! ระบบกำลังประมวลผลคำตอบอัตโนมัติ...");
      submitQuizAnswers(false);
    }
  }, 1000);

  openModal('modal-take-quiz');
}

function selectChoiceRadio(labelEl) {
  const parent = labelEl.parentElement;
  parent.querySelectorAll('.choice-option').forEach(el => el.classList.remove('selected'));
  labelEl.classList.add('selected');
}

function updateTimerDisplay() {
  const minutes = Math.floor(quizRemainingSeconds / 60);
  const seconds = quizRemainingSeconds % 60;
  const str = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const display = document.getElementById('quiz-countdown-display');
  if (display) display.innerText = str;
}

function confirmCancelQuiz() {
  showPopupConfirm("ยกเลิกการทำข้อสอบ", "หากยกเลิกตอนนี้ คำตอบของคุณจะไม่ถูกบันทึก ยืนยันการยกเลิกหรือไม่?", "ยกเลิกทำสอบ", "warning").then((confirmed) => {
    if (confirmed) {
      clearInterval(activeQuizTimerInterval);
      closeModal('modal-take-quiz');
    }
  });
}

function submitQuizAnswers(isManual) {
  clearInterval(activeQuizTimerInterval);

  if (!activeQuizData) return;

  const questions = activeQuizData.questions;
  let earnedScore = 0;
  const userAnswersArr = [];

  questions.forEach((q, idx) => {
    const radios = document.getElementsByName(`quiz-ans-${idx}`);
    let selectedVal = -1;
    radios.forEach(r => {
      if (r.checked) selectedVal = parseInt(r.value);
    });

    userAnswersArr.push(selectedVal);
    if (selectedVal === q.correctIndex) {
      earnedScore++;
    }
  });

  const totalScore = questions.length;
  const percentage = Math.round((earnedScore / totalScore) * 100);
  const passed = percentage >= activeQuizData.passScore;

  // Save non-colliding path: quiz_results/{quizId}/{studentId}
  const resultPath = `quiz_results/${activeQuizData.id}/${currentUser.studentId}`;
  
  saveData(resultPath, {
    studentId: currentUser.studentId,
    studentName: currentUser.name,
    classLevel: currentUser.classLevel || '',
    score: earnedScore,
    totalScore: totalScore,
    percentage: percentage,
    passed: passed,
    userAnswers: userAnswersArr,
    completedAt: new Date().toLocaleString('th-TH')
  }).then(() => {
    closeModal('modal-take-quiz');
    viewQuizResultModal(activeQuizData.id, currentUser.studentId);
    logActivity(`นักเรียน ${currentUser.name} ทำแบบทดสอบ ${activeQuizData.title} ได้ ${earnedScore}/${totalScore} คะแนน`);
  });
}

// View Quiz Result & Explanations Lightbox Modal
function viewQuizResultModal(quizId, studentId) {
  const quiz = quizzesData[quizId];
  const res = (quizResultsData[quizId] && quizResultsData[quizId][studentId]) 
    ? quizResultsData[quizId][studentId]
    : null;

  if (!quiz || !res) return;

  document.getElementById('res-score-display').innerText = `${res.score} / ${res.totalScore}`;
  const badgeContainer = document.getElementById('res-status-badge');
  badgeContainer.innerHTML = res.passed 
    ? `<span class="badge badge-green" style="font-size:1.1rem; padding:6px 16px;"><i class="fa-solid fa-circle-check"></i> ผ่านเกณฑ์ (${res.percentage}%)</span>`
    : `<span class="badge badge-red" style="font-size:1.1rem; padding:6px 16px;"><i class="fa-solid fa-circle-xmark"></i> ไม่ผ่านเกณฑ์ (${res.percentage}%)</span>`;

  // Render Explanations
  const listContainer = document.getElementById('quiz-explanation-list');
  let html = '';

  const choiceLabels = parseInt(quiz.type) === 4 ? ['ก', 'ข', 'ค', 'ง'] : ['ก', 'ข', 'ค', 'ง', 'จ'];

  quiz.questions.forEach((q, idx) => {
    const userAnsIdx = res.userAnswers ? res.userAnswers[idx] : -1;
    const isCorrect = userAnsIdx === q.correctIndex;

    html += `
      <div style="background:${isCorrect ? '#f0fdf4' : '#fef2f2'}; border:1px solid ${isCorrect ? '#bbf7d0' : '#fecaca'}; border-radius:12px; padding:16px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <h5 style="font-size:1.05rem; font-weight:700; color:#0f172a;">ข้อที่ ${idx + 1}. ${q.question}</h5>
          <span class="badge ${isCorrect ? 'badge-green' : 'badge-red'}">
            ${isCorrect ? 'ถูกต้อง (+1)' : 'ตอบผิด (0)'}
          </span>
        </div>

        <div style="margin:10px 0; font-size:0.95rem;">
          <div>คำตอบของคุณ: <strong>${userAnsIdx !== -1 ? choiceLabels[userAnsIdx] + '. ' + q.options[userAnsIdx] : 'ไม่ได้ตอบ'}</strong></div>
          <div style="color:#166534; font-weight:700; margin-top:2px;">เฉลยที่ถูกต้อง: ${choiceLabels[q.correctIndex]}. ${q.options[q.correctIndex]}</div>
        </div>

        ${q.explanation ? `
          <div class="explanation-box">
            <i class="fa-solid fa-lightbulb"></i> <strong>คำอธิบายเพิ่มเติม:</strong> ${q.explanation}
          </div>
        ` : ''}
      </div>
    `;
  });

  listContainer.innerHTML = html;
  openModal('modal-quiz-result');
}


/* -------------------------------------------------------------
   8. SCORE REPORT MATRIX
------------------------------------------------------------- */
function renderScoreReports() {
  const tbody = document.getElementById('reports-table-body');
  const classFilter = document.getElementById('report-class-filter').value;
  const courseFilter = document.getElementById('report-course-filter').value;

  const stdKeys = Object.keys(studentsData);
  if (stdKeys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px;" class="text-muted">ยังไม่มีข้อมูลนักเรียน</td></tr>`;
    return;
  }

  let html = '';
  stdKeys.forEach(studentId => {
    const std = studentsData[studentId];
    if (classFilter && std.classLevel !== classFilter) return;

    // Calculate total homework score
    let totalHwEarned = 0;
    let totalHwPossible = 0;

    Object.keys(homeworkData).forEach(hwId => {
      const hw = homeworkData[hwId];
      if (courseFilter && hw.courseId !== courseFilter) return;

      totalHwPossible += hw.maxScore;
      if (submissionsData[hwId] && submissionsData[hwId][studentId] && submissionsData[hwId][studentId].score !== undefined) {
        totalHwEarned += submissionsData[hwId][studentId].score;
      }
    });

    // Calculate total quiz score
    let totalQuizEarned = 0;
    let totalQuizPossible = 0;

    Object.keys(quizzesData).forEach(qId => {
      const q = quizzesData[qId];
      if (courseFilter && q.courseId !== courseFilter) return;

      const qTotal = q.questions ? q.questions.length : 0;
      totalQuizPossible += qTotal;

      if (quizResultsData[qId] && quizResultsData[qId][studentId]) {
        totalQuizEarned += quizResultsData[qId][studentId].score;
      }
    });

    const totalEarned = totalHwEarned + totalQuizEarned;
    const totalPossible = totalHwPossible + totalQuizPossible;
    
    let percent = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0;
    let grade = '4.0';
    if (percent < 50) grade = '0.0';
    else if (percent < 55) grade = '1.0';
    else if (percent < 60) grade = '1.5';
    else if (percent < 65) grade = '2.0';
    else if (percent < 70) grade = '2.5';
    else if (percent < 75) grade = '3.0';
    else if (percent < 80) grade = '3.5';

    html += `
      <tr>
        <td><strong>${std.no || '-'}</strong></td>
        <td><code>${std.studentId}</code></td>
        <td><strong>${std.name}</strong></td>
        <td><span class="badge badge-blue">${std.classLevel || '-'}</span></td>
        <td>${totalHwEarned} / ${totalHwPossible}</td>
        <td>${totalQuizEarned} / ${totalQuizPossible}</td>
        <td><strong style="color:var(--primary); font-size:1.1rem;">${totalEarned} / ${totalPossible}</strong> (${percent}%)</td>
        <td><span class="badge ${percent >= 50 ? 'badge-green' : 'badge-red'}" style="font-size:0.95rem;">เกรด ${grade}</span></td>
      </tr>
    `;
  });

  tbody.innerHTML = html || `<tr><td colspan="8" style="text-align:center; padding:30px;" class="text-muted">ไม่พบข้อมูลตามเงื่อนไขที่เลือก</td></tr>`;
}


/* -------------------------------------------------------------
   9. USER MANAGEMENT
------------------------------------------------------------- */
function renderUsersTable() {
  const tbody = document.getElementById('users-table-body');
  const userKeys = Object.keys(usersData);

  if (userKeys.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:30px;" class="text-muted">กำลังโหลดข้อมูล...</td></tr>`;
    return;
  }

  let html = '';
  userKeys.forEach(username => {
    const u = usersData[username];
    let roleBadge = `<span class="badge badge-blue">ครู / บุคลากร</span>`;
    if (u.role === 'admin') roleBadge = `<span class="badge badge-purple">ผู้ดูแลระบบ</span>`;
    if (u.role === 'student') roleBadge = `<span class="badge badge-green">นักเรียน</span>`;

    html += `
      <tr>
        <td><code style="font-weight:bold;">${u.username}</code></td>
        <td><strong>${u.name}</strong></td>
        <td>${roleBadge}</td>
        <td>${u.classLevel ? 'ระดับชั้น ' + u.classLevel : (u.studentId ? 'รหัส ' + u.studentId : '-')}</td>
        <td style="text-align:center;">
          <button class="btn btn-sm btn-secondary" onclick="openChangePasswordModal('${u.username}')" title="เปลี่ยนรหัสผ่าน">
            <i class="fa-solid fa-key"></i> เปลี่ยนรหัส
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function openAddUserModal() {
  document.getElementById('new-username').value = '';
  document.getElementById('new-user-fullname').value = '';
  document.getElementById('new-user-password').value = '';
  openModal('modal-add-user');
}

function toggleUserFormFields() {
  // Can add dynamic field behavior if needed
}

function saveUserForm(e) {
  e.preventDefault();
  const role = document.getElementById('new-user-role').value;
  const username = document.getElementById('new-username').value.trim();
  const name = document.getElementById('new-user-fullname').value.trim();
  const password = document.getElementById('new-user-password').value.trim();

  saveData(`users/${username}`, {
    username,
    name,
    password,
    role,
    createdAt: new Date().toISOString()
  }).then(() => {
    closeModal('modal-add-user');
    showPopupSuccess("สร้างผู้ใช้สำเร็จ!", `สร้างบัญชีผู้ใช้งาน ${name} (${role}) เรียบร้อยแล้ว`);
    logActivity(`เพิ่มผู้ใช้งานใหม่: ${name} (${role})`);
  });
}

function openChangePasswordModal(username) {
  const u = usersData[username];
  if (!u) return;

  document.getElementById('change-pwd-username').value = username;
  document.getElementById('change-pwd-target-info').innerText = `ผู้ใช้งาน: ${u.name} (${u.username})`;
  document.getElementById('target-new-password').value = '';
  openModal('modal-change-password');
}

function saveChangePassword(e) {
  e.preventDefault();
  const username = document.getElementById('change-pwd-username').value;
  const newPassword = document.getElementById('target-new-password').value.trim();

  updateData(`users/${username}`, {
    password: newPassword
  }).then(() => {
    closeModal('modal-change-password');
    showPopupSuccess("เปลี่ยนรหัสผ่านสำเร็จ!", `อัปเดตรหัสผ่านใหม่สำหรับ ${username} เรียบร้อยแล้ว`);
    logActivity(`เปลี่ยนรหัสผ่านสำหรับผู้ใช้: ${username}`);
  });
}


/* -------------------------------------------------------------
   10. MODAL & INTERACTIVE PDF VIEWER UTILITIES
------------------------------------------------------------- */
function openModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.add('active');
}

function closeModal(modalId) {
  const el = document.getElementById(modalId);
  if (el) el.classList.remove('active');
}

function getPdfBlobUrl(base64DataUrl) {
  try {
    if (!base64DataUrl || !base64DataUrl.startsWith('data:application/pdf')) {
      return base64DataUrl;
    }
    const parts = base64DataUrl.split(';base64,');
    const contentType = parts[0].split(':')[1] || 'application/pdf';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    const blob = new Blob([uInt8Array], { type: contentType });
    return URL.createObjectURL(blob);
  } catch (err) {
    console.warn("Error converting base64 to blob:", err);
    return base64DataUrl;
  }
}

function showPDFPreviewModal(fileUrl, fileTitle = 'เอกสารคำสั่งงาน PDF') {
  if (!fileUrl) return;

  fileUrl = fileUrl.replace(/^http:\/\//i, 'https://');
  const isPdf = fileUrl.includes('application/pdf') || fileUrl.includes('.pdf') || fileUrl.toLowerCase().includes('pdf');

  // Title
  const titleEl = document.getElementById('file-preview-title');
  if (titleEl) {
    titleEl.innerHTML = `<i class="${isPdf ? 'fa-solid fa-file-pdf' : 'fa-solid fa-image'}" style="color:${isPdf ? '#ef4444' : '#2563eb'};"></i> ${fileTitle}`;
  }

  // URL Handling: Convert Base64 data URL to Blob URL for iframe rendering
  let displayUrl = fileUrl;
  let downloadUrl = fileUrl;

  if (fileUrl.startsWith('data:application/pdf')) {
    displayUrl = getPdfBlobUrl(fileUrl);
    downloadUrl = displayUrl;
  }

  // Setup Download & New Tab Action Buttons
  const downloadBtn = document.getElementById('file-preview-download');
  if (downloadBtn) {
    downloadBtn.href = downloadUrl;
    downloadBtn.setAttribute('download', `${fileTitle || 'document'}.pdf`);
  }

  const newtabBtn = document.getElementById('file-preview-newtab');
  if (newtabBtn) {
    newtabBtn.href = displayUrl;
  }

  const container = document.getElementById('file-preview-body');
  if (!container) return;

  if (isPdf) {
    container.innerHTML = `
      <div style="width:100%; height:75vh; border-radius:12px; overflow:hidden; border:1px solid var(--border); box-shadow:var(--shadow-sm); background:#334155;">
        <iframe src="${displayUrl}" style="width:100%; height:100%; border:none; display:block;" frameborder="0" allowfullscreen>
          <div style="padding:40px; text-align:center; color:#ffffff;">
            <i class="fa-solid fa-file-pdf fa-3x" style="color:#ef4444; margin-bottom:14px;"></i>
            <h4 style="font-weight:700;">เปิดดูเอกสาร PDF</h4>
            <p style="margin:10px 0 16px 0; color:#e2e8f0;">เบราว์เซอร์ไม่รองรับการแสดงตัวอย่างในหน้านี้</p>
            <a href="${downloadUrl}" download="${fileTitle}.pdf" class="btn btn-success"><i class="fa-solid fa-download"></i> ดาวน์โหลดเอกสาร PDF</a>
          </div>
        </iframe>
      </div>
    `;
  } else {
    // Image Preview
    container.innerHTML = `
      <img src="${fileUrl}" style="max-width:100%; max-height:75vh; object-fit:contain; border-radius:14px; box-shadow:var(--shadow-md);" alt="ตัวอย่างรูปภาพ">
    `;
  }

  openModal('modal-file-preview');
}

// Backward compatibility alias
function openFilePreviewModal(fileUrl, fileTitle) {
  showPDFPreviewModal(fileUrl, fileTitle);
}

function openLightbox(imageUrl) {
  showPDFPreviewModal(imageUrl, 'รูปภาพชิ้นงาน');
}

/* -------------------------------------------------------------
   11. LIVE DIGITAL CLOCK (Header Clock)
------------------------------------------------------------- */
function updateLiveClock() {
  const clockEl = document.getElementById('live-clock-time');
  if (!clockEl) return;
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.innerText = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateLiveClock, 1000);
updateLiveClock();

