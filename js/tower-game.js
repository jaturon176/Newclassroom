/* ==========================================================================
   TOWER OF WISDOM: RAGNAROK-STYLE ACTION RPG & LOGIC DUNGEON
   หอคอยแห่งปัญญา 10 ชั้น: ระบบเกม Action RPG ควบคุมตัวละครอิสระสไตล์ Ragnarok
   ========================================================================== */

// Player Hero Character State (Ragnarok Mechanics)
let roHero = {
  x: 200,
  y: 200,
  targetX: 200,
  targetY: 200,
  speed: 3.8,
  direction: 'down',
  isMoving: false,
  isAttacking: false,
  targetEnemy: null,
  attackRange: 48,
  attackCooldown: 0,
  maxAttackCooldown: 0.45,
  castCircle: 0,
  skillsCooldown: { skill1: 0, skill2: 0, heal: 0 }
};

// Global Game State
let towerPlayerState = {
  level: 1,
  exp: 0,
  gold: 200,
  levelCap: 10,
  highestClearedFloor: 0,
  currentFloor: 1,
  baseStats: { atk: 18, def: 10, maxHp: 150, currentHp: 150, maxSp: 80, currentSp: 80 },
  bonusStats: { atk: 0, def: 0, maxHp: 0 },
  equipment: {
    weapon: { name: 'ดาบเหล็กผู้กล้า (Novice Blade)', rarity: 'common', atk: 10, icon: '⚔️' },
    armor: { name: 'เสื้อเกราะผ้า (Adventurer Suit)', rarity: 'common', def: 6, icon: '🛡️' },
    relic: { name: 'แหวนรูนฝึกหัด (Rune Ring)', rarity: 'common', maxHp: 50, icon: '💍' }
  },
  skills: ['bash_strike', 'fire_bolt', 'heal_light'],
  feverTimer: 0,
  monstersDefeatedOnFloor: 0,
  monstersNeededForBoss: 8
};

// All Ragnarok-Style Action Skills
const RO_SKILLS = {
  bash_strike: { id: 'bash_strike', name: 'Bash (ฟันกระแทก)', sp: 15, cooldown: 3, icon: 'fa-gavel', color: '#f59e0b', desc: 'ฟันศัตรูอย่างรุนแรง ดาเมจ 280% พร้อมผลักกระเด็น' },
  fire_bolt: { id: 'fire_bolt', name: 'Fire Bolt (บอลเพลิง)', sp: 25, cooldown: 5, icon: 'fa-fire-flame-curved', color: '#ef4444', desc: 'ยิงลูกไฟเวทมนตร์ระยะไกล ดาเมจ 350%' },
  heal_light: { id: 'heal_light', name: 'Heal (แสงฟื้นฟู)', sp: 20, cooldown: 6, icon: 'fa-heart', color: '#10b981', desc: 'ฟื้นฟูเลือด HP 45% ให้ตนเองทันที' },
  sonic_blow: { id: 'sonic_blow', name: 'Sonic Blow (เพลงดาบวายุ)', sp: 35, cooldown: 8, icon: 'fa-bolt', color: '#8b5cf6', desc: 'ฟันรัวต่อเนื่อง 6 ฮิต ดาเมจมหาศาล' }
};

// 10 Floors Data & Boss Configurations
const TOWER_FLOORS_DATA = [
  { floor: 1, name: 'วิหารสัจนิรันดร์ (Prontera Catacombs)', theme: 'ตรรกศาสตร์ & Logic Gates', levelCap: 10, boss: { name: 'โกเลมหินสัจจะ (Logic Golem)', level: 10, maxHp: 2500, atk: 18, def: 8, avatar: '🗿' } },
  { floor: 2, name: 'ถ้ำอนุกรมเวทมนตร์ (Payon Cave)', theme: 'การหารูปแบบ & Sequences', levelCap: 20, boss: { name: 'พญางูลำดับอนันต์ (Infinite Serpent)', level: 20, maxHp: 5000, atk: 28, def: 14, avatar: '🐍' } },
  { floor: 3, name: 'ป่าเขาวงกตผังงาน (Labyrinth Forest)', theme: 'Flowcharts & Algorithms', levelCap: 30, boss: { name: 'ภูตเขาวงกต (Labyrinth Sprite)', level: 30, maxHp: 9000, atk: 42, def: 22, avatar: '🧚' } },
  { floor: 4, name: 'หุบเขาเลขฐานสอง (Binary Valley)', theme: 'Binary & Bitwise Logic', levelCap: 40, boss: { name: 'การ์กอยล์ทวิภาค (Binary Gargoyle)', level: 40, maxHp: 14000, atk: 58, def: 30, avatar: '🦇' } },
  { floor: 5, name: 'สุสานข้อผิดพลาด (Catacombs of Bugs)', theme: 'Code Debugging Trials', levelCap: 50, boss: { name: 'ราชินีบั๊กมรณะ (The Bug Queen)', level: 50, maxHp: 20000, atk: 75, def: 40, avatar: '🦂' } },
  { floor: 6, name: 'หอสมุดเงื่อนไขซ้อน (Geffen Library)', theme: 'If-Else & Conditionals', levelCap: 60, boss: { name: 'จอมเวทเงื่อนไข (Conditional Mage)', level: 60, maxHp: 28000, atk: 95, def: 52, avatar: '🧙‍♂️' } },
  { floor: 7, name: 'ห้องนิรภัยอาร์เรย์ (Array Sanctuary)', theme: 'Arrays, Stacks & Queues', levelCap: 70, boss: { name: 'อัศวินผลึกโครงสร้าง (Structure Knight)', level: 70, maxHp: 38000, atk: 118, def: 65, avatar: '🛡️' } },
  { floor: 8, name: 'ผาฟังก์ชันเพลิง (Magma Cliff)', theme: 'Functions & Loops', levelCap: 80, boss: { name: 'มังกรเพลิงฟังก์ชัน (Recursive Dragon)', level: 80, maxHp: 50000, atk: 142, def: 78, avatar: '🐉' } },
  { floor: 9, name: 'ปราสาทถอดรหัส (Cipher Castle)', theme: 'Cryptography & Ciphers', levelCap: 90, boss: { name: 'ชาโดว์รหัสลับ (Cipher Phantom)', level: 90, maxHp: 65000, atk: 170, def: 90, avatar: '👤' } },
  { floor: 10, name: 'บัลลังก์จักรกล AI (AI Overlord Core)', theme: 'AI Logic & Systems', levelCap: 99, boss: { name: 'ผู้คุมกฎแห่งมิติดิจิทัล (AI Mastermind)', level: 100, maxHp: 100000, atk: 210, def: 110, avatar: '🤖' } }
];

