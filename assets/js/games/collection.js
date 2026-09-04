/* ============================================================
   🏆 คลังสะสมของหนู
   ------------------------------------------------------------
   กติกาข้อสำคัญของหน้านี้: "ต้องพอดีจอ ห้ามมีแถบเลื่อน"
   เด็ก 4–5 ขวบเลื่อนจอไม่เป็น ของที่อยู่ใต้ขอบจอ = ของที่ไม่มีอยู่จริง
   จึงคำนวณขนาดช่องจากพื้นที่ว่างจริง แล้วแบ่งเป็นหน้า ๆ
   มีปุ่มลูกศรใหญ่ ๆ ให้กดพลิกหน้าแทนการเลื่อน
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;

var NICE = {
  animals:  { emoji: '🦁', name: 'สวนสัตว์'   },
  fruits:   { emoji: '🍎', name: 'สวนผลไม้'   },
  veggies:  { emoji: '🥕', name: 'แปลงผัก'    },
  vehicles: { emoji: '🚗', name: 'โรงรถ'      },
  sea:      { emoji: '🐠', name: 'ตู้ปลา'     },
  home:     { emoji: '🛋️', name: 'บ้านของหนู' }
};
var ORDER = ['animals', 'fruits', 'veggies', 'vehicles', 'sea', 'home'];

function buildTabs() {
  var PKS = window.HWA_PACKS || {};
  var keys = ['animals'], seen = { animals: 1 };
  Object.keys(PKS).forEach(function (k) {
    if (PKS[k] && PKS[k].words && PKS[k].words.length && !seen[k]) { seen[k] = 1; keys.push(k); }
  });
  keys.sort(function (a, b) {
    var ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return keys.map(function (k) {
    var n = NICE[k] || {}, pk = PKS[k];
    return { key: k, emoji: n.emoji || (pk && pk.emoji) || '📦',
             name: n.name || (pk && pk.titleTh) || k };
  });
}

function wordsOf(key) {
  if (key === 'animals') return H.data.words;
  var pk = window.HWA_PACKS[key];
  return pk ? pk.words : [];
}

function bar(have, all) {
  var b = H.el('div', 'coll-bar');
  var f = H.el('div', 'coll-bar-fill');
  f.style.width = (all ? Math.round(have / all * 100) : 0) + '%';
  b.appendChild(f);
  return b;
}

/* กี่คอลัมน์ถึงจะได้ช่องใหญ่พอให้นิ้วเด็กกด แต่ยังเห็นของเยอะพอ */
function colsFor(w) {
  if (w < 430) return 3;
  if (w < 700) return 4;
  if (w < 1000) return 5;
  return 6;
}

