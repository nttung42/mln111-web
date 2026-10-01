/* ═══════════════════════════════════════════════════════════════════
   TOÀN BỘ CHỮ TIẾNG VIỆT CỦA GAME
   ───────────────────────────────────────────────────────────────────
   File này dành cho người phụ trách NỘI DUNG TRIẾT HỌC.
   Sửa chữ ở đây, không cần đụng vào bất kỳ file nào khác.

   Quy tắc:
   - Mỗi phòng có một khối riêng, đặt theo id của phòng.
   - Mọi trích dẫn phải ghi rõ nguồn ở trường `nguon`.
   - Giữ câu ngắn. Thẻ nội dung không được dài quá một màn hình.
   ═══════════════════════════════════════════════════════════════════ */

window.TX = window.TX || {};

TX.VI = {

  /* ---------- Chung ---------- */
  game: {
    ten: 'Tháp Xoắn Ốc',
    phu: 'Sản phẩm học tập môn MLN111 · Triết học Mác – Lênin',
    vaoPhong: 'Bước vào phòng',
    troLai: 'Trở lại phòng',
    veSanh: 'Về sảnh',
    tiepTuc: 'Tiếp tục',
    soTay: 'Sổ tay biện chứng',
    soTayTrong: 'Chưa có mục nào. Hoàn thành một phòng để ghi vào đây.',
    dieuKhien: {
      khoa: 'Giữ <kbd>Chuột trái</kbd> · Giữ <kbd>Chuột phải</kbd>',
      duPhong: 'Giữ <kbd>F</kbd> · Giữ <kbd>R</kbd> · <kbd>Kéo chuột</kbd> để nhìn quanh'
    }
  },

  sanh: {
    tieuDe: 'Tháp Xoắn Ốc',
    dan: 'Triết học Mác – Lênin nói về <em>quan hệ</em> và <em>quá trình</em>. ' +
         'Chữ viết chỉ mô tả được trạng thái tĩnh của những thứ vốn dĩ là vận động. ' +
         'Ở đây bạn sẽ tự tay vận hành chúng.',
    dan2: 'Trước mặt bạn là một cầu thang xoắn đi lên. Dọc đường có những cánh cửa sáng, ' +
          'mỗi cửa mang tên một khái niệm. Cứ leo, và mở cửa nào bạn muốn.',
    batDau: 'Bắt đầu leo',
    ghiChu: 'Không có thắng thua, không đếm giờ. Cứ nghịch thử.',

    leoLen:   'Leo lên và tìm một cánh cửa sáng',
    vaoCua:   'Giữ <kbd>F</kbd> để bước vào, hoặc bấm chuột vào cánh cửa',
    bamCua:   'Bấm chuột để bước vào cánh cửa này',
    dinhThap: 'Đỉnh tháp còn đang xây — những phòng tiếp theo sẽ mở ở đây'
  },

  /* ---------- Phòng: Lượng → Chất ---------- */
  'luong-chat': {
    tang: 'Tháp Xoắn Ốc · Tầng II — Lò Luyện',
    ten: 'Phòng I — Lượng đổi dẫn đến Chất đổi',
    chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

    moDau: {
      tieuDe: 'Quy luật chuyển hoá từ những thay đổi về lượng thành những thay đổi về chất',
      than: 'Trước mặt bạn là một bình nước. Đừng đọc gì cả — hãy tự làm nóng nó lên, ' +
            'rồi tự làm lạnh nó xuống. Quan sát xem <em>chất</em> của nó thay đổi vào lúc nào, ' +
            'và bằng cách nào.'
    },

    nhan: {
      chat: 'Chất',
      do: 'ĐỘ — LƯỢNG ĐỔI, CHẤT CHƯA ĐỔI',
      diemNut: 'ĐIỂM NÚT',
      tichLuy: 'Tích luỹ về lượng tại điểm nút',
      buocNhay: 'Bước nhảy'
    },

    trangThai: {
      ICE: 'NƯỚC ĐÁ — THỂ RẮN',
      WATER: 'NƯỚC — THỂ LỎNG',
      STEAM: 'HƠI NƯỚC — THỂ KHÍ'
    },

    nhan_buocNhay: {
      'WATER>STEAM': 'NƯỚC → HƠI',
      'STEAM>WATER': 'HƠI → NƯỚC',
      'WATER>ICE': 'NƯỚC → ĐÁ',
      'ICE>WATER': 'ĐÁ → NƯỚC'
    },

    baiHoc: {
      nhan: 'Bạn vừa tạo ra một BƯỚC NHẢY',
      tieuDe: 'Lượng đổi dần dần, chất đổi đột ngột',
      dan: 'Bạn đã cấp nhiệt từng chút một. Suốt một quãng dài, nước vẫn cứ là nước — chỉ nóng hơn. ' +
           'Rồi tới một điểm, nó ngừng nóng lên, tích luỹ thêm, và <em>nhảy</em> sang một chất khác.',
      dinhNghia: [
        ['Chất', 'Tính quy định vốn có, làm cho sự vật là <em>nó</em> chứ không phải cái khác. Ở đây: rắn — lỏng — khí.'],
        ['Lượng', 'Tính quy định về quy mô, trình độ, tốc độ… mà sự thay đổi của nó <em>chưa</em> làm sự vật thành cái khác. Ở đây: nhiệt độ.'],
        ['Độ', 'Khoảng giới hạn trong đó lượng đã biến đổi nhưng chất vẫn chưa đổi — chính là dải 0&nbsp;°C → 100&nbsp;°C trên thanh đo.'],
        ['Điểm nút', 'Thời điểm mà sự thay đổi về lượng đã đủ để làm chất thay đổi: 0&nbsp;°C và 100&nbsp;°C.'],
        ['Bước nhảy', 'Sự chuyển hoá về chất do những thay đổi về lượng trước đó gây ra. Nó <em>đứt đoạn</em>, không từ từ.']
      ],
      trichDan: '“Những thay đổi đơn thuần về lượng, đến một mức độ nhất định, sẽ chuyển hoá thành những sự khác nhau về chất.”',
      nguon: 'Ph. Ăngghen — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
      tiepTheo: {
        tieuDe: 'Chưa xong',
        than: 'Quy luật này đi theo cả hai chiều. Hãy quay lại và thử đi <em>ngược</em>: ' +
               'làm lạnh cho tới khi gặp điểm nút còn lại.'
      }
    },

    ketThuc: {
      nhan: 'Đã tìm ra cả hai điểm nút',
      tieuDe: 'Từ bình nước ra tới đời sống',
      dan: 'Bạn vừa chứng minh hai chiều của quy luật: lượng đổi làm chất đổi, ' +
           'và chất mới lại quy định một lượng mới — nước đá và hơi nước có những giới hạn hoàn toàn khác nhau.',
      phuongPhapLuan: [
        ['Một', 'Muốn có thay đổi về chất thì phải kiên trì tích luỹ về lượng. Nôn nóng, đốt cháy giai đoạn, muốn nhảy khi chưa đủ lượng là <em>tả khuynh</em>.'],
        ['Hai', 'Khi lượng đã tích đủ tại điểm nút thì phải quyết đoán thực hiện bước nhảy. Ngần ngừ, bảo thủ, không dám đổi chất là <em>hữu khuynh</em>.']
      ],
      lienHe: {
        tieuDe: 'Thử tự trả lời',
        than: 'Bạn ôn thi thêm mỗi ngày một chút — đó là <em>lượng</em>. Điểm số nhảy từ trượt sang đạt — đó là <em>chất</em>. ' +
              'Vậy <em>độ</em> của bạn rộng bao nhiêu, và <em>điểm nút</em> của bạn nằm ở đâu?'
      }
    },

    soTay: {
      ten: 'Lượng → Chất',
      tom: 'Những thay đổi dần dần về lượng, khi vượt qua điểm nút, gây ra bước nhảy làm thay đổi chất.'
    }
  },

  /* ---------- Phòng: Mâu thuẫn ---------- */
  'mau-thuan': {
    tang: 'Tháp Xoắn Ốc · Tầng II — Lò Luyện',
    ten: 'Phòng II — Thống nhất và đấu tranh của các mặt đối lập',
    chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

    moDau: {
      tieuDe: 'Quy luật thống nhất và đấu tranh của các mặt đối lập',
      than: 'Giữa phòng là một lõi năng lượng gồm hai cực vừa hút vừa đẩy nhau. ' +
            'Quanh lõi có ba cần gạt. Bạn được thử cả ba, không có cái nào bị phạt. ' +
            'Việc của bạn là tìm ra cần gạt nào làm lõi <em>phát triển</em>.'
    },

    nhan: {
      doCang: 'Độ căng của mâu thuẫn',
      trangThai: 'Trạng thái lõi',
      doChin: 'ĐỘ CHÍN',
      soLanDap: 'Số lần thử dập tắt mâu thuẫn',
      buocNhay: 'Chuyển hoá'
    },

    can: {
      A: { ten: 'TÁCH RỜI',      mo: 'Tắt hẳn một cực' },
      B: { ten: 'HOÀ GIẢI',      mo: 'Kéo hai cực về cân bằng' },
      C: { ten: 'CẤP NĂNG LƯỢNG', mo: 'Để hai cực đấu tranh' }
    },

    trangThai: {
      IDLE:       'ĐANG ĐẤU TRANH',
      SUPPRESSED: 'ĐÃ TẮT — KHÔNG CÒN VẬN ĐỘNG',
      RECONCILED: 'CÂN BẰNG — ĐỨNG YÊN',
      RESOLVED:   'ĐÃ CHUYỂN HOÁ'
    },

    goiYCan: {
      A: 'Giữ để <b>tắt một cực</b>',
      B: 'Giữ để <b>hoà giải hai cực</b>',
      C: 'Giữ để <b>cấp năng lượng</b> · tác động ngược để rút bớt'
    },
    goiYXa: 'Lại gần một trong ba cần gạt',

    nhacNho: 'Dập tắt mâu thuẫn thì lõi ngừng vận động. Thử cần gạt còn lại.',

    baiHoc: {
      nhan: 'Lõi vừa sinh ra một dạng cao hơn',
      tieuDe: 'Mâu thuẫn là nguồn gốc của vận động và phát triển',
      dan: 'Bạn đã thử tắt một cực — lõi chết. Bạn đã thử hoà giải — lõi đứng yên. ' +
           'Chỉ khi để hai mặt đối lập đấu tranh đến độ chín, lõi mới chuyển hoá thành một dạng cao hơn.',
      dinhNghia: [
        ['Mặt đối lập', 'Những mặt có khuynh hướng biến đổi trái ngược nhau, cùng tồn tại trong một sự vật.'],
        ['Thống nhất', 'Hai mặt đối lập nương tựa vào nhau, lấy nhau làm điều kiện tồn tại. Bỏ một mặt thì mặt kia cũng mất.'],
        ['Đấu tranh', 'Sự tác động qua lại theo hướng bài trừ, phủ định lẫn nhau giữa hai mặt đối lập.'],
        ['Chuyển hoá', 'Khi mâu thuẫn được giải quyết, sự vật cũ mất đi và sự vật mới ra đời ở trình độ cao hơn.']
      ],
      trichDan: '“Sự phân đôi của cái thống nhất và sự nhận thức các bộ phận mâu thuẫn của nó… ' +
                'đó là thực chất của phép biện chứng.”',
      nguon: 'V. I. Lênin — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
      phuongPhapLuan: [
        ['Thừa nhận', 'Phải thừa nhận mâu thuẫn là khách quan, vốn có của sự vật, không né tránh cũng không tự tạo ra.'],
        ['Phân tích cụ thể', 'Mỗi loại mâu thuẫn có cách giải quyết riêng; không lấy cách của mâu thuẫn này áp cho mâu thuẫn khác.'],
        ['Không điều hoà', 'Mâu thuẫn được giải quyết bằng đấu tranh, không bằng cách xoá nhoà sự khác biệt giữa hai mặt.']
      ],
      lienHe: {
        tieuDe: 'Thử tự trả lời',
        than: 'Trong nhóm bạn đang có một bất đồng về cách làm. Dập cho im, hay để nó được tranh luận đến nơi đến chốn? ' +
              'Câu trả lời của quy luật này là gì — và bạn phân biệt thế nào giữa <em>đấu tranh</em> và <em>cãi nhau</em>?'
      },
      nhacDap: 'Bạn đã thử dập tắt mâu thuẫn %n lần trước khi tìm ra cách giải quyết nó.'
    },

    soTay: {
      ten: 'Mâu thuẫn',
      tom: 'Sự thống nhất và đấu tranh của các mặt đối lập là nguồn gốc, động lực của mọi vận động và phát triển.'
    }
  },

  /* ---------- Phòng: Phủ định của phủ định ---------- */
  'phu-dinh': {
    tang: 'Tháp Xoắn Ốc · Tầng II — Lò Luyện',
    ten: 'Phòng III — Phủ định của phủ định',
    chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

    moDau: {
      tieuDe: 'Quy luật phủ định của phủ định',
      than: 'Ba luống đất, mỗi luống cao hơn luống trước. Bạn có một hạt giống. ' +
            'Hãy nuôi nó lớn, rồi xem nó để lại gì — và cái để lại ấy có thật sự ' +
            'giống hệt cái ban đầu không.'
    },

    nhan: {
      chuKy: 'Chu kỳ',
      giaiDoan: 'Giai đoạn',
      nuoiDuong: 'Nuôi dưỡng',
      soHat: 'Số hạt thu được',
      buocNhay: 'Phủ định'
    },

    giaiDoan: {
      HAT:  'HẠT GIỐNG',
      MAM:  'MẦM',
      CAY:  'CÂY',
      QUA:  'RA HẠT MỚI',
      XONG: 'ĐÃ HẾT MỘT CHU KỲ'
    },

    phuDinh: [
      'CÂY PHỦ ĐỊNH HẠT',
      'HẠT MỚI PHỦ ĐỊNH CÂY',
      'CHU KỲ KHÉP LẠI — Ở TRÌNH ĐỘ CAO HƠN'
    ],

    goiYGan: 'Giữ <kbd>Chuột trái</kbd> (hoặc <kbd>F</kbd>) để nuôi dưỡng',
    goiYXa:  'Lại gần luống đất đang sáng',
    dangBay: 'Nhìn lại chặng vừa đi',

    baiHoc: {
      nhan: 'Ba chu kỳ, và một hình dạng',
      tieuDe: 'Không phải vòng tròn khép kín, mà là đường xoáy trôn ốc',
      dan: 'Hạt bị cây phủ định. Cây lại bị hạt mới phủ định. Sau hai lần phủ định, ' +
           'bạn quay về đúng cái mình bắt đầu — một hạt giống. Nhưng nó nhiều hơn, ' +
           'khoẻ hơn, và nằm ở một luống cao hơn.',
      dinhNghia: [
        ['Phủ định biện chứng', 'Sự phủ định tạo tiền đề cho sự phát triển tiếp theo, do mâu thuẫn bên trong sự vật gây ra.'],
        ['Tính khách quan', 'Sự phủ định là tự thân, do bản thân sự vật, không phải do ai đó áp đặt từ ngoài vào.'],
        ['Tính kế thừa', 'Cái mới giữ lại những yếu tố tích cực của cái cũ, không xoá sạch trơn.'],
        ['Phủ định của phủ định', 'Kết thúc một chu kỳ phát triển: sự vật dường như quay lại điểm xuất phát, nhưng trên cơ sở cao hơn.'],
        ['Đường xoáy trôn ốc', 'Hình thức của sự phát triển: vừa lặp lại, vừa tiến lên, không bao giờ khép kín.']
      ],
      trichDan: '“Phủ định cái phủ định là gì? Là quy luật vô cùng phổ biến và chính vì vậy ' +
                'mà có một tầm quan trọng và có tác dụng vô cùng to lớn về sự phát triển của ' +
                'tự nhiên, của lịch sử và của tư duy.”',
      nguon: 'Ph. Ăngghen, Chống Đuyrinh — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
      phuongPhapLuan: [
        ['Không nóng vội', 'Phát triển không đi theo đường thẳng mà quanh co, có bước thụt lùi tạm thời. Thấy thụt lùi mà vội kết luận là bế tắc thì sai.'],
        ['Kế thừa có chọn lọc', 'Chống cả hai thái cực: phủ định sạch trơn cái cũ, và giữ nguyên xi cái cũ không đổi.'],
        ['Tin vào cái mới', 'Cái mới nhất định thắng cái cũ, dù lúc đầu còn non yếu.']
      ],
      lienHe: {
        tieuDe: 'Thử tự trả lời',
        than: 'Một thói quen cũ bạn đã bỏ rồi lại quay về. Lần này có thật sự giống hệt lần trước không, ' +
              'hay bạn đã hiểu nó khác đi? Toà tháp bạn đang leo cũng mang đúng hình dạng này — ' +
              'bạn có để ý không?'
      }
    },

    soTay: {
      ten: 'Phủ định của phủ định',
      tom: 'Sau hai lần phủ định, sự vật dường như trở lại điểm xuất phát nhưng ở trình độ cao hơn. ' +
           'Phát triển đi theo đường xoáy trôn ốc, không phải vòng tròn khép kín.'
    }
  },

  /* ---------- Phòng: Biện chứng và Siêu hình ---------- */
  'bien-chung': {
    tang: 'Tháp Xoắn Ốc · Tầng I — Sương Mù',
    ten: 'Phòng — Biện chứng và Siêu hình',
    chuong: 'MLN111 · Chương 1 — Khái luận về triết học',

    moDau: {
      tieuDe: 'Hai phương pháp nhận thức',
      than: 'Giữa phòng có một cái cây trong lồng kính, và một cần gạt hai chiều. ' +
            'Gạt về một bên, bạn nhận thức cái cây theo cách này. Gạt về bên kia, ' +
            'theo cách khác. Câu hỏi của phòng rất đơn giản: <em>cái cây này là gì?</em>'
    },

    nhan: {
      phuongPhap: 'Phương pháp',
      thoiGian: 'THỜI GIAN — GIỮ ĐỂ CHO CHẢY',
      tachRoi: 'TÁCH RỜI — GIỮ ĐỂ MỔ XẺ',
      boPhan: 'Số bộ phận đã tách',
      buocNhay: 'Nhận ra'
    },

    cheDo: {
      SIEU_HINH: 'SIÊU HÌNH',
      BIEN_CHUNG: 'BIỆN CHỨNG'
    },

    canGat: {
      ten: 'CẦN GẠT',
      trai: 'Siêu hình',
      phai: 'Biện chứng'
    },

    boPhan: [
      ['LÁ',    '312 phiến'],
      ['CÀNH',  '47 nhánh'],
      ['THÂN',  'cao 1,2 m'],
      ['RỄ',    'sâu 0,8 m']
    ],

    lienHeNgoai: [
      ['ĐẤT',  'nơi rễ lấy chất'],
      ['NẮNG', 'nguồn của quang hợp'],
      ['MƯA',  'điều kiện của sự sống']
    ],

    goiYCan:    'Giữ <kbd>Chuột phải</kbd> → Siêu hình &nbsp;·&nbsp; Giữ <kbd>Chuột trái</kbd> → Biện chứng',
    goiYCanDP:  'Giữ <kbd>R</kbd> → Siêu hình &nbsp;·&nbsp; Giữ <kbd>F</kbd> → Biện chứng',
    goiYCayS:   'Giữ để <b>mổ xẻ từng bộ phận</b>',
    goiYCayB:   'Giữ để <b>cho thời gian chảy</b>',
    goiYXa:     'Lại gần cần gạt, hoặc lại gần cái cây',

    beTac: 'Đã có đủ số liệu từng bộ phận. Vẫn chưa biết cái cây này là gì.',
    nhacNho: 'Số liệu không trả lời được câu hỏi. Thử gạt cần sang bên kia.',

    baiHoc: {
      nhan: 'Bạn vừa nhìn thấy cái cây',
      tieuDe: 'Cùng một sự vật, hai cách nhận thức, hai kết quả khác nhau',
      dan: 'Ở chế độ siêu hình, bạn tách được cái cây thành từng bộ phận và thu về ' +
           'những con số chính xác — nhưng cái cây chết, và bạn vẫn không biết nó là gì. ' +
           'Ở chế độ biện chứng, thời gian chảy, lồng kính tan đi, và cái cây hiện ra như ' +
           'một <em>quá trình</em> nằm trong những mối liên hệ với đất, nắng và mưa.',
      dinhNghia: [
        ['Phương pháp siêu hình', 'Nhận thức đối tượng ở trạng thái cô lập, tách rời; trong trạng thái tĩnh tại, không vận động, không phát triển.'],
        ['Phương pháp biện chứng', 'Nhận thức đối tượng trong các mối liên hệ phổ biến; trong sự vận động, biến đổi và phát triển của nó.'],
        ['Không phải vô dụng', 'Trong một phạm vi nhất định, phương pháp siêu hình vẫn cần thiết — chính nó cho ta những số liệu chính xác về từng bộ phận. Sai lầm chỉ xuất hiện khi lấy nó làm phương pháp phổ quát.']
      ],
      trichDan: '“Nhà siêu hình học suy nghĩ bằng những phản đề tuyệt đối không có sự môi giới; ' +
                'họ nói có là có, không là không… Đối với họ, một vật hoặc tồn tại, hoặc không tồn tại.”',
      nguon: 'Ph. Ăngghen, Chống Đuyrinh — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
      phuongPhapLuan: [
        ['Liên hệ', 'Xem xét sự vật trong mối liên hệ với những sự vật khác, không tách nó ra khỏi môi trường của nó.'],
        ['Vận động', 'Xem xét sự vật trong quá trình sinh ra, phát triển và mất đi, không chụp lấy một lát cắt đứng yên.'],
        ['Không tuyệt đối hoá', 'Phương pháp siêu hình có chỗ dùng của nó; cái sai là biến nó thành cách nhìn duy nhất.']
      ],
      lienHe: {
        tieuDe: 'Thử tự trả lời',
        than: 'Khi đánh giá một người bạn, bạn chụp lấy một lỗi họ vừa mắc, hay nhìn họ ' +
              'trong cả quá trình và trong hoàn cảnh của họ? Hai cách ấy cho ra hai kết luận khác nhau đến mức nào?'
      },
      nhacTach: 'Bạn đã tách rời cái cây thành %n bộ phận trước khi nhìn nó như một quá trình.'
    },

    soTay: {
      ten: 'Biện chứng và Siêu hình',
      tom: 'Siêu hình nhìn sự vật cô lập và tĩnh tại; biện chứng nhìn sự vật trong liên hệ phổ biến và trong sự vận động, phát triển.'
    }
  },

  /* ---------- Phòng: Cơ sở hạ tầng và Kiến trúc thượng tầng ---------- */
  'ha-tang': {
    tang: 'Tháp Xoắn Ốc · Tầng III — Thành Phố',
    ten: 'Phòng — Cơ sở hạ tầng và Kiến trúc thượng tầng',
    chuong: 'MLN111 · Chương 3 — Chủ nghĩa duy vật lịch sử',

    moDau: {
      tieuDe: 'Bên nào quyết định bên nào?',
      than: 'Trước mặt bạn là một công trình hai phần: một khối móng, và những khối ' +
            'lơ lửng bên trên. Có hai bàn điều khiển — một cho móng, một cho tầng trên. ' +
            'Hãy thử cả hai, rồi tự kết luận xem bên nào quyết định bên nào.'
    },

    nhan: {
      coSo: 'Cơ sở hạ tầng',
      doPhuHop: 'ĐỘ PHÙ HỢP GIỮA HAI TẦNG',
      tacDongNguoc: 'Tác động ngược từ tầng trên (tối đa 18%)',
      buocNhay: 'Xây lại'
    },

    kieu: [
      { ten: 'CÔNG HỮU NGUYÊN THUỶ', mo: 'Chưa có tư hữu, chưa có giai cấp' },
      { ten: 'TƯ HỮU',               mo: 'Có giai cấp, có đối kháng' },
      { ten: 'CÔNG HỮU TRÌNH ĐỘ CAO', mo: 'Tư hữu bị xoá bỏ' }
    ],

    khoi: ['NHÀ NƯỚC', 'PHÁP LUẬT', 'ĐẠO ĐỨC', 'TÔN GIÁO', 'NGHỆ THUẬT'],

    banDieuKhien: {
      mong: 'BÀN ĐIỀU KHIỂN MÓNG',
      tren: 'BÀN ĐIỀU KHIỂN TẦNG TRÊN'
    },

    goiYMong: 'Giữ để <b>thay cơ sở hạ tầng</b>',
    goiYTren: 'Giữ để <b>tác động vào tầng trên</b>',
    goiYXa:   'Lại gần một trong hai bàn điều khiển',

    dangXay: 'Tầng trên đang xây lại theo móng mới',
    chamTran: 'Tầng trên chỉ nhúc nhích được đến đây, rồi tự trở về theo móng',

    baiHoc: {
      nhan: 'Bạn đã thử cả hai chiều',
      tieuDe: 'Móng đổi thì tầng trên xây lại; tầng trên chỉ làm móng nhúc nhích',
      dan: 'Khi bạn thay cơ sở hạ tầng, toàn bộ tầng trên nứt vỡ và dựng lại — có thiết chế ' +
           'biến mất hẳn, có thiết chế mới xuất hiện. Khi bạn tác động vào tầng trên, móng ' +
           'chỉ dịch được một chút rồi tự trở về. Sự bất đối xứng ấy chính là nội dung của quy luật.',
      dinhNghia: [
        ['Cơ sở hạ tầng', 'Toàn bộ những quan hệ sản xuất hợp thành cơ cấu kinh tế của một xã hội nhất định.'],
        ['Kiến trúc thượng tầng', 'Toàn bộ những quan điểm chính trị, pháp quyền, đạo đức, tôn giáo, nghệ thuật, triết học… cùng những thiết chế xã hội tương ứng như nhà nước, đảng phái, giáo hội, đoàn thể.'],
        ['Cơ sở hạ tầng quyết định', 'Cơ sở hạ tầng nào sinh ra kiến trúc thượng tầng ấy. Cơ sở hạ tầng thay đổi thì sớm muộn kiến trúc thượng tầng cũng thay đổi theo.'],
        ['Độc lập tương đối', 'Kiến trúc thượng tầng tác động trở lại cơ sở hạ tầng — thúc đẩy nếu phù hợp, kìm hãm nếu không — nhưng không thể thay thế vai trò quyết định của cơ sở hạ tầng.']
      ],
      trichDan: '“Toàn bộ những quan hệ sản xuất ấy hợp thành cơ cấu kinh tế của xã hội, ' +
                'tức là cái cơ sở hiện thực trên đó dựng lên một kiến trúc thượng tầng pháp lý ' +
                'và chính trị và tương ứng với cơ sở thực tại đó thì có những hình thái ý thức xã hội nhất định.”',
      nguon: 'C. Mác, Góp phần phê phán khoa kinh tế chính trị — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
      phuongPhapLuan: [
        ['Tìm gốc ở kinh tế', 'Muốn hiểu một hiện tượng chính trị, pháp luật hay tư tưởng, phải tìm về những quan hệ kinh tế đã sinh ra nó.'],
        ['Không xem nhẹ tầng trên', 'Tác động trở lại của kiến trúc thượng tầng là có thật và rất mạnh; xem nhẹ nó là rơi vào duy kinh tế tầm thường.'],
        ['Không đảo ngược', 'Nhưng cũng không được lấy tác động trở lại ấy thay cho vai trò quyết định của cơ sở hạ tầng.']
      ],
      lienHe: {
        tieuDe: 'Thử tự trả lời',
        than: 'Một tập quán trong lớp bạn mà ai cũng thấy bất tiện nhưng vẫn tồn tại. ' +
              'Nó đứng vững nhờ điều gì bên dưới? Ra một quy định mới có đủ để xoá nó không, ' +
              'hay phải đổi cái nền đã sinh ra nó?'
      },
      ghiChuNhaNuoc: 'Bạn có để ý không: ở cơ sở hạ tầng công hữu nguyên thuỷ, khối NHÀ NƯỚC ' +
                     'và PHÁP LUẬT hoàn toàn không tồn tại. Nhà nước không có sẵn từ đầu — ' +
                     'nó ra đời cùng với tư hữu và giai cấp.'
    },

    soTay: {
      ten: 'Hạ tầng – Thượng tầng',
      tom: 'Cơ sở hạ tầng quyết định kiến trúc thượng tầng; kiến trúc thượng tầng có tính độc lập tương đối và tác động trở lại, nhưng không thay được vai trò quyết định ấy.'
    }
  }

  /* ═══════════════════════════════════════════════════════════════
     THÊM PHÒNG MỚI: chép nguyên khối của một phòng ở trên xuống đây.
     NHỚ DẤU PHẨY sau dấu } đóng khối phòng liền trước — thiếu nó là
     cả file hỏng và game trắng màn hình.
     ═══════════════════════════════════════════════════════════════ */
};
