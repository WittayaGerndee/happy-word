/* ============================================================
   คลังคำศัพท์เสริม — ถอดจากโปสเตอร์ในโฟลเดอร์ uploads/
   (ผลไม้ / ผัก / ยานพาหนะ / ของใช้ในบ้าน) + สี + ตัวเลข
   ------------------------------------------------------------
   เลือกเฉพาะคำที่ "มี emoji ตรงตัว" เพราะ MVP ใช้ emoji เป็นภาพ
   (ตาม Concept v2: Emoji-first asset strategy)
   ถ้าวันหนึ่งมีภาพวาดจริง ให้เติม field `img` ในแต่ละคำได้เลย
   ============================================================ */

window.HWA_PACKS = {

  fruits: {
    id: 'fruits', titleEn: 'Fruits', titleTh: 'ผลไม้', emoji: '🍎',
    words: [
      { id:'apple',      english:'Apple',      thai:'แอปเปิล',   emoji:'🍎', color:'red'    },
      { id:'banana',     english:'Banana',     thai:'กล้วย',     emoji:'🍌', color:'yellow' },
      { id:'orange',     english:'Orange',     thai:'ส้ม',       emoji:'🍊', color:'orange' },
      { id:'grapes',     english:'Grapes',     thai:'องุ่น',      emoji:'🍇', color:'purple' },
      { id:'watermelon', english:'Watermelon', thai:'แตงโม',     emoji:'🍉', color:'green'  },
      { id:'strawberry', english:'Strawberry', thai:'สตรอว์เบอร์รี', emoji:'🍓', color:'red' },
      { id:'pineapple',  english:'Pineapple',  thai:'สับปะรด',    emoji:'🍍', color:'yellow' },
      { id:'mango',      english:'Mango',      thai:'มะม่วง',     emoji:'🥭', color:'yellow' },
      { id:'lemon',      english:'Lemon',      thai:'เลมอน',      emoji:'🍋', color:'yellow' },
      { id:'cherry',     english:'Cherry',     thai:'เชอร์รี',    emoji:'🍒', color:'red'    },
      { id:'peach',      english:'Peach',      thai:'ลูกพีช',     emoji:'🍑', color:'orange' },
      { id:'kiwi',       english:'Kiwi',       thai:'กีวี',       emoji:'🥝', color:'green'  },
      { id:'coconut',    english:'Coconut',    thai:'มะพร้าว',    emoji:'🥥', color:'brown'  },
      { id:'pear',       english:'Pear',       thai:'ลูกแพร์',    emoji:'🍐', color:'green'  },
      { id:'avocado',    english:'Avocado',    thai:'อะโวคาโด',   emoji:'🥑', color:'green'  },
      { id:'blueberry',  english:'Blueberry',  thai:'บลูเบอร์รี',  emoji:'🫐', color:'blue'   }
    ]
  },

  veggies: {
    id: 'veggies', titleEn: 'Vegetables', titleTh: 'ผัก', emoji: '🥕',
    words: [
      { id:'carrot',   english:'Carrot',   thai:'แครอท',      emoji:'🥕', color:'orange' },
      { id:'tomato',   english:'Tomato',   thai:'มะเขือเทศ',   emoji:'🍅', color:'red'    },
      { id:'corn',     english:'Corn',     thai:'ข้าวโพด',     emoji:'🌽', color:'yellow' },
      { id:'broccoli', english:'Broccoli', thai:'บรอกโคลี',    emoji:'🥦', color:'green'  },
      { id:'cucumber', english:'Cucumber', thai:'แตงกวา',      emoji:'🥒', color:'green'  },
      { id:'onion',    english:'Onion',    thai:'หัวหอม',      emoji:'🧅', color:'brown'  },
      { id:'garlic',   english:'Garlic',   thai:'กระเทียม',    emoji:'🧄', color:'white'  },
      { id:'potato',   english:'Potato',   thai:'มันฝรั่ง',    emoji:'🥔', color:'brown'  },
      { id:'chili',    english:'Chili',    thai:'พริก',        emoji:'🌶️', color:'red'    },
      { id:'eggplant', english:'Eggplant', thai:'มะเขือม่วง',  emoji:'🍆', color:'purple' },
      { id:'mushroom', english:'Mushroom', thai:'เห็ด',        emoji:'🍄', color:'brown'  },
      { id:'pumpkin',  english:'Pumpkin',  thai:'ฟักทอง',      emoji:'🎃', color:'orange' },
      { id:'lettuce',  english:'Lettuce',  thai:'ผักกาด',      emoji:'🥬', color:'green'  },
      { id:'pepper',   english:'Pepper',   thai:'พริกหวาน',    emoji:'🫑', color:'green'  }
    ]
  },

  vehicles: {
    id: 'vehicles', titleEn: 'Vehicles', titleTh: 'ยานพาหนะ', emoji: '🚗',
    words: [
      { id:'car',        english:'Car',        thai:'รถยนต์',      emoji:'🚗', color:'red'    },
      { id:'taxi',       english:'Taxi',       thai:'แท็กซี่',     emoji:'🚕', color:'yellow' },
      { id:'police',     english:'Police car', thai:'รถตำรวจ',     emoji:'🚓', color:'blue'   },
      { id:'ambulance',  english:'Ambulance',  thai:'รถพยาบาล',    emoji:'🚑', color:'white'  },
      { id:'firetruck',  english:'Fire truck', thai:'รถดับเพลิง',  emoji:'🚒', color:'red'    },
      { id:'bus',        english:'Bus',        thai:'รถบัส',       emoji:'🚌', color:'yellow' },
      { id:'truck',      english:'Truck',      thai:'รถบรรทุก',    emoji:'🚚', color:'white'  },
      { id:'tractor',    english:'Tractor',    thai:'รถแทรกเตอร์', emoji:'🚜', color:'green'  },
      { id:'bike',       english:'Bicycle',    thai:'จักรยาน',     emoji:'🚲', color:'blue'   },
      { id:'motorbike',  english:'Motorbike',  thai:'มอเตอร์ไซค์', emoji:'🏍️', color:'red'    },
      { id:'scooter',    english:'Scooter',    thai:'สกู๊ตเตอร์',  emoji:'🛵', color:'blue'   },
      { id:'helicopter', english:'Helicopter', thai:'เฮลิคอปเตอร์', emoji:'🚁', color:'red'   },
      { id:'airplane',   english:'Airplane',   thai:'เครื่องบิน',   emoji:'✈️', color:'white'  },
      { id:'rocket',     english:'Rocket',     thai:'จรวด',        emoji:'🚀', color:'white'  },
      { id:'ship',       english:'Ship',       thai:'เรือใหญ่',    emoji:'🚢', color:'blue'   },
      { id:'sailboat',   english:'Sailboat',   thai:'เรือใบ',      emoji:'⛵', color:'white'  },
      { id:'train',      english:'Train',      thai:'รถไฟ',        emoji:'🚂', color:'brown'  }
    ]
  },

  home: {
    id: 'home', titleEn: 'In My House', titleTh: 'ของใช้ในบ้าน', emoji: '🛋️',
    words: [
      { id:'sofa',       english:'Sofa',       thai:'โซฟา',       emoji:'🛋️', color:'brown'  },
      { id:'bed',        english:'Bed',        thai:'เตียง',      emoji:'🛏️', color:'brown'  },
      { id:'chair',      english:'Chair',      thai:'เก้าอี้',    emoji:'🪑', color:'brown'  },
      { id:'door',       english:'Door',       thai:'ประตู',      emoji:'🚪', color:'brown'  },
      { id:'window',     english:'Window',     thai:'หน้าต่าง',   emoji:'🪟', color:'blue'   },
      { id:'lamp',       english:'Lamp',       thai:'โคมไฟ',      emoji:'💡', color:'yellow' },
      { id:'tv',         english:'Television', thai:'โทรทัศน์',   emoji:'📺', color:'black'  },
      { id:'clock',      english:'Clock',      thai:'นาฬิกา',     emoji:'⏰', color:'red'    },
      { id:'teddy',      english:'Teddy bear', thai:'ตุ๊กตาหมี',  emoji:'🧸', color:'brown'  },
      { id:'broom',      english:'Broom',      thai:'ไม้กวาด',    emoji:'🧹', color:'brown'  },
      { id:'soap',       english:'Soap',       thai:'สบู่',       emoji:'🧼', color:'blue'   },
      { id:'toothbrush', english:'Toothbrush', thai:'แปรงสีฟัน',  emoji:'🪥', color:'blue'   },
      { id:'bathtub',    english:'Bathtub',    thai:'อ่างอาบน้ำ', emoji:'🛁', color:'white'  },
      { id:'spoon',      english:'Spoon',      thai:'ช้อน',       emoji:'🥄', color:'white'  },
      { id:'plate',      english:'Plate',      thai:'จาน',        emoji:'🍽️', color:'white'  },
      { id:'cup',        english:'Cup',        thai:'ถ้วย',       emoji:'☕', color:'brown'  },
      { id:'candle',     english:'Candle',     thai:'เทียน',      emoji:'🕯️', color:'yellow' },
      { id:'basket',     english:'Basket',     thai:'ตะกร้า',     emoji:'🧺', color:'brown'  }
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
  /* สัตว์จาก data/animals.js — เติมสีให้ด้วย เพื่อให้ใช้ในเกมสีได้ */
  var animalColor = { dog:'brown', cat:'orange', bird:'blue', fish:'orange', frog:'green',
                      monkey:'brown', rabbit:'white', tiger:'orange', lion:'yellow', elephant:'brown' };
  if (window.HWA_DATA && window.HWA_DATA.words) {
    window.HWA_DATA.words.forEach(function (w) {
      var c = {}; for (var f in w) c[f] = w[f];
      c.pack = 'animals';
      c.color = animalColor[w.id] || 'brown';
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
