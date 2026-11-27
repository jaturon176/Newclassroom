/**
 * Krunoi Classroom 2D Fantasy RPG Engine
 * Built directly from the "2D Fantasy RPG - Game Concept Sheet":
 * - 4 Character Classes: Warrior, Mage, Archer, Priest (with 4-direction sprites & full gear)
 * - 4 Maps: Forest Map, Ice Cave Map, Dark Dungeon Map, Lava Volcano Map
 * - Boss: Infernal Cave Dragon (breathing fire on volcanic rock ledge with red crystals & lava river)
 */

const RPG_CLASSES = {
  warrior: {
    id: 'warrior',
    name: 'Warrior (นักรบเกราะเหล็ก)',
    icon: '⚔️',
    color: '#dc2626',
    baseHp: 150,
    baseAtk: 20,
    baseDef: 16,
    baseCrit: 10,
    skillName: 'ดาบอัศวินราชสีห์',
    skillDesc: 'โจมตีรุนแรง 160% และยกโล่ราชสีห์ทองคำลดดาเมจศัตรู 40% ในเทิร์นนี้'
  },
  mage: {
    id: 'mage',
    name: 'Mage (จอมเวทมนตรา)',
    icon: '🪄',
    color: '#7c3aed',
    baseHp: 105,
    baseAtk: 30,
    baseDef: 8,
    baseCrit: 15,
    skillName: 'มหาเวทอัญมณีม่วง',
    skillDesc: 'โจมตีเวท 165% และเพิ่มโบนัสดาเมจตามจำนวน Combo ที่ตอบถูกต่อเนื่อง'
  },
  archer: {
    id: 'archer',
    name: 'Archer (นักธนูพงไพร)',
    icon: '🏹',
    color: '#16a34a',
    baseHp: 115,
    baseAtk: 24,
    baseDef: 10,
    baseCrit: 35,
    skillName: 'ศรสายลมพิฆาต',
    skillDesc: 'โอกาสติดคริติคอลสูงพิเศษ และได้เวลาคิดคำตอบเพิ่มขึ้น +5 วินาที'
  },
  priest: {
    id: 'priest',
    name: 'Priest (นักบวชศักดิ์สิทธิ์)',
    icon: '✝️',
    color: '#d97706',
    baseHp: 135,
    baseAtk: 22,
    baseDef: 13,
    baseCrit: 12,
    skillName: 'พรแห่งคัมภีร์ศักดิ์สิทธิ์',
    skillDesc: 'โจมตีด้วยคฑากางเขนทอง 150% พร้อมฟื้นฟูพลังชีวิต (HP) 20% ทันทีที่ตอบถูก'
  }
};
// Backward compatibility aliases for existing saved characters
RPG_CLASSES.ranger = RPG_CLASSES.archer;
RPG_CLASSES.paladin = RPG_CLASSES.priest;

function normalizeRpgJobId(jobId) {
  if (jobId === 'ranger') return 'archer';
  if (jobId === 'paladin') return 'priest';
  return RPG_CLASSES[jobId] ? jobId : 'warrior';
}

const RPG_WEAPONS = [
  { id: 'w0', name: 'อาวุธเริ่มต้นผู้กล้า', icon: '🗡️', atk: 0, crit: 0, price: 0 },
  { id: 'w1', name: 'ดาบอัศวินเหล็กกล้า / คฑาฝึกหัด', icon: '⚔️', atk: 12, crit: 3, price: 120 },
  { id: 'w2', name: 'คฑาอัญมณีเวท / ธนูไม้โอ๊ก', icon: '🪄', atk: 25, crit: 6, price: 300 },
  { id: 'w3', name: 'ธนูเอลฟ์มรกต / คฑากางเขนทอง', icon: '🏹', atk: 42, crit: 12, price: 650 },
  { id: 'w4', name: 'ศาสตราวุธพิชิตมังกรอเวจี', icon: '🔥', atk: 72, crit: 20, price: 1400 }
];

const RPG_ARMORS = [
  { id: 'a0', name: 'ชุดนักผจญภัยเริ่มต้น', icon: '👕', def: 0, hp: 0, price: 0 },
  { id: 'a1', name: 'ผ้าคลุมพงไพร / เกราะหนัง', icon: '🦺', def: 8, hp: 45, price: 120 },
  { id: 'a2', name: 'ชุดคลุมจอมเวทดาวทอง / เกราะเงิน', icon: '🛡️', def: 18, hp: 110, price: 320 },
  { id: 'a3', name: 'อาภรณ์นักบวชศักดิ์สิทธิ์ / โล่ราชสีห์', icon: '⚜️', def: 32, hp: 240, price: 750 },
  { id: 'a4', name: 'เกราะเกล็ดมังกรเพลิงอเวจี', icon: '👑', def: 55, hp: 450, price: 1500 }
];

