/* ==========================================================================
   TOWER OF WISDOM: ROGUELITE CO-OP RAID & LOGIC DUNGEON ENGINE
   หอคอยแห่งปัญญา 10 ชั้น: ระบบเกมแฟนตาซีตรรกะ & วิทยาการคำนวณแบบ Co-op Raid
   ========================================================================== */

// Global Game State
let towerPlayerState = {
  level: 1,
  exp: 0,
  expToNextLevel: 100,
  levelCap: 10,
  highestClearedFloor: 0,
  currentSelectedFloor: 1,
  baseStats: { atk: 12, def: 8, maxHp: 100, currentHp: 100 },
  bonusStats: { atk: 0, def: 0, maxHp: 0 },
  equipment: {
    weapon: null,
    armor: null,
    relic: null
  },
  skills: [], // Array of acquired skill IDs
  subQuestsProgress: {
    1: { clearedRooms: [] },
    2: { clearedRooms: [] },
    3: { clearedRooms: [] },
    4: { clearedRooms: [] },
    5: { clearedRooms: [] },
    6: { clearedRooms: [] },
    7: { clearedRooms: [] },
    8: { clearedRooms: [] },
    9: { clearedRooms: [] },
    10: { clearedRooms: [] }
  }
};

// All Unique Master Skills in the Game
const TOWER_ALL_SKILLS = [
  { id: 'oracle_eye', name: 'เนตรหยั่งรู้ (Oracle Eye)', icon: 'fa-eye', desc: 'ตัดตัวเลือกที่ผิดทิ้ง 2 ตัวเลือกทันที', color: '#38bdf8' },
  { id: 'time_warp', name: 'ย้อนกาลเวลา (Time Warp)', icon: 'fa-hourglass-half', desc: 'เพิ่มเวลาคิดปริศนา +25 วินาที', color: '#fbbf24' },
  { id: 'aegis_shield', name: 'โล่เทพพิทักษ์ (Aegis Shield)', icon: 'fa-shield-halved', desc: 'ป้องกันความเสียหายจากบอส 1 ครั้ง 100%', color: '#34d399' },
  { id: 'critical_mind', name: 'ระเบิดปัญญา (Critical Mind)', icon: 'fa-bolt-lightning', desc: 'การโจมตีครั้งต่อไปสร้างดาเมจคริติคอล 250%', color: '#f43f5e' },
  { id: 'elixir_heal', name: 'น้ำยาฟื้นฟูกายา (Elixir Heal)', icon: 'fa-flask', desc: 'ฟื้นฟูเลือด HP 50% ให้ตนเองและเพื่อนร่วมห้อง', color: '#10b981' },
  { id: 'chain_lightning', name: 'สายฟ้าลูกโซ่ (Chain Lightning)', icon: 'fa-cloud-bolt', desc: 'โจมตีบอสด้วยสายฟ้าเวทมนตร์ ดาเมจ 180%', color: '#818cf8' },
  { id: 'frost_trap', name: 'มนต์แช่แข็ง (Frost Trap)', icon: 'fa-snowflake', desc: 'แช่แข็งบอสทำให้บอสหยุดโจมตี 1 เทิร์น', color: '#67e8f9' },
  { id: 'berserk_will', name: 'จิตวิญญาณนักสู้ (Berserk Will)', icon: 'fa-fire-flame-curved', desc: 'เมื่อเลือดต่ำกว่า 35% พลังโจมตีเพิ่มขึ้น 2 เท่า', color: '#ef4444' },
  { id: 'midas_fortune', name: 'หัตถ์ทองคำ (Midas Touch)', icon: 'fa-coins', desc: 'สุ่มเพิ่มสเตตัสและ EXP เพิ่มขึ้นเป็น 2 เท่า', color: '#facc15' },
  { id: 'phoenix_rebirth', name: 'นกฟีนิกซ์คืนชีพ (Phoenix Rebirth)', icon: 'fa-dove', desc: 'เมื่อเลือดหมด จะฟื้นคืนชีพกลับมาด้วยเลือด 40%', color: '#fb923c' },
  { id: 'vampiric_drain', name: 'ดูดกลืนพลัง (Vampiric Drain)', icon: 'fa-droplet', desc: 'เปลี่ยนดาเมจที่ทำใส่บอส 35% มาเพิ่มเลือดให้ตนเอง', color: '#ec4899' },
  { id: 'divine_wall', name: 'กำแพงสะท้อน (Divine Wall)', icon: 'fa-chess-rook', desc: 'สะท้อนความเสียหายของบอสกลับไป 50%', color: '#a855f7' }
];