// Equipment Loot Table
const TOWER_LOOT_TABLE = {
  weapons: [
    { name: 'ดาบเหล็กตรรกะ', rarity: 'common', atk: 12, icon: '⚔️' },
    { name: 'คทาเวทมนตร์รูน', rarity: 'rare', atk: 26, icon: '🪄' },
    { name: 'ดาบคริสตัลอัลกอริทึม', rarity: 'rare', atk: 45, icon: '💎' },
    { name: 'หอกสายฟ้าทวิภาค', rarity: 'epic', atk: 70, icon: '⚡' },
    { name: 'ดาบแห่งแสงปัญญา AI', rarity: 'legendary', atk: 120, icon: '🌟' }
  ],
  armors: [
    { name: 'เกราะหนังนักผจญภัย', rarity: 'common', def: 10, icon: '🛡️' },
    { name: 'ชุดคลุมจอมเวทคัดสรร', rarity: 'rare', def: 25, icon: '👘' },
    { name: 'เกราะเพลทผลึกศิลา', rarity: 'epic', def: 52, icon: '🛡️' },
    { name: 'เกราะทองคำเทพพิทักษ์', rarity: 'legendary', def: 88, icon: '👑' }
  ],
  relics: [
    { name: 'สร้อยคอหินนำโชค', rarity: 'common', maxHp: 70, icon: '📿' },
    { name: 'จี้ห้อยคอหัวใจมังกร', rarity: 'rare', maxHp: 150, icon: '❤️' },
    { name: 'แหวนรูนชีวิตนิรันดร์', rarity: 'epic', maxHp: 260, icon: '💍' },
    { name: 'มงกุฎจักรพรรดิแห่งปัญญา', rarity: 'legendary', maxHp: 450, icon: '👑' }
  ]
};

// Logic Puzzle Bank for Rune Altars
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

// Map Dungeon Monsters & Objects
let dungeonMonsters = [];
let groundLoots = [];
let damagePopups = [];
let targetMoveIndicator = null;
let gameLoopAnimationId = null;

// Rune Altars on Map
let runeAltar = { x: 380, y: 120, radius: 26, isSolved: false };

/* -------------------------------------------------------------
   INITIALIZATION & MAP SPAWN
------------------------------------------------------------- */
function initTowerGameModule() {
  if (!currentUser) return;
  loadStudentTowerProgress();
  setupDungeonMap(towerPlayerState.currentFloor);
  startRagnarokGameLoop();
}

function setupDungeonMap(floorNum) {
  dungeonMonsters = [];
  groundLoots = [];
  damagePopups = [];
  roHero.x = 100;
  roHero.y = 260;
  roHero.targetX = 100;
  roHero.targetY = 260;
  roHero.targetEnemy = null;

  runeAltar = { x: 420, y: 130, radius: 26, isSolved: false };

  // Monster Spawns for this floor
  const monsterDefs = [
    { name: 'Poring สัจจะ', emoji: '💧', hp: 80 + (floorNum * 40), maxHp: 80 + (floorNum * 40), atk: 8 + (floorNum * 4), exp: 25, speed: 1.2 },
    { name: 'Skeleton นักรบ', emoji: '💀', hp: 120 + (floorNum * 50), maxHp: 120 + (floorNum * 50), atk: 14 + (floorNum * 6), exp: 40, speed: 1.5 },
    { name: 'Orc ค้อนศิลา', emoji: '👹', hp: 180 + (floorNum * 70), maxHp: 180 + (floorNum * 70), atk: 20 + (floorNum * 8), exp: 65, speed: 1.0 },
    { name: 'Fabre หนอนตรรกะ', emoji: '🐛', hp: 60 + (floorNum * 30), maxHp: 60 + (floorNum * 30), atk: 6 + (floorNum * 3), exp: 20, speed: 0.9 }
  ];

  const spawnPoints = [
    { x: 300, y: 180 }, { x: 480, y: 220 }, { x: 600, y: 150 },
    { x: 550, y: 320 }, { x: 350, y: 340 }, { x: 220, y: 140 }
  ];

  spawnPoints.forEach((sp, idx) => {
    const template = monsterDefs[idx % monsterDefs.length];
    dungeonMonsters.push({
      id: 'mob_' + Date.now() + '_' + idx,
      name: template.name,
      emoji: template.emoji,
      x: sp.x + (Math.random() * 30 - 15),
      y: sp.y + (Math.random() * 30 - 15),
      homeX: sp.x,
      homeY: sp.y,
      hp: template.hp,
      maxHp: template.maxHp,
      atk: template.atk,
      exp: template.exp,
      speed: template.speed,
      attackCooldown: 0,
      radius: 20,
      state: 'idle',
      aggroRadius: 130
    });
  });
}