// 4 Maps from the Concept Sheet
const RPG_MAPS = {
  forest: {
    id: 'forest',
    name: '🍃 Forest Map (ป่ามรกต Lv.1-10)',
    chasmX: 540,
    chasmWidth: 74,
    bridgeY: 280,
    bridgeH: 76,
    props: [
      { type: 'tree_oak', x: 85, y: 155 },
      { type: 'tree_oak', x: 255, y: 145 },
      { type: 'tree_oak', x: 435, y: 155 },
      { type: 'tree_oak', x: 675, y: 150 },
      { type: 'tree_oak', x: 865, y: 155 },
      { type: 'tree_oak', x: 115, y: 455 },
      { type: 'tree_oak', x: 410, y: 460 },
      { type: 'tree_oak', x: 745, y: 455 },
      { type: 'mushroom', x: 175, y: 215 },
      { type: 'mushroom', x: 355, y: 195 },
      { type: 'mushroom', x: 635, y: 385 },
      { type: 'chest', x: 785, y: 185 },
      { type: 'crates', x: 325, y: 390 }
    ],
    npcs: [
      { id: 'campfire', name: '🔥 กองไฟแคมป์ (แตะเพื่อฟื้น HP 100%)', npcSprite: 'campfire', x: 215, y: 365, radius: 42, type: 'heal' },
      { id: 'blacksmith', name: '🛡️ ร้านค้าอาวุธ & อัปสเตตัส', npcSprite: 'blacksmith', x: 135, y: 255, radius: 38, type: 'shop' },
      { id: 'monument', name: '🏆 หอเกียรติยศผู้กล้า', npcSprite: 'monument', x: 330, y: 245, radius: 38, type: 'rank' },
      { id: 'portal_ice', name: '❄️ วาร์ปไป: Ice Cave Map', npcSprite: 'portal', x: 895, y: 280, radius: 38, type: 'portal', targetMap: 'ice_cave' }
    ],
    monsterTemplates: [
      { id: 'm_shroom', name: 'เห็ดพิษป่ามรกต (Lv.1)', spriteType: 'mushroom_mon', level: 1, hp: 55, atk: 14, def: 3, exp: 40, gold: 28, x: 445, y: 245 },
      { id: 'm_slime', name: 'สไลม์พงไพร (Lv.4)', spriteType: 'slime', level: 4, hp: 90, atk: 19, def: 5, exp: 65, gold: 42, x: 675, y: 235 },
      { id: 'm_goblin', name: 'ก็อบลินนักล่า (Lv.8)', spriteType: 'goblin', level: 8, hp: 155, atk: 28, def: 9, exp: 115, gold: 75, x: 795, y: 365 }
    ]
  },
  ice_cave: {
    id: 'ice_cave',
    name: '❄️ Ice Cave Map (ถ้ำน้ำแข็งคริสตัล Lv.10-20)',
    chasmX: 500,
    chasmWidth: 78,
    bridgeY: 280,
    bridgeH: 76,
    props: [
      { type: 'snow_pine', x: 150, y: 175 },
      { type: 'snow_pine', x: 380, y: 165 },
      { type: 'snow_pine', x: 790, y: 175 },
      { type: 'ice_crystal', x: 265, y: 185 },
      { type: 'ice_crystal', x: 625, y: 175 },
      { type: 'ice_crystal', x: 345, y: 435 },
      { type: 'ice_crystal', x: 720, y: 435 },
      { type: 'snow_fence', x: 280, y: 235 },
      { type: 'chest', x: 855, y: 195 }
    ],
    npcs: [
      { id: 'portal_forest', name: '🍃 กลับ Forest Map', npcSprite: 'portal', x: 75, y: 280, radius: 36, type: 'portal', targetMap: 'forest' },
      { id: 'portal_dungeon', name: '💀 ไปต่อ: Dark Dungeon Map', npcSprite: 'portal', x: 895, y: 280, radius: 36, type: 'portal', targetMap: 'dark_dungeon' }
    ],
    monsterTemplates: [
      { id: 'm_iceslime', name: 'สไลม์น้ำแข็ง (Lv.11)', spriteType: 'ice_slime', level: 11, hp: 210, atk: 35, def: 13, exp: 155, gold: 105, x: 255, y: 345 },
      { id: 'm_wolf', name: 'หมาป่าหิมะเขี้ยวเงิน (Lv.15)', spriteType: 'wolf', level: 15, hp: 300, atk: 44, def: 17, exp: 215, gold: 145, x: 645, y: 245 },
      { id: 'm_icegolem', name: 'โกเลมคริสตัลน้ำแข็ง (Lv.19)', spriteType: 'golem', level: 19, hp: 390, atk: 54, def: 22, exp: 280, gold: 185, x: 775, y: 365 }
    ]
  },
  dark_dungeon: {
    id: 'dark_dungeon',
    name: '💀 Dark Dungeon Map (คุกใต้ดินรัตติกาล Lv.20-30)',
    chasmX: 500,
    chasmWidth: 74,
    bridgeY: 280,
    bridgeH: 76,
    props: [
      { type: 'dungeon_torch', x: 165, y: 160 },
      { type: 'dungeon_torch', x: 395, y: 160 },
      { type: 'dungeon_torch', x: 625, y: 160 },
      { type: 'dungeon_torch', x: 835, y: 160 },
      { type: 'hanging_cage', x: 285, y: 175 },
      { type: 'iron_gate', x: 735, y: 165 },
      { type: 'skulls', x: 155, y: 420 },
      { type: 'skulls', x: 655, y: 430 },
      { type: 'crates', x: 375, y: 430 },
      { type: 'candles', x: 585, y: 225 }
    ],
    npcs: [
      { id: 'portal_ice_back', name: '❄️ กลับ Ice Cave Map', npcSprite: 'portal', x: 75, y: 280, radius: 36, type: 'portal', targetMap: 'ice_cave' },
      { id: 'portal_volcano', name: '🔥 ไปต่อ: Lava Volcano Map (Boss)', npcSprite: 'portal', x: 895, y: 280, radius: 36, type: 'portal', targetMap: 'lava_volcano' }
    ],
    monsterTemplates: [
      { id: 'm_bat', name: 'ค้างคาวรัตติกาล (Lv.21)', spriteType: 'bat', level: 21, hp: 440, atk: 58, def: 24, exp: 320, gold: 215, x: 265, y: 275 },
      { id: 'm_skeleton', name: 'โครงกระดูกนักรบ (Lv.25)', spriteType: 'skeleton', level: 25, hp: 520, atk: 65, def: 28, exp: 390, gold: 265, x: 645, y: 245 },
      { id: 'm_knight', name: 'อัศวินเกราะทมิฬ (Lv.29)', spriteType: 'knight', level: 29, hp: 620, atk: 74, def: 33, exp: 470, gold: 320, x: 785, y: 360 }
    ]
  },
  lava_volcano: {
    id: 'lava_volcano',
    name: '🔥 Lava Volcano Map (ภูเขาไฟลาวา & บอสมังกร Lv.30+)',
    chasmX: 465,
    chasmWidth: 96,
    bridgeY: 280,
    bridgeH: 78,
    props: [
      { type: 'red_crystal', x: 135, y: 190 },
      { type: 'red_crystal', x: 635, y: 185 },
      { type: 'red_crystal', x: 885, y: 195 },
      { type: 'red_crystal', x: 665, y: 430 },
      { type: 'red_crystal', x: 875, y: 425 },
      { type: 'volcano_banner', x: 355, y: 185 },
      { type: 'volcano_banner', x: 585, y: 185 },
      { type: 'bone_ribs', x: 235, y: 425 }
    ],
    npcs: [
      { id: 'portal_dungeon_back', name: '💀 กลับ Dark Dungeon Map', npcSprite: 'portal', x: 75, y: 280, radius: 36, type: 'portal', targetMap: 'dark_dungeon' },
      { id: 'portal_forest_home', name: '🍃 กลับแคมป์ Forest Map', npcSprite: 'portal', x: 75, y: 390, radius: 34, type: 'portal', targetMap: 'forest' }
    ],
    monsterTemplates: [
      { id: 'm_magma', name: 'โกเลมแมกมาลาวา (Lv.32)', spriteType: 'magma_golem', level: 32, hp: 720, atk: 82, def: 36, exp: 560, gold: 390, x: 285, y: 275 },
      { id: 'm_dragon', name: '👑 Infernal Cave Dragon (มังกรเพลิงถ้ำอเวจี Lv.40)', spriteType: 'dragon', level: 40, hp: 1200, atk: 98, def: 45, exp: 1000, gold: 800, x: 765, y: 275, isBoss: true }
    ]
  }
};
// Backward compatibility map aliases
RPG_MAPS.town = RPG_MAPS.forest;
RPG_MAPS.desert = RPG_MAPS.ice_cave;
RPG_MAPS.castle = RPG_MAPS.lava_volcano;

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
  currentMap: 'forest',
  localX: 230,
  localY: 280,
  targetX: 230,
  targetY: 280,
  facing: 1,       // 1 = right, -1 = left
  facingDir: 'right', // 'right' | 'left' | 'up' | 'down'
  walkPhase: 0,
  isMoving: false,
  moveDirX: 0,
  moveDirY: 0,
  keysPressed: {},
  chatBubbleText: '',
  chatBubbleExpire: 0,
  lastSyncTime: 0,
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

/* =============================================================
   CONCEPT SHEET 2D SPRITE RENDERER (4 CLASSES, 4 MAPS, BOSS DRAGON)
============================================================= */

/**
 * Draws the 4 Chibi 2D Pixel-Art Character Classes matching the "2D Fantasy RPG - Game Concept Sheet":
 * - Warrior: Silver knight helm with red plume, silver plate armor, red cape, golden lion-crest shield, silver broadsword
 * - Mage: Lavender long hair, purple star witch hat with yellow band, purple/gold robe, golden ring-staff with glowing violet orb
 * - Archer: Brown hair, green Robin-Hood cap with white feather, green tunic/cape, quiver on back, tall curved wooden bow
 * - Priest: White & blue-trimmed hooded habit with gold cross, sacred blue/gold cross bible tome, tall golden cross staff
 */
