/* ═══════════════════════════════════════════════════════════════════
   CẢM ỨNG — chơi trên điện thoại / máy tính bảng, màn hình xoay ngang.

   - Nửa trái màn hình: cần điều khiển nổi (đặt ngón ở đâu, cần hiện ở đó).
     Đẩy hết cỡ là chạy.
   - Phần còn lại: vuốt để nhìn quanh, chạm nhanh = bấm vào vật.
   - Cụm nút bên phải: ✦ tác động, ↺ tác động ngược, E, G, sổ tay.
     Các nút giả phím thật (F/R/E/G/Tab), nên phòng không phải sửa gì.
   - Màn hình dọc thì che lại, nhắc xoay ngang; Android thì thử bật
     toàn màn hình và khoá hướng ngang ngay lần chạm đầu.

   Ép bật trên máy tính để thử: thêm ?touch=1 vào địa chỉ.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.camUng = (function () {
  var q = /[?&]touch=(\d)/.exec(location.search);
  if (q) return q[1] === '1';
  return !!(window.matchMedia && matchMedia('(pointer: coarse)').matches) &&
         (navigator.maxTouchPoints || 0) > 0;
})();

TX.touch = (function () {
  'use strict';

  var T = { bat: TX.camUng };
  if (!T.bat) {
    T.doiNhan = function (html) { return html; };
    T.khoiTao = T.datLai = function () {};
    return T;
  }

  document.documentElement.classList.add('cam-ung');

  var NHAY_NHIN = 0.0042;     // rad mỗi px khi vuốt nhìn
  var BAN_KINH = 46;          // px — quãng cần đi được tính từ tâm
  var VUNG_CHET = 0.12;
  var CHAM_XA = 10, CHAM_LAU = 320;   // chạm nhanh: dưới 10px, dưới 320ms

  var player = null;
  var el = {};
  var can = null;             // { id, x0, y0 } — ngón đang giữ cần
  var nhin = null;            // { id, x, y, x0, y0, t0 } — ngón đang vuốt nhìn
  var coNutE = false;

  /* ---------- đổi nhãn phím trong chữ hướng dẫn sang nút cảm ứng ---------- */
  var DOI = [
    [/<kbd>(F|Chuột trái|Enter|Space)<\/kbd>/g, '<kbd class="kt">✦</kbd>'],
    [/<kbd>(R|Chuột phải)<\/kbd>/g, '<kbd class="kt">↺</kbd>'],
    [/<kbd>(Kéo chuột|Chuột)<\/kbd>/g, '<kbd>Vuốt màn hình</kbd>'],
    [/<kbd>W A S D<\/kbd>/g, '<kbd>Cần điều khiển</kbd>'],
    [/<kbd>Tab<\/kbd>/g, '<kbd>Sổ tay</kbd>'],
    [/<kbd>(Esc|ESC)<\/kbd>/g, '<kbd>← Sảnh</kbd>'],
    [/hoặc bấm chuột vào/g, 'hoặc chạm vào'],
    [/[Bb]ấm chuột/g, function (m) { return m[0] === 'B' ? 'Chạm' : 'chạm'; }],
    [/[Kk]éo chuột/g, function (m) { return m[0] === 'K' ? 'Vuốt' : 'vuốt'; }]
  ];

  T.doiNhan = function (html) {
    if (!html) return html;
    html = String(html);
    for (var i = 0; i < DOI.length; i++) html = html.replace(DOI[i][0], DOI[i][1]);
    return html;
  };

  /* Gọi mỗi khi chữ hướng dẫn đổi: phòng nào nhắc tới phím E thì hiện nút E,
     và giữ nó cho tới khi rời phòng. */
  T.ghiNhanGoiY = function (html) {
    if (!coNutE && html && /<kbd>E<\/kbd>/.test(html)) {
      coNutE = true;
      el.nutE.classList.add('on');
    }
  };

  T.datLai = function (laSanh) {
    coNutE = false;
    if (el.nutE) el.nutE.classList.remove('on');
    document.documentElement.classList.toggle('o-sanh', !!laSanh);
    thaCan();
    nhin = null;
    if (player) { player.datTacDong(0); }
  };

  /* ---------- giả phím: các phòng nghe keydown trên window ---------- */
  function phim(code, key) {
    dispatchEvent(new KeyboardEvent('keydown', { code: code, key: key, bubbles: true }));
    dispatchEvent(new KeyboardEvent('keyup',   { code: code, key: key, bubbles: true }));
  }

  /* ---------- dựng giao diện ---------- */
  function dung() {
    var g = document.createElement('div');
    g.id = 'camUng';
    g.innerHTML =
      '<div id="cuCan"><div id="cuNum"></div></div>' +
      '<div id="cuNut">' +
        '<button type="button" class="cu-tron cu-phu" id="cuNguoc" aria-label="Tác động ngược">↺</button>' +
        '<button type="button" class="cu-tron cu-chinh" id="cuTac" aria-label="Tác động">✦</button>' +
        '<div class="cu-hang">' +
          '<button type="button" class="cu-nho" id="cuE">E</button>' +
          '<button type="button" class="cu-nho" id="cuG" aria-label="Chú giải">G</button>' +
          '<button type="button" class="cu-nho cu-chu" id="cuSo">Sổ tay</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(g);

    var x = document.createElement('div');
    x.id = 'xoayNgang';
    x.innerHTML =
      '<div class="xn-hop">' +
        '<div class="xn-may"></div>' +
        '<h2>Xoay ngang điện thoại</h2>' +
        '<p>Tháp Triết Học chơi ở màn hình ngang.<br>Chạm vào đây để vào chế độ toàn màn hình.</p>' +
      '</div>';
    document.body.appendChild(x);

    /* nút đóng sổ tay — trên máy tính dùng Tab */
    var bi = document.getElementById('bookInner');
    if (bi) {
      var sub = bi.querySelector('.sub');
      if (sub) sub.innerHTML = 'Chạm <b>Đóng</b> để quay lại';
      var dong = document.createElement('button');
      dong.type = 'button';
      dong.className = 'go';
      dong.id = 'cuDongSo';
      dong.textContent = 'Đóng';
      bi.appendChild(dong);
      dong.addEventListener('click', function () { phim('Tab', 'Tab'); });
    }

    el.can = document.getElementById('cuCan');
    el.num = document.getElementById('cuNum');
    el.nutE = document.getElementById('cuE');
    el.xoay = x;

    giuNut(document.getElementById('cuTac'), 1);
    giuNut(document.getElementById('cuNguoc'), -1);
    chamNut(el.nutE, function () { phim('KeyE', 'e'); });
    chamNut(document.getElementById('cuG'), function () { phim('KeyG', 'g'); });
    chamNut(document.getElementById('cuSo'), function () { phim('Tab', 'Tab'); });

    x.addEventListener('click', toanManHinh);
  }

  /* Nút giữ: tác động kéo dài suốt lúc ngón còn đặt trên nút. */
  function giuNut(b, v) {
    function tha(e) {
      b.classList.remove('an');
      if (player) player.datTacDong(0, v);
    }
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      try { b.setPointerCapture(e.pointerId); } catch (er) {}
      b.classList.add('an');
      if (player) player.datTacDong(v);
      moTieng();
    });
    b.addEventListener('pointerup', tha);
    b.addEventListener('pointercancel', tha);
    b.addEventListener('lostpointercapture', tha);
  }

  function chamNut(b, fn) {
    b.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      b.classList.add('an');
    });
    b.addEventListener('pointerup', function () {
      b.classList.remove('an');
      moTieng();
      fn();
    });
    b.addEventListener('pointercancel', function () { b.classList.remove('an'); });
  }

  /* ---------- cần điều khiển và vuốt nhìn, trên canvas ---------- */
  function ganCanvas(dom) {
    dom.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse') return;
      e.preventDefault();
      try { dom.setPointerCapture(e.pointerId); } catch (er) {}
      moTieng();

      var benTrai = e.clientX < innerWidth * 0.42;
      if (benTrai && !can && player && player.enabled) {
        can = { id: e.pointerId, x0: e.clientX, y0: e.clientY };
        el.can.style.left = e.clientX + 'px';
        el.can.style.top = e.clientY + 'px';
        el.can.classList.add('on');
        el.num.style.transform = '';
        return;
      }
      if (!nhin) {
        nhin = { id: e.pointerId, x: e.clientX, y: e.clientY,
                 x0: e.clientX, y0: e.clientY, t0: performance.now() };
      }
    });

    dom.addEventListener('pointermove', function (e) {
      if (can && e.pointerId === can.id) {
        var dx = e.clientX - can.x0, dy = e.clientY - can.y0;
        var d = Math.hypot(dx, dy);
        if (d > BAN_KINH) { dx = dx / d * BAN_KINH; dy = dy / d * BAN_KINH; d = BAN_KINH; }
        el.num.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
        var m = d / BAN_KINH;
        if (m < VUNG_CHET) player.datTruc(0, 0);
        else {
          var k = (m - VUNG_CHET) / (1 - VUNG_CHET) / m;   // bỏ vùng chết, giữ hướng
          player.datTruc(dx / BAN_KINH * k, -dy / BAN_KINH * k);
        }
        return;
      }
      if (nhin && e.pointerId === nhin.id) {
        var mx = e.clientX - nhin.x, my = e.clientY - nhin.y;
        nhin.x = e.clientX; nhin.y = e.clientY;
        if (player) player.nhinThem(mx * NHAY_NHIN, my * NHAY_NHIN);
      }
    });

    function nhac(e) {
      if (can && e.pointerId === can.id) { thaCan(); return; }
      if (nhin && e.pointerId === nhin.id) {
        var xa = Math.hypot(e.clientX - nhin.x0, e.clientY - nhin.y0);
        var nhanh = performance.now() - nhin.t0 < CHAM_LAU;
        var n = nhin; nhin = null;
        if (e.type === 'pointerup' && xa < CHAM_XA && nhanh && player) player.cham(n.x0, n.y0);
      }
    }
    dom.addEventListener('pointerup', nhac);
    dom.addEventListener('pointercancel', nhac);
  }

  function thaCan() {
    can = null;
    if (el.can) {
      el.can.classList.remove('on');
      el.can.style.left = el.can.style.top = '';   // về chỗ mặc định, mờ đi
      el.num.style.transform = '';
    }
    if (player) player.datTruc(0, 0);
  }

  /* ---------- âm thanh: iOS chỉ cho phát sau một cú chạm ---------- */
  function moTieng() {
    if (TX.audio && TX.audio.ngu) TX.audio.ngu();
  }

  /* ---------- toàn màn hình + khoá hướng ngang (Android) ----------
     iPhone không cho trang web làm việc này; lớp che dọc lo phần còn lại. */
  function toanManHinh() {
    var d = document.documentElement;
    var dangToan = document.fullscreenElement || document.webkitFullscreenElement;
    var p = null;
    if (!dangToan) {
      var rq = d.requestFullscreen || d.webkitRequestFullscreen;
      if (rq) { try { p = rq.call(d, { navigationUI: 'hide' }); } catch (e) { p = null; } }
    }
    Promise.resolve(p).then(khoaNgang, function () {});
  }
  function khoaNgang() {
    try {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock('landscape').catch(function () {});
      }
    } catch (e) {}
  }

  T.khoiTao = function (p, dom) {
    player = p;
    dung();
    ganCanvas(dom);

    /* lần chạm đầu tiên ở bất kỳ đâu: thử bật toàn màn hình ngang */
    var daThu = false;
    addEventListener('pointerup', function () {
      if (daThu) return;
      daThu = true;
      toanManHinh();
    }, true);

    /* Safari iOS: chặn chụm hai ngón phóng to cả trang */
    document.addEventListener('gesturestart', function (e) { e.preventDefault(); });

    /* đang vuốt mà app bị ẩn đi thì thả hết */
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { thaCan(); nhin = null; player.datTacDong(0); }
    });
  };

  return T;
})();
