/**
 * Krunoi Classroom 2D Educational MMORPG Engine
 * Ultra-Lightweight Firebase Realtime Multiplayer + Quiz-Driven Turn-Based Combat
 */

const RPG_CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'นักรบอัลกอริทึม',
    icon: '⚔️',
    color: '#ef4444',
    baseHp: 150,
    baseAtk: 20,
    baseDef: 15,
    baseCrit: 10,
    skillName: 'ดาบผ่าตรรกะ',
    skillDesc: 'โจมตีรุนแรง 160% และกางโล่ลดดาเมจศัตรู 40% ในเทิร์นนี้'
  },
  mage: {
    id: 'mage',
    name: 'จอมเวทโค้ดดิ้ง',
    icon: '🪄',
    color: '#8b5cf6',
    baseHp: 105,
    baseAtk: 30,
    baseDef: 8,
    baseCrit: 15,
    skillName: 'มหาเวทไบนารี',
    skillDesc: 'โจมตีเวท 165% และเพิ่มโบนัสดาเมจตามจำนวน Combo ที่ตอบถูกต่อเนื่อง'
  },
  ranger: {
    id: 'ranger',
    name: 'นักธนูไซเบอร์',
    icon: '🏹',
    color: '#10b981',
    baseHp: 115,
    baseAtk: 24,
    baseDef: 10,
    baseCrit: 35,
    skillName: 'ศรทะลวงบั๊ก',
    skillDesc: 'โอกาสติดคริติคอลสูงพิเศษ และได้เวลาคิดคำตอบเพิ่มขึ้น +5 วินาที'
  },
  paladin: {
    id: 'paladin',
    name: 'พาลาดินดาต้า',
    icon: '🛡️',
    color: '#f59e0b',
    baseHp: 135,
    baseAtk: 21,
    baseDef: 13,
    baseCrit: 12,
    skillName: 'แสงแห่งปัญญา',
    skillDesc: 'โจมตี 150% พร้อมฟื้นฟูพลังชีวิต (HP) 20% ทันทีที่ตอบถูก'
  }
};

const RPG_WEAPONS = [
  { id: 'w0', name: 'อาวุธฝึกหัดโค้ดดิ้ง', icon: '🗡️', atk: 0, crit: 0, price: 0 },
  { id: 'w1', name: 'ดาบเหล็กโฟลว์ชาร์ต', icon: '⚔️', atk: 12, crit: 3, price: 120 },
  { id: 'w2', name: 'คฑาเวทอัลกอริทึม', icon: '🪄', atk: 25, crit: 6, price: 300 },
  { id: 'w3', name: 'ธนูแสงไฟเบอร์ออปติก', icon: '🏹', atk: 42, crit: 12, price: 650 },
  { id: 'w4', name: 'ศาสตราเทพควอนตัมโค้ด', icon: '⚡', atk: 70, crit: 20, price: 1400 }
];

const RPG_ARMORS = [
  { id: 'a0', name: 'ชุดนักเรียนผู้กล้า', icon: '👕', def: 0, hp: 0, price: 0 },
  { id: 'a1', name: 'เกราะหนังไบนารี', icon: '🦺', def: 8, hp: 45, price: 120 },
  { id: 'a2', name: 'เกราะเงินไฟร์วอลล์', icon: '🛡️', def: 18, hp: 110, price: 320 },
  { id: 'a3', name: 'เกราะทองคลาวด์เซิร์ฟเวอร์', icon: '⚜️', def: 32, hp: 240, price: 750 },
  { id: 'a4', name: 'เกราะเทพแอนตี้ไวรัสสูงสุด', icon: '👑', def: 55, hp: 450, price: 1500 }
];