// 10 Floors Data & Boss Configurations
const TOWER_FLOORS_DATA = [
  {
    floor: 1,
    name: 'ประตูทางเข้าวิหารสัจนิรันดร์ (Gate of Truth)',
    theme: 'ตรรกศาสตร์ & Logic Gates (AND, OR, NOT)',
    levelCap: 10,
    boss: {
      name: 'โกเลมหินสัจจะ (Logic Golem)',
      level: 10,
      maxHp: 2500,
      atk: 15,
      def: 6,
      avatar: '🗿',
      desc: 'ผู้พิทักษ์หินโบราณที่ขับเคลื่อนด้วยวงจรตรรกะ AND/OR',
      skillName: 'Earth Smash'
    },
    subQuests: [
      { id: 'f1_q1', name: 'วงจรลอจิกเกตขั้นที่ 1 (AND & OR Gate)', icon: 'fa-microchip', rewardExp: 45 },
      { id: 'f1_q2', name: 'ตารางความจริงแห่งสัจนิรันดร์ (Truth Table)', icon: 'fa-table-cells', rewardExp: 60 }
    ]
  },
  {
    floor: 2,
    name: 'ถ้ำลำดับเวทมนตร์ (Cavern of Sequences)',
    theme: 'การหารูปแบบและอนุกรม (Pattern Recognition)',
    levelCap: 20,
    boss: {
      name: 'อสรพิษลำดับอนันต์ (Infinite Serpent)',
      level: 20,
      maxHp: 5000,
      atk: 24,
      def: 12,
      avatar: '🐍',
      desc: 'พญางูยักษ์ที่เปลี่ยนร่างตามลำดับอนุกรมตัวเลข',
      skillName: 'Poison Sequence'
    },
    subQuests: [
      { id: 'f2_q1', name: 'ถอดรหัสรูปแบบอัญมณีเวท (Pattern Sequence)', icon: 'fa-gem', rewardExp: 75 },
      { id: 'f2_q2', name: 'อนุกรมฟีโบนัชชีแห่งถ้ำมืด (Fibonacci Runes)', icon: 'fa-shapes', rewardExp: 90 }
    ]
  },
  {
    floor: 3,
    name: 'ป่าเขาวงกตอัลกอริทึม (Forest of Algorithms)',
    theme: 'การวางลำดับขั้นตอน & ผังงาน (Flowcharts & Steps)',
    levelCap: 30,
    boss: {
      name: 'ภูตเขาวงกตอัลกอริทึม (Labyrinth Sprite)',
      level: 30,
      maxHp: 9000,
      atk: 35,
      def: 18,
      avatar: '🧚',
      desc: 'ภูตพงไพรที่มีความเร็วสูง หลบหลีกด้วยเส้นทางผังงาน',
      skillName: 'Maze Illusion'
    },
    subQuests: [
      { id: 'f3_q1', name: 'ถอดผังงานหาทางออก (Flowchart Navigation)', icon: 'fa-diagram-project', rewardExp: 120 },
      { id: 'f3_q2', name: 'ลำดับคำสั่งหลบหลีกกับดัก (Step Sorting)', icon: 'fa-shoe-prints', rewardExp: 140 }
    ]
  },
  {
    floor: 4,
    name: 'หุบเขาเลขฐานสองโบราณ (Valley of Binary Runes)',
    theme: 'เลขฐานสองและฐานสิบหก (Binary & Bitwise Logic)',
    levelCap: 40,
    boss: {
      name: 'การ์กอยล์ทวิภาค (Binary Gargoyle)',
      level: 40,
      maxHp: 14000,
      atk: 48,
      def: 25,
      avatar: '🦇',
      desc: 'สัตว์อสูรหินที่ดูดซับพลังจากรหัสบิต 0 และ 1',
      skillName: 'Bitwise Beam'
    },
    subQuests: [
      { id: 'f4_q1', name: 'แปลงเลขฐานสองสู่พลังเวท (Binary Conversion)', icon: 'fa-code-branch', rewardExp: 180 },
      { id: 'f4_q2', name: 'อักขระฐานสิบหกเรืองแสง (Hexadecimal Lock)', icon: 'fa-hashtag', rewardExp: 220 }
    ]
  },
  {
    floor: 5,
    name: 'สุสานข้อผิดพลาด (Catacombs of Bugs)',
    theme: 'การหาและแก้ไขจุดผิดพลาด (Debugging Trials)',
    levelCap: 50,
    boss: {
      name: 'ราชินีบั๊กมรณะ (The Dread Bug Queen)',
      level: 50,
      maxHp: 20000,
      atk: 62,
      def: 32,
      avatar: '🦂',
      desc: 'เจ้าแห่งข้อผิดพลาดที่แพร่พิษแห่งความสับสน',
      skillName: 'Syntax Poison'
    },
    subQuests: [
      { id: 'f5_q1', name: 'จับจุดผิดในโค้ดอาถรรพ์ (Syntax Error Hunt)', icon: 'fa-bug', rewardExp: 280 },
      { id: 'f5_q2', name: 'แก้ไขตรรกะที่คลาดเคลื่อน (Logic Bug Fix)', icon: 'fa-wrench', rewardExp: 330 }
    ]
  },
  {
    floor: 6,
    name: 'หอสมุดเงื่อนไขซ้อน (Library of Conditionals)',
    theme: 'เงื่อนไขหลายชั้น (If-Else & Switch Case)',
    levelCap: 60,
    boss: {
      name: 'จอมเวทเงื่อนไข (Conditional Archmage)',
      level: 60,
      maxHp: 28000,
      atk: 78,
      def: 40,
      avatar: '🧙‍♂️',
      desc: 'จอมเวทผู้เชี่ยวชาญการร่ายคาถาตามเงื่อนไขแปรผัน',
      skillName: 'Nested Blizzard'
    },
    subQuests: [
      { id: 'f6_q1', name: 'ตัดสินใจผ่านประตูเงื่อนไข (If-Else Choices)', icon: 'fa-code-fork', rewardExp: 400 },
      { id: 'f6_q2', name: 'เงื่อนไขซ้อนแห่งตำรามนตร์ (Nested Conditions)', icon: 'fa-book-skull', rewardExp: 460 }
    ]
  },
  {
    floor: 7,
    name: 'ห้องนิรภัยโครงสร้างข้อมูล (Vault of Arrays)',
    theme: 'โครงสร้างข้อมูล (Arrays, Stacks, Queues)',
    levelCap: 70,
    boss: {
      name: 'อัศวินผลึกโครงสร้าง (Structure Guardian)',
      level: 70,
      maxHp: 38000,
      atk: 95,
      def: 50,
      avatar: '🛡️',
      desc: 'อัศวินเกราะผลึกที่จัดกระบวนทัพด้วยแถวลำดับและสแตก',
      skillName: 'Stack Overflow'
    },
    subQuests: [
      { id: 'f7_q1', name: 'จัดเรียงหีบสมบัติอาร์เรย์ (Array Indexing)', icon: 'fa-boxes-stacked', rewardExp: 550 },
      { id: 'f7_q2', name: 'ปริศนาลิฟต์สแตกและคิว (Stack & Queue)', icon: 'fa-layer-group', rewardExp: 650 }
    ]
  },
  {
    floor: 8,
    name: 'ยอดผาฟังก์ชันและตัวแปร (Cliff of Functions)',
    theme: 'ฟังก์ชันและการวนซ้ำ (Functions, Loops & Recursion)',
    levelCap: 80,
    boss: {
      name: 'มังกรเพลิงฟังก์ชัน (Recursive Flame Dragon)',
      level: 80,
      maxHp: 50000,
      atk: 115,
      def: 60,
      avatar: '🐉',
      desc: 'มังกรเพลิงโบราณที่พ่นลูกไฟวนซ้ำไม่รู้จบ',
      skillName: 'Recursive Inferno'
    },
    subQuests: [
      { id: 'f8_q1', name: 'วงล้อเวทมนตร์ลูปซ้ำ (Loop & Iteration)', icon: 'fa-arrows-rotate', rewardExp: 780 },
      { id: 'f8_q2', name: 'รหัสเรียกใช้ฟังก์ชันเวท (Function Calling)', icon: 'fa-wand-magic-sparkles', rewardExp: 900 }
    ]
  },
  {
    floor: 9,
    name: 'ปราสาทถอดรหัสไซเฟอร์ (Castle of Cryptography)',
    theme: 'การเข้ารหัสและถอดรหัสข้อมูล (Ciphers & Decryption)',
    levelCap: 90,
    boss: {
      name: 'ชาโดว์แฟนทอมรหัสลับ (Cipher Shadow Phantom)',
      level: 90,
      maxHp: 65000,
      atk: 138,
      def: 72,
      avatar: '👤',
      desc: 'เงาลึกลับที่ซ่อนตัวอยู่หลังม่านรหัสลับซีซาร์',
      skillName: 'Encrypted Void'
    },
    subQuests: [
      { id: 'f9_q1', name: 'ถอดรหัสอักษรเลื่อน (Caesar Cipher)', icon: 'fa-key', rewardExp: 1100 },
      { id: 'f9_q2', name: 'ถอดรหัสแฮชกุญแจลับ (Hash Key Trial)', icon: 'fa-lock-open', rewardExp: 1300 }
    ]
  },
  {
    floor: 10,
    name: 'บัลลังก์จักรกลปัญญาประดิษฐ์ (Throne of AI Mastermind)',
    theme: 'ปัญญาประดิษฐ์และตรรกะขั้นสูงสุด (AI Logic & Neural Systems)',
    levelCap: 99,
    boss: {
      name: 'ผู้คุมกฎแห่งมิติดิจิทัล (Digital Mastermind Overlord)',
      level: 100,
      maxHp: 100000,
      atk: 165,
      def: 85,
      avatar: '🤖',
      desc: 'สุดยอดมหาบอสปัญญาประดิษฐ์ผู้ครอบครองหอคอยแห่งปัญญา',
      skillName: 'Ultimate Quantum Blast'
    },
    subQuests: [
      { id: 'f10_q1', name: 'โครงข่ายประสาทเทียมแห่งปัญญา (Neural Logic Net)', icon: 'fa-network-wired', rewardExp: 1600 },
      { id: 'f10_q2', name: 'การตัดสินใจอัลกอริทึมขั้นสูงสุด (Final Decision Tree)', icon: 'fa-brain', rewardExp: 2000 }
    ]
  }
];

