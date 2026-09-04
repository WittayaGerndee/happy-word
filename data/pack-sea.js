/* ============================================================
   หมวดสัตว์ทะเล — แยกไฟล์ไว้ต่างหากโดยตั้งใจ
   ------------------------------------------------------------
   ทำไมไม่ใส่รวมใน packs.js?
   เพราะ packs.js ถูกเขียนทับบ่อยเวลาเพิ่มภาพ/เพิ่มคำเป็นชุดใหญ่
   แยกไฟล์แล้วหมวดนี้จะไม่หายไปพร้อมกับการรีเจนไฟล์นั้น
   ไฟล์นี้ลงทะเบียนตัวเองเข้า HWA_PACKS และต่อท้าย HWA_ALL ให้เอง
   ============================================================ */
(function () {
  if (!window.HWA_PACKS) return;

  var sea = {
    id: 'sea', titleEn: 'Sea Animals', titleTh: 'สัตว์ทะเล', emoji: '🐠',
    words: [
      { id:'angelfish',  english:'Angelfish',  thai:'ปลาเทวดา',    emoji:'🐠', img:'animals/angelfish',  color:'yellow' },
      { id:'bluefish',   english:'Blue fish',  thai:'ปลาสีฟ้า',    emoji:'🐟', img:'animals/bluefish',   color:'blue'   },
      { id:'pufferfish', english:'Pufferfish', thai:'ปลาปักเป้า',  emoji:'🐡', img:'animals/pufferfish', color:'orange' },
      { id:'seahorse',   english:'Seahorse',   thai:'ม้าน้ำ',      emoji:'🐴', img:'animals/seahorse',   color:'yellow' },
      { id:'jellyfish',  english:'Jellyfish',  thai:'แมงกะพรุน',   emoji:'🪼', img:'animals/jellyfish',  color:'purple' },
      { id:'crab',       english:'Crab',       thai:'ปู',          emoji:'🦀', img:'animals/crab',       color:'red'    },
      { id:'shrimp',     english:'Shrimp',     thai:'กุ้ง',        emoji:'🦐', img:'animals/shrimp',     color:'orange' },
      { id:'stingray',   english:'Stingray',   thai:'ปลากระเบน',   emoji:'🐟', img:'animals/stingray',   color:'brown'  },
      { id:'dolphin',    english:'Dolphin',    thai:'โลมา',        emoji:'🐬', img:'animals/dolphin',    color:'blue'   },
      { id:'whale',      english:'Whale',      thai:'วาฬ',         emoji:'🐳', img:'animals/whale',      color:'blue'   },
      { id:'orca',       english:'Orca',       thai:'วาฬเพชฌฆาต',  emoji:'🐋', img:'animals/orca',       color:'black'  },
      { id:'shark',      english:'Shark',      thai:'ฉลาม',        emoji:'🦈', img:'animals/shark',      color:'blue'   },
      { id:'seal',       english:'Seal',       thai:'แมวน้ำ',      emoji:'🦭', img:'animals/seal',       color:'brown'  },
      { id:'seaturtle',  english:'Sea turtle', thai:'เต่าทะเล',    emoji:'🐢', img:'animals/turtle',     color:'green'  }
    ]
  };

  window.HWA_PACKS.sea = sea;

  /* ต่อท้ายกองรวม เพื่อให้ทุกเกมสุ่มเจอหมวดนี้ด้วย */
  if (window.HWA_ALL) {
    sea.words.forEach(function (w) {
      if (window.HWA_ALL.some(function (x) { return x.id === w.id; })) return;
      var c = {}; for (var f in w) c[f] = w[f];
      c.pack = 'sea';
      window.HWA_ALL.push(c);
    });
  }
})();
