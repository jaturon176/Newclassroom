/* ==========================================================================
   TOWER OF WISDOM: IDLE RPG & CO-OP LOGIC DUNGEON ENGINE
   หอคอยแห่งปัญญา 10 ชั้น: ระบบเกม Idle RPG ผจญภัยฟาร์มอัตโนมัติ & ตะลุยบอสเรด
   ========================================================================== */

// Global Game State
let towerPlayerState = {
  level: 1,
  exp: 0,
  gold: 150,
  levelCap: 10,
  highestClearedFloor: 0,
  currentFloor: 1,
  currentWave: 1,
  maxWavesPerFloor: 10,
  baseStats: { atk: 15, def: 8, maxHp: 120, currentHp: 120 },
  bonusStats: { atk: 0, def: 0, maxHp: 0 },
  equipment: {
    weapon: { name: 'ดาบเหล็กผู้กล้า', rarity: 'common', atk: 8, icon: '⚔️' },
    armor: { name: 'เกราะหนังนักผจญภัย', rarity: 'common', def: 5, icon: '🛡️' },
    relic: { name: 'แหวนรูนฝึกหัด', rarity: 'common', maxHp: 40, icon: '💍' }
  },
  skills: ['oracle_eye'],
  isAutoBattle: true,
  gameSpeed: 1,
  feverTimer: 0
};

// Skill Master Catalog
const TOWER_ALL_SKILLS = [
  { id: 'oracle_eye', name: 'เนตรหยั่งรู้', icon: 'fa-eye', desc: 'ตัดตัวเลือกที่ผิดทิ้ง 2 ตัวเลือกทันที', color: '#38bdf8' },
  { id: 'time_warp', name: 'ย้อนกาลเวลา', icon: 'fa-hourglass-half', desc: 'เพิ่มเวลาคิดปริศนา +25 วินาที', color: '#fbbf24' },
  { id: 'aegis_shield', name: 'โล่เทพพิทักษ์', icon: 'fa-shield-halved', desc: 'ป้องกันความเสียหายจากบอส 100%', color: '#34d399' },
  { id: 'critical_mind', name: 'ระเบิดปัญญา', icon: 'fa-bolt-lightning', desc: 'โจมตีคริติคอลรุนแรง 300%', color: '#f43f5e' },
  { id: 'elixir_heal', name: 'น้ำยาฟื้นฟูกายา', icon: 'fa-flask', desc: 'ฟื้นฟูเลือด HP 50% ให้ทีม', color: '#10b981' },
  { id: 'chain_lightning', name: 'สายฟ้าลูกโซ่', icon: 'fa-cloud-bolt', desc: 'โจมตีมอนสเตอร์ทุกตัว ดาเมจ 200%', color: '#818cf8' },
  { id: 'frost_trap', name: 'มนต์แช่แข็ง', icon: 'fa-snowflake', desc: 'แช่แข็งมอนสเตอร์หยุดเดิน 3 วินาที', color: '#67e8f9' },
  { id: 'berserk_will', name: 'จิตวิญญาณนักสู้', icon: 'fa-fire-flame-curved', desc: 'เมื่อเลือดต่ำ พลังโจมตี x2', color: '#ef4444' },
  { id: 'phoenix_rebirth', name: 'นกฟีนิกซ์คืนชีพ', icon: 'fa-dove', desc: 'ฟื้นคืนชีพเมื่อเลือดหมด 1 ครั้ง', color: '#fb923c' }
];

// 10 Floors Data & Boss Configurations
const TOWER_FLOORS_DATA = [
  { floor: 1, name: 'ประตูวิหารสัจนิรันดร์', theme: 'Logic Gates (AND, OR, NOT)', levelCap: 10, boss: { name: 'โกเลมหินสัจจะ (Logic Golem)', level: 10, maxHp: 2500, atk: 18, def: 8, avatar: '🗿' } },
  { floor: 2, name: 'ถ้ำลำดับเวทมนตร์', theme: 'Pattern Recognition & Sequences', levelCap: 20, boss: { name: 'อสรพิษลำดับอนันต์ (Infinite Serpent)', level: 20, maxHp: 5000, atk: 28, def: 14, avatar: '🐍' } },
  { floor: 3, name: 'ป่าเขาวงกตอัลกอริทึม', theme: 'Flowcharts & Algorithms', levelCap: 30, boss: { name: 'ภูตเขาวงกต (Labyrinth Sprite)', level: 30, maxHp: 9000, atk: 42, def: 22, avatar: '🧚' } },
  { floor: 4, name: 'หุบเขาเลขฐานสอง', theme: 'Binary & Bitwise Logic', levelCap: 40, boss: { name: 'การ์กอยล์ทวิภาค (Binary Gargoyle)', level: 40, maxHp: 14000, atk: 58, def: 30, avatar: '🦇' } },
  { floor: 5, name: 'สุสานข้อผิดพลาด', theme: 'Code Debugging Trials', levelCap: 50, boss: { name: 'ราชินีบั๊กมรณะ (The Dread Bug)', level: 50, maxHp: 20000, atk: 75, def: 40, avatar: '🦂' } },
  { floor: 6, name: 'หอสมุดเงื่อนไขซ้อน', theme: 'If-Else & Conditionals', levelCap: 60, boss: { name: 'จอมเวทเงื่อนไข (Conditional Mage)', level: 60, maxHp: 28000, atk: 95, def: 52, avatar: '🧙‍♂️' } },
  { floor: 7, name: 'ห้องนิรภัยโครงสร้างข้อมูล', theme: 'Arrays, Stacks & Queues', levelCap: 70, boss: { name: 'อัศวินผลึก (Structure Guardian)', level: 70, maxHp: 38000, atk: 118, def: 65, avatar: '🛡️' } },
  { floor: 8, name: 'ยอดผาฟังก์ชันและตัวแปร', theme: 'Functions & Loops', levelCap: 80, boss: { name: 'มังกรเพลิงฟังก์ชัน (Recursive Dragon)', level: 80, maxHp: 50000, atk: 142, def: 78, avatar: '🐉' } },
  { floor: 9, name: 'ปราสาทถอดรหัสไซเฟอร์', theme: 'Cryptography & Ciphers', levelCap: 90, boss: { name: 'ชาโดว์รหัสลับ (Cipher Phantom)', level: 90, maxHp: 65000, atk: 170, def: 90, avatar: '👤' } },
  { floor: 10, name: 'บัลลังก์จักรกล AI', theme: 'AI Logic & Systems', levelCap: 99, boss: { name: 'ผู้คุมกฎแห่งมิติดิจิทัล (AI Mastermind)', level: 100, maxHp: 100000, atk: 210, def: 110, avatar: '🤖' } }
];