// Equipment Loot Table (Weapons, Armors, Relics)
const TOWER_LOOT_TABLE = {
  weapons: [
    { name: 'ดาบไม้ฝึกหัด (Training Blade)', rarity: 'common', atk: 6, icon: '🗡️' },
    { name: 'ดาบเหล็กตรรกะ (Logic Iron Sword)', rarity: 'common', atk: 12, icon: '⚔️' },
    { name: 'คทาเวทมนตร์รูน (Rune Staff)', rarity: 'rare', atk: 22, icon: '🪄' },
    { name: 'ดาบคริสตัลอัลกอริทึม (Algorithm Crystal Blade)', rarity: 'rare', atk: 35, icon: '💎' },
    { name: 'หอกสายฟ้าทวิภาค (Binary Thunder Spear)', rarity: 'epic', atk: 52, icon: '⚡' },
    { name: 'ดาบศักดิ์สิทธิ์ผู้พิทักษ์หอคอย (Holy Tower Cleaver)', rarity: 'epic', atk: 70, icon: '✨' },
    { name: 'ดาบแห่งแสงปัญญาประดิษฐ์ (AI Zenith Blade)', rarity: 'legendary', atk: 95, icon: '🌟' }
  ],
  armors: [
    { name: 'เสื้อเกราะผ้าธรรมดา (Cloth Vest)', rarity: 'common', def: 4, icon: '🥋' },
    { name: 'เกราะหนังนักผจญภัย (Scout Leather)', rarity: 'common', def: 9, icon: '🛡️' },
    { name: 'เกราะโซ่ถักต้านเวท (Mithril Chainmail)', rarity: 'rare', def: 18, icon: '🦺' },
    { name: 'ชุดคลุมจอมเวทคัดสรร (Archmage Robe)', rarity: 'rare', def: 28, icon: '👘' },
    { name: 'เกราะเพลทผลึกศิลา (Crystal Plate Armor)', rarity: 'epic', def: 42, icon: '🛡️' },
    { name: 'เกราะทองคำเทพพิทักษ์ (Aegis Gold Plate)', rarity: 'legendary', def: 60, icon: '👑' }
  ],
  relics: [
    { name: 'แหวนทองแดงสมาธิ (Bronze Ring)', rarity: 'common', maxHp: 30, icon: '💍' },
    { name: 'สร้อยคอหินนำโชค (Lucky Stone Amulet)', rarity: 'common', maxHp: 65, icon: '📿' },
    { name: 'จี้ห้อยคอหัวใจมังกร (Dragon Heart Pendant)', rarity: 'rare', maxHp: 120, icon: '❤️' },
    { name: 'แหวนรูนแห่งชีวิตนิรันดร์ (Eternal Rune Ring)', rarity: 'epic', maxHp: 200, icon: '💍' },
    { name: 'มงกุฎเกียรติยศจักรพรรดิ (Emperor Crown of Wisdom)', rarity: 'legendary', maxHp: 320, icon: '👑' }
  ]
};

