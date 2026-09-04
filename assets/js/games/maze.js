/* ============================================================
   🐰 ช่วยกระต่ายกลับบ้าน — ลากกระต่ายผ่านทางเดินไปถึงบ้าน
   ทักษะ: การควบคุมมือ (กล้ามเนื้อมัดเล็ก) + การวางแผนเส้นทาง
   ------------------------------------------------------------
   เขาวงกตเป็น "ทางเดินงู" ที่สร้างจากสูตร จึงไม่มีทางตัน
   เด็ก 4 ขวบจะไม่หลงและไม่ต้องแก้ปริศนา แค่ลากตามทางให้ได้
   เดินได้ทั้งลากนิ้ว และแตะช่องข้าง ๆ เพื่อให้กระต่ายกระโดดไป
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;
var SIZES = [5, 7, 9];

function buildMaze(N) {
  var g = [], r, c;
  for (r = 0; r < N; r++) { g[r] = []; for (c = 0; c < N; c++) g[r][c] = 1; }
  for (r = 0; r < N; r += 2) for (c = 0; c < N; c++) g[r][c] = 0;   /* แถวคู่ = ทางเดิน */
  for (r = 1; r < N; r += 2) {
    var side = (((r - 1) / 2) % 2 === 0) ? (N - 1) : 0;              /* ช่องต่อสลับซ้าย-ขวา */
    g[r][side] = 0;
  }
  var lastLink = (((N - 2 - 1) / 2) % 2 === 0) ? (N - 1) : 0;
  return { g: g, start: [0, 0], goal: [N - 1, lastLink === 0 ? N - 1 : 0] };
}

