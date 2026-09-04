/* ============================================================
   🏆 คลังสะสมของหนู — เล่นเกมไหน ก็สะสมของหมวดนั้น
   ------------------------------------------------------------
   สวนสัตว์ / สวนผลไม้ / แปลงผัก / โรงรถ / บ้านของหนู / ตู้ปลา
   ของที่เก็บได้จะอยู่ตรงนี้ตลอด แตะฟังเสียงซ้ำได้เรื่อย ๆ
   นี่คือเหตุผลที่เด็กจะกลับมาเล่นวันถัดไป (Concept v2: ดาวต้องมีที่ใช้)
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;

/* สร้างแท็บจากหมวดที่มีอยู่จริงตอนโหลด — เพิ่ม/ลดหมวดในไฟล์ data ได้เลย
   หน้านี้จะตามเองโดยไม่ต้องแก้โค้ด */
var NICE = {
  animals:  { emoji:'🦁', name:'สวนสัตว์'   },
  fruits:   { emoji:'🍎', name:'สวนผลไม้'   },
  veggies:  { emoji:'🥕', name:'แปลงผัก'    },
  vehicles: { emoji:'🚗', name:'โรงรถ'      },
  sea:      { emoji:'🐠', name:'ตู้ปลา'     },
  home:     { emoji:'🛋️', name:'บ้านของหนู' }
};
var ORDER = ['animals', 'fruits', 'veggies', 'vehicles', 'sea', 'home'];

function buildTabs() {
  var PKS = window.HWA_PACKS || {};
  var keys = ['animals'].concat(Object.keys(PKS).filter(function (k) {
    return PKS[k] && PKS[k].words && PKS[k].words.length;
  }));
  /* ตัดตัวซ้ำ แล้วเรียงตามลำดับที่ตั้งใจ ส่วนหมวดใหม่ที่ไม่รู้จักไปต่อท้าย */
  var seen = {}, out = [];
  keys.forEach(function (k) { if (!seen[k]) { seen[k] = 1; out.push(k); } });
  out.sort(function (a, b) {
    var ia = ORDER.indexOf(a), ib = ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return out.map(function (k) {
    var n = NICE[k] || {};
    var pk = PKS[k];
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

H.Screens.collection = function (params) {
  var el = H.el;
  var TABS = buildTabs();
  var tab = params.tab || 'animals';

  var wrap = el('div', 'games-wrap');

  /* ---- สรุปรวมทุกหมวด ---- */
  var totalHave = 0, totalAll = 0;
  TABS.forEach(function (t) {
    totalHave += H.collected(t.key).length;
    totalAll  += wordsOf(t.key).length;
  });
  wrap.appendChild(el('h2', 'title', '🏆 คลังสะสมของหนู'));
  wrap.appendChild(el('p', 'subtitle', 'เก็บได้แล้ว ' + totalHave + ' ชิ้น จากทั้งหมด ' + totalAll));

  /* ---- แถบเลือกหมวด ---- */
  var bar = el('div', 'col-tabs');
  TABS.forEach(function (t) {
    var have = H.collected(t.key).length, all = wordsOf(t.key).length;
    var b = el('button', 'col-tab' + (t.key === tab ? ' on' : ''),
      '<span class="ct-ico">' + t.emoji + '</span>' +
      '<span class="ct-nm">' + t.name + '</span>' +
      '<span class="ct-ct">' + have + '/' + all + '</span>');
    b.setAttribute('aria-label', t.name + ' เก็บได้ ' + have + ' จาก ' + all);
    b.addEventListener('click', function () {
      H.sfx.pop();
      H.go('collection', { tab: t.key });
    });
    bar.appendChild(b);
  });
  wrap.appendChild(bar);

  /* ---- ของในหมวดที่เลือก ---- */
  var have = H.collected(tab);
  var list = wordsOf(tab);
  var grid = el('div', 'zoo-grid');

  list.forEach(function (w) {
    var got = have.indexOf(w.id) >= 0;
    var c = el('button', 'zoo-cell' + (got ? '' : ' locked'),
      '<span class="ze">' + (got ? H.face(w) : '🔒') + '</span>' +
      '<span class="zw">' + (got ? w.english : '???') + '</span>');
    c.setAttribute('aria-label', got ? w.english + ' ' + w.thai : 'ยังไม่ได้เก็บ');
    c.addEventListener('click', function () {
      H.sfx.pop();
      if (!got) { H.setBubble('เล่นเกมแล้วจะได้ชิ้นนี้มานะ'); return; }
      H.speak(w.english);
      var e = c.querySelector('.ze');
      e.style.animation = 'none';
      void e.offsetWidth;
      e.style.animation = 'aJump .55s var(--ease-bounce)';
    });
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  /* ---- เก็บครบหมวดแล้ว ---- */
  if (have.length === list.length && list.length) {
    var done = el('div', 'new-animal');
    done.appendChild(el('div', 'title', '🎉 เก็บครบหมวดนี้แล้ว!'));
    wrap.appendChild(done);
  }

  var col = el('div', 'btn-col');
  col.style.margin = '18px auto 0';
  col.appendChild(H.btn('🎯 ไปเล่นเกมเก็บเพิ่ม', 'accent', function () { H.go('games'); }));
  wrap.appendChild(col);

  H.app.appendChild(wrap);
  H.announce('คลังสะสม ' + tab + ' มี ' + have.length + ' จาก ' + list.length);
};

/* หน้าสวนสัตว์เดิม = แท็บสัตว์ของคลังสะสม */
H.Screens.zoo = function () { H.Screens.collection({ tab: 'animals' }); };
})();

/* ============================================================
   กล่องสุ่ม — สำหรับเกมที่ไม่มีคำศัพท์ให้เก็บโดยตรง (เก็บดาว/ลูกโป่ง)
   สุ่มของที่ยังไม่มีในคลังมาให้ 1 ชิ้น เล่นจบแล้วจึงได้อะไรติดมือเสมอ
   ============================================================ */
window.HWA.surprise = function () {
  var H = window.HWA;
  var pool = (window.HWA_ALL || []).filter(function (w) {
    return H.collected(H.packOf(w)).indexOf(w.id) < 0;
  });
  if (!pool.length) pool = (window.HWA_ALL || []).slice();   /* เก็บครบแล้ว — สุ่มมาให้ดูใหม่ */
  var w = pool[(Math.random() * pool.length) | 0];
  if (!w) return null;
  H.collect(w);
  return w;
};
