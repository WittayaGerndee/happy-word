/* ============================================================
   dragkit.js — ตัวช่วย "ลากแล้ววาง" ที่ใช้ร่วมกันทุกเกม
   ------------------------------------------------------------
   ทำไมต้องเขียนเอง ไม่ใช้ HTML5 drag-and-drop?
   เพราะ HTML5 DnD ใช้กับนิ้วบน iPad ไม่ได้เลย
   ตัวนี้ใช้ Pointer Events จึงทำงานเหมือนกันทั้งนิ้วและเมาส์

   ใจดีกับเด็ก 4 ขวบ:
   - ปล่อยใกล้ ๆ ช่องก็ถือว่าเข้า (SNAP px)
   - ปล่อยผิดที่ ของจะลอยกลับที่เดิมเอง ไม่มีเสียงลบ ไม่มีการลงโทษ
   ============================================================ */
(function () {
'use strict';

var SNAP = 56;   /* ปล่อยห่างจากช่องได้ไม่เกินกี่พิกเซลถึงยังนับว่าเข้า */

function center(r) { return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }

window.HWA_drag = function (node, opts) {
  opts = opts || {};
  node.classList.add('g-drag');

  var sx = 0, sy = 0, active = false, pid = null, hot = null;

  function targets() {
    var t = opts.targets ? opts.targets() : [];
    return t.filter(Boolean);
  }

  function nearest(x, y) {
    var best = null, bestD = Infinity;
    targets().forEach(function (t) {
      var el = t.el || t;
      var r = el.getBoundingClientRect();
      var inside = x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
      var c = center(r);
      var d = Math.hypot(x - c.x, y - c.y);
      var reach = Math.max(r.width, r.height) / 2 + SNAP;
      if ((inside || d < reach) && d < bestD) { bestD = d; best = t; }
    });
    return best;
  }

  function setHot(t) {
    var el = t && (t.el || t);
    if (hot === el) return;
    if (hot) hot.classList.remove('hot');
    hot = el || null;
    if (hot) hot.classList.add('hot');
  }

  function down(e) {
    if (active || node.dataset.locked === '1') return;
    active = true; pid = e.pointerId;
    sx = e.clientX; sy = e.clientY;
    node.classList.add('dragging');
    try { node.setPointerCapture(pid); } catch (err) {}
    if (opts.onStart) opts.onStart(node);
    e.preventDefault();
  }

  function move(e) {
    if (!active || e.pointerId !== pid) return;
    var dx = e.clientX - sx, dy = e.clientY - sy;
    node.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.14) rotate(-3deg)';
    setHot(nearest(e.clientX, e.clientY));
    e.preventDefault();
  }

  function up(e) {
    if (!active || e.pointerId !== pid) return;
    active = false;
    try { node.releasePointerCapture(pid); } catch (err) {}
    node.classList.remove('dragging');

    var t = nearest(e.clientX, e.clientY);
    setHot(null);

    var reset = function () {
      node.style.transition = 'transform .3s cubic-bezier(.34,1.56,.64,1)';
      node.style.transform = '';
      setTimeout(function () { node.style.transition = ''; }, 320);
    };

    if (t) {
      var keep = opts.onDrop ? opts.onDrop(t, node) : false;
      if (!keep) reset();
    } else {
      if (opts.onMiss) opts.onMiss(node);
      reset();
    }
  }

  node.addEventListener('pointerdown', down);
  node.addEventListener('pointermove', move);
  node.addEventListener('pointerup', up);
  node.addEventListener('pointercancel', up);

  /* แตะเฉย ๆ (ไม่ลาก) ก็ให้เกมรู้ด้วย — เด็กหลายคนแตะก่อนแล้วค่อยลาก */
  node.addEventListener('click', function () { if (opts.onTap) opts.onTap(node); });
};
})();
