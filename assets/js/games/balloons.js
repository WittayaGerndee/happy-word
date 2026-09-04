/* ============================================================
   🎈 ลูกโป่งตัวเลข — กดลูกโป่งตามลำดับ 1 → 2 → 3 → 4 → 5
   ทักษะ: ลำดับตัวเลข + สมาธิ
   No-Fail: กดผิดลำดับ ลูกโป่งแค่สั่นเบา ๆ แล้ว Bunny บอกว่าต่อไปคือเลขอะไร
   ============================================================ */
(function () {
'use strict';
var H = window.HWA, PK = window.HWA_PACKS;
var COLORS = ['#E8453C', '#F5C518', '#2D7DD2', '#4CAF50', '#F28C28',
              '#8E5FD6', '#F286B0', '#37BFA7', '#FF8A7A', '#6FD3F0'];

H.Screens.balloons = function (params) {
  var el = H.el;
  var max = Math.min(Math.max(params.max || 5, 3), 10);

  var wrap = el('div', 'g-wrap');

  var prompt = el('div', 'g-prompt');
  var label = el('span', '', 'กดเลข 1 ก่อนนะ');
  prompt.appendChild(label);
  var say = el('button', 'g-say', '🔊');
  say.setAttribute('aria-label', 'ฟังอีกครั้ง');
  say.addEventListener('click', function () { H.sfx.pop(); H.speak(PK.numbers[next - 1].english); });
  prompt.appendChild(say);
  wrap.appendChild(prompt);

  var bar = el('div', 'g-dots');
  for (var i = 0; i < max; i++) bar.appendChild(el('div', 'd'));
  wrap.appendChild(bar);

  var stage = el('div', 'g-stage');
  wrap.appendChild(stage);
  H.app.appendChild(wrap);

  var next = 1, misses = 0, ended = false;
  var nodes = {};

  /* วางลูกโป่งแบบกริดหลวม ๆ + สุ่มเยื้องนิดหน่อย จะได้ไม่ทับกัน */
  var order = H.shuffle((function () {
    var a = []; for (var k = 1; k <= max; k++) a.push(k); return a;
  })());
  var cols = max <= 4 ? 2 : (max <= 6 ? 3 : 4);
  var rows = Math.ceil(max / cols);

  H.later(function () { layout(); }, 30);

  function layout() {
    var W = stage.clientWidth, Hh = stage.clientHeight;
    var cw = W / cols, ch = Hh / rows;
    order.forEach(function (n, idx) {
      var b = el('button', 'g-float wiggleY',
        '<span class="balloon">' + n + '<span class="shine"></span></span>');
      b.setAttribute('aria-label', 'ลูกโป่งเลข ' + n);
      b.querySelector('.balloon').style.setProperty('--bcol', COLORS[(n - 1) % COLORS.length]);
      var r = Math.floor(idx / cols), c = idx % cols;
      b.style.left = Math.max(2, c * cw + cw / 2 - 54 + H.rnd(-14, 14)) + 'px';
      b.style.top  = Math.max(2, r * ch + ch / 2 - 54 + H.rnd(-12, 12)) + 'px';
      b.style.animationDelay = (Math.random() * 2.5) + 's';
      b.addEventListener('click', function () { tap(n, b); });
      nodes[n] = b;
      stage.appendChild(b);
    });
    H.speak('One', { rate: 0.85 });
  }

  function tap(n, node) {
    if (ended || node.dataset.done === '1') return;

    if (n !== next) {
      misses++;
      H.sfx.gentle();
      node.classList.remove('soft'); void node.offsetWidth; node.classList.add('soft');
      H.setBubble('ต่อไปคือเลข ' + next + ' นะ');
      H.speak(PK.numbers[next - 1].english, { rate: 0.8 });
      /* ผิดครบ 2 ครั้งในเลขเดียวกัน → ชี้ให้เลย */
      if (misses >= 2 && nodes[next]) nodes[next].classList.add('point');
      return;
    }

    misses = 0;
    node.dataset.done = '1';
    node.classList.remove('point');
    H.sfx.ting();
    H.confettiFrom(node, 22);
    node.classList.add('popped');
    H.speak(PK.numbers[n - 1].english, { rate: 0.9 });

    var dots = bar.querySelectorAll('.d');
    if (dots[n - 1]) dots[n - 1].classList.add('done');
    H.addStars(1);
    H.announce('กดเลข ' + n + ' แล้ว');

    next++;
    if (next > max) { H.later(finish, 700); return; }
    label.textContent = 'ต่อไปเลข ' + next;
    if (nodes[next]) nodes[next].classList.remove('point');
  }

  function finish() {
    ended = true;
    Object.keys(nodes).forEach(function (k) { nodes[k].remove(); });
    H.bunnyEmote('excited');
    var prize = H.surprise ? H.surprise() : null;
    H.finishBox(wrap, {
      title: 'นับ 1 ถึง ' + max + ' ได้แล้ว!',
      sub: prize ? ('ได้ ' + prize.emoji + ' ' + prize.english + ' เข้าคลังด้วย!') : 'เรียงตัวเลขถูกทุกอัน',
      next: max < 10 ? function () { H.go('balloons', { max: max + 1 }); } : null,
      nextLabel: '➕ เพิ่มเป็น ' + (max + 1),
      again: function () { H.go('balloons', { max: max }); }
    });
  }
};
})();