const RPG_MAPS = {
  town: {
    id: 'town',
    name: '🏰 เมืองเริ่มต้น (Safe Zone)',
    bgTop: '#1e3a2f',
    bgBottom: '#152e24',
    gridColor: 'rgba(52, 211, 153, 0.08)',
    isSafe: true,
    npcs: [
      { id: 'fountain', name: '⛲ น้ำพุฟื้นพลังชีวิต (แตะเพื่อเติม HP เต็ม)', icon: '⛲', x: 480, y: 250, radius: 42, type: 'heal' },
      { id: 'blacksmith', name: '🛡️ ช่างตีเหล็กไซเบอร์ (ร้านค้าอาวุธ)', icon: '⚒️', x: 230, y: 170, radius: 36, type: 'shop' },
      { id: 'monument', name: '🏆 ศิลาจารึกอันดับผู้กล้า', icon: '🏆', x: 730, y: 170, radius: 36, type: 'rank' },
      { id: 'portal_forest', name: '🌲 วาร์ปไป: ป่าผังงาน (Lv.1-10)', icon: '🌀', x: 860, y: 390, radius: 36, type: 'portal', targetMap: 'forest' }
    ],
    monsters: []
  },
  forest: {
    id: 'forest',
    name: '🌲 ป่าผังงานและอัลกอริทึม (Lv.1-10)',
    bgTop: '#14332b',
    bgBottom: '#0d231d',
    gridColor: 'rgba(16, 185, 129, 0.07)',
    isSafe: false,
    npcs: [
      { id: 'portal_town', name: '🏰 กลับเมืองเริ่มต้น', icon: '🌀', x: 85, y: 260, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_slime', name: 'สไลม์ไร้ระเบียบ (Lv.1)', icon: '🟢', level: 1, hp: 55, atk: 14, def: 3, exp: 40, gold: 28, x: 320, y: 180 },
      { id: 'm_slime2', name: 'สไลม์บั๊กเขียว (Lv.2)', icon: '🦠', level: 2, hp: 70, atk: 16, def: 4, exp: 50, gold: 34, x: 460, y: 370 },
      { id: 'm_goblin', name: 'ก็อบลินลูปไม่รู้จบ (Lv.5)', icon: '👺', level: 5, hp: 110, atk: 22, def: 7, exp: 80, gold: 52, x: 650, y: 200 },
      { id: 'm_wolf', name: 'หมาป่าตรรกะวิบัติ (Lv.8)', icon: '🐺', level: 8, hp: 160, atk: 29, def: 10, exp: 120, gold: 78, x: 800, y: 340 }
    ]
  },
  desert: {
    id: 'desert',
    name: '🏜️ หุบเขาตัวแปรและเงื่อนไข (Lv.10-25)',
    bgTop: '#3b2818',
    bgBottom: '#27190e',
    gridColor: 'rgba(245, 158, 11, 0.08)',
    isSafe: false,
    npcs: [
      { id: 'portal_town', name: '🏰 กลับเมืองเริ่มต้น', icon: '🌀', x: 85, y: 260, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_scorpion', name: 'แมงป่องตัวแปรลอย (Lv.12)', icon: '🦂', level: 12, hp: 230, atk: 38, def: 14, exp: 165, gold: 110, x: 330, y: 190 },
      { id: 'm_golem', name: 'โกเลมชนิดข้อมูล (Lv.17)', icon: '🗿', level: 17, hp: 340, atk: 48, def: 20, exp: 230, gold: 155, x: 560, y: 350 },
      { id: 'm_bat', name: 'ค้างคาวเงื่อนไขซ้อน (Lv.22)', icon: '🦇', level: 22, hp: 450, atk: 58, def: 24, exp: 310, gold: 210, x: 780, y: 220 }
    ]
  },
  castle: {
    id: 'castle',
    name: '🌋 ปราสาทจอมมารบั๊ก (Boss Dungeon Lv.25+)',
    bgTop: '#2e1021',
    bgBottom: '#180712',
    gridColor: 'rgba(239, 68, 68, 0.09)',
    isSafe: false,
    npcs: [
      { id: 'portal_town', name: '🏰 กลับเมืองเริ่มต้น', icon: '🌀', x: 85, y: 260, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_knight', name: 'อัศวินไวรัสโทรจัน (Lv.26)', icon: '👹', level: 26, hp: 580, atk: 70, def: 30, exp: 420, gold: 300, x: 390, y: 260 },
      { id: 'm_dragon', name: '👑 บอสใหญ่: มังกรซินแทกซ์เออร์เรอร์ (Lv.35)', icon: '🐉', level: 35, hp: 1000, atk: 92, def: 40, exp: 850, gold: 650, x: 740, y: 260, isBoss: true }
    ]
  }
};

// Built-in Computer Science, Flowchart, Algorithm & Programming Question Bank
const RPG_DEFAULT_QUESTIONS = [
  {
    question: 'สัญลักษณ์รูป "สี่เหลี่ยมขนมเปียกปูน (ข้าวหลามตัด)" ในผังงาน (Flowchart) หมายถึงข้อใด?',
    options: ['เริ่มต้น / สิ้นสุดการทำงาน', 'การประมวลผลหรือคำนวณ', 'การตัดสินใจ / ตรวจสอบเงื่อนไข', 'การรับข้อมูลหรือแสดงผล'],
    correctIndex: 2
  },
  {
    question: 'สัญลักษณ์ "เริ่มต้น (Start)" และ "สิ้นสุด (End)" ในผังงาน Flowchart ใช้รูปทรงใด?',
    options: ['สี่เหลี่ยมผืนผ้า', 'สี่เหลี่ยมมุมมน (แคปซูล)', 'วงกลม', 'สี่เหลี่ยมด้านขนาน'],
    correctIndex: 1
  },
  {
    question: 'ข้อใดคือความหมายของ "อัลกอริทึม (Algorithm)" ที่ถูกต้องที่สุด?',
    options: ['ลำดับขั้นตอนวิธีการแก้ปัญหาอย่างเป็นระบบ', 'ชื่ออุปกรณ์ฮาร์ดแวร์ของคอมพิวเตอร์', 'โปรแกรมสำหรับวาดรูปกราฟิก', 'ไวรัสคอมพิวเตอร์ชนิดหนึ่ง'],
    correctIndex: 0
  },
  {
    question: 'ถ้าต้องการเขียนผังงานแสดงการคำนวณ "Total = Price * Qty" ต้องใช้สัญลักษณ์รูปทรงใด?',
    options: ['รูปวงกลม (Connector)', 'รูปข้าวหลามตัด (Decision)', 'รูปสี่เหลี่ยมผืนผ้า (Process)', 'รูปห้าเหลี่ยม (Off-page)'],
    correctIndex: 2
  },
  {
    question: 'ข้อมูลชนิดใดเป็นข้อมูลประเภท "จำนวนเต็ม (Integer)"?',
    options: ['"Hello World"', '3.14159', '42', 'True'],
    correctIndex: 2
  },
  {
    question: 'นิพจน์ทางตรรกศาสตร์ (10 > 5) AND (3 == 3) มีผลลัพธ์เป็นข้อใด?',
    options: ['จริง (True)', 'เท็จ (False)', 'Error', '0'],
    correctIndex: 0
  },
  {
    question: 'ในการออกแบบอัลกอริทึม แนวคิด "การแยกย่อยปัญหา (Decomposition)" มีประโยชน์อย่างไร?',
    options: ['ทำให้คอมพิวเตอร์กินไฟน้อยลง', 'แบ่งปัญหาใหญ่ที่ซับซ้อนออกเป็นส่วนย่อยๆ ที่แก้ได้ง่ายขึ้น', 'ลบข้อมูลที่ไม่จำเป็นออกจากฮาร์ดดิสก์', 'เปลี่ยนภาษาไทยเป็นภาษาอังกฤษ'],
    correctIndex: 1
  },
  {
    question: 'โครงสร้างควบคุมแบบใดที่ใช้สำหรับการทำงานซ้ำๆ จนกว่าเงื่อนไขจะเป็นเท็จ?',
    options: ['แบบลำดับ (Sequence)', 'แบบทางเลือก (Selection)', 'แบบวนซ้ำ (Loop / Iteration)', 'แบบข้ามขั้นตอน'],
    correctIndex: 2
  },
  {
    question: 'ถ้ากำหนดให้ X = 10 แล้วทำคำสั่ง X = X + 5 ค่าสุดท้ายของ X คือเท่าไร?',
    options: ['5', '10', '15', '50'],
    correctIndex: 2
  },
  {
    question: 'สัญลักษณ์ "ลูกศร (Flowline)" ในผังงาน Flowchart มีหน้าที่อะไร?',
    options: ['ใช้ตกแต่งให้ผังงานสวยงาม', 'บอกทิศทางการไหลหรือลำดับการทำงานของผังงาน', 'ใช้แทนการคูณและหาร', 'ใช้เชื่อมต่อไปหน้าเว็บไซต์อื่น'],
    correctIndex: 1
  },
  {
    question: 'รหัสจำลอง (Pseudocode) มีจุดประสงค์หลักเพื่ออะไร?',
    options: ['เขียนอธิบายขั้นตอนอัลกอริทึมด้วยข้อความที่เข้าใจง่ายก่อนนำไปเขียนโปรแกรมจริง', 'เข้ารหัสลับเพื่อป้องกันแฮกเกอร์', 'บีบอัดไฟล์รูปภาพให้มีขนาดเล็กลง', 'ตั้งรหัสผ่านเข้าเครื่องคอมพิวเตอร์'],
    correctIndex: 0
  },
  {
    question: 'หากต้องการรับค่าคะแนนสอบจากผู้ใช้ผ่านแป้นพิมพ์ ในผังงานควรใช้สัญลักษณ์กลุ่มใด?',
    options: ['การประมวลผล (Process)', 'การรับข้อมูล / นำเข้าข้อมูล (Input)', 'จุดเชื่อมต่อ (Connector)', 'การตัดสินใจ (Decision)'],
    correctIndex: 1
  }
];

// RPG Runtime State
const rpgState = {
  isActiveView: false,
  listenersAttached: false,
  animFrameId: null,
  serverSettings: {
    isOpen: true,
    quizSource: 'all'
  },
  allCharacters: {},
  onlinePlayers: {},
  hero: null,
  currentMap: 'town',
  localX: 480,
  localY: 320,
  targetX: 480,
  targetY: 320,
  facing: 1, // 1 = right, -1 = left
  moveDirX: 0,
  moveDirY: 0,
  keysPressed: {},
  chatBubbleText: '',
  chatBubbleExpire: 0,
  lastSyncTime: 0,
  onlineRef: null,
  onlineRoomListenerRef: null,
  mapMonsters: [],
  floatingTexts: [],
  // Combat State
  inCombat: false,
  activeMonster: null,
  monsterHp: 0,
  monsterMaxHp: 0,
  pendingSkillMode: 'normal',
  activeQuestion: null,
  combatCombo: 0,
  quizTimerInterval: null,
  quizRemainingSec: 20
};

function getRpgPlayerId() {
  if (!currentUser) return 'guest';
  return currentUser.studentId || currentUser.username || 'admin';
}

function getRpgRoomKey() {
  if (!currentUser) return 'global';
  const rawClass = (currentUser.classLevel || 'global').trim();
  // Sanitize Firebase key (no ., #, $, [, ], /)
  return rawClass.replace(/[.#$\[\]\/]/g, '_') || 'global';
}

function initRpgFirebaseListeners() {
  if (rpgState.listenersAttached) return;
  rpgState.listenersAttached = true;

  listenToData('rpg_settings', (data) => {
    if (data) {
      rpgState.serverSettings = {
        isOpen: data.isOpen !== false,
        quizSource: data.quizSource || 'all'
      };
    }
    updateRpgServerStatusUI();
  });

  listenToData('rpg_characters', (data) => {
    rpgState.allCharacters = data || {};
    const myId = getRpgPlayerId();
    if (rpgState.allCharacters[myId]) {
      rpgState.hero = rpgState.allCharacters[myId];
      if (rpgState.isActiveView) {
        updateRpgHudUI();
      }
    }
  });
}

window.onEnterRpgGameView = function() {
  rpgState.isActiveView = true;
  initRpgFirebaseListeners();
  initRpgCanvasControls();
  populateRpgQuizSourceDropdown();

  const myId = getRpgPlayerId();
  rpgState.hero = rpgState.allCharacters[myId] || null;

  updateRpgServerStatusUI();
  spawnMapMonsters(rpgState.currentMap);
  subscribeToRoomOnlinePlayers();
  startRpgGameLoop();
};

window.onLeaveRpgGameView = function() {
  rpgState.isActiveView = false;
  if (rpgState.animFrameId) {
    cancelAnimationFrame(rpgState.animFrameId);
    rpgState.animFrameId = null;
  }
  clearRpgQuizTimer();
  removePlayerOnlinePresence();
};

function subscribeToRoomOnlinePlayers() {
  const roomKey = getRpgRoomKey();
  if (rpgState.onlineRoomListenerRef) {
    try { rpgState.onlineRoomListenerRef.off(); } catch (e) {}
  }
  rpgState.onlineRoomListenerRef = listenToData(`rpg_online/${roomKey}`, (data) => {
    rpgState.onlinePlayers = data || {};
    const count = Object.keys(rpgState.onlinePlayers).length || 1;
    const badge = document.getElementById('rpg-online-count-badge');
    if (badge) {
      badge.innerHTML = `<i class="fa-solid fa-users"></i> ออนไลน์ ${count} คน`;
    }
  });
}

function syncPlayerOnlinePresence(force = false) {
  if (!rpgState.isActiveView || !rpgState.hero || !db) return;
  const now = Date.now();
  if (!force && now - rpgState.lastSyncTime < 750) return;
  rpgState.lastSyncTime = now;

  const roomKey = getRpgRoomKey();
  const myId = getRpgPlayerId();
  const path = `rpg_online/${roomKey}/${myId}`;
  const ref = db.ref(path);

  try {
    ref.onDisconnect().remove();
  } catch (e) {}

  ref.set({
    id: myId,
    name: rpgState.hero.name || currentUser?.name || 'ผู้กล้า',
    job: rpgState.hero.job || 'warrior',
    level: rpgState.hero.level || 1,
    map: rpgState.currentMap || 'town',
    x: Math.round(rpgState.localX),
    y: Math.round(rpgState.localY),
    facing: rpgState.facing,
    chat: rpgState.chatBubbleExpire > now ? rpgState.chatBubbleText : '',
    updatedAt: now
  });
}

function removePlayerOnlinePresence() {
  if (!db || !currentUser) return;
  const roomKey = getRpgRoomKey();
  const myId = getRpgPlayerId();
  try {
    db.ref(`rpg_online/${roomKey}/${myId}`).remove();
  } catch (e) {}
}

function updateRpgServerStatusUI() {
  const isStudent = currentUser && currentUser.role === 'student';
  const isOpen = rpgState.serverSettings.isOpen !== false;

  const btnToggle = document.getElementById('btn-rpg-toggle-server');
  if (btnToggle) {
    btnToggle.style.background = isOpen ? '#10b981' : '#ef4444';
    btnToggle.innerHTML = isOpen
      ? `<i class="fa-solid fa-circle-check"></i> สถานะเกม: เปิดให้นักเรียนเข้าเล่น`
      : `<i class="fa-solid fa-lock"></i> สถานะเกม: ปิดพักการเล่นชั่วคราว`;
  }

  const selectEl = document.getElementById('rpg-quiz-source-select');
  if (selectEl && rpgState.serverSettings.quizSource) {
    selectEl.value = rpgState.serverSettings.quizSource;
  }

  const closedBanner = document.getElementById('rpg-server-closed-banner');
  const createScreen = document.getElementById('rpg-create-char-screen');
  const mainStage = document.getElementById('rpg-main-stage');

  if (isStudent && !isOpen) {
    if (closedBanner) closedBanner.style.display = 'block';
    if (createScreen) createScreen.style.display = 'none';
    if (mainStage) mainStage.style.display = 'none';
    return;
  }

  if (closedBanner) closedBanner.style.display = 'none';

  if (!rpgState.hero) {
    if (createScreen) createScreen.style.display = 'block';
    if (mainStage) mainStage.style.display = 'none';
  } else {
    if (createScreen) createScreen.style.display = 'none';
    if (mainStage) mainStage.style.display = 'block';
    updateRpgHudUI();
  }
}

function populateRpgQuizSourceDropdown() {
  const selectEl = document.getElementById('rpg-quiz-source-select');
  if (!selectEl) return;

  let html = `<option value="all">-- รวมข้อสอบปรนัยในระบบ + คลังโจทย์คอมพิวเตอร์ --</option>`;
  html += `<option value="builtin">เฉพาะคลังโจทย์มาตรฐานในเกม (Flowchart & อัลกอริทึม)</option>`;

  Object.keys(quizzesData || {}).forEach(qId => {
    const q = quizzesData[qId];
    if (q && q.questions && q.questions.some(item => item.qType !== 'subjective')) {
      html += `<option value="${qId}">ข้อสอบ: ${q.title}</option>`;
    }
  });

  selectEl.innerHTML = html;
  if (rpgState.serverSettings.quizSource) {
    selectEl.value = rpgState.serverSettings.quizSource;
  }
}

function toggleRpgServerStatus() {
  const nextState = !(rpgState.serverSettings.isOpen !== false);
  updateData('rpg_settings', {
    isOpen: nextState,
    updatedAt: new Date().toISOString()
  }).then(() => {
    showPopupSuccess(
      nextState ? "เปิดเซิร์ฟเวอร์เกมแล้ว!" : "พักการเล่นเกมชั่วคราวแล้ว",
      nextState ? "นักเรียนสามารถเข้าสู่โลกผจญภัย RPG เพื่อเก็บเลเวลได้ทันที" : "ระบบซ่อนหน้าจอเกมของนักเรียนชั่วคราวเพื่อให้ตั้งใจเรียน"
    );
  });
}

function changeRpgQuizSource(quizId) {
  updateData('rpg_settings', {
    quizSource: quizId
  });
}

function giveRpgClassBonusReward() {
  const charKeys = Object.keys(rpgState.allCharacters);
  if (charKeys.length === 0) {
    showPopupWarning("ยังไม่มีผู้กล้า", "ยังไม่มีนักเรียนสร้างตัวละครในระบบเกม");
    return;
  }

  showPopupConfirm(
    "แจกโบนัสผู้กล้าทุกคน?",
    `ต้องการมอบโบนัสพิเศษ +100 EXP และ +100 Gold ให้ตัวละครนักเรียนทุกคน (${charKeys.length} คน) หรือไม่?`,
    "แจกโบนัสทันที",
    () => {
      charKeys.forEach(id => {
        const ch = rpgState.allCharacters[id];
        if (ch) {
          addRpgExpAndGoldToCharacterObject(ch, 100, 100);
          saveData(`rpg_characters/${id}`, ch);
        }
      });
      showPopupSuccess("แจกโบนัสสำเร็จ!", `มอบ +100 EXP และ +100 Gold ให้ผู้กล้าทั้งหมด ${charKeys.length} คนเรียบร้อยแล้ว`);
    }
  );
}

// Character Creation & Stats Calculation
function selectRpgHeroClass(jobId) {
  const cls = RPG_CLASSES[jobId] || RPG_CLASSES.warrior;
  const myId = getRpgPlayerId();
  const existing = rpgState.allCharacters[myId];

  const heroObj = existing ? {
    ...existing,
    job: cls.id
  } : {
    id: myId,
    name: currentUser?.name || 'ผู้กล้า',
    classLevel: (currentUser?.classLevel || 'ห้องเรียน').trim(),
    job: cls.id,
    level: 1,
    exp: 0,
    gold: 100,
    statPoints: 0,
    str: 0,
    vit: 0,
    luk: 0,
    weaponId: 'w0',
    armorId: 'a0',
    claimedHwScore: 0,
    monstersDefeated: 0
  };

  const stats = computeRpgHeroTotalStats(heroObj);
  heroObj.hp = stats.maxHp;

  rpgState.hero = heroObj;
  saveData(`rpg_characters/${myId}`, heroObj).then(() => {
    updateRpgServerStatusUI();
    syncPlayerOnlinePresence(true);
    showPopupSuccess(
      `ต้อนรับ ${cls.name}!`,
      `เข้าสู่โลกผจญภัยเรียบร้อย ใช้ปุ่มลูกศร หรือแตะบนแผนที่เพื่อเดินสำรวจและโจมตีมอนสเตอร์ได้เลย!`
    );
  });
}

function openRpgChangeClassScreen() {
  const createScreen = document.getElementById('rpg-create-char-screen');
  const mainStage = document.getElementById('rpg-main-stage');
  if (createScreen) createScreen.style.display = 'block';
  if (mainStage) mainStage.style.display = 'none';
}

function computeRpgHeroTotalStats(hero) {
  if (!hero) return { maxHp: 100, atk: 20, def: 10, crit: 10, nextExp: 100 };
  const cls = RPG_CLASSES[hero.job] || RPG_CLASSES.warrior;
  const weapon = RPG_WEAPONS.find(w => w.id === hero.weaponId) || RPG_WEAPONS[0];
  const armor = RPG_ARMORS.find(a => a.id === hero.armorId) || RPG_ARMORS[0];
  const lvl = Math.max(1, hero.level || 1);

  const maxHp = cls.baseHp + (lvl - 1) * 22 + (hero.vit || 0) * 18 + armor.hp;
  const atk = cls.baseAtk + (lvl - 1) * 4 + (hero.str || 0) * 4 + weapon.atk;
  const def = cls.baseDef + (lvl - 1) * 2 + (hero.vit || 0) * 2 + armor.def;
  const crit = Math.min(75, cls.baseCrit + (hero.luk || 0) * 3 + weapon.crit);
  const nextExp = lvl * 100;

  return { maxHp, atk, def, crit, nextExp, cls, weapon, armor };
}

function addRpgExpAndGoldToCharacterObject(hero, addExp, addGold) {
  hero.exp = (hero.exp || 0) + addExp;
  hero.gold = (hero.gold || 0) + addGold;
  let leveledUp = false;

  while (hero.exp >= (hero.level || 1) * 100) {
    const needed = (hero.level || 1) * 100;
    hero.exp -= needed;
    hero.level = (hero.level || 1) + 1;
    hero.statPoints = (hero.statPoints || 0) + 3;
    leveledUp = true;
  }

  const stats = computeRpgHeroTotalStats(hero);
  if (leveledUp) {
    hero.hp = stats.maxHp;
  }
  return leveledUp;
}

function updateRpgHudUI() {
  if (!rpgState.hero) return;
  const hero = rpgState.hero;
  const stats = computeRpgHeroTotalStats(hero);

  if (hero.hp === undefined || hero.hp > stats.maxHp) {
    hero.hp = stats.maxHp;
  }

  const avatarEl = document.getElementById('rpg-hud-avatar');
  const nameEl = document.getElementById('rpg-hud-name');
  const lvlEl = document.getElementById('rpg-hud-level');
  const jobEl = document.getElementById('rpg-hud-job');
  const hpBar = document.getElementById('rpg-hud-hp-bar');
  const hpText = document.getElementById('rpg-hud-hp-text');
  const expBar = document.getElementById('rpg-hud-exp-bar');
  const expText = document.getElementById('rpg-hud-exp-text');
  const atkEl = document.getElementById('rpg-hud-atk');
  const defEl = document.getElementById('rpg-hud-def');
  const critEl = document.getElementById('rpg-hud-crit');
  const goldEl = document.getElementById('rpg-hud-gold');
  const ptsBadge = document.getElementById('rpg-stat-pts-badge');

  if (avatarEl) avatarEl.innerText = stats.cls.icon;
  if (nameEl) nameEl.innerText = hero.name;
  if (lvlEl) lvlEl.innerText = `Lv.${hero.level || 1}`;
  if (jobEl) jobEl.innerText = `${stats.cls.name} (${stats.weapon.icon})`;

  const hpPct = Math.max(0, Math.min(100, Math.round((hero.hp / stats.maxHp) * 100)));
  if (hpBar) hpBar.style.width = `${hpPct}%`;
  if (hpText) hpText.innerText = `HP ${Math.max(0, Math.round(hero.hp))}/${stats.maxHp}`;

  const expPct = Math.max(0, Math.min(100, Math.round(((hero.exp || 0) / stats.nextExp) * 100)));
  if (expBar) expBar.style.width = `${expPct}%`;
  if (expText) expText.innerText = `EXP ${hero.exp || 0}/${stats.nextExp}`;

  if (atkEl) atkEl.innerText = stats.atk;
  if (defEl) defEl.innerText = stats.def;
  if (critEl) critEl.innerText = `${stats.crit}%`;
  if (goldEl) goldEl.innerText = hero.gold || 0;

  if (ptsBadge) {
    if ((hero.statPoints || 0) > 0) {
      ptsBadge.style.display = 'inline-block';
      ptsBadge.innerText = `+${hero.statPoints}`;
    } else {
      ptsBadge.style.display = 'none';
    }
  }
}

// Sync Real Classroom Homework & Quiz Scores into Game EXP & Gold!
function claimRpgHomeworkBonus() {
  if (!rpgState.hero || !currentUser) return;
  const studentId = currentUser.studentId || currentUser.username;

  let totalRealScore = 0;
  // Sum graded homework scores
  Object.keys(submissionsData || {}).forEach(hwId => {
    const sub = submissionsData[hwId]?.[studentId];
    if (sub && sub.score !== undefined && sub.score !== '' && !isNaN(Number(sub.score))) {
      totalRealScore += Number(sub.score);
    }
  });
  // Sum graded quiz scores
  Object.keys(quizResultsData || {}).forEach(qId => {
    const qRes = quizResultsData[qId]?.[studentId];
    if (qRes && qRes.isGraded !== false && qRes.score !== undefined && qRes.score !== '' && !isNaN(Number(qRes.score))) {
      totalRealScore += Number(qRes.score);
    }
  });

  totalRealScore = Math.round(totalRealScore * 10) / 10;
  const alreadyClaimed = rpgState.hero.claimedHwScore || 0;
  const newPoints = Math.round((totalRealScore - alreadyClaimed) * 10) / 10;

  if (newPoints <= 0) {
    showPopupWarning(
      "ซิงก์คะแนนล่าสุดแล้ว",
      `คะแนนการบ้านและข้อสอบสะสมของคุณ (${totalRealScore} คะแนน) ถูกรับเป็นโบนัสในเกมครบแล้ว ส่งการบ้านหรือทำแบบทดสอบเพิ่มเพื่อรับโบนัสใหม่ได้เลย!`
    );
    return;
  }

  const bonusExp = Math.round(newPoints * 45);
  const bonusGold = Math.round(newPoints * 30);

  rpgState.hero.claimedHwScore = totalRealScore;
  const leveledUp = addRpgExpAndGoldToCharacterObject(rpgState.hero, bonusExp, bonusGold);

  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero).then(() => {
    updateRpgHudUI();
    syncPlayerOnlinePresence(true);
    showPopupSuccess(
      leveledUp ? "🎉 รับโบนัสการบ้าน & เลเวลอัป!" : "🎉 รับโบนัสจากคะแนนเรียนสำเร็จ!",
      `แปลงคะแนนเรียนใหม่ ${newPoints} คะแนน เป็น +${bonusExp} EXP และ +${bonusGold} Gold เรียบร้อยแล้ว!`
    );
  });
}

// Map Switching & Monster Spawning
function switchRpgMap(mapId) {
  if (!RPG_MAPS[mapId]) return;
  if (rpgState.inCombat) {
    fleeRpgCombat();
  }

  rpgState.currentMap = mapId;
  rpgState.localX = mapId === 'town' ? 480 : 150;
  rpgState.localY = 270;
  rpgState.targetX = rpgState.localX;
  rpgState.targetY = rpgState.localY;

  document.querySelectorAll('.rpg-map-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-map') === mapId);
  });

  spawnMapMonsters(mapId);
  syncPlayerOnlinePresence(true);
}

function spawnMapMonsters(mapId) {
  const mapDef = RPG_MAPS[mapId];
  if (!mapDef || !Array.isArray(mapDef.monsterTemplates)) {
    rpgState.mapMonsters = [];
    return;
  }
  rpgState.mapMonsters = mapDef.monsterTemplates.map(m => ({
    ...m,
    baseX: m.x,
    baseY: m.y,
    phase: Math.random() * Math.PI * 2
  }));
}

function sendRpgQuickChat(msg) {
  rpgState.chatBubbleText = msg;
  rpgState.chatBubbleExpire = Date.now() + 5000;
  syncPlayerOnlinePresence(true);
}

// 2D Canvas Input Controls (Keyboard + Touch D-Pad + Tap-to-Move on Canvas)
let rpgControlsInitialized = false;
function initRpgCanvasControls() {
  if (rpgControlsInitialized) return;
  rpgControlsInitialized = true;

  window.addEventListener('keydown', (e) => {
    if (!rpgState.isActiveView || rpgState.inCombat) return;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;

    const k = e.key.toLowerCase();
    if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(k)) {
      rpgState.keysPressed[k] = true;
      e.preventDefault();
    } else if (k === ' ' || k === 'enter') {
      engageNearestRpgTarget();
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    delete rpgState.keysPressed[k];
  });

  const canvas = document.getElementById('rpg-world-canvas');
  if (canvas) {
    canvas.addEventListener('pointerdown', (e) => {
      if (!rpgState.hero || rpgState.inCombat) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = ((e.clientX - rect.left) / rect.width) * canvas.width;
      const clickY = ((e.clientY - rect.top) / rect.height) * canvas.height;

      // Check if user tapped directly on an NPC or Monster
      const mapDef = RPG_MAPS[rpgState.currentMap];
      if (mapDef && Array.isArray(mapDef.npcs)) {
        for (const npc of mapDef.npcs) {
          if (Math.hypot(clickX - npc.x, clickY - npc.y) <= npc.radius + 18) {
            rpgState.targetX = npc.x;
            rpgState.targetY = npc.y;
            if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 85) {
              interactWithRpgNpc(npc);
            }
            return;
          }
        }
      }

      for (const mon of rpgState.mapMonsters) {
        if (Math.hypot(clickX - mon.x, clickY - mon.y) <= 44) {
          rpgState.targetX = mon.x;
          rpgState.targetY = mon.y;
          if (Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y) <= 90) {
            startRpgCombatWithMonster(mon);
          }
          return;
        }
      }

      // Otherwise walk to tapped position
      rpgState.targetX = Math.max(40, Math.min(canvas.width - 40, clickX));
      rpgState.targetY = Math.max(55, Math.min(canvas.height - 40, clickY));
    });
  }
}

