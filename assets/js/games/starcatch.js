/* ============================================================
   ⭐ เก็บดาว — ดาวโผล่ขึ้นมาเรื่อย ๆ ให้เด็กแตะเก็บ
   ทักษะ: สมาธิ + การตอบสนอง
   ------------------------------------------------------------
   ไม่มีนาฬิกาจับเวลา ไม่มีดาวหลุดแล้วโดนหัก (Concept v2 ห้าม timer)
   ดาวที่ไม่ถูกแตะจะย้ายที่เองเงียบ ๆ เด็กจึงไม่รู้สึกว่า "พลาด"
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;

H.Screens.starcatch = function (params) {
  var el = H.el;
  var goal = Math.min(params.goal || 10, 20);
  var onScreen = Math.min(2 + Math.floor(goal / 6), 4);   /* ดาวพร้อมกันกี่ดวง */

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bubble', 'แตะดาวให้ครบ ' + goal + ' ดวงนะ!'));

  var bar = el('div', 'g-dots');
  for (var i = 0; i < goal; i++) bar.appendChild(el('div', 'd'));
  wrap.appendChild(bar);

  var stage = el('div', 'g-stage');
  wrap.appendChild(stage);
  H.app.appendChild(wrap);

  var got = 0, ended = false, live = [];

  function place(node) {
    var w = stage.clientWidth, h = stage.clientHeight;
    node.style.left = H.rnd(4, Math.max(6, w - 118)) + 'px';
    node.style.top  = H.rnd(4, Math.max(6, h - 118)) + 'px';
  }

  function spawn() {
    if (ended) return;
    var s = el('button', 'g-float wiggleY', '⭐');
    s.setAttribute('aria-label', 'ดาว');
    place(s);
    s.style.animationDelay = (Math.random() * 2) + 's';
    stage.appendChild(s);
    live.push(s);

    /* ไม่ถูกแตะ = ย้ายที่เอง ไม่ใช่หายไปเฉย ๆ เพื่อไม่ให้เด็กรู้สึกพลาด */
    var wander = setInterval(function () {
      if (ended || !s.isConnected) { clearInterval(wander); return; }
      s.style.transition = 'left 1.6s ease-in-out, top 1.6s ease-in-out';
      place(s);
    }, 3200);

    s.addEventListener('click', function () {
      if (ended || s.dataset.done === '1') return;
      s.dataset.done = '1';
      clearInterval(wander);
      H.sfx.ting();
      H.confettiFrom(s, 18);
      s.classList.add('popped');
      setTimeout(function () { s.remove(); }, 460);

      got++;
      var dots = bar.querySelectorAll('.d');
      if (dots[got - 1]) dots[got - 1].classList.add('done');
      H.addStars(1);
      H.announce('เก็บดาวได้ ' + got + ' ดวง');

      if (got % 3 === 0 && got < goal) H.setBubble(H.bunnySay('correct'));
      if (got >= goal) { finish(); return; }
      H.later(spawn, 320);
    });
  }

  for (var k = 0; k < onScreen; k++) H.later(spawn, k * 420);

  function finish() {
    ended = true;
    live.forEach(function (n) { if (n.isConnected) n.remove(); });
    H.bunnyEmote('excited');
    H.finishBox(wrap, {
      title: 'เก็บครบแล้ว!',
      sub: 'ได้ดาว ' + goal + ' ดวง',
      next: goal < 20 ? function () { H.go('starcatch', { goal: goal + 5 }); } : null,
      nextLabel: '➕ ลองเก็บให้มากขึ้น',
      again: function () { H.go('starcatch', { goal: goal }); }
    });
  }
};
})();
