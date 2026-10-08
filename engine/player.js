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
  var doCao = 0, vy = 0;    // nhảy: độ cao trên mặt sàn và vận tốc dọc
  var hanNhay = 0;          // còn bao lâu thì cú nhấn Space hết hiệu lực
  var vx = 0, vz = 0;       // vận tốc ngang thật (sau va chạm)
  var bobBien = 0;          // biên độ nhún bước, tắt dần khi đứng lại
  var nhun = 0;             // nhún xuống khi tiếp đất

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
    if (e.code === 'Space' && !e.repeat && P.enabled) hanNhay = 0.15;
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
    hanNhay = 0;
    dragging = false;
    dom.style.cursor = '';
  });

  /* ---------- góc nhìn ---------- */
  function look(dx, dy) {
    P.yaw   -= dx * 0.0022;
    P.pitch -= dy * 0.0022;
    P.pitch = Math.max(-1.35, Math.min(1.2, P.pitch));
  }

  var daKhoaDuoc = false;    // đã từng khoá thành công ít nhất một lần
  document.addEventListener('pointerlockchange', function () {
    P.locked = document.pointerLockElement === dom;
    if (P.locked) daKhoaDuoc = true;
    if (!P.locked) mouseAct = 0;
  });
  /* Chrome từ chối khoá lại trong khoảng một giây sau khi người chơi nhấn
     Esc. Đã từng khoá được thì đó chỉ là lỗi tạm — bấm lần sau sẽ thử lại.
     Chưa từng khoá được lần nào thì môi trường không hỗ trợ: chuyển hẳn
     sang chế độ kéo chuột. */
  document.addEventListener('pointerlockerror', function () {
    if (daKhoaDuoc) return;
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
    if (keys['KeyF'] || keys['k_f'] || keys['KeyE'] || keys['k_e']) return 1;
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
    doCao = vy = vx = vz = nhun = 0;
    P.yaw = (yaw === undefined) ? ((x || z) ? Math.atan2(x, z) : 0) : yaw;
    P.pitch = -0.05;
  };

  /* Gọi sau khi phòng dựng xong, để mắt đứng đúng cao độ ngay khung hình đầu. */
  P.batDatDat = function () {
    doCao = vy = vx = vz = nhun = 0;
    P.pos.y = (P.groundAt ? P.groundAt(P.pos.x, P.pos.z) : 0) + P.CAO_MAT;
  };

  /* Khoảng cách phẳng từ người chơi tới một điểm */
  P.distTo = function (x, z) {
    return Math.hypot(P.pos.x - x, P.pos.z - z);
  };

  P.update = function (dt) {
    if (!P.enabled) { vx = vz = 0; return; }   // đang đọc thẻ: dừng hẳn, không trôi

    var truocX = P.pos.x, truocZ = P.pos.z;
    var trenKhong = doCao > 0 || vy > 0;

    var sp = keys['ShiftLeft'] ? 5.0 : 3.0;
    var fx = truc.x, fz = truc.y;
    if (keys['KeyW'] || keys['ArrowUp'])    fz += 1;
    if (keys['KeyS'] || keys['ArrowDown'])  fz -= 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  fx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) fx += 1;

    /* vận tốc muốn đạt theo hướng nhìn */
    var mx = 0, mz = 0;
    if (fx || fz) {
      var len = Math.hypot(fx, fz);
      /* phím: luôn đủ tốc; cần analog: đi chậm khi đẩy nhẹ, chạy khi đẩy hết cỡ */
      var muc = Math.min(1, len);
      if (!keys['ShiftLeft'] && muc > 0.94 && (truc.x || truc.y)) sp *= 5.0 / 3.0;
      fx = fx / len * muc; fz = fz / len * muc;
      var s = Math.sin(P.yaw), c = Math.cos(P.yaw);
      mx = (-fz * s + fx * c) * sp;
      mz = (-fz * c - fx * s) * sp;
    }

    /* tăng tốc / hãm dần thay vì bật tắt tức thì; trên không thì
       khó đổi hướng hơn, giữ được đà của cú nhảy */
    var k = 1 - Math.exp(-dt * (trenKhong ? 3 : (mx || mz ? 12 : 10)));
    vx += (mx - vx) * k;
    vz += (mz - vz) * k;
    if (Math.abs(vx) < 1e-3 && Math.abs(vz) < 1e-3 && !mx && !mz) vx = vz = 0;
    P.pos.x += vx * dt;
    P.pos.z += vz * dt;

    /* nhún bước theo tốc độ thật; tắt khi đang nhảy */
    var tocDo = Math.hypot(vx, vz);
    bobT += dt * 8 * Math.min(1.4, tocDo / 3);
    var bobMuon = trenKhong ? 0 : Math.min(1, tocDo / 3);
    bobBien += (bobMuon - bobBien) * (1 - Math.exp(-dt * 8));

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

    /* bám theo địa hình (tính trên cao độ chân, chưa cộng cú nhảy) */
    var nen = P.pos.y - doCao;
    if (P.groundAt) {
      var dat = P.groundAt(P.pos.x, P.pos.z) + P.CAO_MAT;
      nen += (dat - nen) * Math.min(1, dt * 14);   // lên bậc mượt, không giật
    } else {
      nen = P.CAO_MAT;
    }

    /* nhảy: Space, chỉ khi đang đứng trên sàn; cao chừng 0,75 m.
       Nhấn sớm một chút trước khi chạm đất vẫn tính (hanNhay). */
    if (hanNhay > 0) hanNhay -= dt;
    if (hanNhay > 0 && doCao === 0 && vy <= 0) { vy = 4.6; hanNhay = 0; }
    if (doCao > 0 || vy > 0) {
      /* rơi nhanh hơn lúc lên: cú nhảy chắc tay, không lơ lửng */
      vy -= (vy > 0 ? 13 : 18) * dt;
      doCao += vy * dt;
      if (doCao <= 0) {
        nhun = Math.min(0.09, -vy * 0.016);   // tiếp đất: khuỵu nhẹ
        doCao = vy = 0;
      }
    }
    nhun *= Math.exp(-dt * 9);
    P.pos.y = nen + doCao;

    /* vận tốc thật sau va chạm: đâm tường thì mất đà, không trượt dính */
    if (dt > 0) {
      vx = (P.pos.x - truocX) / dt;
      vz = (P.pos.z - truocZ) / dt;
      /* bị đẩy bật khỏi vật cản (vd. vừa xuất hiện trong bệ) không được thành đà */
      var vMax = 9, v = Math.hypot(vx, vz);
      if (v > vMax) { vx *= vMax / v; vz *= vMax / v; }
    }
  };

  /* Đặt camera theo trạng thái người chơi, kèm nhún nhẹ khi đi bộ. */
  P.applyTo = function (camera, shake) {
    camera.position.copy(P.pos);
    camera.position.y += Math.sin(bobT) * 0.014 * bobBien - nhun;
    if (shake > 0) {
      camera.position.x += (Math.random() - 0.5) * shake * 0.12;
      camera.position.y += (Math.random() - 0.5) * shake * 0.12;
    }
    camera.rotation.set(P.pitch, P.yaw, 0, 'YXZ');
  };
};