// Equipment Loot Table
const TOWER_LOOT_TABLE = {
  weapons: [
    { name: 'ดาบไม้ฝึกหัด', rarity: 'common', atk: 6, icon: '🗡️' },
    { name: 'ดาบเหล็กตรรกะ', rarity: 'common', atk: 14, icon: '⚔️' },
    { name: 'คทาเวทมนตร์รูน', rarity: 'rare', atk: 26, icon: '🪄' },
    { name: 'ดาบคริสตัลอัลกอริทึม', rarity: 'rare', atk: 42, icon: '💎' },
    { name: 'หอกสายฟ้าทวิภาค', rarity: 'epic', atk: 65, icon: '⚡' },
    { name: 'ดาบแสงปัญญาประดิษฐ์', rarity: 'legendary', atk: 110, icon: '🌟' }
  ],
  armors: [
    { name: 'เสื้อเกราะผ้าธรรมดา', rarity: 'common', def: 4, icon: '🥋' },
    { name: 'เกราะหนังนักผจญภัย', rarity: 'common', def: 10, icon: '🛡️' },
    { name: 'ชุดคลุมจอมเวทคัดสรร', rarity: 'rare', def: 24, icon: '👘' },
    { name: 'เกราะเพลทผลึกศิลา', rarity: 'epic', def: 48, icon: '🛡️' },
    { name: 'เกราะทองคำเทพพิทักษ์', rarity: 'legendary', def: 80, icon: '👑' }
  ],
  relics: [
    { name: 'แหวนทองแดงสมาธิ', rarity: 'common', maxHp: 35, icon: '💍' },
    { name: 'สร้อยคอหินนำโชค', rarity: 'common', maxHp: 75, icon: '📿' },
    { name: 'จี้ห้อยคอหัวใจมังกร', rarity: 'rare', maxHp: 140, icon: '❤️' },
    { name: 'แหวนรูนชีวิตนิรันดร์', rarity: 'epic', maxHp: 240, icon: '💍' },
    { name: 'มงกุฎจักรพรรดิแห่งปัญญา', rarity: 'legendary', maxHp: 400, icon: '👑' }
  ]
};

// Puzzle Question Bank for Logic Boosts
const TOWER_PUZZLE_BANK = {
  1: [
    { q: 'ผลลัพธ์ของ (TRUE AND FALSE) มีค่าตรงกับข้อใด?', options: ['TRUE', 'FALSE', 'ERROR', 'NULL'], ans: 1 },
    { q: 'หาก A = TRUE และ B = FALSE ข้อใดให้ผลลัพธ์เป็น TRUE?', options: ['A AND B', 'NOT A', 'A OR B', 'NOT (A OR B)'], ans: 2 },
    { q: 'เกตใดที่ทำหน้าที่กลับค่าความจริงจาก 1 เป็น 0 และ 0 เป็น 1?', options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NAND Gate'], ans: 2 }
  ],
  2: [
    { q: 'จงหาจำนวนถัดไปของลำดับ: 2, 4, 8, 16, ... ?', options: ['24', '30', '32', '64'], ans: 2 },
    { q: 'อนุกรมฟีโบนัชชี: 1, 1, 2, 3, 5, 8, ... ตัวถัดไปคือเลขใด?', options: ['11', '13', '15', '16'], ans: 1 }
  ],
  3: [
    { q: 'ในผังงาน (Flowchart) สัญลักษณ์สี่เหลี่ยมขนมเปียกปูน (Diamond) ใช้แทนอะไร?', options: ['จุดเริ่มต้น/สิ้นสุด', 'การประมวลผล', 'การตัดสินใจตามเงื่อนไข (Decision)', 'การรับข้อมูล'], ans: 2 },
    { q: 'ขั้นตอนวิธี (Algorithm) ที่ดีควรมีคุณสมบัติใดมากที่สุด?', options: ['ซับซ้อนเข้าใจยาก', 'มีลำดับขั้นตอนชัดเจนและถูกต้อง', 'ยาวที่สุด', 'ไม่มีวันสิ้นสุด'], ans: 1 }
  ],
  4: [
    { q: 'เลขฐานสอง 1010 มีค่าเท่ากับเลขฐานสิบใด?', options: ['8', '10', '12', '14'], ans: 1 },
    { q: 'เลขฐานสิบ 7 แปลงเป็นเลขฐานสองได้ตรงกับข้อใด?', options: ['0101', '0110', '0111', '1001'], ans: 2 }
  ],
  5: [
    { q: 'ข้อผิดพลาดประเภท Syntax Error หมายถึงข้อใด?', options: ['ไวยากรณ์คำสั่งผิดกฎของภาษา', 'โปรแกรมทำงานผิดตรรกะ', 'หน่วยความจำเต็ม', 'เครื่องดับ'], ans: 0 },
    { q: 'การดีบัก (Debugging) ในการเขียนโปรแกรมหมายถึงข้อใด?', options: ['ลบโค้ดทิ้งทั้งหมด', 'ค้นหาและแก้ไขข้อผิดพลาด', 'ลงโปรแกรมใหม่', 'ต่อเน็ต'], ans: 1 }
  ],
  6: [
    { q: 'ถ้ากำหนด x = 15; if (x > 20) { y = 1; } else if (x > 10) { y = 2; } else { y = 3; } ค่า y คืออะไร?', options: ['1', '2', '3', '0'], ans: 1 },
    { q: 'เงื่อนไข (score >= 80 AND score <= 100) จะเป็นจริงเมื่อใด?', options: ['คะแนน 79', 'คะแนน 80 ถึง 100', 'คะแนน 101', 'คะแนน 50'], ans: 1 }
  ],
  7: [
    { q: 'โครงสร้างข้อมูลแบบ Stack ทำงานด้วยหลักการใด?', options: ['FIFO (เข้าก่อนออกก่อน)', 'LIFO (เข้าทีหลังออกก่อน)', 'Random', 'Tree'], ans: 1 },
    { q: 'ถ้า scores = [10, 20, 30, 40] ค่า scores[2] คืออะไร?', options: ['10', '20', '30', '40'], ans: 2 }
  ],
  8: [
    { q: 'ฟังก์ชันแบบ Recursive (การเรียกซ้ำ) คืออะไร?', options: ['ฟังก์ชันไม่คืนค่า', 'ฟังก์ชันที่เรียกใช้ตัวเองภายใน', 'ไม่มีพารามิเตอร์', 'ทำงานรอบเดียว'], ans: 1 },
    { q: 'ลูป for (let i = 0; i < 5; i++) วนซ้ำทั้งหมดกี่รอบ?', options: ['4 รอบ', '5 รอบ', '6 รอบ', 'ไม่สิ้นสุด'], ans: 1 }
  ],
  9: [
    { q: 'รหัสซีซาร์ (Caesar Cipher) เลื่อน 1 ตำแหน่ง คำว่า "CAT" จะกลายเป็นอะไร?', options: ['DBU', 'BZS', 'DBS', 'EBU'], ans: 0 },
    { q: 'เป้าหมายหลักของการเข้ารหัสข้อมูล (Cryptography) คือข้อใด?', options: ['ทำให้ไฟล์เล็กลง', 'รักษาความลับและความปลอดภัย', 'เพิ่มความเร็ว', 'ลบไฟล์'], ans: 1 }
  ],
  10: [
    { q: 'ในระบบ AI กระบวนการใดใช้สำหรับให้โมเดลเรียนรู้จากข้อมูล?', options: ['Model Compilation', 'Model Training (การฝึกฝน)', 'Model Format', 'Restart'], ans: 1 },
    { q: 'Decision Tree ใน AI ใช้โครงสร้างใดในการตัดสินใจ?', options: ['Stack', 'Node กิ่งก้านและใบเงื่อนไข', 'Queue', 'Array'], ans: 1 }
  ]
};

/* -------------------------------------------------------------
   IDLE RPG BATTLE SIMULATION & RENDER ENGINE
------------------------------------------------------------- */
let idleBattleInterval = null;
let activeEnemies = [];
let damagePopups = [];

// Hero Party Members in Battle
const HERO_PARTY = [
  { name: 'อัศวินสาว (Knight)', class: 'knight', emoji: '👧⚔️', color: '#60a5fa', x: 80, y: 140, attackCooldown: 0 },
  { name: 'นักธนูเวท (Archer)', class: 'archer', emoji: '🏹👧', color: '#34d399', x: 40, y: 80, attackCooldown: 0 },
  { name: 'จอมเวทสาว (Mage)', class: 'mage', emoji: '🪄👧', color: '#c084fc', x: 30, y: 190, attackCooldown: 0 }
];

function initTowerGameModule() {
  if (!currentUser) return;
  loadStudentTowerProgress();
  startIdleBattleLoop();
}

function loadStudentTowerProgress() {
  const studentKey = currentUser.studentId || currentUser.username || 'default_player';
  if (typeof firebase !== 'undefined' && firebase.database) {
    firebase.database().ref(`tower_players/${studentKey}`).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        towerPlayerState.level = data.level || 1;
        towerPlayerState.exp = data.exp || 0;
        towerPlayerState.gold = data.gold || 150;
        towerPlayerState.highestClearedFloor = data.highestClearedFloor || 0;
        towerPlayerState.currentFloor = data.currentFloor || 1;
        towerPlayerState.currentWave = data.currentWave || 1;
        towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);
        towerPlayerState.baseStats = data.baseStats || { atk: 15 + (towerPlayerState.level * 3), def: 8 + (towerPlayerState.level * 2), maxHp: 120 + (towerPlayerState.level * 18), currentHp: 120 + (towerPlayerState.level * 18) };
        towerPlayerState.bonusStats = data.bonusStats || { atk: 0, def: 0, maxHp: 0 };
        towerPlayerState.equipment = data.equipment || towerPlayerState.equipment;
        if (data.skills && Array.isArray(data.skills)) towerPlayerState.skills = data.skills;
      }
      renderTowerMainView();
    }).catch(() => {
      renderTowerMainView();
    });
  } else {
    renderTowerMainView();
  }
}

