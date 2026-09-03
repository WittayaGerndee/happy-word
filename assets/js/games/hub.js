/* ============================================================
   หน้า "เลือกเกม" — ศูนย์รวมทุกเกม
   เพิ่มเกมใหม่: เติมหนึ่งบรรทัดใน LIST แล้วต่อ <script> ใน index.html
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;

var LIST = [
  { key:'dragmatch', icon:'🐶', name:'จับคู่สัตว์',        skill:'การสังเกต'      },
  { key:'colorgame', icon:'🎨', name:'สีอะไรเอ่ย',         skill:'เรียนรู้สี'      },
  { key:'countgame', icon:'🔢', name:'นับผลไม้',           skill:'การนับ 1–10'    },
  { key:'puzzle',    icon:'🧩', name:'ต่อภาพสัตว์',        skill:'คิดเชิงพื้นที่'  },
  { key:'maze',      icon:'🐰', name:'ช่วยกระต่ายกลับบ้าน', skill:'ควบคุมมือ'      },
  { key:'starcatch', icon:'⭐', name:'เก็บดาว',            skill:'สมาธิ'          },
  { key:'feedfish',  icon:'🐠', name:'ให้อาหารปลา',        skill:'การจำแนก'       },
  { key:'carpark',   icon:'🚗', name:'รถสีเดียวกัน',       skill:'สี + การลาก'    },
  { key:'missing',   icon:'🧠', name:'จำอะไรหายไป',        skill:'ความจำ'         },
  { key:'balloons',  icon:'🎈', name:'ลูกโป่งตัวเลข',      skill:'ตัวเลข'         },
  { key:'learn',     icon:'🎮', name:'ทายรูปสัตว์',        skill:'คำศัพท์'        },
  { key:'memory',    icon:'🃏', name:'จับคู่ภาพสัตว์',     skill:'ความจำ'         }
];

H.Screens.games = function () {
  var el = H.el;
  var wrap = el('div', 'games-wrap');
  wrap.appendChild(el('h2', 'title', '🎯 เลือกเกม'));
  wrap.appendChild(el('div', 'bubble', 'อยากเล่นอะไรดี?'));

  var grid = el('div', 'game-grid');
  LIST.forEach(function (g) {
    var c = el('button', 'game-card',
      '<span class="gc-icon">' + g.icon + '</span>' +
      '<span class="gc-name">' + g.name + '</span>' +
      '<span class="gc-skill">' + g.skill + '</span>');
    c.setAttribute('aria-label', g.name);
    c.addEventListener('click', function () {
      H.sfx.pop();
      if (H.Screens[g.key]) H.go(g.key);
      else H.setBubble('เกมนี้กำลังสร้างอยู่นะ');
    });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);
  H.app.appendChild(wrap);
};
})();