// Puzzle Question Bank for All 10 Floors
const TOWER_PUZZLE_BANK = {
  1: [
    { q: 'ผลลัพธ์ของ (TRUE AND FALSE) มีค่าตรงกับข้อใด?', options: ['TRUE', 'FALSE', 'ERROR', 'NULL'], ans: 1, hint: 'AND ต้องการค่าจริงทั้งสองข้างถึงจะได้จริง' },
    { q: 'หาก A = TRUE และ B = FALSE ข้อใดให้ผลลัพธ์เป็น TRUE?', options: ['A AND B', 'NOT A', 'A OR B', 'NOT (A OR B)'], ans: 2, hint: 'OR ขอเพียงมีข้างใดข้างหนึ่งเป็นจริงก็จะได้จริง' },
    { q: 'เกตใดที่ทำหน้าที่กลับค่าความจริงจาก 1 เป็น 0 และ 0 เป็น 1?', options: ['AND Gate', 'OR Gate', 'NOT Gate', 'NAND Gate'], ans: 2, hint: 'อินเวอร์เตอร์ (Inverter)' },
    { q: 'โจทย์: NOT (TRUE AND TRUE) มีผลลัพธ์เป็นอะไร?', options: ['TRUE', 'FALSE', 'ไม่แน่นอน', '1'], ans: 1, hint: 'คิดในวงเล็บก่อน TRUE AND TRUE = TRUE แล้วใส่ NOT' }
  ],
  2: [
    { q: 'จงหาจำนวนถัดไปของลำดับ: 2, 4, 8, 16, ... ?', options: ['24', '30', '32', '64'], ans: 2, hint: 'สังเกตการคูณ 2 ในแต่ละพจน์' },
    { q: 'อนุกรมฟีโบนัชชี: 1, 1, 2, 3, 5, 8, ... ตัวถัดไปคือเลขใด?', options: ['11', '13', '15', '16'], ans: 1, hint: 'นำ 5 + 8 เพื่อหาพจน์ถัดไป' },
    { q: 'ลำดับอักขระ: A, C, E, G, ... ตัวถัดไปคืออักษรใด?', options: ['H', 'I', 'J', 'K'], ans: 1, hint: 'ข้ามทีละ 1 ตัวอักษร' }
  ],
  3: [
    { q: 'ในผังงาน (Flowchart) สัญลักษณ์สี่เหลี่ยมขนมเปียกปูน (Diamond) ใช้แทนอะไร?', options: ['จุดเริ่มต้น/สิ้นสุด', 'การคำนวณ/ประมวลผล', 'การตัดสินใจตามเงื่อนไข (Decision)', 'การรับข้อมูล'], ans: 2, hint: 'ใช้สำหรับเลือกว่าจะไปทาง Yes หรือ No' },
    { q: 'ขั้นตอนวิธี (Algorithm) ที่ดีควรมีคุณสมบัติใดมากที่สุด?', options: ['มีความซับซ้อนเข้าใจยาก', 'มีลำดับขั้นตอนชัดเจนและให้ผลลัพธ์ถูกต้อง', 'ใช้คำสั่งยาวที่สุด', 'ไม่มีวันสิ้นสุด'], ans: 1, hint: 'ชัดเจน แม่นยำ และสิ้นสุดการทำงานได้' }
  ],
  4: [
    { q: 'เลขฐานสอง 1010 มีค่าเท่ากับเลขฐานสิบใด?', options: ['8', '10', '12', '14'], ans: 1, hint: '8 + 0 + 2 + 0 = 10' },
    { q: 'เลขฐานสิบ 7 แปลงเป็นเลขฐานสองได้ตรงกับข้อใด?', options: ['0101', '0110', '0111', '1001'], ans: 2, hint: '4 + 2 + 1 = 7' }
  ],
  5: [
    { q: 'ข้อผิดพลาดประเภท Syntax Error หมายถึงข้อใด?', options: ['ไวยากรณ์คำสั่งผิดกฎของภาษา', 'โปรแกรมทำงานผิดตรรกะแต่ไม่แจ้งเตือน', 'หน่วยความจำเต็ม', 'เครื่องคอมพิวเตอร์ดับ'], ans: 0, hint: 'พิมพ์คำสั่งผิดสะกดไม่ตรงกฎ' },
    { q: 'การดีบัก (Debugging) ในการเขียนโปรแกรมหมายถึงกระบวนการใด?', options: ['การลบโค้ดทิ้งทั้งหมด', 'การค้นหาและแก้ไขข้อผิดพลาดของโปรแกรม', 'การลงโปรแกรมใหม่', 'การเชื่อมต่ออินเทอร์เน็ต'], ans: 1, hint: 'Bug = ข้อผิดพลาด, Debug = กำจัดจุดผิด' }
  ],
  6: [
    { q: 'ถ้ากำหนด x = 15; if (x > 20) { y = 1; } else if (x > 10) { y = 2; } else { y = 3; } ค่า y คืออะไร?', options: ['1', '2', '3', '0'], ans: 1, hint: 'x มีค่า 15 จึงเข้าเงื่อนไข x > 10' },
    { q: 'เงื่อนไข (score >= 80 AND score <= 100) จะเป็นจริงเมื่อใด?', options: ['เมื่อ score เท่ากับ 79', 'เมื่อ score อยู่ระหว่าง 80 ถึง 100', 'เมื่อ score มากกว่า 100', 'เมื่อ score ต่ำกว่า 80'], ans: 1, hint: 'ช่วงคะแนน 80-100' }
  ],
  7: [
    { q: 'โครงสร้างข้อมูลแบบ Stack ทำงานด้วยหลักการใด?', options: ['FIFO (เข้าก่อนออกก่อน)', 'LIFO (เข้าทีหลังออกก่อน)', 'Random', 'Tree'], ans: 1, hint: 'เหมือนจานที่วางซ้อนกัน จานบนสุดหยิบออกก่อน' },
    { q: 'ถ้าอาร์เรย์ scores = [10, 20, 30, 40] ค่าของ scores[2] ในภาษาคอมพิวเตอร์ทั่วไปคืออะไร?', options: ['10', '20', '30', '40'], ans: 2, hint: 'ดัชนีเริ่มต้นที่ 0: index 0=10, 1=20, 2=30' }
  ],
  8: [
    { q: 'ฟังก์ชันแบบ Recursive (การเรียกซ้ำ) คืออะไร?', options: ['ฟังก์ชันที่ไม่คืนค่า', 'ฟังก์ชันที่เรียกใช้ตัวเองภายในตัวมันเอง', 'ฟังก์ชันที่ไม่มีพารามิเตอร์', 'ฟังก์ชันที่ทำงานครั้งเดียว'], ans: 1, hint: 'เรียกซ้ำตัวเองจนกว่าจะถึงเงื่อนไขหยุด' },
    { q: 'ลูป for (let i = 0; i < 5; i++) จะทำงานวนซ้ำทั้งหมดกี่รอบ?', options: ['4 รอบ', '5 รอบ', '6 รอบ', 'ไม่สิ้นสุด'], ans: 1, hint: 'i = 0, 1, 2, 3, 4' }
  ],
  9: [
    { q: 'รหัสซีซาร์ (Caesar Cipher) แบบเลื่อนไปข้างหน้า 1 ตำแหน่ง คำว่า "CAT" จะกลายเป็นอะไร?', options: ['DBU', 'BZS', 'DBS', 'EBU'], ans: 0, hint: 'C->D, A->B, T->U' },
    { q: 'เป้าหมายหลักของการเข้ารหัสข้อมูล (Cryptography) คือข้อใด?', options: ['ทำให้ไฟล์มีขนาดเล็กลง', 'รักษาความลับและความปลอดภัยของข้อมูล', 'เพิ่มความเร็วในการส่งข้อมูล', 'ลบข้อมูลที่ไม่ต้องการ'], ans: 1, hint: 'ป้องกันไม่ให้ผู้ไม่ได้รับอนุญาตอ่านข้อมูลได้' }
  ],
  10: [
    { q: 'ในระบบ AI และ Machine Learning กระบวนการใดใช้สำหรับให้โมเดลเรียนรู้จากข้อมูล?', options: ['Model Compilation', 'Model Training (การฝึกฝนโมเดล)', 'Model Formatting', 'Model Restart'], ans: 1, hint: 'นำชุดข้อมูลมาสอนโมเดล' },
    { q: 'Decision Tree (ต้นไม้ตัดสินใจ) ใน AI ใช้โครงสร้างใดในการจำแนกข้อมูล?', options: ['Stack', 'Node กิ่งก้านและใบเงื่อนไข', 'Queue', 'Array 1 มิติ'], ans: 1, hint: 'โครงสร้างต้นไม้ที่มีเงื่อนไขแยกย่อย' }
  ]
};

/* -------------------------------------------------------------
   INITIALIZATION & STUDENT STATE LOADING
------------------------------------------------------------- */
function initTowerGameModule() {
  if (!currentUser) return;

  ensureStudentInitialSkill();
  loadStudentTowerProgress();
}

function ensureStudentInitialSkill() {
  if (towerPlayerState.skills.length === 0) {
    const studentIdStr = String(currentUser.studentId || currentUser.username || '1');
    let hash = 0;
    for (let i = 0; i < studentIdStr.length; i++) {
      hash = (hash << 5) - hash + studentIdStr.charCodeAt(i);
      hash |= 0;
    }
    const skillIndex = Math.abs(hash) % TOWER_ALL_SKILLS.length;
    const initialSkill = TOWER_ALL_SKILLS[skillIndex];
    towerPlayerState.skills.push(initialSkill.id);
  }
}