function saveStudentTowerProgress() {
  const studentKey = currentUser.studentId || currentUser.username || 'default_player';
  if (typeof firebase !== 'undefined' && firebase.database) {
    firebase.database().ref(`tower_players/${studentKey}`).set({
      level: towerPlayerState.level,
      exp: towerPlayerState.exp,
      gold: towerPlayerState.gold,
      highestClearedFloor: towerPlayerState.highestClearedFloor,
      currentFloor: towerPlayerState.currentFloor,
      currentWave: towerPlayerState.currentWave,
      levelCap: towerPlayerState.levelCap,
      baseStats: towerPlayerState.baseStats,
      bonusStats: towerPlayerState.bonusStats,
      equipment: towerPlayerState.equipment,
      skills: towerPlayerState.skills,
      studentName: currentUser.name,
      studentClass: currentUser.classLevel,
      lastActive: Date.now()
    });
  }
}

function calculateLevelCap(highestClearedFloor) {
  if (highestClearedFloor >= 9) return 99;
  return Math.min(99, (highestClearedFloor + 1) * 10);
}

function getTotalStats() {
  const eq = towerPlayerState.equipment;
  const eqAtk = eq.weapon ? (eq.weapon.atk || 0) : 0;
  const eqDef = eq.armor ? (eq.armor.def || 0) : 0;
  const eqHp = eq.relic ? (eq.relic.maxHp || 0) : 0;

  const feverMultiplier = towerPlayerState.feverTimer > 0 ? 2 : 1;

  return {
    atk: (towerPlayerState.baseStats.atk + towerPlayerState.bonusStats.atk + eqAtk) * feverMultiplier,
    def: towerPlayerState.baseStats.def + towerPlayerState.bonusStats.def + eqDef,
    maxHp: towerPlayerState.baseStats.maxHp + towerPlayerState.bonusStats.maxHp + eqHp,
    currentHp: Math.min(towerPlayerState.baseStats.currentHp, towerPlayerState.baseStats.maxHp + towerPlayerState.bonusStats.maxHp + eqHp)
  };
}

/* -------------------------------------------------------------
   IDLE AUTO-BATTLE CYCLE (60 FPS Game Loop)
------------------------------------------------------------- */
function startIdleBattleLoop() {
  if (idleBattleInterval) clearInterval(idleBattleInterval);

  spawnEnemyWave();

  idleBattleInterval = setInterval(() => {
    updateIdleCombatState();
    drawIdleBattleCanvas();
  }, 100); // 10 ticks/sec
}

