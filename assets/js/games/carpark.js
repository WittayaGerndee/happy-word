/* ============================================================
   🚗 รถสีเดียวกัน — ลากรถไปจอดในช่องที่สีเดียวกัน
   ทักษะ: สี + การลาก (กล้ามเนื้อมัดเล็ก)
   ============================================================ */
(function () {
'use strict';
var H = window.HWA, PK = window.HWA_PACKS;
var CARS = ['🚗', '🚙', '🚕', '🚌', '🚚', '🏎️'];

H.Screens.carpark = function (params) {
  var el = H.el;
  var n = Math.min(Math.max(params.n || 3, 2), 5);

  var palette = H.shuffle(PK.colors.filter(function (c) {
    return ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'pink'].indexOf(c.id) >= 0;
  })).slice(0, n);
  var shapes = H.shuffle(CARS).slice(0, n);

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bubble', 'จอดรถในช่องสีเดียวกันนะ!'));

  /* ---- ช่องจอด ---- */
  var lot = el('div', 'park-lot');
  lot.style.margin = '12px 0';
  var slots = [];
  H.shuffle(palette).forEach(function (c) {
    var s = el('div', 'park-slot');
    s.style.borderColor = c.hex;
    s.style.background = 'rgba(255,255,255,.45)';
    s.dataset.color = c.id;
    s.color = c;
    s.setAttribute('aria-label', 'ช่องจอดสี' + c.thai);
    lot.appendChild(s);
    slots.push(s);
  });
  wrap.appendChild(lot);

  wrap.appendChild(el('div', 'g-dots', ''));

  /* ---- รถ ---- */
  var tray = el('div', 'g-row');
  wrap.appendChild(tray);
  H.app.appendChild(wrap);

  var left = n;

  H.shuffle(palette).forEach(function (c, idx) {
    var car = el('button', 'g-tile tinted', shapes[idx]);
    car.style.setProperty('--tint', c.hex);
    car.dataset.color = c.id;
    car.setAttribute('aria-label', 'รถสี' + c.thai);
    tray.appendChild(car);

    window.HWA_drag(car, {
      targets: function () {
        return slots.filter(function (s) { return s.dataset.filled !== '1'; });
      },
      onStart: function () { H.speak(c.english); },
      onTap: function () { H.sfx.pop(); H.speak(c.english + ' car.', { rate: 0.8 }); },
      onDrop: function (slot) {
        slot.classList.remove('hot');
        if (slot.dataset.color === c.id) {
          slot.dataset.filled = '1';
          slot.classList.add('filled');
          slot.style.background = c.hex;
          slot.textContent = shapes[idx];
          car.dataset.locked = '1';
          car.classList.add('gone');
          H.sfx.yay();
          H.confettiFrom(slot, 26);
          H.setBubble('จอดถูกช่อง! ' + c.english);
          H.speak(c.english);
          H.addStars(1);
          H.later(function () { H.sfx.ting(); }, 200);
          H.announce('จอดรถสี' + c.thai + 'ถูกช่อง');
          left--;
          if (left === 0) H.later(finish, 900);
          return false;
        }
        H.sfx.gentle();
        H.setBubble('ช่องนี้สี' + slot.color.thai + 'นะ');
        H.speak(slot.color.english);
        return false;
      }
    });
  });

  function finish() {
    tray.style.opacity = '.5';
    H.bunnyEmote('excited');
    H.finishBox(wrap, {
      title: 'จอดครบทุกคันแล้ว!',
      sub: 'จับคู่สีได้ ' + n + ' คัน',
      next: n < 5 ? function () { H.go('carpark', { n: n + 1 }); } : null,
      nextLabel: '➕ เพิ่มรถอีกคัน',
      again: function () { H.go('carpark', { n: n }); }
    });
  }
};
})();
