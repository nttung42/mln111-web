/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Phủ định của phủ định — "Khu vườn ba thế hệ"
   (id: phu-dinh)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.

   Trong các dòng gợi ý: %b là nút tác động (Chuột trái / F),
   %r là nút tác động ngược (Chuột phải / R). Phòng tự thay theo chế độ
   điều khiển của người chơi.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['phu-dinh'] = {
  tang: 'Tháp Triết Học · Tầng II — Khu vườn',
  ten: 'Phòng III — Phủ định của phủ định',
  chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

  moDau: {
    tieuDe: 'Khu vườn ba thế hệ',
    than: 'Một khu vườn bỏ hoang. Đất khô nứt, ba luống đất nối nhau bằng một lối đá đi lên. ' +
          'Ở luống thấp nhất còn sót một cây non. Nhiệm vụ của bạn: <b>làm cho khu vườn hồi sinh</b>. ' +
          'Nhưng một khu vườn không thể cứ thế trở lại như xưa — nó phải đi qua ba thế hệ. ' +
          'Xem nhiệm vụ ở góc trái trên.'
  },

  /* tấm bia đá ở cửa vườn — mỗi dòng phải vừa một hàng trên bia */
  bia: {
    tieuDe: 'KHU VƯỜN BA THẾ HỆ',
    dong: [
      'Mọi sự sống đều sinh ra,',
      'phát triển, suy tàn',
      'và nhường chỗ cho',
      'một hình thái mới.'
    ]
  },

  /* ---------- ô nhiệm vụ góc trái trên ---------- */
  nhiemVu: {
    tieuDe: 'Ba thế hệ',
    th1: {
      ten: 'Thế hệ thứ nhất',
      mo: 'Nuôi cây non lớn lên và cho quả.',
      chip: ['Nước', 'Ánh nắng', 'Mùn', 'Hái quả']
    },
    th2: {
      ten: 'Thế hệ thứ hai',
      mo: 'Gieo hạt của cây cũ lên luống thứ hai, rồi dựng một hệ sinh thái quanh nó.',
      chip: ['Gieo', 'Nguồn nước', 'Hoa', 'Ong', 'Quả', 'Cây con']
    },
    th3: {
      ten: 'Thế hệ thứ ba',
      mo: 'Gom những gì còn tốt của khu vườn cũ, gieo lên đỉnh vườn.',
      chip: ['Hạt', 'Nước', 'Mùn', 'Gieo']
    },
    trangThai: {
      TAN1: 'Cây đang tàn…',
      HAT1: 'Dưới gốc cây cũ có gì đó đang sáng',
      GIEO2: 'Mang hạt lên luống thứ hai',
      TAN2: 'Khu vườn đang mất cân bằng…',
      GOM: 'Khu vườn này cũng đã đi hết chu kỳ'
    },
    tay: 'Đang cầm',
    vat: {
      nuoc: 'gầu nước',
      mun: 'mùn %n/3',
      hat: 'hạt giống',
      gomHat: 'hạt thế hệ hai',
      gomNuoc: 'giọt nước',
      gomMun: 'mùn'
    }
  },

  /* ---------- gợi ý khi đang nhìn vào một vật ---------- */
  nham: {
    bia: 'Bia đá ở cửa vườn',
    gieng: 'Giếng cổ · %b múc một gầu nước',
    giengXong: 'Giếng cổ',
    guong: 'Tấm gương đồng · giữ %b hoặc %r để xoay, hắt nắng vào cây non',
    guongXong: 'Vệt nắng đã chiếu vào cây',
    mun: '%b nhặt nắm mùn',
    cay1: 'Cây non cần nước, ánh nắng và đất tốt',
    cay1Nuoc: '%b tưới cây',
    cay1Mun: '%b bón mùn vào gốc',
    cay1Qua: '%b hái quả',
    cay1Tan: '%b thử cứu cây',
    goc1: 'Gốc cây thế hệ thứ nhất · %b',
    hat1: '%b nhặt hạt giống',
    dat2: '%b gieo hạt xuống luống thứ hai',
    dat2Chua: 'Luống thứ hai — cần một hạt giống',
    nguon: '%b khơi mạch nước',
    nguonCan: 'Mạch nước đã cạn · %b',
    hoa: '%b trồng một khóm hoa',
    cay2: 'Cây thế hệ thứ hai',
    cay2Tan: 'Cây thế hệ thứ hai · %b tưới để giữ lấy nó',
    gomHat: '%b nhặt hạt giống của cây thế hệ hai',
    gomNuoc: '%b hứng giọt nước cuối cùng',
    gomMun: '%b gom nắm mùn từ lá rụng',
    dat3: '%b gieo xuống đỉnh vườn',
    dat3Chua: 'Đỉnh vườn — cần đủ hạt, nước và mùn',
    cay3: 'Khu vườn thế hệ thứ ba'
  },

  /* ---------- gợi ý theo từng chặng, khi không nhìn vào gì ---------- */
  goiY: {
    TH1: 'Quanh cây non có một cái giếng, một tấm gương và ba nắm mùn',
    QUA1: 'Cây đã ra quả — lại gần hái',
    TAN1: 'Cây đang tàn. Thử cứu nó xem?',
    HAT1: 'Dưới gốc cây cũ có một hạt đang sáng',
    GIEO2: 'Mang hạt theo lối đá, lên luống thứ hai',
    LON2: 'Cây thế hệ thứ hai đang lớn',
    TH2: 'Khơi mạch nước và trồng hoa quanh cây',
    TH2Cho: 'Khu vườn đang tự vận hành — cứ quan sát',
    TAN2: 'Có chuyện gì đó với khu vườn…',
    GOM: 'Cứu khu vườn cũ? Quay về cây đầu tiên? Hay gom những gì còn tốt?',
    GOMDu: 'Đủ rồi — mang lên đỉnh vườn và gieo',
    LON3: '',
    TH3: 'Đi một vòng khu vườn mới',
    BAY: ''
  },

  /* ---------- dòng thông báo ngắn giữa màn hình ---------- */
  thongBao: {
    tuoi: 'Đất đã ẩm.',
    nang: 'Vệt nắng chiếu vào cây non.',
    bon: 'Gốc cây đã có mùn.',
    canMun: 'Cần đủ ba nắm mùn rồi mới bón.',
    canGi: 'Cây non cần nước, ánh nắng và đất tốt.',
    hai: 'Thế hệ thứ nhất đã hoàn thành chu kỳ phát triển.',
    khongCuu: 'Không thể duy trì hình thái cũ.',
    cay2Mang: 'Cây thế hệ thứ hai mang theo: <b>%s</b> — và nhiều nhánh hơn hẳn cây một thân ngày trước.',
    canHoa: 'Cần đủ nước và đủ ba khóm hoa thì ong mới tới.',
    ong: 'Có hoa, có nước — ong kéo đến thụ phấn.',
    qua2: 'Quả chín, rơi xuống, nảy thành cây con. Khu vườn tự vận hành.',
    onDinh: 'Khu vườn đã ổn định.',
    re: 'Cây lớn quá: rễ lan kín cả luống đất.',
    can: 'Nguồn nước không còn đủ cho cả khu vườn.',
    matCanBang: 'Hoa héo, ong bỏ đi, cây con chết dần.',
    giuNguyen: 'Tưới thêm cũng không giữ được. Chính sự lớn mạnh của khu vườn đã tạo ra giới hạn của nó.',
    quayLai: 'Không thể quay lại thế hệ thứ nhất. Cây cũ đã đi hết chu kỳ của nó.',
    du: 'Đủ rồi. Mang lên đỉnh vườn.',
    canDu: 'Cần đủ hạt, nước và mùn từ khu vườn cũ.',
    vuon3: 'Không còn là một cái cây. Là một khu vườn.'
  },

  /* ---------- chữ lớn ở những khoảnh khắc chính ---------- */
  buocNhay: {
    nhan1: 'Phủ định lần 1 · cây cũ tàn',
    t1: 'HẠT MỚI SINH',
    nhan2: 'Hình thái này cũng không phải điểm kết thúc',
    t2: 'GIỚI HẠN NỘI TẠI',
    nhan3: 'Phủ định lần 2',
    t3: 'KHU VƯỜN MỚI'
  },

  /* ---------- thẻ chọn đặc tính cho hạt giống thế hệ một ---------- */
  chonHat: {
    nhan: 'Hạt giống được hình thành từ thế hệ trước',
    tieuDe: 'Hạt này mang theo gì từ cây cũ?',
    dan: 'Cây non đã chết, nhưng những gì nó trải qua còn nằm lại trong hạt. ' +
         'Chọn những đặc tính đáng mang sang thế hệ sau.',
    dacTinh: [
      { id: 're',   ten: 'Rễ cắm sâu',        mo: 'Cây non từng sống sót trên đất khô nứt.',          the: 'cây mới chịu hạn' },
      { id: 'sang', ten: 'Vươn theo ánh nắng', mo: 'Cây non lớn lên nhờ vệt nắng từ tấm gương.',        the: 'cây mới cao, mọc nhanh' },
      { id: 'qua',  ten: 'Sai quả',           mo: 'Cây non đã kịp cho quả trước khi tàn.',            the: 'cây mới nhiều quả' },
      { id: 'gay',  ten: 'Một thân mảnh',     mo: 'Cây non chỉ có một thân nhỏ, gió mạnh là gãy.',    the: 'giới hạn của cây cũ' }
    ],
    trong: 'Chọn ít nhất một đặc tính.',
    sachTron: '<b>Phủ định sạch trơn</b>: hạt chẳng giữ gì của cây cũ, mọi thứ lại bắt đầu từ con số không.',
    nguyenXi: '<b>Kế thừa nguyên xi</b>: giữ cả giới hạn của cây cũ thì cây mới sẽ mảnh và dễ gãy y như vậy.',
    on: '<b>Kế thừa có chọn lọc</b>: giữ cái tích cực, bỏ cái đã thành giới hạn.',
    nut: 'Mang hạt đi'
  },

  /* tên ngắn của đặc tính, dùng trong thông báo và phụ đề */
  dacTinhNgan: { re: 'rễ sâu, chịu hạn', sang: 'thân cao, mọc nhanh', qua: 'sai quả' },

  /* ---------- phụ đề đoạn camera bay lên cuối phòng ---------- */
  phim: [
    { k: 'Nhìn lại', t: 'Phủ định của phủ định',
      p: 'Ba thế hệ, ba luống đất, mỗi luống cao hơn luống trước.' },
    { k: 'Lần 1 · cây non → cây thế hệ hai', t: 'Cái mới phủ định cái cũ',
      p: 'Cây non tàn đi, nhưng để lại hạt — và hạt mang theo <b>%s</b>.' },
    { k: 'Lần 2 · cây thế hệ hai → khu vườn', t: 'Cái mới lại vượt qua chính nó',
      p: 'Chính sự lớn mạnh của cây thứ hai tạo ra giới hạn của nó. Từ hạt, nước và mùn nó để lại, một khu vườn mọc lên.' },
    { k: 'Nhưng', t: 'Không quay về điểm xuất phát',
      p: 'Lại gieo hạt, lại nước và mùn — <b>như lúc đầu</b>. Nhưng lần này mọi thứ đến từ chính khu vườn cũ, và kết quả ở một trình độ cao hơn.' },
    { k: 'Hình dạng của sự phát triển', t: 'Đường xoáy ốc',
      p: 'Vừa lặp lại, vừa tiến lên. Không phải vòng tròn khép kín, cũng không phải đường thẳng — và con đường vẫn còn đi tiếp.' }
  ],

  /* ---------- câu hỏi trước khi rời vườn ---------- */
  cauHoi: {
    nhan: 'Trước khi rời vườn',
    tieuDe: 'Điều gì đã xảy ra với khu vườn?',
    chon: [
      { chu: 'Khu vườn lặp lại chính nó.',
        dung: false,
        giai: 'Có lặp lại — lại hạt, lại cây. Nhưng thế hệ ba không giống thế hệ một: một cây non lẻ loi đã thành cả một hệ sinh thái.' },
      { chu: 'Khu vườn bị phá huỷ rồi trở về trạng thái ban đầu.',
        dung: false,
        giai: 'Không có gì quay về: cây non đầu tiên vẫn chỉ là một gốc khô. Thứ mọc lên ở đỉnh vườn là cái mới.' },
      { chu: 'Mỗi thế hệ phủ định thế hệ trước, đồng thời kế thừa và phát triển những yếu tố tích cực của nó.',
        dung: true,
        giai: 'Đúng. Phủ định, kế thừa, phát triển — ba ý ấy đi cùng nhau.' },
      { chu: 'Thế hệ sau hoàn toàn tách khỏi thế hệ trước.',
        dung: false,
        giai: 'Thế hệ ba mọc lên từ hạt, nước và mùn của thế hệ hai. Không có cái cũ thì không có cái mới.' }
    ],
    nut: 'Xem bài học'
  },

  /* ---------- thẻ chú giải: hiện khi nhìn vào vật ---------- */
  chuGiai: {
    bia: {
      nhan: 'PHỦ ĐỊNH BIỆN CHỨNG',
      tieuDe: 'Sinh ra, phát triển, suy tàn',
      lyThuyet: 'Mọi sự vật đều có quá trình sinh ra, tồn tại, phát triển và mất đi. ' +
                'Cái mới ra đời thay thế cái cũ — đó là <b>phủ định</b>. Phủ định biện chứng là sự phủ định ' +
                'tạo tiền đề cho sự phát triển tiếp theo.'
    },
    goc1: {
      nhan: 'TÍNH KHÁCH QUAN',
      tieuDe: 'Không ai chặt cây này',
      lyThuyet: 'Cây non tàn đi không phải vì có ai phá, mà vì nó đã đi hết chu kỳ của mình. ' +
                'Phủ định biện chứng là <b>tự thân</b>: nguyên nhân nằm ngay trong bản thân sự vật.'
    },
    hat1: {
      nhan: 'TÍNH KẾ THỪA',
      tieuDe: 'Cái mới sinh ra trong lòng cái cũ',
      lyThuyet: 'Hạt không từ đâu rơi xuống: nó do chính cây cũ tạo ra. Cái mới giữ lại những yếu tố ' +
                'tích cực của cái cũ, chứ không xoá sạch trơn.'
    },
    gioiHan: {
      nhan: 'MÂU THUẪN BÊN TRONG',
      tieuDe: 'Lớn mạnh cũng là giới hạn',
      lyThuyet: 'Không có thiên tai, không ai phá. Chính bộ rễ khổng lồ và cơn khát nước của cây thứ hai ' +
                'làm khu vườn mất cân bằng. Hình thái nào cũng mang trong nó giới hạn của mình.'
    },
    vuon3: {
      nhan: 'PHỦ ĐỊNH CỦA PHỦ ĐỊNH',
      tieuDe: 'Như lúc đầu — mà không phải lúc đầu',
      lyThuyet: 'Lại là hạt, nước, mùn như thế hệ thứ nhất. Nhưng tất cả đến từ khu vườn cũ, và cái mọc lên ' +
                'là cả một hệ sinh thái. Sau hai lần phủ định, sự vật dường như quay lại điểm xuất phát, ' +
                'nhưng <b>trên cơ sở cao hơn</b>.'
    }
  },

  baiHoc: {
    nhan: 'Ba thế hệ, và một hình dạng',
    tieuDe: 'Không phải vòng tròn khép kín, mà là đường xoáy ốc',
    dan: 'Cây non bị cây thế hệ hai phủ định. Cây thế hệ hai lại bị chính khu vườn mọc lên từ nó phủ định. ' +
         'Sau hai lần phủ định, bạn lại đứng trước hạt, nước và mùn — như lúc bắt đầu. ' +
         'Nhưng giờ chúng đến từ khu vườn cũ, và thứ mọc lên ở một trình độ cao hơn hẳn.',
    dinhNghia: [
      ['Phủ định biện chứng', 'Sự phủ định tạo tiền đề cho sự phát triển tiếp theo, do mâu thuẫn bên trong sự vật gây ra.'],
      ['Tính khách quan', 'Sự phủ định là tự thân, do bản thân sự vật, không phải do ai đó áp đặt từ ngoài vào.'],
      ['Tính kế thừa', 'Cái mới giữ lại những yếu tố tích cực của cái cũ, không xoá sạch trơn.'],
      ['Phủ định của phủ định', 'Kết thúc một chu kỳ phát triển: sự vật dường như quay lại điểm xuất phát, nhưng trên cơ sở cao hơn.'],
      ['Đường xoáy ốc', 'Hình thức của sự phát triển: vừa lặp lại, vừa tiến lên, không bao giờ khép kín.']
    ],
    trichDan: '“Phủ định cái phủ định là gì? Là quy luật vô cùng phổ biến và chính vì vậy ' +
              'mà có một tầm quan trọng và có tác dụng vô cùng to lớn về sự phát triển của ' +
              'tự nhiên, của lịch sử và của tư duy.”',
    nguon: 'Ph. Ăngghen, Chống Đuyrinh — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    phuongPhapLuan: [
      ['Không nóng vội', 'Phát triển không đi theo đường thẳng mà quanh co, có lúc tàn lụi tạm thời. Thấy cây tàn mà vội kết luận là hết thì sai.'],
      ['Kế thừa có chọn lọc', 'Chống cả hai thái cực: phủ định sạch trơn cái cũ, và giữ nguyên xi cái cũ không đổi.'],
      ['Tin vào cái mới', 'Cái mới nhất định thắng cái cũ, dù lúc đầu nó chỉ là một hạt giống.']
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
         'Cái mới phủ định cái cũ nhưng kế thừa có chọn lọc những yếu tố tích cực của nó. ' +
         'Phát triển đi theo đường xoáy ốc, không phải vòng tròn khép kín.'
  }
};