function spawnEnemyWave() {
  activeEnemies = [];
  const floor = towerPlayerState.currentFloor;
  const enemyCount = 3 + Math.floor(Math.random() * 2);

  const monsterTypes = [
    { name: 'สเกเลตันนักดาบ', emoji: '💀⚔️', baseHp: 40 + (floor * 35), maxHp: 40 + (floor * 35), atk: 8 + (floor * 5) },
    { name: 'ออร์คค้อนหนาม', emoji: '👹🔨', baseHp: 65 + (floor * 50), maxHp: 65 + (floor * 50), atk: 12 + (floor * 7) },
    { name: 'ก็อบลินมีดคู่', emoji: '👺🗡️', baseHp: 30 + (floor * 25), maxHp: 30 + (floor * 25), atk: 10 + (floor * 6) }
  ];

  for (let i = 0; i < enemyCount; i++) {
    const template = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
    activeEnemies.push({
      id: 'enemy_' + Date.now() + '_' + i,
      name: template.name,
      emoji: template.emoji,
      hp: template.baseHp,
      maxHp: template.maxHp,
      atk: template.atk,
      x: 380 + (i * 70) + (Math.random() * 20),
      y: 70 + (i * 55),
      targetX: 200 + (i * 35)
    });
  }
}

function updateIdleCombatState() {
  if (towerPlayerState.feverTimer > 0) {
    towerPlayerState.feverTimer -= 0.1;
  }

  const totalStats = getTotalStats();

  // 1. Move Enemies leftward
  activeEnemies.forEach(e => {
    if (e.x > e.targetX) {
      e.x -= 3 * towerPlayerState.gameSpeed;
    }
  });

  // 2. Heroes Auto Attack
  HERO_PARTY.forEach(hero => {
    hero.attackCooldown -= 0.1 * towerPlayerState.gameSpeed;
    if (hero.attackCooldown <= 0 && activeEnemies.length > 0) {
      hero.attackCooldown = 0.8 + Math.random() * 0.4;

      // Target closest enemy
      const target = activeEnemies[0];
      if (target) {
        const damage = Math.round(totalStats.atk * (0.8 + Math.random() * 0.5));
        target.hp -= damage;

        // Damage Popup
        damagePopups.push({
          text: (damage * (1 + (Math.random() * 0.4))).toFixed(2),
          x: target.x + (Math.random() * 20 - 10),
          y: target.y - 15,
          opacity: 1,
          isCrit: towerPlayerState.feverTimer > 0
        });

        // Check if enemy dead
        if (target.hp <= 0) {
          activeEnemies.shift();
          handleEnemyKilled();
        }
      }
    }
  });

  // 3. Update Damage Popups
  damagePopups.forEach(p => {
    p.y -= 2;
    p.opacity -= 0.08;
  });
  damagePopups = damagePopups.filter(p => p.opacity > 0);

  // 4. Wave Cleared Check
  if (activeEnemies.length === 0) {
    towerPlayerState.currentWave++;
    if (towerPlayerState.currentWave > towerPlayerState.maxWavesPerFloor) {
      towerPlayerState.currentWave = towerPlayerState.maxWavesPerFloor;
    }
    spawnEnemyWave();
    updateWaveUI();
  }
}

function handleEnemyKilled() {
  const floor = towerPlayerState.currentFloor;
  const expGained = Math.round(15 * floor * (1 + Math.random() * 0.5));
  const goldGained = Math.round(8 * floor * (1 + Math.random() * 0.8));

  towerPlayerState.gold += goldGained;

  // Level Cap EXP check
  if (towerPlayerState.level < towerPlayerState.levelCap) {
    towerPlayerState.exp += expGained;
    const expNeeded = towerPlayerState.level * 100;
    if (towerPlayerState.exp >= expNeeded) {
      towerPlayerState.exp -= expNeeded;
      towerPlayerState.level += 1;
      towerPlayerState.baseStats.atk += 4;
      towerPlayerState.baseStats.def += 2;
      towerPlayerState.baseStats.maxHp += 20;
      towerPlayerState.baseStats.currentHp = towerPlayerState.baseStats.maxHp;
      showLevelUpToast();
    }
  }

  // 15% Chance to Drop Gear Loot
  if (Math.random() < 0.15) {
    const categories = ['weapons', 'armors', 'relics'];
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const items = TOWER_LOOT_TABLE[cat];
    const loot = items[Math.floor(Math.random() * items.length)];

    if (cat === 'weapons' && loot.atk > (towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.atk : 0)) {
      towerPlayerState.equipment.weapon = loot;
    } else if (cat === 'armors' && loot.def > (towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.def : 0)) {
      towerPlayerState.equipment.armor = loot;
    } else if (cat === 'relics' && loot.maxHp > (towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.maxHp : 0)) {
      towerPlayerState.equipment.relic = loot;
    }
  }

  updateStatsHeaderUI();
}

function showLevelUpToast() {
  const banner = document.getElementById('idle-levelup-toast');
  if (banner) {
    banner.style.display = 'block';
    setTimeout(() => { banner.style.display = 'none'; }, 2000);
  }
}

/* -------------------------------------------------------------
   CANVAS BATTLE GRAPHICS (Dynamic Side-View Arena)
------------------------------------------------------------- */
function drawIdleBattleCanvas() {
  const canvas = document.getElementById('idle-battle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Fantasy Blue Grass Dungeon Background
  const gradient = ctx.createLinearGradient(0, 0, 0, h);
  gradient.addColorStop(0, '#1e1b4b');
  gradient.addColorStop(0.5, '#1e3a8a');
  gradient.addColorStop(1, '#0f172a');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, w, h);

  // Floor terrain
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, h - 35, w, 35);
  ctx.fillStyle = '#38bdf8';
  ctx.fillRect(0, h - 35, w, 2);

  // 2. Draw Heroes on the Left
  HERO_PARTY.forEach(hero => {
    ctx.save();
    // Shadow
    ctx.beginPath();
    ctx.ellipse(hero.x + 15, hero.y + 35, 18, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();

    // Emoji Character Sprite
    ctx.font = '28px sans-serif';
    ctx.fillText(hero.emoji, hero.x, hero.y + 25);

    // Hero Name & Health Tag
    ctx.font = '10px Sarabun, sans-serif';
    ctx.fillStyle = '#93c5fd';
    ctx.fillText(hero.name.split(' ')[0], hero.x - 4, hero.y - 8);

    ctx.restore();
  });

  // 3. Draw Enemies on the Right
  activeEnemies.forEach(e => {
    ctx.save();
    // Shadow
    ctx.beginPath();
    ctx.ellipse(e.x + 15, e.y + 35, 18, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.fill();

    // Health Bar above enemy head (styled like screenshot)
    const barW = 55;
    const barH = 5;
    const hpRatio = Math.max(0, e.hp / e.maxHp);

    ctx.fillStyle = '#000000';
    ctx.fillRect(e.x, e.y - 12, barW, barH);
    ctx.fillStyle = '#eab308';
    ctx.fillRect(e.x, e.y - 12, barW, 1);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(e.x, e.y - 11, barW * hpRatio, barH - 2);

    // Enemy Sprite
    ctx.font = '28px sans-serif';
    ctx.fillText(e.emoji, e.x, e.y + 25);

    ctx.restore();
  });

  // 4. Draw Floating Damage Numbers (Exactly like screenshot e.g. 149.59, 52.94)
  damagePopups.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.font = p.isCrit ? 'bold 22px Courier New, monospace' : 'bold 18px Courier New, monospace';
    ctx.fillStyle = '#000000'; // Shadow stroke
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.isCrit ? '#fef08a' : '#ffffff';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  });

  // 5. Fever Mode Screen Aura
  if (towerPlayerState.feverTimer > 0) {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.font = 'bold 14px Sarabun, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`🔥 FEVER MODE x2 ATK (${towerPlayerState.feverTimer.toFixed(1)}s)`, w / 2 - 90, 24);
    ctx.restore();
  }
}

