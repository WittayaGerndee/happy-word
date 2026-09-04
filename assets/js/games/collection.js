/* ============================================================
   🏆 คลังสะสมของหนู — เล่นเกมไหน ก็สะสมของหมวดนั้น
   ------------------------------------------------------------
   สวนสัตว์ / สวนผลไม้ / แปลงผัก / โรงรถ / ตู้ปลา / บ้านของหนู
   ของที่ยังไม่ได้เก็บจะขึ้นเป็น "เงา" ของจริง ไม่ใช่กุญแจล้วน ๆ
   เด็กจะได้เห็นว่ายังเหลืออะไรน่าเก็บอีก (แรงจูงใจให้กลับมาเล่น)
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

/* สร้างแท็บจากหมวดที่มีจริงตอนโหลด — เพิ่ม/ลดหมวดในไฟล์ data ได้เลย */
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
    return {
      key: k,
      emoji: n.emoji || (pk && pk.emoji) || '📦',
      name:  n.name  || (pk && pk.titleTh) || k
    };
  });
}

function wordsOf(key) {
  if (key === 'animals') return H.data.words;
  var pk = window.HWA_PACKS[key];
  return pk ? pk.words : [];
}

function bar(have, all) {
  var pct = all ? Math.round(have / all * 100) : 0;
  var b = H.el('div', 'coll-bar');
  var fill = H.el('div', 'coll-bar-fill');
  fill.style.width = pct + '%';
  b.appendChild(fill);
  return b;
}

H.Screens.collection = function (params) {
  var el = H.el;
  var TABS = buildTabs();
  var tab = params.tab || 'animals';
  if (!TABS.some(function (t) { return t.key === tab; })) tab = TABS[0].key;

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

  /* ---------- แถบหมวด (เลื่อนแนวนอนได้บนจอเล็ก) ---------- */
  var strip = el('div', 'coll-strip');
  var inner = el('div', 'coll-strip-in');
  TABS.forEach(function (t) {
    var have = H.collected(t.key).length, all = wordsOf(t.key).length;
    var full = all && have === all;
    var b = el('button', 'coll-tab' + (t.key === tab ? ' on' : '') + (full ? ' full' : ''),
      '<span class="cti">' + t.emoji + '</span>' +
      '<span class="ctn">' + t.name + '</span>' +
      '<span class="ctc">' + have + '/' + all + '</span>');
    b.setAttribute('aria-label', t.name + ' เก็บได้ ' + have + ' จาก ' + all);
    b.setAttribute('aria-pressed', t.key === tab ? 'true' : 'false');
    b.addEventListener('click', function () {
      H.sfx.pop();
      H.go('collection', { tab: t.key }, true);   /* สลับแท็บไม่เพิ่มชั้นประวัติ ปุ่มกลับจะได้ไม่ต้องกดหลายที */
    });
    inner.appendChild(b);
  });
  strip.appendChild(inner);
  wrap.appendChild(strip);

  /* ---------- ของในหมวดที่เลือก ---------- */
  var meta = TABS.filter(function (t) { return t.key === tab; })[0];
  var have = H.collected(tab);
  var list = wordsOf(tab);

  var panel = el('div', 'coll-panel');
  var ph = el('div', 'coll-panel-head');
  ph.appendChild(el('span', 'cph-name', meta.emoji + ' ' + meta.name));
  ph.appendChild(el('span', 'cph-count', have.length + ' / ' + list.length));
  panel.appendChild(ph);
  panel.appendChild(bar(have.length, list.length));

  var grid = el('div', 'coll-grid');
  list.forEach(function (w) {
    var got = have.indexOf(w.id) >= 0;
    var c = el('button', 'coll-cell' + (got ? '' : ' locked'),
      '<span class="cc-art">' + H.face(w) + '</span>' +
      '<span class="cc-en">' + (got ? w.english : '???') + '</span>' +
      '<span class="cc-th">' + (got ? w.thai : '') + '</span>' +
      (got ? '' : '<span class="cc-lock">🔒</span>'));
    c.setAttribute('aria-label', got ? w.english + ' ' + w.thai : 'ยังไม่ได้เก็บ');
    c.addEventListener('click', function () {
      H.sfx.pop();
      if (!got) { H.setBubble('เล่นเกมแล้วจะได้ชิ้นนี้มานะ'); return; }
      H.speak(w.english);
      var a = c.querySelector('.cc-art');
      a.style.animation = 'none';
      void a.offsetWidth;
      a.style.animation = 'aJump .55s var(--ease-bounce)';
    });
    grid.appendChild(c);
  });
  panel.appendChild(grid);

  if (list.length && have.length === list.length) {
    panel.appendChild(el('div', 'coll-done', '🎉 เก็บครบหมวดนี้แล้ว! เก่งมาก'));
  }
  wrap.appendChild(panel);

  /* ---------- ปุ่มท้ายหน้า ---------- */
  var col = el('div', 'coll-actions');
  col.appendChild(H.btn('🎯 ไปเล่นเกมเก็บเพิ่ม', 'accent', function () { H.go('games'); }));
  wrap.appendChild(col);

  H.app.appendChild(wrap);
  H.announce('คลังสะสม ' + meta.name + ' มี ' + have.length + ' จาก ' + list.length);
};

/* หน้าสวนสัตว์เดิม = แท็บสัตว์ */
H.Screens.zoo = function () { H.Screens.collection({ tab: 'animals' }); };

/* ============================================================
   กล่องสุ่ม — สำหรับเกมที่ไม่มีคำศัพท์ให้เก็บโดยตรง (เก็บดาว/ลูกโป่ง)
   ============================================================ */
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