function startRpgTouchMove(dx, dy) {
  rpgState.moveDirX = dx;
  rpgState.moveDirY = dy;
}

function stopRpgTouchMove() {
  rpgState.moveDirX = 0;
  rpgState.moveDirY = 0;
}

function engageNearestRpgTarget() {
  if (!rpgState.hero || rpgState.inCombat) return;
  const mapDef = RPG_MAPS[rpgState.currentMap];

  // 1. Check nearby NPCs first
  if (mapDef && Array.isArray(mapDef.npcs)) {
    for (const npc of mapDef.npcs) {
      if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 85) {
        interactWithRpgNpc(npc);
        return;
      }
    }
  }

  // 2. Check nearby Monsters
  let nearestMon = null;
  let minDist = 110;
  for (const mon of rpgState.mapMonsters) {
    const d = Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y);
    if (d <= minDist) {
      minDist = d;
      nearestMon = mon;
    }
  }

  if (nearestMon) {
    startRpgCombatWithMonster(nearestMon);
  } else {
    addRpgFloatingText(rpgState.localX, rpgState.localY - 35, 'เดินเข้าใกล้มอนสเตอร์หรือ NPC ก่อนนะ!', '#38bdf8');
  }
}

function interactWithRpgNpc(npc) {
  if (!npc) return;
  if (npc.type === 'heal') {
    const stats = computeRpgHeroTotalStats(rpgState.hero);
    rpgState.hero.hp = stats.maxHp;
    saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);
    updateRpgHudUI();
    addRpgFloatingText(rpgState.localX, rpgState.localY - 40, '💚 ฟื้นฟู HP เต็ม 100%!', '#34d399');
  } else if (npc.type === 'shop') {
    openRpgShopModal();
  } else if (npc.type === 'rank') {
    openRpgLeaderboardModal();
  } else if (npc.type === 'portal' && npc.targetMap) {
    switchRpgMap(npc.targetMap);
  }
}