/* -------------------------------------------------------------
   RENDER MAIN TOWER VIEW & IDLE CONTROLS
------------------------------------------------------------- */
function renderTowerMainView() {
  const container = document.getElementById('view-tower');
  if (!container) return;

  const totalStats = getTotalStats();
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === towerPlayerState.currentFloor) || TOWER_FLOORS_DATA[0];
  const isBossReady = towerPlayerState.currentWave >= towerPlayerState.maxWavesPerFloor;

  let html = `
    <div class="idle-tower-wrapper">
      
      <!-- Top Level & Stat Sheet -->
      <div class="idle-header-dashboard">
        <div class="idle-hero-profile">
          <div class="idle-hero-avatar">
            <span>🧙‍♂️</span>
            <span class="hero-lvl-chip">Lv. ${towerPlayerState.level}</span>
          </div>
          <div class="idle-hero-details">
            <div class="idle-hero-title-row">
              <h3 class="hero-name-heading">${currentUser ? currentUser.name : 'นักผจญภัย'}</h3>
              <span class="hero-cap-chip"><i class="fa-solid fa-lock"></i> เพดาน: Lv. ${towerPlayerState.levelCap}</span>
            </div>
            <div class="idle-exp-wrapper">
              <div class="idle-exp-track">
                <div class="idle-exp-fill" id="idle-exp-bar" style="width:${Math.min(100, (towerPlayerState.exp / (towerPlayerState.level * 100)) * 100)}%;"></div>
              </div>
              <span class="idle-exp-text" id="idle-exp-text">EXP: ${towerPlayerState.exp}/${towerPlayerState.level * 100}</span>
            </div>
          </div>
        </div>

        <!-- 3 Core Stats -->
        <div class="idle-stats-trio">
          <div class="idle-stat-badge atk" title="พลังโจมตีฮีโร่">
            <i class="fa-solid fa-khanda"></i>
            <div><span>โจมตี (ATK)</span><strong id="idle-stat-atk">${totalStats.atk}</strong></div>
          </div>
          <div class="idle-stat-badge def" title="พลังป้องกันฮีโร่">
            <i class="fa-solid fa-shield-halved"></i>
            <div><span>ป้องกัน (DEF)</span><strong id="idle-stat-def">${totalStats.def}</strong></div>
          </div>
          <div class="idle-stat-badge hp" title="พลังชีวิตสูงสุด">
            <i class="fa-solid fa-heart-pulse"></i>
            <div><span>พลังชีวิต (HP)</span><strong id="idle-stat-hp">${totalStats.maxHp}</strong></div>
          </div>
        </div>

        <!-- Gold Balance & Level Up Toast -->
        <div class="idle-currency-box">
          <span class="gold-badge"><i class="fa-solid fa-coins" style="color:#fbbf24;"></i> <strong id="idle-gold-val">${towerPlayerState.gold}</strong> ทอง</span>
          <div id="idle-levelup-toast" class="idle-toast" style="display:none;">✨ LEVEL UP! ✨</div>
        </div>
      </div>

      <!-- Main Side-View Idle Battle Arena Screen (Like Screenshot) -->
      <div class="idle-battle-screen-card">
        <div class="battle-stage-header">
          <div class="stage-info">
            <span class="floor-pill"><i class="fa-solid fa-dungeon"></i> ชั้นที่ ${floorData.floor}: ${floorData.name}</span>
            <span class="wave-pill" id="idle-wave-pill"><i class="fa-solid fa-skull"></i> เวฟ ${towerPlayerState.currentWave} / ${towerPlayerState.maxWavesPerFloor}</span>
          </div>
          <div class="stage-controls">
            <button class="btn btn-sm ${towerPlayerState.gameSpeed === 2 ? 'btn-warning' : 'btn-outline-light'}" onclick="toggleGameSpeed()">
              <i class="fa-solid fa-forward"></i> ${towerPlayerState.gameSpeed}x Speed
            </button>
            <button class="btn btn-sm btn-info" onclick="openLogicBoostModal()">
              <i class="fa-solid fa-brain"></i> 💡 ไขปริศนาเร่งพลัง (Fever Boost)
            </button>
          </div>
        </div>

        <!-- HTML5 Canvas Arena -->
        <div class="canvas-container">
          <canvas id="idle-battle-canvas" width="680" height="260"></canvas>
        </div>

        <!-- Boss Trigger Banner / Stage Progress -->
        <div class="battle-stage-footer">
          ${isBossReady ? `
            <div class="boss-ready-glow-box">
              <span class="boss-alert-text">🔥 เคลียร์ครบ 10 เวฟแล้ว! ประตูบอสประจำชั้นเปิดออกแล้ว!</span>
              <button class="btn btn-danger-glow" onclick="openBossRaidModal(${floorData.floor})">
                <i class="fa-solid fa-skull-crossbones"></i> ท้าทายบอสประจำชั้น (Boss Lv. ${floorData.boss.level})
              </button>
            </div>
          ` : `
            <div class="wave-progress-bar-box">
              <span>ความคืบหน้าการฟาร์มมอนสเตอร์ในชั้นนี้: <strong>${towerPlayerState.currentWave}/${towerPlayerState.maxWavesPerFloor} เวฟ</strong></span>
              <div class="wave-track"><div class="wave-fill" style="width:${(towerPlayerState.currentWave / towerPlayerState.maxWavesPerFloor) * 100}%;"></div></div>
            </div>
          `}
        </div>
      </div>

      <!-- Lower Controls: Equipment, Upgrades & Floor Selector -->
      <div class="idle-bottom-grid">
        
        <!-- Equipped Gear -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-shield" style="color:#38bdf8;"></i> อุปกรณ์สวมใส่ที่ดรอปได้</h4>
          <div class="gear-showcase-row">
            <div class="gear-card-box ${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.rarity : ''}">
              <span class="g-icon">${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.icon : '🗡️'}</span>
              <div class="g-meta">
                <strong>${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.name : 'ไม่มีอาวุธ'}</strong>
                <span>+${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.atk : 0} ATK</span>
              </div>
            </div>
            <div class="gear-card-box ${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.rarity : ''}">
              <span class="g-icon">${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.icon : '🛡️'}</span>
              <div class="g-meta">
                <strong>${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.name : 'ไม่มีชุดเกราะ'}</strong>
                <span>+${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.def : 0} DEF</span>
              </div>
            </div>
            <div class="gear-card-box ${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.rarity : ''}">
              <span class="g-icon">${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.icon : '💍'}</span>
              <div class="g-meta">
                <strong>${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.name : 'ไม่มีเครื่องราง'}</strong>
                <span>+${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.maxHp : 0} HP</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Gold Stat Upgrades -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-arrow-up-right-dots" style="color:#fbbf24;"></i> อัปเกรดพลังด้วยเหรียญทอง</h4>
          <div class="upgrade-btn-grid">
            <button class="upgrade-btn" onclick="buyStatUpgrade('atk')">
              <span>⚔️ อัปเกรด ATK (+3)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 ทอง</strong>
            </button>
            <button class="upgrade-btn" onclick="buyStatUpgrade('def')">
              <span>🛡️ อัปเกรด DEF (+2)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 ทอง</strong>
            </button>
            <button class="upgrade-btn" onclick="buyStatUpgrade('maxHp')">
              <span>❤️ อัปเกรด HP (+25)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 ทอง</strong>
            </button>
          </div>
        </div>

        <!-- 10-Floor Stage Select -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-mountain" style="color:#a855f7;"></i> เลือกชั้นหอคอยที่ต้องการฟาร์ม</h4>
          <div class="floor-selector-list">
            ${TOWER_FLOORS_DATA.map(f => {
              const isUnlocked = f.floor <= (towerPlayerState.highestClearedFloor + 1);
              const isSelected = f.floor === towerPlayerState.currentFloor;
              return `
                <button class="floor-select-btn ${isSelected ? 'active' : ''} ${isUnlocked ? '' : 'disabled'}" onclick="${isUnlocked ? `changeCurrentFloor(${f.floor})` : `showPopupInfo('ชั้นนี้ถูกล็อค', 'กรุณาพิชิตบอสชั้นที่ ${f.floor - 1} ก่อนครับ')`}">
                  <span>F${f.floor}</span>
                  <small>${f.name.split(' ')[0]}</small>
                  ${!isUnlocked ? '<i class="fa-solid fa-lock" style="font-size:0.7rem;"></i>' : ''}
                </button>
              `;
            }).join('')}
          </div>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;
}

function updateWaveUI() {
  const wavePill = document.getElementById('idle-wave-pill');
  if (wavePill) {
    wavePill.innerHTML = `<i class="fa-solid fa-skull"></i> เวฟ ${towerPlayerState.currentWave} / ${towerPlayerState.maxWavesPerFloor}`;
  }
}

function updateStatsHeaderUI() {
  const totalStats = getTotalStats();
  const expBar = document.getElementById('idle-exp-bar');
  const expText = document.getElementById('idle-exp-text');
  const goldVal = document.getElementById('idle-gold-val');

  if (expBar) expBar.style.width = `${Math.min(100, (towerPlayerState.exp / (towerPlayerState.level * 100)) * 100)}%`;
  if (expText) expText.innerText = `EXP: ${towerPlayerState.exp}/${towerPlayerState.level * 100}`;
  if (goldVal) goldVal.innerText = towerPlayerState.gold;

  const atkEl = document.getElementById('idle-stat-atk');
  const defEl = document.getElementById('idle-stat-def');
  const hpEl = document.getElementById('idle-stat-hp');
  if (atkEl) atkEl.innerText = totalStats.atk;
  if (defEl) defEl.innerText = totalStats.def;
  if (hpEl) hpEl.innerText = totalStats.maxHp;
}

function toggleGameSpeed() {
  towerPlayerState.gameSpeed = towerPlayerState.gameSpeed === 1 ? 2 : 1;
  renderTowerMainView();
}

function changeCurrentFloor(floorNum) {
  towerPlayerState.currentFloor = floorNum;
  towerPlayerState.currentWave = 1;
  spawnEnemyWave();
  renderTowerMainView();
}

function buyStatUpgrade(statType) {
  if (towerPlayerState.gold >= 50) {
    towerPlayerState.gold -= 50;
    if (statType === 'atk') towerPlayerState.bonusStats.atk += 3;
    if (statType === 'def') towerPlayerState.bonusStats.def += 2;
    if (statType === 'maxHp') towerPlayerState.bonusStats.maxHp += 25;

    saveStudentTowerProgress();
    renderTowerMainView();
    showPopupSuccess('อัปเกรดสำเร็จ!', `เพิ่มพลังสเตตัสให้กับตัวละครเรียบร้อยแล้ว`);
  } else {
    showPopupError('เหรียญทองไม่พอ!', 'คุณต้องมีอย่างน้อย 50 เหรียญทองจากการฟาร์มมอนสเตอร์ครับ');
  }
}

/* -------------------------------------------------------------
   LOGIC BOOST PUZZLE MODAL (Interactive Learning Quiz)
------------------------------------------------------------- */
function openLogicBoostModal() {
  const floor = towerPlayerState.currentFloor;
  const bank = TOWER_PUZZLE_BANK[floor] || TOWER_PUZZLE_BANK[1];
  const puzzle = bank[Math.floor(Math.random() * bank.length)];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-logic-boost" style="z-index:10010;">
      <div class="modal-container modal-puzzle-box">
        <div class="modal-header" style="background:#0f172a; color:#fff; border-bottom:2px solid #38bdf8;">
          <h3 class="modal-title" style="color:#fff; margin:0; font-size:1.1rem;"><i class="fa-solid fa-brain" style="color:#38bdf8;"></i> ปริศนาตรรกะเร่งพลังเวทมนตร์ (Fever Boost)</h3>
          <button class="btn-close-modal" onclick="closeModal('modal-logic-boost')"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding:22px 20px;">
          <div class="puzzle-q-box">
            <span class="puzzle-badge">โจทย์วิทยาการคำนวณชั้นที่ ${floor}</span>
            <h4 class="puzzle-question-text">${puzzle.q}</h4>
          </div>

          <div class="puzzle-options-list">
            ${puzzle.options.map((opt, idx) => `
              <button class="puzzle-opt-btn" onclick="submitLogicBoost(${idx}, ${puzzle.ans})">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-logic-boost');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function submitLogicBoost(chosenIdx, correctIdx) {
  closeModal('modal-logic-boost');

  if (chosenIdx === correctIdx) {
    // Grant FEVER MODE + 100 EXP + 50 Gold + Stat Buff
    towerPlayerState.feverTimer = 15; // 15 seconds of x2 ATK
    towerPlayerState.gold += 60;
    towerPlayerState.exp += 80;
    towerPlayerState.bonusStats.atk += 2;

    saveStudentTowerProgress();
    renderTowerMainView();

    showPopupSuccess('ยอดเยี่ยมมาก!', 'ตอบถูกต้อง! คุณได้รับ FEVER MODE x2 ATK 15 วินาที พร้อม +80 EXP, +60 ทอง, และ +2 ATK ถาวร!');
  } else {
    showPopupError('ตอบผิดพลาด!', 'คำตอบยังไม่ถูกต้อง ทบทวนตรรกะแล้วลองใหม่อีกครั้งนะครับ');
  }
}