function loadStudentTowerProgress() {
  const studentKey = currentUser.studentId || currentUser.username || 'default_player';
  if (typeof firebase !== 'undefined' && firebase.database) {
    firebase.database().ref(`tower_players/${studentKey}`).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        towerPlayerState.level = data.level || 1;
        towerPlayerState.exp = data.exp || 0;
        towerPlayerState.gold = data.gold || 200;
        towerPlayerState.highestClearedFloor = data.highestClearedFloor || 0;
        towerPlayerState.currentFloor = data.currentFloor || 1;
        towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);
        towerPlayerState.baseStats = data.baseStats || { atk: 18 + (towerPlayerState.level * 4), def: 10 + (towerPlayerState.level * 2), maxHp: 150 + (towerPlayerState.level * 20), currentHp: 150 + (towerPlayerState.level * 20), maxSp: 80, currentSp: 80 };
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
    currentHp: towerPlayerState.baseStats.currentHp,
    maxSp: towerPlayerState.baseStats.maxSp || 80,
    currentSp: towerPlayerState.baseStats.currentSp || 80
  };
}

/* -------------------------------------------------------------
   60 FPS RAGNAROK ACTION GAME LOOP
------------------------------------------------------------- */
function startRagnarokGameLoop() {
  if (gameLoopAnimationId) cancelAnimationFrame(gameLoopAnimationId);

  let lastTime = performance.now();

  function loop(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    updateRagnarokWorld(dt);
    drawRagnarokCanvas();

    gameLoopAnimationId = requestAnimationFrame(loop);
  }

  gameLoopAnimationId = requestAnimationFrame(loop);
}

function updateRagnarokWorld(dt) {
  const totalStats = getTotalStats();

  // Cooldowns
  if (roHero.attackCooldown > 0) roHero.attackCooldown -= dt;
  if (roHero.skillsCooldown.skill1 > 0) roHero.skillsCooldown.skill1 -= dt;
  if (roHero.skillsCooldown.skill2 > 0) roHero.skillsCooldown.skill2 -= dt;
  if (roHero.skillsCooldown.heal > 0) roHero.skillsCooldown.heal -= dt;
  if (towerPlayerState.feverTimer > 0) towerPlayerState.feverTimer -= dt;

  // SP Natural Regen
  if (towerPlayerState.baseStats.currentSp < totalStats.maxSp) {
    towerPlayerState.baseStats.currentSp = Math.min(totalStats.maxSp, towerPlayerState.baseStats.currentSp + dt * 4);
  }

  // 1. Move Hero towards target destination
  if (roHero.targetEnemy) {
    // Chase target enemy
    const distToEnemy = Math.hypot(roHero.targetEnemy.x - roHero.x, roHero.targetEnemy.y - roHero.y);
    if (distToEnemy > roHero.attackRange) {
      const angle = Math.atan2(roHero.targetEnemy.y - roHero.y, roHero.targetEnemy.x - roHero.x);
      roHero.x += Math.cos(angle) * roHero.speed;
      roHero.y += Math.sin(angle) * roHero.speed;
      roHero.isMoving = true;
    } else {
      roHero.isMoving = false;
      // Auto-Attack target enemy when in range
      if (roHero.attackCooldown <= 0) {
        performHeroAttack(roHero.targetEnemy, 1.0, false);
        roHero.attackCooldown = roHero.maxAttackCooldown;
      }
    }
  } else {
    // Normal Point-and-Click movement
    const distToTarget = Math.hypot(roHero.targetX - roHero.x, roHero.targetY - roHero.y);
    if (distToTarget > 4) {
      const angle = Math.atan2(roHero.targetY - roHero.y, roHero.targetX - roHero.x);
      roHero.x += Math.cos(angle) * roHero.speed;
      roHero.y += Math.sin(angle) * roHero.speed;
      roHero.isMoving = true;
    } else {
      roHero.isMoving = false;
      targetMoveIndicator = null;
    }
  }

  // 2. Monster AI (Roaming & Aggro chasing)
  dungeonMonsters.forEach(m => {
    const distToHero = Math.hypot(roHero.x - m.x, roHero.y - m.y);

    if (distToHero < m.aggroRadius) {
      // Aggro on Hero
      m.state = 'chase';
      if (distToHero > 36) {
        const angle = Math.atan2(roHero.y - m.y, roHero.x - m.x);
        m.x += Math.cos(angle) * m.speed;
        m.y += Math.sin(angle) * m.speed;
      } else {
        // Monster attacks player
        if (!m.attackCooldown || m.attackCooldown <= 0) {
          m.attackCooldown = 1.4;
          const dmg = Math.max(5, m.atk - totalStats.def);
          towerPlayerState.baseStats.currentHp = Math.max(0, towerPlayerState.baseStats.currentHp - dmg);

          damagePopups.push({
            text: `-${dmg}`,
            x: roHero.x,
            y: roHero.y - 20,
            opacity: 1,
            color: '#ef4444'
          });

          if (towerPlayerState.baseStats.currentHp <= 0) {
            handleRagnarokDeath();
          }
        }
      }
    } else {
      // Return or wander near home
      m.state = 'idle';
      if (m.attackCooldown > 0) m.attackCooldown -= dt;
    }
  });

  // 3. Loot Pickup on Proximity
  groundLoots.forEach((loot, idx) => {
    const dist = Math.hypot(roHero.x - loot.x, roHero.y - loot.y);
    if (dist < 32) {
      towerPlayerState.gold += loot.gold || 15;
      if (loot.item) {
        equipDroppedItem(loot.item);
      }
      damagePopups.push({
        text: loot.item ? `+${loot.item.name}` : `+${loot.gold} Zeny`,
        x: loot.x,
        y: loot.y - 15,
        opacity: 1,
        color: '#facc15'
      });
      groundLoots.splice(idx, 1);
      updateRagnarokHUD();
    }
  });

  // 4. Update Damage Popups
  damagePopups.forEach(p => {
    p.y -= 1.2;
    p.opacity -= 0.03;
  });
  damagePopups = damagePopups.filter(p => p.opacity > 0);
}