function draw2dHeroSprite(ctx, x, y, rawJob = 'warrior', facing = 1, walkPhase = 0, scale = 1.0, facingDir = 'right') {
  const job = normalizeRpgJobId(rawJob);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const legSwing = Math.sin(walkPhase) * 5.5;
  const bobY = Math.abs(Math.sin(walkPhase)) * -2.2;
  const isBack = facingDir === 'up';

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
  ctx.beginPath();
  ctx.ellipse(0, 23, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(0, bobY);
  if (facing < 0) {
    ctx.scale(-1, 1);
  }

  ctx.strokeStyle = '#181020';
  ctx.lineWidth = 2.0;
  ctx.lineJoin = 'round';

  // --- 1. BACK CAPE / QUIVER ---
  if (job === 'warrior') {
    ctx.fillStyle = '#c82828';
    ctx.beginPath();
    ctx.moveTo(-9, -6);
    ctx.quadraticCurveTo(-19, 8 + legSwing * 0.25, -16, 19);
    ctx.lineTo(8, 19);
    ctx.lineTo(10, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (job === 'archer') {
    // Quiver with feathered arrows on back + forest green cape
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-14, -12, 7, 16, 2);
    ctx.fill();
    ctx.stroke();
    // White arrow feathers sticking out
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-16, -16, 4, 4);
    ctx.fillRect(-12, -17, 4, 4);

    ctx.fillStyle = '#166534';
    ctx.beginPath();
    ctx.moveTo(-8, -5);
    ctx.lineTo(-15, 17);
    ctx.lineTo(6, 17);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  } else if (job === 'mage') {
    // Long flowing lavender hair behind back
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(-5, -4, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  } else if (job === 'priest') {
    // White & blue-trimmed holy cape
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-11, -6);
    ctx.lineTo(-16, 18);
    ctx.lineTo(12, 18);
    ctx.lineTo(10, -6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // --- 2. BOOTS / LEGS ---
  const bootColor = job === 'warrior' ? '#94a3b8' : (job === 'archer' ? '#78350f' : (job === 'mage' ? '#4c1d95' : '#e2e8f0'));
  ctx.fillStyle = bootColor;
  ctx.beginPath();
  ctx.roundRect(-8 + legSwing * 0.5, 10, 7, 12, 3);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(1 - legSwing * 0.5, 10, 7, 12, 3);
  ctx.fill();
  ctx.stroke();

  // --- 3. TORSO / ARMOR / ROBE ---
  if (job === 'warrior') {
    // Silver Plate Armor with Red Trim & Gold Belt
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(-11, -7, 22, 19, 5);
    ctx.fill();
    ctx.stroke();
    // Red chest plate accent
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(-4, -5, 8, 9);
    // Gold belt buckle
    ctx.fillStyle = '#475569';
    ctx.fillRect(-11, 5, 22, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-3, 4, 6, 6);
  } else if (job === 'mage') {
    // Purple Robe with Golden Trim & Sash
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.moveTo(-9, -7);
    ctx.lineTo(-14, 18);
    ctx.lineTo(14, 18);
    ctx.lineTo(9, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Golden center trim & belt
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-10, 3, 20, 4);
    ctx.fillRect(-2, -6, 4, 24);
  } else if (job === 'archer') {
    // Forest Green Tunic with Brown Leather Strap & Belt
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-10, -7, 20, 19, 4);
    ctx.fill();
    ctx.stroke();
    // Gold collar trim
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-9, -6, 18, 3);
    // Brown leather belt
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-10, 5, 20, 4);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-2, 5, 5, 4);
  } else if (job === 'priest') {
    // White Vestment with Blue & Gold Cross Tabard
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-10, -7);
    ctx.lineTo(-14, 19);
    ctx.lineTo(14, 19);
    ctx.lineTo(10, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Blue & Gold front stole
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-5, -5, 10, 23);
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-1.5, -4, 3, 21);
    ctx.fillRect(-5, 6, 10, 3);
  }

  // --- 4. HEAD, HAIR & FACE ---
  if (!isBack) {
    // Chibi Face
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    ctx.arc(0, -17, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hair bangs above eyes
    const hairColors = {
      warrior: '#78350f',
      mage: '#c084fc',
      archer: '#713f12',
      priest: '#4c1d95'
    };
    ctx.fillStyle = hairColors[job] || '#78350f';
    ctx.beginPath();
    ctx.arc(0, -19, 10.5, Math.PI, Math.PI * 2);
    ctx.fill();

    // Side hair locks for Mage & Priest
    if (job === 'mage') {
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.ellipse(-9, -11, 4, 8, 0.2, 0, Math.PI * 2);
      ctx.ellipse(9, -11, 4, 8, -0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (job === 'priest') {
      ctx.fillStyle = '#4c1d95';
      ctx.beginPath();
      ctx.ellipse(-8, -13, 3, 6, 0, 0, Math.PI * 2);
      ctx.ellipse(8, -13, 3, 6, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cute Dark Chibi Eyes (matching Concept Sheet!)
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-4, -18, 3, 5);
    ctx.fillRect(4, -18, 3, 5);
    // White eye highlight
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-3.5, -17.5, 1.4, 1.4);
    ctx.fillRect(4.5, -17.5, 1.4, 1.4);
    // Rosy cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
    ctx.fillRect(-7, -13, 3, 2);
    ctx.fillRect(6, -13, 3, 2);
  }

  // --- 5. CLASS HELMET / HAT / HOOD ---
  if (job === 'warrior') {
    // Red Horsehair Plume on top of Helmet
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-2, -28);
    ctx.quadraticCurveTo(-16, -42, -20, -22);
    ctx.quadraticCurveTo(-12, -18, -3, -26);
    ctx.fill();
    ctx.stroke();

    // Silver Knight Open-Visor Helmet
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(0, -20, 12, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    ctx.stroke();
    // Visor ridge & cheek guards
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-12, -23, 24, 4);
    ctx.strokeRect(-12, -23, 24, 4);
    ctx.fillRect(-12, -19, 4, 8);
    ctx.strokeRect(-12, -19, 4, 8);

  } else if (job === 'mage') {
    // Wide Purple Witch/Wizard Hat with Gold Star & Ribbon
    ctx.fillStyle = '#7e22ce';
    ctx.beginPath();
    ctx.ellipse(0, -23, 18, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-12, -24);
    ctx.quadraticCurveTo(-2, -45, 8, -42);
    ctx.lineTo(12, -24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Yellow hat ribbon & Gold Star
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-10, -27, 20, 3.5);
    ctx.beginPath();
    ctx.arc(0, -27, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (job === 'archer') {
    // Forest Green Robin-Hood Cap + White Feather
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(0, -20, 12, Math.PI * 0.85, Math.PI * 2.15);
    ctx.lineTo(0, -33);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // White Feather on side of hood
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(-6, -26);
    ctx.quadraticCurveTo(-17, -38, -13, -41);
    ctx.quadraticCurveTo(-4, -34, -4, -26);
    ctx.fill();
    ctx.stroke();

  } else if (job === 'priest') {
    // White & Blue-Trimmed Holy Hood with Gold Cross Emblem
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, -19, 13, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();
    ctx.stroke();

    // Blue hood band
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(-10, -28, 20, 3.5);

    // Gold Cross on top of hood
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-1.5, -31, 3, 7);
    ctx.fillRect(-4, -29, 8, 2.5);
  }

  // --- 6. WEAPONS & OFF-HAND SHIELDS/BOOKS ---
  const armSwing = -legSwing * 0.35;

  if (job === 'warrior') {
    // Right Arm: Golden Lion-Crest Shield (Red Rim, Gold Center)
    ctx.save();
    ctx.translate(-12, 1);
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#b91c1c';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-7, -9);
    ctx.lineTo(7, -9);
    ctx.lineTo(7, 2);
    ctx.lineTo(0, 11);
    ctx.lineTo(-7, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Red Lion Emblem inside shield
    ctx.fillStyle = '#b91c1c';
    ctx.fillRect(-2.5, -4, 5, 7);
    ctx.restore();

    // Left Arm: Upright Silver Broadsword with Gold Hilt
    ctx.save();
    ctx.translate(13, 0 + armSwing);
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#181020';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(-3, -4);
    ctx.lineTo(-3, -26);
    ctx.lineTo(0, -32);
    ctx.lineTo(3, -26);
    ctx.lineTo(3, -4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gold Crossguard & Pommel
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-6, -5, 12, 3.5);
    ctx.strokeRect(-6, -5, 12, 3.5);
    ctx.restore();

  } else if (job === 'mage') {
    // Golden Ring-Staff with Glowing Violet Magic Orb
    ctx.save();
    ctx.translate(14, -2 + armSwing);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 18);
    ctx.lineTo(0, -14);
    ctx.stroke();

    // Golden Crescent Ring
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, -21, 7.5, 0, Math.PI * 2);
    ctx.stroke();

    // Glowing Purple Magic Orb inside Ring
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, -21, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-2, -23, 2, 2);
    ctx.restore();

  } else if (job === 'archer') {
    // Tall Curved Wooden Bow & Strung Arrow
    ctx.save();
    ctx.translate(12, -2 + armSwing);
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(-2, 0, 16, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();

    // Bowstring
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(0, 15);
    ctx.stroke();
    ctx.restore();

  } else if (job === 'priest') {
    // Right Hand: Sacred Blue Tome with Gold Cross
    ctx.save();
    ctx.translate(-11, 3);
    ctx.fillStyle = '#1e3a8a';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(-5, -6, 10, 12, 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-1, -4, 2, 8);
    ctx.fillRect(-3, -2, 6, 2);
    ctx.restore();

    // Left Hand: Tall Golden Cross Staff (Crozier)
    ctx.save();
    ctx.translate(14, -2 + armSwing);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 19);
    ctx.lineTo(0, -16);
    ctx.stroke();

    // Ornate Golden Cross Top
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#181020';
    ctx.lineWidth = 1.5;
    ctx.fillRect(-2.5, -31, 5, 16);
    ctx.strokeRect(-2.5, -31, 5, 16);
    ctx.fillRect(-7, -26, 14, 4.5);
    ctx.strokeRect(-7, -26, 14, 4.5);
    ctx.restore();
  }

  ctx.restore();
  ctx.restore();
}

/**
 * Draws 2D Monsters & the Infernal Cave Dragon Boss matching the Concept Sheet!
 */