function addRpgFloatingText(x, y, text, color = '#fde047') {
  rpgState.floatingTexts.push({
    x,
    y,
    text,
    color,
    alpha: 1.0,
    vy: -1.1
  });
}

// 2D World Update & Render Loop
function startRpgGameLoop() {
  if (rpgState.animFrameId) cancelAnimationFrame(rpgState.animFrameId);

  function loop() {
    if (!rpgState.isActiveView) return;
    updateRpgWorldPhysics();
    renderRpgWorldCanvas();
    rpgState.animFrameId = requestAnimationFrame(loop);
  }
  rpgState.animFrameId = requestAnimationFrame(loop);
}

function updateRpgWorldPhysics() {
  if (!rpgState.hero || rpgState.inCombat) return;

  let dx = rpgState.moveDirX;
  let dy = rpgState.moveDirY;

  if (rpgState.keysPressed['w'] || rpgState.keysPressed['arrowup']) dy = -1;
  if (rpgState.keysPressed['s'] || rpgState.keysPressed['arrowdown']) dy = 1;
  if (rpgState.keysPressed['a'] || rpgState.keysPressed['arrowleft']) dx = -1;
  if (rpgState.keysPressed['d'] || rpgState.keysPressed['arrowright']) dx = 1;

  const speed = 3.8;
  let moved = false;

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    rpgState.localX += (dx / len) * speed;
    rpgState.localY += (dy / len) * speed;
    rpgState.targetX = rpgState.localX;
    rpgState.targetY = rpgState.localY;
    if (dx !== 0) rpgState.facing = dx > 0 ? 1 : -1;
    moved = true;
  } else {
    // Move toward tap target
    const dist = Math.hypot(rpgState.targetX - rpgState.localX, rpgState.targetY - rpgState.localY);
    if (dist > 4) {
      const step = Math.min(speed, dist);
      const vx = (rpgState.targetX - rpgState.localX) / dist;
      const vy = (rpgState.targetY - rpgState.localY) / dist;
      rpgState.localX += vx * step;
      rpgState.localY += vy * step;
      if (Math.abs(vx) > 0.1) rpgState.facing = vx > 0 ? 1 : -1;
      moved = true;
    }
  }

  // Clamp inside world boundaries
  rpgState.localX = Math.max(40, Math.min(920, rpgState.localX));
  rpgState.localY = Math.max(55, Math.min(480, rpgState.localY));

  if (moved) {
    syncPlayerOnlinePresence(false);
  }

  // Animate roaming monsters gently
  const t = Date.now() * 0.002;
  rpgState.mapMonsters.forEach(mon => {
    mon.x = mon.baseX + Math.sin(t + mon.phase) * 22;
    mon.y = mon.baseY + Math.cos(t * 0.8 + mon.phase) * 14;
  });

  // Update floating texts
  for (let i = rpgState.floatingTexts.length - 1; i >= 0; i--) {
    const ft = rpgState.floatingTexts[i];
    ft.y += ft.vy;
    ft.alpha -= 0.018;
    if (ft.alpha <= 0) {
      rpgState.floatingTexts.splice(i, 1);
    }
  }
}