function performHeroAttack(monster, damageMultiplier = 1.0, isSkill = false) {
  const totalStats = getTotalStats();
  const damage = Math.round(totalStats.atk * damageMultiplier * (0.9 + Math.random() * 0.3));

  monster.hp -= damage;

  // Slash effect / Cast animation
  roHero.isAttacking = true;
  setTimeout(() => { roHero.isAttacking = false; }, 200);

  damagePopups.push({
    text: damage.toString(),
    x: monster.x + (Math.random() * 16 - 8),
    y: monster.y - 20,
    opacity: 1,
    color: isSkill ? '#fef08a' : '#ffffff',
    isCrit: isSkill || towerPlayerState.feverTimer > 0
  });

  if (monster.hp <= 0) {
    handleMonsterKilled(monster);
  }
}

function handleMonsterKilled(monster) {
  // Drop Loot on Map
  groundLoots.push({
    x: monster.x,
    y: monster.y,
    gold: Math.round(15 * towerPlayerState.currentFloor * (1 + Math.random() * 0.8)),
    item: Math.random() < 0.25 ? rollRandomLoot() : null
  });

  // Add EXP
  if (towerPlayerState.level < towerPlayerState.levelCap) {
    towerPlayerState.exp += monster.exp;
    const expNeeded = towerPlayerState.level * 100;
    if (towerPlayerState.exp >= expNeeded) {
      towerPlayerState.exp -= expNeeded;
      towerPlayerState.level += 1;
      towerPlayerState.baseStats.atk += 4;
      towerPlayerState.baseStats.def += 2;
      towerPlayerState.baseStats.maxHp += 25;
      towerPlayerState.baseStats.currentHp = towerPlayerState.baseStats.maxHp;
      showLevelUpToast();
    }
  }

  // Remove monster & count
  dungeonMonsters = dungeonMonsters.filter(m => m.id !== monster.id);
  if (roHero.targetEnemy === monster) roHero.targetEnemy = null;

  towerPlayerState.monstersDefeatedOnFloor++;
  updateRagnarokHUD();

  // Respawn new monster after 3 seconds
  setTimeout(() => {
    if (dungeonMonsters.length < 6) {
      setupDungeonMap(towerPlayerState.currentFloor);
    }
  }, 3500);
}

function rollRandomLoot() {
  const categories = ['weapons', 'armors', 'relics'];
  const cat = categories[Math.floor(Math.random() * categories.length)];
  const items = TOWER_LOOT_TABLE[cat];
  return items[Math.floor(Math.random() * items.length)];
}

function equipDroppedItem(item) {
  if (item.atk) towerPlayerState.equipment.weapon = item;
  if (item.def) towerPlayerState.equipment.armor = item;
  if (item.maxHp) towerPlayerState.equipment.relic = item;
  saveStudentTowerProgress();
  renderTowerMainView();
}

function handleRagnarokDeath() {
  towerPlayerState.baseStats.currentHp = towerPlayerState.baseStats.maxHp;
  roHero.x = 100;
  roHero.y = 260;
  roHero.targetX = 100;
  roHero.targetY = 260;
  roHero.targetEnemy = null;
  showPopupError('คุณหมดสติ!', 'คุณถูกมอนสเตอร์โจมตีจนหมดสติ ถูกพากลับมายังจุดเริ่มต้นของชั้น');
}