H.Screens.maze = function (params) {
  var el = H.el;
  var lv = Math.min(params.lv || 0, SIZES.length - 1);
  var N = SIZES[lv];
  var M = buildMaze(N);
  var g = M.g;

  var avail = Math.min(window.innerWidth - 48, window.innerHeight - 300);
  var cell = Math.max(34, Math.floor(avail / N));
  var size = cell * N;

  var wrap = el('div', 'g-wrap');
  wrap.appendChild(el('div', 'bubble', 'ลากกระต่ายไปหาบ้านนะ! 🏠'));

  var board = el('div', 'maze-board');
  board.style.width = size + 'px';
  board.style.height = size + 'px';
  wrap.appendChild(board);
  H.app.appendChild(wrap);

  /* กำแพง */
  for (var r = 0; r < N; r++) {
    for (var c = 0; c < N; c++) {
      if (g[r][c] === 1) {
        var w = el('div', 'maze-wall');
        w.style.width = cell + 'px'; w.style.height = cell + 'px';
        w.style.left = (c * cell) + 'px'; w.style.top = (r * cell) + 'px';
        board.appendChild(w);
      }
    }
  }

  /* แครอทระหว่างทาง — เก็บได้ดาว */
  var carrots = {};
  var openCells = [];
  for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (!g[r][c]) openCells.push([r, c]);
  H.shuffle(openCells).filter(function (p) {
    return !(p[0] === M.start[0] && p[1] === M.start[1]) &&
           !(p[0] === M.goal[0] && p[1] === M.goal[1]);
  }).slice(0, 3).forEach(function (p) {
    var k = p[0] + '-' + p[1];
    var n = el('div', 'maze-carrot', '🥕');
    n.style.left = (p[1] * cell + cell * 0.28) + 'px';
    n.style.top  = (p[0] * cell + cell * 0.22) + 'px';
    n.style.fontSize = Math.floor(cell * 0.5) + 'px';
    board.appendChild(n);
    carrots[k] = n;
  });

  var goal = el('div', 'maze-goal', '🏠');
  goal.style.width = cell + 'px'; goal.style.height = cell + 'px';
  goal.style.left = (M.goal[1] * cell) + 'px';
  goal.style.top  = (M.goal[0] * cell) + 'px';
  goal.style.fontSize = Math.floor(cell * 0.72) + 'px';
  board.appendChild(goal);

  var hero = el('div', 'maze-hero', '🐰');
  hero.style.width = cell + 'px'; hero.style.height = cell + 'px';
  hero.style.fontSize = Math.floor(cell * 0.72) + 'px';
  hero.setAttribute('role', 'img');
  hero.setAttribute('aria-label', 'กระต่าย');
  board.appendChild(hero);

  var pos = [M.start[0], M.start[1]];
  var won = false;
  draw();

  function draw() {
    hero.style.left = (pos[1] * cell) + 'px';
    hero.style.top  = (pos[0] * cell) + 'px';
  }

  function open(r, c) { return r >= 0 && c >= 0 && r < N && c < N && g[r][c] === 0; }

  function moveTo(r, c) {
    if (won) return;
    if (!open(r, c)) return;
    if (Math.abs(r - pos[0]) + Math.abs(c - pos[1]) !== 1) return;   /* ทีละช่องเท่านั้น */
    pos = [r, c];
    draw();
    H.sfx.pop();

    var k = r + '-' + c;
    if (carrots[k]) {
      carrots[k].classList.add('eaten');
      var nn = carrots[k]; delete carrots[k];
      setTimeout(function () { nn.remove(); }, 400);
      H.sfx.ting();
      H.addStars(1);
      H.setBubble('อร่อยจัง! Carrot');
      H.speak('Carrot');
      var carrotWord = window.HWA_PACKS.veggies.words.filter(function (x) { return x.id === 'carrot'; })[0];
      if (carrotWord) H.collect(carrotWord);
    }
    if (r === M.goal[0] && c === M.goal[1]) win();
  }

  function cellFrom(clientX, clientY) {
    var b = board.getBoundingClientRect();
    return [Math.floor((clientY - b.top) / cell), Math.floor((clientX - b.left) / cell)];
  }

  /* ลากนิ้ว — เดินตามทีละช่อง */
  var dragging = false, pid = null;
  hero.addEventListener('pointerdown', function (e) {
    dragging = true; pid = e.pointerId;
    hero.classList.add('dragging');
    try { hero.setPointerCapture(pid); } catch (err) {}
    e.preventDefault();
  });
  hero.addEventListener('pointermove', function (e) {
    if (!dragging || e.pointerId !== pid) return;
    var p = cellFrom(e.clientX, e.clientY);
    if (p[0] === pos[0] && p[1] === pos[1]) return;
    /* เดินเข้าหาปลายนิ้วทีละก้าว จะได้ไม่ทะลุกำแพงเวลาลากเร็ว */
    for (var step = 0; step < 3; step++) {
      var dr = p[0] - pos[0], dc = p[1] - pos[1];
      if (!dr && !dc) break;
      if (Math.abs(dr) >= Math.abs(dc)) moveTo(pos[0] + (dr > 0 ? 1 : -1), pos[1]);
      else moveTo(pos[0], pos[1] + (dc > 0 ? 1 : -1));
    }
    e.preventDefault();
  });
  ['pointerup', 'pointercancel'].forEach(function (ev) {
    hero.addEventListener(ev, function () {
      dragging = false; hero.classList.remove('dragging');
    });
  });

  /* แตะช่องข้าง ๆ — กระต่ายกระโดดไป (ง่ายกว่าลากสำหรับเด็กเล็ก) */
  board.addEventListener('click', function (e) {
    var p = cellFrom(e.clientX, e.clientY);
    moveTo(p[0], p[1]);
  });

  function win() {
    won = true;
    H.sfx.yay();
    H.confettiFrom(goal, 40);
    H.bunnyEmote('excited');
    H.addStars(2);
    goal.textContent = '🏡';
    hero.style.fontSize = Math.floor(cell * 0.86) + 'px';
    H.finishBox(wrap, {
      title: 'ถึงบ้านแล้ว!',
      sub: 'กระต่ายดีใจมาก',
      say: 'You did it!',
      next: lv < SIZES.length - 1 ? function () { H.go('maze', { lv: lv + 1 }); } : null,
      nextLabel: '➕ ทางยาวขึ้น',
      again: function () { H.go('maze', { lv: lv }); }
    });
  }
};
})();
