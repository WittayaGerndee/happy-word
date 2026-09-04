/* ============================================================
   คลังคำศัพท์เสริม — ถอดจากโปสเตอร์ในโฟลเดอร์ uploads/
   (ผลไม้ / ผัก / ยานพาหนะ / ของใช้ในบ้าน) + สี + ตัวเลข
   ------------------------------------------------------------
   field `img` = ภาพจริงที่ตัดมาจากโปสเตอร์ อยู่ที่ assets/img/<img>.png
   ถ้าคำไหนไม่มี `img` ระบบจะใช้ emoji แทนโดยอัตโนมัติ
   field `color` = ใช้ในเกม "สีอะไรเอ่ย" และ "รถสีเดียวกัน"
                   คำที่สีไม่ชัด (ลายรุ้ง/หลายสี) จงใจไม่ใส่ color
   ============================================================ */

window.HWA_PACKS = {

  fruits: {
    id: 'fruits', titleEn: 'Fruits', titleTh: 'ผลไม้', emoji: '🍎',
    words: [
      { id:'apple',      english:'Apple',       thai:'แอปเปิล',      emoji:'🍎', img:'fruits/apple',       color:'red'    },
      { id:'banana',     english:'Banana',      thai:'กล้วย',        emoji:'🍌', img:'fruits/banana',      color:'yellow' },
      { id:'orange',     english:'Orange',      thai:'ส้ม',          emoji:'🍊', img:'fruits/orange',      color:'orange' },
      { id:'grapes',     english:'Grapes',      thai:'องุ่น',         emoji:'🍇', img:'fruits/grapes',      color:'purple' },
      { id:'watermelon', english:'Watermelon',  thai:'แตงโม',        emoji:'🍉', img:'fruits/watermelon',  color:'green'  },
      { id:'strawberry', english:'Strawberry',  thai:'สตรอว์เบอร์รี', emoji:'🍓', img:'fruits/strawberry',  color:'red'    },
      { id:'pineapple',  english:'Pineapple',   thai:'สับปะรด',       emoji:'🍍', img:'fruits/pineapple',   color:'yellow' },
      { id:'mango',      english:'Mango',       thai:'มะม่วง',        emoji:'🥭', img:'fruits/mango',       color:'yellow' },
      { id:'lemon',      english:'Lemon',       thai:'เลมอน',         emoji:'🍋', img:'fruits/lemon',       color:'yellow' },
      { id:'lime',       english:'Lime',        thai:'มะนาว',         emoji:'🍋', img:'fruits/lime',        color:'green'  },
      { id:'kiwi',       english:'Kiwi',        thai:'กีวี',          emoji:'🥝', img:'fruits/kiwi',        color:'green'  },
      { id:'coconut',    english:'Coconut',     thai:'มะพร้าว',       emoji:'🥥', img:'fruits/coconut',     color:'brown'  },
      { id:'avocado',    english:'Avocado',     thai:'อะโวคาโด',      emoji:'🥑', img:'fruits/avocado',     color:'green'  },
      { id:'blueberry',  english:'Blueberry',   thai:'บลูเบอร์รี',    emoji:'🫐', img:'fruits/blueberry',   color:'blue'   },
      { id:'peach',      english:'Peach',       thai:'ลูกพีช',        emoji:'🍑', img:'fruits/peach',       color:'pink'   },
      { id:'papaya',     english:'Papaya',      thai:'มะละกอ',        emoji:'🥭', img:'fruits/papaya',      color:'orange' },
      { id:'guava',      english:'Guava',       thai:'ฝรั่ง',         emoji:'🍈', img:'fruits/guava',       color:'green'  },
      { id:'durian',     english:'Durian',      thai:'ทุเรียน',       emoji:'🍈', img:'fruits/durian',      color:'green'  },
      { id:'rambutan',   english:'Rambutan',    thai:'เงาะ',          emoji:'🍒', img:'fruits/rambutan',    color:'red'    },
      { id:'mangosteen', english:'Mangosteen',  thai:'มังคุด',        emoji:'🍇', img:'fruits/mangosteen',  color:'purple' },
      { id:'longan',     english:'Longan',      thai:'ลำไย',          emoji:'🥔', img:'fruits/longan',      color:'brown'  },
      { id:'dragonfruit',english:'Dragon fruit',thai:'แก้วมังกร',      emoji:'🐉', img:'fruits/dragonfruit', color:'pink'   },
      { id:'lychee',     english:'Lychee',      thai:'ลิ้นจี่',       emoji:'🍒', img:'fruits/lychee',      color:'pink'   },
      { id:'roseapple',  english:'Rose apple',  thai:'ชมพู่',         emoji:'🍎', img:'fruits/roseapple',   color:'pink'   },
      { id:'pomelo',     english:'Pomelo',      thai:'ส้มโอ',         emoji:'🍈', img:'fruits/pomelo',      color:'green'  },
      { id:'melon',      english:'Melon',       thai:'เมลอน',         emoji:'🍈', img:'fruits/melon',       color:'green'  },
      { id:'persimmon',  english:'Persimmon',   thai:'ลูกพลับ',       emoji:'🍊', img:'fruits/persimmon',   color:'orange' },
      { id:'starfruit',  english:'Star fruit',  thai:'มะเฟือง',       emoji:'⭐', img:'fruits/starfruit',   color:'yellow' }
    ]
  },

  veggies: {
    id: 'veggies', titleEn: 'Vegetables', titleTh: 'ผัก', emoji: '🥕',
    words: [
      { id:'carrot',     english:'Carrot',      thai:'แครอท',        emoji:'🥕',                            color:'orange' },
      { id:'potato',     english:'Potato',      thai:'มันฝรั่ง',      emoji:'🥔',                            color:'brown'  },
      { id:'tomato',     english:'Tomato',      thai:'มะเขือเทศ',     emoji:'🍅', img:'veggies/tomato',      color:'red'    },
      { id:'corn',       english:'Corn',        thai:'ข้าวโพด',       emoji:'🌽', img:'veggies/corn',        color:'yellow' },
      { id:'broccoli',   english:'Broccoli',    thai:'บรอกโคลี',      emoji:'🥦', img:'veggies/broccoli',    color:'green'  },
      { id:'cucumber',   english:'Cucumber',    thai:'แตงกวา',        emoji:'🥒', img:'veggies/cucumber',    color:'green'  },
      { id:'onion',      english:'Onion',       thai:'หัวหอม',        emoji:'🧅', img:'veggies/onion',       color:'purple' },
      { id:'garlic',     english:'Garlic',      thai:'กระเทียม',      emoji:'🧄', img:'veggies/garlic',      color:'white'  },
      { id:'chili',      english:'Chili',       thai:'พริก',          emoji:'🌶️', img:'veggies/chili',       color:'red'    },
      { id:'eggplant',   english:'Eggplant',    thai:'มะเขือม่วง',    emoji:'🍆', img:'veggies/eggplant',    color:'purple' },
      { id:'mushroom',   english:'Mushroom',    thai:'เห็ด',          emoji:'🍄', img:'veggies/mushroom',    color:'brown'  },
      { id:'pumpkin',    english:'Pumpkin',     thai:'ฟักทอง',        emoji:'🎃', img:'veggies/pumpkin',     color:'orange' },
      { id:'pepper',     english:'Bell pepper', thai:'พริกหวาน',      emoji:'🫑', img:'veggies/pepper_green',color:'green'  },
      { id:'cabbage',    english:'Cabbage',     thai:'กะหล่ำปลี',     emoji:'🥬', img:'veggies/cabbage',     color:'green'  },
      { id:'redcabbage', english:'Red cabbage', thai:'กะหล่ำม่วง',    emoji:'🥬', img:'veggies/redcabbage',  color:'purple' },
      { id:'cauliflower',english:'Cauliflower', thai:'ดอกกะหล่ำ',     emoji:'🥦', img:'veggies/cauliflower', color:'white'  },
      { id:'spinach',    english:'Spinach',     thai:'ผักโขม',        emoji:'🥬', img:'veggies/spinach',     color:'green'  },
      { id:'napa',       english:'Chinese cabbage', thai:'ผักกาดขาว', emoji:'🥬', img:'veggies/napa',        color:'green'  },
      { id:'radish',     english:'Radish',      thai:'หัวไชเท้า',     emoji:'🥕', img:'veggies/radish',      color:'white'  },
      { id:'springonion',english:'Spring onion',thai:'ต้นหอม',        emoji:'🌿', img:'veggies/springonion', color:'green'  },
      { id:'celery',     english:'Celery',      thai:'ขึ้นฉ่าย',      emoji:'🌿', img:'veggies/celery',      color:'green'  },
      { id:'sweetpotato',english:'Sweet potato',thai:'มันเทศ',        emoji:'🍠', img:'veggies/sweetpotato', color:'orange' },
      { id:'ginger',     english:'Ginger',      thai:'ขิง',           emoji:'🫚', img:'veggies/ginger',      color:'brown'  },
      { id:'peas',       english:'Peas',        thai:'ถั่วลันเตา',    emoji:'🫛', img:'veggies/peas',        color:'green'  },
      { id:'zucchini',   english:'Zucchini',    thai:'ซูกินี',        emoji:'🥒', img:'veggies/zucchini',    color:'green'  }
    ]
  },

  vehicles: {
    id: 'vehicles', titleEn: 'Vehicles', titleTh: 'ยานพาหนะ', emoji: '🚗',
    words: [
      { id:'car',          english:'Car',          thai:'รถยนต์',        emoji:'🚗', img:'vehicles/car',          color:'red'    },
      { id:'taxi',         english:'Taxi',         thai:'แท็กซี่',       emoji:'🚕', img:'vehicles/taxi',         color:'yellow' },
      { id:'police',       english:'Police car',   thai:'รถตำรวจ',       emoji:'🚓', img:'vehicles/policecar',    color:'blue'   },
      { id:'ambulance',    english:'Ambulance',    thai:'รถพยาบาล',      emoji:'🚑', img:'vehicles/ambulance',    color:'white'  },
      { id:'firetruck',    english:'Fire truck',   thai:'รถดับเพลิง',    emoji:'🚒', img:'vehicles/firetruck',    color:'red'    },
      { id:'bus',          english:'Bus',          thai:'รถบัส',         emoji:'🚌', img:'vehicles/bus',          color:'green'  },
      { id:'schoolbus',    english:'School bus',   thai:'รถโรงเรียน',    emoji:'🚌', img:'vehicles/schoolbus',    color:'yellow' },
      { id:'van',          english:'Van',          thai:'รถตู้',         emoji:'🚐', img:'vehicles/van',          color:'white'  },
      { id:'pickup',       english:'Pickup truck', thai:'รถกระบะ',       emoji:'🛻', img:'vehicles/pickup',       color:'red'    },
      { id:'truck',        english:'Truck',        thai:'รถบรรทุก',      emoji:'🚚', img:'vehicles/truck',        color:'blue'   },
      { id:'dumptruck',    english:'Dump truck',   thai:'รถดัมพ์',       emoji:'🚛', img:'vehicles/dumptruck',    color:'yellow' },
      { id:'garbagetruck', english:'Garbage truck',thai:'รถขยะ',         emoji:'🚛', img:'vehicles/garbagetruck', color:'green'  },
      { id:'mixer',        english:'Cement mixer', thai:'รถโม่ปูน',      emoji:'🚛', img:'vehicles/mixer',        color:'orange' },
      { id:'tractor',      english:'Tractor',      thai:'รถแทรกเตอร์',   emoji:'🚜', img:'vehicles/tractor',      color:'green'  },
      { id:'excavator',    english:'Excavator',    thai:'รถแบ็คโฮ',      emoji:'🚜', img:'vehicles/excavator',    color:'yellow' },
      { id:'bulldozer',    english:'Bulldozer',    thai:'รถดันดิน',      emoji:'🚜', img:'vehicles/bulldozer',    color:'yellow' },
      { id:'bike',         english:'Bicycle',      thai:'จักรยาน',       emoji:'🚲', img:'vehicles/bicycle',      color:'blue'   },
      { id:'motorbike',    english:'Motorbike',    thai:'มอเตอร์ไซค์',   emoji:'🏍️', img:'vehicles/motorcycle',   color:'red'    },
      { id:'scooter',      english:'Scooter',      thai:'สกู๊ตเตอร์',    emoji:'🛵', img:'vehicles/scooter',      color:'yellow' },
      { id:'helicopter',   english:'Helicopter',   thai:'เฮลิคอปเตอร์',  emoji:'🚁', img:'vehicles/helicopter',   color:'red'    },
      { id:'airplane',     english:'Airplane',     thai:'เครื่องบิน',    emoji:'✈️', img:'vehicles/airplane',     color:'white'  },
      { id:'rocket',       english:'Rocket',       thai:'จรวด',          emoji:'🚀', img:'vehicles/rocket',       color:'white'  },
      { id:'balloon',      english:'Hot air balloon', thai:'บอลลูน',     emoji:'🎈', img:'vehicles/balloon'                      },
      { id:'ship',         english:'Ship',         thai:'เรือใหญ่',      emoji:'🚢', img:'vehicles/ship',         color:'white'  },
      { id:'sailboat',     english:'Sailboat',     thai:'เรือใบ',        emoji:'⛵', img:'vehicles/sailboat',     color:'blue'   },
      { id:'submarine',    english:'Submarine',    thai:'เรือดำน้ำ',     emoji:'🚤', img:'vehicles/submarine',    color:'yellow' },
      { id:'train',        english:'Train',        thai:'รถไฟ',          emoji:'🚂', img:'vehicles/train',        color:'black'  },
      { id:'bullettrain',  english:'Fast train',   thai:'รถไฟหัวจรวด',   emoji:'🚄', img:'vehicles/bullettrain',  color:'white'  },
      { id:'icecreamtruck',english:'Ice cream truck', thai:'รถไอศกรีม',  emoji:'🍦', img:'vehicles/icecreamtruck',color:'pink'   }
    ]
  },

  home: {
    id: 'home', titleEn: 'In My House', titleTh: 'ของใช้ในบ้าน', emoji: '🛋️',
    words: [
      { id:'tv',         english:'Television', thai:'โทรทัศน์',      emoji:'📺', img:'household/tv',          color:'black'  },
      { id:'clock',      english:'Clock',      thai:'นาฬิกา',        emoji:'⏰', img:'household/clock',       color:'red'    },
      { id:'soap',       english:'Soap',       thai:'สบู่',          emoji:'🧼', img:'household/soap',        color:'pink'   },
      { id:'plate',      english:'Plate',      thai:'จาน',           emoji:'🍽️', img:'household/plate',       color:'white'  },
      { id:'basket',     english:'Basket',     thai:'ตะกร้า',        emoji:'🧺', img:'household/basket',      color:'brown'  },
      { id:'candle',     english:'Candle',     thai:'เทียน',         emoji:'🕯️', img:'household/candle',      color:'white'  },
      { id:'microwave',  english:'Microwave',  thai:'ไมโครเวฟ',      emoji:'📦', img:'household/microwave',   color:'white'  },
      { id:'ricecooker', english:'Rice cooker',thai:'หม้อหุงข้าว',   emoji:'🍚', img:'household/ricecooker',  color:'white'  },
      { id:'kettle',     english:'Kettle',     thai:'กาต้มน้ำ',      emoji:'🫖', img:'household/kettle',      color:'black'  },
      { id:'stove',      english:'Stove',      thai:'เตาแก๊ส',       emoji:'🔥', img:'household/stove',       color:'white'  },
      { id:'pot',        english:'Pot',        thai:'หม้อ',          emoji:'🍲', img:'household/pot',         color:'red'    },
      { id:'blender',    english:'Blender',    thai:'เครื่องปั่น',   emoji:'🥤', img:'household/blender',     color:'pink'   },
      { id:'iron',       english:'Iron',       thai:'เตารีด',        emoji:'👕', img:'household/iron',        color:'blue'   },
      { id:'bucket',     english:'Bucket',     thai:'ถัง',           emoji:'🪣', img:'household/bucket',      color:'blue'   },
      { id:'mirror',     english:'Mirror',     thai:'กระจกเงา',      emoji:'🪞', img:'household/mirror',      color:'brown'  },
      { id:'vacuum',     english:'Vacuum',     thai:'เครื่องดูดฝุ่น', emoji:'🧹', img:'household/vacuum',      color:'red'    },
      { id:'towel',      english:'Towel',      thai:'ผ้าเช็ดตัว',    emoji:'🧻', img:'household/towel',       color:'yellow' },
      { id:'umbrella',   english:'Umbrella',   thai:'ร่ม',           emoji:'☂️', img:'household/umbrella'                    },
      { id:'wardrobe',   english:'Wardrobe',   thai:'ตู้เสื้อผ้า',   emoji:'🚪', img:'household/wardrobe',    color:'brown'  },
      { id:'bookshelf',  english:'Bookshelf',  thai:'ชั้นหนังสือ',   emoji:'📚', img:'household/bookshelf',   color:'brown'  },
      { id:'curtain',    english:'Curtain',    thai:'ผ้าม่าน',       emoji:'🪟', img:'household/curtain',     color:'blue'   },
      { id:'flowerpot',  english:'Flower pot', thai:'กระถางต้นไม้',  emoji:'🪴', img:'household/flowerpot',   color:'green'  },
      { id:'tissue',     english:'Tissue box', thai:'กล่องทิชชู',    emoji:'🧻', img:'household/tissue',      color:'blue'   },
      { id:'bin',        english:'Bin',        thai:'ถังขยะ',        emoji:'🗑️', img:'household/bin',         color:'blue'   },
      { id:'toothpaste', english:'Toothpaste', thai:'ยาสีฟัน',       emoji:'🪥', img:'household/toothpaste',  color:'red'    },
      { id:'sponge',     english:'Sponge',     thai:'ฟองน้ำ',        emoji:'🧽', img:'household/sponge',      color:'green'  },
      { id:'picture',    english:'Picture',    thai:'รูปภาพ',        emoji:'🖼️', img:'household/picture',     color:'brown'  },
      { id:'bed',        english:'Bed',        thai:'เตียง',         emoji:'🛏️',                              color:'brown'  },
      { id:'chair',      english:'Chair',      thai:'เก้าอี้',       emoji:'🪑',                              color:'brown'  },
      { id:'door',       english:'Door',       thai:'ประตู',         emoji:'🚪',                              color:'brown'  },
      { id:'teddy',      english:'Teddy bear', thai:'ตุ๊กตาหมี',     emoji:'🧸',                              color:'brown'  },
      { id:'spoon',      english:'Spoon',      thai:'ช้อน',          emoji:'🥄',                              color:'white'  },
      { id:'cup',        english:'Cup',        thai:'ถ้วย',          emoji:'☕',                              color:'brown'  }
    ]
  },

  /* ---------- สี ---------- */
  colors: [
    { id:'red',    english:'Red',    thai:'สีแดง',      hex:'#E8453C', dot:'🔴' },
    { id:'yellow', english:'Yellow', thai:'สีเหลือง',   hex:'#F5C518', dot:'🟡' },
    { id:'blue',   english:'Blue',   thai:'สีน้ำเงิน',  hex:'#2D7DD2', dot:'🔵' },
    { id:'green',  english:'Green',  thai:'สีเขียว',    hex:'#4CAF50', dot:'🟢' },
    { id:'orange', english:'Orange', thai:'สีส้ม',      hex:'#F28C28', dot:'🟠' },
    { id:'purple', english:'Purple', thai:'สีม่วง',     hex:'#8E5FD6', dot:'🟣' },
    { id:'brown',  english:'Brown',  thai:'สีน้ำตาล',   hex:'#8B5E3C', dot:'🟤' },
    { id:'white',  english:'White',  thai:'สีขาว',      hex:'#EFEFEF', dot:'⚪' },
    { id:'black',  english:'Black',  thai:'สีดำ',       hex:'#3A3A3A', dot:'⚫' },
    { id:'pink',   english:'Pink',   thai:'สีชมพู',     hex:'#F286B0', dot:'🌸' }
  ],

  /* ---------- ตัวเลข 1–10 ---------- */
  numbers: [
    { n:1,  english:'One',   thai:'หนึ่ง' },
    { n:2,  english:'Two',   thai:'สอง'  },
    { n:3,  english:'Three', thai:'สาม'  },
    { n:4,  english:'Four',  thai:'สี่'   },
    { n:5,  english:'Five',  thai:'ห้า'   },
    { n:6,  english:'Six',   thai:'หก'   },
    { n:7,  english:'Seven', thai:'เจ็ด'  },
    { n:8,  english:'Eight', thai:'แปด'  },
    { n:9,  english:'Nine',  thai:'เก้า'  },
    { n:10, english:'Ten',   thai:'สิบ'   }
  ]
};