/* -------------------------------------------------------------
   CANVAS RAGNAROK GRAPHICS (2D ISOMETRIC / TOP-DOWN MAP)
------------------------------------------------------------- */
function drawRagnarokCanvas() {
  const canvas = document.getElementById('ragnarok-map-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // 1. Draw Ragnarok Dungeon Floor (Stone Tile Grid)
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, w, h);

  // Tile Grid
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // 2. Draw Target Move Indicator (Green Ripple Circle on Click)
  if (targetMoveIndicator) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(targetMoveIndicator.x, targetMoveIndicator.y, targetMoveIndicator.r, 0, Math.PI * 2);
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.stroke();
    targetMoveIndicator.r = (targetMoveIndicator.r + 0.5) % 18;
    ctx.restore();
  }

  // 3. Draw Ancient Rune Altar (Logic Puzzle Trigger)
  ctx.save();
  ctx.beginPath();
  ctx.arc(runeAltar.x, runeAltar.y, runeAltar.radius, 0, Math.PI * 2);
  ctx.fillStyle = runeAltar.isSolved ? 'rgba(52, 211, 153, 0.25)' : 'rgba(56, 189, 248, 0.25)';
  ctx.fill();
  ctx.strokeStyle = runeAltar.isSolved ? '#34d399' : '#38bdf8';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = '22px sans-serif';
  ctx.fillText('🏛️', runeAltar.x - 12, runeAltar.y + 8);
  ctx.font = 'bold 11px Sarabun, sans-serif';
  ctx.fillStyle = '#fcd34d';
  ctx.fillText('ศิลาตรรกะรูน [คลิก]', runeAltar.x - 42, runeAltar.y + 36);
  ctx.restore();

  // 4. Draw Boss Chamber Warp Portal
  const isBossUnlocked = towerPlayerState.monstersDefeatedOnFloor >= towerPlayerState.monstersNeededForBoss;
  ctx.save();
  ctx.beginPath();
  ctx.arc(w - 60, h / 2, 28, 0, Math.PI * 2);
  ctx.fillStyle = isBossUnlocked ? 'rgba(239, 68, 68, 0.35)' : 'rgba(100, 116, 139, 0.2)';
  ctx.fill();
  ctx.strokeStyle = isBossUnlocked ? '#ef4444' : '#64748b';
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.font = '24px sans-serif';
  ctx.fillText('🚪', w - 74, h / 2 + 8);
  ctx.font = 'bold 11px Sarabun, sans-serif';
  ctx.fillStyle = isBossUnlocked ? '#f87171' : '#94a3b8';
  ctx.fillText(isBossUnlocked ? 'วาร์ปห้องบอส 🔥' : 'วาร์ปถูกผนึก 🔒', w - 100, h / 2 + 42);
  ctx.restore();

  // 5. Draw Ground Loots with Sparkling Gold
  groundLoots.forEach(loot => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(loot.x, loot.y, 14, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)';
    ctx.fill();
    ctx.font = '16px sans-serif';
    ctx.fillText(loot.item ? loot.item.icon : '🪙', loot.x - 8, loot.y + 6);
    ctx.restore();
  });

  // 6. Draw Dungeon Monsters
  dungeonMonsters.forEach(m => {
    ctx.save();
    // Shadow
    ctx.beginPath();
    ctx.ellipse(m.x, m.y + 14, 14, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fill();

    // Target Selection Cursor if locked
    if (roHero.targetEnemy === m) {
      ctx.beginPath();
      ctx.arc(m.x, m.y + 2, 24, 0, Math.PI * 2);
      ctx.strokeStyle = '#f87171';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Health Bar above head
    const barW = 38;
    const hpRatio = Math.max(0, m.hp / m.maxHp);
    ctx.fillStyle = '#000';
    ctx.fillRect(m.x - barW / 2, m.y - 24, barW, 4);
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(m.x - barW / 2, m.y - 24, barW * hpRatio, 4);

    // Monster Sprite & Name
    ctx.font = '24px sans-serif';
    ctx.fillText(m.emoji, m.x - 12, m.y + 10);
    ctx.font = '9px Sarabun, sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(m.name, m.x - 22, m.y - 28);
    ctx.restore();
  });

  // 7. Draw Hero Character (Ragnarok Novice/Knight)
  ctx.save();
  // Hero Shadow
  ctx.beginPath();
  ctx.ellipse(roHero.x, roHero.y + 16, 16, 6, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fill();

  // Attack Slash FX
  if (roHero.isAttacking) {
    ctx.beginPath();
    ctx.arc(roHero.x, roHero.y, 36, -Math.PI / 4, Math.PI / 2);
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 4;
    ctx.stroke();
  }

  // Hero Sprite
  ctx.font = '28px sans-serif';
  ctx.fillText('🧙‍♂️', roHero.x - 14, roHero.y + 12);

  // Hero Name & Level Header (Ragnarok Character Plate)
  ctx.font = 'bold 11px Sarabun, sans-serif';
  ctx.fillStyle = '#ffffff';
  const nameText = `${currentUser ? currentUser.name : 'ฮีโร่'} (Lv.${towerPlayerState.level})`;
  ctx.fillText(nameText, roHero.x - 35, roHero.y - 22);

  // Hero Small HP Bar
  const heroTotal = getTotalStats();
  const heroHpRatio = Math.max(0, heroTotal.currentHp / heroTotal.maxHp);
  ctx.fillStyle = '#000';
  ctx.fillRect(roHero.x - 25, roHero.y - 18, 50, 4);
  ctx.fillStyle = '#10b981';
  ctx.fillRect(roHero.x - 25, roHero.y - 18, 50 * heroHpRatio, 4);

  ctx.restore();

  // 8. Draw Floating Damage Numbers
  damagePopups.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.font = p.isCrit ? 'bold 20px Courier New, monospace' : 'bold 16px Courier New, monospace';
    ctx.fillStyle = '#000000';
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color || '#ffffff';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  });

  // 9. Fever Mode Screen Aura
  if (towerPlayerState.feverTimer > 0) {
    ctx.save();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.font = 'bold 13px Sarabun, sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText(`🔥 FEVER MODE x2 ATK (${towerPlayerState.feverTimer.toFixed(1)}s)`, w / 2 - 90, 22);
    ctx.restore();
  }
}

