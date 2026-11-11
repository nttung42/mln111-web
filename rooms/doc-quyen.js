/* ═══════════════════════════════════════════════════════════════════
   PHÒNG — CỜ TỶ PHÚ  (Độc quyền)          id: doc-quyen · tầng cao nhất

   Giữa phòng là bàn cờ tỷ phú khổng lồ, đầy quân cờ nhỏ (mỗi quân một
   doanh nghiệp). Bốn góc phòng là bốn vấn đề:

     1. Góc Định Nghĩa       — ba hồ sơ, ba dạng độc quyền; dây chuyền
                               Cartel → Syndicate → Trust → Concern.
     2. Góc Vòng Xoáy        — cỗ máy năm bánh răng, bốn rương lý do,
                               nhà kinh tế phản biện, hai hồ sơ vụ án.
     3. Góc Hiện Trường      — Grab–Uber: dựng lại vụ việc, đổi vai
                               khách / tài xế / Grab, cái cân hai đĩa.
     4. Góc Việt Nam         — cánh cửa ba tay nắm, ba bàn làm việc,
                               so sánh điện lực với vàng miếng.

   Mỗi góc cho một MẢNH BẰNG CHỨNG. Mỗi mảnh làm quân cờ trên bàn gộp
   lại một bậc (16 → 8 → 4 → 2 → 1). Đủ bốn mảnh thì bấm vào cầu thang
   xoắn ở giữa bàn cờ để lập luận trước Hội đồng; không có đáp án đúng
   tuyệt đối, game chấm theo mức độ lập luận bằng bằng chứng.

   Phòng dùng chuột tự do (chuotTuDo): bấm thẳng vào góc để mở bàn việc.
   Các trò chơi nhỏ dựng bằng DOM (không dùng canvas) để hỗ trợ kéo thả,
   bấm, và cả cảm ứng. Chữ nằm ở content/phong/doc-quyen.js.
   ═══════════════════════════════════════════════════════════════════ */