/* -------------------------------------------------------------
   CLASSROOM CO-OP RAID BOSS ENGINE
------------------------------------------------------------- */
let activeRaidFloor = 1;
let activeRaidBoss = null;
let currentRaidQuestion = null;

function openBossRaidModal(floorNum) {
  activeRaidFloor = floorNum;
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === floorNum);
  if (!floorData) return;

  activeRaidBoss = { ...floorData.boss };
  const studentClass = currentUser ? (currentUser.classLevel || 'room1') : 'room1';
  const raidKey = `tower_raids/${studentClass}/floor_${floorNum}`;

  if (typeof firebase !== 'undefined' && firebase.database) {
    const raidRef = firebase.database().ref(raidKey);
    raidRef.once('value').then((snapshot) => {
      let data = snapshot.val();
      if (!data || data.bossHp <= 0) {
        data = {
          bossHp: floorData.boss.maxHp,
          maxHp: floorData.boss.maxHp,
          bossName: floorData.boss.name,
          bossLevel: floorData.boss.level,
          lastAttackBy: 'ระบบ',
          lastDamage: 0
        };
        raidRef.set(data);
      }
      listenToClassroomRaid(raidRef, floorData);
    });
  } else {
    renderRaidArena(floorData, activeRaidBoss.maxHp);
  }
}