/* -------------------------------------------------------------
   USER INTERACTIVE CONTROLS (CLICK-TO-MOVE / TOUCH / SKILLS)
------------------------------------------------------------- */
function handleCanvasClick(event) {
  const canvas = document.getElementById('ragnarok-map-canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;

  // 1. Check if clicked on Rune Altar
  const distToAltar = Math.hypot(clickX - runeAltar.x, clickY - runeAltar.y);
  if (distToAltar < runeAltar.radius + 15) {
    openRuneAltarPuzzle();
    return;
  }

  // 2. Check if clicked on Boss Warp Portal
  const isBossUnlocked = towerPlayerState.monstersDefeatedOnFloor >= towerPlayerState.monstersNeededForBoss;
  const distToPortal = Math.hypot(clickX - (canvas.width - 60), clickY - canvas.height / 2);
  if (distToPortal < 35) {
    if (isBossUnlocked) {
      openBossRaidModal(towerPlayerState.currentFloor);
    } else {
      showPopupInfo('ประตูยังถูกผนึก!', `คุณต้องปราบมอนสเตอร์ในชั้นนี้อีก ${towerPlayerState.monstersNeededForBoss - towerPlayerState.monstersDefeatedOnFloor} ตัว เพื่อปลดผนึกห้องบอสครับ`);
    }
    return;
  }

  // 3. Check if clicked on a Monster (Lock target to attack)
  let clickedMonster = null;
  dungeonMonsters.forEach(m => {
    const dist = Math.hypot(clickX - m.x, clickY - m.y);
    if (dist < m.radius + 14) {
      clickedMonster = m;
    }
  });

  if (clickedMonster) {
    roHero.targetEnemy = clickedMonster;
    roHero.targetX = clickedMonster.x;
    roHero.targetY = clickedMonster.y;
    targetMoveIndicator = null;
  } else {
    // Normal Point-and-Click ground movement
    roHero.targetEnemy = null;
    roHero.targetX = clickX;
    roHero.targetY = clickY;
    targetMoveIndicator = { x: clickX, y: clickY, r: 6 };
  }
}

function castRoSkill(skillKey) {
  const skill = RO_SKILLS[skillKey];
  if (!skill) return;

  const totalStats = getTotalStats();

  if (roHero.skillsCooldown[skillKey] > 0) {
    showPopupInfo('สกิลติดคูลดาวน์!', `กรุณารอ ${roHero.skillsCooldown[skillKey].toFixed(1)} วินาที`);
    return;
  }

  if (towerPlayerState.baseStats.currentSp < skill.sp) {
    showPopupError('SP ไม่เพียงพอ!', `คุณต้องมีอย่างน้อย ${skill.sp} SP ในการร่ายสกิลนี้`);
    return;
  }

  // Deduct SP
  towerPlayerState.baseStats.currentSp -= skill.sp;
  roHero.skillsCooldown[skillKey] = skill.cooldown;

  if (skillKey === 'heal_light') {
    const healAmount = Math.round(totalStats.maxHp * 0.45);
    towerPlayerState.baseStats.currentHp = Math.min(totalStats.maxHp, towerPlayerState.baseStats.currentHp + healAmount);
    damagePopups.push({ text: `+${healAmount} HP`, x: roHero.x, y: roHero.y - 25, opacity: 1, color: '#34d399' });
    showPopupSuccess('Heal!', `ฟื้นฟูเลือด +${healAmount} HP สำเร็จ!`);
  } else {
    // Attack Target or closest monster
    const target = roHero.targetEnemy || dungeonMonsters[0];
    if (target) {
      const mult = skillKey === 'fire_bolt' ? 3.5 : 2.8;
      performHeroAttack(target, mult, true);
    } else {
      showPopupInfo('ไม่มีเป้าหมาย!', 'กรุณาคลิกเลือกมอนสเตอร์ที่ต้องการโจมตีก่อนครับ');
    }
  }

  updateRagnarokHUD();
}

/* -------------------------------------------------------------
   RENDER MAIN TOWER VIEW & ACTION RPG HUD
------------------------------------------------------------- */
function renderTowerMainView() {
  const container = document.getElementById('view-tower');
  if (!container) return;

  const totalStats = getTotalStats();
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === towerPlayerState.currentFloor) || TOWER_FLOORS_DATA[0];
  const isBossUnlocked = towerPlayerState.monstersDefeatedOnFloor >= towerPlayerState.monstersNeededForBoss;

  let html = `
    <div class="ro-game-wrapper">
      
      <!-- Top Ragnarok Character Bar -->
      <div class="ro-hero-hud-card">
        <div class="ro-avatar-col">
          <span class="ro-avatar-icon">🧙‍♂️</span>
          <span class="ro-level-badge">Lv. ${towerPlayerState.level}</span>
        </div>

        <div class="ro-hero-meta-col">
          <div class="ro-name-row">
            <h3 class="ro-name">${currentUser ? currentUser.name : 'ผู้กล้าแห่งรูน'}</h3>
            <span class="ro-cap-badge"><i class="fa-solid fa-lock"></i> เพดานเลเวล: Lv. ${towerPlayerState.levelCap}</span>
          </div>

          <!-- HP & SP Bars -->
          <div class="ro-bars-row">
            <div class="ro-bar-container hp">
              <span class="bar-lbl">HP</span>
              <div class="bar-track"><div class="bar-fill" id="ro-hp-bar" style="width:${(totalStats.currentHp / totalStats.maxHp) * 100}%;"></div></div>
              <span class="bar-val" id="ro-hp-val">${totalStats.currentHp}/${totalStats.maxHp}</span>
            </div>
            <div class="ro-bar-container sp">
              <span class="bar-lbl">SP</span>
              <div class="bar-track"><div class="bar-fill" id="ro-sp-bar" style="width:${(totalStats.currentSp / totalStats.maxSp) * 100}%;"></div></div>
              <span class="bar-val" id="ro-sp-val">${Math.round(totalStats.currentSp)}/${totalStats.maxSp}</span>
            </div>
          </div>
        </div>

        <!-- 3 Core Stats -->
        <div class="ro-stats-hud-box">
          <div class="stat-pill"><i class="fa-solid fa-khanda" style="color:#f87171;"></i> ATK: <strong>${totalStats.atk}</strong></div>
          <div class="stat-pill"><i class="fa-solid fa-shield-halved" style="color:#60a5fa;"></i> DEF: <strong>${totalStats.def}</strong></div>
          <div class="stat-pill"><i class="fa-solid fa-coins" style="color:#fbbf24;"></i> <strong id="ro-gold-text">${towerPlayerState.gold} Zeny</strong></div>
        </div>
      </div>

      <!-- Main Ragnarok 2D Map Screen -->
      <div class="ro-dungeon-card">
        <div class="ro-dungeon-header">
          <div class="dungeon-title">
            <span class="d-floor-badge"><i class="fa-solid fa-dungeon"></i> ชั้นที่ ${floorData.floor}: ${floorData.name}</span>
            <span class="d-theme-text"><i class="fa-solid fa-brain"></i> ${floorData.theme}</span>
          </div>
          <div class="dungeon-actions">
            <button class="btn btn-sm btn-outline-info" onclick="openRuneAltarPuzzle()">
              <i class="fa-solid fa-puzzle-piece"></i> 💡 ถอดรหัสศิลาตรรกะ (Rune Puzzle)
            </button>
            <button class="btn btn-sm ${isBossUnlocked ? 'btn-danger-glow' : 'btn-secondary-disabled'}" onclick="${isBossUnlocked ? `openBossRaidModal(${floorData.floor})` : `showPopupInfo('ห้องบอสยังถูกผนึก', 'ปราบมอนสเตอร์ในชั้นนี้อีก ${towerPlayerState.monstersNeededForBoss - towerPlayerState.monstersDefeatedOnFloor} ตัวเพื่อเปิดวาร์ปครับ')`}">
              <i class="fa-solid fa-skull"></i> วาร์ปห้องบอส ${isBossUnlocked ? '🔥' : '🔒'}
            </button>
          </div>
        </div>

        <!-- Canvas Game Screen -->
        <div class="ro-canvas-box">
          <canvas id="ragnarok-map-canvas" width="740" height="380" onclick="handleCanvasClick(event)"></canvas>
          <div class="ro-control-hint-overlay">
            <span>🖱️ <strong>วิธีเล่น:</strong> คลิกพื้นเพื่อเดิน | คลิกที่มอนสเตอร์เพื่อล็อกเป้าและโจมตี | คลิกที่ศิลา 🏛️ เพื่อตอบคำถามรับบัฟ</span>
          </div>
        </div>

        <!-- Action RPG Skill Hotbar (Touch & Click Friendly) -->
        <div class="ro-skill-hotbar">
          <button class="ro-skill-btn attack-btn" onclick="roHero.targetEnemy ? performHeroAttack(roHero.targetEnemy, 1.0) : (dungeonMonsters[0] ? performHeroAttack(dungeonMonsters[0], 1.0) : null)" title="โจมตีปกติ">
            <span class="btn-key">SPACE / คลิก</span>
            <i class="fa-solid fa-sword"></i>
            <strong>โจมตีปกติ</strong>
          </button>
          <button class="ro-skill-btn" onclick="castRoSkill('bash_strike')" title="Bash (ฟันกระแทก 280%)">
            <span class="btn-key">1</span>
            <i class="fa-solid fa-gavel" style="color:#f59e0b;"></i>
            <strong>Bash (15 SP)</strong>
          </button>
          <button class="ro-skill-btn" onclick="castRoSkill('fire_bolt')" title="Fire Bolt (ลูกไฟเวท 350%)">
            <span class="btn-key">2</span>
            <i class="fa-solid fa-fire-flame-curved" style="color:#ef4444;"></i>
            <strong>Fire Bolt (25 SP)</strong>
          </button>
          <button class="ro-skill-btn" onclick="castRoSkill('heal_light')" title="Heal (ฟื้นฟูเลือด 45%)">
            <span class="btn-key">3</span>
            <i class="fa-solid fa-heart" style="color:#10b981;"></i>
            <strong>Heal (20 SP)</strong>
          </button>
        </div>
      </div>

      <!-- Lower Panels: Equipment, Upgrades & Floor Travel -->
      <div class="idle-bottom-grid">
        
        <!-- Equipped Items -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-shield" style="color:#38bdf8;"></i> อุปกรณ์สวมใส่ปัจจุบัน</h4>
          <div class="gear-showcase-row">
            <div class="gear-card-box ${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.rarity : ''}">
              <span class="g-icon">${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.icon : '⚔️'}</span>
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

        <!-- Zeny Stat Upgrades -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-arrow-up-right-dots" style="color:#fbbf24;"></i> อัปเกรดพลังด้วยเงิน Zeny</h4>
          <div class="upgrade-btn-grid">
            <button class="upgrade-btn" onclick="buyZenyUpgrade('atk')">
              <span>⚔️ เพิ่ม ATK (+3)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 Zeny</strong>
            </button>
            <button class="upgrade-btn" onclick="buyZenyUpgrade('def')">
              <span>🛡️ เพิ่ม DEF (+2)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 Zeny</strong>
            </button>
            <button class="upgrade-btn" onclick="buyZenyUpgrade('maxHp')">
              <span>❤️ เพิ่ม Max HP (+25)</span>
              <strong><i class="fa-solid fa-coins"></i> 50 Zeny</strong>
            </button>
          </div>
        </div>

        <!-- Floor Warp Map -->
        <div class="idle-panel-card">
          <h4 class="panel-heading"><i class="fa-solid fa-dungeon" style="color:#a855f7;"></i> วาร์ปเปลี่ยนชั้นหอคอย</h4>
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

function updateRagnarokHUD() {
  const totalStats = getTotalStats();
  const hpBar = document.getElementById('ro-hp-bar');
  const hpVal = document.getElementById('ro-hp-val');
  const spBar = document.getElementById('ro-sp-bar');
  const spVal = document.getElementById('ro-sp-val');
  const goldText = document.getElementById('ro-gold-text');

  if (hpBar) hpBar.style.width = `${(totalStats.currentHp / totalStats.maxHp) * 100}%`;
  if (hpVal) hpVal.innerText = `${totalStats.currentHp}/${totalStats.maxHp}`;
  if (spBar) spBar.style.width = `${(totalStats.currentSp / totalStats.maxSp) * 100}%`;
  if (spVal) spVal.innerText = `${Math.round(totalStats.currentSp)}/${totalStats.maxSp}`;
  if (goldText) goldText.innerText = `${towerPlayerState.gold} Zeny`;
}

function changeCurrentFloor(floorNum) {
  towerPlayerState.currentFloor = floorNum;
  towerPlayerState.monstersDefeatedOnFloor = 0;
  setupDungeonMap(floorNum);
  renderTowerMainView();
}

function buyZenyUpgrade(statType) {
  if (towerPlayerState.gold >= 50) {
    towerPlayerState.gold -= 50;
    if (statType === 'atk') towerPlayerState.bonusStats.atk += 3;
    if (statType === 'def') towerPlayerState.bonusStats.def += 2;
    if (statType === 'maxHp') towerPlayerState.bonusStats.maxHp += 25;

    saveStudentTowerProgress();
    renderTowerMainView();
    showPopupSuccess('อัปเกรดสำเร็จ!', `เพิ่มพลังสเตตัสให้กับตัวละครเรียบร้อยแล้ว`);
  } else {
    showPopupError('เงิน Zeny ไม่พอ!', 'คุณต้องมีอย่างน้อย 50 Zeny จากการปราบมอนสเตอร์ครับ');
  }
}

/* -------------------------------------------------------------
   RUNE ALTAR PUZZLE MODAL (LOGIC LEARNING TRIAL)
------------------------------------------------------------- */
function openRuneAltarPuzzle() {
  const floor = towerPlayerState.currentFloor;
  const bank = TOWER_PUZZLE_BANK[floor] || TOWER_PUZZLE_BANK[1];
  const puzzle = bank[Math.floor(Math.random() * bank.length)];

  const modalHtml = `
    <div class="modal-overlay active" id="modal-rune-puzzle" style="z-index:10010;">
      <div class="modal-container modal-puzzle-box">
        <div class="modal-header" style="background:#0f172a; color:#fff; border-bottom:2px solid #38bdf8;">
          <h3 class="modal-title" style="color:#fff; margin:0; font-size:1.1rem;"><i class="fa-solid fa-brain" style="color:#38bdf8;"></i> ปริศนาศิลาตรรกะแห่งหอคอย (Rune Trial)</h3>
          <button class="btn-close-modal" onclick="closeModal('modal-rune-puzzle')"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding:22px 20px;">
          <div class="puzzle-q-box">
            <span class="puzzle-badge">โจทย์วิทยาการคำนวณประจำศิลาชั้นที่ ${floor}</span>
            <h4 class="puzzle-question-text">${puzzle.q}</h4>
          </div>

          <div class="puzzle-options-list">
            ${puzzle.options.map((opt, idx) => `
              <button class="puzzle-opt-btn" onclick="submitRunePuzzle(${idx}, ${puzzle.ans})">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-rune-puzzle');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function submitRunePuzzle(chosenIdx, correctIdx) {
  closeModal('modal-rune-puzzle');

  if (chosenIdx === correctIdx) {
    runeAltar.isSolved = true;
    towerPlayerState.feverTimer = 18; // 18 seconds of x2 ATK
    towerPlayerState.gold += 80;
    towerPlayerState.exp += 100;
    towerPlayerState.bonusStats.atk += 2;

    saveStudentTowerProgress();
    renderTowerMainView();

    showPopupSuccess('ถอดรหัสสำเร็จ!', 'คุณได้รับ FEVER MODE x2 ATK 18 วินาที พร้อม +100 EXP, +80 Zeny, และ +2 ATK ถาวร!');
  } else {
    showPopupError('คำตอบไม่ถูกต้อง!', 'มนต์อาถรรพ์สะท้อนกลับ ทบทวนตรรกะแล้วลองใหม่อีกครั้งนะครับ');
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
    const baseDamage = totalStats.atk * 4 + Math.floor(Math.random() * 25);
    sendDamageToRaidBoss(baseDamage);
    generateNextRaidPuzzle();
  } else {
    showPopupError('ตอบผิดพลาด!', 'ตอบผิดทำให้การโจมตีไร้ผล! ตอบข้อถัดไปเพื่อแก้ตัว');
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

  if (towerPlayerState.currentFloor < 10) {
    towerPlayerState.currentFloor++;
    towerPlayerState.monstersDefeatedOnFloor = 0;
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