(function (TX) {
  'use strict';

  var A = TX.dqAssets;       // tài nguyên 3D dựng riêng (rooms/doc-quyen-assets.js)
  var THREE_ = null;       // gán trong build
  var S, o;

  /* ---------- bố cục (m) ---------- */
  var VITRI = [[-11, -11], [11, -11], [11, 11], [-11, 11]];   // bốn đảo, quanh đảo giữa
  var DAO_Y = [1.2, 3.6, 0.6, 2.8];                          // độ cao mỗi đảo
  var MAY_X = 5.2;                                           // máy nhận thẻ đứng ở rìa đông đảo giữa, quay mặt ra ngoài
  var BAN_NUA = 2.8;       // nửa cạnh bàn cờ
  var BAN_CAO = 0.64;      // mặt bàn
  var VONG = 2.42;         // quân cờ đứng trên dải ô viền, cách tâm chừng này
  var SO_QUAN = 16;
  var MAU_GOC = [0xc9a24a, 0x4f8fd6, 0xd9703a, 0x4aa57a];
  var MAU_QUAN = [0xd84a4a, 0x4a7fd8, 0x3fae73, 0xe0b23a, 0x9a5fd0, 0xe07a3c, 0x35aab5, 0xc9588f];

  /* ═══════════ tiện ích DOM ═══════════ */

  function h(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  /* Xáo ngẫu nhiên thuần: dùng cho các lựa chọn của câu hỏi, để đáp án đúng rơi vào vị trí bất kỳ.
     (tron() bên dưới cố tình KHÔNG trả về đúng thứ tự gốc, hợp với bài xếp thứ tự nhưng với
     câu hỏi hai lựa chọn thì đáp án đúng luôn bị đẩy xuống ô số 2.) */
  function xao(m) {
    var a = m.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function tron(m) {
    var a = m.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    /* tránh trường hợp xáo ra đúng thứ tự gốc */
    if (a.length > 1 && a.every(function (x, i) { return x === m[i]; })) a.push(a.shift());
    return a;
  }

  var CSS = [
    '.dq-bar{position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:11;display:flex;gap:8px;pointer-events:none}',
    '.dq-chip{padding:7px 13px;border-radius:999px;background:var(--kinh);backdrop-filter:blur(8px);border:1px solid var(--vien);',
    ' font-size:12px;color:var(--mo);letter-spacing:.04em;white-space:nowrap}',
    '.dq-chip b{color:var(--muc2);font-weight:500}',
    '.dq-chip.xong{color:var(--muc);border-color:var(--vang);background:rgba(255,246,222,.85)}',
    '.dq-chip.xong::before{content:"✦ ";color:var(--vang)}',
    '.dq-ov{position:fixed;inset:0;z-index:15;display:flex;align-items:center;justify-content:center;padding:20px;',
    ' background:radial-gradient(ellipse at 50% 40%,rgba(255,253,248,.5),rgba(236,228,216,.78));',
    ' backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}',
    '.dq-box{position:relative;width:min(900px,100%);max-height:calc(100vh - 40px);overflow-y:auto;padding:28px 32px 26px;border-radius:18px;',
    ' background:radial-gradient(120% 60% at 0% 0%,rgba(255,226,244,.5),transparent 60%),radial-gradient(120% 60% at 100% 100%,rgba(214,232,255,.55),transparent 60%),linear-gradient(160deg,#fffdf9,#f6f0e7);',
    ' border:1px solid var(--vien);box-shadow:var(--bong),inset 0 1px 0 #fff}',
    '.dq-box .eb{font-size:10.5px;letter-spacing:.3em;color:var(--vang);text-transform:uppercase}',
    '.dq-box h1{font-family:var(--serif);font-size:32px;font-weight:600;margin:6px 0 4px;line-height:1.15;color:var(--muc)}',
    '.dq-box h2{font-family:var(--serif);font-size:22px;font-weight:600;margin:16px 0 6px;color:var(--muc)}',
    '.dq-box p{font-size:14.5px;line-height:1.65;color:var(--muc2);margin:0 0 10px}',
    '.dq-x{position:absolute;top:14px;right:16px;border:1px solid var(--vien);background:rgba(255,255,255,.7);color:var(--muc2);',
    ' border-radius:999px;padding:6px 14px;font-size:12px;cursor:pointer;font-family:inherit}',
    '.dq-x:hover{border-color:var(--vang);color:var(--muc)}',
    '.dq-buoc{display:flex;gap:6px;margin:10px 0 4px}',
    '.dq-buoc i{height:4px;flex:1;border-radius:2px;background:rgba(184,140,70,.2)}',
    '.dq-buoc i.on{background:var(--vang)}',
    '.dq-nut{display:inline-block;margin-top:14px;padding:11px 26px;border-radius:999px;border:1px solid var(--vang);cursor:pointer;',
    ' background:linear-gradient(180deg,#fff7e2,#f1dfb4);color:#5a431a;font-size:14px;font-family:inherit;letter-spacing:.03em}',
    '.dq-nut:hover{filter:brightness(1.04)}',
    '.dq-nut[disabled]{opacity:.45;cursor:default}',
    '.dq-nut.phu{background:rgba(255,255,255,.7);color:var(--muc2);border-color:var(--vien);margin-left:8px}',
    '.dq-msg{min-height:22px;font-size:13.5px;margin:8px 0 2px;color:var(--muc2);line-height:1.55}',
    '.dq-msg.sai{color:#a5472f}.dq-msg.dung{color:#3b7b50}',
    '.dq-slots{display:grid;gap:10px;margin:10px 0}',
    '.dq-slot{border:1.5px dashed rgba(184,140,70,.55);border-radius:12px;padding:10px 12px;min-height:84px;background:rgba(255,255,255,.55);transition:box-shadow .15s,border-color .15s}',
    '.dq-slot.san{border-color:var(--vang);box-shadow:0 0 0 3px rgba(184,140,70,.2);cursor:pointer}',
    '.dq-slot .st{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--vang);font-weight:500}',
    '.dq-slot .sg{font-size:12px;color:var(--mo);margin:2px 0 6px;line-height:1.4}',
    '.dq-slot.lac{animation:dqlac .4s}',
    '@keyframes dqlac{20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}',
    '.dq-tray{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0;min-height:30px}',
    '.dq-the{border:1px solid var(--vien);border-radius:10px;padding:9px 12px;background:#fffdf8;cursor:grab;max-width:300px;',
    ' box-shadow:0 2px 8px rgba(120,90,50,.1);user-select:none;-webkit-user-select:none;transition:transform .12s,box-shadow .12s}',
    '.dq-the b{display:block;font-size:13.5px;color:var(--muc);font-weight:500}',
    '.dq-the span{display:block;font-size:12.5px;line-height:1.5;color:var(--muc2);margin-top:3px}',
    '.dq-the i{display:block;font-size:12px;color:var(--vang);margin-top:4px}',
    '.dq-the.chon{transform:translateY(-3px);border-color:var(--vang);box-shadow:0 0 0 3px rgba(184,140,70,.3),0 6px 14px rgba(120,90,50,.18)}',
    '.dq-the.dung{cursor:default;background:#f6fbf3;border-color:rgba(70,140,90,.5);box-shadow:none;margin-top:6px;max-width:none}',
    '.dq-q{padding:14px 16px;border-radius:12px;background:rgba(255,255,255,.7);border:1px solid var(--vien);margin:10px 0}',
    '.dq-q .qt{font-size:15px;line-height:1.55;color:var(--muc);margin-bottom:8px}',
    '.dq-y{position:fixed;left:50%;bottom:84px;transform:translateX(-50%);z-index:12;width:min(620px,92vw);padding:16px 20px 14px;border-radius:16px;',
    ' background:linear-gradient(160deg,rgba(255,253,248,.97),rgba(246,240,231,.97));border:1px solid var(--vang);box-shadow:var(--bong);animation:dqy .5s ease-out}',
    '@keyframes dqy{from{opacity:0;transform:translate(-50%,16px)}to{opacity:1;transform:translate(-50%,0)}}',
    '.dq-y .eb{font-size:10.5px;letter-spacing:.28em;color:var(--vang);text-transform:uppercase}',
    '.dq-y h3{font-family:var(--serif);font-size:21px;margin:4px 0 6px;color:var(--muc);line-height:1.2;font-weight:600}',
    '.dq-y p{font-size:14px;line-height:1.6;color:var(--muc2);margin:0 0 6px}',
    '.dq-y .qd{font-size:12.5px;color:var(--vang);margin:2px 0 8px}',
    'html.cam-ung .dq-y{bottom:56px;padding:10px 14px;width:min(560px,94vw)}html.cam-ung .dq-y h3{font-size:16px}html.cam-ung .dq-y p{font-size:12px;line-height:1.45}',
    '.dq-goiy{padding:9px 12px;margin:0 0 8px;border-radius:10px;background:#fff6df;border:1px dashed rgba(184,140,70,.6);font-size:13.5px;line-height:1.55;color:var(--muc2)}',
    '.dq-goiy b{color:var(--vang);font-weight:500}',
    '.dq-chip.cam{color:#4a3510;border-color:var(--vang);background:linear-gradient(180deg,#fff7e2,#f1dfb4)}',
    '.dq-chip.cam::before{content:"🂠 ";color:var(--vang)}',
    '.dq-op{display:block;width:100%;text-align:left;margin:6px 0;padding:10px 13px;border-radius:10px;border:1px solid var(--vien);',
    ' background:#fffdf8;color:var(--muc);font-size:14px;line-height:1.45;cursor:pointer;font-family:inherit}',
    '.dq-op:hover:not([disabled]){border-color:var(--vang);background:#fff8e8}',
    '.dq-op.dung{background:#eef8ea;border-color:rgba(70,140,90,.6)}',
    '.dq-op.sai{background:#fbece6;border-color:rgba(190,90,60,.5);opacity:.75}',
    '.dq-op[disabled]{cursor:default}',
    '.dq-ruong{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:10px;margin:10px 0}',
    '.dq-r{border:1px solid var(--vien);border-radius:12px;padding:12px;background:rgba(255,255,255,.65);text-align:center}',
    '.dq-r .bx{font-size:34px;line-height:1;margin-bottom:6px;filter:grayscale(.6)}',
    '.dq-r.mo .bx{filter:none}',
    '.dq-r b{display:block;font-size:13px;color:var(--muc)}',
    '.dq-r span{display:block;font-size:12.5px;color:var(--muc2);line-height:1.5;margin-top:4px}',
    '.dq-tabs{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0}',
    '.dq-tab{padding:8px 14px;border-radius:999px;border:1px solid var(--vien);background:rgba(255,255,255,.7);cursor:pointer;font-size:13px;color:var(--muc2);font-family:inherit}',
    '.dq-tab.on{border-color:var(--vang);background:#fff3d6;color:var(--muc)}',
    '.dq-tab.ok::after{content:" ✓";color:#3b7b50}',
    '.dq-tr{border-left:2px solid var(--vangN);padding:4px 0 4px 14px;margin:12px 0;font-family:var(--serif);font-size:18px;color:var(--muc)}',
    '.dq-tr cite{display:block;font-size:12.5px;color:var(--mo);font-style:normal;margin-top:4px;font-family:inherit}',
    '.dq-ds{margin:6px 0 10px;padding-left:20px;font-size:14px;line-height:1.65;color:var(--muc2)}',
    '.dq-vu{padding:12px 14px;border-radius:10px;background:#fff6e2;border:1px solid rgba(184,140,70,.4);font-size:14px;line-height:1.65;color:var(--muc2);margin:10px 0}',
    '.dq-npc{display:flex;gap:12px;align-items:flex-start;margin:10px 0}',
    '.dq-npc .av{flex:none;width:44px;height:44px;border-radius:50%;background:linear-gradient(160deg,#e9d6ff,#b9d0ff);display:flex;align-items:center;justify-content:center;font-size:22px}',
    '.dq-npc .bb{padding:11px 14px;border-radius:4px 14px 14px 14px;background:rgba(255,255,255,.85);border:1px solid var(--vien);font-size:14px;line-height:1.6;color:var(--muc)}',
    '.dq-manh{text-align:center;padding:10px 0 4px}',
    '.dq-manh .kc{display:inline-block;width:92px;height:92px;line-height:92px;font-size:44px;border-radius:22px;transform:rotate(45deg);',
    ' background:linear-gradient(135deg,#fff3c9,#e2b95a);box-shadow:0 0 40px rgba(226,185,90,.55);margin:22px 0 28px}',
    '.dq-manh .kc span{display:block;transform:rotate(-45deg);color:#6b4d12}',
    '.dq-can{position:relative;height:96px;margin:6px 0 2px}',
    '.dq-can .dam{position:absolute;left:12%;right:12%;top:22px;height:5px;border-radius:3px;background:linear-gradient(90deg,#c9a24a,#e8cf8d,#c9a24a);transition:transform .5s;transform-origin:50% 50%}',
    '.dq-can .tru{position:absolute;left:50%;top:22px;width:6px;height:70px;margin-left:-3px;background:#c9a24a;border-radius:3px}',
    '.dq-can .dia{position:absolute;top:34px;font-size:11px;color:var(--muc2);text-align:center;width:90px;margin-left:-45px;transition:transform .5s}',
    '.dq-can .dia::before{content:"";display:block;margin:0 auto 3px;width:2px;height:22px;background:#c9a24a}',
    '.dq-can .dia em{display:block;font-style:normal;padding:3px 0;border-radius:0 0 40px 40px;background:#fff3d6;border:1px solid var(--vang)}',
    '.dq-tb{width:100%;border-collapse:collapse;margin:8px 0;font-size:13.5px}',
    '.dq-tb td,.dq-tb th{border:1px solid var(--vien);padding:8px 10px;text-align:left;line-height:1.5;color:var(--muc2);vertical-align:top}',
    '.dq-tb th{background:rgba(255,243,214,.7);color:var(--muc);font-weight:500}',
    '.dq-ls{display:grid;gap:10px;margin:10px 0}',
    '.dq-ev{display:flex;gap:10px;align-items:flex-start;padding:10px 12px;border:1px solid var(--vien);border-radius:10px;background:rgba(255,255,255,.65);cursor:pointer;font-size:13.5px;line-height:1.5;color:var(--muc2)}',
    '.dq-ev.on{border-color:var(--vang);background:#fff6df}',
    '.dq-ev b{display:block;color:var(--muc);font-weight:500}',
    '.dq-ev .ck{flex:none;width:18px;height:18px;border-radius:5px;border:1.5px solid var(--vang);margin-top:2px;display:flex;align-items:center;justify-content:center;font-size:12px;color:#6b4d12}',
    '.dq-lt{padding:12px 14px;border-radius:12px;border:1px solid var(--vien);background:rgba(255,255,255,.7);cursor:pointer;margin:8px 0;color:var(--muc2);font-size:14px;line-height:1.55}',
    '.dq-lt b{display:block;color:var(--muc);font-size:15px;font-weight:500}',
    '.dq-lt.on{border-color:var(--vang);background:#fff6df}',
    '.dq-ga{padding:14px 16px;border-radius:12px;background:#fffaf0;border:1px solid rgba(184,140,70,.4);margin:10px 0;font-size:14.5px;line-height:1.7;color:var(--muc)}',
    '.dq-ga li{margin:4px 0}',
    /* điện thoại ngang: thanh bốn góc nhỏ lại, hạ xuống dưới nhãn phòng để khỏi chồng lên */
    'html.cam-ung .dq-bar{top:64px;gap:5px}',
    '@media(max-height:480px){.dq-slot .sg{font-size:11px;margin:1px 0 3px;line-height:1.3}.dq-slot{min-height:54px;padding:7px 10px}.dq-box p{font-size:13px;margin-bottom:6px;line-height:1.5}',
    ' .dq-box h2{margin:8px 0 4px;font-size:18px}.dq-tray{margin:4px 0}.dq-q{padding:10px 12px;margin:6px 0}.dq-the{padding:7px 10px}.dq-msg{margin:4px 0 0;min-height:16px}}',
    'html.cam-ung .dq-chip{padding:3px 9px;font-size:10.5px}',
    'html.cam-ung .dq-box{padding:18px 20px 16px;max-height:calc(100vh - 16px)}',
    'html.cam-ung .dq-box h1{font-size:24px}',
    'html.cam-ung .dq-ov{padding:8px}',
    '@media(max-width:640px){.dq-box{padding:22px 16px 18px}.dq-box h1{font-size:25px}.dq-bar{top:60px;flex-wrap:wrap;justify-content:center;max-width:94vw}.dq-the{max-width:none;flex:1 1 100%}.dq-x{position:static;margin-bottom:8px}}'
  ].join('\n');

  /* ═══════════ thành phần trò chơi nhỏ ═══════════ */

  /* Ghép thẻ vào ô. Chọn thẻ rồi bấm ô, hoặc kéo thả.
     cfg: { o: [{id,ten,goiY}], the: [{id,dap,ten,mo,vd}], nhieu, sai, cot,
            onDat(card, slot), dungDat(card, slot, tiep) } */
  function taoGhep(host, cfg, onDone) {
    var L = S.text.ui;
    var msg = h('div', 'dq-msg', L.chonThe);
    var luoi = h('div', 'dq-slots');
    luoi.style.gridTemplateColumns = 'repeat(' + (cfg.cot || Math.min(cfg.o.length, 3)) + ',minmax(0,1fr))';
    var khay = h('div', 'dq-tray');
    var chon = null, khoa = false, conLai = cfg.the.length, xong = false;
    var tuId = {};

    cfg.o.forEach(function (s) {
      var e = h('div', 'dq-slot');
      e.appendChild(h('div', 'st', s.ten));
      if (s.goiY) e.appendChild(h('div', 'sg', s.goiY));
      var body = h('div', 'sb');
      e.appendChild(body);
      e.dataset.id = s.id;
      e._slot = s; e._body = body;
      e.addEventListener('click', function () { if (chon) dat(chon, e); });
      e.addEventListener('dragover', function (ev) { ev.preventDefault(); });
      e.addEventListener('drop', function (ev) {
        ev.preventDefault();
        var id = ev.dataTransfer.getData('text/plain');
        if (tuId[id]) dat(tuId[id], e);
      });
      luoi.appendChild(e);
    });

    function boChon() {
      if (chon) chon.classList.remove('chon');
      chon = null;
      Array.prototype.forEach.call(luoi.children, function (c) { c.classList.remove('san'); });
    }

    tron(cfg.the).forEach(function (c) {
      var e = h('div', 'dq-the');
      e.appendChild(h('b', null, c.ten));
      if (c.mo) e.appendChild(h('span', null, c.mo));
      if (c.vd) e.appendChild(h('i', null, c.vd));
      e.draggable = true;
      e._card = c;
      tuId[c.id] = e;
      e.addEventListener('dragstart', function (ev) { ev.dataTransfer.setData('text/plain', c.id); });
      e.addEventListener('click', function (ev) {
        ev.stopPropagation();
        if (khoa || xong || e.classList.contains('dung')) return;
        var bo = chon === e;
        boChon();
        if (bo) return;
        chon = e;
        e.classList.add('chon');
        Array.prototype.forEach.call(luoi.children, function (s) { s.classList.add('san'); });
      });
      khay.appendChild(e);
    });

    function dat(e, slotEl) {
      if (khoa || xong) return;
      var c = e._card, s = slotEl._slot;
      boChon();
      if (c.dap !== s.id) {
        slotEl.classList.remove('lac'); void slotEl.offsetWidth; slotEl.classList.add('lac');
        var t = typeof cfg.sai === 'object' ? (cfg.sai[s.id] || '') : (cfg.sai || '');
        msg.className = 'dq-msg sai';
        msg.innerHTML = L.chuaDung + ' ' + t;
        S.ctx.audio.diemNut();
        return;
      }
      e.classList.add('dung');
      e.draggable = false;
      slotEl._body.appendChild(e);
      conLai--;
      msg.className = 'dq-msg dung';
      msg.innerHTML = L.daDung;
      S.ctx.audio.the();
      if (cfg.onDat) cfg.onDat(c, s);
      var tiep = function () {
        khoa = false;
        if (conLai === 0) { xong = true; msg.innerHTML = ''; onDone && onDone(); }
      };
      if (cfg.dungDat) { khoa = true; cfg.dungDat(c, s, tiep); }
      else tiep();
    }

    host.appendChild(luoi);
    host.appendChild(msg);
    host.appendChild(khay);
    return { khay: khay, msg: msg };
  }

  /* Một câu hỏi trắc nghiệm. Đúng thì khóa lại, báo đúng và gọi onDone. */
  function taoTracNghiem(host, q, onDone, nutTiep) {
    var L = S.text.ui;
    var kh = h('div', 'dq-q');
    kh.appendChild(h('div', 'qt', q.q));
    if (q.goiY) kh.appendChild(h('div', 'dq-goiy', '<b>' + L.goiYLabel + ':</b> ' + q.goiY));
    var fb = h('div', 'dq-msg');
    var ops = [];
    /* đáp án đúng luôn viết đầu tiên trong nội dung, nên phải xáo lại */
    /* câu hỏi dễ: chỉ còn hai lựa chọn (một đúng, một sai), trừ khi câu hỏi cần đủ ba (cánh cửa A/B/C) */
    var dsC = q.c;
    if (!q.giu && q.c.length > 2) {
      var dung = q.c.filter(function (c) { return c.ok; })[0];
      var sai = xao(q.c.filter(function (c) { return !c.ok; }))[0];
      dsC = [dung, sai];
    }
    xao(dsC).forEach(function (c) {
      var b = h('button', 'dq-op', c.t);
      b.addEventListener('click', function () {
        if (c.ok) {
          ops.forEach(function (x) { x.disabled = true; });
          b.classList.add('dung');
          fb.className = 'dq-msg dung';
          fb.innerHTML = L.daDung + ' ' + (c.fb || '');
          S.ctx.audio.buocNhay();
          if (nutTiep === false) { onDone && onDone(); return; }
          var n = h('button', 'dq-nut', L.tiep);
          n.addEventListener('click', function () { n.disabled = true; onDone && onDone(); });
          kh.appendChild(n);
        } else {
          b.disabled = true;
          b.classList.add('sai');
          fb.className = 'dq-msg sai';
          fb.innerHTML = L.chuaDung + ' ' + (c.fb || '') + (q.goiY ? ' Đọc lại phần gợi ý rồi thử lại.' : '');
          S.ctx.audio.diemNut();
        }
      });
      ops.push(b);
      kh.appendChild(b);
    });
    kh.appendChild(fb);
    host.appendChild(kh);
    return kh;
  }

  function nutTiep(host, nhan, fn) {
    var n = h('button', 'dq-nut', nhan || S.text.ui.tiep);
    n.addEventListener('click', function () { n.disabled = true; fn(); });
    host.appendChild(n);
    return n;
  }

  /* ═══════════ khung lớp phủ ═══════════ */

  function moLop(nhan, tieuDe, dan, coDong, nhanDong) {
    dongLop();
    var ov = h('div', 'dq-ov');
    var box = h('div', 'dq-box');
    ov.appendChild(box);
    if (coDong !== false) {
      var x = h('button', 'dq-x', '✕ ' + (nhanDong || S.text.ui.dongGoc));
      x.addEventListener('click', dongLop);
      box.appendChild(x);
    }
    box.appendChild(h('div', 'eb', nhan));
    box.appendChild(h('h1', null, tieuDe));
    if (dan) box.appendChild(h('p', null, dan));
    ov.addEventListener('mousedown', function (e) { e.stopPropagation(); });
    document.body.appendChild(ov);
    S.lop = ov;
    S.ctx.khoaNhap = true;
    S.ctx.player.release();
    S.ctx.dom.style.cursor = '';
    return box;
  }

  function dongLop() {
    if (S && S.lop) {
      S.lop.remove();
      S.lop = null;
    }
    if (S && S.ctx) S.ctx.khoaNhap = false;
  }

  /* ═══════════ góc: chạy tuần tự các bước ═══════════ */

  function moGoc(k) {
    var T = S.text, G = T.goc[k];
    var st = S.goc[k];
    var box = moLop('Góc ' + (k + 1) + ' / 4 · ' + G.hoi, G.ten);
    if (st.xong || st.da) { hienManh(k, box, true); return; }

    var steps = cacBuoc(k);
    var thanh = h('div', 'dq-buoc');
    steps.forEach(function () { thanh.appendChild(h('i')); });
    box.appendChild(thanh);
    var host = h('div');
    box.appendChild(host);

    function chay() {
      Array.prototype.forEach.call(thanh.children, function (e, i) { e.className = i <= st.buoc ? 'on' : ''; });
      host.innerHTML = '';
      if (st.buoc >= steps.length) { thanh.remove(); hienManh(k, host, false); return; }
      steps[st.buoc](host, function () { st.buoc++; box.scrollTop = 0; chay(); });
    }
    chay();
  }

  function tieuDeBuoc(host, tieuDe, dan) {
    host.appendChild(h('h2', null, tieuDe));
    if (dan) host.appendChild(h('p', null, dan));
  }

  /* hiện mảnh bằng chứng; lần đầu thì kèm nút nhận */
  function hienManh(k, host, daNhan) {
    var T = S.text, M = T['g' + (k + 1)].manh, L = T.ui;
    host.innerHTML = '';
    var w = h('div', 'dq-manh');
    w.appendChild(h('div', 'eb', L.manh + ' số ' + (k + 1)));
    var kc = h('div', 'kc'); kc.appendChild(h('span', null, '✦')); w.appendChild(kc);
    w.appendChild(h('h2', null, M.ten));
    var p = h('p', null, M.nd); p.style.textAlign = 'left'; w.appendChild(p);
    var p2 = h('p', null, M.them); p2.style.textAlign = 'left'; w.appendChild(p2);
    host.appendChild(w);
    if (daNhan) {
      nutTiep(host, L.xong, dongLop);
    } else {
      nutTiep(host, L.nutThe, function () { dongLop(); nhanThe(k); });
    }
  }

  function buocGhep(cfg, tieuDe, dan, sau) {
    return function (host, tiep) {
      tieuDeBuoc(host, tieuDe, dan);
      var cuoi = h('div');
      var g = taoGhep(host, cfg, function () {
        if (sau) sau(cuoi);
        host.appendChild(cuoi);
        nutTiep(cuoi, null, tiep);
      });
    };
  }

  function cacBuoc(k) {
    var T = S.text;

    /* ---------- góc 1 ---------- */
    if (k === 0) {
      var g = T.g1;
      return [
        buocGhep({ o: g.buoc1.o, the: g.buoc1.the, sai: g.buoc1.sai, cot: 3,
                   onDat: function () { o.tram[0].tienDo++; } },
                 g.buoc1.tieuDe, g.buoc1.dan),
        buocGhep({ o: g.buoc2.o, the: g.buoc2.the, sai: g.buoc2.sai, cot: 4,
                   onDat: function () { o.tram[0].tienDo++; } },
                 g.buoc2.tieuDe, g.buoc2.dan,
                 function (cuoi) { cuoi.appendChild(h('div', 'dq-vu', 'Cartel → Syndicate → Trust → Concern: <b>mức độc lập giảm dần, tính ràng buộc và phụ thuộc tăng dần</b>.')); })
      ];
    }

    /* ---------- góc 2 ---------- */
    if (k === 1) {
      var g2 = T.g2;
      return [
        /* bánh răng */
        function (host, tiep) {
          var b = g2.buoc1;
          tieuDeBuoc(host, b.tieuDe, b.dan);
          var popup = h('div');
          var cuoi = h('div');
          var gh = taoGhep(host, {
            o: b.o, the: b.the, sai: b.sai, cot: 5,
            onDat: function () { o.tram[1].banh++; },
            dungDat: function (c, s, xong) {
              popup.innerHTML = '';
              taoTracNghiem(popup, b.hoi[c.dap], function () { popup.innerHTML = ''; xong(); });
              popup.scrollIntoView && popup.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
          }, function () {
            cuoi.appendChild(h('div', 'dq-tr', b.lenin + '<cite>— ' + b.leninNguon + '</cite>'));
            cuoi.appendChild(h('div', 'dq-vu', b.xoay));
            host.appendChild(cuoi);
            nutTiep(cuoi, null, tiep);
          });
          host.appendChild(popup);
        },
        /* bốn rương */
        function (host, tiep) {
          var b = g2.buoc2;
          tieuDeBuoc(host, b.tieuDe, b.dan);
          var luoi = h('div', 'dq-ruong');
          var vung = h('div');
          var mo = 0;
          b.ruong.forEach(function (r) {
            var e = h('div', 'dq-r');
            e.appendChild(h('div', 'bx', '🎁'));
            e.appendChild(h('b', null, r.ten + ' · ' + r.tieuDe));
            var sp = h('span', null, 'Bấm để mở rương');
            e.appendChild(sp);
            e.style.cursor = 'pointer';
            var dang = false;
            e.addEventListener('click', function () {
              if (dang || e.classList.contains('mo')) return;
              dang = true;
              vung.innerHTML = '';
              vung.appendChild(h('h2', null, r.ten + ': ' + r.tieuDe));
              taoTracNghiem(vung, r, function () {
                e.classList.add('mo');
                e.querySelector('.bx').textContent = '💎';
                sp.innerHTML = r.nd;
                vung.innerHTML = '';
                mo++;
                o.tram[1].ruong = mo;
                dang = false;
                if (mo === b.ruong.length) nutTiep(vung, null, tiep);
              }, false);
              vung.scrollIntoView && vung.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            });
            luoi.appendChild(e);
          });
          host.appendChild(luoi);
          host.appendChild(vung);
        },
        /* nhà kinh tế */
        function (host, tiep) {
          var b = g2.buoc3;
          tieuDeBuoc(host, b.tieuDe);
          var n = h('div', 'dq-npc');
          n.appendChild(h('div', 'av', '🧑‍🏫'));
          n.appendChild(h('div', 'bb', '<b>Nhà kinh tế:</b> ' + b.nhaKinhTe));
          host.appendChild(n);
          var cuoi = h('div');
          taoGhep(host, { o: b.o, the: b.the, sai: b.sai, cot: 2 }, function () {
            cuoi.appendChild(h('div', 'dq-vu', b.ketLuan));
            host.appendChild(cuoi);
            nutTiep(cuoi, null, tiep);
          });
        },
        /* hồ sơ vụ án */
        function (host, tiep) {
          var b = g2.buoc4;
          tieuDeBuoc(host, b.tieuDe, b.dan);
          var tabs = h('div', 'dq-tabs'), nd = h('div', 'dq-vu', '…');
          var da = {}, soDa = 0;
          var nutDi = h('button', 'dq-nut', S.text.ui.tiep);
          nutDi.disabled = true;
          nutDi.addEventListener('click', function () { nutDi.disabled = true; tiep(); });
          b.ho.forEach(function (ho, i) {
            var t = h('button', 'dq-tab', ho.nhan + ' · ' + ho.ten);
            t.addEventListener('click', function () {
              Array.prototype.forEach.call(tabs.children, function (x) { x.classList.remove('on'); });
              t.classList.add('on', 'ok');
              nd.innerHTML = '<b>' + ho.ten + '</b><br>' + ho.nd;
              if (!da[i]) { da[i] = 1; soDa++; }
              if (soDa === b.ho.length) nutDi.disabled = false;
            });
            tabs.appendChild(t);
          });
          host.appendChild(tabs); host.appendChild(nd);
          host.appendChild(h('p', null, ''));
          host.appendChild(nutDi);
        }
      ];
    }

    /* ---------- góc 3 ---------- */
    if (k === 2) {
      var g3 = T.g3;
      return [
        buocGhep({ o: g3.buoc1.o, the: g3.buoc1.the, sai: g3.buoc1.sai, cot: 4,
                   onDat: function () { o.tram[2].moc++; } },
                 g3.buoc1.tieuDe, g3.buoc1.dan),
        /* đổi vai */
        function (host, tiep) {
          var b = g3.buoc2;
          tieuDeBuoc(host, b.tieuDe, b.dan);
          var bang = h('table', 'dq-tb');
          bang.appendChild(h('tr', null, '<th>Vai</th><th>Kết cục</th>'));
          var vung = h('div');
          host.appendChild(vung);
          var i = 0;
          function vai() {
            var v = b.vai[i];
            vung.innerHTML = '';
            vung.appendChild(h('h2', null, 'Vai ' + (i + 1) + '/' + b.vai.length + ': ' + v.ten));
            taoTracNghiem(vung, v, function () {
              bang.appendChild(h('tr', null, '<td>' + v.ten + '</td><td>' + v.kq + '</td>'));
              o.tram[2].vai = i + 1;
              i++;
              if (i < b.vai.length) vai();
              else {
                vung.innerHTML = '';
                vung.appendChild(bang);
                vung.appendChild(h('div', 'dq-vu', b.tong));
                nutTiep(vung, null, tiep);
              }
            });
          }
          vai();
          host.appendChild(h('div'));
        },
        /* cái cân */
        function (host, tiep) {
          var b = g3.buoc3;
          tieuDeBuoc(host, b.tieuDe, b.dan);
          var can = h('div', 'dq-can');
          can.innerHTML = '<div class="tru"></div><div class="dam"></div>' +
            '<div class="dia" style="left:12%"><em>Tích cực</em></div><div class="dia" style="left:88%"><em>Tiêu cực</em></div>';
          host.appendChild(can);
          var nT = 0, nX = 0, cuoi = h('div');
          function ve() {
            var d = Math.max(-1, Math.min(1, (nX - nT) / 5)) * 7;
            can.querySelector('.dam').style.transform = 'rotate(' + d + 'deg)';
            var dy = d * 2.2;
            can.querySelectorAll('.dia')[0].style.transform = 'translateY(' + (-dy) + 'px)';
            can.querySelectorAll('.dia')[1].style.transform = 'translateY(' + dy + 'px)';
            o.tram[2].can = d;
          }
          taoGhep(host, { o: b.o, the: b.the, sai: b.sai, cot: 2,
            onDat: function (c) { if (c.dap === 'tich') nT++; else nX++; ve(); } },
            function () {
              cuoi.appendChild(h('div', 'dq-vu', b.ketLuan));
              host.appendChild(cuoi);
              nutTiep(cuoi, null, tiep);
            });
        }
      ];
    }

    /* ---------- góc 4 ---------- */
    var g4 = T.g4;
    return [
      /* cánh cửa */
      function (host, tiep) {
        var b = g4.cua;
        tieuDeBuoc(host, b.tieuDe);
        var cau = { q: b.q, goiY: b.goiY, giu: b.giu, c: b.c.map(function (c) { return { t: c.t, ok: !!c.ok, fb: c.fb }; }) };
        taoTracNghiem(host, cau, function () {
          o.tram[3].cua = true;
          host.innerHTML = '';
          tieuDeBuoc(host, 'Cửa đã mở', 'Đáp án C: chấp nhận một số hình thức độc quyền, nhưng phải kiểm soát. Cụ thể:');
          var ul = h('ul', 'dq-ds');
          b.sau.forEach(function (s) { ul.appendChild(h('li', null, s)); });
          host.appendChild(ul);
          nutTiep(host, 'Vào phòng bên trong', tiep);
        });
      },
      /* ba bàn làm việc */
      function (host, tiep) {
        tieuDeBuoc(host, 'Ba bàn làm việc', 'Mỗi bàn là một cách Nhà nước kiểm soát. Hoàn thành cả ba bàn.');
        var tabs = h('div', 'dq-tabs'), noi = h('div');
        host.appendChild(tabs); host.appendChild(noi);
        var xong = {}, soXong = 0;
        var nutDi = h('button', 'dq-nut', S.text.ui.tiep);
        nutDi.disabled = true;
        nutDi.addEventListener('click', function () { nutDi.disabled = true; tiep(); });
        var nut = [];
        function mo(i) {
          var b = g4.ban[i];
          nut.forEach(function (t, j) { t.classList.toggle('on', j === i); });
          noi.innerHTML = '';
          noi.appendChild(h('p', null, b.dan));
          var ul = h('ul', 'dq-ds');
          b.ds.forEach(function (s) { ul.appendChild(h('li', null, s)); });
          noi.appendChild(ul);
          if (b.vuAn) noi.appendChild(h('div', 'dq-vu', b.vuAn));
          if (xong[i]) { noi.appendChild(h('div', 'dq-msg dung', 'Bàn này đã xong.')); return; }
          noi.appendChild(h('h2', null, b.thu.dan));
          taoGhep(noi, { o: b.thu.o, the: b.thu.the, sai: b.thu.sai, cot: b.thu.o.length > 3 ? 4 : 3 }, function () {
            xong[i] = 1; soXong++;
            nut[i].classList.add('ok');
            o.tram[3].ban = soXong;
            noi.appendChild(h('div', 'dq-msg dung', 'Bàn này đã xong.'));
            if (soXong === g4.ban.length) nutDi.disabled = false;
          });
        }
        g4.ban.forEach(function (b, i) {
          var t = h('button', 'dq-tab', 'Bàn ' + (i + 1) + ' · ' + b.ten);
          t.addEventListener('click', function () { mo(i); });
          nut.push(t); tabs.appendChild(t);
        });
        host.appendChild(h('p'));
        host.appendChild(nutDi);
        mo(0);
      },
      /* hai ví dụ đối chiếu */
      function (host, tiep) {
        var b = g4.soSanh;
        tieuDeBuoc(host, b.tieuDe, b.dan);
        host.appendChild(h('h2', null, b.dien.ten));
        host.appendChild(h('p', null, b.dien.thu));
        var cuoi = h('div');
        taoGhep(host, { o: b.dien.o, the: b.dien.the, sai: b.dien.sai, cot: 2 }, function () {
          cuoi.appendChild(h('h2', null, b.vang.ten));
          cuoi.appendChild(h('div', 'dq-vu', b.vang.nd));
          taoTracNghiem(cuoi, b.vang, function () { nutTiep(cuoi, null, tiep); }, false);
          host.appendChild(cuoi);
        });
        host.appendChild(cuoi);
      }
    ];
  }

  /* ═══════════ hoàn thành một góc ═══════════ */

  /* Chơi xong một góc: nhận một THẺ cầm trên tay. Chưa tính là xong, phải
     mang thẻ tới máy ở giữa bàn cờ (xem batDauNap). */
  function nhanThe(k) {
    S.goc[k].da = true;
    S.the = k;
    o.theTay.material.map = texThe(k);
    o.theTay.material.needsUpdate = true;
    capNhatThanh();
    S.ctx.audio.buocNhay();
    S.ctx.hud.buocNhay('Thẻ ' + (k + 1) + ' · ' + S.text['g' + (k + 1)].manh.ten, 'Mang thẻ tới máy ở giữa bàn cờ');
  }

  /* Thẻ vào máy: góc được tính là xong, quân cờ gộp, cầu thang sáng thêm. */
  function hoanThanhGoc(k) {
    S.goc[k].xong = true;
    S.soManh++;
    S.stage = S.soManh;
    var t = o.tram[k];
    t.xong = true;
    t.nhan.material.map = nhanTex(S.text.goc[k].ten, S.text.goc[k].ngan, true);
    t.nhan.material.map.needsUpdate = true;
    o.phan[k].material.opacity = 0.0;
    S.phanDich[k] = 0.4;
    capNhatThanh();
    S.ctx.hud.buocNhay(S.text.ui.manh + ' ' + S.soManh + '/4', S.text['g' + (k + 1)].manh.ten);
    S.cue[k] = S.ctx.clock || 0.001;          // bật hình ảnh minh họa riêng của thẻ này (tường, cột thị phần, vòng luật)
    hienYNghia(k);
  }

  /* Bảng "điều vừa xảy ra trên bàn cờ nghĩa là gì": gắn mỗi thay đổi 3D với một ý của bài. */
  function hienYNghia(k) {
    var Y = S.text.yNghia[k], U = S.text.ui;
    if (S.bangY) S.bangY.remove();
    var cuoi = [16, 8, 4, 2, 1];
    var b = h('div', 'dq-y');
    b.appendChild(h('div', 'eb', U.yNghiaTieuDe));
    b.appendChild(h('h3', null, Y.tieu));
    b.appendChild(h('p', null, Y.nd));
    b.appendChild(h('div', 'qd', U.quanDoi.replace('%a', cuoi[S.soManh - 1]).replace('%b', cuoi[S.soManh])));
    var n = h('button', 'dq-nut', U.yNghiaNut);
    n.style.marginTop = '2px';
    n.addEventListener('click', function () { b.remove(); if (S) S.bangY = null; });
    b.appendChild(n);
    document.body.appendChild(b);
    S.bangY = b;
  }

  /* ═══════════ màn kết: Hội đồng ═══════════ */

  function moHoiDong() {
    var T = S.text, HD = T.hoiDong;
    var box = moLop('Bốn mảnh bằng chứng đã đủ', HD.tieuDe, null, true, 'Quay lại phòng');
    box.appendChild(h('div', 'dq-ga', '“' + HD.cau + '”'));
    box.appendChild(h('p', null, HD.dan));

    var lapTruong = null, chon = {};
    box.appendChild(h('h2', null, 'Lập trường của bạn'));
    var dsLT = h('div');
    HD.lapTruong.forEach(function (l) {
      var e = h('div', 'dq-lt', '<b>' + l.ten + '</b>' + l.mo);
      e.addEventListener('click', function () {
        lapTruong = l.id;
        Array.prototype.forEach.call(dsLT.children, function (c) { c.classList.remove('on'); });
        e.classList.add('on');
        ve();
      });
      dsLT.appendChild(e);
    });
    box.appendChild(dsLT);

    box.appendChild(h('h2', null, 'Bằng chứng bạn dẫn ra'));
    var dsEv = h('div', 'dq-ls');
    for (var i = 0; i < 4; i++) (function (i) {
      var M = T['g' + (i + 1)].manh;
      var e = h('div', 'dq-ev', '<div class="ck"></div><div><b>Mảnh ' + (i + 1) + ' · ' + M.ten + '</b>' + M.nd + '</div>');
      e.addEventListener('click', function () {
        chon[i] = !chon[i];
        e.classList.toggle('on', chon[i]);
        e.querySelector('.ck').textContent = chon[i] ? '✓' : '';
        ve();
      });
      dsEv.appendChild(e);
    })(i);
    box.appendChild(dsEv);

    var ga = h('div', 'dq-ga');
    ga.style.display = 'none';
    box.appendChild(ga);
    var kq = h('div');
    box.appendChild(kq);
    var nop = h('button', 'dq-nut', HD.nopNut);
    box.appendChild(nop);
    var msg = h('div', 'dq-msg');
    box.appendChild(msg);

    function ds() { return Object.keys(chon).filter(function (k) { return chon[k]; }).map(Number); }

    function ve() {
      var d = ds();
      if (!lapTruong || !d.length) { ga.style.display = 'none'; return; }
      ga.style.display = '';
      var lt = HD.lapTruong.filter(function (l) { return l.id === lapTruong; })[0];
      ga.innerHTML = '<b>' + lt.ten + '.</b><ul>' +
        d.map(function (k) { return '<li>' + HD.luan[lapTruong][k][1] + '</li>'; }).join('') + '</ul>';
    }

    nop.addEventListener('click', function () {
      var d = ds();
      if (!lapTruong) { msg.className = 'dq-msg sai'; msg.textContent = 'Hãy chọn một lập trường.'; return; }
      if (d.length < 2) { msg.className = 'dq-msg sai'; msg.textContent = HD.thieu; return; }
      var diem = 0, max = 0;
      HD.luan[lapTruong].forEach(function (x) { max += x[0]; });
      d.forEach(function (k) { diem += HD.luan[lapTruong][k][0]; });
      var tl = diem / max;
      var muc = tl >= 0.8 ? HD.muc[0] : (tl >= 0.5 ? HD.muc[1] : HD.muc[2]);
      nop.disabled = true;
      msg.textContent = '';
      kq.innerHTML = '';
      kq.appendChild(h('div', 'dq-vu', '<b>' + muc.ten + '</b> · ' + diem + '/' + max + ' điểm bằng chứng.<br>' + muc.nd));
      var dong = nutTiep(kq, 'Mở cầu thang', function () { dongLop(); ketThuc(); });
      var lai = h('button', 'dq-nut phu', HD.doiNut);
      lai.addEventListener('click', function () { kq.innerHTML = ''; nop.disabled = false; });
      kq.appendChild(lai);
      S.ctx.audio.the();
    });
  }

  function ketThuc() {
    var T = S.text, B = T.baiHoc, ctx = S.ctx;
    S.mo = true;
    S.moT = 0;
    ctx.hud.loeSang();
    ctx.audio.buocNhay();
    ctx.hoanThanh();
    ctx.soTay.ghi({ ten: T.soTay.ten, tom: T.soTay.tom, trichDan: B.trichDan, nguon: B.nguon });
    ctx.hud.anChuGiai();
    ctx.hud.the(
      '<div class="eyebrow">' + B.nhan + '</div>' +
      '<h1>' + B.tieuDe + '</h1>' +
      '<p>' + B.dan + '</p>' +
      '<dl>' + B.dinhNghia.map(function (d) { return '<dt>' + d[0] + '</dt><dd>' + d[1] + '</dd>'; }).join('') + '</dl>' +
      '<blockquote class="quote">' + B.trichDan + '<cite>' + B.nguon + '</cite></blockquote>' +
      '<p>' + B.tiep + '</p>',
      B.nut,
      function () { ctx.hud.goiY('Cầu thang đã mở · <kbd>Esc</kbd> hoặc nút <b>← Về sảnh</b> để quay ra'); }
    );
  }

  /* ═══════════ dựng cảnh 3D ═══════════ */

  var texCache = [];
  function canvasTex(w, hh, ve) {
    var c = document.createElement('canvas');
    c.width = w; c.height = hh;
    ve(c.getContext('2d'), w, hh);
    var t = new THREE.CanvasTexture(c);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }

  function nhanTex(ten, sub, xong) {
    return canvasTex(1024, 256, function (g, w, hh) {
      g.textAlign = 'center';
      g.shadowColor = xong ? 'rgba(255,200,90,.9)' : 'rgba(0,0,0,.9)';
      g.shadowBlur = 18;
      g.fillStyle = xong ? '#ffd77a' : '#f1e6c8';
      g.font = '700 70px ' + TX.FONT_TIEU_DE;
      g.fillText(ten.length > 22 ? ten.replace('Hiện Trường ', '') : ten, w / 2, 100);
      g.shadowBlur = 0;
      g.fillStyle = xong ? '#a8e0a0' : '#d6c08a';
      g.font = 'italic 500 44px ' + TX.FONT_FANTASY;
      g.fillText(xong ? '✦ Đã có bằng chứng' : S.text.ui.nhanGoc, w / 2, 176);
    });
  }

  function dungSprite(tex, w, hh) {
    var sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
    sp.scale.set(w, hh, 1);
    return sp;
  }

  function hop(parent, w, hh, d, mau, x, y, z, ex) {
    var m = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d),
      new THREE.MeshStandardMaterial(Object.assign({ color: mau, roughness: 0.55, metalness: 0.15 }, ex || {})));
    m.position.set(x, y, z);
    m.castShadow = true; m.receiveShadow = true;
    parent.add(m);
    return m;
  }

  function matVang() { return TX.vatLieuVang(); }

  /* ---------- bàn cờ ---------- */

  function texBanCo() {
    return canvasTex(1024, 1024, function (g) {
      g.fillStyle = '#e9f1e1'; g.fillRect(0, 0, 1024, 1024);
      var goc = 124, o_ = (1024 - 2 * goc) / 9;
      var mau = ['#a67a4a', '#7fc4e8', '#d46fb0', '#e8943a', '#d94a4a', '#e8d14a', '#4fae6a', '#3a62b8'];
      var ten = ['BẮT ĐẦU', 'Điện', 'Khí vận', 'Nước', 'Thuế', 'Xe buýt', 'Mạng', 'Cơ hội', 'Viễn thông',
                 'Dầu mỏ', 'TÙ', 'Tìm kiếm', 'Nền tảng', 'Điện', 'Gọi xe', 'Bến xe', 'Hàng không', 'Khí vận',
                 'Xăng', 'Vàng', 'BÃI ĐẬU', 'Ngân hàng', 'Cơ hội', 'Cảng', 'Sân bay', 'Tàu', 'Truyền hình',
                 'Báo chí', 'Nước', 'Phần mềm', 'ĐI TÙ', 'Thép', 'Xi măng', 'Khí vận', 'Dược', 'Ga tàu',
                 'Cơ hội', 'Hàng hiệu', 'Thuế', 'Cổ phiếu'];
      function o40(i) {
        var s = Math.floor(i / 10), t = i % 10;
        var x, y, w, hh;
        if (s === 0) { x = 1024 - goc - t * o_ - (t === 0 ? 0 : 0); }
        /* chạy ngược chiều kim đồng hồ từ góc dưới phải */
        if (s === 0) { w = t === 0 ? goc : o_; hh = goc; x = t === 0 ? 1024 - goc : 1024 - goc - t * o_; y = 1024 - goc; }
        else if (s === 1) { w = goc; hh = t === 0 ? goc : o_; x = 0; y = t === 0 ? 1024 - goc : 1024 - goc - t * o_; }
        else if (s === 2) { w = t === 0 ? goc : o_; hh = goc; x = t === 0 ? 0 : goc + (t - 1) * o_; y = 0; }
        else { w = goc; hh = t === 0 ? goc : o_; x = 1024 - goc; y = t === 0 ? 0 : goc + (t - 1) * o_; }
        return { x: x, y: y, w: w, h: hh, s: s, t: t };
      }
      for (var i = 0; i < 40; i++) {
        var c = o40(i);
        g.fillStyle = '#fbf8ef'; g.fillRect(c.x, c.y, c.w, c.h);
        g.strokeStyle = '#6b5a3a'; g.lineWidth = 3; g.strokeRect(c.x, c.y, c.w, c.h);
        if (c.t !== 0) {
          g.fillStyle = mau[Math.floor(i / 5) % mau.length];
          /* dải màu hướng vào trong bàn */
          if (c.s === 0) g.fillRect(c.x, c.y, c.w, 26);
          else if (c.s === 1) g.fillRect(c.x + c.w - 26, c.y, 26, c.h);
          else if (c.s === 2) g.fillRect(c.x, c.y + c.h - 26, c.w, 26);
          else g.fillRect(c.x, c.y, 26, c.h);
        }
        g.save();
        g.translate(c.x + c.w / 2, c.y + c.h / 2);
        g.rotate([0, Math.PI / 2, Math.PI, -Math.PI / 2][c.s]);
        g.fillStyle = '#3d3424'; g.textAlign = 'center';
        g.font = (c.t === 0 ? '700 24px ' : '600 17px ') + TX.FONT_TIEU_DE;
        g.fillText(ten[i], 0, 6, c.t === 0 ? 100 : 76);
        g.restore();
      }
      /* lòng bàn cờ */
      var ng = g.createRadialGradient(512, 512, 40, 512, 512, 440);
      ng.addColorStop(0, '#fffdf4'); ng.addColorStop(1, '#e4efd9');
      g.fillStyle = ng; g.fillRect(goc, goc, 1024 - 2 * goc, 1024 - 2 * goc);
      g.strokeStyle = '#b8873a'; g.lineWidth = 3; g.strokeRect(goc + 20, goc + 20, 1024 - 2 * goc - 40, 1024 - 2 * goc - 40);
      g.textAlign = 'center';
      g.save(); g.translate(512, 512); g.rotate(-Math.PI / 4);
      g.fillStyle = 'rgba(184,135,58,.22)';
      g.font = '700 150px ' + TX.FONT_TIEU_DE;
      g.fillText('ĐỘC QUYỀN', 0, 40);
      g.restore();
      /* hai chồng thẻ */
      g.fillStyle = '#f0b958'; g.fillRect(190, 190, 150, 90);
      g.fillStyle = '#63a9e0'; g.fillRect(684, 744, 150, 90);
      g.fillStyle = '#3d3424'; g.font = '600 22px ' + TX.FONT_TIEU_DE;
      g.fillText('CƠ HỘI', 265, 243); g.fillText('KHÍ VẬN', 759, 797);
    });
  }

  /* Một hòn đảo bay: đĩa đá, đáy lởm chởm, cây bụi và đèn (xem doc-quyen-assets.js). */
  function dungDaoLo(parent, x, y, z, r, sau, kieu) {
    var g = A.daoBay(r, sau, Math.round(r * 10 + sau), kieu);
    g.position.set(x, y, z);
    parent.add(g);
    return g;
  }

  function dungBanCo(ctx) {
    dungDaoLo(ctx.scene, 0, 0, 0, 6.4, 6, 'giua');

    var gr = new THREE.Group();
    ctx.scene.add(gr);
    var da = A.vl({ color: 0xffffff, map: A.texDaHoa(), roughness: 0.35, metalness: 0.05, envMapIntensity: 0.7 });
    var go = A.vl({ color: 0xffffff, map: A.texGo(), roughness: 0.5, metalness: 0.03, envMapIntensity: 0.4 });
    var vang = A.vl({ color: 0xc9a24a, metalness: 0.9, roughness: 0.3, envMapIntensity: 1.3 });
    /* bệ đá hai tầng, khung gỗ viền đồng, mặt cờ */
    A.hopNgang(gr, 5.3, 0.3, 5.3, 0.14, da, 0, 0.15, 0);
    A.hopNgang(gr, 5.0, 0.22, 5.0, 0.1, da, 0, 0.41, 0);
    A.hopNgang(gr, 5.76, 0.1, 5.76, 0.07, go, 0, 0.55, 0);      // mặt trên ở 0,60: thấp hơn tấm cờ để không đè hình
    [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (d) {   // bốn góc bịt đồng
      var c = new THREE.Mesh(new THREE.SphereGeometry(0.1, 14, 10), vang);
      c.position.set(d[0] * 2.88, 0.58, d[1] * 2.88);
      gr.add(c);
    });
    var mat = new THREE.MeshStandardMaterial({ map: texBanCo(), roughness: 0.4, metalness: 0.02,
      envMap: A.env(), envMapIntensity: 0.35 });
    var mat0 = new THREE.MeshStandardMaterial({ color: 0xb08a4a });
    var mb = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.04, 5.6), [mat0, mat0, mat, mat0, mat0, mat0]);
    mb.position.y = 0.62;   // dày 0,04: mặt trên ở 0,64
    mb.receiveShadow = true;
    gr.add(mb);
    o.banCo = gr;

    /* trên mặt cờ: nhà xanh, nhà đỏ, xúc xắc, chồng xu như ván cờ đang chơi */
    for (var i = 0; i < 7; i++) {
      var x = -1.8 + i * 0.6;
      var n1 = A.nhaNho(0x3fae73, false); n1.position.set(x, BAN_CAO, -2.02); gr.add(n1);
      var n2 = A.nhaNho(0xd84a4a, i === 3); n2.position.set(x, BAN_CAO, 2.02); n2.rotation.y = Math.PI; gr.add(n2);
    }
    [-1.2, 0, 1.2].forEach(function (z, i) {
      var n3 = A.nhaNho(0xe8b23a, false); n3.position.set(-2.02, BAN_CAO, z); n3.rotation.y = Math.PI / 2; gr.add(n3);
      var n4 = A.nhaNho(0x4a7fd8, i === 1); n4.position.set(2.02, BAN_CAO, z); n4.rotation.y = -Math.PI / 2; gr.add(n4);
    });
    var xx1 = A.xucXac(3); xx1.position.set(1.35, BAN_CAO + 0.08, -1.05); xx1.rotation.y = 0.5; gr.add(xx1);
    var xx2 = A.xucXac(5); xx2.position.set(1.6, BAN_CAO + 0.08, -0.85); xx2.rotation.y = -0.3; gr.add(xx2);
    var cx1 = A.chongXu(11); cx1.position.set(-1.5, BAN_CAO, 1.4); gr.add(cx1);
    var cx2 = A.chongXu(6, 0xc8ccd2); cx2.position.set(-1.2, BAN_CAO, 1.55); gr.add(cx2);
    var cx3 = A.chongXu(8); cx3.position.set(1.5, BAN_CAO, 1.45); gr.add(cx3);

    /* bốn phần tư của bàn sáng lên theo màu của góc vừa nạp thẻ */
    o.phan = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(function (d, k) {
      var m = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9),
        new THREE.MeshBasicMaterial({ color: MAU_GOC[k], transparent: true, opacity: 0, depthWrite: false }));
      m.rotation.x = -Math.PI / 2;
      m.position.set(d[0] * 1.0, BAN_CAO + 0.006, d[1] * 1.0);
      gr.add(m);
      return m;
    });

    /* sóng lan ra khi bàn cờ chuyển động */
    o.song = new THREE.Mesh(new THREE.RingGeometry(0.92, 1.0, 64),
      new THREE.MeshBasicMaterial({ color: 0xf0c455, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false }));
    o.song.rotation.x = -Math.PI / 2;
    o.song.position.y = BAN_CAO + 0.02;
    o.song.visible = false;
    ctx.scene.add(o.song);

    /* --- hình minh họa gắn với ý nghĩa từng thẻ (xem hienYNghia và capNhatCue) --- */
    /* thẻ 2, rào cản gia nhập: tường vàng vây quanh bàn cờ; quân xám = doanh nghiệp mới bị bật ngược */
    o.rao = new THREE.Mesh(new THREE.CylinderGeometry(3.45, 3.45, 1.1, 64, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xf0c455, transparent: true, opacity: 0.5, side: THREE.DoubleSide, depthWrite: false }));
    o.rao.position.y = 0.05;
    o.rao.scale.y = 0.001;
    o.rao.visible = false;
    ctx.scene.add(o.rao);
    o.raoVien = new THREE.Mesh(new THREE.TorusGeometry(3.45, 0.04, 8, 72),
      new THREE.MeshStandardMaterial({ color: 0xc9a24a, metalness: 0.9, roughness: 0.3 }));
    o.raoVien.rotation.x = Math.PI / 2;
    o.raoVien.position.y = 1.1;
    o.raoVien.visible = false;
    ctx.scene.add(o.raoVien);
    o.moiVao = A.quanCo(0x8a8f99);
    o.moiVao.scale.setScalar(1.4);
    o.moiVao.position.set(6.2, 0, -1.8);
    o.moiVao.visible = false;
    ctx.scene.add(o.moiVao);
    /* thẻ 3, hậu quả: cột thị phần dâng lên 80% và mũi tên giá tăng */
    o.thiPhan = new THREE.Group();
    o.thiPhan.position.set(-4.7, 0, 0);
    o.thiPhan.rotation.y = Math.PI / 2;
    var nenCot = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 2.6), new THREE.MeshBasicMaterial({ color: 0xe6e0d2, transparent: true, opacity: 0.85 }));
    nenCot.position.y = 1.5;
    o.thiPhan.add(nenCot);
    o.cotDay = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 2.6), new THREE.MeshBasicMaterial({ color: 0xc8302f }));
    o.cotDay.geometry.translate(0, 1.3, 0);
    o.cotDay.position.set(0, 0.2, 0.01);
    o.cotDay.scale.y = 0.001;
    o.thiPhan.add(o.cotDay);
    var nhanTP = dungSprite(canvasTex(512, 192, function (g, w) {
      g.textAlign = 'center'; g.shadowColor = 'rgba(255,255,255,.95)'; g.shadowBlur = 12;
      g.fillStyle = '#ff6a5a'; g.font = '700 70px ' + TX.FONT_TIEU_DE; g.fillText('~80%', w / 2, 74);
      g.fillStyle = '#f1e6c8'; g.font = '600 38px ' + TX.FONT_TIEU_DE; g.fillText('thị phần', w / 2, 118);
      g.fillStyle = '#ff8a7a'; g.font = '700 36px ' + TX.FONT_TIEU_DE; g.fillText('giá cước ▲ 10–15%', w / 2, 170);
    }), 2.4, 0.9);
    nhanTP.position.set(0, 3.3, 0);
    o.thiPhan.add(nhanTP);
    o.thiPhan.scale.setScalar(0.001);
    o.thiPhan.visible = false;
    ctx.scene.add(o.thiPhan);
    /* thẻ 4, chính sách: vòng vàng "Luật Cạnh tranh 2018" quay quanh bàn */
    o.vongLuat = new THREE.Group();
    var vl_ = new THREE.Mesh(new THREE.TorusGeometry(3.15, 0.07, 10, 80),
      new THREE.MeshStandardMaterial({ color: 0xe0b23a, metalness: 0.9, roughness: 0.25, emissive: 0x6a4a10, emissiveIntensity: 0.5 }));
    vl_.rotation.x = Math.PI / 2;
    o.vongLuat.add(vl_);
    for (var bi = 0; bi < 6; bi++) {                           // sáu tấm biển nhỏ treo trên vòng: giá, sản lượng, phạm vi...
      var tam = dungSprite(canvasTex(256, 96, function (g, w) {
        g.fillStyle = '#fff6df'; g.fillRect(2, 2, w - 4, 92); g.strokeStyle = '#c9a24a'; g.lineWidth = 5; g.strokeRect(2, 2, w - 4, 92);
        g.fillStyle = '#6b4d12'; g.textAlign = 'center'; g.font = '700 30px ' + TX.FONT_TIEU_DE;
        g.fillText(['KIỂM SOÁT GIÁ', 'SẢN LƯỢNG', 'PHẠM VI', 'GIÁM SÁT', 'XỬ PHẠT', 'LUẬT 2018'][bi], w / 2, 60);
      }), 0.95, 0.36);
      var ab = bi / 6 * Math.PI * 2;
      tam.position.set(Math.cos(ab) * 3.15, 0.25, Math.sin(ab) * 3.15);
      o.vongLuat.add(tam);
    }
    o.vongLuat.position.y = 1.5;
    o.vongLuat.scale.setScalar(0.001);
    o.vongLuat.visible = false;
    ctx.scene.add(o.vongLuat);

    ctx.player.blockers.push({ x: 0, z: 0, r: 3.4, cao: 1.4 });     // bàn cờ: bay lên trên thì qua được
    ctx.player.blockers.push({ x: 0, z: 0, r: 1.3, cao: 5.6 });     // cầu thang và trụ
  }

  /* ---------- máy nhận thẻ (kiểu máy bán hàng) ---------- */

  function dungMay(ctx) {
    var M = A.mayBanHang(S.text.ui.mayTen, S.text.ui.mayChu, MAU_GOC);
    var gr = M.group;
    gr.position.set(MAY_X, 0, 0);
    gr.rotation.y = Math.PI / 2;      // mặt trước hướng về phía đông (+x)
    ctx.scene.add(gr);
    o.theCho = M.theCho;
    o.denMay = M.denMay;
    o.kheSang = M.kheSang;
    o.denNap = new THREE.PointLight(0xffd88a, 0, 18, 1.4);        // loé khi bàn cờ chuyển động
    o.denNap.position.set(0, 2.8, 0);
    ctx.scene.add(o.denNap);
    o.may = { g: gr, x: MAY_X, z: 0, slot: new THREE.Vector3(MAY_X + 0.64, 1.38, 0), rung: 0 };
    var nhan = dungSprite(canvasTex(1024, 256, function (g, w) {
      g.textAlign = 'center';
      g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 14;
      g.fillStyle = '#ffd98a'; g.font = '700 66px ' + TX.FONT_TIEU_DE;
      g.fillText(S.text.ui.mayTen, w / 2, 96);
      g.shadowBlur = 6; g.fillStyle = '#f1e6c8'; g.font = 'italic 600 52px ' + TX.FONT_FANTASY;
      g.fillText('↓ ' + S.text.ui.mayChu, w / 2, 178);
    }), 3.2, 0.8);
    nhan.position.set(0, 3.95, 0.3);
    gr.add(nhan);
    var vung = new THREE.Mesh(new THREE.BoxGeometry(2.4, 3.2, 1.8), new THREE.MeshBasicMaterial({ visible: false }));
    vung.position.set(0, 1.6, 0.1);
    vung.userData.loai = 'may';
    gr.add(vung);
    o.hit.push(vung);
    ctx.player.blockers.push({ x: MAY_X, z: 0, r: 1.1, cao: 3.6 });
  }

  /* ---------- mũi tên chỉ đường, cột sáng, thẻ cầm tay ---------- */

  function dungHuongDan(ctx) {
    var mat = new THREE.MeshBasicMaterial({ color: 0xffc552, transparent: true, opacity: 0.95, depthTest: false });
    var ten = new THREE.Group();
    var than = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 12), mat);
    than.rotation.x = Math.PI / 2; than.position.z = -0.1;
    var dau = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.42, 16), mat);
    dau.rotation.x = Math.PI / 2; dau.position.z = 0.46;
    ten.add(than); ten.add(dau);
    ten.traverse(function (m) { m.renderOrder = 999; });
    ctx.scene.add(ten);
    o.ten = ten;

    var cot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 60, 16, 1, true),
      new THREE.MeshBasicMaterial({ color: 0xffc552, transparent: true, opacity: 0.22, side: THREE.DoubleSide, depthWrite: false }));
    cot.visible = false;
    ctx.scene.add(cot);
    o.cot = cot;

    var the = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.72),
      new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide, depthTest: false }));
    the.renderOrder = 998;
    the.visible = false;
    ctx.scene.add(the);
    o.theTay = the;
  }

  function texThe(k) {
    var G = S.text.goc[k], M = S.text['g' + (k + 1)].manh;
    var mau = '#' + ('000000' + MAU_GOC[k].toString(16)).slice(-6);
    return canvasTex(256, 368, function (g, w, hh) {
      g.fillStyle = '#fffaf0'; g.fillRect(0, 0, w, hh);
      g.fillStyle = mau; g.fillRect(0, 0, w, 62);
      g.fillStyle = '#fff'; g.textAlign = 'center';
      g.font = '700 26px ' + TX.FONT_TIEU_DE;
      g.fillText('THẺ ' + (k + 1), w / 2, 40);
      g.fillStyle = '#c9a24a'; g.font = '700 84px ' + TX.FONT_TIEU_DE;
      g.fillText('✦', w / 2, 190);
      g.fillStyle = '#3d3424'; g.font = '700 30px ' + TX.FONT_TIEU_DE;
      g.fillText(M.ten, w / 2, 262);
      g.fillStyle = '#8a7a62'; g.font = 'italic 500 22px ' + TX.FONT_FANTASY;
      g.fillText(G.ngan, w / 2, 304);
      g.strokeStyle = mau; g.lineWidth = 6; g.strokeRect(5, 5, w - 10, hh - 10);
    });
  }

  /* mục tiêu mà mũi tên chỉ tới */
  function mucTieu() {
    var T = S.text.ui;
    if (S.nap || S.mo) return null;
    if (S.soManh === 4) return { x: 0, y: 3.2, z: 0, ten: T.tenCauThang, r: 4.5 };
    if (S.the != null) return { x: o.may.slot.x, y: 1.6, z: o.may.slot.z, ten: T.tenMay, r: 3.2 };
    var P = S.ctx.player.pos, tot = null, d0 = 1e9;
    for (var k = 0; k < 4; k++) {
      if (S.goc[k].xong) continue;
      var t = o.tram[k];
      var d = Math.hypot(P.x - t.x, P.z - t.z);
      if (d < d0) { d0 = d; tot = { x: t.x, y: t.y + 1.5, z: t.z, ten: S.text.goc[k].ten, r: 4.5 }; }
    }
    return tot;
  }

  function capNhatHuongDan(dt, t) {
    var ctx = S.ctx, P = ctx.player;
    var tg = (S.lop || ctx.hud.theDangMo()) ? null : mucTieu();
    if (!tg) { o.ten.visible = false; o.cot.visible = false; S.muc = null; }
    else {
      var dx = tg.x - P.pos.x, dy = tg.y - P.pos.y, dz = tg.z - P.pos.z;
      var kc = Math.sqrt(dx * dx + dy * dy + dz * dz);
      S.muc = { ten: tg.ten, kc: kc };
      /* cột sáng đứng tại đích, thấy từ rất xa */
      o.cot.visible = kc > tg.r + 1.5;       // đứng gần đích thì tắt cột sáng, khỏi phủ mờ cả màn hình
      o.cot.position.set(tg.x, tg.y + 20, tg.z);
      o.cot.material.opacity = 0.16 + 0.08 * Math.sin(t * 2.4);
      /* mũi tên nằm trước mặt, hơi thấp, chỉ thẳng từ người tới đích; gần tới nơi thì ẩn */
      var cy = Math.cos(P.yaw), sy = Math.sin(P.yaw), cp = Math.cos(P.pitch), sp = Math.sin(P.pitch);
      var fx = -sy * cp, fy = sp, fz = -cy * cp;
      o.ten.visible = kc > tg.r;
      o.ten.position.set(P.pos.x + fx * 2.3, P.pos.y + fy * 2.3 - 0.75, P.pos.z + fz * 2.3);
      o.ten.lookAt(tg.x, tg.y, tg.z);
      var nhip = 0.6 * (1 + 0.08 * Math.sin(t * 5));
      o.ten.scale.setScalar(nhip);
    }
    /* thẻ đang cầm: lơ lửng bên phải, thấp dưới tầm nhìn */
    var the = o.theTay;
    if (S.the != null && !S.nap && !S.lop) {
      var cy2 = Math.cos(P.yaw), sy2 = Math.sin(P.yaw), cp2 = Math.cos(P.pitch), sp2 = Math.sin(P.pitch);
      var f = [-sy2 * cp2, sp2, -cy2 * cp2], r = [cy2, 0, -sy2], u = [sy2 * sp2, cp2, cy2 * sp2];
      var bob = Math.sin(t * 2) * 0.02;
      the.visible = true;
      the.position.set(
        P.pos.x + f[0] * 1.1 + r[0] * 0.5 - u[0] * 0.34,
        P.pos.y + f[1] * 1.1 + r[1] * 0.5 - u[1] * 0.34 + bob,
        P.pos.z + f[2] * 1.1 + r[2] * 0.5 - u[2] * 0.34);
      the.rotation.set(P.pitch, P.yaw, -0.18, 'YXZ');
      the.scale.setScalar(TX.camUng ? 0.62 : 0.75);   // thẻ nhỏ lại để khỏi che màn hình
    } else if (!S.nap) the.visible = false;
  }

  /* Các hình minh họa của từng thẻ đã nạp: tường rào + quân mới bị bật lại, cột thị phần, vòng luật. */
  function capNhatCue(dt, t) {
    var anim = TX.anim;
    /* thẻ 2: tường mọc lên; quân xám lao vào tường rồi bật ra, lặp lại */
    var rao = S.cue[1] ? 1 : 0.001;
    o.rao.scale.y = anim.damp(o.rao.scale.y, rao, 2.2, dt);
    o.rao.visible = o.rao.scale.y > 0.02;
    o.raoVien.visible = o.rao.visible;
    o.raoVien.position.y = 0.05 + 1.1 * o.rao.scale.y;
    o.moiVao.visible = !!S.cue[1] && o.rao.scale.y > 0.7;
    if (o.moiVao.visible) {
      var p = ((t - S.cue[1]) % 2.6) / 2.6;
      var x = p < 0.5 ? 6.4 - 2.8 * Math.pow(p / 0.5, 2) : 3.6 + 2.8 * (1 - Math.pow(1 - (p - 0.5) / 0.5, 2));
      o.moiVao.position.set(x * 0.95, 0, -x * 0.35);
      o.moiVao.rotation.y = Math.PI * 0.6;
      o.moiVao.rotation.z = p > 0.48 && p < 0.62 ? Math.sin((p - 0.48) * 60) * 0.25 : 0;
    }
    /* thẻ 3: cột đỏ dâng tới 80% */
    var tp = S.cue[2] ? 1.6 : 0.001;          // cột to hơn để đọc được từ xa
    o.thiPhan.scale.setScalar(anim.damp(o.thiPhan.scale.x, tp, 3, dt));
    o.thiPhan.visible = o.thiPhan.scale.x > 0.02;
    if (S.cue[2]) o.cotDay.scale.y = Math.min(0.8, Math.max(0.001, (t - S.cue[2] - 0.6) / 2.0 * 0.8));
    /* thẻ 4: vòng luật quay chậm */
    var vg = S.cue[3] ? 1 : 0.001;
    o.vongLuat.scale.setScalar(anim.damp(o.vongLuat.scale.x, vg, 2.5, dt));
    o.vongLuat.visible = o.vongLuat.scale.x > 0.02;
    o.vongLuat.rotation.y += dt * 0.25;
  }

  /* ---------- nạp thẻ vào máy, bàn cờ chuyển động ---------- */

  function batDauNap() {
    var P = S.ctx.player, k = S.the;
    var from = o.theTay.position.clone();
    S.nap = { t: 0, k: k, from: from, quay0: o.banCo.rotation.y, daNap: false, song: false, last: performance.now() };
    S.ctx.khoaCamera = true;          // phòng mượn camera: bay lên một góc nhìn thấy cả máy lẫn bàn cờ
    S.the = null;
    S.goiY = '';
    S.ctx.hud.goiY(S.text.ui.dangNap);
    S.ctx.audio.diemNut();
    capNhatThanh();
  }

  function capNhatNap(dt, t) {
    var n = S.nap, anim = TX.anim;
    var ctx = S.ctx;
    if (!n) {
      o.banCo.position.y = anim.damp(o.banCo.position.y, 0, 5, dt);
      o.kheSang.material.color.setHex(S.the != null ? 0xfff0b0 : 0xffc552);
      o.kheSang.scale.x = S.the != null ? 1 + 0.12 * Math.sin(t * 6) : 1;
      return;
    }
    /* Chạy theo THỜI GIAN THẬT (không theo số khung hình): máy yếu, khung hình thấp thì cảnh
       vẫn kéo dài ~4 giây chứ không chậm gấp nhiều lần như khi dùng dt đã bị chặn ở 0,05 s. */
    var bay = performance.now();
    n.t += Math.min(0.25, (bay - n.last) / 1000);
    n.last = bay;
    var T = S.text;

    /* Camera điện ảnh: bay lên góc cao nhìn bàn cờ, giữ suốt lúc bàn chuyển động, rồi trả về chỗ người chơi. */
    var w = n.t < 0.9 ? anim.muot(n.t / 0.9) : (n.t < 3.5 ? 1 : 1 - anim.muot((n.t - 3.5) / 0.7));
    var pc = ctx.player;
    if (!o.camMau) o.camMau = new THREE.PerspectiveCamera();
    o.camMau.position.set(2.8, 7.2, 9.2);
    o.camMau.lookAt(1.6, 1.0, 0.8);
    o.camMau.updateMatrixWorld();
    var qNg = new THREE.Quaternion().setFromEuler(new THREE.Euler(pc.pitch, pc.yaw, 0, 'YXZ'));
    ctx.camera.position.copy(pc.pos).lerp(o.camMau.position, w);
    ctx.camera.quaternion.copy(qNg).slerp(o.camMau.quaternion, w);

    /* đèn loé khắp mặt bàn theo màu của góc vừa nạp */
    var bs = Math.max(0, Math.min(1, (n.t - 1.0) / 2.2));
    o.denNap.color.setHex(MAU_GOC[n.k]);
    o.denNap.intensity = 7 * Math.sin(Math.PI * bs);
    /* 0 → 1 s: thẻ bay vào khe */
    var a = anim.muot(n.t / 1.0);
    o.theTay.visible = n.t < 1.0;
    if (n.t < 1.0) {
      var to = o.may.slot;
      o.theTay.position.set(
        n.from.x + (to.x - n.from.x) * a,
        n.from.y + (to.y - n.from.y) * a + Math.sin(a * Math.PI) * 0.5,
        n.from.z + (to.z - n.from.z) * a);
      o.theTay.rotation.set(0, anim.damp(o.theTay.rotation.y, Math.PI * 0, 5, dt), 0);
      o.theTay.scale.setScalar((TX.camUng ? 0.62 : 0.75) * (1 - 0.55 * a));
    }
    /* 1,0 s: thẻ vào hẳn; máy nháy đèn, rung */
    if (!n.daNap && n.t >= 1.0) {
      n.daNap = true;
      o.denMay[n.k].material.color.setHex(MAU_GOC[n.k]);
      o.theCho[n.k].material.opacity = 1;
      o.may.rung = 1;
      ctx.audio.buocNhay();
      hoanThanhGoc(n.k);       // quân cờ gộp, chip sáng
    }
    o.may.rung = Math.max(0, o.may.rung - dt * 1.4);
    o.may.g.position.z = Math.sin(t * 60) * 0.03 * o.may.rung;
    /* 1,0 → 3,0 s: bàn cờ quay một phần tư vòng, nảy lên, sóng lan ra */
    var bt = Math.max(0, Math.min(1, (n.t - 1.0) / 2.2));
    if (n.t >= 1.0) {
      o.banCo.rotation.y = n.quay0 + (Math.PI / 2) * anim.vot(bt, 1.3);
      o.banCo.position.y = Math.sin(Math.PI * Math.min(1, bt * 1.4)) * 0.9;
    }
    if (n.t >= 1.15) {
      if (!n.song) { n.song = true; o.song.visible = true; o.song.material.color.setHex(MAU_GOC[n.k]); }
      var st = (n.t - 1.15) / 2.0;
      o.song.scale.setScalar(1 + st * 11);
      o.song.material.opacity = Math.max(0, 0.95 * (1 - st));
      if (st >= 1) o.song.visible = false;
    }
    if (n.t >= 4.2) {
      S.nap = null;
      ctx.khoaCamera = false;
      o.denNap.intensity = 0;
      o.banCo.rotation.y = n.quay0 + Math.PI / 2;
      if (S.soManh === 4) ctx.hud.goiY(T.ui.moiCauThang);
    }
  }

  /* ---------- quân cờ ---------- */

  function diemVong(i) {
    var s = (i / SO_QUAN) * 4;               // 0..4 quanh bàn
    var c = Math.floor(s), t = s - c;
    var a = VONG;
    switch (c % 4) {
      case 0: return [a - t * 2 * a, a];
      case 1: return [-a, a - t * 2 * a];
      case 2: return [-a + t * 2 * a, -a];
      default: return [a, -a + t * 2 * a];
    }
  }

  function dungQuanCo(ctx) {
    o.quan = [];
    for (var i = 0; i < SO_QUAN; i++) {
      var mau = MAU_QUAN[i % MAU_QUAN.length];
      var g = A.quanCo(mau);                // quân tiện: đế, cổ, vòng đệm, đầu tròn bóng
      var mt = g.userData.mat;
      var p = diemVong(i);
      g.position.set(p[0], BAN_CAO, p[1]);
      o.banCo.add(g);
      o.quan.push({ g: g, home: p, mt: mt, mau: mau, x: p[0], z: p[1], s: 1 });
    }
  }

  function viTriCum(stage) {
    var n = [16, 8, 4, 2, 1][stage];
    var kich = SO_QUAN / n;
    var kq = [];
    for (var i = 0; i < SO_QUAN; i++) {
      var c = Math.floor(i / kich), dau = c * kich;
      var tx = 0, tz = 0;
      for (var j = 0; j < kich; j++) { tx += o.quan[dau + j].home[0]; tz += o.quan[dau + j].home[1]; }
      tx /= kich; tz /= kich;
      /* dồn về dải viền: giữ cho cụm đứng trên ô cờ chứ không chui vào lòng bàn */
      var m = Math.max(Math.abs(tx), Math.abs(tz)) || 1;
      if (stage === 4) { tx = VONG; tz = VONG; } else { tx = tx / m * VONG; tz = tz / m * VONG; }
      kq.push({ x: tx, z: tz, lead: i === dau, kich: kich });
    }
    return kq;
  }

  function capNhatQuan(dt) {
    var cum = viTriCum(S.stage);
    var anim = TX.anim;
    var mauVang = new THREE.Color(0xe8b43a);
    for (var i = 0; i < o.quan.length; i++) {
      var q = o.quan[i], c = cum[i];
      q.x = anim.damp(q.x, c.x, 2.5, dt);
      q.z = anim.damp(q.z, c.z, 2.5, dt);
      var tgt = c.lead ? 1 + 0.5 * Math.log(c.kich) / Math.LN2 : 0.001;
      q.s = anim.damp(q.s, tgt, 3, dt);
      q.g.position.x = q.x;
      q.g.position.z = q.z;
      q.g.scale.setScalar(Math.max(0.001, q.s));
      q.g.visible = q.s > 0.02;
      if (S.stage === 4 && c.lead) q.mt.color.lerp(mauVang, Math.min(1, dt * 1.5));
    }
  }

  /* ---------- cầu thang xoắn giữa bàn ---------- */

  function dungCauThang(ctx) {
    var gr = new THREE.Group();
    gr.position.y = BAN_CAO;
    ctx.scene.add(gr);
    var thang = A.cauThangXoan(22, 0.62, 4.6);    // bậc đá vát cạnh, cột đá, tay vịn đồng
    gr.add(thang);
    o.bac = thang.userData.bac;

    /* vòng khóa quanh chân thang: vòng đồng, ổ khóa có quai */
    var khoa = new THREE.Group();
    var kl = A.vl({ color: 0xc9a24a, metalness: 0.95, roughness: 0.25, envMapIntensity: 1.5 });
    var vong = new THREE.Mesh(new THREE.TorusGeometry(1.1, 0.05, 12, 48), kl);
    vong.rotation.x = Math.PI / 2;
    vong.position.y = 0.45;
    khoa.add(vong);
    A.hopTron(khoa, 0.34, 0.3, 0.16, 0.05, kl, 0, 0.42, 1.1);
    var quai = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.028, 10, 18, Math.PI), kl);
    quai.position.set(0, 0.56, 1.1);
    khoa.add(quai);
    var lo = new THREE.Mesh(new THREE.CircleGeometry(0.03, 10), new THREE.MeshBasicMaterial({ color: 0x1a1208 }));
    lo.position.set(0, 0.42, 1.19);
    khoa.add(lo);
    gr.add(khoa);
    o.khoa = khoa;
    o.cauThang = gr;

    /* biển báo đỉnh thang */
    var bien = dungSprite(canvasTex(1024, 256, function (g, w) {
      g.textAlign = 'center';
      g.shadowColor = 'rgba(255,200,90,.9)'; g.shadowBlur = 20;
      g.fillStyle = '#ffd77a'; g.font = '700 66px ' + TX.FONT_TIEU_DE;
      g.fillText('LÊN TẦNG TIẾP THEO', w / 2, 100);
      g.shadowBlur = 6; g.shadowColor = 'rgba(0,0,0,.9)'; g.fillStyle = '#f1e6c8'; g.font = 'italic 500 46px ' + TX.FONT_FANTASY;
      g.fillText('Phòng Giá trị thặng dư · sắp mở', w / 2, 176);
    }), 3.4, 0.85);
    bien.position.set(0, 4.5, 0);
    bien.material.opacity = 0;
    gr.add(bien);
    o.bienTrenCao = bien;

    /* vùng bấm */
    var vung = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 3.4, 12), new THREE.MeshBasicMaterial({ visible: false }));
    vung.position.y = 1.7;
    vung.userData.loai = 'cauThang';
    gr.add(vung);
    o.hit.push(vung);

    /* đèn dưới chân thang, bật khi mở */
    o.denThang = new THREE.PointLight(0xffd88a, 0, 9, 1.6);
    o.denThang.position.set(0, 2.4, 0);
    gr.add(o.denThang);
  }

  function capNhatCauThang(dt, t) {
    var k = S.mo ? Math.min(1, S.moT) : 0;
    if (S.mo) S.moT += dt * 0.6;
    var dem = S.soManh / 4;
    var vang = new THREE.Color(0xf3c15a);
    for (var i = 0; i < o.bac.length; i++) {
      var b = o.bac[i];
      var sang = S.mo ? Math.min(1, Math.max(0, k * o.bac.length * 1.2 - i) / 2) : 0;
      /* mỗi thẻ nạp xong thì thêm một phần tư số bậc ngả sang vàng nhạt */
      if (!S.mo && i < o.bac.length * dem) sang = Math.max(sang, 0.35);
      b.mat.opacity = 0.4 + 0.5 * sang + (S.mo ? 0 : 0.08 * Math.sin(t * 1.2 + i));
      b.mat.color.setHex(0xb9b1a0).lerp(vang, sang);
      b.mat.emissive.setHex(0xf2b84a).multiplyScalar(0.5 * sang);
    }
    o.khoa.scale.setScalar(S.mo ? Math.max(0.001, 1 - k * 1.3) : 1);
    o.khoa.visible = !S.mo || k < 0.75;
    o.khoa.rotation.y += dt * (S.mo ? 3 : 0.2);
    o.denThang.intensity = S.mo ? 1.8 * k : 0.25 * dem * (0.7 + 0.3 * Math.sin(t * 2));
    o.bienTrenCao.material.opacity = k;
  }

  /* ---------- bốn góc ---------- */

  function dungVongSang(gr, mau) {
    var ring = new THREE.Mesh(new THREE.RingGeometry(1.9, 2.25, 48),
      new THREE.MeshBasicMaterial({ color: mau, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.02;
    gr.add(ring);
    return ring;
  }

  function banhRang(r, n, mau) {
    var g = new THREE.Group();
    var m = new THREE.MeshStandardMaterial({ color: mau, roughness: 0.4, metalness: 0.5, emissive: 0x000000 });
    var than = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 0.85, 0.12, 28), m);
    than.rotation.x = Math.PI / 2;
    g.add(than);
    for (var i = 0; i < n; i++) {
      var a = i / n * Math.PI * 2;
      var rang = new THREE.Mesh(new THREE.BoxGeometry(r * 0.28, r * 0.3, 0.12), m);
      rang.position.set(Math.cos(a) * r * 0.95, Math.sin(a) * r * 0.95, 0);
      rang.rotation.z = a;
      g.add(rang);
    }
    var lo = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.25, r * 0.25, 0.14, 16),
      new THREE.MeshStandardMaterial({ color: 0x3a3226, roughness: 0.6 }));
    lo.rotation.x = Math.PI / 2;
    g.add(lo);
    g.userData.mat = m;
    return g;
  }

  function dungTram(ctx, k) {
    var T = S.text;
    var vt = VITRI[k];
    var gr = new THREE.Group();
    gr.position.set(vt[0], DAO_Y[k], vt[1]);
    gr.rotation.y = Math.atan2(-vt[0], -vt[1]);   // mặt trước (+z cục bộ) hướng vào đảo giữa
    ctx.scene.add(gr);
    dungDaoLo(gr, 0, 0, 0, 3.9, 4.5);
    var den = new THREE.PointLight(MAU_GOC[k], 0.7, 11, 1.6);
    den.position.set(0, 3.4, 0.5);
    gr.add(den);

    var t = { k: k, g: gr, tienDo: 0, xong: false, x: vt[0], z: vt[1], y: DAO_Y[k], phan: {} };
    o.tram.push(t);
    t.ring = dungVongSang(gr, MAU_GOC[k]);

    var nhan = dungSprite(nhanTex(T.goc[k].ten, T.goc[k].ngan, false), 6.8, 1.7);
    nhan.position.set(0, 4.3, 0);
    gr.add(nhan);
    t.nhan = nhan;

    var vung = new THREE.Mesh(new THREE.BoxGeometry(4.2, 3.6, 3.4), new THREE.MeshBasicMaterial({ visible: false }));
    vung.position.set(0, 1.8, 0);
    vung.userData.loai = 'tram';
    vung.userData.k = k;
    gr.add(vung);
    o.hit.push(vung);

    var go = A.vl({ color: 0xffffff, map: A.texGo(), roughness: 0.5, metalness: 0.03, envMapIntensity: 0.35 });
    var vang = A.vl({ color: 0xc9a24a, metalness: 0.92, roughness: 0.28, envMapIntensity: 1.4 });
    var thepToi = A.vl({ color: 0x6a6258, map: A.texThep(), metalness: 0.85, roughness: 0.4, envMapIntensity: 1.1 });

    if (k === 0) {
      /* ba đài cột đá khía rãnh, trên mỗi đài một tập hồ sơ thật, trải thảm đỏ phía trước */
      var tham = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.5),
        A.vl({ color: 0x8a2f35, roughness: 1, metalness: 0, envMapIntensity: 0.1 }));
      tham.rotation.x = -Math.PI / 2;
      tham.position.set(0, 0.016, 1.15);
      gr.add(tham);
      A.hopNgang(gr, 4.7, 0.025, 0.08, 0.01, vang, 0, 0.03, 0.42);
      t.hoso = [];
      var mauHo = [0xe3cf9a, 0xbfd2e4, 0xe6bcbc];
      [-1.45, 0, 1.45].forEach(function (x, i) {
        var cot = A.cotDa(1.0);
        cot.position.set(x, 0, 0.1 - Math.abs(x) * 0.12);
        gr.add(cot);
        var f = A.hoSo(mauHo[i], i + 1);
        f.position.set(cot.position.x, 1.42, cot.position.z);
        f.rotation.order = 'YXZ';
        f.rotation.x = -0.5;                 // nghiêng về phía người xem để thấy bìa và dấu MẬT
        gr.add(f);
        t.hoso.push({ f: f, y: 1.42, pha: i * 1.7 });
      });
    }

    if (k === 1) {
      /* tấm máy thép có đinh tán, năm bánh răng ăn khớp vòng quanh một bánh vàng, bốn rương báu */
      A.hopTron(gr, 3.9, 2.8, 0.18, 0.14, thepToi, 0, 1.55, -1.0);
      [[-1.8, 0.3], [1.8, 0.3], [-1.8, 2.8], [1.8, 2.8], [0, 0.22], [0, 2.88]].forEach(function (p) {
        var d = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), vang);
        d.position.set(p[0], p[1] + 0.15, -0.9);
        gr.add(d);
      });
      /* hai ống đồng chạy dọc mép tấm máy, một đồng hồ áp suất có kim chạy theo số bánh đã lắp */
      [-1.78, 1.78].forEach(function (x) {
        var ong = A.ongDong(2.5);
        ong.position.set(x, 0.3, -0.84);
        gr.add(ong);
      });
      t.dongHo = A.dongHoApSuat(0.26);
      t.dongHo.position.set(1.3, 2.62, -0.88);
      gr.add(t.dongHo);
      t.banhM = [];
      t.banh = 0; t.ruong = 0; t.tienDo2 = 0;
      var tam = [0, 1.6, -0.86];
      for (var i = 0; i < 5; i++) {
        var a = i / 5 * Math.PI * 2 + Math.PI / 2;
        var bg = A.banhRang(0.5, 10, 0x7c7468, 0.1);
        bg.position.set(tam[0] + Math.cos(a) * 0.95, tam[1] + Math.sin(a) * 0.78, tam[2]);
        bg.rotation.z = i * 0.3;
        gr.add(bg);
        t.banhM.push({ g: bg, dir: i % 2 ? -1 : 1, mat: bg.userData.mat });
      }
      var tam2 = A.banhRang(0.38, 8, 0xc9a24a, 0.12);
      tam2.position.set(0, 1.6, -0.86);
      gr.add(tam2);
      t.banhTam = tam2;
      t.banhM.push({ g: tam2, dir: 1, mat: tam2.userData.mat, tam: true });
      t.ruongM = [];
      [-1.35, -0.45, 0.45, 1.35].forEach(function (x) {
        var r = A.ruongBau();
        r.position.set(x, 0, 0.8);
        var ngoc = new THREE.Mesh(new THREE.OctahedronGeometry(0.1),
          new THREE.MeshStandardMaterial({ color: 0x8fe0ff, emissive: 0x2a9ac0, emissiveIntensity: 0.8,
            roughness: 0.1, metalness: 0.2, envMap: A.env() }));
        ngoc.position.set(0, 0.33, 0);
        ngoc.visible = false;
        r.add(ngoc);
        gr.add(r);
        t.ruongM.push({ nps: r.userData.nps, ngoc: ngoc, mo: 0 });
      });
    }

    if (k === 2) {
      /* giá vẽ gỗ: bản đồ Đông Nam Á trong khung gỗ, dải thời gian; cái cân đứng trước */
      /* khung tranh chạm trổ thật (tỉ lệ 1,35:1) nếu đã nạp; không thì khung gỗ dựng bằng mã */
      var tex = canvasTex(1380, 1024, function (g, w, hh) { veBanDo(g, w, hh); });
      var khung = A.khungTranh(tex);
      if (khung) {
        khung.scale.setScalar(7.2);
        khung.position.set(0, 1.95, -1.1);
        gr.add(khung);
      } else {
        tex.flipY = true;
        var bd = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.667),
          new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75, metalness: 0, envMap: A.env(), envMapIntensity: 0.15 }));
        bd.position.set(0, 1.95, -1.1);
        gr.add(bd);
        A.hopTron(gr, 4.3, 0.16, 0.12, 0.03, go, 0, 3.34, -1.12);
        A.hopTron(gr, 4.3, 0.16, 0.12, 0.03, go, 0, 0.56, -1.12);
        A.hopTron(gr, 0.16, 2.94, 0.12, 0.03, go, -2.07, 1.95, -1.12);
        A.hopTron(gr, 0.16, 2.94, 0.12, 0.03, go, 2.07, 1.95, -1.12);
      }
      [-1.55, 1.55].forEach(function (x) {              // chân giá chống ra sau
        var ch = A.hopTron(gr, 0.1, 3.6, 0.1, 0.03, go, x, 1.7, -1.45);
        ch.rotation.x = -0.2;
      });
      A.hopTron(gr, 3.4, 0.08, 0.08, 0.02, go, 0, 0.12, -1.6);
      t.moc = 0; t.can = 0; t.vai = 0;
      t.mocM = [];
      for (var i = 0; i < 4; i++) {
        var pin = new THREE.Mesh(new THREE.SphereGeometry(0.1, 18, 14),
          new THREE.MeshStandardMaterial({ color: 0x777777, emissive: 0x000000, roughness: 0.25, metalness: 0.5, envMap: A.env() }));
        pin.position.set(-1.35 + i * 0.9, 0.82, -1.0);
        gr.add(pin);
        t.mocM.push(pin);
      }
      /* cái cân thăng bằng: đế đồng, trụ tiện, đòn cân, hai đĩa treo xích */
      A.lathe(gr, [[0, 0], [0.3, 0], [0.3, 0.05], [0.16, 0.12], [0.07, 0.3], [0.055, 1.15], [0.09, 1.2], [0.04, 1.26], [0, 1.27]],
        vang, 24, 0, 0, 0.7);
      t.dam = new THREE.Group();
      t.dam.position.set(0, 1.2, 0.7);
      A.hopTron(t.dam, 1.7, 0.07, 0.08, 0.025, vang, 0, 0, 0);
      var dT = A.diaCan(0x6bc08b); dT.position.set(-0.78, 0, 0); t.dam.add(dT);
      var dX = A.diaCan(0xd0654a); dX.position.set(0.78, 0, 0); t.dam.add(dX);
      t.dam.userData = { dT: dT, dX: dX };
      /* đầu mút đòn là hai núm tròn; kim chỉ nhô lên giữa đòn quét trên mặt thang chia vạch */
      [-0.86, 0.86].forEach(function (x) {
        var nm = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), vang);
        nm.position.set(x, 0, 0);
        t.dam.add(nm);
      });
      var kimCan = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.3, 8), new THREE.MeshBasicMaterial({ color: 0xb02a2a }));
      kimCan.position.set(0, 0.17, 0.05);
      t.dam.add(kimCan);
      var thang = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.2), new THREE.MeshBasicMaterial({
        map: canvasTex(310, 100, function (g_, w, hh) {
          g_.fillStyle = '#f7f1e2'; g_.fillRect(0, 0, w, hh);
          g_.strokeStyle = '#3a2f1e';
          for (var v = -10; v <= 10; v++) {
            g_.lineWidth = v % 5 === 0 ? 3 : 1.2;
            g_.beginPath(); g_.moveTo(w / 2 + v * 13, hh); g_.lineTo(w / 2 + v * 13, hh - (v % 5 === 0 ? 40 : 22)); g_.stroke();
          }
          g_.fillStyle = '#3a2f1e'; g_.font = '700 24px ' + TX.FONT_TIEU_DE; g_.textAlign = 'center';
          g_.fillText('0', w / 2, 34);
        })
      }));
      thang.position.set(0, 1.45, 0.75);
      gr.add(thang);
      t.kimCan = kimCan;
      /* ba quả cân đồng tiện đặt cạnh chân cân */
      [[-0.55, 0.9], [-0.78, 1.1], [-0.4, 0.7]].forEach(function (q, i) {
        var qc = A.quaCan(q[1]);
        qc.position.set(q[0], 0.0, 1.1 + i * 0.18);
        gr.add(qc);
      });
      gr.add(t.dam);
    }

    if (k === 3) {
      /* khung cửa gỗ có phào chỉ, cánh cửa ô nổi bản lề trái, tay nắm đồng A B C */
      var cuaT = A.cuaThat();                  // cửa lâu đài hai cánh thật, nếu đã nạp
      if (!cuaT) {
        A.hopTron(gr, 0.18, 2.95, 0.26, 0.03, go, -0.9, 1.475, -0.6);
        A.hopTron(gr, 0.18, 2.95, 0.26, 0.03, go, 0.9, 1.475, -0.6);
        A.hopTron(gr, 2.1, 0.2, 0.26, 0.03, go, 0, 2.98, -0.6);
        A.hopTron(gr, 2.3, 0.08, 0.34, 0.02, go, 0, 3.14, -0.6);
      }
      /* phông sáng đặt sâu phía sau, để ba bàn làm việc đứng trước nó chứ không bị che */
      var sau = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2.9), new THREE.MeshBasicMaterial({ color: 0xfff2c0 }));
      sau.position.set(0, 1.45, -2.0);
      gr.add(sau);
      sau.visible = false;
      t.sau = sau;
      /* ba bàn làm việc có đèn bàn, hiện ra khi cửa mở */
      t.banM = [-1, 0, 1].map(function (x) {
        var b = A.banLamViec();
        b.position.set(x * 1.3, 0, -1.2);
        b.scale.setScalar(0.9);
        b.visible = false;
        gr.add(b);
        return b;
      });
      t.cuaPiv = new THREE.Group();
      t.cuaPiv.position.set(-0.85, 0, -0.55);
      gr.add(t.cuaPiv);
      if (cuaT) {
        cuaT.g.position.set(0, 0, -0.55);
        cuaT.g.scale.setScalar(0.95);
        gr.add(cuaT.g);
        t.cuaThat = cuaT;
      } else {
        t.cuaPiv.add(A.canhCua());
      }
      [0, 1, 2].forEach(function (i) {
        var tn = A.tayNam();
        var cha = cuaT ? cuaT.phai : t.cuaPiv;                    // tay nắm gắn vào cánh phải: cánh mở thì tay nắm đi theo
        var ly = cuaT ? (1.0 + i * 0.4) / 0.95 - 1.1648 : 1.0 + i * 0.4;
        tn.position.set(cuaT ? -0.14 : 1.5, ly, cuaT ? 0.045 : 0.05);
        cha.add(tn);
        var ch = dungSprite(canvasTex(128, 128, function (g_, w, hh) {
          g_.textAlign = 'center'; g_.fillStyle = '#fff6df';
          g_.shadowColor = '#3a2a10'; g_.shadowBlur = 8;
          g_.font = '700 90px ' + TX.FONT_TIEU_DE;
          g_.fillText('ABC'[i], w / 2, 94);
        }), 0.3, 0.3);
        ch.position.set(cuaT ? -0.34 : 1.2, ly, cuaT ? 0.12 : 0.16);
        cha.add(ch);
      });
      t.gocCua = 0; t.cua = false; t.ban = 0;
    }
  }

  /* bản đồ cách điệu của Đông Nam Á, vẽ bằng canvas */
  function veBanDo(g, w, hh) {
    var bg = g.createLinearGradient(0, 0, 0, hh);
    bg.addColorStop(0, '#d8ecf7'); bg.addColorStop(1, '#bcdcee');
    g.fillStyle = bg; g.fillRect(0, 0, w, hh);
    g.strokeStyle = 'rgba(80,130,170,.18)'; g.lineWidth = 1;
    for (var x = 0; x < w; x += 96) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, hh); g.stroke(); }
    for (var y = 0; y < hh; y += 96) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
    function dat(pts, mau) {
      g.beginPath();
      pts.forEach(function (p, i) { if (i) g.lineTo(p[0] * w, p[1] * hh * 0.82); else g.moveTo(p[0] * w, p[1] * hh * 0.82); });
      g.closePath();
      g.fillStyle = mau || '#e9e2c6'; g.fill();
      g.strokeStyle = '#a89d73'; g.lineWidth = 3; g.stroke();
    }
    /* đại lục Đông Dương + bán đảo Mã Lai */
    dat([[0.22, 0.04], [0.5, 0.0], [0.62, 0.06], [0.6, 0.22], [0.66, 0.34], [0.62, 0.5], [0.5, 0.56], [0.46, 0.46],
         [0.5, 0.64], [0.54, 0.78], [0.5, 0.86], [0.44, 0.7], [0.38, 0.5], [0.34, 0.38], [0.26, 0.28]], '#e5dfc0');
    /* Sumatra, Borneo, Java, Philippines, Sulawesi */
    dat([[0.34, 0.78], [0.5, 0.92], [0.46, 0.96], [0.3, 0.86]], '#dfe3bd');
    dat([[0.58, 0.72], [0.74, 0.66], [0.8, 0.8], [0.66, 0.9], [0.6, 0.84]], '#dfe3bd');
    dat([[0.5, 0.98], [0.64, 0.97], [0.62, 1.0], [0.5, 1.0]], '#dfe3bd');
    dat([[0.76, 0.3], [0.8, 0.28], [0.84, 0.46], [0.78, 0.5]], '#dfe3bd');
    dat([[0.84, 0.54], [0.9, 0.62], [0.86, 0.76], [0.82, 0.68]], '#dfe3bd');
    /* vài điểm: Hà Nội, TP.HCM, Bangkok, Singapore, Jakarta, Manila */
    var cho = [['Hà Nội', 0.55, 0.16], ['TP. HCM', 0.57, 0.5], ['Bangkok', 0.42, 0.36], ['Singapore', 0.46, 0.82],
               ['Jakarta', 0.52, 0.94], ['Manila', 0.78, 0.38]];
    g.textAlign = 'left';
    cho.forEach(function (c) {
      g.fillStyle = '#d0412f';
      g.beginPath(); g.arc(c[1] * w, c[2] * hh * 0.82, 11, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#3d3424'; g.font = '600 32px ' + TX.FONT_TIEU_DE;
      g.fillText(c[0], c[1] * w + 20, c[2] * hh * 0.82 + 10);
    });
    g.fillStyle = 'rgba(61,52,36,.85)';
    g.font = '700 48px ' + TX.FONT_TIEU_DE;
    g.textAlign = 'center';
    g.fillText('ĐÔNG NAM Á · 26/3/2018', w * 0.5, hh - 190);
    /* dải thời gian */
    var tl = ['Cạnh tranh', '26/3/2018', 'Thị phần ~80%', 'Điều tiết'];
    g.strokeStyle = '#8a5f10'; g.lineWidth = 6;
    g.beginPath(); g.moveTo(w * 0.1, hh - 100); g.lineTo(w * 0.9, hh - 100); g.stroke();
    tl.forEach(function (t, i) {
      var x = w * (0.18 + i * 0.213);
      g.fillStyle = '#c9a24a'; g.beginPath(); g.arc(x, hh - 100, 17, 0, Math.PI * 2); g.fill();
      g.fillStyle = '#3d3424'; g.font = '600 34px ' + TX.FONT_TIEU_DE; g.textAlign = 'center';
      g.fillText(t, x, hh - 50);
    });
  }

  /* ---------- cập nhật các góc ---------- */

  function capNhatTram(dt, t) {
    var anim = TX.anim;
    for (var k = 0; k < 4; k++) {
      var m = o.tram[k];
      m.ring.material.opacity = (m.xong ? 0.55 : 0.28) + 0.12 * Math.sin(t * 2 + k);
      if (m.xong) m.ring.material.color.setHex(0xf0c455);

      if (k === 0) {
        m.hoso.forEach(function (h_) {
          h_.f.position.y = h_.y + Math.sin(t * 1.3 + h_.pha) * 0.06;
          h_.f.rotation.y += dt * 0.5;
        });
      }
      if (k === 1) {
        m.banhM.forEach(function (b, i) {
          var chay = m.xong || (!b.tam && i < m.tienDo2) || (b.tam && m.tienDo2 >= 5);
          b.v = anim.damp(b.v || 0, chay ? 1.2 : 0.0, 3, dt);
          b.g.rotation.z += b.dir * b.v * dt * (m.xong ? 1.4 : 1);
          b.mat.color.setHex(chay ? 0xc9a24a : 0x7c7468);
          b.mat.emissive.setHex(chay ? 0x5a3f10 : 0x000000);
        });
        m.tienDo2 = anim.damp(m.tienDo2, m.banh2 || 0, 5, dt);
        if (m.dongHo) {                               // kim đồng hồ: từ vạch 0 (−135°) lên vạch đỏ khi lắp đủ 5 bánh
          var muc = Math.min(1, m.tienDo2 / 5) + (m.tienDo2 >= 4.9 ? Math.sin(t * 9) * 0.02 : 0);
          m.dongHo.userData.kim.rotation.z = 2.35 - muc * 4.7;
        }
        m.ruongM.forEach(function (r, i) {
          var mo = (m.ruong || 0) > i ? 1 : 0;
          r.mo = anim.damp(r.mo, mo, 4, dt);
          r.nps.forEach(function (np) { if (np) np.rotation.x = -r.mo * 1.9; });
          r.ngoc.visible = r.mo > 0.5;
          r.ngoc.rotation.y += dt * 2;
          r.ngoc.position.y = 0.33 + Math.sin(t * 2 + i) * 0.04;
        });
      }
      if (k === 2) {
        m.mocM.forEach(function (p, i) {
          var on = i < (m.moc || 0) || m.xong;
          p.material.color.setHex(on ? 0xf0c455 : 0x777777);
          p.material.emissive.setHex(on ? 0x7a5a10 : 0x000000);
        });
      }
      if (k === 3) {
        var tgt = (m.cua || m.xong) ? -1.5 : 0;
        m.gocCua = anim.damp(m.gocCua, tgt, 3, dt);
        if (m.cuaThat) {                              // cửa thật: hai cánh mở vào trong, mỗi cánh quanh bản lề của nó
          m.cuaThat.trai.rotation.y = -m.gocCua;
          m.cuaThat.phai.rotation.y = m.gocCua;
        } else m.cuaPiv.rotation.y = m.gocCua;
        m.banM.forEach(function (b, i) { b.visible = (m.ban2 || 0) > i || (m.cua && m.gocCua < -0.5); });
        if (m.sau) m.sau.visible = !!m.cua && m.gocCua < -0.25;   // phông sáng chỉ hiện khi cửa đã hé mở
      }
    }
  }

  /* ═══════════ thanh tiến độ ═══════════ */

  function capNhatThanh() {
    var T = S.text.goc;
    if (!S.thanh) return;
    S.thanh.innerHTML = '';
    T.forEach(function (g, i) {
      var cls = S.goc[i].xong ? ' xong' : (S.the === i ? ' cam' : '');
      S.thanh.appendChild(h('div', 'dq-chip' + cls, '<b>' + (i + 1) + '</b> · ' + g.ngan));
    });
  }

  /* ═══════════ bấm chuột vào vật ═══════════ */

  function layDuoiChuot(ctx) {
    var c = ctx.player.chuot;
    o.diem.x = (c.x / innerWidth) * 2 - 1;
    o.diem.y = -(c.y / innerHeight) * 2 + 1;
    o.tia.setFromCamera(o.diem, ctx.camera);
    var tr = o.tia.intersectObjects(o.hit, false);
    if (!tr.length) return null;
    var u = tr[0].object.userData;
    return { loai: u.loai, k: u.k, d: tr[0].distance };
  }

  /* Khoảng cách tối đa để bấm vào từng loại vật: phải bay lại đủ gần. */
  var TAM_BAM = { tram: 14, may: 14, cauThang: 14 };

  function khiBam(ctx) {
    if (!S || ctx.khoaNhap || S.khoaT > 0 || S.nap) return;
    var u = layDuoiChuot(ctx);
    if (!u) return;
    var T = S.text.ui;
    if (u.d > TAM_BAM[u.loai]) { ctx.hud.goiY(T.laiGan); ctx.audio.diemNut(); return; }

    if (u.loai === 'tram') {
      var st = S.goc[u.k];
      if (st.xong) { ctx.audio.diemNut(); moGoc(u.k); return; }
      if (S.the != null) { ctx.hud.buocNhay('Đang cầm thẻ', T.dangCam); ctx.audio.diemNut(); return; }
      ctx.audio.diemNut(); moGoc(u.k);
    } else if (u.loai === 'may') {
      if (S.the == null) { ctx.hud.buocNhay(S.soManh === 4 ? 'Máy đã đủ thẻ' : 'Máy chưa có thẻ', S.soManh === 4 ? 'Bay tới cầu thang ở giữa bàn cờ.' : T.chuaCoThe); ctx.audio.diemNut(); return; }
      batDauNap();
    } else if (u.loai === 'cauThang') {
      if (S.mo) { ctx.hud.goiY('Cầu thang đã mở · phòng <b>Giá trị thặng dư</b> sắp mở'); return; }
      if (S.soManh < 4) {
        ctx.hud.buocNhay('Cầu thang đang khóa', T.khoaCauThang.replace('%n', S.soManh));
        ctx.audio.diemNut();
      } else { ctx.audio.diemNut(); moHoiDong(); }
    }
  }

  /* ═══════════ vòng đời phòng ═══════════ */

  /* Bầu trời: mây xếp quanh, không có tường. */
  /* ═══════════ VŨ TRỤ ═══════════
     Bầu trời là một mái vòm (skydome) vẽ bằng canvas: dải Ngân Hà, tinh vân, hàng nghìn ngôi sao.
     Mái vòm, các ngôi sao sáng và hai thiên thể đều đi theo người chơi (hoặc đặt rất xa) nên không
     bao giờ bay tới gần được. Camera chỉ nhìn xa 120 m nên mọi thứ nằm trong bán kính ~100 m. */

  function veTroiSao() {
    var R = A.rnd(77);
    return canvasTex(2048, 1024, function (g, w, hh) {
      var nen = g.createLinearGradient(0, 0, 0, hh);
      nen.addColorStop(0, '#02030a'); nen.addColorStop(0.5, '#060a1c'); nen.addColorStop(1, '#02030a');
      g.fillStyle = nen; g.fillRect(0, 0, w, hh);
      /* dải Ngân Hà: một băng nghiêng, sáng ở giữa */
      function bang(x) { return hh * 0.5 + Math.sin(x / w * Math.PI * 2 + 0.6) * hh * 0.18; }
      for (var i = 0; i < 70; i++) {                              // tinh vân màu
        var x = R() * w, y = bang(x) + (R() - 0.5) * hh * 0.25, r = 90 + R() * 200;
        var mau = ['110,70,190', '60,110,200', '190,70,140', '50,170,170'][i % 4];
        var gr = g.createRadialGradient(x, y, 0, x, y, r);
        gr.addColorStop(0, 'rgba(' + mau + ',' + (0.1 + R() * 0.12) + ')');
        gr.addColorStop(1, 'rgba(' + mau + ',0)');
        g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
      }
      for (var b = 0; b < 40; b++) {                              // lõi sáng của dải Ngân Hà
        var xb = R() * w, yb = bang(xb) + (R() - 0.5) * 60, rb = 120 + R() * 160;
        var gb = g.createRadialGradient(xb, yb, 0, xb, yb, rb);
        gb.addColorStop(0, 'rgba(235,225,255,.07)'); gb.addColorStop(1, 'rgba(235,225,255,0)');
        g.fillStyle = gb; g.fillRect(xb - rb, yb - rb, rb * 2, rb * 2);
      }
      for (var k = 0; k < 9000; k++) {                            // sao nhỏ, dày hơn trong dải Ngân Hà
        var xs = R() * w;
        var trongBang = R() < 0.55;
        var ys = trongBang ? bang(xs) + (R() + R() + R() - 1.5) * hh * 0.17 : R() * hh;
        var a = 0.15 + R() * 0.85, rs = 0.4 + R() * (R() < 0.04 ? 1.8 : 0.9);
        g.fillStyle = 'rgba(' + (R() < 0.2 ? '255,214,170' : (R() < 0.3 ? '170,200,255' : '255,255,255')) + ',' + a + ')';
        g.beginPath(); g.arc(xs, ys, rs, 0, Math.PI * 2); g.fill();
      }
    });
  }

  function texHanhTinh(kieu) {
    return canvasTex(512, 256, function (g, w, hh) {
      var R = A.rnd(kieu === 'khi' ? 5 : 9);
      if (kieu === 'khi') {                                       // hành tinh khí: các dải ngang
        var y = 0, mau = ['#d9b98a', '#c89c6a', '#e8d2a8', '#b9824f', '#e0c394'];
        while (y < hh) { var d = 8 + R() * 26; g.fillStyle = mau[Math.floor(R() * mau.length)]; g.fillRect(0, y, w, d); y += d; }
        for (var i = 0; i < 90; i++) {
          g.strokeStyle = 'rgba(255,240,210,' + (0.05 + R() * 0.1) + ')'; g.lineWidth = 1 + R() * 3;
          var yy = R() * hh; g.beginPath(); g.moveTo(0, yy);
          for (var x = 0; x <= w; x += 32) g.lineTo(x, yy + Math.sin(x * 0.03 + i) * 4); g.stroke();
        }
        g.fillStyle = 'rgba(190,80,50,.5)'; g.beginPath(); g.ellipse(360, 150, 34, 17, 0, 0, Math.PI * 2); g.fill();   // vết bão
      } else {                                                    // hành tinh xanh có mây
        g.fillStyle = '#2a5fa8'; g.fillRect(0, 0, w, hh);
        for (var j = 0; j < 40; j++) {
          g.fillStyle = 'rgba(' + (R() < 0.5 ? '70,150,90' : '40,90,170') + ',' + (0.3 + R() * 0.4) + ')';
          g.beginPath(); g.ellipse(R() * w, R() * hh, 20 + R() * 70, 10 + R() * 30, R() * 3, 0, Math.PI * 2); g.fill();
        }
        for (var m = 0; m < 60; m++) {
          g.fillStyle = 'rgba(255,255,255,' + (0.15 + R() * 0.3) + ')';
          g.beginPath(); g.ellipse(R() * w, R() * hh, 25 + R() * 60, 3 + R() * 9, R() * 0.4, 0, Math.PI * 2); g.fill();
        }
      }
    });
  }

  function dungBauTroi(ctx) {
    /* nền và sương: đen xanh thẫm, sương rất mỏng để đảo xa vẫn nhìn thấy */
    ctx.moiTruong.nen.setHex(0x02030a);
    ctx.moiTruong.suong.color.setHex(0x05071a);
    ctx.moiTruong.suong.density = 0.0042;

    /* ánh sáng: một "mặt trời" gắt từ phía trên bên phải, ánh phản chiếu xanh lạnh từ phía thiên hà */
    ctx.scene.add(new THREE.HemisphereLight(0x8fa6ff, 0x1c1630, 0.42));
    ctx.scene.add(new THREE.AmbientLight(0xb8c4ff, 0.12));
    var mt = new THREE.DirectionalLight(0xfff1dc, 1.25);
    mt.position.set(30, 22, 14);
    ctx.scene.add(mt);
    var vien = new THREE.DirectionalLight(0x6a8cff, 0.35);
    vien.position.set(-20, 8, -26);
    ctx.scene.add(vien);

    /* mái vòm sao + sao sáng lấp lánh + mặt trời xa; tất cả đi theo người chơi */
    o.troi = new THREE.Group();
    ctx.scene.add(o.troi);
    var vom = new THREE.Mesh(new THREE.SphereGeometry(105, 48, 24),
      new THREE.MeshBasicMaterial({ map: veTroiSao(), side: THREE.BackSide, fog: false, depthWrite: false }));
    vom.renderOrder = -10;
    o.troi.add(vom);

    var soSao = 900, vt = new Float32Array(soSao * 3), mauSao = new Float32Array(soSao * 3), R = A.rnd(31);
    for (var i = 0; i < soSao; i++) {
      var u = R() * 2 - 1, th = R() * Math.PI * 2, rr = Math.sqrt(1 - u * u), d = 98;
      vt[i * 3] = rr * Math.cos(th) * d; vt[i * 3 + 1] = u * d; vt[i * 3 + 2] = rr * Math.sin(th) * d;
      var c = R() < 0.25 ? [1, 0.82, 0.62] : (R() < 0.35 ? [0.68, 0.8, 1] : [1, 1, 1]);
      mauSao[i * 3] = c[0]; mauSao[i * 3 + 1] = c[1]; mauSao[i * 3 + 2] = c[2];
    }
    var gs = new THREE.BufferGeometry();
    gs.setAttribute('position', new THREE.BufferAttribute(vt, 3));
    gs.setAttribute('color', new THREE.BufferAttribute(mauSao, 3));
    o.sao = new THREE.Points(gs, new THREE.PointsMaterial({ size: 2.4, vertexColors: true, sizeAttenuation: false,
      transparent: true, opacity: 0.95, fog: false, depthWrite: false }));
    o.troi.add(o.sao);

    var quang = new THREE.Sprite(new THREE.SpriteMaterial({ map: A.tex(A.canvas(128, 128, function (g) {
      var gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(255,248,225,1)'); gr.addColorStop(0.12, 'rgba(255,230,170,.9)');
      gr.addColorStop(0.4, 'rgba(255,190,110,.25)'); gr.addColorStop(1, 'rgba(255,170,90,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
    })), transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    quang.scale.set(46, 46, 1);
    quang.position.set(30, 22, 14).normalize().multiplyScalar(92);
    o.troi.add(quang);

    /* hai thiên thể cố định trong thế giới, nằm xa trong tầm nhìn (≤ 85 m từ tâm) */
    var hk = new THREE.Group();
    hk.position.set(-62, 26, -48);
    var cau = new THREE.Mesh(new THREE.SphereGeometry(13, 40, 28),
      new THREE.MeshStandardMaterial({ map: texHanhTinh('khi'), roughness: 0.9, metalness: 0, fog: false }));
    cau.rotation.z = 0.35;
    hk.add(cau);
    var nhan = new THREE.Mesh(new THREE.RingGeometry(17, 27, 96),
      new THREE.MeshBasicMaterial({ map: A.tex(A.canvas(256, 256, function (g) {
        var cx = 128;
        for (var r = 66; r < 128; r += 2) {
          var a = (Math.sin(r * 0.9) * 0.5 + 0.5) * 0.55 * (r < 80 ? 0.4 : 1) * (r > 118 ? 0.5 : 1);
          g.strokeStyle = 'rgba(225,200,160,' + a + ')'; g.lineWidth = 2;
          g.beginPath(); g.arc(cx, cx, r, 0, Math.PI * 2); g.stroke();
        }
      })), transparent: true, side: THREE.DoubleSide, depthWrite: false, fog: false }));
    nhan.rotation.x = Math.PI / 2 - 0.45; nhan.rotation.y = 0.2;
    hk.add(nhan);
    o.hanhTinh = hk;
    ctx.scene.add(hk);

    var hx = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 24),
      new THREE.MeshStandardMaterial({ map: texHanhTinh('xanh'), roughness: 0.8, metalness: 0, fog: false }));
    hx.position.set(58, -8, -62);
    o.hanhTinhXanh = hx;
    ctx.scene.add(hx);
    var mm = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 18),
      A.vl({ map: A.texDa([2, 1]), roughness: 1, metalness: 0, envMapIntensity: 0.1, fog: false }));
    mm.position.set(-18, 34, 70);
    o.mat = mm;
    ctx.scene.add(mm);

    o.may2 = [];          // (không còn mây) giữ mảng rỗng để vòng cập nhật không lỗi

    /* bụi vũ trụ lấp lánh trôi quanh đảo */
    TX.domSang(ctx.scene, {
      soLuong: 220, tam: [0, 6, 0], rong: [60, 30, 60],
      mau: [0xffe2a0, 0xb9c8ff, 0xf0b5ff, 0xa0fff0], co: [9, 22], doMo: 0.55, troi: 0.6
    });

    /* biển tên phòng lơ lửng phía trên đảo giữa (chữ sáng, hợp nền tối) */
    var bien = dungSprite(canvasTex(1024, 256, function (g, w) {
      g.textAlign = 'center';
      g.shadowColor = 'rgba(0,0,0,.9)'; g.shadowBlur = 18;
      g.fillStyle = '#ffd98a'; g.font = '700 84px ' + TX.FONT_TIEU_DE;
      g.fillText(S.text.bien[0], w / 2, 110);
      g.shadowBlur = 8; g.fillStyle = '#d8ccae'; g.font = 'italic 600 46px ' + TX.FONT_FANTASY;
      g.fillText(S.text.bien[1], w / 2, 190);
    }), 14, 3.5);
    bien.position.set(0, 12.5, -2);
    ctx.scene.add(bien);
  }

  function build(ctx) {
    THREE_ = ctx.THREE;
    S = {
      ctx: ctx, text: ctx.text, lop: null, thanh: null, css: null, khoaT: 0.6,
      goc: [{ buoc: 0, xong: false, da: false }, { buoc: 0, xong: false, da: false },
            { buoc: 0, xong: false, da: false }, { buoc: 0, xong: false, da: false }],
      soManh: 0, stage: 0, mo: false, moT: 0, goiY: '', phim: null, hover: -1,
      the: null,          // chỉ số góc của thẻ đang cầm (null = tay không)
      nap: null,          // đang nạp thẻ vào máy
      muc: null,          // mục tiêu của mũi tên { ten, kc }
      phanDich: [0, 0, 0, 0],
      cue: [0, 0, 0, 0],   // thời điểm (giờ phòng) mỗi hình minh họa được bật; 0 = chưa
      bangY: null
    };
    o = { tram: [], hit: [], tia: new THREE.Raycaster(), diem: new THREE.Vector2() };

    A.datLaiLod();
    dungBauTroi(ctx);
    dungBanCo(ctx);
    dungQuanCo(ctx);
    dungCauThang(ctx);
    dungMay(ctx);
    for (var k = 0; k < 4; k++) dungTram(ctx, k);
    dungHuongDan(ctx);

    /* thanh tiến độ + CSS */
    S.css = document.createElement('style');
    S.css.textContent = CSS;
    document.head.appendChild(S.css);
    S.thanh = h('div', 'dq-bar');
    document.body.appendChild(S.thanh);
    capNhatThanh();

    /* không gian mở: bay tự do */
    var P = ctx.player;
    P.bay = true;
    P.bounds = 36;
    P.yMin = 1.0; P.yMax = 22;
    P.blockers = P.blockers;            // đã thêm ở dungBanCo, dungMay
    P.onClick = function () { khiBam(ctx); };
    P.spawn(0, 14.5, 0);
    P.pos.y = 5.2;
    P.pitch = -0.2;
    P.groundAt = function () { return 5.2 - P.CAO_MAT; };   // chỉ để khung hình đầu đứng đúng độ cao
    TX.dqGoiLy = { moGoc: moGoc, moHoiDong: moHoiDong, ctx: ctx, trangThai: function () { return S; }, doiTuong: function () { return o; } };   // để gỡ lỗi từ console

    /* Esc: đóng lớp phủ đang mở (lõi đã bỏ qua hộp "rời phòng" khi khoaNhap) */
    S.phim = function (e) {
      if (e.key === 'Escape' && S && S.lop) { dongLop(); }
    };
    addEventListener('keydown', S.phim);
  }

  function onEnter(ctx) {
    ctx.player.pos.y = 5.2;
    ctx.player.groundAt = null;       // từ giờ độ cao do người chơi tự quyết
    ctx.hud.goiY(S.text.ui.dieuKhien);
    ctx.hud.hienGoiY(true);
    S.dauT = 7;                       // 7 giây đầu giữ dòng hướng dẫn bay
  }

  function update(dt, ctx) {
    if (!S) return;
    var t = ctx.clock;
    if (S.khoaT > 0) S.khoaT -= dt;
    if (S.dauT > 0) S.dauT -= dt;

    o.troi.position.copy(ctx.player.pos);          // mái vòm và sao luôn ở vô cực: bay thế nào cũng không tới gần được
    o.sao.rotation.y += dt * 0.004;
    o.hanhTinh.children[0].rotation.y += dt * 0.03;
    o.hanhTinhXanh.rotation.y += dt * 0.05;
    A.capNhatLod(ctx.player.pos);            // mô hình thật chỉ hiện khi lại gần
    capNhatCue(dt, t);
    capNhatQuan(dt);
    capNhatCauThang(dt, t);
    capNhatNap(dt, t);
    capNhatHuongDan(dt, t);

    /* mây trôi, bốn phần tư bàn cờ sáng dần */
    for (var i = 0; i < o.may2.length; i++) {
      var m = o.may2[i];
      m.sp.position.x = m.x + Math.sin(t * m.toc + m.pha) * 1.2;
      m.sp.position.y = m.y + Math.sin(t * m.toc * 0.7 + m.pha * 2) * 0.4;
    }
    for (var q = 0; q < 4; q++) {
      var mo = o.phan[q].material;
      mo.opacity = TX.anim.damp(mo.opacity, S.goc[q].xong ? 0.35 : 0, 2.5, dt);
    }

    /* đồng bộ tiến độ trò chơi với hình 3D */
    var m1 = o.tram[1];
    m1.banh2 = S.goc[1].da ? 5 : (m1.banh || 0);
    m1.ruong = S.goc[1].da ? 4 : (m1.ruong || 0);
    var m2 = o.tram[2];
    m2.moc = S.goc[2].da ? 4 : (m2.moc || 0);
    var m3 = o.tram[3];
    m3.ban2 = S.goc[3].da ? 3 : (m3.ban || 0);
    m3.cua = m3.cua || S.goc[3].da;
    for (var kk = 0; kk < 4; kk++) o.tram[kk].xongVe = S.goc[kk].da;
    capNhatTram(dt, t);

    /* cái cân trước bản đồ: nghiêng theo trò chơi */
    var dm = m2.dam;
    var gocCan = (m2.can || 0) * Math.PI / 180;
    dm.rotation.z = TX.anim.damp(dm.rotation.z, -gocCan, 4, dt);
    dm.userData.dT.position.y = 0;      // đĩa treo ngay đầu đòn, tự đi theo đòn nghiêng
    dm.userData.dX.position.y = 0;
    dm.userData.dT.rotation.z = -dm.rotation.z;
    dm.userData.dX.rotation.z = -dm.rotation.z;
    if (m2.kimCan) m2.kimCan.rotation.z = 0;           // kim đi cùng đòn: nghiêng theo đòn là đủ

    /* gợi ý: rê chuột qua vật thì đọc tên vật; không thì đọc mũi tên chỉ đường */
    if (!ctx.khoaNhap && S.khoaT <= 0 && !S.nap) {
      var u = layDuoiChuot(ctx);
      var UI = S.text.ui, goiY = '';
      if (u) {
        var gan = u.d <= TAM_BAM[u.loai];
        if (!gan) goiY = UI.laiGan;
        else if (u.loai === 'tram') goiY = S.goc[u.k].xong ? UI.daXong : (S.the != null ? UI.dangCam : UI.nhanGoc + ': ' + S.text.goc[u.k].ten);
        else if (u.loai === 'may') goiY = S.the != null ? 'Bấm để đưa thẻ vào máy' : (S.soManh === 4 ? 'Máy đã nhận đủ 4 thẻ. Bay tới cầu thang ở giữa bàn cờ.' : UI.chuaCoThe);
        else if (u.loai === 'cauThang') goiY = S.mo ? 'Cầu thang đã mở' : (S.soManh === 4 ? UI.moiCauThang : UI.khoaCauThang.replace('%n', S.soManh));
      } else if (S.dauT > 0) goiY = UI.dieuKhien;
      else if (S.the != null) goiY = UI.theCam.replace('%t', S.text['g' + (S.the + 1)].manh.ten);
      else if (S.muc) goiY = UI.muiTen.replace('%t', S.muc.ten).replace('%d', Math.round(S.muc.kc));
      ctx.dom.style.cursor = u && u.d <= TAM_BAM[u.loai] ? 'pointer' : '';
      if (goiY !== S.goiY) { S.goiY = goiY; if (goiY) ctx.hud.goiY(goiY); }
    }
  }

  function dispose(ctx) {
    dongLop();
    if (S) {
      if (S.css) S.css.remove();
      if (S.thanh) S.thanh.remove();
      if (S.bangY) S.bangY.remove();
      if (S.phim) removeEventListener('keydown', S.phim);
    }
    if (ctx) {
      if (ctx.player) ctx.player.onClick = null;
      if (ctx.dom) ctx.dom.style.cursor = '';
      ctx.khoaNhap = false;
      ctx.khoaCamera = false;
    }
    S = o = null;
  }

  /* ═══════════ đăng ký ═══════════ */

  TX.dangKyPhong({
    id: 'doc-quyen',
    tieuDe: 'Cờ Tỷ Phú',
    nhanNgan: 'Tầng cao nhất · Độc quyền',
    moTa: 'Bàn cờ tỷ phú khổng lồ, bốn góc điều tra. Vì sao doanh nghiệp luôn hướng tới độc quyền?',
    chuotTuDo: true,
    goiY: {
      khoa:    'Bấm <kbd>Chuột trái</kbd> vào một góc phòng',
      duPhong: 'Bấm chuột vào một góc phòng'
    },
    build: build,
    onEnter: onEnter,
    update: update,
    dispose: dispose
  });

})(window.TX);