H.Screens.collection = function (params) {
  var el = H.el;
  var TABS = buildTabs();
  var tab = params.tab || 'animals';
  if (!TABS.some(function (t) { return t.key === tab; })) tab = TABS[0].key;
  var page = params.page || 0;

  var wrap = el('div', 'coll-page');

  /* ---------- หัวเรื่อง + ความคืบหน้ารวม ---------- */
  var totalHave = 0, totalAll = 0;
  TABS.forEach(function (t) {
    totalHave += H.collected(t.key).length;
    totalAll  += wordsOf(t.key).length;
  });
  var head = el('div', 'coll-head');
  head.appendChild(el('h2', 'coll-title', '🏆 คลังสะสมของหนู'));
  head.appendChild(el('p', 'coll-sub', 'เก็บได้แล้ว <b>' + totalHave + '</b> จาก ' + totalAll + ' ชิ้น'));
  head.appendChild(bar(totalHave, totalAll));
  wrap.appendChild(head);

  /* ---------- แถบหมวด ---------- */
  var strip = el('div', 'coll-strip');
  var inner = el('div', 'coll-strip-in');
  TABS.forEach(function (t) {
    var have = H.collected(t.key).length, all = wordsOf(t.key).length;
    var b = el('button', 'coll-tab' + (t.key === tab ? ' on' : '') + (all && have === all ? ' full' : ''),
      '<span class="cti">' + t.emoji + '</span>' +
      '<span class="ctn">' + t.name + '</span>' +
      '<span class="ctc">' + have + '/' + all + '</span>');
    b.setAttribute('aria-label', t.name + ' เก็บได้ ' + have + ' จาก ' + all);
    b.addEventListener('click', function () {
      H.sfx.pop();
      H.go('collection', { tab: t.key, page: 0 }, true);
    });
    inner.appendChild(b);
  });
  strip.appendChild(inner);
  wrap.appendChild(strip);

  /* ---------- แผงของ ---------- */
  var meta = TABS.filter(function (t) { return t.key === tab; })[0];
  var have = H.collected(tab);
  var list = wordsOf(tab);

  var panel = el('div', 'coll-panel');
  var ph = el('div', 'coll-panel-head');
  ph.appendChild(el('span', 'cph-name', meta.emoji + ' ' + meta.name));
  var counter = el('span', 'cph-count', have.length + ' / ' + list.length);
  ph.appendChild(counter);
  panel.appendChild(ph);
  panel.appendChild(bar(have.length, list.length));

  var grid = el('div', 'coll-grid');
  panel.appendChild(grid);

  var pager = el('div', 'coll-pager');
  panel.appendChild(pager);
  wrap.appendChild(panel);

  H.app.appendChild(wrap);

  /* ---------- คำนวณให้พอดีจอ แล้วค่อยวาดของ ---------- */
  var perPage = 0, pages = 1;

  function measure() {
    var gap = window.innerWidth < 430 ? 8 : 12;
    var W = grid.clientWidth || wrap.clientWidth;
    var avail = grid.clientHeight;
    var MIN = 64, MAX = 132;      /* เล็กสุดที่นิ้วเด็กยังกดแม่น / ใหญ่สุดที่ยังไม่เทอะทะ */

    /* คอลัมน์: กางให้เต็มความกว้าง โดยช่องไม่เกิน MAX */
    var cols = Math.max(2, Math.floor((W + gap) / (MAX + gap)));
    cols = Math.max(cols, colsFor(window.innerWidth));
    var cw = Math.floor((W - gap * (cols - 1)) / cols);
    if (cw < MIN) {
      cols = Math.max(2, Math.floor((W + gap) / (MIN + gap)));
      cw = Math.floor((W - gap * (cols - 1)) / cols);
    }
    var ch = Math.round(cw * 1.28);

    var rows = Math.floor((avail + gap) / (ch + gap));
    if (rows < 1) {
      /* จอเตี้ยมาก (มือถือแนวนอน) — ย่อช่องให้พอดีหนึ่งแถว ดีกว่าปล่อยให้ล้นออกนอกจอ */
      ch = Math.max(52, avail);
      cw = Math.min(cw, Math.round(ch / 1.28));
      cols = Math.max(2, Math.floor((W + gap) / (cw + gap)));
      rows = 1;
    }

    perPage = Math.max(1, cols * rows);
    pages = Math.max(1, Math.ceil(list.length / perPage));
    if (page >= pages) page = pages - 1;

    grid.style.setProperty('--cw', cw + 'px');
    grid.style.setProperty('--gap', gap + 'px');
    grid.style.gridTemplateColumns = 'repeat(' + cols + ', ' + cw + 'px)';
    grid.style.gridAutoRows = ch + 'px';
  }

  function draw() {
    grid.innerHTML = '';
    var from = page * perPage;
    list.slice(from, from + perPage).forEach(function (w) {
      var got = have.indexOf(w.id) >= 0;
      var c = el('button', 'coll-cell' + (got ? '' : ' locked'),
        '<span class="cc-art">' + H.face(w) + '</span>' +
        '<span class="cc-en">' + (got ? w.english : '???') + '</span>' +
        (got ? '<span class="cc-th">' + w.thai + '</span>' : '') +
        (got ? '' : '<span class="cc-lock">🔒</span>'));
      c.setAttribute('aria-label', got ? w.english + ' ' + w.thai : 'ยังไม่ได้เก็บ');
      c.addEventListener('click', function () {
        H.sfx.pop();
        if (!got) { H.setBubble('เล่นเกมแล้วจะได้ชิ้นนี้มานะ'); return; }
        H.speak(w.english);
        var a = c.querySelector('.cc-art');
        a.style.animation = 'none'; void a.offsetWidth;
        a.style.animation = 'aJump .55s var(--ease-bounce)';
      });
      grid.appendChild(c);
    });
    drawPager();
  }

  function drawPager() {
    pager.innerHTML = '';
    if (pages <= 1) { pager.style.display = 'none'; return; }
    pager.style.display = '';

    var prev = el('button', 'coll-arrow', '◀');
    prev.setAttribute('aria-label', 'หน้าก่อนหน้า');
    prev.disabled = page === 0;
    prev.addEventListener('click', function () {
      if (page === 0) return;
      H.sfx.pop(); page--; draw();
    });
    pager.appendChild(prev);

    var dots = el('div', 'coll-dots');
    for (var i = 0; i < pages; i++) {
      (function (k) {
        var d = el('button', 'coll-dot' + (k === page ? ' on' : ''), '');
        d.setAttribute('aria-label', 'หน้า ' + (k + 1));
        d.addEventListener('click', function () { H.sfx.pop(); page = k; draw(); });
        dots.appendChild(d);
      })(i);
    }
    pager.appendChild(dots);

    var next = el('button', 'coll-arrow', '▶');
    next.setAttribute('aria-label', 'หน้าถัดไป');
    next.disabled = page >= pages - 1;
    next.addEventListener('click', function () {
      if (page >= pages - 1) return;
      H.sfx.pop(); page++; draw();
    });
    pager.appendChild(next);
  }

  measure();
  draw();

  /* หมุนจอ / เปลี่ยนขนาดหน้าต่าง = คำนวณใหม่ทั้งหมด */
  var rt = null;
  function onResize() {
    clearTimeout(rt);
    rt = setTimeout(function () {
      if (!wrap.isConnected) { window.removeEventListener('resize', onResize); return; }
      measure(); draw();
    }, 160);
  }
  window.addEventListener('resize', onResize);

  H.announce('คลังสะสม ' + meta.name + ' มี ' + have.length + ' จาก ' + list.length);
};

H.Screens.zoo = function () { H.Screens.collection({ tab: 'animals' }); };

/* กล่องสุ่ม — สำหรับเกมที่ไม่มีคำศัพท์ให้เก็บโดยตรง */
H.surprise = function () {
  var pool = (window.HWA_ALL || []).filter(function (w) {
    return H.collected(H.packOf(w)).indexOf(w.id) < 0;
  });
  if (!pool.length) pool = (window.HWA_ALL || []).slice();
  var w = pool[(Math.random() * pool.length) | 0];
  if (!w) return null;
  H.collect(w);
  return w;
};
})();