function loadStudentTowerProgress() {
  const studentKey = currentUser.studentId || currentUser.username || 'default_player';
  
  if (typeof firebase !== 'undefined' && firebase.database) {
    firebase.database().ref(`tower_players/${studentKey}`).once('value').then((snapshot) => {
      const data = snapshot.val();
      if (data) {
        towerPlayerState.level = data.level || 1;
        towerPlayerState.exp = data.exp || 0;
        towerPlayerState.highestClearedFloor = data.highestClearedFloor || 0;
        towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);
        towerPlayerState.baseStats = data.baseStats || { atk: 12 + (towerPlayerState.level * 3), def: 8 + (towerPlayerState.level * 2), maxHp: 100 + (towerPlayerState.level * 15), currentHp: 100 + (towerPlayerState.level * 15) };
        towerPlayerState.equipment = data.equipment || { weapon: null, armor: null, relic: null };
        if (data.skills && Array.isArray(data.skills)) {
          towerPlayerState.skills = data.skills;
        }
        if (data.subQuestsProgress) {
          towerPlayerState.subQuestsProgress = data.subQuestsProgress;
        }
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
      highestClearedFloor: towerPlayerState.highestClearedFloor,
      levelCap: towerPlayerState.levelCap,
      baseStats: towerPlayerState.baseStats,
      bonusStats: towerPlayerState.bonusStats,
      equipment: towerPlayerState.equipment,
      skills: towerPlayerState.skills,
      subQuestsProgress: towerPlayerState.subQuestsProgress,
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

  return {
    atk: towerPlayerState.baseStats.atk + towerPlayerState.bonusStats.atk + eqAtk,
    def: towerPlayerState.baseStats.def + towerPlayerState.bonusStats.def + eqDef,
    maxHp: towerPlayerState.baseStats.maxHp + towerPlayerState.bonusStats.maxHp + eqHp,
    currentHp: Math.min(towerPlayerState.baseStats.currentHp, towerPlayerState.baseStats.maxHp + towerPlayerState.bonusStats.maxHp + eqHp)
  };
}

/* -------------------------------------------------------------
   RENDER MAIN TOWER VIEW & MAP
------------------------------------------------------------- */
function renderTowerMainView() {
  const container = document.getElementById('view-tower');
  if (!container) return;

  const totalStats = getTotalStats();
  const levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);
  towerPlayerState.levelCap = levelCap;

  let html = `
    <div class="tower-hub-container">
      
      <!-- Top Hero Character Bar -->
      <div class="tower-hero-sheet">
        <div class="hero-sheet-left">
          <div class="hero-avatar-box">
            <span class="hero-class-icon">🧙‍♂️</span>
            <div class="hero-level-badge">Lv. ${towerPlayerState.level}</div>
          </div>
          <div class="hero-info-text">
            <div class="hero-name-row">
              <h3 class="hero-student-name">${currentUser ? currentUser.name : 'นักผจญภัย'}</h3>
              <span class="hero-cap-badge"><i class="fa-solid fa-lock"></i> เพดานเลเวล: Lv. ${towerPlayerState.levelCap}</span>
            </div>
            <div class="hero-exp-bar-container">
              <div class="hero-exp-track">
                <div class="hero-exp-fill" style="width: ${Math.min(100, (towerPlayerState.exp / (towerPlayerState.level * 100)) * 100)}%;"></div>
              </div>
              <span class="hero-exp-label">EXP: ${towerPlayerState.exp} / ${towerPlayerState.level * 100}</span>
            </div>
          </div>
        </div>

        <!-- 3 Core Stats HUD -->
        <div class="hero-stats-hud">
          <div class="stat-pill-box stat-atk">
            <i class="fa-solid fa-khanda"></i>
            <div class="stat-meta">
              <span class="stat-lbl">พลังโจมตี</span>
              <strong class="stat-val">${totalStats.atk}</strong>
            </div>
          </div>
          <div class="stat-pill-box stat-def">
            <i class="fa-solid fa-shield-heart"></i>
            <div class="stat-meta">
              <span class="stat-lbl">พลังป้องกัน</span>
              <strong class="stat-val">${totalStats.def}</strong>
            </div>
          </div>
          <div class="stat-pill-box stat-hp">
            <i class="fa-solid fa-heart-pulse"></i>
            <div class="stat-meta">
              <span class="stat-lbl">พลังชีวิต</span>
              <strong class="stat-val">${totalStats.currentHp} / ${totalStats.maxHp}</strong>
            </div>
          </div>
        </div>

        <!-- Equipped Gear Slots -->
        <div class="hero-gear-slots">
          <div class="gear-slot-item ${towerPlayerState.equipment.weapon ? 'equipped ' + towerPlayerState.equipment.weapon.rarity : 'empty'}" title="อาวุธ (เพิ่ม ATK)">
            <span class="slot-icon">${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.icon : '🗡️'}</span>
            <span class="slot-name">${towerPlayerState.equipment.weapon ? towerPlayerState.equipment.weapon.name.split(' ')[0] : 'ว่าง'}</span>
          </div>
          <div class="gear-slot-item ${towerPlayerState.equipment.armor ? 'equipped ' + towerPlayerState.equipment.armor.rarity : 'empty'}" title="ชุดเกราะ (เพิ่ม DEF)">
            <span class="slot-icon">${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.icon : '🛡️'}</span>
            <span class="slot-name">${towerPlayerState.equipment.armor ? towerPlayerState.equipment.armor.name.split(' ')[0] : 'ว่าง'}</span>
          </div>
          <div class="gear-slot-item ${towerPlayerState.equipment.relic ? 'equipped ' + towerPlayerState.equipment.relic.rarity : 'empty'}" title="เครื่องราง (เพิ่ม HP)">
            <span class="slot-icon">${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.icon : '💍'}</span>
            <span class="slot-name">${towerPlayerState.equipment.relic ? towerPlayerState.equipment.relic.name.split(' ')[0] : 'ว่าง'}</span>
          </div>
        </div>
      </div>

      <!-- Skills Collection Bar -->
      <div class="tower-skills-tray">
        <div class="skills-tray-title">
          <i class="fa-solid fa-wand-magic-sparkles" style="color:#fbbf24;"></i> คลังสกิลเวทมนตร์สะสม (${towerPlayerState.skills.length} สกิล):
        </div>
        <div class="skills-chips-list">
          ${towerPlayerState.skills.map(sId => {
            const skill = TOWER_ALL_SKILLS.find(s => s.id === sId) || { name: sId, icon: 'fa-star', desc: '', color: '#38bdf8' };
            return `
              <div class="skill-chip-tag" title="${skill.desc}">
                <i class="fa-solid ${skill.icon}" style="color:${skill.color};"></i>
                <span>${skill.name}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 10-Floor Vertical Tower Map -->
      <div class="tower-map-section">
        <div class="tower-map-header">
          <h2><i class="fa-solid fa-dungeon" style="color:#38bdf8;"></i> แผนที่หอคอยแห่งปัญญา 10 ชั้น (Tower Floors)</h2>
          <p>เคลียร์ภารกิจย่อยในแต่ละชั้นเพื่อปลดผนึกห้องบอส และร่วมมือกับเพื่อนในห้องเพื่อพิชิตบอสเรด!</p>
        </div>

        <div class="tower-floors-grid">
          ${TOWER_FLOORS_DATA.slice().reverse().map(floorData => {
            const isUnlocked = floorData.floor <= (towerPlayerState.highestClearedFloor + 1);
            const isCleared = floorData.floor <= towerPlayerState.highestClearedFloor;
            const subProgress = towerPlayerState.subQuestsProgress[floorData.floor] || { clearedRooms: [] };
            const subClearedCount = subProgress.clearedRooms.length;
            const isBossReady = subClearedCount >= floorData.subQuests.length;

            return `
              <div class="tower-floor-card ${isCleared ? 'cleared' : ''} ${isUnlocked ? 'unlocked' : 'locked'}">
                <div class="floor-badge-col">
                  <div class="floor-num-badge">F${floorData.floor}</div>
                  <span class="floor-level-limit">Cap Lv.${floorData.levelCap}</span>
                </div>

                <div class="floor-main-content">
                  <div class="floor-title-row">
                    <h3 class="floor-name-text">${floorData.name}</h3>
                    <div class="floor-status-badge ${isCleared ? 'status-cleared' : (isUnlocked ? 'status-active' : 'status-locked')}">
                      ${isCleared ? '<i class="fa-solid fa-circle-check"></i> พิชิตแล้ว' : (isUnlocked ? '<i class="fa-solid fa-unlock"></i> กำลังท้าทาย' : '<i class="fa-solid fa-lock"></i> ยังไม่ปลดล็อก')}
                    </div>
                  </div>
                  <div class="floor-theme-sub"><i class="fa-solid fa-brain"></i> ${floorData.theme}</div>

                  <!-- Sub-Quests Progress Indicator -->
                  <div class="floor-subquests-bar">
                    <span class="subquest-counter-text">
                      <i class="fa-solid fa-puzzle-piece"></i> ภารกิจย่อย: <strong>${subClearedCount}/${floorData.subQuests.length}</strong>
                    </span>
                    <div class="subquests-dots">
                      ${floorData.subQuests.map((sq, idx) => `
                        <span class="sq-dot ${subProgress.clearedRooms.includes(sq.id) ? 'done' : ''}" title="${sq.name}"></span>
                      `).join('')}
                    </div>
                  </div>
                </div>

                <div class="floor-boss-col">
                  <div class="floor-boss-avatar" title="${floorData.boss.name}">
                    <span class="boss-emoji">${floorData.boss.avatar}</span>
                    <span class="boss-lvl-tag">Lv.${floorData.boss.level}</span>
                  </div>
                </div>

                <div class="floor-actions-col">
                  ${isUnlocked ? `
                    <div class="floor-btn-group">
                      <button class="btn btn-sm btn-primary-gradient" onclick="openSubQuestsModal(${floorData.floor})">
                        <i class="fa-solid fa-list-check"></i> ภารกิจย่อย
                      </button>
                      <button class="btn btn-sm ${isBossReady ? 'btn-danger-glow' : 'btn-secondary-disabled'}" onclick="${isBossReady ? `openBossRaidModal(${floorData.floor})` : `showPopupInfo('ห้องบอสยังถูกผนึก', 'กรุณาเคลียร์ภารกิจย่อยในชั้นนี้ให้ครบ ${floorData.subQuests.length} ห้องก่อนครับ')`}">
                        <i class="fa-solid fa-skull"></i> ศึกบอส ${isBossReady ? '🔥' : '🔒'}
                      </button>
                    </div>
                  ` : `
                    <div class="locked-floor-hint">
                      <i class="fa-solid fa-lock"></i> พิชิตชั้น ${floorData.floor - 1} ก่อน
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

    </div>
  `;

  container.innerHTML = html;
}

/* -------------------------------------------------------------
   SUB-QUESTS / ROOMS MODAL & PUZZLE EXECUTION
------------------------------------------------------------- */
let activeSubQuestFloor = 1;
let activeSubQuestRoom = null;

function openSubQuestsModal(floorNum) {
  activeSubQuestFloor = floorNum;
  const floorData = TOWER_FLOORS_DATA.find(f => f.floor === floorNum);
  if (!floorData) return;

  const subProgress = towerPlayerState.subQuestsProgress[floorNum] || { clearedRooms: [] };

  const modalHtml = `
    <div class="modal-overlay active" id="modal-subquests">
      <div class="modal-container modal-tower-subquest">
        <div class="modal-header" style="background:linear-gradient(135deg, #0f172a, #1e293b); color:#fff; border-bottom:2px solid #38bdf8;">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:1.4rem;">🏰</span>
            <div>
              <h3 class="modal-title" style="color:#fff; margin:0; font-size:1.15rem;">ภารกิจย่อย: ${floorData.name}</h3>
              <span style="font-size:0.8rem; color:#94a3b8;">เคลียร์ห้องปริศนาเพื่อเก็บ EXP, สเตตัส, และลุ้นดรอปอุปกรณ์</span>
            </div>
          </div>
          <button class="btn-close-modal" onclick="closeModal('modal-subquests')"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding:20px; background:#f8fafc;">
          <div class="subquests-room-grid">
            ${floorData.subQuests.map((sq, idx) => {
              const isCleared = subProgress.clearedRooms.includes(sq.id);
              return `
                <div class="subquest-room-card ${isCleared ? 'cleared' : ''}">
                  <div class="room-card-header">
                    <div class="room-icon-box"><i class="fa-solid ${sq.icon}"></i></div>
                    <div class="room-title-box">
                      <h4>ห้องที่ ${idx + 1}: ${sq.name}</h4>
                      <span class="room-reward-tag">+${sq.rewardExp} EXP • สุ่มสเตตัส • ลุ้นดรอปอุปกรณ์</span>
                    </div>
                  </div>
                  <div class="room-card-footer">
                    ${isCleared ? `
                      <span class="room-cleared-badge"><i class="fa-solid fa-circle-check"></i> สำเร็จแล้ว (ฟาร์มซ้ำได้)</span>
                      <button class="btn btn-sm btn-outline-primary" onclick="startPuzzleChallenge(${floorNum}, '${sq.id}')">
                        <i class="fa-solid fa-rotate-right"></i> ท้าทายซ้ำ
                      </button>
                    ` : `
                      <button class="btn btn-sm btn-primary-gradient" onclick="startPuzzleChallenge(${floorNum}, '${sq.id}')" style="width:100%;">
                        <i class="fa-solid fa-play"></i> เริ่มไขปริศนาห้องนี้
                      </button>
                    `}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-subquests');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function startPuzzleChallenge(floorNum, subQuestId) {
  const bank = TOWER_PUZZLE_BANK[floorNum] || TOWER_PUZZLE_BANK[1];
  const puzzle = bank[Math.floor(Math.random() * bank.length)];

  const puzzleHtml = `
    <div class="modal-overlay active" id="modal-puzzle-challenge" style="z-index:10010;">
      <div class="modal-container modal-puzzle-box">
        <div class="modal-header" style="background:#0f172a; color:#fff; border-bottom:2px solid #2563eb;">
          <h3 class="modal-title" style="color:#fff; margin:0; font-size:1.1rem;"><i class="fa-solid fa-brain" style="color:#38bdf8;"></i> ปริศนาตรรกะชั้นที่ ${floorNum}</h3>
          <button class="btn-close-modal" onclick="closeModal('modal-puzzle-challenge')"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding:22px 20px;">
          <div class="puzzle-q-box">
            <span class="puzzle-badge">โจทย์ประจำห้อง</span>
            <h4 class="puzzle-question-text">${puzzle.q}</h4>
          </div>

          <div class="puzzle-options-list">
            ${puzzle.options.map((opt, idx) => `
              <button class="puzzle-opt-btn" onclick="submitPuzzleAnswer(${floorNum}, '${subQuestId}', ${idx}, ${puzzle.ans})">
                <span class="opt-letter">${String.fromCharCode(65 + idx)}</span>
                <span class="opt-text">${opt}</span>
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-puzzle-challenge');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', puzzleHtml);
}

function submitPuzzleAnswer(floorNum, subQuestId, chosenIdx, correctIdx) {
  closeModal('modal-puzzle-challenge');

  if (chosenIdx === correctIdx) {
    const floorData = TOWER_FLOORS_DATA.find(f => f.floor === floorNum);
    const sq = floorData.subQuests.find(s => s.id === subQuestId) || { rewardExp: 50 };
    
    const maxCap = towerPlayerState.levelCap;
    let leveledUp = false;
    let expGained = sq.rewardExp;

    if (towerPlayerState.level < maxCap) {
      towerPlayerState.exp += expGained;
      const expNeeded = towerPlayerState.level * 100;
      if (towerPlayerState.exp >= expNeeded) {
        towerPlayerState.exp -= expNeeded;
        towerPlayerState.level += 1;
        towerPlayerState.baseStats.atk += 3;
        towerPlayerState.baseStats.def += 2;
        towerPlayerState.baseStats.maxHp += 15;
        towerPlayerState.baseStats.currentHp = towerPlayerState.baseStats.maxHp;
        leveledUp = true;
      }
    }

    const statTypes = ['atk', 'def', 'maxHp'];
    const chosenStat = statTypes[Math.floor(Math.random() * statTypes.length)];
    let statBuffText = '';
    if (chosenStat === 'atk') {
      const val = Math.floor(Math.random() * 4) + 2;
      towerPlayerState.bonusStats.atk += val;
      statBuffText = `⚔️ ATK +${val}`;
    } else if (chosenStat === 'def') {
      const val = Math.floor(Math.random() * 3) + 1;
      towerPlayerState.bonusStats.def += val;
      statBuffText = `🛡️ DEF +${val}`;
    } else {
      const val = Math.floor(Math.random() * 20) + 10;
      towerPlayerState.bonusStats.maxHp += val;
      statBuffText = `❤️ Max HP +${val}`;
    }

    let lootDropped = null;
    if (Math.random() < 0.35) {
      const categories = ['weapons', 'armors', 'relics'];
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const items = TOWER_LOOT_TABLE[cat];
      lootDropped = items[Math.floor(Math.random() * items.length)];

      if (cat === 'weapons') towerPlayerState.equipment.weapon = lootDropped;
      if (cat === 'armors') towerPlayerState.equipment.armor = lootDropped;
      if (cat === 'relics') towerPlayerState.equipment.relic = lootDropped;
    }

    if (!towerPlayerState.subQuestsProgress[floorNum]) {
      towerPlayerState.subQuestsProgress[floorNum] = { clearedRooms: [] };
    }
    if (!towerPlayerState.subQuestsProgress[floorNum].clearedRooms.includes(subQuestId)) {
      towerPlayerState.subQuestsProgress[floorNum].clearedRooms.push(subQuestId);
    }

    saveStudentTowerProgress();
    renderTowerMainView();
    showSubQuestVictoryModal(expGained, statBuffText, lootDropped, leveledUp);

  } else {
    const damage = 20;
    towerPlayerState.baseStats.currentHp = Math.max(0, towerPlayerState.baseStats.currentHp - damage);

    if (towerPlayerState.baseStats.currentHp <= 0) {
      handlePlayerDeath('กับดักและมอนสเตอร์ในห้องปริศนา');
    } else {
      showPopupError('ตอบไม่ถูกต้อง!', `คุณได้รับความเสียหาย ${damage} HP จากกับดักเวทมนตร์ (เลือดคงเหลือ: ${towerPlayerState.baseStats.currentHp} HP)`);
      saveStudentTowerProgress();
      renderTowerMainView();
    }
  }
}

function showSubQuestVictoryModal(exp, statBuff, loot, leveledUp) {
  let lootHtml = '';
  if (loot) {
    lootHtml = `
      <div class="loot-drop-alert ${loot.rarity}">
        <span class="loot-icon">${loot.icon}</span>
        <div>
          <strong style="display:block; font-size:0.95rem;">ได้รับอุปกรณ์: ${loot.name}</strong>
          <span style="font-size:0.78rem; opacity:0.9;">ระดับ: ${loot.rarity.toUpperCase()} (สวมใส่อัตโนมัติเรียบร้อย)</span>
        </div>
      </div>
    `;
  }

  const html = `
    <div class="modal-overlay active" id="modal-subquest-win" style="z-index:10015;">
      <div class="modal-container" style="max-width:440px; text-align:center; padding:24px; border-radius:20px; background:#fff;">
        <div style="width:60px; height:60px; border-radius:50%; background:#ecfdf5; color:#10b981; font-size:1.8rem; display:inline-flex; align-items:center; justify-content:center; margin-bottom:12px;">
          <i class="fa-solid fa-trophy"></i>
        </div>
        <h3 style="margin:0 0 6px; color:#0f172a; font-weight:800; font-size:1.3rem;">ไขปริศนาสำเร็จ!</h3>
        ${leveledUp ? `<div class="level-up-banner">✨ LEVEL UP! เลเวลของคุณเพิ่มเป็น Lv. ${towerPlayerState.level} ✨</div>` : ''}
        <div class="reward-pills-row" style="display:flex; justify-content:center; gap:8px; margin:14px 0; flex-wrap:wrap;">
          <span class="reward-pill">+${exp} EXP</span>
          <span class="reward-pill stat-buff">${statBuff}</span>
        </div>
        ${lootHtml}
        <button class="btn btn-primary-gradient" onclick="closeModal('modal-subquest-win'); closeModal('modal-subquests');" style="width:100%; margin-top:16px; padding:10px;">
          <i class="fa-solid fa-check"></i> ตกลงและกลับสู่หอคอย
        </button>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-subquest-win');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', html);
}

/* -------------------------------------------------------------
   CLASSROOM CO-OP RAID BOSS BATTLE ENGINE (FIREBASE SYNC)
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
        
        <!-- Raid Arena Header -->
        <div class="raid-header-bar">
          <div class="raid-title-group">
            <span class="raid-tag">🔥 CLASSROOM CO-OP RAID BOSS</span>
            <h3 class="raid-boss-name">${floorData.boss.name} (Lv. ${floorData.boss.level})</h3>
          </div>
          <button class="btn-close-modal" onclick="leaveBossRaid()"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <!-- Boss Massive HP & Visual -->
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

        <!-- Live Combat Feed -->
        <div class="raid-combat-feed" id="raid-combat-feed">
          <div class="combat-feed-item">⚔️ การต่อสู้เริ่มขึ้นแล้ว! นักเรียนทุกคนช่วยกันตอบคำถามเพื่อสร้างดาเมจใส่บอส!</div>
        </div>

        <!-- Player Logic Combat Station -->
        <div class="raid-combat-station">
          <div class="raid-q-box">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
              <span class="q-badge"><i class="fa-solid fa-bolt"></i> โจมตีบอสด้วยปัญญา</span>
              <span class="player-stat-quick">⚔️ ATK ของคุณ: <strong>${totalStats.atk}</strong> | ❤️ HP: <strong>${totalStats.currentHp}</strong></span>
            </div>
            <h4 class="raid-q-text" id="raid-question-display">กำลังโหลดโจทย์ตรรกะ...</h4>
          </div>

          <div class="raid-options-grid" id="raid-options-container">
            <!-- Rendered choices -->
          </div>

          <!-- Skills Activation Bar -->
          <div class="raid-skills-bar">
            <span style="font-size:0.78rem; font-weight:700; color:#94a3b8; display:flex; align-items:center; gap:6px;">
              <i class="fa-solid fa-wand-magic-sparkles"></i> ร่ายสกิลพิเศษ:
            </span>
            <div class="raid-skill-buttons">
              ${towerPlayerState.skills.map(sId => {
                const skill = TOWER_ALL_SKILLS.find(s => s.id === sId) || { name: sId, icon: 'fa-star' };
                return `
                  <button class="btn-skill-cast" onclick="castSkillInRaid('${sId}')" title="${skill.name}">
                    <i class="fa-solid ${skill.icon}"></i> ${skill.name.split(' ')[0]}
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
    const baseDamage = totalStats.atk * 3 + Math.floor(Math.random() * 15);
    sendDamageToRaidBoss(baseDamage);
    generateNextRaidPuzzle();
  } else {
    const bossDmg = Math.max(10, (activeRaidBoss ? activeRaidBoss.atk : 20) - totalStats.def);
    towerPlayerState.baseStats.currentHp = Math.max(0, towerPlayerState.baseStats.currentHp - bossDmg);
    
    if (towerPlayerState.baseStats.currentHp <= 0) {
      leaveBossRaid();
      handlePlayerDeath(activeRaidBoss ? activeRaidBoss.name : 'บอสประจำชั้น');
    } else {
      showPopupError('ตอบผิดพลาด!', `บอสโจมตีสวนกลับ -${bossDmg} HP (เลือดของคุณคงเหลือ: ${towerPlayerState.baseStats.currentHp})`);
      generateNextRaidPuzzle();
    }
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
    showPopupSuccess('ร่ายสกิลสำเร็จ!', 'เนตรหยั่งรู้ตัดตัวเลือกที่ผิดทิ้ง 2 ตัวเลือก!');
  } else if (skillId === 'critical_mind') {
    const critDamage = totalStats.atk * 8;
    sendDamageToRaidBoss(critDamage);
    showPopupSuccess('CRITICAL HIT!', `ระเบิดปัญญาสร้างดาเมจรุนแรง -${critDamage} ดาเมจใส่บอส!`);
    generateNextRaidPuzzle();
  } else if (skillId === 'elixir_heal') {
    towerPlayerState.baseStats.currentHp = Math.min(totalStats.maxHp, towerPlayerState.baseStats.currentHp + Math.floor(totalStats.maxHp * 0.5));
    showPopupSuccess('ฟื้นฟูกายา!', `ฟื้นฟูเลือดสำเร็จ +${Math.floor(totalStats.maxHp * 0.5)} HP!`);
  } else {
    const spellDamage = totalStats.atk * 5;
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

/* -------------------------------------------------------------
   BOSS DEFEATED & REWARD UNLOCKS
------------------------------------------------------------- */
function handleBossDefeatedByClassroom(floorNum) {
  closeModal('modal-boss-raid');

  if (floorNum > towerPlayerState.highestClearedFloor) {
    towerPlayerState.highestClearedFloor = floorNum;
  }

  towerPlayerState.levelCap = calculateLevelCap(towerPlayerState.highestClearedFloor);

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
        <p class="victory-desc">ห้องเรียนของคุณได้ร่วมมือกันปราบบอสประจำชั้น และปลดล็อกประตูสู่หอคอยชั้นถัดไปเรียบร้อยแล้ว!</p>

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
          <i class="fa-solid fa-dungeon"></i> ไปยังชั้นถัดไป
        </button>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-boss-victory');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', html);
}

/* -------------------------------------------------------------
   ROGUELITE DEATH HANDLER
------------------------------------------------------------- */
function handlePlayerDeath(killerName) {
  towerPlayerState.bonusStats = { atk: 0, def: 0, maxHp: 0 };
  towerPlayerState.equipment = { weapon: null, armor: null, relic: null };
  towerPlayerState.baseStats.currentHp = towerPlayerState.baseStats.maxHp;

  saveStudentTowerProgress();
  renderTowerMainView();

  const html = `
    <div class="modal-overlay active" id="modal-player-death" style="z-index:10040;">
      <div class="modal-container modal-death-screen">
        <div class="death-skull-icon">💀</div>
        <h2 class="death-title">คุณถูกสังหารโดย ${killerName}</h2>
        <p class="death-desc">พลังชีวิตของคุณหมดลง สเตตัสเสริมและอุปกรณ์สวมใส่หลุดหายทั้งหมด</p>

        <div class="death-retention-box">
          <div class="retention-item kept"><i class="fa-solid fa-check"></i> ระดับเลเวลของคุณยังคงอยู่: <strong>Lv. ${towerPlayerState.level}</strong></div>
          <div class="retention-item kept"><i class="fa-solid fa-check"></i> คลังสกิลเวทมนตร์ทั้งหมดคงอยู่ถาวร: <strong>${towerPlayerState.skills.length} สกิล</strong></div>
          <div class="retention-item lost"><i class="fa-solid fa-xmark"></i> ค่าสเตตัสเสริมและอุปกรณ์สวมใส่ถูกรีเซ็ต</div>
        </div>

        <button class="btn btn-danger-large" onclick="closeModal('modal-player-death')" style="width:100%; margin-top:18px;">
          <i class="fa-solid fa-rotate-right"></i> ลุกขึ้นสู้ใหม่อีกครั้ง
        </button>
      </div>
    </div>
  `;

  const existing = document.getElementById('modal-player-death');
  if (existing) existing.remove();

  document.body.insertAdjacentHTML('beforeend', html);
}
