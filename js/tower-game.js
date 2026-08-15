/* ==========================================================================
   TOWER HEROES: ISOMETRIC TACTICAL ACTION RPG ENGINE
   หอคอยแห่งปัญญา 10 ชั้น: ระบบเกม 2.5D Isometric Fantasy Action RPG (สไตล์ Pixel Heroes)
   ========================================================================== */

// Isometric Coordinate Helpers
function toIso(x, y) {
  return {
    isoX: (x - y),
    isoY: (x + y) / 2
  };
}

function toScreen(isoX, isoY) {
  return {
    x: (2 * isoY + isoX) / 2,
    y: (2 * isoY - isoX) / 2
  };
}

// Global Hero & Party State
let playerHero = {
  x: 220,
  y: 180,
  targetX: 220,
  targetY: 180,
  speed: 3.6,
  isMoving: false,
  isAttacking: false,
  targetEnemy: null,
  attackCooldown: 0,
  speechBubble: "ลุยกันเลย!",
  speechTimer: 3.0,
  classType: 'Dragonborn'
};

// Companion NPCs with Anime Portraits (Matching the screenshot: Jellika, Lilith, Eland, Hunter)
const COMPANIONS = [
  { name: 'Jellika', title: 'ผู้ชี้นำแห่งแสง', portrait: '👧🏼', color: '#f43f5e', avatarImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80', hint: 'ยินดีต้อนรับสู่หอคอยแห่งปัญญา! ตอบปริศนาเพื่อเร่งพลังโจมตีกันเถอะ!' },
  { name: 'Lilith', title: 'จอมเวทปัญญาประดิษฐ์', portrait: '👩🏻‍🏫', color: '#38bdf8', avatarImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=120&auto=format&fit=crop&q=80', hint: 'ปริศนาตรรกศาสตร์จะช่วยปลดล็อกสกิลระดับสูงให้นาย!' },
  { name: 'Eland', title: 'อัศวินพิทักษ์วิหาร', portrait: '🧑🏼‍🦱', color: '#fbbf24', avatarImg: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&auto=format&fit=crop&q=80', hint: 'ระวังบอสประจำชั้นด้วยนะ มันมีพลังมหาศาล!' },
  { name: 'Hunter', title: 'นักล่าเงาไร้ลักษณ์', portrait: '🥷🏻', color: '#c084fc', avatarImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80', hint: 'ใช้ทักษะการตัดสินใจที่ดี แล้วพวกเราจะพิชิตชั้นที่ 10 ได้!' }
];

let currentCompanion = COMPANIONS[0];

// Main Player & Party Progression
let towerPlayerState = {
  level: 1,
  exp: 0,
  gold: 250,
  levelCap: 10,
  highestClearedFloor: 0,
  currentFloor: 1,
  monstersDefeated: 0,
  monstersNeeded: 6,
  baseStats: { atk: 22, def: 12, maxHp: 180, currentHp: 180, maxMp: 100, currentMp: 100 },
  bonusStats: { atk: 0, def: 0, maxHp: 0 },
  equipment: {
    weapon: { name: 'ดาบคริสตัลมังกร (Dragon Blade)', rarity: 'rare', atk: 18, icon: '⚔️' },
    armor: { name: 'เกราะทองอัศวิน (Knight Armor)', rarity: 'common', def: 10, icon: '🛡️' },
    relic: { name: 'ศิลาเทพแห่งปัญญา (Wisdom Relic)', rarity: 'rare', maxHp: 80, icon: '💎' }
  },
  feverTimer: 0
};

// 10 Floors Data with 4 Biomes (Castle, Crypt, Dungeon, Fairy Forest)
const TOWER_FLOORS_DATA = [
  { floor: 1, name: 'สะพานปราสาทลอยฟ้า (Sky Castle Bridge)', biome: 'castle', theme: 'Logic Gates (AND, OR, NOT)', levelCap: 10, boss: { name: 'โกเลมหินสัจจะ (Logic Golem)', level: 10, maxHp: 2500, atk: 20, def: 8, avatar: '🗿' } },
  { floor: 2, name: 'วิหารโกธิคมืด (Gothic Crypt of Runes)', biome: 'crypt', theme: 'Patterns & Fibonacci Sequences', levelCap: 20, boss: { name: 'พญางูอนันต์ (Infinite Serpent)', level: 20, maxHp: 5000, atk: 32, def: 14, avatar: '🐍' } },
  { floor: 3, name: 'ดันเจี้ยนเมดูซาโบราณ (Medusa Underworld)', biome: 'dungeon', theme: 'Flowcharts & Algorithms', levelCap: 30, boss: { name: 'ราชินีเมดูซา (Medusa Empress)', level: 30, maxHp: 9000, atk: 45, def: 22, avatar: '🐍👑' } },
  { floor: 4, name: 'ป่าภูตเขียวขจี (Emerald Fairy Grove)', biome: 'forest', theme: 'Binary & Bitwise Logic', levelCap: 40, boss: { name: 'การ์กอยล์ทวิภาค (Binary Gargoyle)', level: 40, maxHp: 14000, atk: 60, def: 30, avatar: '🦇' } },
  { floor: 5, name: 'สุสานข้อผิดพลาด (Catacombs of Bugs)', biome: 'crypt', theme: 'Debugging Trials', levelCap: 50, boss: { name: 'ราชินีบั๊กมรณะ (The Bug Queen)', level: 50, maxHp: 20000, atk: 78, def: 40, avatar: '🦂' } },
  { floor: 6, name: 'หอสมุดเงื่อนไขซ้อน (Library of If-Else)', biome: 'castle', theme: 'Nested Conditionals', levelCap: 60, boss: { name: 'จอมเวทเงื่อนไข (Conditional Mage)', level: 60, maxHp: 28000, atk: 98, def: 52, avatar: '🧙‍♂️' } },
  { floor: 7, name: 'ห้องนิรภัยอาร์เรย์ (Vault of Data Arrays)', biome: 'dungeon', theme: 'Arrays, Stacks & Queues', levelCap: 70, boss: { name: 'อัศวินผลึกโครงสร้าง (Structure Knight)', level: 70, maxHp: 38000, atk: 120, def: 65, avatar: '🛡️' } },
  { floor: 8, name: 'ผาฟังก์ชันเพลิง (Flame Cliff of Loops)', biome: 'crypt', theme: 'Functions & Recursion', levelCap: 80, boss: { name: 'มังกรเพลิงฟังก์ชัน (Recursive Dragon)', level: 80, maxHp: 50000, atk: 145, def: 78, avatar: '🐉' } },
  { floor: 9, name: 'ปราสาทถอดรหัสไซเฟอร์ (Cipher Fortress)', biome: 'castle', theme: 'Cryptography & Ciphers', levelCap: 90, boss: { name: 'ชาโดว์รหัสลับ (Cipher Phantom)', level: 90, maxHp: 65000, atk: 175, def: 90, avatar: '👤' } },
  { floor: 10, name: 'บัลลังก์จักรกล AI (AI Mastermind Core)', biome: 'dungeon', theme: 'AI Logic & Systems', levelCap: 99, boss: { name: 'ผู้คุมกฎแห่งมิติดิจิทัล (AI Overlord)', level: 100, maxHp: 100000, atk: 220, def: 110, avatar: '🤖' } }
];

// Logic Puzzle Bank for Rune Stones
const TOWER_PUZZLE_BANK = {
  1: [
    { q: 'ผลลัพธ์ของ (TRUE AND FALSE) มีค่าตรงกับข้อใด?', options: ['TRUE', 'FALSE', 'ERROR', 'NULL'], ans: 1 },
    { q: 'หาก A = TRUE และ B = FALSE ข้อใดให้ผลลัพธ์เป็น TRUE?', options: ['A AND B', 'NOT A', 'A OR B', 'NOT (A OR B)'], ans: 2 },
    { q: 'เกตใดทำหน้าที่กลับค่าความจริงจาก 1 เป็น 0 และ 0 เป็น 1?', options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NAND Gate'], ans: 2 }
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

// Map Monsters, Allies, FX & Objects
let dungeonMonsters = [];
let partyMembers = [];
let damagePopups = [];
let visualSlashFx = [];
let moveClickMarker = null;
let isometricAnimationId = null;

/* -------------------------------------------------------------
   INITIALIZATION & MAP SETUP
------------------------------------------------------------- */
function initTowerGameModule() {
  if (!currentUser) return;
  loadStudentTowerProgress();
  setupIsometricFloor(towerPlayerState.currentFloor);
  startIsometricLoop();
}

function setupIsometricFloor(floorNum) {
  dungeonMonsters = [];
  damagePopups = [];
  visualSlashFx = [];
  playerHero.x = 220;
  playerHero.y = 200;
  playerHero.targetX = 220;
  playerHero.targetY = 200;
  playerHero.targetEnemy = null;
  currentCompanion = COMPANIONS[(floorNum - 1) % COMPANIONS.length];

  // Party Allies (Matching screenshot: Blade Warrior & Novice Magician)
  partyMembers = [
    { name: 'Blade Warrior', level: 97, hp: 9, maxHp: 9, mp: 6, maxMp: 6, x: 190, y: 160, emoji: '🗡️👧', color: '#f43f5e', targetEnemy: null, cooldown: 0 },
    { name: 'Novice Magician', level: 66, hp: 8, maxHp: 8, mp: 9, maxMp: 9, x: 160, y: 230, emoji: '🪄👧', color: '#38bdf8', targetEnemy: null, cooldown: 0 }
  ];

  // Spawn Monsters according to floor theme
  const spawnPoints = [
    { x: 380, y: 150 }, { x: 440, y: 220 }, { x: 500, y: 140 },
    { x: 410, y: 280 }, { x: 540, y: 240 }
  ];

  const monsterTypes = [
    { name: 'Imperial Knight', emoji: '🛡️💀', hp: 120 + (floorNum * 40), maxHp: 120 + (floorNum * 40), atk: 12 + (floorNum * 5) },
    { name: 'Dark Acolyte', emoji: '🧙‍♀️', hp: 90 + (floorNum * 35), maxHp: 90 + (floorNum * 35), atk: 16 + (floorNum * 6) },
    { name: 'Forest Sprite', emoji: '🧚', hp: 70 + (floorNum * 25), maxHp: 70 + (floorNum * 25), atk: 10 + (floorNum * 4) }
  ];

  spawnPoints.forEach((sp, idx) => {
    const t = monsterTypes[idx % monsterTypes.length];
    dungeonMonsters.push({
      id: 'mob_' + Date.now() + '_' + idx,
      name: t.name,
      emoji: t.emoji,
      x: sp.x,
      y: sp.y,
      hp: t.hp,
      maxHp: t.maxHp,
      atk: t.atk,
      cooldown: 0,
      radius: 24
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
        towerPlayerState.gold = data.gold || 250;
        towerPlayerState.highestClearedFloor = data.highestClearedFloor || 0;
        towerPlayerState.currentFloor = data.currentFloor || 1;
        towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);
        towerPlayerState.baseStats = data.baseStats || { atk: 22 + (towerPlayerState.level * 4), def: 12 + (towerPlayerState.level * 2), maxHp: 180 + (towerPlayerState.level * 20), currentHp: 180 + (towerPlayerState.level * 20), maxMp: 100, currentMp: 100 };
        towerPlayerState.bonusStats = data.bonusStats || { atk: 0, def: 0, maxHp: 0 };
        towerPlayerState.equipment = data.equipment || towerPlayerState.equipment;
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
  const feverMult = towerPlayerState.feverTimer > 0 ? 2 : 1;

  return {
    atk: (towerPlayerState.baseStats.atk + towerPlayerState.bonusStats.atk + eqAtk) * feverMult,
    def: towerPlayerState.baseStats.def + towerPlayerState.bonusStats.def + eqDef,
    maxHp: towerPlayerState.baseStats.maxHp + towerPlayerState.bonusStats.maxHp + eqHp,
    currentHp: towerPlayerState.baseStats.currentHp,
    maxMp: towerPlayerState.baseStats.maxMp || 100,
    currentMp: towerPlayerState.baseStats.currentMp || 100
  };
}

/* -------------------------------------------------------------
   ISOMETRIC 60 FPS GAME LOOP & COMBAT SIMULATOR
------------------------------------------------------------- */
function startIsometricLoop() {
  if (isometricAnimationId) cancelAnimationFrame(isometricAnimationId);

  let lastTime = performance.now();

  function loop(currentTime) {
    const dt = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    updateIsometricWorld(dt);
    drawIsometricCanvas();

    isometricAnimationId = requestAnimationFrame(loop);
  }

  isometricAnimationId = requestAnimationFrame(loop);
}

function updateIsometricWorld(dt) {
  const totalStats = getTotalStats();

  if (playerHero.attackCooldown > 0) playerHero.attackCooldown -= dt;
  if (towerPlayerState.feverTimer > 0) towerPlayerState.feverTimer -= dt;
  if (playerHero.speechTimer > 0) playerHero.speechTimer -= dt;

  // 1. Move Player Hero
  if (playerHero.targetEnemy) {
    const dist = Math.hypot(playerHero.targetEnemy.x - playerHero.x, playerHero.targetEnemy.y - playerHero.y);
    if (dist > 52) {
      const angle = Math.atan2(playerHero.targetEnemy.y - playerHero.y, playerHero.targetEnemy.x - playerHero.x);
      playerHero.x += Math.cos(angle) * playerHero.speed;
      playerHero.y += Math.sin(angle) * playerHero.speed;
      playerHero.isMoving = true;
    } else {
      playerHero.isMoving = false;
      if (playerHero.attackCooldown <= 0) {
        performHeroSlash(playerHero.targetEnemy);
        playerHero.attackCooldown = 0.55;
      }
    }
  } else {
    const dist = Math.hypot(playerHero.targetX - playerHero.x, playerHero.targetY - playerHero.y);
    if (dist > 4) {
      const angle = Math.atan2(playerHero.targetY - playerHero.y, playerHero.targetX - playerHero.x);
      playerHero.x += Math.cos(angle) * playerHero.speed;
      playerHero.y += Math.sin(angle) * playerHero.speed;
      playerHero.isMoving = true;
    } else {
      playerHero.isMoving = false;
      moveClickMarker = null;
    }
  }

  // 2. Party Allies Auto AI (Follow Player & Attack closest target)
  partyMembers.forEach((ally, idx) => {
    const targetMonster = dungeonMonsters[0];
    if (targetMonster) {
      const dist = Math.hypot(targetMonster.x - ally.x, targetMonster.y - ally.y);
      if (dist > 58) {
        const angle = Math.atan2(targetMonster.y - ally.y, targetMonster.x - ally.x);
        ally.x += Math.cos(angle) * 2.8;
        ally.y += Math.sin(angle) * 2.8;
      } else {
        ally.cooldown -= dt;
        if (ally.cooldown <= 0) {
          ally.cooldown = 0.8 + Math.random() * 0.4;
          const dmg = Math.round(totalStats.atk * 0.7);
          targetMonster.hp -= dmg;
          damagePopups.push({ text: dmg.toString(), x: targetMonster.x, y: targetMonster.y - 20, opacity: 1, color: '#38bdf8' });

          if (targetMonster.hp <= 0) {
            handleMonsterDefeated(targetMonster);
          }
        }
      }
    }
  });

  // 3. Update Visual Slashes & Damage Popups
  damagePopups.forEach(p => {
    p.y -= 1.4;
    p.opacity -= 0.035;
  });
  damagePopups = damagePopups.filter(p => p.opacity > 0);

  visualSlashFx.forEach(fx => {
    fx.life -= dt;
  });
  visualSlashFx = visualSlashFx.filter(fx => fx.life > 0);
}

function performHeroSlash(monster) {
  const totalStats = getTotalStats();
  const damage = Math.round(totalStats.atk * (1.1 + Math.random() * 0.4));
  monster.hp -= damage;

  // Add Slash Light Effect (Matching screenshot blue laser sword slash)
  visualSlashFx.push({
    x1: playerHero.x,
    y1: playerHero.y,
    x2: monster.x,
    y2: monster.y,
    life: 0.18,
    color: '#38bdf8'
  });

  // Floating Damage Number (Matching screenshot e.g. 55)
  damagePopups.push({
    text: damage.toString(),
    x: monster.x + (Math.random() * 12 - 6),
    y: monster.y - 25,
    opacity: 1,
    color: towerPlayerState.feverTimer > 0 ? '#fef08a' : '#ffffff',
    isCrit: towerPlayerState.feverTimer > 0
  });

  if (monster.hp <= 0) {
    handleMonsterDefeated(monster);
  }
}

function handleMonsterDefeated(monster) {
  dungeonMonsters = dungeonMonsters.filter(m => m.id !== monster.id);
  if (playerHero.targetEnemy === monster) playerHero.targetEnemy = null;

  towerPlayerState.gold += Math.round(20 * towerPlayerState.currentFloor * (1 + Math.random() * 0.5));
  towerPlayerState.monstersDefeated++;

  // EXP Progression & Level Cap
  if (towerPlayerState.level < towerPlayerState.levelCap) {
    towerPlayerState.exp += 35 * towerPlayerState.currentFloor;
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

  updateBottomPartyUI();

  // Respawn after 3 seconds
  setTimeout(() => {
    if (dungeonMonsters.length < 5) {
      setupIsometricFloor(towerPlayerState.currentFloor);
    }
  }, 3200);
}

/* -------------------------------------------------------------
   ISOMETRIC CANVAS GRAPHICS (Matching Screenshots 1-4)
------------------------------------------------------------- */
function drawIsometricCanvas() {
  const canvas = document.getElementById('isometric-game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === towerPlayerState.currentFloor) || TOWER_FLOORS_DATA[0];

  // 1. Draw Biome Background (Castle Sky, Crypt, Dungeon Canal, or Fairy Forest)
  if (floorData.biome === 'castle') {
    // Castle Bridge with Sky & Clouds
    ctx.fillStyle = '#7dd3fc';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(0, 0, w, 110);
    // Castle Wall & Floor Tiles
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 110, w, h - 110);
    ctx.fillStyle = '#cbd5e1';
    for (let x = 0; x < w; x += 40) {
      ctx.fillRect(x, 110, 2, h - 110);
    }
  } else if (floorData.biome === 'crypt') {
    // Dark Gothic Crypt (Black/Purple Checkered Floor with Stained Glass)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);
    // Checkered Floor Tiles
    for (let x = 0; x < w; x += 48) {
      for (let y = 80; y < h; y += 48) {
        ctx.fillStyle = ((x / 48 + y / 48) % 2 === 0) ? '#1e1b4b' : '#090d16';
        ctx.fillRect(x, y, 48, 48);
      }
    }
    // Ambient Torch Light
    ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
    ctx.beginPath();
    ctx.arc(80, 140, 50, 0, Math.PI * 2);
    ctx.fill();
  } else if (floorData.biome === 'dungeon') {
    // Deep Underworld Dungeon (Stone Canal & Wooden Planks)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#0f766e'; // Water Canal
    ctx.fillRect(0, 180, w, 90);
    ctx.fillStyle = '#78350f'; // Wooden Bridge Planks
    ctx.fillRect(160, 160, 420, 130);
  } else {
    // Emerald Fairy Forest (Lush Green Grass & Tree)
    ctx.fillStyle = '#15803d';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.arc(w / 2, 80, 110, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Draw Movement Indicator
  if (moveClickMarker) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(moveClickMarker.x, moveClickMarker.y, moveClickMarker.r, 0, Math.PI * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.stroke();
    moveClickMarker.r = (moveClickMarker.r + 0.5) % 18;
    ctx.restore();
  }

  // 3. Draw Monsters & Characters sorted by Y-Depth
  const allEntities = [
    { type: 'hero', obj: playerHero, y: playerHero.y },
    ...partyMembers.map(p => ({ type: 'party', obj: p, y: p.y })),
    ...dungeonMonsters.map(m => ({ type: 'monster', obj: m, y: m.y }))
  ];
  allEntities.sort((a, b) => a.y - b.y);

  allEntities.forEach(ent => {
    if (ent.type === 'hero') {
      // Draw Player Hero (Dragonborn / Anime Sword Hero)
      ctx.save();
      // Shadow
      ctx.beginPath();
      ctx.ellipse(playerHero.x, playerHero.y + 14, 18, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();

      // Hero Sprite
      ctx.font = '30px sans-serif';
      ctx.fillText('👱🏼⚔️', playerHero.x - 16, playerHero.y + 10);

      // Speech Bubble (e.g. "You go first!", "ลุยกันเลย!")
      if (playerHero.speechTimer > 0) {
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(playerHero.x - 45, playerHero.y - 46, 90, 22, 6);
        ctx.fill();
        ctx.stroke();
        ctx.font = 'bold 11px Sarabun, sans-serif';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(playerHero.speechBubble, playerHero.x - 38, playerHero.y - 31);
      }
      ctx.restore();

    } else if (ent.type === 'party') {
      // Draw Party Ally
      const ally = ent.obj;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(ally.x, ally.y + 12, 14, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fill();

      ctx.font = '24px sans-serif';
      ctx.fillText(ally.emoji, ally.x - 12, ally.y + 8);
      ctx.font = 'bold 9px Sarabun, sans-serif';
      ctx.fillStyle = ally.color;
      ctx.fillText(ally.name, ally.x - 20, ally.y - 16);
      ctx.restore();

    } else if (ent.type === 'monster') {
      // Draw Monster (Imperial Knight, Dark Acolyte, Sprite)
      const m = ent.obj;
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(m.x, m.y + 14, 16, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.fill();

      // Selected Cursor
      if (playerHero.targetEnemy === m) {
        ctx.beginPath();
        ctx.arc(m.x, m.y + 2, 24, 0, Math.PI * 2);
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Monster HP Bar
      const barW = 42;
      const hpRatio = Math.max(0, m.hp / m.maxHp);
      ctx.fillStyle = '#000';
      ctx.fillRect(m.x - barW / 2, m.y - 24, barW, 4);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(m.x - barW / 2, m.y - 24, barW * hpRatio, 4);

      ctx.font = '26px sans-serif';
      ctx.fillText(m.emoji, m.x - 14, m.y + 10);
      ctx.restore();
    }
  });

  // 4. Draw Visual Slashes (Matching Screenshot Light Beam)
  visualSlashFx.forEach(fx => {
    ctx.save();
    ctx.strokeStyle = fx.color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(fx.x1, fx.y1);
    ctx.lineTo(fx.x2, fx.y2);
    ctx.stroke();
    // Glowing aura
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  });

  // 5. Draw Floating Damage Numbers (e.g. 55)
  damagePopups.forEach(p => {
    ctx.save();
    ctx.globalAlpha = p.opacity;
    ctx.font = p.isCrit ? 'bold 22px Courier New, monospace' : 'bold 18px Courier New, monospace';
    ctx.fillStyle = '#000000';
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color || '#ffffff';
    ctx.fillText(p.text, p.x, p.y);
    ctx.restore();
  });
}

/* -------------------------------------------------------------
   USER CONTROLS (CLICK TO MOVE / TARGET MONSTER)
------------------------------------------------------------- */
function handleIsometricCanvasClick(event) {
  const canvas = document.getElementById('isometric-game-canvas');
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clickX = (event.clientX - rect.left) * scaleX;
  const clickY = (event.clientY - rect.top) * scaleY;

  // Check if clicked monster
  let clickedMonster = null;
  dungeonMonsters.forEach(m => {
    const dist = Math.hypot(clickX - m.x, clickY - m.y);
    if (dist < m.radius + 15) {
      clickedMonster = m;
    }
  });

  if (clickedMonster) {
    playerHero.targetEnemy = clickedMonster;
    playerHero.targetX = clickedMonster.x;
    playerHero.targetY = clickedMonster.y;
    playerHero.speechBubble = "โจมตีเลย!";
    playerHero.speechTimer = 2.0;
    moveClickMarker = null;
  } else {
    playerHero.targetEnemy = null;
    playerHero.targetX = clickX;
    playerHero.targetY = clickY;
    moveClickMarker = { x: clickX, y: clickY, r: 6 };
  }
}

/* -------------------------------------------------------------
   RENDER MAIN TOWER VIEW & PIXEL HEROES SIGNATURE BOTTOM HUD
------------------------------------------------------------- */
function renderTowerMainView() {
  const container = document.getElementById('view-tower');
  if (!container) return;

  const totalStats = getTotalStats();
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === towerPlayerState.currentFloor) || TOWER_FLOORS_DATA[0];
  const isBossUnlocked = towerPlayerState.monstersDefeated >= towerPlayerState.monstersNeeded;

  let html = `
    <div class="pixel-heroes-wrapper">
      
      <!-- Top Floor Bar & Action Trigger -->
      <div class="pixel-top-nav">
        <div class="top-nav-left">
          <span class="pixel-floor-tag"><i class="fa-solid fa-dungeon"></i> ชั้นที่ ${floorData.floor}: ${floorData.name}</span>
          <span class="pixel-theme-tag"><i class="fa-solid fa-brain"></i> ${floorData.theme}</span>
        </div>
        <div class="top-nav-right">
          <button class="btn btn-sm btn-outline-info" onclick="openRuneAltarPuzzle()">
            <i class="fa-solid fa-puzzle-piece"></i> 💡 ถอดรหัสศิลาตรรกะ (Rune Puzzle)
          </button>
          <button class="btn btn-sm ${isBossUnlocked ? 'btn-danger-glow' : 'btn-secondary-disabled'}" onclick="${isBossUnlocked ? `openBossRaidModal(${floorData.floor})` : `showPopupInfo('ประตูบอสยังถูกผนึก', 'ปราบมอนสเตอร์ในชั้นนี้อีก ${towerPlayerState.monstersNeeded - towerPlayerState.monstersDefeated} ตัวเพื่อเปิดวาร์ปครับ')`}">
            <i class="fa-solid fa-skull"></i> ศึกมหาบอส ${isBossUnlocked ? '🔥' : '🔒'}
          </button>
        </div>
      </div>

      <!-- Main 2.5D Isometric Stage Screen -->
      <div class="pixel-stage-card">
        <canvas id="isometric-game-canvas" width="760" height="360" onclick="handleIsometricCanvasClick(event)"></canvas>
      </div>

      <!-- SIGNATURE PIXEL HEROES BOTTOM HUD (EXACTLY MATCHING THE USER'S SCREENSHOT) -->
      <div class="pixel-bottom-hud">
        
        <!-- Left & Center: 3 Party Hero Character Plates -->
        <div class="hud-party-plates-row">
          
          <!-- Hero 1: Player (Dragonborn / Custom Student Name) -->
          <div class="pixel-hero-plate">
            <div class="plate-avatar-box">
              <span class="p-avatar">🧑🏼‍🦱</span>
            </div>
            <div class="plate-info-col">
              <div class="plate-name-row">
                <span class="p-name">${currentUser ? currentUser.name : 'Dragonborn'}</span>
                <span class="p-lvl">${towerPlayerState.level}</span>
              </div>
              <div class="plate-bars-col">
                <div class="p-dual-bar hp">
                  <div class="bar-fill" id="hud-hero-hp-bar" style="width:${(totalStats.currentHp / totalStats.maxHp) * 100}%;"></div>
                  <span class="bar-num">HP ${totalStats.currentHp}</span>
                </div>
                <div class="p-dual-bar mp">
                  <div class="bar-fill" id="hud-hero-mp-bar" style="width:${(totalStats.currentMp / totalStats.maxMp) * 100}%;"></div>
                  <span class="bar-num">MP ${Math.round(totalStats.currentMp)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Hero 2: Blade Warrior -->
          <div class="pixel-hero-plate">
            <div class="plate-avatar-box">
              <span class="p-avatar">👧🏻</span>
            </div>
            <div class="plate-info-col">
              <div class="plate-name-row">
                <span class="p-name">Blade Warrior</span>
                <span class="p-lvl">97</span>
              </div>
              <div class="plate-bars-col">
                <div class="p-dual-bar hp"><div class="bar-fill" style="width:100%;"></div><span class="bar-num">HP 9</span></div>
                <div class="p-dual-bar mp"><div class="bar-fill" style="width:80%;"></div><span class="bar-num">MP 6</span></div>
              </div>
            </div>
          </div>

          <!-- Hero 3: Novice Magician / Green Ranger -->
          <div class="pixel-hero-plate">
            <div class="plate-avatar-box">
              <span class="p-avatar">🧚‍♀️</span>
            </div>
            <div class="plate-info-col">
              <div class="plate-name-row">
                <span class="p-name">Novice Magician</span>
                <span class="p-lvl">66</span>
              </div>
              <div class="plate-bars-col">
                <div class="p-dual-bar hp"><div class="bar-fill" style="width:90%;"></div><span class="bar-num">HP 8</span></div>
                <div class="p-dual-bar mp"><div class="bar-fill" style="width:95%;"></div><span class="bar-num">MP 9</span></div>
              </div>
            </div>
          </div>

        </div>

        <!-- Right Side: Pixel Heroes Signature Logo & Anime Companion Portrait Box -->
        <div class="hud-companion-section" onclick="openRuneAltarPuzzle()" title="คลิกเพื่อสนทนาและไขปริศนาวิทยาการคำนวณ!">
          <div class="hud-logo-col">
            <span class="companion-calligraphy-name">${currentCompanion.name}</span>
            <div class="pixel-heroes-gold-logo">PIXEL HEROES</div>
          </div>
          <div class="companion-portrait-frame">
            <span class="c-emoji">${currentCompanion.portrait}</span>
          </div>
        </div>

      </div>

    </div>
  `;

  container.innerHTML = html;
}

function updateBottomPartyUI() {
  const totalStats = getTotalStats();
  const hpBar = document.getElementById('hud-hero-hp-bar');
  const mpBar = document.getElementById('hud-hero-mp-bar');
  if (hpBar) hpBar.style.width = `${(totalStats.currentHp / totalStats.maxHp) * 100}%`;
  if (mpBar) mpBar.style.width = `${(totalStats.currentMp / totalStats.maxMp) * 100}%`;
}

function showLevelUpToast() {
  showPopupSuccess('LEVEL UP!', `เลเวลของคุณเพิ่มเป็น Lv. ${towerPlayerState.level}!`);
}

/* -------------------------------------------------------------
   RUNE ALTAR LOGIC PUZZLE MODAL
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
    towerPlayerState.feverTimer = 20; // 20s of x2 ATK
    towerPlayerState.gold += 100;
    towerPlayerState.exp += 120;
    towerPlayerState.bonusStats.atk += 3;

    playerHero.speechBubble = "FEVER MODE x2!";
    playerHero.speechTimer = 3.5;

    saveStudentTowerProgress();
    renderTowerMainView();

    showPopupSuccess('ถอดรหัสสำเร็จ!', 'คุณได้รับ FEVER MODE x2 ATK 20 วินาที พร้อม +120 EXP, +100 Zeny, และ +3 ATK ถาวร!');
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
    towerPlayerState.monstersDefeated = 0;
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
