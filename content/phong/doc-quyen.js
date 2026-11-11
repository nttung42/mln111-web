/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Độc quyền — "Phòng Cờ Tỷ Phú"   (id: doc-quyen)
   Tầng cao nhất của tháp.
   ───────────────────────────────────────────────────────────────────
   Nguồn nội dung: slide "ĐỘC QUYỀN – MLN122 – Nhóm 7".
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.

   Các con số, ngày tháng, tên văn bản pháp luật đều lấy từ slide. Riêng
   những chỗ slide không nói rõ (khâu "điều tiết", vàng miếng) được viết
   thận trọng và có đánh dấu [đối chiếu] — người phụ trách nội dung cần
   kiểm lại với văn bản gốc trước khi nộp.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['doc-quyen'] = {
  tang: 'Tháp Triết Học · Tầng cao nhất — Cờ Tỷ Phú',
  ten: 'Phòng Cờ Tỷ Phú — Độc quyền',
  chuong: 'MLN122 · Độc quyền trong nền kinh tế thị trường',

  moDau: {
    tieuDe: 'Phòng Cờ Tỷ Phú',
    than: 'Bạn là một thanh tra cạnh tranh trẻ. Giữa phòng là bàn cờ tỷ phú khổng lồ, đầy những quân cờ nhỏ: mỗi quân là một doanh nghiệp. ' +
          'Cầu thang xoắn ở giữa bàn cờ đang bị khóa. ' +
          'Hãy đến bốn góc phòng, thu bốn mảnh bằng chứng để trả lời Hội đồng: ' +
          '<em>độc quyền là gì, từ đâu ra, ai được lợi, và Nhà nước xử lý thế nào</em>. ' +
          'Câu hỏi dẫn dắt: <b>“Tại sao doanh nghiệp luôn hướng tới độc quyền?”</b> ' +
          'Phòng này là một không gian mở: bạn <b>bay tự do</b> giữa bầu trời, không có tường. ' +
          'Mũi tên vàng trước mặt luôn chỉ về nơi cần đến. ' +
          'Hoàn thành một góc để nhận <b>thẻ bằng chứng</b>, mang thẻ bay tới chiếc máy ở giữa bàn cờ và đưa vào khe. Bàn cờ sẽ chuyển động.'
  },

  bien: ['PHÒNG CỜ TỶ PHÚ', 'Tại sao doanh nghiệp luôn hướng tới độc quyền?'],

  ui: {
    dongGoc: 'Rời góc này',
    tiep: 'Tiếp tục',
    xong: 'Xong',
    manh: 'Mảnh bằng chứng',
    chonThe: 'Chọn một thẻ rồi bấm vào ô muốn đặt (hoặc kéo thả thẻ).',
    daDung: 'Chính xác.',
    chuaDung: 'Chưa đúng.',
    nhomTieuDe: 'Bốn góc điều tra',
    khoaCauThang: 'Cầu thang đang khóa. Cần đủ 4 mảnh bằng chứng (đã có %n/4).',
    moiChonGoc: 'Bấm vào một góc phòng để điều tra',
    moiCauThang: 'Đủ bằng chứng rồi. Bấm vào cầu thang để trình bày trước Hội đồng',
    daXong: 'Góc này đã xong. Bấm để đọc lại bằng chứng.',
    nhanGoc: 'Bấm để điều tra',
    veSanh: 'Về sảnh',
    yNghiaTieuDe: 'Điều vừa xảy ra trên bàn cờ',
    yNghiaNut: 'Đã hiểu',
    quanDoi: 'Số quân trên bàn: %a → %b',
    goiYLabel: 'Gợi ý',
    theCam: 'Đang cầm thẻ <b>%t</b>. Bay tới chiếc máy ở giữa bàn cờ và đưa thẻ vào khe.',
    chuaCoThe: 'Máy đang chờ thẻ. Hãy bay tới một góc điều tra để lấy thẻ bằng chứng.',
    dangCam: 'Đang cầm một thẻ. Hãy đưa thẻ vào máy ở giữa bàn cờ trước.',
    dangNap: 'Máy đang đọc thẻ… hãy xem bàn cờ chuyển động.',
    laiGan: 'Bay lại gần hơn để bấm',
    muiTen: 'Tới %t · còn %d m',
    nutThe: 'Nhận thẻ bằng chứng',
    theTen: 'Thẻ %n · %t',
    mayTen: 'MÁY NHẬN THẺ',
    mayChu: 'ĐƯA THẺ VÀO ĐÂY',
    tenMay: 'máy nhận thẻ',
    tenCauThang: 'cầu thang giữa bàn cờ',
    dieuKhien: 'Bay: <kbd>W A S D</kbd> theo hướng nhìn · <kbd>Space</kbd> lên · <kbd>R</kbd> xuống · kéo chuột để quay · <kbd>Shift</kbd> nhanh'
  },

  /* ---------- tên bốn góc ---------- */
  goc: [
    { ten: 'Góc Định Nghĩa',        hoi: 'Độc quyền là gì?',                       ngan: 'ĐỊNH NGHĨA' },
    { ten: 'Góc Vòng Xoáy',         hoi: 'Vì sao doanh nghiệp hướng tới độc quyền?', ngan: 'VÒNG XOÁY' },
    { ten: 'Góc Hiện Trường Grab–Uber', hoi: 'Độc quyền tác động lên ai?',           ngan: 'GRAB – UBER' },
    { ten: 'Góc Việt Nam',          hoi: 'Việt Nam nhìn nhận và xử lý ra sao?',    ngan: 'VIỆT NAM' }
  ],

  /* ═══════════ GÓC 1 — ĐỊNH NGHĨA ═══════════ */
  g1: {
    buoc1: {
      tieuDe: 'Ba hồ sơ, ba dạng',
      dan: 'Trên ba bục là ba hồ sơ doanh nghiệp. Mỗi hồ sơ thuộc đúng một dạng độc quyền. Xếp từng hồ sơ vào dạng của nó.',
      o: [
        { id: 'thuan',    ten: 'Độc quyền thuần túy',     goiY: 'Một doanh nghiệp, không đối thủ, tự quyết giá.' },
        { id: 'nhom',     ten: 'Độc quyền nhóm',          goiY: 'Khoảng 2 – 5 doanh nghiệp, có thể ngầm bắt tay nhau.' },
        { id: 'thongLinh', ten: 'Doanh nghiệp thống lĩnh', goiY: 'Một doanh nghiệp trên 30% thị phần, hoặc nhóm trên 70%. Vẫn có đối thủ nhỏ.' }
      ],
      the: [
        { id: 'h1', dap: 'thongLinh', ten: 'Hồ sơ #1 · Nền tảng gọi xe',
          mo: 'Chiếm áp đảo thị trường, vẫn còn vài đối thủ nhỏ hơn nhưng không cản trở được. Tự tăng chiết khấu, tự tăng giá cước.',
          vd: 'Ví dụ: Grab.' },
        { id: 'h2', dap: 'thuan', ten: 'Hồ sơ #2 · Lưới điện',
          mo: 'Chỉ có một doanh nghiệp. Không có đối thủ. Quyết định hoàn toàn giá, kiểm soát toàn bộ nguồn điện quốc gia.',
          vd: 'Ví dụ: EVN, với lưới điện quốc gia.' },
        { id: 'h3', dap: 'nhom', ten: 'Hồ sơ #3 · Ba nhà mạng',
          mo: 'Ba doanh nghiệp chia nhau thị trường. Đổi giá một mình thì dễ bị đối thủ lật ngược, nên họ bắt tay nhau đồng giá gói cước.',
          vd: 'Ví dụ: Viettel, Vinaphone, Mobifone.' }
      ],
      sai: {
        thuan: 'Dạng này chỉ có đúng một doanh nghiệp và không có đối thủ nào. Hồ sơ này có nhiều hơn một bên.',
        nhom: 'Độc quyền nhóm có khoảng 2 – 5 doanh nghiệp, và giá của nhóm phụ thuộc vào việc họ có bắt tay nhau không. Hồ sơ này không như vậy.',
        thongLinh: 'Dạng thống lĩnh dựa vào thị phần (trên 30%, hoặc nhóm trên 70%) và vẫn có đối thủ nhỏ. Hồ sơ này khác.'
      }
    },
    buoc2: {
      tieuDe: 'Dây chuyền ràng buộc',
      dan: 'Các doanh nghiệp liên kết với nhau theo bốn hình thức. Ràng buộc càng chặt thì càng mất độc lập. Xếp từ lỏng lẻo nhất đến chặt nhất.',
      o: [
        { id: 's0', ten: '1 · Lỏng nhất' },
        { id: 's1', ten: '2' },
        { id: 's2', ten: '3' },
        { id: 's3', ten: '4 · Chặt nhất' }
      ],
      the: [
        { id: 'c1', dap: 's2', ten: 'Trust',     mo: 'Hợp nhất sản xuất và quản lý.' },
        { id: 'c2', dap: 's0', ten: 'Cartel',    mo: 'Thỏa thuận lỏng lẻo.' },
        { id: 'c3', dap: 's3', ten: 'Concern',   mo: 'Liên kết tài chính và đa ngành.' },
        { id: 'c4', dap: 's1', ten: 'Syndicate', mo: 'Thống nhất thương mại.' }
      ],
      sai: 'Vị trí này chưa đúng. Nhớ: mức độc lập giảm dần, tính ràng buộc và phụ thuộc tăng dần.'
    },
    manh: {
      ten: 'Định nghĩa',
      nd: 'Độc quyền là sự tập trung hoặc liên kết của các doanh nghiệp lớn, tạo ra khả năng chi phối đáng kể hoạt động sản xuất, tiêu thụ và điều kiện thị trường, qua đó thu được lợi nhuận độc quyền cao.',
      them: 'Có ba dạng (thuần túy, nhóm, thống lĩnh) và bốn hình thức tổ chức (Cartel → Syndicate → Trust → Concern).'
    }
  },

  /* ═══════════ GÓC 2 — VÒNG XOÁY ═══════════ */
  g2: {
    buoc1: {
      tieuDe: 'Từ cạnh tranh đến độc quyền: xếp đúng thứ tự',
      dan: '<b>Câu hỏi:</b> một doanh nghiệp đi từ cạnh tranh tới độc quyền qua 5 bước nào, theo thứ tự nào? ' +
           'Xếp 5 thẻ bên dưới vào 5 ô: ô 1 là bước xảy ra đầu tiên, ô 5 là bước cuối cùng. ' +
           '<b>Gợi ý:</b> bước đầu là <i>cạnh tranh</i>, bước cuối là <i>quyền lực thị trường</i>. ' +
           'Mỗi lần xếp đúng, bánh răng quay và hiện một câu hỏi nhỏ.',
      o: [
        { id: 'b0', ten: 'Bước 1 · đầu tiên' }, { id: 'b1', ten: 'Bước 2' }, { id: 'b2', ten: 'Bước 3' },
        { id: 'b3', ten: 'Bước 4' }, { id: 'b4', ten: 'Bước 5 · cuối cùng' }
      ],
      the: [
        { id: 'r3', dap: 'b3', ten: 'Rào cản gia nhập', mo: 'Khó có đối thủ mới bước vào.' },
        { id: 'r1', dap: 'b1', ten: 'Tích lũy',         mo: 'Kẻ yếu phá sản, kẻ mạnh tích lũy giá trị thặng dư.' },
        { id: 'r4', dap: 'b4', ten: 'Quyền lực thị trường', mo: 'Số ít tập đoàn nắm thị phần, chi phối giá.' },
        { id: 'r0', dap: 'b0', ten: 'Cạnh tranh',       mo: 'Đua nhau hạ giá và đổi mới công nghệ.' },
        { id: 'r2', dap: 'b2', ten: 'Đầu tư, sáp nhập', mo: 'Mở rộng sản xuất, thâu tóm đối thủ.' }
      ],
      sai: 'Chưa khớp. Gợi ý: nó bắt đầu từ cạnh tranh, và kết thúc ở quyền lực thị trường.',
      /* hỏi tình huống mỗi lần lắp xong một bánh, theo id bánh (dap) */
      hoi: {
        b0: { goiY: 'Hạ giá kéo dài làm lợi nhuận mỏng đi. Hãng ít vốn khó trụ nổi.',
              q: 'Cuộc đua hạ giá kéo dài. Hãng yếu sẽ ra sao?',
              c: [{ t: 'Phá sản hoặc bị thôn tính', ok: true, fb: 'Kẻ yếu bị loại, đó là cách cạnh tranh sinh ra tập trung.' },
                  { t: 'Luôn sống khỏe nhờ giá thấp', fb: 'Hạ giá kéo dài bào mòn lợi nhuận. Hãng yếu vốn mỏng chịu không nổi.' }] },
        b1: { goiY: 'Hãng mạnh dùng tiền tích lũy để mở rộng và mua đối thủ.',
              q: 'Hãng mạnh có nhiều tiền dư. Họ làm gì để lớn thêm?',
              c: [{ t: 'Mở rộng sản xuất, mua đối thủ', ok: true, fb: 'Tích lũy đủ lớn thì chuyển thành đầu tư và sáp nhập.' },
                  { t: 'Chia hết cho khách hàng', fb: 'Chia hết thì không còn lợi thế mới. Doanh nghiệp thường dùng vốn để lớn thêm.' }] },
        b2: { goiY: 'Mua lại đối thủ nghĩa là đối thủ ít đi.',
              q: 'Một hãng mua lại đối thủ lớn nhất. Số đối thủ thay đổi thế nào?',
              c: [{ t: 'Số đối thủ giảm, thị phần dồn về một mối', ok: true, fb: 'Sáp nhập là con đường nhanh nhất để tập trung.' },
                  { t: 'Thị trường chắc chắn đông đối thủ hơn', fb: 'Ngược lại: mua lại thì đối thủ bớt đi.' }] },
        b3: { goiY: 'Vốn và mạng lưới sẵn có là “rào cản gia nhập” bảo vệ hãng lớn.',
              q: 'Hãng lớn đã có vốn và nhiều người dùng. Hãng mới vào ngành gặp khó gì?',
              c: [{ t: 'Rào cản gia nhập: vốn lớn, mạng lưới sẵn có, khó đuổi kịp', ok: true, fb: 'Rào cản là hàng rào bảo vệ lợi nhuận của kẻ đã ở trong.' },
                  { t: 'Không gặp trở ngại nào', fb: 'Chính rào cản là thứ làm vòng xoáy tự khóa lại.' }] },
        b4: { goiY: 'Nắm phần lớn thị trường thì có thể ảnh hưởng tới giá và điều kiện chung.',
              q: 'Chỉ còn vài tập đoàn nắm thị phần. Họ có sức mạnh gì?',
              c: [{ t: 'Gây ảnh hưởng lớn lên giá và điều kiện thị trường', ok: true, fb: 'Đó là quyền lực thị trường, điểm cuối của vòng xoáy.' },
                  { t: 'Không có gì khác với doanh nghiệp nhỏ', fb: 'Quy mô đủ lớn thì thị trường phải chạy theo họ.' }] }
      },
      lenin: '“Tự do cạnh tranh đẻ ra tập trung sản xuất, và sự tập trung sản xuất này phát triển tới mức độ nhất định lại dẫn tới độc quyền.”',
      leninNguon: 'V. I. Lênin',
      xoay: 'Vòng xoáy đã khớp: <b>cạnh tranh → tích lũy → đầu tư, sáp nhập → rào cản gia nhập → quyền lực thị trường</b>. Rồi quyền lực lại bảo vệ cạnh tranh có lợi cho kẻ mạnh. Vòng xoáy tự quay.'
    },
    buoc2: {
      tieuDe: 'Bốn rương lý do',
      dan: 'Bốn chiếc rương nhỏ, mỗi rương là một lý do khiến doanh nghiệp hướng tới độc quyền. Trả lời đúng tình huống để mở rương.',
      ruong: [
        { ten: 'Lý do I', tieuDe: 'Duy trì lợi nhuận vượt trội',
          goiY: 'Cạnh tranh làm lợi nhuận giảm. Rào cản làm đối thủ mới khó vào.',
              q: 'Hãng có rào cản tham gia thì được lợi gì?',
          c: [{ t: 'Đối thủ mới khó vào, lợi nhuận được bảo vệ bền vững', ok: true, fb: 'Rào cản giữ lợi nhuận khỏi bị bào mòn.' },
              { t: 'Lợi nhuận giảm nhanh hơn', fb: 'Rào cản làm ngược lại: giữ lợi nhuận.' },
              { t: 'Không có gì đổi khác', fb: 'Có đổi: cạnh tranh giảm thì lợi nhuận được giữ.' }],
          nd: 'Doanh nghiệp không ghét cạnh tranh, họ ghét lợi nhuận bị bào mòn. Độc quyền giữ cho lợi nhuận vượt trội tồn tại lâu.' },
        { ten: 'Lý do II', tieuDe: 'Nhiều quyền lực hơn trong giao dịch',
          goiY: 'Ai cũng cần dùng nền tảng đó, nên khó rời đi.',
              q: 'Nền tảng nắm khách hàng khổng lồ tăng phí. Ai phải chịu?',
          c: [{ t: 'Cả khách hàng lẫn người bán đều phải chịu', ok: true, fb: 'Nắm đằng chuôi trong mọi cuộc đàm phán: ai cũng khó rời đi.' },
              { t: 'Người bán thoải mái rời đi ngay', fb: 'Rời đi nghĩa là mất khách. Đó chính là sức ép.' },
              { t: 'Nền tảng phải hạ phí', fb: 'Có quyền lực đàm phán thì họ không phải hạ phí.' }],
          nd: 'Nền tảng lớn tăng giảm phí đầu vào, đầu ra, và các bên đều phải chấp nhận.' },
        { ten: 'Lý do III', tieuDe: 'Giảm sức ép đối thủ, kiểm soát tương lai',
          goiY: 'Ít đối thủ nghĩa là bớt rủi ro phá giá, dễ lập kế hoạch dài hạn.',
              q: 'Ít đối thủ thì doanh nghiệp được lợi gì?',
          c: [{ t: 'Dự đoán được tương lai, chủ động nguồn thu và đầu tư dài hạn', ok: true, fb: 'Bớt bất ổn thì lập kế hoạch dài hạn được.' },
              { t: 'Lập kế hoạch khó hơn', fb: 'Ngược lại: đối thủ ít thì bất ổn ít.' },
              { t: 'Không liên quan tới kế hoạch', fb: 'Rất liên quan: ít đối thủ nghĩa là bớt rủi ro phá giá.' }],
          nd: 'Ít đối thủ nghĩa là bớt bất ổn, dễ dự đoán, và chủ động đầu tư dài hạn.' },
        { ten: 'Lý do IV', tieuDe: 'Lợi thế quy mô và hiệu ứng mạng',
          goiY: 'Chi phí mỗi đơn vị giảm khi lớn (quy mô). Giá trị tăng khi nhiều người dùng (mạng lưới).',
              q: 'Ứng dụng càng nhiều người dùng càng hấp dẫn người mới. Đó là gì?',
          c: [{ t: 'Lợi thế quy mô và hiệu ứng mạng', ok: true, fb: 'Càng lớn càng dễ lớn thêm, càng khó có ai đuổi kịp.' },
              { t: 'Một kiểu rào cản pháp lý', fb: 'Đây là lợi thế kinh tế, không phải quy định pháp luật.' },
              { t: 'Chỉ là may mắn', fb: 'Nó là một cơ chế lặp đi lặp lại, không phải may rủi.' }],
          nd: 'Quy mô giảm chi phí, mạng lưới tăng giá trị. Ai đạt ngưỡng trước thì rất khó bị đuổi kịp.' }
      ]
    },
    buoc3: {
      tieuDe: 'Nhà kinh tế phản biện',
      nhaKinhTe: 'Khoan đã. Quy mô lớn không phải lúc nào cũng xấu. Quy mô giúp giảm chi phí, có tiền đầu tư đổi mới. ' +
                 'Điều cần xét là doanh nghiệp lớn nhờ làm tốt, hay lớn để dựng rào cản? ' +
                 'Hãy phân loại giúp tôi.',
      o: [
        { id: 'tot', ten: 'Quy mô có lợi', goiY: 'Giảm chi phí, tăng đầu tư. Đối thủ vẫn còn cơ hội.' },
        { id: 'hai', ten: 'Rào cản gây hại', goiY: 'Chặn đối thủ, giữ giá cao, giảm lựa chọn.' }
      ],
      the: [
        { id: 'k1', dap: 'tot', ten: 'Nhà máy lớn sản xuất rẻ hơn',  mo: 'Mua nguyên liệu số lượng lớn, giá mỗi sản phẩm giảm, giá bán cho khách giảm theo.' },
        { id: 'k2', dap: 'hai', ten: 'Mua đối thủ để dập tắt',      mo: 'Mua lại đối thủ mới nổi chỉ để họ không còn cạnh tranh được.' },
        { id: 'k3', dap: 'tot', ten: 'Dồn lợi nhuận vào nghiên cứu', mo: 'Dùng vốn lớn để đầu tư công nghệ mới mà doanh nghiệp nhỏ không đủ sức làm.' },
        { id: 'k4', dap: 'hai', ten: 'Giữ khách bằng cách chặn đường rời', mo: 'Khóa dữ liệu, khó chuyển sang nền tảng khác, để khách không còn lựa chọn thực sự.' }
      ],
      sai: {
        tot: 'Xét lại: việc này có làm đối thủ hết cơ hội, hay chỉ làm doanh nghiệp làm tốt hơn?',
        hai: 'Xét lại: việc này làm doanh nghiệp mạnh hơn nhờ sản phẩm tốt hơn, hay nhờ chặn đối thủ?'
      },
      ketLuan: 'Phép thử: <b>lớn lên nhờ làm tốt hơn</b> thì có lợi; <b>lớn lên bằng cách chặn đường đối thủ và khách hàng</b> thì thành rào cản gây hại.'
    },
    buoc4: {
      tieuDe: 'Hai hồ sơ vụ án',
      dan: 'Đọc cả hai hồ sơ trước khi ghi mảnh bằng chứng.',
      ho: [
        { ten: 'Standard Oil', nhan: 'Hồ sơ cổ điển',
          nd: 'Rockefeller và Standard Oil là ví dụ điển hình về tập trung kiểm soát trong ngành dầu mỏ, thông qua mở rộng, sáp nhập và các thỏa thuận tạo lợi thế. ' +
              'Năm 1911, Tòa án Tối cao Mỹ quyết định giải thể Standard Oil: tập đoàn bị tách thành nhiều doanh nghiệp riêng.' },
        { ten: 'Google Search', nhan: 'Hồ sơ thời sự',
          nd: 'Năm 2024, tòa án liên bang Mỹ kết luận Google duy trì độc quyền trái luật trong thị trường tìm kiếm tổng quát và quảng cáo văn bản tìm kiếm. ' +
              'Phán quyết cuối cùng về biện pháp khắc phục được ban hành tháng 12/2025. Hồ sơ thực thi và kháng cáo tiếp tục có diễn biến trong năm 2026.' }
      ],
      docDu: 'Đã đọc cả hai hồ sơ'
    },
    manh: {
      ten: 'Động cơ',
      nd: 'Doanh nghiệp hướng tới độc quyền vì bốn lý do: giữ lợi nhuận vượt trội, có thêm quyền lực trong giao dịch, giảm sức ép đối thủ và kiểm soát tương lai, và nhờ lợi thế quy mô cùng hiệu ứng mạng. Quy mô tốt hay xấu tùy ở chỗ nó đến từ làm tốt hơn hay từ dựng rào cản.',
      them: 'Standard Oil (giải thể năm 1911) và Google Search (kết luận 2024, biện pháp khắc phục tháng 12/2025) cho thấy xã hội có phản ứng với tập trung quá mức.'
    }
  },

  /* ═══════════ GÓC 3 — GRAB–UBER ═══════════ */
  g3: {
    buoc1: {
      tieuDe: 'Dựng lại vụ việc',
      dan: 'Bản đồ Đông Nam Á treo tường có bốn mốc thời gian. Gắn mỗi dữ kiện vào đúng giai đoạn.',
      o: [
        { id: 'canhTranh', ten: '1 · Cạnh tranh', goiY: 'Hai bên giành khách, giành tài xế.' },
        { id: 'tapTrung', ten: '2 · Tập trung', goiY: 'Hai đối thủ trở thành một.' },
        { id: 'quyenLuc', ten: '3 · Quyền lực thị trường', goiY: 'Thị phần và giá cả sau thương vụ.' },
        { id: 'dieuTiet', ten: '4 · Điều tiết, cạnh tranh mới', goiY: 'Cơ quan cạnh tranh và đối thủ mới.' }
      ],
      the: [
        { id: 'a', dap: 'quyenLuc', ten: 'Thị phần và giá', mo: 'Thị phần Grab được cơ quan cạnh tranh Singapore (CCCS) ghi nhận khoảng 80%. Giá cước hiệu dụng tăng 10 – 15% sau thương vụ.' },
        { id: 'b', dap: 'canhTranh', ten: 'Cuộc đua', mo: 'Khuyến mãi, thưởng tài xế, mở rộng thị trường, đầu tư công nghệ.' },
        { id: 'c', dap: 'dieuTiet', ten: 'Nhìn lại', mo: 'Tác động cạnh tranh giảm đáng kể được cơ quan quản lý ghi nhận; vấn đề đặt ra là điều tiết và tạo điều kiện cho đối thủ mới. [đối chiếu]' },
        { id: 'd', dap: 'tapTrung', ten: 'Ngày 26/3/2018', mo: 'Grab mua lại toàn bộ hoạt động đặt xe của Uber ở Đông Nam Á. Uber nhận 27,5% cổ phần Grab và có đại diện trong hội đồng quản trị Grab.' }
      ],
      sai: 'Chưa đúng giai đoạn. Đọc lại dữ kiện: nó diễn ra trước hay sau khi Uber rời thị trường?'
    },
    buoc2: {
      tieuDe: 'Đổi vai: một sự kiện, ba kết cục',
      dan: 'Sự kiện: <b>Uber rời khỏi thị trường</b>. Lần lượt đóng ba vai, chọn điều có khả năng xảy ra nhất với vai đó.',
      vai: [
        { ten: 'Khách hàng',
          goiY: 'Trước đây Grab tăng giá thì bạn chuyển sang Uber. Giờ không còn đường đó.',
              q: 'Bạn là khách đi xe. Uber rời đi. Bạn còn bao nhiêu lựa chọn?',
          c: [{ t: 'Ít lựa chọn thay thế hơn, giá chuyến xe và ưu đãi có thể thay đổi', ok: true, fb: 'Trước đây Grab tăng giá thì bạn chuyển sang Uber. Giờ không còn đường đó.' },
              { t: 'Vẫn chuyển qua lại giữa hai nền tảng như cũ', fb: 'Uber không còn hoạt động gọi xe độc lập tại Đông Nam Á.' },
              { t: 'Ưu đãi nhiều hơn vì Grab muốn giữ khách', fb: 'Áp lực phải khuyến mãi giảm xuống khi một đối thủ biến mất.' }],
          kq: 'Khách hàng: ít lựa chọn, giá và ưu đãi dễ bất lợi.' },
        { ten: 'Tài xế',
          goiY: 'Ít nơi để chạy thì tài xế khó mặc cả hoa hồng.',
              q: 'Bạn là tài xế. Giờ chỉ còn một nền tảng lớn. Bạn thế nào?',
          c: [{ t: 'Còn ít nơi để đi, hoa hồng và điều kiện dễ do nền tảng quyết', ok: true, fb: 'Quyền đàm phán của nền tảng với tài xế tăng lên.' },
              { t: 'Hai hãng giành tài xế bằng thưởng nhiều hơn', fb: 'Giờ chỉ còn một bên mạnh, nên thưởng để giành tài xế ít cần thiết hơn.' },
              { t: 'Không có gì thay đổi', fb: 'Có thay đổi: thiếu nền tảng thay thế thì tài xế yếu thế hơn khi đàm phán.' }],
          kq: 'Tài xế: thiếu chỗ thay thế, hoa hồng dễ bị chi phối.' },
        { ten: 'Grab',
          goiY: 'Đối thủ biến mất thì áp lực giảm giá và khuyến mãi giảm.',
              q: 'Bạn là Grab. Uber rời đi. Điều gì có lợi cho bạn?',
          c: [{ t: 'Bớt áp lực cạnh tranh, có thêm quyền quyết định giá và điều kiện giao dịch', ok: true, fb: 'Đó là quyền lực thị trường: thị phần khoảng 80%, giá hiệu dụng tăng 10 – 15%.' },
              { t: 'Phải giảm giá mạnh hơn để giữ khách', fb: 'Đối thủ biến mất thì áp lực giảm giá cũng giảm.' },
              { t: 'Mất hết lợi thế quy mô', fb: 'Ngược lại, quy mô và thị phần của Grab tăng.' }],
          kq: 'Grab: bớt áp lực, thêm quyền lực quyết định giá và điều kiện.' }
      ],
      tong: 'Cùng một sự kiện, nhưng người được lợi và người chịu thiệt khác nhau. Quyền lực thị trường dồn về một phía.'
    },
    buoc3: {
      tieuDe: 'Cái cân hai đĩa',
      dan: 'Đánh giá thương vụ Grab – Uber. Đặt mỗi thẻ vào đĩa của nó: <b>tích cực tiềm năng</b> hay <b>tiêu cực tiềm năng</b>.',
      o: [
        { id: 'tich', ten: 'Tích cực tiềm năng' },
        { id: 'tieu', ten: 'Tiêu cực tiềm năng' }
      ],
      the: [
        { id: 't1', dap: 'tich', ten: 'Tận dụng lợi thế quy mô' },
        { id: 't2', dap: 'tich', ten: 'Tối ưu chi phí vận hành' },
        { id: 't3', dap: 'tich', ten: 'Tăng nguồn lực đầu tư công nghệ' },
        { id: 't4', dap: 'tich', ten: 'Phát triển hệ sinh thái dịch vụ' },
        { id: 't5', dap: 'tich', ten: 'Mở rộng phạm vi phục vụ' },
        { id: 'x1', dap: 'tieu', ten: 'Giảm áp lực cạnh tranh' },
        { id: 'x2', dap: 'tieu', ten: 'Có khả năng tăng giá' },
        { id: 'x3', dap: 'tieu', ten: 'Giảm lựa chọn của khách hàng' },
        { id: 'x4', dap: 'tieu', ten: 'Tăng rào cản gia nhập thị trường' },
        { id: 'x5', dap: 'tieu', ten: 'Tăng quyền đàm phán với tài xế' }
      ],
      sai: 'Thẻ này nằm ở đĩa kia. Hỏi: nó là điều doanh nghiệp có thể làm tốt hơn, hay điều thị trường và người dùng có thể mất?',
      ketLuan: 'Hai đĩa cân bằng về số thẻ, nhưng đĩa bên phải là điều đã thấy: <b>thị phần khoảng 80%, giá hiệu dụng tăng 10 – 15%, tác động cạnh tranh giảm đáng kể</b>. Mặt tích cực chỉ là <i>tiềm năng</i>; nó chỉ thành thật khi có người giám sát và có cạnh tranh buộc doanh nghiệp chia sẻ lợi ích.'
    },
    manh: {
      ten: 'Hậu quả thực tế',
      nd: 'Ngày 26/3/2018 Grab mua lại hoạt động của Uber ở Đông Nam Á. Sau đó thị phần Grab khoảng 80%, giá cước hiệu dụng tăng 10 – 15% (theo cơ quan cạnh tranh Singapore). Khách hàng, tài xế chịu bất lợi; Grab thêm quyền lực.',
      them: 'Quyền lực thị trường tác động lên ba bên theo ba cách khác nhau. Mặt tích cực của quy mô chỉ là tiềm năng.'
    }
  },

  /* ═══════════ GÓC 4 — VIỆT NAM ═══════════ */
  g4: {
    cua: {
      tieuDe: 'Cánh cửa ba tay nắm',
      q: 'Việt Nam có ủng hộ độc quyền không?',
      goiY: 'Nhớ lại: có lĩnh vực Nhà nước giữ độc quyền (tiền tệ, truyền tải điện), và luật vẫn kiểm soát doanh nghiệp lớn.',
      giu: true,
      c: [
        { id: 'A', t: 'A. Việt Nam phản đối mọi hình thức độc quyền.', fb: 'Cửa không mở. Gợi ý: có những lĩnh vực Nhà nước vẫn nắm độc quyền, như phát hành tiền hay truyền tải điện.' },
        { id: 'B', t: 'B. Việt Nam ủng hộ độc quyền để tạo ra doanh nghiệp lớn.', fb: 'Cửa không mở. Gợi ý: pháp luật Việt Nam vẫn cấm lạm dụng vị trí thống lĩnh và kiểm soát sáp nhập.' },
        { id: 'C', t: 'C. Việt Nam chấp nhận một số hình thức độc quyền nhưng phải kiểm soát.', ok: true, fb: 'Cửa mở.' }
      ],
      sau: ['Không duy trì độc quyền tuyệt đối', 'Hướng tới cạnh tranh lành mạnh', 'Chấp nhận một số lĩnh vực độc quyền nhà nước']
    },
    ban: [
      { id: 'kiemSoat', ten: 'Kiểm soát doanh nghiệp', dan: 'Luật Cạnh tranh 2018 nhắm vào hai nhóm: doanh nghiệp có vị thế thống lĩnh hoặc độc quyền, và doanh nghiệp lạm dụng quyền lực thị trường.',
        ds: [
          'Cấm lạm dụng vị trí thống lĩnh để gây thiệt hại cho đối thủ hoặc người tiêu dùng.',
          'Cấm lạm dụng vị trí độc quyền để áp đặt điều kiện bất lợi cho khách hàng.',
          'Kiểm soát thỏa thuận hạn chế cạnh tranh: ấn định giá, phân chia thị trường, hạn chế sản lượng.',
          'Kiểm soát tập trung kinh tế: sáp nhập, hợp nhất, mua lại nếu có nguy cơ hạn chế cạnh tranh đáng kể.',
          'Xử lý hành vi cạnh tranh không lành mạnh.'
        ],
        vuAn: 'Vụ Vinapco: do tranh chấp mức phí dịch vụ, Vinapco đơn phương ngừng cấp xăng máy bay cho Pacific Airlines (Jetstar Pacific), làm đình trệ gần 5.000 hành khách. ' +
              'Hội đồng Cạnh tranh phạt Vinapco hơn 3,37 tỷ đồng. Đây là vụ phạt chống độc quyền lịch sử và đầu tiên theo Luật Cạnh tranh.',
        thu: {
          dan: 'Xếp mỗi hành vi vào loại kiểm soát tương ứng.',
          o: [
            { id: 'thoaThuan', ten: 'Thỏa thuận hạn chế cạnh tranh' },
            { id: 'lamDung',   ten: 'Lạm dụng vị trí thống lĩnh' },
            { id: 'tapTrung',  ten: 'Kiểm soát tập trung kinh tế' }
          ],
          the: [
            { id: 'p1', dap: 'lamDung', ten: 'Đơn phương ngừng cấp xăng cho khách hàng', mo: 'Như vụ Vinapco và Pacific Airlines.' },
            { id: 'p2', dap: 'thoaThuan', ten: 'Hai hãng cùng thỏa thuận ấn định giá bán', mo: 'Bắt tay đồng giá.' },
            { id: 'p3', dap: 'tapTrung', ten: 'Hai doanh nghiệp lớn muốn sáp nhập', mo: 'Có nguy cơ hạn chế cạnh tranh đáng kể.' }
          ],
          sai: 'Chưa khớp. Nhớ: thỏa thuận là bắt tay giữa nhiều bên; lạm dụng là một bên dùng sức mạnh; tập trung kinh tế là sáp nhập, hợp nhất, mua lại.'
        } },
      { id: 'nhaNuoc', ten: 'Độc quyền nhà nước', dan: 'Nghị định 94/2017 quy định các hàng hóa, dịch vụ do Nhà nước độc quyền. Vì sao các lĩnh vực này không mở tự do?',
        ds: ['Tiền tệ', 'Truyền tải điện', 'Quốc phòng', 'Dự trữ quốc gia'],
        thu: {
          dan: 'Ghép mỗi lĩnh vực với lý do Nhà nước giữ độc quyền.',
          o: [
            { id: 'tienTe', ten: 'Tiền tệ' },
            { id: 'dien', ten: 'Truyền tải điện' },
            { id: 'quocPhong', ten: 'Quốc phòng' },
            { id: 'duTru', ten: 'Dự trữ quốc gia' }
          ],
          the: [
            { id: 'l1', dap: 'quocPhong', ten: 'An ninh quốc gia', mo: 'Không thể để nhiều chủ thể tư nhân tự do tham gia.' },
            { id: 'l2', dap: 'dien', ten: 'Hạ tầng dùng chung, dựng hai lưới điện song song là lãng phí', mo: 'Độc quyền tự nhiên, cần điều phối thống nhất.' },
            { id: 'l3', dap: 'tienTe', ten: 'Ổn định kinh tế vĩ mô và chủ quyền tiền tệ', mo: 'Nếu ai cũng tự phát hành thì kinh tế mất ổn định.' },
            { id: 'l4', dap: 'duTru', ten: 'An sinh, ứng phó thiên tai, khủng hoảng', mo: 'Phải do Nhà nước nắm giữ để dùng đúng lúc.' }
          ],
          sai: 'Chưa khớp. Hỏi: nếu mở tự do thì rủi ro lớn nhất cho xã hội ở lĩnh vực này là gì?'
        } },
      { id: 'congCu', ten: 'Công cụ kiểm soát', dan: 'Nhà nước kiểm soát độc quyền bằng ba nhóm công cụ.',
        ds: ['Kiểm soát giá', 'Kiểm soát sản lượng và phạm vi', 'Giám sát và xử lý vi phạm'],
        thu: {
          dan: 'Ghép công cụ với việc làm cụ thể.',
          o: [
            { id: 'gia', ten: 'Kiểm soát giá' },
            { id: 'sanLuong', ten: 'Kiểm soát sản lượng và phạm vi' },
            { id: 'xuLy', ten: 'Giám sát và xử lý vi phạm' }
          ],
          the: [
            { id: 'q1', dap: 'xuLy', ten: 'Thanh tra, phạt khi lạm dụng', mo: 'Như phạt Vinapco hơn 3,37 tỷ đồng.' },
            { id: 'q2', dap: 'gia', ten: 'Quy định khung giá hoặc cách tính giá', mo: 'Không để doanh nghiệp độc quyền tự ý đặt giá.' },
            { id: 'q3', dap: 'sanLuong', ten: 'Quy định mức cung và phạm vi hoạt động', mo: 'Không để giữ hàng đẩy giá hoặc lấn sang lĩnh vực khác.' }
          ],
          sai: 'Chưa khớp. Giá, sản lượng, xử lý: mỗi thẻ nhắm vào một trong ba việc đó.'
        } }
    ],
    soSanh: {
      tieuDe: 'Hai hướng đi',
      dan: 'Cùng là kiểm soát độc quyền, nhưng cách làm khác nhau. Điện lực: tách các khâu. Vàng miếng: quản lý bằng quy định.',
      dien: {
        ten: 'Điện lực',
        thu: 'Xếp từng khâu: Nhà nước giữ, hay mở cho cạnh tranh?',
        o: [{ id: 'giu', ten: 'Nhà nước giữ' }, { id: 'mo', ten: 'Mở cạnh tranh' }],
        the: [
          { id: 'e1', dap: 'giu', ten: 'Truyền tải điện', mo: 'Lưới điện quốc gia, độc quyền tự nhiên.' },
          { id: 'e2', dap: 'mo', ten: 'Phát điện', mo: 'Nhiều nhà máy cùng bán điện.' },
          { id: 'e3', dap: 'mo', ten: 'Bán buôn điện', mo: 'Thị trường có nhiều bên mua bán.' },
          { id: 'e4', dap: 'mo', ten: 'Bán lẻ điện', mo: 'Dần mở cho cạnh tranh.' }
        ],
        sai: 'Khâu nào là hạ tầng dùng chung (nên giữ)? Khâu nào có thể có nhiều nhà cung cấp (nên mở)?'
      },
      vang: {
        ten: 'Vàng miếng',
        nd: 'Nghị định 232/2025 có hiệu lực từ 10/10/2025, điều chỉnh việc quản lý thị trường vàng miếng. Hướng đi: không để tự do hoàn toàn, mà quản lý bằng quy định để tránh rủi ro tập trung và thao túng. [đối chiếu với văn bản gốc]',
        goiY: 'Cả hai đều không bị cấm hẳn, cũng không để tự do hoàn toàn.',
              q: 'Điện lực và vàng miếng có điểm chung gì?',
        c: [{ t: 'Nhà nước chọn công cụ kiểm soát phù hợp với từng lĩnh vực, không cấm hết cũng không để tự do hoàn toàn', ok: true, fb: 'Đúng với đáp án C ở cánh cửa: chấp nhận một số hình thức độc quyền nhưng phải kiểm soát.' },
            { t: 'Cả hai đều bị cấm hoàn toàn độc quyền', fb: 'Không đúng: truyền tải điện vẫn do Nhà nước giữ.' },
            { t: 'Cả hai đều để thị trường tự do hoàn toàn', fb: 'Không đúng: cả hai đều có quy định kiểm soát.' }]
      }
    },
    manh: {
      ten: 'Chính sách',
      nd: 'Việt Nam không duy trì độc quyền tuyệt đối, hướng tới cạnh tranh lành mạnh, và chấp nhận một số lĩnh vực độc quyền nhà nước (Nghị định 94/2017) nhưng kiểm soát: Luật Cạnh tranh 2018 cấm lạm dụng vị trí thống lĩnh, kiểm soát tập trung kinh tế; công cụ gồm kiểm soát giá, sản lượng, phạm vi, và giám sát xử lý vi phạm.',
      them: 'Vụ Vinapco: phạt hơn 3,37 tỷ đồng, vụ phạt chống độc quyền đầu tiên theo Luật Cạnh tranh.'
    }
  },

  /* ═══════════ MÀN KẾT: HỘI ĐỒNG ═══════════ */
  hoiDong: {
    tieuDe: 'Trước Hội đồng',
    cau: 'Nếu một lĩnh vực vận hành hiệu quả hơn khi chỉ có một doanh nghiệp, nên ưu tiên cạnh tranh hay hiệu quả phục vụ xã hội?',
    dan: 'Không có đáp án đúng tuyệt đối. Hội đồng chấm theo mức độ bạn lập luận dựa trên bằng chứng. Chọn lập trường, rồi chọn các mảnh bằng chứng để bảo vệ nó.',
    lapTruong: [
      { id: 'canhTranh', ten: 'Ưu tiên cạnh tranh', mo: 'Dù vận hành hiệu quả, một doanh nghiệp duy nhất vẫn rủi ro hơn lợi.' },
      { id: 'phucVu', ten: 'Ưu tiên hiệu quả phục vụ xã hội', mo: 'Nếu một doanh nghiệp phục vụ tốt hơn, đừng ép chia nhỏ.' },
      { id: 'canBang', ten: 'Chấp nhận độc quyền có kiểm soát', mo: 'Cho phép khi hiệu quả được chứng minh, và có giám sát chặt.' }
    ],
    /* mỗi lập trường × mỗi mảnh: điểm 0-2 và câu lập luận */
    luan: {
      canhTranh: [
        [1, 'Theo định nghĩa, độc quyền là khả năng chi phối sản xuất, tiêu thụ và điều kiện thị trường. Sức mạnh đó dễ bị dùng sai.'],
        [1, 'Doanh nghiệp có động cơ giữ lợi nhuận vượt trội và dựng rào cản, nên cạnh tranh cần được bảo vệ ngay từ đầu.'],
        [2, 'Vụ Grab – Uber cho thấy khi một đối thủ biến mất, thị phần khoảng 80% và giá hiệu dụng tăng 10 – 15%. Hiệu quả chưa chắc đến tay người dùng.'],
        [1, 'Pháp luật Việt Nam cũng cấm lạm dụng vị trí thống lĩnh và kiểm soát tập trung, tức là coi cạnh tranh là điều cần giữ.']
      ],
      phucVu: [
        [1, 'Độc quyền là tập trung doanh nghiệp lớn, và quy mô lớn có thể phục vụ tốt hơn nếu được dùng đúng.'],
        [2, 'Lợi thế quy mô và hiệu ứng mạng khiến một đơn vị lớn phục vụ nhiều người với chi phí thấp hơn nhiều đơn vị nhỏ.'],
        [1, 'Mặt tích cực tiềm năng: tối ưu chi phí, tăng đầu tư công nghệ. Nhưng đó mới chỉ là tiềm năng, cần kiểm chứng.'],
        [2, 'Việt Nam có chủ trương độc quyền nhà nước ở truyền tải điện, tiền tệ, quốc phòng, dự trữ quốc gia, vì phục vụ xã hội ở các lĩnh vực đó quan trọng hơn cạnh tranh.']
      ],
      canBang: [
        [1, 'Độc quyền là sức chi phối thị trường. Sức mạnh càng lớn thì càng cần giám sát.'],
        [1, 'Quy mô có thể có lợi hoặc là rào cản: điều quyết định là doanh nghiệp lớn nhờ làm tốt hay nhờ chặn đối thủ.'],
        [2, 'Grab – Uber: thị phần khoảng 80%, giá tăng 10 – 15%. Đó là lý do mặt tích cực chỉ nên được chấp nhận khi có kiểm soát.'],
        [2, 'Việt Nam chọn cách này: chấp nhận một số lĩnh vực độc quyền nhà nước nhưng kiểm soát giá, sản lượng, phạm vi và xử lý vi phạm.']
      ]
    },
    thieu: 'Hội đồng chưa chấp nhận: cần ít nhất hai mảnh bằng chứng trong lập luận của bạn.',
    muc: [
      { tuLe: 0.8, ten: 'Lập luận chặt', nd: 'Bằng chứng của bạn khớp với lập trường và bao quát cả định nghĩa, động cơ, hậu quả, chính sách.' },
      { tuLe: 0.5, ten: 'Lập luận khá', nd: 'Hợp lý, nhưng còn bỏ sót mảnh có sức nặng hơn cho lập trường này.' },
      { tuLe: 0, ten: 'Lập luận còn mỏng', nd: 'Bằng chứng còn ít hoặc chưa trúng. Thử chọn thêm mảnh bằng chứng sát với lập trường của bạn.' }
    ],
    nopNut: 'Trình bày trước Hội đồng',
    doiNut: 'Chỉnh lại lập luận'
  },

  /* ---------- thẻ bài học cuối ---------- */
  baiHoc: {
    nhan: 'Hội đồng đã nghe',
    tieuDe: 'Cạnh tranh sinh ra độc quyền, và độc quyền cần được kiểm soát',
    dan: 'Doanh nghiệp không ghét cạnh tranh, họ ghét lợi nhuận bị bào mòn. Cạnh tranh tự do đẻ ra tập trung, tập trung đến một mức thì thành độc quyền. ' +
         'Quyền lực đó có thể mang lại hiệu quả hoặc gây hại, nên Nhà nước phải kiểm soát chứ không thể bỏ mặc hay cấm hết.',
    dinhNghia: [
      ['Độc quyền là gì', 'Sự tập trung hoặc liên kết của các doanh nghiệp lớn, đủ sức chi phối sản xuất, tiêu thụ và điều kiện thị trường, thu lợi nhuận độc quyền cao.'],
      ['Từ đâu ra', 'Cạnh tranh → tích lũy → đầu tư, sáp nhập → rào cản gia nhập → quyền lực thị trường. Quy luật chuyển từ lượng sang chất.'],
      ['Ai được lợi', 'Doanh nghiệp thống lĩnh. Khách hàng và tài xế có thể bất lợi: ví dụ Grab – Uber, thị phần khoảng 80%, giá hiệu dụng tăng 10 – 15%.'],
      ['Nhà nước xử lý thế nào', 'Chấp nhận một số lĩnh vực độc quyền nhà nước, kiểm soát giá, sản lượng, phạm vi, phạt lạm dụng (Luật Cạnh tranh 2018).']
    ],
    trichDan: '“Tự do cạnh tranh đẻ ra tập trung sản xuất, và sự tập trung sản xuất này phát triển tới mức độ nhất định lại dẫn tới độc quyền.”',
    nguon: 'V. I. Lênin',
    tiep: 'Cầu thang đã mở. Tầng tiếp theo: <b>Phòng Giá trị thặng dư</b> (sắp mở).',
    nut: 'Xem cầu thang'
  },

  /* ---------- ý nghĩa của thay đổi trên bàn cờ khi nạp mỗi thẻ ---------- */
  yNghia: [
    { tieu: 'Quân cờ gộp lại: cạnh tranh sinh ra tập trung',
      nd: 'Mỗi quân cờ là một doanh nghiệp. Cạnh tranh tự do khiến kẻ yếu phá sản hoặc bị mua lại, nên các quân nhỏ <b>gộp thành ít quân lớn hơn</b>. ' +
          'Đây chính là định nghĩa: độc quyền là sự tập trung của các doanh nghiệp lớn đủ sức chi phối thị trường.',
      bang: 'ĐỘC QUYỀN = TẬP TRUNG' },
    { tieu: 'Bức tường vàng mọc lên: rào cản gia nhập',
      nd: 'Quân xám là <b>doanh nghiệp mới</b> muốn vào ngành. Nó lao tới rồi bị bức tường bật ngược lại. ' +
          'Doanh nghiệp lớn dựng rào cản (vốn, mạng lưới, hiệu ứng mạng) để giữ lợi nhuận và ít đối thủ, đó là <b>động cơ</b> hướng tới độc quyền.',
      bang: 'RÀO CẢN GIA NHẬP' },
    { tieu: 'Cột thị phần dâng lên: quyền lực dồn về một phía',
      nd: 'Cột bên trái cho thấy <b>thị phần khoảng 80%</b> sau thương vụ Grab – Uber, và giá cước hiệu dụng <b>tăng 10 – 15%</b>. ' +
          'Quân lớn mạnh hơn thì khách hàng và tài xế ít lựa chọn, tức là <b>hậu quả thực tế</b> của quyền lực thị trường.',
      bang: 'THỊ PHẦN ~80% · GIÁ +10–15%' },
    { tieu: 'Vòng kiểm soát bao quanh bàn: Nhà nước vào cuộc',
      nd: 'Chiếc vòng vàng quay quanh bàn là <b>Luật Cạnh tranh 2018</b>: không cấm hết độc quyền, nhưng kiểm soát giá, sản lượng, phạm vi, ' +
          'cấm lạm dụng vị trí thống lĩnh và xử phạt (như vụ Vinapco hơn 3,37 tỷ đồng). Đây là <b>chính sách</b> của Việt Nam.',
      bang: 'KIỂM SOÁT: LUẬT CẠNH TRANH 2018' }
  ],

  soTay: {
    ten: 'Độc quyền',
    tom: 'Độc quyền là sự tập trung hoặc liên kết của các doanh nghiệp lớn đủ sức chi phối sản xuất, tiêu thụ và điều kiện thị trường để thu lợi nhuận độc quyền. ' +
         'Nó sinh ra từ cạnh tranh tự do (tích lũy → sáp nhập → rào cản → quyền lực thị trường). ' +
         'Nhà nước chấp nhận một số lĩnh vực độc quyền nhà nước nhưng kiểm soát và xử lý lạm dụng.'
  }
};
