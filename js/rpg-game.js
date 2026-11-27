/**
 * Krunoi Classroom 2D Educational MMORPG Engine (Classic 16-bit 2D RPG Edition)
 * Features:
 * - Authentic 2D Character Sprites (Warrior, Mage, Ranger, Paladin) with walk & weapon animations
 * - Authentic 2D Monster & Boss Sprites (Slime, Goblin, Wolf, Scorpion, Golem, Bat, Dark Knight, Boss Dragon)
 * - Classic 2D Tilemap World with Animated Flowing Rivers, Wooden Bridges, Lush 2D Forests/Trees, Village Houses & Y-Sorted Depth
 * - Ultra-Lightweight Firebase Realtime Multiplayer + Quiz-Driven Turn-Based Combat
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
    name: '🏰 เมืองเริ่มต้น (Starter Town)',
    theme: 'grass',
    tileA: '#3b7a3e',
    tileB: '#346e37',
    pathColor: '#d6b887',
    pathBorder: '#b08f5a',
    riverX: 640,
    riverWidth: 74,
    riverType: 'water',
    bridgeY: 260,
    bridgeH: 74,
    isSafe: true,
    props: [
      { type: 'house_red', x: 160, y: 125 },
      { type: 'house_blue', x: 420, y: 115 },
      { type: 'tree_oak', x: 75, y: 110 },
      { type: 'tree_oak', x: 285, y: 105 },
      { type: 'tree_pine', x: 540, y: 100 },
      { type: 'tree_oak', x: 760, y: 110 },
      { type: 'tree_pine', x: 890, y: 125 },
      { type: 'tree_oak', x: 95, y: 430 },
      { type: 'tree_pine', x: 250, y: 455 },
      { type: 'tree_oak', x: 490, y: 445 },
      { type: 'tree_pine', x: 775, y: 450 },
      { type: 'bush', x: 330, y: 205 },
      { type: 'bush', x: 545, y: 375 },
      { type: 'rock', x: 745, y: 360 }
    ],
    npcs: [
      { id: 'fountain', name: 'น้ำพุแห่งปัญญา (ฟื้น HP 100%)', npcSprite: 'fountain', x: 350, y: 265, radius: 42, type: 'heal' },
      { id: 'blacksmith', name: 'ช่างตีเหล็ก (ร้านค้าอาวุธ/เกราะ)', npcSprite: 'blacksmith', x: 195, y: 200, radius: 36, type: 'shop' },
      { id: 'monument', name: 'ศิลาจารึกอันดับผู้กล้า', npcSprite: 'monument', x: 465, y: 195, radius: 36, type: 'rank' },
      { id: 'portal_forest', name: 'วาร์ปไป: ป่าผังงาน (Lv.1-10)', npcSprite: 'portal', x: 875, y: 265, radius: 38, type: 'portal', targetMap: 'forest' }
    ],
    monsterTemplates: []
  },
  forest: {
    id: 'forest',
    name: '🌲 ป่าผังงานและอัลกอริทึม (Lv.1-10)',
    theme: 'forest',
    tileA: '#295f35',
    tileB: '#23532e',
    pathColor: '#a6895b',
    pathBorder: '#82683f',
    riverX: 485,
    riverWidth: 72,
    riverType: 'water',
    bridgeY: 260,
    bridgeH: 74,
    isSafe: false,
    props: [
      { type: 'tree_pine', x: 70, y: 95 },
      { type: 'tree_oak', x: 185, y: 85 },
      { type: 'tree_pine', x: 310, y: 105 },
      { type: 'tree_oak', x: 405, y: 85 },
      { type: 'tree_pine', x: 605, y: 95 },
      { type: 'tree_oak', x: 735, y: 90 },
      { type: 'tree_pine', x: 875, y: 105 },
      { type: 'tree_oak', x: 145, y: 440 },
      { type: 'tree_pine', x: 280, y: 455 },
      { type: 'tree_oak', x: 395, y: 430 },
      { type: 'tree_pine', x: 610, y: 445 },
      { type: 'tree_oak', x: 750, y: 455 },
      { type: 'tree_pine', x: 890, y: 430 },
      { type: 'tree_oak', x: 640, y: 220 },
      { type: 'bush', x: 245, y: 310 },
      { type: 'bush', x: 710, y: 310 },
      { type: 'rock', x: 380, y: 195 },
      { type: 'rock', x: 830, y: 195 }
    ],
    npcs: [
      { id: 'portal_town', name: 'กลับเมืองเริ่มต้น', npcSprite: 'portal', x: 75, y: 265, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_slime', name: 'สไลม์ไร้ระเบียบ (Lv.1)', spriteType: 'slime', level: 1, hp: 55, atk: 14, def: 3, exp: 40, gold: 28, x: 240, y: 185 },
      { id: 'm_slime2', name: 'สไลม์บั๊กเขียว (Lv.3)', spriteType: 'bug_slime', level: 3, hp: 75, atk: 17, def: 4, exp: 55, gold: 36, x: 345, y: 355 },
      { id: 'm_goblin', name: 'ก็อบลินลูปไม่รู้จบ (Lv.5)', spriteType: 'goblin', level: 5, hp: 115, atk: 23, def: 7, exp: 85, gold: 55, x: 685, y: 175 },
      { id: 'm_wolf', name: 'หมาป่าตรรกะวิบัติ (Lv.8)', spriteType: 'wolf', level: 8, hp: 165, atk: 30, def: 10, exp: 125, gold: 80, x: 825, y: 345 }
    ]
  },
  desert: {
    id: 'desert',
    name: '🏜️ หุบเขาตัวแปรและเงื่อนไข (Lv.10-25)',
    theme: 'desert',
    tileA: '#c29b57',
    tileB: '#b58e4a',
    pathColor: '#9c783c',
    pathBorder: '#7d5d28',
    riverX: 520,
    riverWidth: 66,
    riverType: 'water',
    bridgeY: 260,
    bridgeH: 74,
    isSafe: false,
    props: [
      { type: 'palm', x: 440, y: 135 },
      { type: 'palm', x: 605, y: 145 },
      { type: 'palm', x: 445, y: 425 },
      { type: 'palm', x: 600, y: 415 },
      { type: 'cactus', x: 170, y: 115 },
      { type: 'cactus', x: 310, y: 430 },
      { type: 'cactus', x: 760, y: 120 },
      { type: 'cactus', x: 870, y: 420 },
      { type: 'rock', x: 250, y: 140 },
      { type: 'rock', x: 700, y: 430 },
      { type: 'rock', x: 850, y: 170 }
    ],
    npcs: [
      { id: 'portal_town', name: 'กลับเมืองเริ่มต้น', npcSprite: 'portal', x: 75, y: 265, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_scorpion', name: 'แมงป่องตัวแปรลอย (Lv.12)', spriteType: 'scorpion', level: 12, hp: 230, atk: 38, def: 14, exp: 165, gold: 110, x: 290, y: 205 },
      { id: 'm_golem', name: 'โกเลมชนิดข้อมูล (Lv.17)', spriteType: 'golem', level: 17, hp: 340, atk: 48, def: 20, exp: 230, gold: 155, x: 380, y: 360 },
      { id: 'm_bat', name: 'ค้างคาวเงื่อนไขซ้อน (Lv.22)', spriteType: 'bat', level: 22, hp: 450, atk: 58, def: 24, exp: 310, gold: 210, x: 760, y: 260 }
    ]
  },
  castle: {
    id: 'castle',
    name: '🌋 ปราสาทจอมมารบั๊ก (Boss Dungeon Lv.25+)',
    theme: 'castle',
    tileA: '#2b2538',
    tileB: '#231e2e',
    pathColor: '#433b54',
    pathBorder: '#1a1524',
    riverX: 480,
    riverWidth: 78,
    riverType: 'lava',
    bridgeY: 260,
    bridgeH: 78,
    isSafe: false,
    props: [
      { type: 'torch', x: 180, y: 195 },
      { type: 'torch', x: 180, y: 340 },
      { type: 'torch', x: 415, y: 195 },
      { type: 'torch', x: 415, y: 340 },
      { type: 'torch', x: 590, y: 195 },
      { type: 'torch', x: 590, y: 340 },
      { type: 'dead_tree', x: 120, y: 105 },
      { type: 'dead_tree', x: 330, y: 100 },
      { type: 'dead_tree', x: 250, y: 440 },
      { type: 'rock', x: 670, y: 115 },
      { type: 'rock', x: 670, y: 430 },
      { type: 'rock', x: 880, y: 130 },
      { type: 'rock', x: 880, y: 415 }
    ],
    npcs: [
      { id: 'portal_town', name: 'กลับเมืองเริ่มต้น', npcSprite: 'portal', x: 75, y: 265, radius: 34, type: 'portal', targetMap: 'town' }
    ],
    monsterTemplates: [
      { id: 'm_knight', name: 'อัศวินไวรัสโทรจัน (Lv.26)', spriteType: 'knight', level: 26, hp: 580, atk: 70, def: 30, exp: 420, gold: 300, x: 310, y: 265 },
      { id: 'm_dragon', name: '👑 บอสใหญ่: มังกรซินแทกซ์เออร์เรอร์ (Lv.35)', spriteType: 'dragon', level: 35, hp: 1000, atk: 92, def: 40, exp: 850, gold: 650, x: 765, y: 265, isBoss: true }
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
  localX: 280,
  localY: 265,
  targetX: 280,
  targetY: 265,
  facing: 1,
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
   CLASSIC 2D RETRO RPG CHARACTER, MONSTER & PROP SPRITE RENDERER
============================================================= */