function draw2dMonsterSprite(ctx, x, y, spriteType = 'slime', animTime = 0, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bounce = Math.sin(animTime * 4) * 3;
  ctx.strokeStyle = '#181020';
  ctx.lineWidth = 1.8;

  if (spriteType === 'dragon') {
    // =========================================================
    // BOSS EXAMPLE FROM CONCEPT SHEET: INFERNAL CAVE DRAGON
    // =========================================================
    const wingFlap = Math.sin(animTime * 4.5) * 7;
    const firePulse = Math.sin(animTime * 12) * 3;

    // 1. Volcanic Rock Ledge & Glowing Red Crystals under Dragon
    ctx.fillStyle = '#3f2e3e';
    ctx.beginPath();
    ctx.ellipse(0, 24, 42, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red Crystals on left & right of ledge
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(-36, 22);
    ctx.lineTo(-32, 8);
    ctx.lineTo(-27, 22);
    ctx.moveTo(30, 24);
    ctx.lineTo(36, 6);
    ctx.lineTo(41, 24);
    ctx.fill();
    ctx.stroke();

    ctx.save();
    ctx.translate(0, bounce * 0.5);

    // 2. Massive Tattered Fiery Bat Wings
    const wingGrad = ctx.createLinearGradient(0, -35, 0, 15);
    wingGrad.addColorStop(0, '#7f1d1d');
    wingGrad.addColorStop(0.6, '#dc2626');
    wingGrad.addColorStop(1, '#f97316');

    ctx.fillStyle = wingGrad;
    // Left Wing
    ctx.beginPath();
    ctx.moveTo(-12, -10);
    ctx.lineTo(-46, -34 + wingFlap);
    ctx.lineTo(-52, -6 + wingFlap);
    ctx.lineTo(-36, -12 + wingFlap * 0.5);
    ctx.lineTo(-28, 2);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Wing
    ctx.beginPath();
    ctx.moveTo(12, -10);
    ctx.lineTo(46, -34 + wingFlap);
    ctx.lineTo(52, -6 + wingFlap);
    ctx.lineTo(36, -12 + wingFlap * 0.5);
    ctx.lineTo(28, 2);
    ctx.lineTo(14, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Coiled Spiked Dragon Tail with Magma Cracks
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(14, 12);
    ctx.quadraticCurveTo(38, 10, 34, -4);
    ctx.quadraticCurveTo(26, 4, 14, 4);
    ctx.fill();
    ctx.stroke();

    // 4. Muscular Dragon Torso & Cream-Gold Segmented Belly Plates
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.ellipse(0, 3, 19, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cream-Gold Belly Scales
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.ellipse(0, 5, 11, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Belly segments
    ctx.beginPath();
    ctx.moveTo(-9, 0); ctx.lineTo(9, 0);
    ctx.moveTo(-10, 6); ctx.lineTo(10, 6);
    ctx.moveTo(-8, 12); ctx.lineTo(8, 12);
    ctx.stroke();

    // Dragon Claws on Ledge
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.roundRect(-20, 14, 11, 8, 3);
    ctx.roundRect(9, 14, 11, 8, 3);
    ctx.fill();
    ctx.stroke();

    // 5. Fierce Horned Dragon Head
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(-2, -18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Cream-Gold Sweep Horns
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.moveTo(-6, -27);
    ctx.lineTo(-18, -40);
    ctx.lineTo(-1, -29);
    ctx.moveTo(6, -26);
    ctx.lineTo(19, -39);
    ctx.lineTo(10, -23);
    ctx.fill();
    ctx.stroke();

    // Glowing Yellow-Orange Dragon Eyes
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.polygon ? ctx.arc(-6, -20, 2.8, 0, Math.PI * 2) : ctx.arc(-6, -20, 2.8, 0, Math.PI * 2);
    ctx.arc(2, -19, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Roaring Fire Breath Stream (Shooting left-down from jaws like Concept Sheet!)
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-11, -14);
    ctx.quadraticCurveTo(-28, -12, -38 - firePulse, -1 + firePulse);
    ctx.quadraticCurveTo(-28, 6, -10, -9);
    ctx.fill();

    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.moveTo(-11, -13);
    ctx.quadraticCurveTo(-24, -10, -30 - firePulse * 0.6, -2);
    ctx.quadraticCurveTo(-22, 2, -10, -10);
    ctx.fill();

    ctx.restore();
    ctx.restore();
    return;
  }

  // Ground shadow for standard monsters
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(0, 20, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  if (spriteType === 'mushroom_mon') {
    // Forest Red-Spotted Mushroom Monster
    ctx.save();
    ctx.translate(0, bounce);
    // Stalk body
    ctx.fillStyle = '#fef3c7';
    ctx.beginPath();
    ctx.roundRect(-8, 0, 16, 17, 5);
    ctx.fill();
    ctx.stroke();
    // Red mushroom cap
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, 17, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // White spots
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-8, -7, 3.5, 0, Math.PI * 2);
    ctx.arc(2, -11, 4, 0, Math.PI * 2);
    ctx.arc(10, -6, 3, 0, Math.PI * 2);
    ctx.fill();
    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, 5, 2.5, 4);
    ctx.fillRect(2, 5, 2.5, 4);
    ctx.restore();

  } else if (spriteType === 'slime' || spriteType === 'ice_slime') {
    const squishX = 1 + Math.sin(animTime * 4) * 0.06;
    const squishY = 1 - Math.sin(animTime * 4) * 0.06;
    ctx.save();
    ctx.translate(0, bounce);
    ctx.scale(squishX, squishY);

    ctx.fillStyle = spriteType === 'ice_slime' ? '#38bdf8' : '#22c55e';
    ctx.beginPath();
    ctx.moveTo(-16, 14);
    ctx.quadraticCurveTo(-18, -10, 0, -14);
    ctx.quadraticCurveTo(18, -10, 16, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.ellipse(-6, -5, 4, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5, 2, 2.4, 0, Math.PI * 2);
    ctx.arc(5, 2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (spriteType === 'goblin') {
    ctx.save();
    ctx.translate(0, bounce * 0.6);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-7, 6, 5, 12);
    ctx.fillRect(2, 6, 5, 12);
    ctx.beginPath();
    ctx.roundRect(-9, -6, 18, 15, 4);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.moveTo(-10, -14); ctx.lineTo(-21, -18); ctx.lineTo(-10, -9);
    ctx.moveTo(10, -14); ctx.lineTo(21, -18); ctx.lineTo(10, -9);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -13, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-4, -13, 2, 0, Math.PI * 2);
    ctx.arc(4, -13, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(10, -16, 6, 20, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

  } else if (spriteType === 'wolf') {
    ctx.save();
    ctx.translate(0, bounce * 0.5);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-13, 6, 4, 12);
    ctx.fillRect(-5, 6, 4, 12);
    ctx.fillRect(5, 6, 4, 12);
    ctx.fillRect(12, 6, 4, 12);

    ctx.beginPath();
    ctx.ellipse(2, 1, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-11, -7, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-16, -13); ctx.lineTo(-14, -22); ctx.lineTo(-10, -14);
    ctx.moveTo(-9, -13); ctx.lineTo(-6, -22); ctx.lineTo(-4, -13);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-13, -8, 2.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (spriteType === 'golem' || spriteType === 'magma_golem') {
    const isMagma = spriteType === 'magma_golem';
    ctx.save();
    ctx.translate(0, bounce * 0.3);
    ctx.fillStyle = isMagma ? '#451a03' : '#38bdf8';
    ctx.beginPath();
    ctx.roundRect(-16, -14, 32, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isMagma ? '#7c2d12' : '#bae6fd';
    ctx.beginPath();
    ctx.roundRect(-10, -25, 20, 13, 4);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = isMagma ? '#f97316' : '#ffffff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-6, -4); ctx.lineTo(0, 2); ctx.lineTo(7, -5);
    ctx.moveTo(0, 2); ctx.lineTo(0, 9);
    ctx.stroke();

    ctx.fillStyle = isMagma ? '#fde047' : '#0284c7';
    ctx.fillRect(-6, -20, 4, 3);
    ctx.fillRect(2, -20, 4, 3);
    ctx.restore();

  } else if (spriteType === 'bat') {
    const wingFlap = Math.sin(animTime * 9) * 10;
    ctx.save();
    ctx.translate(0, bounce * 1.4 - 4);
    ctx.fillStyle = '#6d28d9';
    ctx.beginPath();
    ctx.moveTo(-6, -2);
    ctx.quadraticCurveTo(-22, -16 + wingFlap, -26, 2 + wingFlap);
    ctx.quadraticCurveTo(-15, 4, -6, 5);
    ctx.moveTo(6, -2);
    ctx.quadraticCurveTo(22, -16 + wingFlap, 26, 2 + wingFlap);
    ctx.quadraticCurveTo(15, 4, 6, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-3.5, -2, 1.8, 0, Math.PI * 2);
    ctx.arc(3.5, -2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (spriteType === 'skeleton') {
    // Dark Dungeon Skeleton Warrior
    ctx.save();
    ctx.translate(0, bounce * 0.5);
    ctx.fillStyle = '#e2e8f0';
    // Ribcage
    ctx.fillRect(-7, -6, 14, 14);
    ctx.strokeRect(-7, -6, 14, 14);
    // Skull
    ctx.beginPath();
    ctx.arc(0, -15, 9.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Dark eye sockets
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-5, -17, 3.5, 3.5);
    ctx.fillRect(1.5, -17, 3.5, 3.5);
    // Bone sword
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(11, -18, 4, 20);
    ctx.strokeRect(11, -18, 4, 20);
    ctx.restore();

  } else if (spriteType === 'knight') {
    ctx.save();
    ctx.translate(0, bounce * 0.4);
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.roundRect(-14, -8, 28, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-12, -10, 24, 22, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, -19, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-9, -22); ctx.lineTo(-18, -32); ctx.lineTo(-5, -27);
    ctx.moveTo(9, -22); ctx.lineTo(18, -32); ctx.lineTo(5, -27);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-6, -20, 12, 3);
    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws 2D Scenery Props specific to the 4 Maps from the Concept Sheet
 */
function draw2dMapProp(ctx, prop, animTime = 0) {
  const { type, x, y } = prop;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#181020';
  ctx.lineWidth = 1.8;

  if (type === 'tree_oak') {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-8, -14, 16, 28, 3);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(-14, -22, 18, 0, Math.PI * 2);
    ctx.arc(14, -22, 18, 0, Math.PI * 2);
    ctx.arc(0, -34, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.arc(-7, -27, 11, 0, Math.PI * 2);
    ctx.arc(8, -26, 10, 0, Math.PI * 2);
    ctx.arc(0, -37, 13, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'mushroom') {
    // Spotted Red Mushroom from Forest Map
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-4, 0, 8, 10);
    ctx.strokeRect(-4, 0, 8, 10);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(0, 0, 11, Math.PI, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4, -5, 2.2, 0, Math.PI * 2);
    ctx.arc(4, -6, 2.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'chest') {
    // Wooden Treasure Chest with Gold Trim (Forest & Ice Cave Maps)
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(-14, -10, 28, 20, 4);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#facc15';
    ctx.fillRect(-14, -2, 28, 3);
    ctx.fillRect(-3, -4, 6, 7);
    ctx.strokeRect(-3, -4, 6, 7);

  } else if (type === 'crates') {
    // Wooden Crate & Barrel
    ctx.fillStyle = '#b45309';
    ctx.fillRect(-16, -8, 16, 16);
    ctx.strokeRect(-16, -8, 16, 16);
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(2, -10, 14, 18, 4);
    ctx.fill();
    ctx.stroke();

  } else if (type === 'snow_pine') {
    // Snow-Covered Pine Tree from Ice Cave Map
    ctx.fillStyle = '#713f12';
    ctx.fillRect(-5, -2, 10, 16);
    ctx.strokeRect(-5, -2, 10, 16);
    const tiers = [
      { yBase: 0, w: 42, h: 22 },
      { yBase: -14, w: 34, h: 20 },
      { yBase: -26, w: 24, h: 18 }
    ];
    tiers.forEach(t => {
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(-t.w / 2, t.yBase);
      ctx.lineTo(0, t.yBase - t.h);
      ctx.lineTo(t.w / 2, t.yBase);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // White snow cap
      ctx.fillStyle = '#f0f9ff';
      ctx.beginPath();
      ctx.moveTo(-t.w * 0.38, t.yBase - t.h * 0.25);
      ctx.lineTo(0, t.yBase - t.h);
      ctx.lineTo(t.w * 0.38, t.yBase - t.h * 0.25);
      ctx.closePath();
      ctx.fill();
    });

  } else if (type === 'ice_crystal' || type === 'red_crystal') {
    // Glowing Cyan Ice Crystals or Red Volcano Crystals
    const isRed = type === 'red_crystal';
    ctx.fillStyle = isRed ? '#ef4444' : '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(-12, 10); ctx.lineTo(-10, -10); ctx.lineTo(-4, -18); ctx.lineTo(0, 10);
    ctx.moveTo(-2, 10); ctx.lineTo(2, -24); ctx.lineTo(8, -12); ctx.lineTo(6, 10);
    ctx.moveTo(5, 10); ctx.lineTo(12, -14); ctx.lineTo(16, -4); ctx.lineTo(12, 10);
    ctx.fill();
    ctx.stroke();

  } else if (type === 'snow_fence') {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-18, -10, 5, 20);
    ctx.fillRect(13, -10, 5, 20);
    ctx.fillRect(-20, -5, 40, 5);
    ctx.strokeRect(-20, -5, 40, 5);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(-20, -7, 40, 3);

  } else if (type === 'dungeon_torch') {
    // Wall Torch + Red Demon Banner from Dark Dungeon Map
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.moveTo(-12, -16);
    ctx.lineTo(12, -16);
    ctx.lineTo(12, 8);
    ctx.lineTo(0, 2);
    ctx.lineTo(-12, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Glowing Torch flame
    const fl = Math.sin(animTime * 10) * 2;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -24, 6 + fl * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -24, 3, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'hanging_cage') {
    // Hanging Iron Cage from Dark Dungeon Map
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, -45);
    ctx.lineTo(0, -18);
    ctx.stroke();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.75)';
    ctx.fillRect(-12, -18, 24, 28);
    ctx.strokeRect(-12, -18, 24, 28);
    ctx.beginPath();
    ctx.moveTo(-4, -18); ctx.lineTo(-4, 10);
    ctx.moveTo(4, -18); ctx.lineTo(4, 10);
    ctx.stroke();

  } else if (type === 'iron_gate') {
    // Arched Iron Portcullis Gate from Dark Dungeon Map
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -8, 18, Math.PI, Math.PI * 2);
    ctx.lineTo(18, 16);
    ctx.lineTo(-18, 16);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.stroke();
    for (let gx = -12; gx <= 12; gx += 6) {
      ctx.beginPath();
      ctx.moveTo(gx, -22);
      ctx.lineTo(gx, 16);
      ctx.stroke();
    }

  } else if (type === 'skulls') {
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.arc(-6, 4, 6, 0, Math.PI * 2);
    ctx.arc(6, 5, 5.5, 0, Math.PI * 2);
    ctx.arc(0, -1, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (type === 'candles') {
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-6, -4, 4, 10);
    ctx.fillRect(2, -7, 4, 13);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-4, -7, 2.5, 0, Math.PI * 2);
    ctx.arc(4, -10, 2.5, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'volcano_banner') {
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-2, -26, 4, 38);
    ctx.fillStyle = '#b91c1c';
    ctx.beginPath();
    ctx.moveTo(-11, -22);
    ctx.lineTo(11, -22);
    ctx.lineTo(11, 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(-11, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (type === 'bone_ribs') {
    // Giant Dragon Ribcage Skeleton from Lava Volcano Map
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3.5;
    for (let bx = -18; bx <= 18; bx += 9) {
      ctx.beginPath();
      ctx.arc(bx, 6, 14, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
    }
  }

  ctx.restore();
}

/**
 * Draws Interactive Map NPCs (Campfire Heal, Blacksmith, Leaderboard Monument, Teleport Portal)
 */
function draw2dNpcObject(ctx, npc, isNear, animTime) {
  ctx.save();
  ctx.translate(npc.x, npc.y);
  ctx.strokeStyle = '#181020';
  ctx.lineWidth = 1.8;

  if (npc.npcSprite === 'campfire') {
    // Blazing Campfire from Forest Map
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-16, 4, 32, 7, 3);
    ctx.fill();
    ctx.stroke();

    const fl = Math.sin(animTime * 10) * 3;
    ctx.fillStyle = '#ea580c';
    ctx.beginPath();
    ctx.moveTo(-13, 6);
    ctx.quadraticCurveTo(0, -24 - fl, 13, 6);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-7, 6);
    ctx.quadraticCurveTo(0, -14 + fl, 7, 6);
    ctx.closePath();
    ctx.fill();

  } else if (npc.npcSprite === 'blacksmith') {
    draw2dHeroSprite(ctx, -6, -4, 'warrior', 1, 0, 0.85);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(10, 2, 16, 11, 3);
    ctx.fill();
    ctx.stroke();

  } else if (npc.npcSprite === 'monument') {
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-14, 0, 28, 14);
    ctx.strokeRect(-14, 0, 28, 14);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -10, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

  } else if (npc.npcSprite === 'portal') {
    ctx.save();
    ctx.rotate(animTime * 2.2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 21, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.strokeStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(0, 0, 14, Math.PI * 0.4, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  ctx.font = "800 12px 'Sarabun', sans-serif";
  const textW = ctx.measureText(npc.name).width + 12;
  ctx.fillStyle = isNear ? 'rgba(37, 99, 235, 0.92)' : 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(-textW / 2, -46, textW, 18, 6);
  ctx.fill();
  ctx.fillStyle = isNear ? '#fde047' : '#e2e8f0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(npc.name, 0, -37);

  ctx.restore();
}

/**
 * Renders the 4 Hero Class 2D Sprite Previews on the Character Selection Cards
 */
function renderRpgClassPreviewCanvases() {
  ['warrior', 'mage', 'archer', 'priest'].forEach(jobId => {
    const c = document.getElementById(`rpg-preview-${jobId}`);
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    draw2dHeroSprite(ctx, c.width / 2, c.height / 2 + 15, jobId, 1, 0, 1.55);
  });
}

function getRpgPlayerId() {
  if (!currentUser) return 'guest';
  return currentUser.studentId || currentUser.username || 'admin';
}

function getRpgRoomKey() {
  if (!currentUser) return 'global';
  const rawClass = (currentUser.classLevel || 'global').trim();
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
      rpgState.hero.job = normalizeRpgJobId(rpgState.hero.job);
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
  renderRpgClassPreviewCanvases();

  const myId = getRpgPlayerId();
  if (rpgState.allCharacters[myId]) {
    rpgState.hero = rpgState.allCharacters[myId];
    rpgState.hero.job = normalizeRpgJobId(rpgState.hero.job);
  } else {
    rpgState.hero = null;
  }

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
    job: normalizeRpgJobId(rpgState.hero.job),
    level: rpgState.hero.level || 1,
    map: rpgState.currentMap || 'forest',
    x: Math.round(rpgState.localX),
    y: Math.round(rpgState.localY),
    facing: rpgState.facing,
    facingDir: rpgState.facingDir || 'right',
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
    renderRpgClassPreviewCanvases();
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
function selectRpgHeroClass(rawJobId) {
  const jobId = normalizeRpgJobId(rawJobId);
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
      `เข้าสู่โลกผจญภัย 2D Fantasy RPG เรียบร้อย เลือกเดินสำรวจทั้ง 4 แผนที่และพิชิตบอสมังกร Infernal Cave Dragon ได้เลย!`
    );
  });
}

function openRpgChangeClassScreen() {
  const createScreen = document.getElementById('rpg-create-char-screen');
  const mainStage = document.getElementById('rpg-main-stage');
  if (createScreen) createScreen.style.display = 'block';
  if (mainStage) mainStage.style.display = 'none';
  renderRpgClassPreviewCanvases();
}

function computeRpgHeroTotalStats(hero) {
  if (!hero) return { maxHp: 100, atk: 20, def: 10, crit: 10, nextExp: 100 };
  const cls = RPG_CLASSES[normalizeRpgJobId(hero.job)] || RPG_CLASSES.warrior;
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
  Object.keys(submissionsData || {}).forEach(hwId => {
    const sub = submissionsData[hwId]?.[studentId];
    if (sub && sub.score !== undefined && sub.score !== '' && !isNaN(Number(sub.score))) {
      totalRealScore += Number(sub.score);
    }
  });
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
  rpgState.localX = mapId === 'forest' ? 230 : 140;
  rpgState.localY = 280;
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

// 2D Canvas Input Controls
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

      const mapDef = RPG_MAPS[rpgState.currentMap];
      if (mapDef && Array.isArray(mapDef.npcs)) {
        for (const npc of mapDef.npcs) {
          if (Math.hypot(clickX - npc.x, clickY - npc.y) <= npc.radius + 18) {
            rpgState.targetX = npc.x;
            rpgState.targetY = npc.y;
            if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 95) {
              interactWithRpgNpc(npc);
            }
            return;
          }
        }
      }

      for (const mon of rpgState.mapMonsters) {
        if (Math.hypot(clickX - mon.x, clickY - mon.y) <= 50) {
          rpgState.targetX = mon.x;
          rpgState.targetY = mon.y;
          if (Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y) <= 105) {
            startRpgCombatWithMonster(mon);
          }
          return;
        }
      }

      rpgState.targetX = Math.max(45, Math.min(canvas.width - 45, clickX));
      rpgState.targetY = Math.max(135, Math.min(canvas.height - 40, clickY));
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

  if (mapDef && Array.isArray(mapDef.npcs)) {
    for (const npc of mapDef.npcs) {
      if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 95) {
        interactWithRpgNpc(npc);
        return;
      }
    }
  }

  let nearestMon = null;
  let minDist = 115;
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
    addRpgFloatingText(rpgState.localX, rpgState.localY - 38, 'เดินเข้าใกล้มอนสเตอร์หรือ NPC ก่อนนะ!', '#38bdf8');
  }
}

function interactWithRpgNpc(npc) {
  if (!npc) return;
  if (npc.type === 'heal') {
    const stats = computeRpgHeroTotalStats(rpgState.hero);
    rpgState.hero.hp = stats.maxHp;
    saveData(`rpg_characters/${getRpgPlayerId()}`, rpgState.hero);
    updateRpgHudUI();
    addRpgFloatingText(rpgState.localX, rpgState.localY - 42, '💚 พักผิงไฟ ฟื้นฟู HP เต็ม 100%!', '#34d399');
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

function isBlockedByRpgChasm(mapDef, x, y) {
  if (!mapDef || !mapDef.chasmX) return false;
  const halfW = (mapDef.chasmWidth || 74) / 2 + 5;
  const inChasmX = x >= mapDef.chasmX - halfW && x <= mapDef.chasmX + halfW;
  if (!inChasmX) return false;

  const bridgeHalfH = (mapDef.bridgeH || 76) / 2 - 4;
  const onBridgeY = y >= (mapDef.bridgeY || 280) - bridgeHalfH && y <= (mapDef.bridgeY || 280) + bridgeHalfH;
  return !onBridgeY;
}

// 2D World Update & Render Loop
function startRpgGameLoop() {
  if (rpgState.animFrameId) cancelAnimationFrame(rpgState.animFrameId);

  function loop() {
    if (!rpgState.isActiveView) return;
    updateRpgWorldPhysics();
    renderRpgWorldCanvas();
    if (rpgState.inCombat) {
      renderRpgBattleSpritesCanvas();
    }
    rpgState.animFrameId = requestAnimationFrame(loop);
  }
  rpgState.animFrameId = requestAnimationFrame(loop);
}

function updateRpgWorldPhysics() {
  if (!rpgState.hero || rpgState.inCombat) return;
  const mapDef = RPG_MAPS[rpgState.currentMap] || RPG_MAPS.forest;

  let dx = rpgState.moveDirX;
  let dy = rpgState.moveDirY;

  if (rpgState.keysPressed['w'] || rpgState.keysPressed['arrowup']) dy = -1;
  if (rpgState.keysPressed['s'] || rpgState.keysPressed['arrowdown']) dy = 1;
  if (rpgState.keysPressed['a'] || rpgState.keysPressed['arrowleft']) dx = -1;
  if (rpgState.keysPressed['d'] || rpgState.keysPressed['arrowright']) dx = 1;

  const speed = 3.8;
  let moved = false;
  let nextX = rpgState.localX;
  let nextY = rpgState.localY;

  if (dx !== 0 || dy !== 0) {
    const len = Math.hypot(dx, dy) || 1;
    nextX += (dx / len) * speed;
    nextY += (dy / len) * speed;
    rpgState.targetX = nextX;
    rpgState.targetY = nextY;
    if (dx !== 0) {
      rpgState.facing = dx > 0 ? 1 : -1;
      rpgState.facingDir = dx > 0 ? 'right' : 'left';
    } else if (dy !== 0) {
      rpgState.facingDir = dy < 0 ? 'up' : 'down';
    }
    moved = true;
  } else {
    const dist = Math.hypot(rpgState.targetX - rpgState.localX, rpgState.targetY - rpgState.localY);
    if (dist > 4) {
      const step = Math.min(speed, dist);
      const vx = (rpgState.targetX - rpgState.localX) / dist;
      const vy = (rpgState.targetY - rpgState.localY) / dist;
      nextX += vx * step;
      nextY += vy * step;
      if (Math.abs(vx) > 0.25) {
        rpgState.facing = vx > 0 ? 1 : -1;
        rpgState.facingDir = vx > 0 ? 'right' : 'left';
      } else if (Math.abs(vy) > 0.25) {
        rpgState.facingDir = vy < 0 ? 'up' : 'down';
      }
      moved = true;
    }
  }

  if (moved) {
    if (!isBlockedByRpgChasm(mapDef, nextX, nextY)) {
      rpgState.localX = nextX;
      rpgState.localY = nextY;
    } else if (!isBlockedByRpgChasm(mapDef, rpgState.localX, nextY)) {
      rpgState.localY = nextY;
    } else if (!isBlockedByRpgChasm(mapDef, nextX, rpgState.localY)) {
      rpgState.localX = nextX;
    }
  }

  rpgState.localX = Math.max(45, Math.min(920, rpgState.localX));
  rpgState.localY = Math.max(135, Math.min(480, rpgState.localY));
  rpgState.isMoving = moved;

  if (moved) {
    rpgState.walkPhase += 0.28;
    syncPlayerOnlinePresence(false);
  } else {
    rpgState.walkPhase = 0;
  }

  const t = Date.now() * 0.002;
  rpgState.mapMonsters.forEach(mon => {
    const amp = mon.isBoss ? 8 : 20;
    mon.x = mon.baseX + Math.sin(t + mon.phase) * amp;
    mon.y = mon.baseY + Math.cos(t * 0.8 + mon.phase) * (amp * 0.65);
  });

  for (let i = rpgState.floatingTexts.length - 1; i >= 0; i--) {
    const ft = rpgState.floatingTexts[i];
    ft.y += ft.vy;
    ft.alpha -= 0.018;
    if (ft.alpha <= 0) {
      rpgState.floatingTexts.splice(i, 1);
    }
  }
}

/**
 * Renders the 4 Concept-Sheet Maps (Forest Map, Ice Cave Map, Dark Dungeon Map, Lava Volcano Map)
 */
function renderRpgConceptMapEnvironment(ctx, mapId, w, h, animTime) {
  const mapDef = RPG_MAPS[mapId] || RPG_MAPS.forest;
  const cx = mapDef.chasmX;
  const cw = mapDef.chasmWidth;
  const rx = cx - cw / 2;
  const by = mapDef.bridgeY - mapDef.bridgeH / 2;
  const bh = mapDef.bridgeH;

  if (mapId === 'forest') {
    // --- 1. FOREST MAP (Blue Sky, Distant Castle Silhouette, Rolling Hills, Tiered Grass Cliffs & River) ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 125);
    skyGrad.addColorStop(0, '#38bdf8');
    skyGrad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 125);

    // Distant Fairytale Castle Silhouette (Center-Left Horizon like Concept Sheet)
    ctx.fillStyle = '#60a5fa';
    ctx.fillRect(450, 52, 46, 55);
    ctx.fillRect(442, 40, 14, 67);
    ctx.fillRect(490, 42, 14, 65);
    ctx.fillRect(465, 28, 16, 79);
    // Castle spire roofs
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(440, 40); ctx.lineTo(449, 24); ctx.lineTo(458, 40);
    ctx.moveTo(463, 28); ctx.lineTo(473, 10); ctx.lineTo(483, 28);
    ctx.moveTo(488, 42); ctx.lineTo(497, 26); ctx.lineTo(506, 42);
    ctx.fill();

    // Rolling Green Hills on Horizon
    ctx.fillStyle = '#4ade80';
    ctx.beginPath();
    ctx.moveTo(0, 125);
    ctx.quadraticCurveTo(180, 65, 380, 115);
    ctx.quadraticCurveTo(560, 75, 760, 112);
    ctx.quadraticCurveTo(880, 80, w, 115);
    ctx.lineTo(w, 125);
    ctx.closePath();
    ctx.fill();

    // Lush Green Grass Ground & Tiered Dirt Ledges
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(0, 115, w, h - 115);

    // Dirt Cliff Ledge Band at top & middle
    ctx.fillStyle = '#78350f';
    ctx.fillRect(0, 115, w, 24);
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(0, 112, w, 8);

    // Dirt footpath
    ctx.fillStyle = '#b45309';
    ctx.fillRect(40, mapDef.bridgeY - 30, w - 80, 60);
    ctx.fillStyle = '#d97706';
    ctx.fillRect(40, mapDef.bridgeY - 26, w - 80, 52);

    // Forest River & Wooden Bridge
    ctx.fillStyle = '#a16207';
    ctx.fillRect(rx - 6, 115, cw + 12, h - 115);
    ctx.fillStyle = '#0284c7';
    ctx.fillRect(rx, 115, cw, h - 115);

    const waveOffset = (animTime * 45) % 44;
    ctx.fillStyle = '#7dd3fc';
    for (let wy = 120; wy < h; wy += 44) {
      ctx.fillRect(rx + 12, wy + waveOffset, 18, 4);
      ctx.fillRect(rx + cw - 28, wy + waveOffset + 18, 16, 4);
    }

    // Wooden Plank Bridge
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rx - 12, by, cw + 24, bh);
    ctx.strokeRect(rx - 12, by, cw + 24, bh);
    ctx.fillStyle = '#b45309';
    for (let px = rx - 8; px < rx + cw + 8; px += 12) {
      ctx.fillRect(px, by + 6, 9, bh - 12);
    }

  } else if (mapId === 'ice_cave') {
    // --- 2. ICE CAVE MAP (Dark Blue Cavern, Hanging Icicles, Snow Ground, Frozen Chasm & Stone Arch Bridge) ---
    ctx.fillStyle = '#082f49';
    ctx.fillRect(0, 0, w, 130);

    // Hanging Sharp Icicles / Stalactites from Cave Ceiling
    ctx.fillStyle = '#38bdf8';
    for (let ix = 0; ix < w; ix += 34) {
      const ih = 38 + ((ix * 17) % 45);
      ctx.beginPath();
      ctx.moveTo(ix, 0);
      ctx.lineTo(ix + 17, ih);
      ctx.lineTo(ix + 34, 0);
      ctx.closePath();
      ctx.fill();
    }

    // Snow-Covered Cavern Floor
    ctx.fillStyle = '#e0f2fe';
    ctx.fillRect(0, 125, w, h - 125);
    // Blue rock cliff wall at top & bottom
    ctx.fillStyle = '#1e3a8a';
    ctx.fillRect(0, 122, w, 18);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(0, 118, w, 9);

    // Icy Path
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(40, mapDef.bridgeY - 28, w - 80, 56);

    // Frozen River Chasm
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(rx - 6, 125, cw + 12, h - 125);
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(rx, 125, cw, h - 125);
    // Ice sheen lines
    ctx.strokeStyle = '#e0f2fe';
    ctx.lineWidth = 2;
    for (let iy = 140; iy < h; iy += 50) {
      ctx.beginPath();
      ctx.moveTo(rx + 10, iy);
      ctx.lineTo(rx + cw - 12, iy + 18);
      ctx.stroke();
    }

    // Snow-Covered Stone Arch Bridge
    ctx.fillStyle = '#475569';
    ctx.fillRect(rx - 12, by, cw + 24, bh);
    ctx.strokeRect(rx - 12, by, cw + 24, bh);
    ctx.fillStyle = '#f0f9ff';
    ctx.fillRect(rx - 12, by, cw + 24, 8);

  } else if (mapId === 'dark_dungeon') {
    // --- 3. DARK DUNGEON MAP (Purple-Grey Brick Walls, Stone Arches, Spiked Pit & Stone Bridge) ---
    ctx.fillStyle = '#1e1b2e';
    ctx.fillRect(0, 0, w, 130);

    // Stone Brick Wall Arches at top
    ctx.fillStyle = '#312c47';
    for (let ax = 20; ax < w; ax += 120) {
      ctx.fillRect(ax, 15, 95, 110);
      ctx.fillStyle = '#151221';
      ctx.beginPath();
      ctx.arc(ax + 47, 65, 32, Math.PI, Math.PI * 2);
      ctx.lineTo(ax + 79, 125);
      ctx.lineTo(ax + 15, 125);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#312c47';
    }

    // Dungeon Flagstone Floor
    const tileSize = 40;
    for (let gx = 0; gx < w; gx += tileSize) {
      for (let gy = 125; gy < h; gy += tileSize) {
        const isEven = ((gx / tileSize) + Math.floor(gy / tileSize)) % 2 === 0;
        ctx.fillStyle = isEven ? '#3b3354' : '#322b47';
        ctx.fillRect(gx, gy, tileSize, tileSize);
        ctx.strokeStyle = '#221d33';
        ctx.lineWidth = 1;
        ctx.strokeRect(gx, gy, tileSize, tileSize);
      }
    }

    // Spiked Dungeon Pit Chasm
    ctx.fillStyle = '#0f0c1a';
    ctx.fillRect(rx - 4, 125, cw + 8, h - 125);
    // Iron Floor Spikes inside pit
    ctx.fillStyle = '#94a3b8';
    for (let sy = 145; sy < h - 20; sy += 34) {
      for (let sx = rx + 8; sx < rx + cw - 10; sx += 16) {
        ctx.beginPath();
        ctx.moveTo(sx, sy + 14);
        ctx.lineTo(sx + 6, sy);
        ctx.lineTo(sx + 12, sy + 14);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Dungeon Stone Slab Bridge
    ctx.fillStyle = '#4c436b';
    ctx.fillRect(rx - 12, by, cw + 24, bh);
    ctx.strokeStyle = '#181020';
    ctx.lineWidth = 2;
    ctx.strokeRect(rx - 12, by, cw + 24, bh);

  } else if (mapId === 'lava_volcano') {
    // --- 4. LAVA VOLCANO MAP (Erupting Volcano Sky, Lava Waterfall, Bubbling Lava River & Rope Bridge) ---
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 130);
    skyGrad.addColorStop(0, '#3b1528');
    skyGrad.addColorStop(1, '#7c2d12');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, 130);

    // Erupting Volcano Mountain in Background (Right-Center like Concept Sheet!)
    ctx.fillStyle = '#451a1c';
    ctx.beginPath();
    ctx.moveTo(520, 130);
    ctx.lineTo(665, 22);
    ctx.lineTo(725, 22);
    ctx.lineTo(870, 130);
    ctx.closePath();
    ctx.fill();

    // Glowing Lava Streams Flowing Down the Volcano Crater
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(680, 24); ctx.quadraticCurveTo(670, 75, 640, 128);
    ctx.moveTo(695, 24); ctx.quadraticCurveTo(700, 80, 710, 128);
    ctx.moveTo(712, 24); ctx.quadraticCurveTo(735, 75, 765, 128);
    ctx.stroke();

    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dark Obsidian Volcanic Rock Ground
    ctx.fillStyle = '#2e1f27';
    ctx.fillRect(0, 125, w, h - 125);
    ctx.fillStyle = '#4a323e';
    ctx.fillRect(40, mapDef.bridgeY - 28, w - 80, 56);

    // Molten Lava Chasm & Cascading Lava Waterfall
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(rx - 8, 125, cw + 16, h - 125);

    const lavaGrad = ctx.createLinearGradient(rx, 0, rx + cw, 0);
    lavaGrad.addColorStop(0, '#dc2626');
    lavaGrad.addColorStop(0.5, '#f97316');
    lavaGrad.addColorStop(1, '#dc2626');
    ctx.fillStyle = lavaGrad;
    ctx.fillRect(rx, 125, cw, h - 125);

    // Animated Bright Yellow Lava Bubbles & Waterfall Streams
    const lavaFlow = (animTime * 55) % 46;
    ctx.fillStyle = '#fde047';
    for (let ly = 125; ly < h; ly += 46) {
      ctx.fillRect(rx + 14, ly + lavaFlow, 14, 18);
      ctx.fillRect(rx + cw - 28, ly + lavaFlow + 20, 14, 16);
    }

    // Wooden Rope Suspension Bridge over the Lava Chasm (just like Concept Sheet!)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(rx - 14, by + 6, cw + 28, bh - 12);
    ctx.fillStyle = '#b45309';
    for (let px = rx - 10; px < rx + cw + 10; px += 13) {
      ctx.fillRect(px, by + 4, 9, bh - 8);
      ctx.strokeStyle = '#181020';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(px, by + 4, 9, bh - 8);
    }
    // Bridge Wooden Posts & Rope Cables
    ctx.fillStyle = '#451a03';
    ctx.fillRect(rx - 14, by - 6, 8, 16);
    ctx.fillRect(rx + cw + 6, by - 6, 8, 16);
    ctx.fillRect(rx - 14, by + bh - 10, 8, 16);
    ctx.fillRect(rx + cw + 6, by + bh - 10, 8, 16);
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rx - 10, by - 2);
    ctx.quadraticCurveTo(cx, by + 8, rx + cw + 10, by - 2);
    ctx.moveTo(rx - 10, by + bh - 2);
    ctx.quadraticCurveTo(cx, by + bh + 6, rx + cw + 10, by + bh - 2);
    ctx.stroke();
  }
}

function renderRpgWorldCanvas() {
  const canvas = document.getElementById('rpg-world-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width;
  const h = canvas.height;
  const animTime = Date.now() * 0.001;

  const mapId = RPG_MAPS[rpgState.currentMap] ? rpgState.currentMap : 'forest';
  const mapDef = RPG_MAPS[mapId];

  // 1. Render Concept-Sheet 2D Map Environment (Sky, Background, Cliffs, River/Lava & Bridge)
  renderRpgConceptMapEnvironment(ctx, mapId, w, h, animTime);

  // 2. Collect All Y-Sorted Entities (2D Trees, Props, NPCs, Monsters/Boss, Online Classmates, Local Hero)
  const renderQueue = [];

  if (Array.isArray(mapDef.props)) {
    mapDef.props.forEach(p => {
      renderQueue.push({
        sortY: p.y,
        draw: () => draw2dMapProp(ctx, p, animTime)
      });
    });
  }

  if (Array.isArray(mapDef.npcs)) {
    mapDef.npcs.forEach(npc => {
      const dist = Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y);
      renderQueue.push({
        sortY: npc.y,
        draw: () => draw2dNpcObject(ctx, npc, dist <= 95, animTime)
      });
    });
  }

  rpgState.mapMonsters.forEach(mon => {
    const dist = Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y);
    const isNear = dist <= 105;
    renderQueue.push({
      sortY: mon.y,
      draw: () => {
        draw2dMonsterSprite(ctx, mon.x, mon.y, mon.spriteType || 'slime', animTime + mon.phase, mon.isBoss ? 1.45 : 1.1);
        ctx.save();
        ctx.font = "800 12px 'Sarabun', sans-serif";
        ctx.textAlign = 'center';
        const tagY = mon.y - (mon.isBoss ? 64 : 36);
        const tagW = ctx.measureText(mon.name).width + 14;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.86)';
        ctx.beginPath();
        ctx.roundRect(mon.x - tagW / 2, tagY - 10, tagW, 19, 6);
        ctx.fill();
        ctx.fillStyle = mon.isBoss ? '#fde047' : '#fca5a5';
        ctx.fillText(mon.name, mon.x, tagY + 3);
        if (isNear) {
          ctx.font = "800 11px 'Sarabun', sans-serif";
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('⚔️ แตะเพื่อต่อสู้!', mon.x, mon.y + (mon.isBoss ? 44 : 34));
        }
        ctx.restore();
      }
    });
  });

  // Online Classmates
  const myId = getRpgPlayerId();
  Object.values(rpgState.onlinePlayers || {}).forEach(p => {
    if (!p || p.id === myId || p.map !== mapId) return;
    if (p.updatedAt && Date.now() - p.updatedAt > 600000) return;
    const py = p.y || 280;
    renderQueue.push({
      sortY: py,
      draw: () => {
        draw2dHeroSprite(ctx, p.x || 230, py, p.job || 'warrior', p.facing || 1, animTime * 3, 1.05, p.facingDir || 'right');
        drawHeroNameAndChatTag(ctx, p.x || 230, py, p.name, p.level || 1, false, p.chat);
      }
    });
  });

  // Local Hero
  if (rpgState.hero) {
    renderQueue.push({
      sortY: rpgState.localY,
      draw: () => {
        draw2dHeroSprite(
          ctx,
          rpgState.localX,
          rpgState.localY,
          rpgState.hero.job || 'warrior',
          rpgState.facing,
          rpgState.walkPhase,
          1.12,
          rpgState.facingDir || 'right'
        );
        const activeChat = Date.now() < rpgState.chatBubbleExpire ? rpgState.chatBubbleText : '';
        drawHeroNameAndChatTag(ctx, rpgState.localX, rpgState.localY, rpgState.hero.name, rpgState.hero.level || 1, true, activeChat);
      }
    });
  }

  renderQueue.sort((a, b) => a.sortY - b.sortY);
  renderQueue.forEach(item => item.draw());

  // 3. Map Title Banner (Top-Left)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
  ctx.beginPath();
  ctx.roundRect(12, 10, 340, 28, 8);
  ctx.fill();
  ctx.font = "800 13px 'Sarabun', sans-serif";
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'left';
  ctx.fillText(mapDef.name, 22, 29);
  ctx.restore();

  // 4. Floating Texts
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

function drawHeroNameAndChatTag(ctx, x, y, name, level, isSelf, chatText) {
  ctx.save();
  const label = `[Lv.${level}] ${name || 'ผู้กล้า'}`;
  ctx.font = "800 12px 'Sarabun', sans-serif";
  ctx.textAlign = 'center';
  const textW = ctx.measureText(label).width + 12;
  ctx.fillStyle = isSelf ? 'rgba(15, 23, 42, 0.9)' : 'rgba(30, 41, 59, 0.82)';
  ctx.beginPath();
  ctx.roundRect(x - textW / 2, y - 56, textW, 18, 6);
  ctx.fill();

  ctx.fillStyle = isSelf ? '#fde047' : '#e2e8f0';
  ctx.fillText(label, x, y - 43);

  if (chatText) {
    ctx.font = "700 12px 'Sarabun', sans-serif";
    const chatW = ctx.measureText(chatText).width + 16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - chatW / 2, y - 80, chatW, 21, 10);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillText(chatText, x, y - 66);
  }
  ctx.restore();
}

/**
 * Renders animated 2D Hero and 2D Monster/Boss sprites inside the Turn-Based Battle Arena!
 */
function renderRpgBattleSpritesCanvas() {
  const heroCanvas = document.getElementById('rpg-battle-hero-canvas');
  const monCanvas = document.getElementById('rpg-battle-monster-canvas');
  const animTime = Date.now() * 0.001;

  if (heroCanvas && rpgState.hero) {
    const hCtx = heroCanvas.getContext('2d');
    hCtx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
    draw2dHeroSprite(hCtx, heroCanvas.width / 2, heroCanvas.height / 2 + 18, rpgState.hero.job || 'warrior', 1, animTime * 3, 1.5);
  }

  if (monCanvas && rpgState.activeMonster) {
    const mCtx = monCanvas.getContext('2d');
    mCtx.clearRect(0, 0, monCanvas.width, monCanvas.height);
    const mon = rpgState.activeMonster;
    draw2dMonsterSprite(mCtx, monCanvas.width / 2, monCanvas.height / 2 + 16, mon.spriteType || 'slime', animTime, mon.isBoss ? 1.05 : 1.45);
  }
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
  renderRpgBattleSpritesCanvas();
}

function updateRpgCombatArenaUI(bannerMsg) {
  if (!rpgState.hero || !rpgState.activeMonster) return;
  const stats = computeRpgHeroTotalStats(rpgState.hero);
  const mon = rpgState.activeMonster;

  document.getElementById('rpg-battle-hero-name').innerText = `${rpgState.hero.name} (Lv.${rpgState.hero.level})`;
  const heroHpPct = Math.max(0, Math.min(100, Math.round((rpgState.hero.hp / stats.maxHp) * 100)));
  document.getElementById('rpg-battle-hero-hp-bar').style.width = `${heroHpPct}%`;
  document.getElementById('rpg-battle-hero-hp-text').innerText = `${Math.max(0, Math.round(rpgState.hero.hp))}/${stats.maxHp}`;

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

  const job = normalizeRpgJobId(rpgState.hero?.job);
  rpgState.quizRemainingSec = job === 'archer' ? 25 : 20;
  updateRpgQuizTimerBadge();

  clearRpgQuizTimer();
  rpgState.quizTimerInterval = setInterval(() => {
    rpgState.quizRemainingSec--;
    updateRpgQuizTimerBadge();
    if (rpgState.quizRemainingSec <= 0) {
      clearRpgQuizTimer();
      submitRpgBattleAnswer(-1);
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
  const job = normalizeRpgJobId(rpgState.hero.job);

  const cmdBox = document.getElementById('rpg-battle-commands');
  const quizBox = document.getElementById('rpg-battle-quiz-box');
  if (cmdBox) cmdBox.style.display = 'grid';
  if (quizBox) quizBox.style.display = 'none';

  if (isCorrect) {
    rpgState.combatCombo++;
    const isSkill = rpgState.pendingSkillMode === 'skill';
    let dmgMultiplier = isSkill ? 1.6 : 1.0;

    if (job === 'mage') {
      dmgMultiplier += rpgState.combatCombo * 0.15;
    }

    const isCrit = Math.random() * 100 < stats.crit;
    if (isCrit) dmgMultiplier *= 1.75;

    const rawDmg = Math.max(8, Math.round(stats.atk * dmgMultiplier - (mon.def || 0) * 0.4));
    rpgState.monsterHp = Math.max(0, rpgState.monsterHp - rawDmg);

    let healMsg = '';
    if (job === 'priest') {
      const healAmt = Math.round(stats.maxHp * 0.2);
      rpgState.hero.hp = Math.min(stats.maxHp, rpgState.hero.hp + healAmt);
      healMsg = ` (+พรศักดิ์สิทธิ์ฟื้นฟู ${healAmt} HP)`;
    }

    updateRpgCombatArenaUI(
      `✅ ตอบถูก! ${isSkill ? stats.cls.skillName : 'โจมตี'} ทำดาเมจ ${rawDmg} หน่วย${isCrit ? ' (💥 CRITICAL!)' : ''}${healMsg}`
    );

    if (rpgState.monsterHp <= 0) {
      handleRpgMonsterVictory(mon);
      return;
    }
  } else {
    rpgState.combatCombo = 0;
    const correctChoiceText = q.options[q.correctIndex] || '';
    let enemyDmg = Math.max(6, Math.round(mon.atk - stats.def * 0.55));
    if (job === 'warrior' && rpgState.pendingSkillMode === 'skill') {
      enemyDmg = Math.round(enemyDmg * 0.6);
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
    switchRpgMap('forest');
    updateRpgHudUI();
    showPopupWarning("หมดสติในการต่อสู้!", "คุณถูกส่งกลับมาพักฟื้นที่กองไฟแคมป์ใน Forest Map ลองอัปเกรดอาวุธหรือชุดเกราะแล้วไปท้าสู้อีกครั้งนะ!");
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

// Weapon/Armor Shop & Stat Points Allocation Modal
function openRpgShopModal() {
  if (!rpgState.hero) return;
  const hero = rpgState.hero;

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
    const cls = RPG_CLASSES[normalizeRpgJobId(ch.job)] || RPG_CLASSES.warrior;
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
