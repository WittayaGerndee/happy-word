/* ============================================================
   🐶 จับคู่สัตว์ — ลากสัตว์ไปวางทับคู่ของมัน
   ทักษะ: การสังเกต + การควบคุมมือ
   ------------------------------------------------------------
   ต่างจากเกม "จับคู่ภาพสัตว์" (memory) ตรงที่เห็นภาพทั้งหมดตลอดเวลา
   เด็กเล็กจึงได้ฝึก "เทียบภาพ" ล้วน ๆ ไม่ต้องใช้ความจำ
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;

H.Screens.dragmatch = function (params) {
  var el = H.el;
  var n = Math.min(Math.max(params.n || 3, 2), 6);
  var picked = window.HWA_pickImg(n, ['animals', 'fruits', 'vehicles']);

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bubble', 'ลากไปวางให้ตรงคู่ของมันนะ!'));

  /* แถวบน = คู่ที่ต้องหา (สลับลำดับกับแถวล่าง) */
  var slotRow = el('div', 'g-row');
  slotRow.style.margin = '10px 0 4px';
  var slots = [];
  H.shuffle(picked).forEach(function (w) {
    var s = el('div', 'g-slot', H.face(w));
    s.style.opacity = '.55';
    s.dataset.id = w.id;
    s.word = w;
    s.setAttribute('aria-label', 'ช่องของ ' + w.english);
    slotRow.appendChild(s);
    slots.push(s);
  });
  wrap.appendChild(slotRow);

  wrap.appendChild(el('div', 'g-dots', ''));

  /* แถวล่าง = ตัวที่ลากได้ */
  var tray = el('div', 'g-row');
  tray.style.marginTop = '6px';
  wrap.appendChild(tray);
  H.app.appendChild(wrap);

  var left = picked.length;

  H.shuffle(picked).forEach(function (w) {
    var t = el('button', 'g-tile', H.face(w));
    t.setAttribute('aria-label', w.english);
    t.dataset.id = w.id;
    tray.appendChild(t);

    window.HWA_drag(t, {
      targets: function () {
        return slots.filter(function (s) { return s.dataset.filled !== '1'; });
      },
      onStart: function () { H.speak(w.english); },
      onTap: function () { H.sfx.pop(); H.speak(w.english); },
      onDrop: function (slot) {
        if (slot.dataset.id === w.id) {
          /* ถูกคู่ */
          slot.dataset.filled = '1';
          slot.classList.add('filled');
          slot.classList.remove('hot');
          slot.style.opacity = '1';
          t.dataset.locked = '1';
          t.classList.add('gone');
          H.sfx.yay();
          H.confettiFrom(slot, 26);
          H.setBubble('ใช่เลย! ' + w.english);
          H.speak(w.english);
          H.addStars(1);
          H.collect(w);
          H.later(function () { H.sfx.ting(); }, 200);
          H.announce('จับคู่ ' + w.english + ' ถูกแล้ว');
          left--;
          if (left === 0) H.later(finish, 900);
          return false;
        }
        /* ยังไม่ใช่คู่ — บอกชื่อช่องที่ไปวางเพื่อสอนคำศัพท์ไปในตัว */
        slot.classList.remove('hot');
        H.sfx.gentle();
        H.setBubble('อันนี้คือ ' + slot.word.english + ' นะ');
        H.speak(slot.word.english);
        return false;
      }
    });
  });

  function finish() {
    tray.style.opacity = '.5';
    H.bunnyEmote('excited');
    H.finishBox(wrap, {
      title: 'จับคู่ครบแล้ว!',
      sub: 'ครบ ' + n + ' คู่',
      next: n < 6 ? function () { H.go('dragmatch', { n: n + 1 }); } : null,
      nextLabel: '➕ ลองแบบยากขึ้น',
      again: function () { H.go('dragmatch', { n: n }); }
    });
  }
};
})();
