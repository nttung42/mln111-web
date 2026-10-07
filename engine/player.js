/* ═══════════════════════════════════════════════════════════════════
   NGƯỜI CHƠI — di chuyển, góc nhìn, và đầu vào "tác động".

   Hai chế độ điều khiển, tự nhận diện:
   - Có pointer lock (chạy qua http/localhost): chuột tự do, nút chuột
     trái/phải là tác động.
   - Không có (mở bằng file://): kéo chuột để nhìn, phím F/R là tác động.
   - Cảm ứng (TX.camUng): engine/touch.js cấp cần điều khiển, vuốt nhìn
     và nút tác động qua datTruc / nhinThem / datTacDong / cham.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.Player = function (dom) {
  'use strict';

  var P = this;

  P.pos = new THREE.Vector3(0, 1.68, 5.6);
  P.yaw = 0;
  P.pitch = -0.05;

  /* Giới hạn không gian, phòng tự đặt lại khi nạp */
  P.bounds = 7.0;
  P.blockers = [];          // [{x, z, r}] — bệ đỡ, vật thể không đi xuyên được

  /* Địa hình. Phòng phẳng để trống cả hai; sảnh xoắn ốc cung cấp cả hai. */
  P.groundAt = null;        // function(x, z) -> cao độ mặt sàn tại điểm đó
  P.constrain = null;       // function(pos, prevX, prevZ) — chặn theo hình dạng riêng

  P.CAO_MAT = 1.68;         // tầm mắt tính từ mặt sàn

  P.enabled = false;        // đang đọc thẻ nội dung thì tắt
  P.chuotTuDo = false;      // true: không khoá con trỏ, người chơi thấy và bấm được
  P.onClick = null;         // gọi khi có một cú bấm thật (không phải kéo nhìn quanh)
  P.locked = false;
  P.lockBroken = false;

  var keys = Object.create(null);
  var dragging = false;
  var mouseAct = 0;         // +1 / -1 từ nút chuột
  var touchAct = 0;         // +1 / -1 từ nút cảm ứng
  var truc = { x: 0, y: 0 };  // cần điều khiển analog: x sang phải, y tiến lên
  var bobT = 0;

  /* --- môi trường không cho khoá con trỏ --- */
  if (!('requestPointerLock' in dom) || location.protocol === 'file:') {
    P.lockBroken = true;
  }

  /* --- cảm ứng: không có con trỏ để khoá; ngắm luôn ở giữa màn hình --- */
  P.camUng = !!TX.camUng;
  if (P.camUng) P.lockBroken = true;

  /* ---------- bàn phím ---------- */
  /* Ghi cả e.code lẫn e.key: bộ gõ tiếng Việt và vài bố cục bàn phím
     có thể làm một trong hai cái không khớp. */
  function datPhim(e, xuong) {
    keys[e.code] = xuong;
    if (e.key && e.key.length === 1) keys['k_' + e.key.toLowerCase()] = xuong;
  }

  addEventListener('keydown', function (e) {
    datPhim(e, true);
    if (['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].indexOf(e.code) >= 0) {
      e.preventDefault();
    }
  });
  addEventListener('keyup', function (e) { datPhim(e, false); });

  /* Rời khỏi cửa sổ khi đang giữ phím thì trình duyệt nuốt mất keyup,
     phím kẹt lại ở trạng thái "đang giữ". Xoá sạch cho chắc. */
  addEventListener('blur', function () {
    for (var k in keys) keys[k] = false;
    mouseAct = 0;
    touchAct = 0;
    truc.x = truc.y = 0;
    dragging = false;
    dom.style.cursor = '';
  });

  /* ---------- góc nhìn ---------- */
  function look(dx, dy) {
    P.yaw   -= dx * 0.0022;
    P.pitch -= dy * 0.0022;
    P.pitch = Math.max(-1.35, Math.min(1.2, P.pitch));
  }

  document.addEventListener('pointerlockchange', function () {
    P.locked = document.pointerLockElement === dom;
    if (!P.locked) mouseAct = 0;
  });
  document.addEventListener('pointerlockerror', function () {
    P.lockBroken = true;
    if (P.onModeChange) P.onModeChange();
  });
  P.chuot = { x: 0, y: 0 };        // toạ độ chuột trên màn hình, để bắn tia

  /* Cảm ứng: "chuột" nằm yên ở tâm màn hình, trùng chấm ngắm. */
  function veTam() { P.chuot.x = innerWidth / 2; P.chuot.y = innerHeight / 2; }
  if (P.camUng) { veTam(); addEventListener('resize', veTam); }

  document.addEventListener('mousemove', function (e) {
    if (P.camUng) return;          // chuột giả lập từ cú chạm — bỏ qua
    P.chuot.x = e.clientX;
    P.chuot.y = e.clientY;
    if (!P.enabled) return;
    if (P.locked || dragging) {
      keoXa += Math.abs(e.movementX || 0) + Math.abs(e.movementY || 0);
      look(e.movementX || 0, e.movementY || 0);
    }
  });

  /* ---------- chuột ---------- */
  dom.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  /* Ở chế độ chuột tự do, một lần nhấn có thể là CÚ BẤM (chọn thứ gì đó)
     hoặc là KÉO ĐỂ NHÌN QUANH. Phân biệt bằng quãng đường chuột đi và
     thời gian giữ. */
  var keoXa = 0, keoLuc = 0;

  dom.addEventListener('mousedown', function (e) {
    if (!P.enabled || P.camUng) return;

    /* chuotTuDo: không xin khoá con trỏ, để người chơi thấy và bấm được */
    if (!P.locked && !P.lockBroken && !P.chuotTuDo) {
      P.grab();
      return;
    }
    if (P.locked) {
      if (e.button === 0) mouseAct = 1;
      if (e.button === 2) mouseAct = -1;
    } else {
      dragging = true;
      keoXa = 0;
      keoLuc = performance.now();
      dom.style.cursor = 'grabbing';
    }
  });

  addEventListener('mouseup', function (e) {
    if ((e.button === 0 && mouseAct === 1) || (e.button === 2 && mouseAct === -1)) mouseAct = 0;
    if (dragging) {
      dragging = false;
      dom.style.cursor = '';
      var nhanh = performance.now() - keoLuc < 400;
      if (e.button === 0 && keoXa < 6 && nhanh && P.onClick) P.onClick(e);
    }
  });

  /* ---------- API ---------- */

  /* Xin khoá con trỏ; thất bại thì chuyển hẳn sang chế độ dự phòng. */
  P.grab = function () {
    if (P.camUng) return;
    if (P.lockBroken) { if (P.onModeChange) P.onModeChange(); return; }
    try { dom.requestPointerLock(); }
    catch (e) { P.lockBroken = true; if (P.onModeChange) P.onModeChange(); }
  };

  P.release = function () {
    mouseAct = 0;
    touchAct = 0;
    if (P.locked) document.exitPointerLock();
  };

  /* Đầu vào "tác động": +1 cấp nhiệt / tăng, -1 làm lạnh / giảm, 0 nghỉ.
     Bàn phím F/R luôn dùng được ở cả hai chế độ. */
  P.action = function () {
    if (!P.enabled) return 0;
    if (keys['KeyF'] || keys['k_f'] || keys['KeyE'] || keys['k_e'] || keys['Space']) return 1;
    if (keys['KeyR'] || keys['k_r'] || keys['KeyQ'] || keys['k_q']) return -1;
    return mouseAct || touchAct;
  };

  /* ---------- API cho lớp cảm ứng ---------- */

  /* v: +1 / -1 / 0. Thả một nút (v = 0, chiKhi = giá trị của nút đó) chỉ
     tắt tác động nếu nút kia không đang được giữ thay. */
  P.datTacDong = function (v, chiKhi) {
    if (v === 0 && chiKhi !== undefined && touchAct !== chiKhi) return;
    touchAct = v;
  };

  /* Trục cần điều khiển, mỗi thành phần -1..1; độ dài 1 = đẩy hết cỡ. */
  P.datTruc = function (x, y) { truc.x = x; truc.y = y; };

  P.nhinThem = function (dYaw, dPitch) {
    if (!P.enabled) return;
    P.yaw -= dYaw;
    P.pitch -= dPitch;
    P.pitch = Math.max(-1.35, Math.min(1.2, P.pitch));
  };

  /* Chạm nhanh lên cảnh = một cú bấm chuột tại điểm đó. */
  P.cham = function (x, y) {
    if (!P.enabled || !P.onClick) return;
    P.chuot.x = x; P.chuot.y = y;
    try { P.onClick({ button: 0, clientX: x, clientY: y }); }
    finally { veTam(); }
  };

  P.key = function (code) { return !!keys[code]; };

  /* Không truyền yaw thì quay mặt về tâm phòng (0, 0) — yaw 0 là nhìn về -Z. */
  P.spawn = function (x, z, yaw) {
    P.pos.set(x, P.CAO_MAT, z);
    P.yaw = (yaw === undefined) ? ((x || z) ? Math.atan2(x, z) : 0) : yaw;
    P.pitch = -0.05;
  };

  /* Gọi sau khi phòng dựng xong, để mắt đứng đúng cao độ ngay khung hình đầu. */
  P.batDatDat = function () {
    P.pos.y = (P.groundAt ? P.groundAt(P.pos.x, P.pos.z) : 0) + P.CAO_MAT;
  };

  /* Khoảng cách phẳng từ người chơi tới một điểm */
  P.distTo = function (x, z) {
    return Math.hypot(P.pos.x - x, P.pos.z - z);
  };

  P.update = function (dt) {
    if (!P.enabled) return;

    var truocX = P.pos.x, truocZ = P.pos.z;

    var sp = (keys['ShiftLeft'] ? 5.0 : 3.0) * dt;
    var fx = truc.x, fz = truc.y;
    if (keys['KeyW'] || keys['ArrowUp'])    fz += 1;
    if (keys['KeyS'] || keys['ArrowDown'])  fz -= 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  fx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) fx += 1;

    if (fx || fz) {
      var len = Math.hypot(fx, fz);
      /* phím: luôn đủ tốc; cần analog: đi chậm khi đẩy nhẹ, chạy khi đẩy hết cỡ */
      var muc = Math.min(1, len);
      if (!keys['ShiftLeft'] && muc > 0.94 && (truc.x || truc.y)) sp *= 5.0 / 3.0;
      fx = fx / len * muc; fz = fz / len * muc;
      var s = Math.sin(P.yaw), c = Math.cos(P.yaw);
      P.pos.x += (-fz * s + fx * c) * sp;
      P.pos.z += (-fz * c - fx * s) * sp;
      bobT += dt * 8 * muc;
    }

    /* chặn tường */
    var lim = P.bounds;
    P.pos.x = Math.max(-lim, Math.min(lim, P.pos.x));
    P.pos.z = Math.max(-lim, Math.min(lim, P.pos.z));

    /* chặn vật cản tròn */
    for (var i = 0; i < P.blockers.length; i++) {
      var b = P.blockers[i];
      var dx = P.pos.x - b.x, dz = P.pos.z - b.z;
      var d = Math.hypot(dx, dz);
      if (d < b.r && d > 0.0001) {
        P.pos.x = b.x + dx / d * b.r;
        P.pos.z = b.z + dz / d * b.r;
      }
    }

    /* chặn theo hình dạng riêng của không gian (vành khuyên của cầu thang xoắn) */
    if (P.constrain) P.constrain(P.pos, truocX, truocZ);

    /* bám theo địa hình */
    if (P.groundAt) {
      var dat = P.groundAt(P.pos.x, P.pos.z) + P.CAO_MAT;
      P.pos.y += (dat - P.pos.y) * Math.min(1, dt * 14);   // lên bậc mượt, không giật
    } else {
      P.pos.y = P.CAO_MAT;
    }
  };

  /* Đặt camera theo trạng thái người chơi, kèm nhún nhẹ khi đi bộ. */
  P.applyTo = function (camera, shake) {
    camera.position.copy(P.pos);
    camera.position.y += Math.sin(bobT) * 0.012;
    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake * 0.12;
      camera.position.y += (Math.random() - 0.5) * shake * 0.12;
    }
    camera.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
  };
};