function renderRpgWorldCanvas() {
  const canvas = document.getElementById('rpg-world-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;

  const mapDef = RPG_MAPS[rpgState.currentMap] || RPG_MAPS.town;

  // 1. Background Gradient & Grid
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, mapDef.bgTop);
  grad.addColorStop(1, mapDef.bgBottom);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = mapDef.gridColor;
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 48) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 48) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 2. Decorative Paths / Environment
  ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.beginPath();
  ctx.roundRect(70, 230, w - 140, 64, 30);
  ctx.fill();

  // Map Title Watermark
  ctx.font = "800 16px 'Sarabun', sans-serif";
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.textAlign = 'left';
  ctx.fillText(mapDef.name, 18, 28);

  // 3. Draw NPCs / Portals
  if (Array.isArray(mapDef.npcs)) {
    mapDef.npcs.forEach(npc => {
      const dist = Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y);
      const isNear = dist <= 85;

      ctx.save();
      ctx.beginPath();
      ctx.arc(npc.x, npc.y, npc.radius, 0, Math.PI * 2);
      ctx.fillStyle = isNear ? 'rgba(56, 189, 248, 0.28)' : 'rgba(15, 23, 42, 0.65)';
      ctx.fill();
      ctx.lineWidth = isNear ? 3 : 2;
      ctx.strokeStyle = isNear ? '#38bdf8' : '#64748b';
      ctx.stroke();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(npc.icon, npc.x, npc.y);

      ctx.font = "700 12px 'Sarabun', sans-serif";
      ctx.fillStyle = isNear ? '#38bdf8' : '#e2e8f0';
      ctx.fillText(npc.name, npc.x, npc.y - npc.radius - 10);
      ctx.restore();
    });
  }

  // 4. Draw Roaming Monsters
  rpgState.mapMonsters.forEach(mon => {
    const dist = Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y);
    const isNear = dist <= 95;
    const radius = mon.isBoss ? 40 : 28;

    ctx.save();
    ctx.beginPath();
    ctx.arc(mon.x, mon.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = isNear ? 'rgba(239, 68, 68, 0.35)' : 'rgba(15, 23, 42, 0.7)';
    ctx.fill();
    ctx.lineWidth = isNear ? 3 : 2;
    ctx.strokeStyle = mon.isBoss ? '#f59e0b' : (isNear ? '#ef4444' : '#f87171');
    ctx.stroke();

    ctx.font = `${mon.isBoss ? 36 : 26}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(mon.icon, mon.x, mon.y);

    ctx.font = "800 12px 'Sarabun', sans-serif";
    ctx.fillStyle = mon.isBoss ? '#fde047' : '#fca5a5';
    ctx.fillText(mon.name, mon.x, mon.y - radius - 10);
    if (isNear) {
      ctx.font = "700 11px 'Sarabun', sans-serif";
      ctx.fillStyle = '#ffffff';
      ctx.fillText('⚔️ แตะเพื่อต่อสู้!', mon.x, mon.y + radius + 14);
    }
    ctx.restore();
  });

  // 5. Draw Online Classmates on the same map
  const myId = getRpgPlayerId();
  Object.values(rpgState.onlinePlayers || {}).forEach(p => {
    if (!p || p.id === myId || p.map !== rpgState.currentMap) return;
    // Ignore stale entries older than 10 minutes
    if (p.updatedAt && Date.now() - p.updatedAt > 600000) return;
    const cls = RPG_CLASSES[p.job] || RPG_CLASSES.warrior;
    drawRpgCharacterAvatarOnCanvas(ctx, p.x || 480, p.y || 270, cls.icon, cls.color, p.name, p.level || 1, false, p.chat);
  });

  // 6. Draw Local Hero
  if (rpgState.hero) {
    const cls = RPG_CLASSES[rpgState.hero.job] || RPG_CLASSES.warrior;
    const activeChat = Date.now() < rpgState.chatBubbleExpire ? rpgState.chatBubbleText : '';
    drawRpgCharacterAvatarOnCanvas(
      ctx,
      rpgState.localX,
      rpgState.localY,
      cls.icon,
      cls.color,
      rpgState.hero.name,
      rpgState.hero.level || 1,
      true,
      activeChat
    );
  }

  // 7. Draw Floating Texts
  rpgState.floatingTexts.forEach(ft => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, ft.alpha);
    ctx.font = "800 14px 'Sarabun', sans-serif";
    ctx.fillStyle = ft.color;
    ctx.textAlign = 'center';
    ctx.fillText(ft.text, ft.x, ft.y);
    ctx.restore();
  });
}

function drawRpgCharacterAvatarOnCanvas(ctx, x, y, icon, color, name, level, isSelf, chatText) {
  ctx.save();

  // Ground shadow
  ctx.beginPath();
  ctx.ellipse(x, y + 22, 18, 7, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fill();

  // Hero body circle
  ctx.beginPath();
  ctx.arc(x, y, 22, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = isSelf ? 3 : 2;
  ctx.strokeStyle = isSelf ? '#fde047' : '#ffffff';
  ctx.stroke();

  // Class Emoji Icon
  ctx.font = '22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(icon, x, y);

  // Name & Level Tag
  const label = `[Lv.${level}] ${name || 'ผู้กล้า'}`;
  ctx.font = "800 12px 'Sarabun', sans-serif";
  const textW = ctx.measureText(label).width + 12;
  ctx.fillStyle = isSelf ? 'rgba(15, 23, 42, 0.88)' : 'rgba(30, 41, 59, 0.82)';
  ctx.beginPath();
  ctx.roundRect(x - textW / 2, y - 44, textW, 18, 6);
  ctx.fill();

  ctx.fillStyle = isSelf ? '#fde047' : '#e2e8f0';
  ctx.fillText(label, x, y - 35);

  // Floating Chat Bubble
  if (chatText) {
    ctx.font = "700 12px 'Sarabun', sans-serif";
    const chatW = ctx.measureText(chatText).width + 16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - chatW / 2, y - 70, chatW, 22, 10);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillText(chatText, x, y - 59);
  }

  ctx.restore();
}

// Turn-Based Quiz Combat Engine
function startRpgCombatWithMonster(monster) {
  if (!rpgState.hero || !monster) return;
  rpgState.inCombat = true;
  rpgState.activeMonster = monster;
  rpgState.monsterMaxHp = monster.hp;
  rpgState.monsterHp = monster.hp;
  rpgState.combatCombo = 0;

  const overlay = document.getElementById('rpg-combat-overlay');
  const cmdBox = document.getElementById('rpg-battle-commands');
  const quizBox = document.getElementById('rpg-battle-quiz-box');
  if (overlay) overlay.style.display = 'flex';
  if (cmdBox) cmdBox.style.display = 'grid';
  if (quizBox) quizBox.style.display = 'none';

  updateRpgCombatArenaUI(`เผชิญหน้ากับ ${monster.name}! เลือกท่าโจมตีเพื่อตอบคำถาม`);
}

function updateRpgCombatArenaUI(bannerMsg) {
  if (!rpgState.hero || !rpgState.activeMonster) return;
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  const mon = rpgState.activeMonster;

  document.getElementById('rpg-battle-hero-sprite').innerText = stats.cls.icon;
  document.getElementById('rpg-battle-hero-name').innerText = `${rpgState.hero.name} (Lv.${rpgState.hero.level})`;
  const heroHpPct = Math.max(0, Math.min(100, Math.round((rpgState.hero.hp / stats.maxHp) * 100)));
  document.getElementById('rpg-battle-hero-hp-bar').style.width = `${heroHpPct}%`;
  document.getElementById('rpg-battle-hero-hp-text').innerText = `${Math.max(0, Math.round(rpgState.hero.hp))}/${stats.maxHp}`;

  document.getElementById('rpg-battle-monster-sprite').innerText = mon.icon;
  document.getElementById('rpg-battle-monster-name').innerText = mon.name;
  const monHpPct = Math.max(0, Math.min(100, Math.round((rpgState.monsterHp / rpgState.monsterMaxHp) * 100)));
  document.getElementById('rpg-battle-monster-hp-bar').style.width = `${monHpPct}%`;
  document.getElementById('rpg-battle-monster-hp-text').innerText = `${Math.max(0, Math.round(rpgState.monsterHp))}/${rpgState.monsterMaxHp}`;
  document.getElementById('rpg-battle-monster-reward').innerText = `รางวัล: +${mon.exp} EXP | +${mon.gold} G`;

  const comboBadge = document.getElementById('rpg-battle-combo-badge');
  if (comboBadge) {
    if (rpgState.combatCombo > 0) {
      comboBadge.style.display = 'inline-block';
      comboBadge.innerText = `🔥 Combo x${rpgState.combatCombo}`;
    } else {
      comboBadge.style.display = 'none';
    }
  }

  if (bannerMsg) {
    document.getElementById('rpg-battle-dmg-banner').innerText = bannerMsg;
  }
}

function pickRandomRpgBattleQuestion() {
  const pool = [];
  const src = rpgState.serverSettings.quizSource || 'all';

  if (src !== 'builtin') {
    Object.keys(quizzesData || {}).forEach(qId => {
      if (src !== 'all' && qId !== src) return;
      const quiz = quizzesData[qId];
      if (quiz && Array.isArray(quiz.questions)) {
        quiz.questions.forEach(q => {
          if (q.qType !== 'subjective' && Array.isArray(q.options) && q.options.length >= 2) {
            pool.push({
              question: q.question,
              options: q.options,
              correctIndex: Number(q.correctIndex) || 0
            });
          }
        });
      }
    });
  }

  if (pool.length === 0 || src === 'all') {
    RPG_DEFAULT_QUESTIONS.forEach(q => pool.push(q));
  }

  return pool[Math.floor(Math.random() * pool.length)];
}

function startRpgAttackQuiz(mode) {
  if (!rpgState.inCombat) return;
  rpgState.pendingSkillMode = mode;
  rpgState.activeQuestion = pickRandomRpgBattleQuestion();

  const cmdBox = document.getElementById('rpg-battle-commands');
  const quizBox = document.getElementById('rpg-battle-quiz-box');
  if (cmdBox) cmdBox.style.display = 'none';
  if (quizBox) quizBox.style.display = 'block';

  document.getElementById('rpg-battle-question-text').innerText = rpgState.activeQuestion.question;

  const optsGrid = document.getElementById('rpg-battle-options-grid');
  optsGrid.innerHTML = rpgState.activeQuestion.options.map((opt, idx) => `
    <button type="button" class="rpg-quiz-opt-btn" onclick="submitRpgBattleAnswer(${idx})">
      <span style="color:#38bdf8; font-weight:800;">${String.fromCharCode(65 + idx)}.</span> ${opt}
    </button>
  `).join('');

  // Ranger gets +5s extra thinking time
  const isRanger = rpgState.hero?.job === 'ranger';
  rpgState.quizRemainingSec = isRanger ? 25 : 20;
  updateRpgQuizTimerBadge();

  clearRpgQuizTimer();
  rpgState.quizTimerInterval = setInterval(() => {
    rpgState.quizRemainingSec--;
    updateRpgQuizTimerBadge();
    if (rpgState.quizRemainingSec <= 0) {
      clearRpgQuizTimer();
      submitRpgBattleAnswer(-1); // Timeout
    }
  }, 1000);
}

function updateRpgQuizTimerBadge() {
  const badge = document.getElementById('rpg-quiz-timer-badge');
  if (badge) {
    badge.innerHTML = `<i class="fa-regular fa-clock"></i> เวลา ${rpgState.quizRemainingSec} วินาที`;
  }
}

function clearRpgQuizTimer() {
  if (rpgState.quizTimerInterval) {
    clearInterval(rpgState.quizTimerInterval);
    rpgState.quizTimerInterval = null;
  }
}

function submitRpgBattleAnswer(selectedIndex) {
  clearRpgQuizTimer();
  const q = rpgState.activeQuestion;
  if (!q || !rpgState.hero || !rpgState.activeMonster) return;

  const isCorrect = selectedIndex === q.correctIndex;
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  const mon = rpgState.activeMonster;

  const cmdBox = document.getElementById('rpg-battle-commands');
  const quizBox = document.getElementById('rpg-battle-quiz-box');
  if (cmdBox) cmdBox.style.display = 'grid';
  if (quizBox) quizBox.style.display = 'none';

  if (isCorrect) {
    rpgState.combatCombo++;
    const isSkill = rpgState.pendingSkillMode === 'skill';
    let dmgMultiplier = isSkill ? 1.6 : 1.0;

    // Mage combo bonus
    if (rpgState.hero.job === 'mage') {
      dmgMultiplier += rpgState.combatCombo * 0.15;
    }

    // Critical hit check
    const isCrit = Math.random() * 100 < stats.crit;
    if (isCrit) dmgMultiplier *= 1.75;

    const rawDmg = Math.max(8, Math.round(stats.atk * dmgMultiplier - (mon.def || 0) * 0.4));
    rpgState.monsterHp = Math.max(0, rpgState.monsterHp - rawDmg);

    // Paladin passive heal on correct answer
    let healMsg = '';
    if (rpgState.hero.job === 'paladin') {
      const healAmt = Math.round(stats.maxHp * 0.18);
      rpgState.hero.hp = Math.min(stats.maxHp, rpgState.hero.hp + healAmt);
      healMsg = ` (+ฟื้นฟู ${healAmt} HP)`;
    }

    updateRpgCombatArenaUI(
      `✅ ตอบถูก! ${isSkill ? stats.cls.skillName : 'โจมตี'} ทำดาเมจ ${rawDmg} หน่วย${isCrit ? ' (💥 CRITICAL!)' : ''}${healMsg}`
    );

    if (rpgState.monsterHp <= 0) {
      // Monster defeated!
      handleRpgMonsterVictory(mon);
      return;
    }
  } else {
    // Wrong answer or timeout -> Monster counter-attacks
    rpgState.combatCombo = 0;
    const correctChoiceText = q.options[q.correctIndex] || '';
    let enemyDmg = Math.max(6, Math.round(mon.atk - stats.def * 0.55));
    if (rpgState.hero.job === 'warrior' && rpgState.pendingSkillMode === 'skill') {
      enemyDmg = Math.round(enemyDmg * 0.6); // Warrior shield reduction
    }

    rpgState.hero.hp = Math.max(0, rpgState.hero.hp - enemyDmg);
    updateRpgCombatArenaUI(`❌ ตอบผิด! (เฉลย: ${correctChoiceText}) • ถูกโจมตีสวนกลับ -${enemyDmg} HP`);
    updateRpgHudUI();

    if (rpgState.hero.hp <= 0) {
      handleRpgHeroDefeat();
      return;
    }
  }

  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);
  updateRpgHudUI();
}

function handleRpgMonsterVictory(mon) {
  const expGain = mon.exp || 40;
  const goldGain = mon.gold || 25;
  rpgState.hero.monstersDefeated = (rpgState.hero.monstersDefeated || 0) + 1;
  const leveledUp = addRpgExpAndGoldToCharacterObject(rpgState.hero, expGain, goldGain);

  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);
  updateRpgHudUI();
  syncPlayerOnlinePresence(true);

  setTimeout(() => {
    rpgState.inCombat = false;
    document.getElementById('rpg-combat-overlay').style.display = 'none';
    addRpgFloatingText(rpgState.localX, rpgState.localY - 40, `+${expGain} EXP  +${goldGain} G`, '#fde047');
    if (leveledUp) {
      showPopupSuccess(
        `🎉 LEVEL UP! เลื่อนเป็น Lv.${rpgState.hero.level}!`,
        `คุณเอาชนะ ${mon.name} ได้รับ +${expGain} EXP, +${goldGain} Gold และได้รับแต้มอัปสเตตัส +3 แต้ม!`
      );
    }
  }, 650);
}

function handleRpgHeroDefeat() {
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  rpgState.hero.hp = stats.maxHp;
  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);

  setTimeout(() => {
    rpgState.inCombat = false;
    document.getElementById('rpg-combat-overlay').style.display = 'none';
    switchRpgMap('town');
    updateRpgHudUI();
    showPopupWarning("หมดสติในการต่อสู้!", "คุณถูกส่งกลับมาฟื้นฟูพลังชีวิตที่น้ำพุเมืองเริ่มต้น ลองอัปเกรดอาวุธหรือชุดเกราะแล้วไปท้าสู้อีกครั้งนะ!");
  }, 600);
}

function useRpgHealingPotion() {
  if (!rpgState.hero) return;
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  if (rpgState.hero.hp >= stats.maxHp) {
    updateRpgCombatArenaUI("พลังชีวิต (HP) ของคุณเต็มอยู่แล้ว!");
    return;
  }
  if ((rpgState.hero.gold || 0) < 25) {
    updateRpgCombatArenaUI("เหรียญทองไม่พอซื้อยาฟื้นเลือด (ต้องการ 25 G)");
    return;
  }

  rpgState.hero.gold -= 25;
  rpgState.hero.hp = Math.min(stats.maxHp, rpgState.hero.hp + 70);
  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);
  updateRpgHudUI();
  updateRpgCombatArenaUI("🧪 ดื่มยาฟื้นเลือด +70 HP เรียบร้อยแล้ว!");
}

function fleeRpgCombat() {
  clearRpgQuizTimer();
  rpgState.inCombat = false;
  const overlay = document.getElementById('rpg-combat-overlay');
  if (overlay) overlay.style.display = 'none';
}

// Weapon/Armor Shop & Stat Points Allocation Modal (SweetAlert2 Interactive UI)
function openRpgShopModal() {
  if (!rpgState.hero) return;
  const hero = rpgState.hero;
  const stats = computeRpgHeroTotalStats(hero);

  const weaponsHtml = RPG_WEAPONS.map(w => {
    const isEquipped = hero.weaponId === w.id;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:${isEquipped ? '#eff6ff' : '#f8fafc'}; border:1.5px solid ${isEquipped ? '#3b82f6' : '#e2e8f0'}; border-radius:10px; margin-bottom:6px;">
        <div style="text-align:left;">
          <div style="font-weight:800; color:#0f172a; font-size:0.88rem;">${w.icon} ${w.name}</div>
          <div style="font-size:0.76rem; color:#475569;">⚔️ +${w.atk} ATK | 💥 +${w.crit}% CRIT</div>
        </div>
        ${isEquipped
          ? `<span class="badge badge-blue" style="font-weight:800;">สวมใส่แล้ว</span>`
          : `<button type="button" class="btn btn-sm btn-primary" onclick="buyOrEquipRpgItem('weapon', '${w.id}', ${w.price})" style="border-radius:8px; font-weight:800; font-size:0.76rem;">${w.price === 0 ? 'สวมใส่' : `ซื้อ (${w.price} G)`}</button>`
        }
      </div>
    `;
  }).join('');

  const armorsHtml = RPG_ARMORS.map(a => {
    const isEquipped = hero.armorId === a.id;
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 10px; background:${isEquipped ? '#f0fdf4' : '#f8fafc'}; border:1.5px solid ${isEquipped ? '#10b981' : '#e2e8f0'}; border-radius:10px; margin-bottom:6px;">
        <div style="text-align:left;">
          <div style="font-weight:800; color:#0f172a; font-size:0.88rem;">${a.icon} ${a.name}</div>
          <div style="font-size:0.76rem; color:#475569;">🛡️ +${a.def} DEF | ❤️ +${a.hp} Max HP</div>
        </div>
        ${isEquipped
          ? `<span class="badge badge-green" style="font-weight:800;">สวมใส่แล้ว</span>`
          : `<button type="button" class="btn btn-sm btn-success" onclick="buyOrEquipRpgItem('armor', '${a.id}', ${a.price})" style="border-radius:8px; font-weight:800; font-size:0.76rem;">${a.price === 0 ? 'สวมใส่' : `ซื้อ (${a.price} G)`}</button>`
        }
      </div>
    `;
  }).join('');

  Swal.fire({
    title: `🛡️ ร้านค้าอาวุธ & อัปสเตตัส (${hero.gold || 0} G)`,
    width: 680,
    html: `
      <div style="text-align:left; font-family:'Sarabun', sans-serif;">
        <div style="background:#eef2ff; border:1.5px solid #c7d2fe; border-radius:12px; padding:10px 14px; margin-bottom:12px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
          <div>
            <div style="font-weight:800; color:#1e1b4b; font-size:0.92rem;">✨ แต้มอัปสเตตัสคงเหลือ: <span style="color:#4f46e5;">${hero.statPoints || 0} แต้ม</span></div>
            <div style="font-size:0.78rem; color:#475569;">STR: ${hero.str || 0} (+โจมตี) | VIT: ${hero.vit || 0} (+เลือด/เกราะ) | LUK: ${hero.luk || 0} (+คริติคอล)</div>
          </div>
          <div style="display:flex; gap:5px; flex-wrap:wrap;">
            <button type="button" class="btn btn-sm btn-primary" onclick="allocateRpgStatPoint('str')" ${(hero.statPoints || 0) <= 0 ? 'disabled' : ''} style="border-radius:8px; font-size:0.75rem; font-weight:800;">+STR (โจมตี)</button>
            <button type="button" class="btn btn-sm btn-success" onclick="allocateRpgStatPoint('vit')" ${(hero.statPoints || 0) <= 0 ? 'disabled' : ''} style="border-radius:8px; font-size:0.75rem; font-weight:800;">+VIT (เลือด)</button>
            <button type="button" class="btn btn-sm btn-warning" onclick="allocateRpgStatPoint('luk')" ${(hero.statPoints || 0) <= 0 ? 'disabled' : ''} style="border-radius:8px; font-size:0.75rem; font-weight:800;">+LUK (คริติคอล)</button>
          </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div>
            <h5 style="font-weight:800; color:#1e293b; margin-bottom:8px;">⚔️ อาวุธ (Weapons)</h5>
            ${weaponsHtml}
          </div>
          <div>
            <h5 style="font-weight:800; color:#1e293b; margin-bottom:8px;">🛡️ ชุดเกราะ (Armors)</h5>
            ${armorsHtml}
          </div>
        </div>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: 'ปิดหน้าต่างร้านค้า',
    confirmButtonColor: '#2563eb'
  });
}

