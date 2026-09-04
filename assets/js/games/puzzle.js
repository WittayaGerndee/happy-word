/* ============================================================
   🧩 ต่อภาพสัตว์ — ลากชิ้นส่วนไปต่อให้เป็นภาพเต็ม
   ทักษะ: การคิดเชิงพื้นที่
   ------------------------------------------------------------
   ใช้ภาพจริงจาก assets/img (ตัดมาจากโปสเตอร์ใน uploads/)
   แต่ละชิ้นคือ "หน้าต่าง" เล็ก ๆ ที่เลื่อน background ของภาพเดียวกัน
   ไปคนละตำแหน่ง จึงไม่ต้องตัดไฟล์ภาพเพิ่มเลย
   ============================================================ */
(function () {
'use strict';
var H = window.HWA;
var LEVELS = [ {r:2,c:2}, {r:2,c:3}, {r:3,c:3} ];

H.Screens.puzzle = function (params) {
  var el = H.el;
  var lv = Math.min(params.lv || 0, LEVELS.length - 1);
  var R = LEVELS[lv].r, C = LEVELS[lv].c;
  var w = window.HWA_pickImg(1, ['animals'])[0] || H.data.words[0];
  var src = w.img ? 'assets/img/' + w.img + '.png?v=8' : '';

  /* ขนาดกระดานให้พอดีจอ แต่ไม่ใหญ่เกินจนชิ้นส่วนล้น */
  var S = Math.min(300, Math.max(200, Math.min(window.innerWidth - 60, window.innerHeight - 380)));
  var cw = Math.floor(S / C), ch = Math.floor(S / R);

  var wrap = el('div', 'g-wrap');

  var prompt = el('div', 'g-prompt');
  prompt.appendChild(el('span', '', 'ต่อภาพ ' + w.thai + ' ให้เต็ม'));
  var say = el('button', 'g-say', '🔊');
  say.setAttribute('aria-label', 'ฟังชื่อ');
  say.addEventListener('click', function () { H.sfx.pop(); H.speak(w.english); });
  prompt.appendChild(say);
  wrap.appendChild(prompt);

  var board = el('div', 'puz-board');
  board.style.width = (cw * C) + 'px';
  board.style.height = (ch * R) + 'px';
  wrap.appendChild(board);

  var tray = el('div', 'puz-tray');
  tray.style.marginTop = '14px';
  wrap.appendChild(tray);
  H.app.appendChild(wrap);

  /* วาดชิ้นส่วนหนึ่งชิ้น (ใช้ทั้งบนกระดานและในถาด) */
  function art(r, c) {
    var a = el('div', 'pc-art');
    a.style.position = 'absolute';
    a.style.width = (cw * C) + 'px';
    a.style.height = (ch * R) + 'px';
    a.style.left = (-c * cw) + 'px';
    a.style.top = (-r * ch) + 'px';
    if (src) {
      a.style.backgroundImage = 'url(' + src + ')';
      a.style.backgroundSize = 'contain';
      a.style.backgroundPosition = 'center';
      a.style.backgroundRepeat = 'no-repeat';
    } else {
      a.textContent = w.emoji;
      a.style.fontSize = Math.floor(S * 0.82) + 'px';
      a.style.display = 'flex';
      a.style.alignItems = 'center';
      a.style.justifyContent = 'center';
    }
    return a;
  }

  var cells = [];
  for (var r = 0; r < R; r++) {
    for (var c = 0; c < C; c++) {
      (function (rr, cc) {
        var cell = el('div', 'puz-cell');
        cell.style.width = cw + 'px';
        cell.style.height = ch + 'px';
        cell.style.left = (cc * cw) + 'px';
        cell.style.top = (rr * ch) + 'px';
        cell.dataset.k = rr + '-' + cc;
        var ghost = art(rr, cc);
        ghost.style.opacity = '.16';
        cell.appendChild(ghost);
        cell.ghost = ghost;
        board.appendChild(cell);
        cells.push(cell);
      })(r, c);
    }
  }

  var order = H.shuffle(cells.map(function (x) { return x.dataset.k; }));
  var left = order.length;

  order.forEach(function (k) {
    var rr = +k.split('-')[0], cc = +k.split('-')[1];
    var p = el('div', 'puz-piece');
    p.style.width = cw + 'px';
    p.style.height = ch + 'px';
    p.dataset.k = k;
    p.appendChild(art(rr, cc));
    p.setAttribute('role', 'button');
    p.setAttribute('aria-label', 'ชิ้นส่วนของ ' + w.english);
    tray.appendChild(p);

    window.HWA_drag(p, {
      targets: function () {
        return cells.filter(function (x) { return x.dataset.filled !== '1'; });
      },
      onTap: function () { H.sfx.pop(); H.speak(w.english); },
      onDrop: function (cell) {
        cell.classList.remove('hot');
        if (cell.dataset.k === k) {
          cell.dataset.filled = '1';
          cell.ghost.style.opacity = '1';
          p.dataset.locked = '1';
          p.classList.add('placed');
          H.sfx.pop();
          H.later(function () { H.sfx.ting(); }, 90);
          H.confettiFrom(cell, 16);
          left--;
          H.announce('วางชิ้นส่วนถูกแล้ว');
          if (left === 0) {
            H.addStars(2);
            H.later(finish, 700);
          } else {
            H.setBubble('เข้าที่แล้ว! เหลืออีก ' + left + ' ชิ้น');
          }
          return false;
        }
        H.sfx.gentle();
        H.setBubble('ชิ้นนี้ยังไม่ใช่ตรงนี้นะ ลองที่อื่นดู');
        return false;
      }
    });
  });

  H.later(function () { H.speak(w.english); }, 400);

  function finish() {
    board.style.animation = 'aJump .6s var(--ease-bounce)';
    H.bunnyEmote('excited');
    H.speak(w.english + '! ' + (w.sentence || ''), { rate: 0.75 });
    /* ต่อภาพเสร็จ = ได้สัตว์ตัวนี้เข้าสวนสัตว์ */
    var p = H.profile();
    if (p.unlockedAnimals.indexOf(w.id) < 0) { p.unlockedAnimals.push(w.id); H.save(); }
    H.finishBox(wrap, {
      title: 'เป็นรูป ' + w.english + ' แล้ว!',
      sub: w.thai,
      say: w.english,
      next: lv < LEVELS.length - 1 ? function () { H.go('puzzle', { lv: lv + 1 }); } : null,
      nextLabel: '➕ ชิ้นเยอะขึ้น',
      again: function () { H.go('puzzle', { lv: lv }); }
    });
  }
};
})();