function listenToClassroomRaid(raidRef, floorData) {
  renderRaidArena(floorData, floorData.boss.maxHp);

  raidRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const hpPercent = Math.max(0, Math.min(100, (data.bossHp / data.maxHp) * 100));
    const hpBar = document.getElementById('raid-boss-hp-fill');
    const hpText = document.getElementById('raid-boss-hp-text');
    const combatFeed = document.getElementById('raid-combat-feed');

    if (hpBar) hpBar.style.width = `${hpPercent}%`;
    if (hpText) hpText.innerText = `${data.bossHp} / ${data.maxHp} HP (${Math.round(hpPercent)}%)`;

    if (combatFeed && data.lastDamage > 0) {
      const feedItem = `<div class="combat-feed-item">💥 <strong>${data.lastAttackBy}</strong> โจมตีบอส <strong>-${data.lastDamage}</strong> ดาเมจ!</div>`;
      combatFeed.insertAdjacentHTML('afterbegin', feedItem);
    }

    if (data.bossHp <= 0) {
      raidRef.off();
      handleBossDefeatedByClassroom(floorData.floor);
    }
  });

  generateNextRaidPuzzle();
}

function renderRaidArena(floorData, initialHp) {
  const totalStats = getTotalStats();

  const arenaHtml = `
    <div class="modal-overlay active" id="modal-boss-raid" style="z-index:10020;">
      <div class="modal-container modal-raid-arena">
        
        <div class="raid-header-bar">
          <div class="raid-title-group">
            <span class="raid-tag">🔥 CLASSROOM CO-OP RAID BOSS</span>
            <h3 class="raid-boss-name">${floorData.boss.name} (Lv. ${floorData.boss.level})</h3>
          </div>
          <button class="btn-close-modal" onclick="leaveBossRaid()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="raid-boss-stage">
          <div class="boss-giant-avatar">
            <span class="boss-big-emoji">${floorData.boss.avatar}</span>
          </div>

          <div class="boss-hp-wrapper">
            <div class="boss-hp-info">
              <span><i class="fa-solid fa-heart" style="color:#ef4444;"></i> พลังชีวิตบอสห้องเรียน (Shared HP)</span>
              <strong id="raid-boss-hp-text">${initialHp} / ${floorData.boss.maxHp} HP</strong>
            </div>
            <div class="boss-hp-track">
              <div class="boss-hp-fill" id="raid-boss-hp-fill" style="width:100%;"></div>
            </div>
          </div>
        </div>

        <div class="raid-combat-feed" id="raid-combat-feed">
          <div class="combat-feed-item">⚔️ การต่อสู้เริ่มขึ้นแล้ว! นักเรียนทุกคนช่วยกันตอบคำถามเพื่อสร้างดาเมจใส่บอส!</div>
        </div>

        <div class="raid-combat-station">
          <div class="raid-q-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="q-badge"><i class="fa-solid fa-bolt"></i> โจมตีบอสด้วยปัญญา</span>
              <span class="player-stat-quick">⚔️ ATK ของคุณ: <strong>${totalStats.atk}</strong></span>
            </div>
            <h4 class="raid-q-text" id="raid-question-display">กำลังโหลดโจทย์ตรรกะ...</h4>
          </div>

          <div class="raid-options-grid" id="raid-options-container">
            <!-- Rendered choices -->
          </div>

          <div class="raid-skills-bar">
            <span style="font-size:0.78rem; font-weight:700; color:#94a3b8; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-wand-magic-sparkles"></i> ร่ายสกิลพิเศษ:
            </span>
            <div class="raid-skill-buttons">
              ${towerPlayerState.skills.map(sId => {
                const skill = TOWER_ALL_SKILLS.find(s => s.id === sId) || { name: sId, icon: 'fa-star' };
                return `
                  <button class="btn-skill-cast" onclick="castSkillInRaid('${sId}')" title="${skill.name}">
                    <i class="fa-solid ${skill.icon}"></i> ${skill.name}
                  </button>
                `;
              }).join('')}
            </div>
          </div>
        </div>

      </div>
    </div>
  `;

  const existing = document.getElementById('modal-boss-raid');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', arenaHtml);
}