function allocateRpgStatPoint(statKey) {
  if (!rpgState.hero || (rpgState.hero.statPoints || 0) <= 0) return;
  rpgState.hero.statPoints--;
  rpgState.hero[statKey] = (rpgState.hero[statKey] || 0) + 1;
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  rpgState.hero.hp = stats.maxHp;

  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero).then(() => {
    updateRpgHudUI();
    openRpgShopModal();
  });
}

function buyOrEquipRpgItem(type, itemId, price) {
  if (!rpgState.hero) return;
  if ((rpgState.hero.gold || 0) < price) {
    showPopupWarning("เหรียญทองไม่เพียงพอ!", `คุณมี ${rpgState.hero.gold || 0} G แต่ไอเทมนี้ราคา ${price} G`);
    return;
  }

  rpgState.hero.gold = (rpgState.hero.gold || 0) - price;
  if (type === 'weapon') {
    rpgState.hero.weaponId = itemId;
  } else {
    rpgState.hero.armorId = itemId;
  }

  const stats = computeRpgHeroTotalStats(rpgState.hero);
  rpgState.hero.hp = stats.maxHp;

  saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero).then(() => {
    updateRpgHudUI();
    openRpgShopModal();
  });
}

// Classroom Hall of Fame Leaderboard Modal
function openRpgLeaderboardModal() {
  const list = Object.values(rpgState.allCharacters || {});
  list.sort((a, b) => {
    if ((b.level || 1) !== (a.level || 1)) return (b.level || 1) - (a.level || 1);
    return (b.exp || 0) - (a.exp || 0);
  });

  const rowsHtml = list.slice(0, 20).map((ch, idx) => {
    const cls = RPG_CLASSES[ch.job] || RPG_CLASSES.warrior;
    const medal = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx + 1}`));
    return `
      <tr>
        <td style="text-align:center; font-weight:800;">${medal}</td>
        <td style="text-align:left; font-weight:800; color:#0f172a;">${cls.icon} ${ch.name || 'ผู้กล้า'}</td>
        <td style="text-align:center;"><span class="badge badge-purple">${ch.classLevel || '-'}</span></td>
        <td style="text-align:center;"><span class="badge badge-yellow" style="font-weight:800;">Lv.${ch.level || 1}</span></td>
        <td style="text-align:center; font-weight:700; color:#2563eb;">${ch.monstersDefeated || 0} ตัว</td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="5" style="text-align:center; padding:20px;">ยังไม่มีข้อมูลผู้กล้า</td></tr>`;

  Swal.fire({
    title: '🏆 หอเกียรติยศผู้กล้า (Top 20 Level Leaderboard)',
    width: 640,
    html: `
      <div class="table-responsive" style="max-height:55vh; overflow-y:auto; font-family:'Sarabun', sans-serif;">
        <table class="table" style="margin:0; font-size:0.88rem;">
          <thead style="background:#f1f5f9;">
            <tr>
              <th style="text-align:center;">อันดับ</th>
              <th style="text-align:left;">ชื่อผู้กล้า</th>
              <th style="text-align:center;">ห้องเรียน</th>
              <th style="text-align:center;">เลเวล</th>
              <th style="text-align:center;">ปราบมอนสเตอร์</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    `,
    confirmButtonText: 'ปิดหน้าต่าง',
    confirmButtonColor: '#2563eb'
  });
}
