/* ═══════════════════════════════════════════════════════════════════
   NGƯỜI CHƠI — di chuyển, góc nhìn, và đầu vào "tác động".

   Hai chế độ điều khiển, tự nhận diện:
   - Có pointer lock (chạy qua http/localhost): chuột tự do, nút chuột
     trái/phải là tác động.
   - Không có (mở bằng file://): kéo chuột để nhìn, phím F/R là tác động.
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
  var bobT = 0;

  /* --- môi trường không cho khoá con trỏ --- */
  if (!('requestPointerLock' in dom) || location.protocol === 'file:') {
    P.lockBroken = true;
  }

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

  document.addEventListener('mousemove', function (e) {
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
    if (!P.enabled) return;

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
    if (P.lockBroken) { if (P.onModeChange) P.onModeChange(); return; }
    try { dom.requestPointerLock(); }
    catch (e) { P.lockBroken = true; if (P.onModeChange) P.onModeChange(); }
  };

  P.release = function () {
    mouseAct = 0;
    if (P.locked) document.exitPointerLock();
  };

  /* Đầu vào "tác động": +1 cấp nhiệt / tăng, -1 làm lạnh / giảm, 0 nghỉ.
     Bàn phím F/R luôn dùng được ở cả hai chế độ. */
  P.action = function () {
    if (!P.enabled) return 0;
    if (keys['KeyF'] || keys['k_f'] || keys['KeyE'] || keys['k_e'] || keys['Space']) return 1;
    if (keys['KeyR'] || keys['k_r'] || keys['KeyQ'] || keys['k_q']) return -1;
    return mouseAct;
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
    var fx = 0, fz = 0;
    if (keys['KeyW'] || keys['ArrowUp'])    fz += 1;
    if (keys['KeyS'] || keys['ArrowDown'])  fz -= 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  fx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) fx += 1;

    if (fx || fz) {
      var len = Math.hypot(fx, fz); fx /= len; fz /= len;
      var s = Math.sin(P.yaw), c = Math.cos(P.yaw);
      P.pos.x += (-fz * s + fx * c) * sp;
      P.pos.z += (-fz * c - fx * s) * sp;
      bobT += dt * 8;
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