/**
 * Draws a full 2D RPG Hero Character with animated legs, armor, cape, head, eyes, shield, and weapon!
 */
function draw2dHeroSprite(ctx, x, y, job = 'warrior', facing = 1, walkPhase = 0, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const legSwing = Math.sin(walkPhase) * 6;
  const bobY = Math.abs(Math.sin(walkPhase)) * -2.5;

  // Ground shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.save();
  ctx.translate(0, bobY);
  if (facing < 0) {
    ctx.scale(-1, 1);
  }

  // 1. Back Cape
  const capeColors = {
    warrior: '#b91c1c',
    mage: '#4c1d95',
    ranger: '#14532d',
    paladin: '#1d4ed8'
  };
  ctx.fillStyle = capeColors[job] || '#b91c1c';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-7, -6);
  ctx.quadraticCurveTo(-18, 6 + legSwing * 0.3, -15, 16);
  ctx.lineTo(-4, 14);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Animated Legs / Boots
  ctx.fillStyle = '#334155';
  // Left leg
  ctx.beginPath();
  ctx.roundRect(-7 + legSwing * 0.6, 8, 6, 13, 3);
  ctx.fill();
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.roundRect(1 - legSwing * 0.6, 8, 6, 13, 3);
  ctx.fill();
  ctx.stroke();

  // 3. Torso / Armor / Robe
  const armorColors = {
    warrior: '#94a3b8',
    mage: '#7c3aed',
    ranger: '#16a34a',
    paladin: '#f8fafc'
  };
  const trimColors = {
    warrior: '#ef4444',
    mage: '#fde047',
    ranger: '#854d0e',
    paladin: '#f59e0b'
  };

  ctx.fillStyle = armorColors[job] || '#94a3b8';
  ctx.beginPath();
  ctx.roundRect(-10, -8, 20, 19, 5);
  ctx.fill();
  ctx.stroke();

  // Armor Chest Trim / Belt
  ctx.fillStyle = trimColors[job] || '#ef4444';
  ctx.fillRect(-10, 4, 20, 4);
  if (job === 'paladin') {
    // Holy gold cross on chest
    ctx.fillRect(-2, -5, 4, 12);
    ctx.fillRect(-6, -1, 12, 3);
  } else if (job === 'mage') {
    // Gold robe trim
    ctx.fillRect(-2, -7, 4, 17);
  }

  // 4. Head & Face
  ctx.fillStyle = '#fde68a'; // Warm skin tone
  ctx.beginPath();
  ctx.arc(0, -17, 10.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Expressive 2D RPG Eyes (looking forward)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.ellipse(3, -17, 1.7, 2.5, 0, 0, Math.PI * 2);
  ctx.ellipse(8, -17, 1.7, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3.2, -18.5, 1.2, 1.2);
  ctx.fillRect(8.2, -18.5, 1.2, 1.2);

  // 5. Class Headgear / Hair
  if (job === 'warrior') {
    // Silver Knight Helmet + Red Crest Plume
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-4, -27);
    ctx.quadraticCurveTo(-14, -36, -18, -23);
    ctx.quadraticCurveTo(-10, -22, -2, -26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(0, -19, 11, Math.PI * 0.95, Math.PI * 2.05);
    ctx.fill();
    ctx.stroke();
    // Helmet visor trim
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-10, -22, 20, 3);
  } else if (job === 'mage') {
    // Pointed Purple Wizard Hat with Gold Band
    ctx.fillStyle = '#5b21b6';
    ctx.beginPath();
    ctx.moveTo(-13, -23);
    ctx.lineTo(0, -43);
    ctx.lineTo(13, -23);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, -23, 15, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.fillRect(-9, -26, 18, 3);
  } else if (job === 'ranger') {
    // Forest Green Hood + Feather
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(-1, -19, 11.5, Math.PI * 0.75, Math.PI * 2.1);
    ctx.lineTo(-12, -14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Red/Yellow Feather on hood
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(-4, -28);
    ctx.quadraticCurveTo(-12, -37, -15, -33);
    ctx.quadraticCurveTo(-10, -26, -4, -27);
    ctx.fill();
  } else if (job === 'paladin') {
    // Golden Hair + Royal Paladin Crown/Circlet
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(-1, -19, 11, Math.PI * 0.85, Math.PI * 2.1);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.moveTo(-9, -24);
    ctx.lineTo(-5, -31);
    ctx.lineTo(0, -26);
    ctx.lineTo(5, -32);
    ctx.lineTo(9, -24);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 6. Main Weapon & Off-Hand Shield
  const armSwing = -legSwing * 0.4;
  ctx.save();
  ctx.translate(8, -1 + armSwing);

  if (job === 'warrior') {
    // Broadsword
    ctx.fillStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(4, -2);
    ctx.lineTo(18, -18);
    ctx.lineTo(21, -15);
    ctx.lineTo(7, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // Gold hilt
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(1, -4, 7, 3);
  } else if (job === 'mage') {
    // Magic Crystal Staff
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(4, 12);
    ctx.lineTo(12, -18);
    ctx.stroke();

    // Glowing Orb
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(12, -21, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  } else if (job === 'ranger') {
    // Recurve Wooden Bow
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(4, -2, 13, -Math.PI * 0.45, Math.PI * 0.45);
    ctx.stroke();
    // Bowstring
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(6, -14);
    ctx.lineTo(6, 10);
    ctx.stroke();
  } else if (job === 'paladin') {
    // Holy Golden Sword + Shield
    ctx.fillStyle = '#fef08a';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(5, -2);
    ctx.lineTo(19, -20);
    ctx.lineTo(22, -17);
    ctx.lineTo(8, 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Holy Shield on front-left
    ctx.fillStyle = '#2563eb';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-19, -6, 11, 15, 4);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
  ctx.restore();
  ctx.restore();
}

/**
 * Draws authentic 2D Retro RPG Monsters & Bosses on the map or battle canvas!
 */
function draw2dMonsterSprite(ctx, x, y, spriteType = 'slime', animTime = 0, scale = 1.0) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const bounce = Math.sin(animTime * 4) * 3;
  const squishX = 1 + Math.sin(animTime * 4) * 0.06;
  const squishY = 1 - Math.sin(animTime * 4) * 0.06;

  // Ground Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.38)';
  ctx.beginPath();
  ctx.ellipse(0, 20, spriteType === 'dragon' ? 28 : 16, spriteType === 'dragon' ? 9 : 6, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;

  if (spriteType === 'slime' || spriteType === 'bug_slime') {
    ctx.save();
    ctx.translate(0, bounce);
    ctx.scale(squishX, squishY);

    ctx.fillStyle = spriteType === 'bug_slime' ? '#84cc16' : '#10b981';
    ctx.beginPath();
    ctx.moveTo(-16, 14);
    ctx.quadraticCurveTo(-18, -10, 0, -14);
    ctx.quadraticCurveTo(18, -10, 16, 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Jelly highlight
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.beginPath();
    ctx.ellipse(-6, -5, 4, 2.5, -0.4, 0, Math.PI * 2);
    ctx.fill();

    // Cute/Fierce Eyes
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(-5, 2, 2.4, 0, Math.PI * 2);
    ctx.arc(5, 2, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-5.8, 0.5, 1.2, 1.2);
    ctx.fillRect(4.2, 0.5, 1.2, 1.2);
    ctx.restore();

  } else if (spriteType === 'goblin') {
    ctx.save();
    ctx.translate(0, bounce * 0.6);

    // Legs & Leather Tunic
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-7, 6, 5, 12);
    ctx.fillRect(2, 6, 5, 12);
    ctx.beginPath();
    ctx.roundRect(-9, -6, 18, 15, 4);
    ctx.fill();
    ctx.stroke();

    // Pointy Goblin Ears & Green Head
    ctx.fillStyle = '#65a30d';
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.lineTo(-21, -18);
    ctx.lineTo(-10, -9);
    ctx.moveTo(10, -14);
    ctx.lineTo(21, -18);
    ctx.lineTo(10, -9);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -13, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Red Eyes
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-4, -13, 2, 0, Math.PI * 2);
    ctx.arc(4, -13, 2, 0, Math.PI * 2);
    ctx.fill();

    // Wooden Club
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(10, -16, 6, 20, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

  } else if (spriteType === 'wolf') {
    ctx.save();
    ctx.translate(0, bounce * 0.5);

    // Wolf Body & Legs
    ctx.fillStyle = '#475569';
    ctx.fillRect(-13, 6, 4, 12);
    ctx.fillRect(-5, 6, 4, 12);
    ctx.fillRect(5, 6, 4, 12);
    ctx.fillRect(12, 6, 4, 12);

    // Bushy Tail
    ctx.beginPath();
    ctx.moveTo(13, 0);
    ctx.quadraticCurveTo(24, -6, 22, 6);
    ctx.quadraticCurveTo(16, 8, 13, 3);
    ctx.fill();
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.ellipse(2, 1, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Wolf Head, Ears & Snout
    ctx.beginPath();
    ctx.arc(-11, -7, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-16, -13);
    ctx.lineTo(-14, -22);
    ctx.lineTo(-10, -14);
    ctx.moveTo(-9, -13);
    ctx.lineTo(-6, -22);
    ctx.lineTo(-4, -13);
    ctx.fill();
    ctx.stroke();

    // Glowing Eye
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.arc(-13, -8, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (spriteType === 'scorpion') {
    ctx.save();
    ctx.translate(0, bounce * 0.4);
    ctx.fillStyle = '#b45309';

    // Curved Scorpion Tail & Stinger
    ctx.beginPath();
    ctx.moveTo(8, 2);
    ctx.quadraticCurveTo(24, -12, 10, -22);
    ctx.quadraticCurveTo(4, -24, 2, -18);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#92400e';
    ctx.stroke();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(1, -18, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Segmented Body
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(0, 4, 15, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Claws
    ctx.beginPath();
    ctx.arc(-16, 0, 6, 0.3, Math.PI * 1.7);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

  } else if (spriteType === 'golem') {
    ctx.save();
    ctx.translate(0, bounce * 0.3);

    // Massive Stone Body
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.roundRect(-16, -14, 32, 26, 6);
    ctx.fill();
    ctx.stroke();

    // Stone Head
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.roundRect(-10, -25, 20, 13, 4);
    ctx.fill();
    ctx.stroke();

    // Glowing Rune Cracks & Eyes
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-6, -4);
    ctx.lineTo(0, 2);
    ctx.lineTo(7, -5);
    ctx.moveTo(0, 2);
    ctx.lineTo(0, 9);
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-6, -20, 4, 3);
    ctx.fillRect(2, -20, 4, 3);
    ctx.restore();

  } else if (spriteType === 'bat') {
    const wingFlap = Math.sin(animTime * 9) * 10;
    ctx.save();
    ctx.translate(0, bounce * 1.4 - 4);

    // Bat Wings
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

    // Bat Body
    ctx.fillStyle = '#4c1d95';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Yellow Eyes & Fangs
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-3.5, -2, 1.8, 0, Math.PI * 2);
    ctx.arc(3.5, -2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

  } else if (spriteType === 'knight') {
    ctx.save();
    ctx.translate(0, bounce * 0.4);

    // Dark Dread Armor & Cape
    ctx.fillStyle = '#7f1d1d';
    ctx.beginPath();
    ctx.roundRect(-14, -8, 28, 24, 4);
    ctx.fill();

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-12, -10, 24, 22, 5);
    ctx.fill();
    ctx.stroke();

    // Horned Dark Helmet
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, -19, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Horns
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.moveTo(-9, -22);
    ctx.lineTo(-18, -32);
    ctx.lineTo(-5, -27);
    ctx.moveTo(9, -22);
    ctx.lineTo(18, -32);
    ctx.lineTo(5, -27);
    ctx.fill();
    ctx.stroke();

    // Glowing Red Visor
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(-6, -20, 12, 3);
    ctx.restore();

  } else if (spriteType === 'dragon') {
    // BOSS: Giant 2D Red/Gold Fire Dragon
    const wingY = Math.sin(animTime * 5) * 9;
    ctx.save();
    ctx.translate(0, bounce * 0.6);

    // Boss Flame Aura under feet
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 18, 30, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Dragon Wings
    ctx.fillStyle = '#991b1b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-10, -8);
    ctx.quadraticCurveTo(-36, -34 + wingY, -42, -4 + wingY);
    ctx.quadraticCurveTo(-26, 2, -12, 6);
    ctx.moveTo(10, -8);
    ctx.quadraticCurveTo(36, -34 + wingY, 42, -4 + wingY);
    ctx.quadraticCurveTo(26, 2, 12, 6);
    ctx.fill();
    ctx.stroke();

    // Dragon Body & Golden Belly
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.ellipse(0, 2, 18, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, 4, 10, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dragon Head & Horns
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -18, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.moveTo(-8, -26);
    ctx.lineTo(-17, -38);
    ctx.lineTo(-3, -29);
    ctx.moveTo(8, -26);
    ctx.lineTo(17, -38);
    ctx.lineTo(3, -29);
    ctx.fill();
    ctx.stroke();

    // Glowing Dragon Eyes
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-5, -19, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -19, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();
}

/**
 * Draws 2D Retro RPG Map Environment Scenery Props (Trees, Houses, Rocks, Bushes, Torches, NPCs)
 */
function draw2dMapProp(ctx, prop, animTime = 0) {
  const { type, x, y } = prop;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;

  if (type === 'tree_oak') {
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 24, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.roundRect(-7, -14, 14, 28, 3);
    ctx.fill();
    ctx.stroke();

    // Lush 3-Cluster 2D Foliage Canopy
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(-14, -22, 18, 0, Math.PI * 2);
    ctx.arc(14, -22, 18, 0, Math.PI * 2);
    ctx.arc(0, -34, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Highlight leaves
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-8, -26, 11, 0, Math.PI * 2);
    ctx.arc(8, -25, 10, 0, Math.PI * 2);
    ctx.arc(0, -37, 14, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'tree_pine') {
    ctx.fillStyle = 'rgba(0,0,0,0.32)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#713f12';
    ctx.fillRect(-5, -4, 10, 18);
    ctx.strokeRect(-5, -4, 10, 18);

    // 3 Layered Pine Triangles
    const tiers = [
      { yBase: -2, width: 44, height: 24, color: '#14532d' },
      { yBase: -16, width: 36, height: 22, color: '#166534' },
      { yBase: -29, width: 26, height: 20, color: '#15803d' }
    ];
    tiers.forEach(t => {
      ctx.fillStyle = t.color;
      ctx.beginPath();
      ctx.moveTo(-t.width / 2, t.yBase);
      ctx.lineTo(0, t.yBase - t.height);
      ctx.lineTo(t.width / 2, t.yBase);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

  } else if (type === 'house_red' || type === 'house_blue') {
    // Classic 2D RPG Village House
    ctx.fillStyle = 'rgba(0,0,0,0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 22, 48, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // House Walls
    ctx.fillStyle = '#fef3c7';
    ctx.fillRect(-38, -22, 76, 42);
    ctx.strokeRect(-38, -22, 76, 42);

    // Timber beams
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-38, -22, 5, 42);
    ctx.fillRect(33, -22, 5, 42);
    ctx.fillRect(-38, -4, 76, 4);

    // Wooden Door
    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.roundRect(-9, 1, 18, 19, [6, 6, 0, 0]);
    ctx.fill();
    ctx.stroke();

    // Glowing Windows
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-27, 2, 11, 11);
    ctx.strokeRect(-27, 2, 11, 11);
    ctx.fillRect(16, 2, 11, 11);
    ctx.strokeRect(16, 2, 11, 11);

    // Pitched Roof
    ctx.fillStyle = type === 'house_red' ? '#dc2626' : '#2563eb';
    ctx.beginPath();
    ctx.moveTo(-46, -20);
    ctx.lineTo(0, -54);
    ctx.lineTo(46, -20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (type === 'palm') {
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(0, 12, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Curved Palm Trunk
    ctx.strokeStyle = '#92400e';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.quadraticCurveTo(8, -10, 2, -32);
    ctx.stroke();

    // Palm Fronds
    ctx.fillStyle = '#16a34a';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.4;
    [-22, -10, 10, 22].forEach(dx => {
      ctx.beginPath();
      ctx.moveTo(2, -32);
      ctx.quadraticCurveTo(dx, -44, dx * 1.3, -24);
      ctx.quadraticCurveTo(dx * 0.6, -32, 2, -32);
      ctx.fill();
      ctx.stroke();
    });

  } else if (type === 'cactus') {
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.roundRect(-5, -24, 10, 34, 5);
    ctx.roundRect(-15, -16, 10, 6, 3);
    ctx.roundRect(-15, -24, 6, 12, 3);
    ctx.roundRect(5, -12, 10, 6, 3);
    ctx.roundRect(9, -20, 6, 12, 3);
    ctx.fill();
    ctx.stroke();

  } else if (type === 'dead_tree') {
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, 12);
    ctx.lineTo(0, -24);
    ctx.moveTo(0, -10);
    ctx.lineTo(-14, -22);
    ctx.moveTo(0, -14);
    ctx.lineTo(14, -26);
    ctx.stroke();

  } else if (type === 'bush') {
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(-8, 2, 10, 0, Math.PI * 2);
    ctx.arc(8, 2, 10, 0, Math.PI * 2);
    ctx.arc(0, -4, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Red berries
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-5, 0, 2, 0, Math.PI * 2);
    ctx.arc(4, -3, 2, 0, Math.PI * 2);
    ctx.arc(2, 4, 2, 0, Math.PI * 2);
    ctx.fill();

  } else if (type === 'rock') {
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-14, 8);
    ctx.lineTo(-10, -6);
    ctx.lineTo(2, -10);
    ctx.lineTo(14, -3);
    ctx.lineTo(16, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

  } else if (type === 'torch') {
    ctx.fillStyle = '#475569';
    ctx.fillRect(-4, -14, 8, 24);
    ctx.strokeRect(-4, -14, 8, 24);
    const flicker = Math.sin(animTime * 12) * 2;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, -18, 6 + flicker * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(0, -18, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

/**
 * Draws 2D Interactive Map NPCs (Healing Fountain, Blacksmith, Leaderboard Monument, Teleport Portal)
 */
function draw2dNpcObject(ctx, npc, isNear, animTime) {
  ctx.save();
  ctx.translate(npc.x, npc.y);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.8;

  if (npc.npcSprite === 'fountain') {
    // 2D Stone Water Fountain with Animated Water Jets
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(0, 6, 30, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.ellipse(0, 5, 24, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Center stone pillar
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-5, -14, 10, 18);
    ctx.strokeRect(-5, -14, 10, 18);

    // Animated water splash arcs
    const splash = Math.sin(animTime * 8) * 3;
    ctx.strokeStyle = '#bae6fd';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.quadraticCurveTo(-14, -26 + splash, -16, 2);
    ctx.moveTo(0, -14);
    ctx.quadraticCurveTo(14, -26 - splash, 16, 2);
    ctx.stroke();

  } else if (npc.npcSprite === 'blacksmith') {
    // 2D Blacksmith Character + Anvil
    draw2dHeroSprite(ctx, -8, -4, 'warrior', 1, 0, 0.85);
    // Anvil
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(8, 2, 18, 12, 3);
    ctx.fill();
    ctx.stroke();

  } else if (npc.npcSprite === 'monument') {
    // 2D Golden Trophy Monument Pedestal
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-14, 0, 28, 14);
    ctx.strokeRect(-14, 0, 28, 14);
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(0, -10, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fef08a';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', 0, -10);

  } else if (npc.npcSprite === 'portal') {
    // Swirling 2D Magic Portal Gate
    ctx.save();
    ctx.rotate(animTime * 2);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 1.6);
    ctx.stroke();
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(0, 0, 15, Math.PI * 0.4, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  // Label above NPC
  ctx.font = "800 12px 'Sarabun', sans-serif";
  const textW = ctx.measureText(npc.name).width + 12;
  ctx.fillStyle = isNear ? 'rgba(37, 99, 235, 0.92)' : 'rgba(15, 23, 42, 0.8)';
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
  ['warrior', 'mage', 'ranger', 'paladin'].forEach(jobId => {
    const c = document.getElementById(`rpg-preview-${jobId}`);
    if (!c) return;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    draw2dHeroSprite(ctx, c.width / 2, c.height / 2 + 12, jobId, 1, 0, 1.35);
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
      `เข้าสู่โลกผจญภัย 2D เรียบร้อย ใช้ปุ่มลูกศร หรือแตะบนแผนที่เพื่อเดินข้ามสะพานแม่น้ำและโจมตีมอนสเตอร์ได้เลย!`
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
  rpgState.localX = mapId === 'town' ? 280 : 140;
  rpgState.localY = 265;
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
            if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 90) {
              interactWithRpgNpc(npc);
            }
            return;
          }
        }
      }

      for (const mon of rpgState.mapMonsters) {
        if (Math.hypot(clickX - mon.x, clickY - mon.y) <= 46) {
          rpgState.targetX = mon.x;
          rpgState.targetY = mon.y;
          if (Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y) <= 95) {
            startRpgCombatWithMonster(mon);
          }
          return;
        }
      }

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

  if (mapDef && Array.isArray(mapDef.npcs)) {
    for (const npc of mapDef.npcs) {
      if (Math.hypot(rpgState.localX - npc.x, rpgState.localY - npc.y) <= 90) {
        interactWithRpgNpc(npc);
        return;
      }
    }
  }

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
    addRpgFloatingText(rpgState.localX, rpgState.localY - 42, '💚 ฟื้นฟู HP เต็ม 100%!', '#34d399');
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

// Check if a point (x, y) is blocked by the river (except on the bridge!)
function isBlockedByRpgRiver(mapDef, x, y) {
  if (!mapDef || !mapDef.riverX) return false;
  const halfW = (mapDef.riverWidth || 70) / 2 + 6;
  const inRiverX = x >= mapDef.riverX - halfW && x <= mapDef.riverX + halfW;
  if (!inRiverX) return false;

  const bridgeHalfH = (mapDef.bridgeH || 74) / 2 - 4;
  const onBridgeY = y >= (mapDef.bridgeY || 260) - bridgeHalfH && y <= (mapDef.bridgeY || 260) + bridgeHalfH;
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
  const mapDef = RPG_MAPS[rpgState.currentMap] || RPG_MAPS.town;

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
    if (dx !== 0) rpgState.facing = dx > 0 ? 1 : -1;
    moved = true;
  } else {
    const dist = Math.hypot(rpgState.targetX - rpgState.localX, rpgState.targetY - rpgState.localY);
    if (dist > 4) {
      const step = Math.min(speed, dist);
      const vx = (rpgState.targetX - rpgState.localX) / dist;
      const vy = (rpgState.targetY - rpgState.localY) / dist;
      nextX += vx * step;
      nextY += vy * step;
      if (Math.abs(vx) > 0.1) rpgState.facing = vx > 0 ? 1 : -1;
      moved = true;
    }
  }

  // River collision check (allows walking across the wooden bridge!)
  if (moved) {
    if (!isBlockedByRpgRiver(mapDef, nextX, nextY)) {
      rpgState.localX = nextX;
      rpgState.localY = nextY;
    } else if (!isBlockedByRpgRiver(mapDef, rpgState.localX, nextY)) {
      rpgState.localY = nextY;
    } else if (!isBlockedByRpgRiver(mapDef, nextX, rpgState.localY)) {
      rpgState.localX = nextX;
    }
  }

  rpgState.localX = Math.max(40, Math.min(920, rpgState.localX));
  rpgState.localY = Math.max(60, Math.min(485, rpgState.localY));
  rpgState.isMoving = moved;

  if (moved) {
    rpgState.walkPhase += 0.28;
    syncPlayerOnlinePresence(false);
  } else {
    rpgState.walkPhase = 0;
  }

  // Animate roaming monsters
  const t = Date.now() * 0.002;
  rpgState.mapMonsters.forEach(mon => {
    mon.x = mon.baseX + Math.sin(t + mon.phase) * 20;
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
  const animTime = Date.now() * 0.001;

  const mapDef = RPG_MAPS[rpgState.currentMap] || RPG_MAPS.town;

  // 1. Classic 2D Retro Tilemap Ground
  const tileSize = 40;
  for (let gx = 0; gx < w; gx += tileSize) {
    for (let gy = 0; gy < h; gy += tileSize) {
      const isEven = ((gx / tileSize) + (gy / tileSize)) % 2 === 0;
      ctx.fillStyle = isEven ? mapDef.tileA : mapDef.tileB;
      ctx.fillRect(gx, gy, tileSize, tileSize);

      // Little 2D grass tufts / pebbles pattern
      if ((gx * 7 + gy * 13) % 5 === 0) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.fillRect(gx + 12, gy + 14, 4, 6);
        ctx.fillRect(gx + 18, gy + 16, 4, 4);
      }
    }
  }

  // 2. Dirt / Cobblestone Road across the map
  const roadY = (mapDef.bridgeY || 260) - 30;
  ctx.fillStyle = mapDef.pathBorder;
  ctx.fillRect(45, roadY - 4, w - 90, 68);
  ctx.fillStyle = mapDef.pathColor;
  ctx.fillRect(45, roadY, w - 90, 60);

  // 3. Animated Flowing River (Water or Lava) & Wooden Bridge
  if (mapDef.riverX) {
    const rx = mapDef.riverX - mapDef.riverWidth / 2;
    const rw = mapDef.riverWidth;
    const isLava = mapDef.riverType === 'lava';

    // Riverbanks
    ctx.fillStyle = isLava ? '#450a0a' : '#a1804f';
    ctx.fillRect(rx - 7, 0, rw + 14, h);

    // River water/lava body
    ctx.fillStyle = isLava ? '#dc2626' : '#0284c7';
    ctx.fillRect(rx, 0, rw, h);

    // Animated flowing waves
    ctx.fillStyle = isLava ? '#fde047' : '#7dd3fc';
    const waveOffset = (animTime * 45) % 48;
    for (let wy = -48; wy < h + 48; wy += 48) {
      const yPos = wy + waveOffset;
      ctx.fillRect(rx + 12, yPos, 16, 4);
      ctx.fillRect(rx + rw - 30, yPos + 22, 18, 4);
    }

    // 2D Wooden Bridge over the river
    const by = (mapDef.bridgeY || 260) - (mapDef.bridgeH || 74) / 2;
    const bh = mapDef.bridgeH || 74;
    ctx.fillStyle = isLava ? '#334155' : '#92400e';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.fillRect(rx - 12, by, rw + 24, bh);
    ctx.strokeRect(rx - 12, by, rw + 24, bh);

    // Bridge wooden planks
    ctx.fillStyle = isLava ? '#475569' : '#b45309';
    for (let px = rx - 8; px < rx + rw + 8; px += 12) {
      ctx.fillRect(px, by + 6, 9, bh - 12);
    }
    // Bridge handrails
    ctx.fillStyle = '#451a03';
    ctx.fillRect(rx - 14, by, rw + 28, 6);
    ctx.fillRect(rx - 14, by + bh - 6, rw + 28, 6);
  }

  // 4. Collect All Y-Sorted Entities (2D Trees, Houses, Rocks, NPCs, Monsters, Online Classmates, Local Hero)
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
        draw: () => draw2dNpcObject(ctx, npc, dist <= 90, animTime)
      });
    });
  }

  rpgState.mapMonsters.forEach(mon => {
    const dist = Math.hypot(rpgState.localX - mon.x, rpgState.localY - mon.y);
    const isNear = dist <= 95;
    renderQueue.push({
      sortY: mon.y,
      draw: () => {
        draw2dMonsterSprite(ctx, mon.x, mon.y, mon.spriteType || 'slime', animTime + mon.phase, mon.isBoss ? 1.35 : 1.05);
        // Monster Name Tag
        ctx.save();
        ctx.font = "800 12px 'Sarabun', sans-serif";
        ctx.textAlign = 'center';
        const tagY = mon.y - (mon.isBoss ? 52 : 34);
        const tagW = ctx.measureText(mon.name).width + 12;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.82)';
        ctx.beginPath();
        ctx.roundRect(mon.x - tagW / 2, tagY - 10, tagW, 18, 6);
        ctx.fill();
        ctx.fillStyle = mon.isBoss ? '#fde047' : '#fca5a5';
        ctx.fillText(mon.name, mon.x, tagY + 3);
        if (isNear) {
          ctx.font = "800 11px 'Sarabun', sans-serif";
          ctx.fillStyle = '#38bdf8';
          ctx.fillText('⚔️ แตะเพื่อต่อสู้!', mon.x, mon.y + 34);
        }
        ctx.restore();
      }
    });
  });

  // Online Classmates
  const myId = getRpgPlayerId();
  Object.values(rpgState.onlinePlayers || {}).forEach(p => {
    if (!p || p.id === myId || p.map !== rpgState.currentMap) return;
    if (p.updatedAt && Date.now() - p.updatedAt > 600000) return;
    const py = p.y || 265;
    renderQueue.push({
      sortY: py,
      draw: () => {
        draw2dHeroSprite(ctx, p.x || 280, py, p.job || 'warrior', p.facing || 1, animTime * 3, 1.0);
        drawHeroNameAndChatTag(ctx, p.x || 280, py, p.name, p.level || 1, false, p.chat);
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
          1.05
        );
        const activeChat = Date.now() < rpgState.chatBubbleExpire ? rpgState.chatBubbleText : '';
        drawHeroNameAndChatTag(ctx, rpgState.localX, rpgState.localY, rpgState.hero.name, rpgState.hero.level || 1, true, activeChat);
      }
    });
  }

  // Sort by Y coordinate so characters naturally pass behind/in front of trees & houses!
  renderQueue.sort((a, b) => a.sortY - b.sortY);
  renderQueue.forEach(item => item.draw());

  // 5. Map Title Badge (Top-Left)
  ctx.save();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
  ctx.beginPath();
  ctx.roundRect(12, 10, 290, 28, 8);
  ctx.fill();
  ctx.font = "800 13px 'Sarabun', sans-serif";
  ctx.fillStyle = '#fde047';
  ctx.textAlign = 'left';
  ctx.fillText(mapDef.name, 22, 29);
  ctx.restore();

  // 6. Floating Damage / Heal Texts
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
  ctx.roundRect(x - textW / 2, y - 54, textW, 18, 6);
  ctx.fill();

  ctx.fillStyle = isSelf ? '#fde047' : '#e2e8f0';
  ctx.fillText(label, x, y - 41);

  if (chatText) {
    ctx.font = "700 12px 'Sarabun', sans-serif";
    const chatW = ctx.measureText(chatText).width + 16;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(x - chatW / 2, y - 78, chatW, 21, 10);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillText(chatText, x, y - 64);
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
    draw2dHeroSprite(hCtx, heroCanvas.width / 2, heroCanvas.height / 2 + 16, rpgState.hero.job || 'warrior', 1, animTime * 3, 1.45);
  }

  if (monCanvas && rpgState.activeMonster) {
    const mCtx = monCanvas.getContext('2d');
    mCtx.clearRect(0, 0, monCanvas.width, monCanvas.height);
    const mon = rpgState.activeMonster;
    draw2dMonsterSprite(mCtx, monCanvas.width / 2, monCanvas.height / 2 + 14, mon.spriteType || 'slime', animTime, mon.isBoss ? 1.2 : 1.45);
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

  const isRanger = rpgState.hero?.job === 'ranger';
  rpgState.quizRemainingSec = isRanger ? 25 : 20;
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

  const cmdBox = document.getElementById('rpg-battle-commands');
  const quizBox = document.getElementById('rpg-battle-quiz-box');
  if (cmdBox) cmdBox.style.display = 'grid';
  if (quizBox) quizBox.style.display = 'none';

  if (isCorrect) {
    rpgState.combatCombo++;
    const isSkill = rpgState.pendingSkillMode === 'skill';
    let dmgMultiplier = isSkill ? 1.6 : 1.0;

    if (rpgState.hero.job === 'mage') {
      dmgMultiplier += rpgState.combatCombo * 0.15;
    }

    const isCrit = Math.random() * 100 < stats.crit;
    if (isCrit) dmgMultiplier *= 1.75;

    const rawDmg = Math.max(8, Math.round(stats.atk * dmgMultiplier - (mon.def || 0) * 0.4));
    rpgState.monsterHp = Math.max(0, rpgState.monsterHp - rawDmg);

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
      handleRpgMonsterVictory(mon);
      return;
    }
  } else {
    rpgState.combatCombo = 0;
    const correctChoiceText = q.options[q.correctIndex] || '';
    let enemyDmg = Math.max(6, Math.round(mon.atk - stats.def * 0.55));
    if (rpgState.hero.job === 'warrior' && rpgState.pendingSkillMode === 'skill') {
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