function generateNextRaidPuzzle() {
  const bank = TOWER_PUZZLE_BANK[activeRaidFloor] || TOWER_PUZZLE_BANK[1];
  currentRaidQuestion = bank[Math.floor(Math.random() * bank.length)];

  const qDisplay = document.getElementById('raid-question-display');
  const optContainer = document.getElementById('raid-options-container');

  if (qDisplay) qDisplay.innerText = currentRaidQuestion.q;
  if (optContainer) {
    optContainer.innerHTML = currentRaidQuestion.options.map((opt, idx) => `
      <button class="raid-opt-btn" onclick="executeRaidAttack(${idx}, ${currentRaidQuestion.ans})">
        <span class="opt-num">${String.fromCharCode(65 + idx)}</span>
        <span class="opt-val">${opt}</span>
      </button>
    `).join('');
  }
}

function executeRaidAttack(chosenIdx, correctIdx) {
  const totalStats = getTotalStats();

  if (chosenIdx === correctIdx) {
    const baseDamage = totalStats.atk * 4 + Math.floor(Math.random() * 20);
    sendDamageToRaidBoss(baseDamage);
    generateNextRaidPuzzle();
  } else {
    showPopupError('ตอบผิดพลาด!', 'ตอบผิดทำให้การโจมตีไร้ผล! ลองตอบข้อถัดไปเพื่อแก้ตัวใหม่');
    generateNextRaidPuzzle();
  }
}

function castSkillInRaid(skillId) {
  const totalStats = getTotalStats();
  if (skillId === 'oracle_eye') {
    const btns = document.querySelectorAll('.raid-opt-btn');
    let hidden = 0;
    btns.forEach((btn, idx) => {
      if (idx !== currentRaidQuestion.ans && hidden < 2) {
        btn.style.opacity = '0.2';
        btn.style.pointerEvents = 'none';
        hidden++;
      }
    });
    showPopupSuccess('เนตรหยั่งรู้!', 'ตัดตัวเลือกที่ผิดทิ้ง 2 ตัวเลือก!');
  } else if (skillId === 'critical_mind') {
    const critDamage = totalStats.atk * 10;
    sendDamageToRaidBoss(critDamage);
    showPopupSuccess('CRITICAL HIT!', `ระเบิดปัญญาสร้างดาเมจรุนแรง -${critDamage} ดาเมจใส่บอส!`);
    generateNextRaidPuzzle();
  } else {
    const spellDamage = totalStats.atk * 6;
    sendDamageToRaidBoss(spellDamage);
    showPopupSuccess('ร่ายเวทมนตร์สำเร็จ!', `สร้างดาเมจ -${spellDamage} ดาเมจใส่บอส!`);
    generateNextRaidPuzzle();
  }
}

function sendDamageToRaidBoss(damage) {
  const studentClass = currentUser ? (currentUser.classLevel || 'room1') : 'room1';
  const raidKey = `tower_raids/${studentClass}/floor_${activeRaidFloor}`;

  if (typeof firebase !== 'undefined' && firebase.database) {
    const bossRef = firebase.database().ref(raidKey);
    bossRef.transaction((currentData) => {
      if (currentData) {
        currentData.bossHp = Math.max(0, currentData.bossHp - damage);
        currentData.lastAttackBy = currentUser ? currentUser.name : 'นักเรียน';
        currentData.lastDamage = damage;
      }
      return currentData;
    });
  }
}

function leaveBossRaid() {
  const studentClass = currentUser ? (currentUser.classLevel || 'room1') : 'room1';
  const raidKey = `tower_raids/${studentClass}/floor_${activeRaidFloor}`;
  if (typeof firebase !== 'undefined' && firebase.database) {
    firebase.database().ref(raidKey).off();
  }
  closeModal('modal-boss-raid');
  saveStudentTowerProgress();
  renderTowerMainView();
}

function handleBossDefeatedByClassroom(floorNum) {
  closeModal('modal-boss-raid');

  if (floorNum > towerPlayerState.highestClearedFloor) {
    towerPlayerState.highestClearedFloor = floorNum;
  }

  towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);

  // Unlock next floor automatically
  if (towerPlayerState.currentFloor < 10) {
    towerPlayerState.currentFloor++;
    towerPlayerState.currentWave = 1;
  }

  const availableSkills = TOWER_ALL_SKILLS.filter(s => !towerPlayerState.skills.includes(s.id));
  let newSkillGranted = null;
  if (availableSkills.length > 0) {
    newSkillGranted = availableSkills[Math.floor(Math.random() * availableSkills.length)];
    towerPlayerState.skills.push(newSkillGranted.id);
  }

  saveStudentTowerProgress();
  renderTowerMainView();

  const html = `
    <div class="modal-overlay active" id="modal-boss-victory" style="z-index:10030;">
      <div class="modal-container modal-grand-victory">
        <div class="victory-crown-hero">👑</div>
        <h2 class="victory-title">พิชิตบอสชั้นที่ ${floorNum} สำเร็จ!</h2>
        <p class="victory-desc">ห้องเรียนของคุณร่วมมือกันปราบมหาบอสได้สำเร็จ และปลดล็อกเพดานเลเวลใหม่เรียบร้อยแล้ว!</p>

        <div class="victory-rewards-box">
          <div class="v-reward-item">
            <span class="v-icon">🔓</span>
            <div>
              <strong>ปลดล็อกเพดานเลเวลใหม่:</strong>
              <span>คุณสามารถเก็บเลเวลได้สูงสุดถึง <strong style="color:#fbbf24;">Lv. ${towerPlayerState.levelCap}</strong></span>
            </div>
          </div>

          ${newSkillGranted ? `
            <div class="v-reward-item skill-reward">
              <span class="v-icon"><i class="fa-solid ${newSkillGranted.icon}" style="color:${newSkillGranted.color};"></i></span>
              <div>
                <strong>ได้รับสกิลพิเศษถาวรใหม่: ${newSkillGranted.name}</strong>
                <span>${newSkillGranted.desc}</span>
              </div>
            </div>
          ` : ''}
        </div>

        <button class="btn btn-primary-large" onclick="closeModal('modal-boss-victory')" style="width:100%; margin-top:16px;">
          <i class="fa-solid fa-forward"></i> ลุยต่อชั้นถัดไป
        </button>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-boss-victory');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', html);
}