/* รวมทุกหมวดเป็นกองเดียว — เกมหลายเกมสุ่มจากตรงนี้ */
window.HWA_ALL = (function () {
  var PK = window.HWA_PACKS;
  var out = [];
  ['fruits', 'veggies', 'vehicles', 'home'].forEach(function (k) {
    PK[k].words.forEach(function (w) {
      var c = {}; for (var f in w) c[f] = w[f];
      c.pack = k;
      out.push(c);
    });
  });
  /* สัตว์จาก data/animals.js — ตอนนี้ animals.js ใส่ img/color มาเองแล้ว */
  if (window.HWA_DATA && window.HWA_DATA.words) {
    window.HWA_DATA.words.forEach(function (w) {
      var c = {}; for (var f in w) c[f] = w[f];
      c.pack = 'animals';
      out.push(c);
    });
  }
  return out;
})();

/* หยิบคำจากหมวดที่ต้องการ (หรือทุกหมวด) แบบสุ่มไม่ซ้ำ */
window.HWA_pick = function (n, packs) {
  var pool = window.HWA_ALL.filter(function (w) {
    return !packs || packs.indexOf(w.pack) >= 0;
  }).slice();
  var out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  }
  return out;
};

/* เฉพาะคำที่มีภาพจริง — เกมที่ต้องพึ่งภาพ (ต่อภาพ/จับคู่) ใช้ตัวนี้ */
window.HWA_pickImg = function (n, packs) {
  var pool = window.HWA_ALL.filter(function (w) {
    return w.img && (!packs || packs.indexOf(w.pack) >= 0);
  }).slice();
  var out = [];
  while (out.length < n && pool.length) {
    out.push(pool.splice((Math.random() * pool.length) | 0, 1)[0]);
  }
  return out;
};
