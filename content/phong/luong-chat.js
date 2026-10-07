/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Lượng → Chất · Đột phá cảnh giới   (id: luong-chat)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['luong-chat'] = {
  tang: 'Tháp Triết Học · Tầng II — Động Phủ',
  ten: 'Phòng I — Đột phá cảnh giới',
  chuong: 'MLN111 · Chương 2 — Chủ nghĩa duy vật biện chứng',

  moDau: {
    tieuDe: 'Quy luật chuyển hoá từ những thay đổi về lượng thành những thay đổi về chất',
    than: 'Bạn là một tu sĩ Luyện Khí kỳ. Giữa trận pháp cổ trong động phủ có một chiếc bồ đoàn. ' +
          'Đừng đọc gì cả — hãy bước tới, <em>nhảy lên ngồi</em>, rồi <em>vận công</em> để tích luỹ tu vi. ' +
          'Khi tu vi chạm ngưỡng, bạn sẽ phải tự chọn đúng lúc để <em>đột phá</em>.'
  },

  nhan: {
    tuVi: 'Tu vi',
    canhGioi: 'Cảnh giới',
    do: 'ĐỘ — LƯỢNG ĐỔI, CHẤT CHƯA ĐỔI',
    diemNut: 'ĐIỂM NÚT',
    nutCu: 'ĐIỂM NÚT CŨ',
    buocNhay: 'Bước nhảy',
    vienMan: 'Đột phá viên mãn',
    dotPha: 'ĐỘT PHÁ CẢNH GIỚI',
    nhanDung: 'Nắm lấy thời cơ — chạm đúng điểm nút',
    chuaDu: 'chưa đủ lượng',
    loThoiCo: 'lỡ thời cơ',
    taKhuynh: 'Tẩu hoả nhập ma',
    huuKhuynh: 'Linh lực tán loạn',
    taKhuynhPhu: 'Nóng vội — lượng chưa đủ',
    huuKhuynhPhu: 'Do dự — thời cơ đã qua'
  },

  canhGioi: {
    LUYEN_KHI: 'LUYỆN KHÍ',
    TRUC_CO: 'TRÚC CƠ'
  },

  /* dòng nhỏ dưới thanh tu vi, đổi theo lượng đã tích */
  dauHieu: [
    [0,  'Linh khí trong động phủ còn mỏng.'],
    [12, 'Linh khí bắt đầu xoay quanh người.'],
    [35, 'Hoa văn trên cột đá lần lượt sáng lên.'],
    [60, 'Kinh mạch rung động — nhưng vẫn là Luyện Khí.'],
    [80, 'Linh lực sắp chạm giới hạn của cảnh giới này.']
  ],
  dauHieuTrucCo: [
    [0,   'Cảnh giới mới — giới hạn mới, tốc độ hấp thụ mới.'],
    [100, 'Mức 100 từng là điểm nút, giờ chỉ là một điểm bình thường trong độ mới.']
  ],

  goiY: {
    ngoi: {
      khoa: 'Bấm <kbd>Chuột trái</kbd> để nhảy lên bồ đoàn',
      duPhong: 'Bấm <kbd>F</kbd> để nhảy lên bồ đoàn'
    },
    vanCong: {
      khoa: 'Giữ <kbd>Chuột trái</kbd> để vận công &nbsp;·&nbsp; <kbd>Chuột</kbd> xoay góc quay &nbsp;·&nbsp; <kbd>Chuột phải</kbd> đứng dậy',
      duPhong: 'Giữ <kbd>F</kbd> để vận công &nbsp;·&nbsp; <kbd>Kéo chuột</kbd> xoay góc quay &nbsp;·&nbsp; <kbd>R</kbd> đứng dậy'
    },
    dotPha: {
      khoa: 'Bấm <kbd>Chuột trái</kbd> hoặc <kbd>Enter</kbd> khi con trỏ chạm điểm nút',
      duPhong: 'Bấm <kbd>F</kbd> hoặc <kbd>Enter</kbd> khi con trỏ chạm điểm nút'
    }
  },

  /* phụ đề kiểu phim, hiện lúc vừa ngồi xuống bồ đoàn */
  phuDe: {
    nhan: 'Bước 2 · Vận công',
    tieuDe: 'Khí bắt đầu xoay quanh người',
    than: 'Giữ <b>chuột trái</b> để vận công. Tu vi càng cao, khí xoay càng nhanh, càng dày — ' +
          'nhưng bạn vẫn là Luyện Khí.'
  },

  /* thẻ ngắn hiện ở lần trượt đầu tiên của mỗi kiểu */
  taKhuynh: {
    nhan: 'Đột phá thất bại · nhảy quá sớm',
    tieuDe: 'Lượng chưa đủ thì chất không đổi',
    than: 'Bạn ép bước nhảy khi tu vi còn chưa tới điểm nút. Linh lực phản phệ, tu vi tụt lại. ' +
          'Trong triết học, nôn nóng, đốt cháy giai đoạn, muốn nhảy khi chưa tích đủ lượng gọi là ' +
          '<em>tả khuynh</em>.'
  },
  huuKhuynh: {
    nhan: 'Đột phá thất bại · bỏ lỡ thời cơ',
    tieuDe: 'Đủ lượng mà không nhảy, lượng cũng tiêu tan',
    than: 'Tu vi đã chạm điểm nút nhưng bạn chần chừ. Linh lực dồn ứ rồi tán đi, phải tích luỹ lại. ' +
          'Ngần ngừ, bảo thủ, không dám thực hiện bước nhảy khi điều kiện đã chín muồi gọi là ' +
          '<em>hữu khuynh</em>.'
  },

  baiHoc: {
    nhan: 'Bạn vừa thực hiện một BƯỚC NHẢY',
    tieuDe: 'Lượng đổi dần dần, chất đổi đột ngột',
    dan: 'Suốt một quãng dài, tu vi tăng mà bạn vẫn cứ là Luyện Khí — chỉ mạnh hơn. ' +
         'Tới điểm nút, một bước nhảy làm đổi hẳn cảnh giới, và cả động phủ đổi theo.',
    dinhNghia: [
      ['Chất', 'Tính quy định vốn có, làm cho sự vật là <em>nó</em> chứ không phải cái khác. Ở đây: cảnh giới — Luyện Khí, Trúc Cơ.'],
      ['Lượng', 'Tính quy định về quy mô, trình độ, tốc độ… mà sự thay đổi của nó <em>chưa</em> làm sự vật thành cái khác. Ở đây: tu vi.'],
      ['Độ', 'Khoảng giới hạn trong đó lượng đã biến đổi nhưng chất vẫn chưa đổi — cả quãng 0 → 100 tu vi của Luyện Khí.'],
      ['Điểm nút', 'Thời điểm mà sự thay đổi về lượng đã đủ để làm chất thay đổi: mốc 100.'],
      ['Bước nhảy', 'Sự chuyển hoá về chất do những thay đổi về lượng trước đó gây ra. Nó <em>đứt đoạn</em>, không từ từ.']
    ],
    ghiChu: 'Trong tự nhiên, lượng đủ thì bước nhảy tất yếu xảy ra — nước tới 100&nbsp;°C thì sôi. ' +
            'Trong hoạt động của con người, bước nhảy còn cần chủ thể <em>nắm đúng thời cơ</em> — ' +
            'vì vậy bạn phải tự canh điểm nút.',
    trichDan: '“Những thay đổi đơn thuần về lượng, đến một mức độ nhất định, sẽ chuyển hoá thành những sự khác nhau về chất.”',
    nguon: 'Ph. Ăngghen — dẫn theo Giáo trình Triết học Mác – Lênin, NXB Chính trị quốc gia Sự thật, 2021',
    tiepTheo: {
      tieuDe: 'Chưa xong',
      than: 'Quy luật này còn chiều ngược lại. Hãy vận công thêm ở Trúc Cơ và để ý thanh tu vi: ' +
             'giới hạn và tốc độ tích luỹ giờ ra sao?'
    }
  },

  ketThuc: {
    nhan: 'Chất mới quy định lượng mới',
    tieuDe: 'Từ động phủ ra tới đời sống',
    dan: 'Ở Luyện Khí, 100 là điểm nút. Ở Trúc Cơ, giới hạn là 1000 và linh khí vào nhanh gấp năm lần — ' +
         'mốc 100 cũ chỉ còn là một điểm bình thường. Chất mới ra đời lại quy định một lượng mới: ' +
         'đó là chiều ngược lại của quy luật.',
    phuongPhapLuan: [
      ['Một', 'Muốn có thay đổi về chất thì phải kiên trì tích luỹ về lượng. Nôn nóng, đốt cháy giai đoạn, muốn nhảy khi chưa đủ lượng là <em>tả khuynh</em>.'],
      ['Hai', 'Khi lượng đã tích đủ tại điểm nút thì phải quyết đoán thực hiện bước nhảy. Ngần ngừ, bảo thủ, không dám đổi chất là <em>hữu khuynh</em>.']
    ],
    /* {ta} và {huu}: số lần người chơi trượt mỗi kiểu */
    banThan: 'Trong phòng này bạn đã nhảy sớm <b>{ta}</b> lần và để lỡ thời cơ <b>{huu}</b> lần.',
    lienHe: {
      tieuDe: 'Thử tự trả lời',
      than: 'Bạn ôn thi thêm mỗi ngày một chút — đó là <em>lượng</em>. Điểm số nhảy từ trượt sang đạt — đó là <em>chất</em>. ' +
            'Vậy <em>độ</em> của bạn rộng bao nhiêu, và <em>điểm nút</em> của bạn nằm ở đâu?'
    }
  },

  /* chú giải khi nhìn vào đạo cụ */
  chuGiai: {
    linhCau: {
      nhan: 'LƯỢNG',
      tieuDe: 'Quả cầu khí trong tay',
      lyThuyet: 'Quả cầu sáng dần theo tu vi, nhưng vẫn là quả cầu ấy. Đó là <b>lượng</b>: ' +
                'thay đổi về mức độ mà chưa làm sự vật thành cái khác.'
    },
    boDoan: {
      nhan: 'BƯỚC 1',
      tieuDe: 'Bồ đoàn',
      lyThuyet: 'Chỗ ngồi thiền giữa trận pháp. Nhảy lên ngồi thì mới bắt đầu tích luỹ được — ' +
                '<b>lượng</b> không tự tăng nếu không có quá trình vận động.'
    },
    tuSi: {
      nhan: 'LƯỢNG',
      tieuDe: 'Khí xoay quanh tu sĩ',
      lyThuyet: 'Khí xoay nhanh dần, dày dần theo tu vi — nhưng người ngồi đó vẫn là tu sĩ Luyện Khí. ' +
                'Lượng đổi mà chất chưa đổi: vẫn đang ở trong <b>độ</b>.'
    },
    cot: {
      nhan: 'LƯỢNG · THẤY ĐƯỢC BẰNG MẮT',
      tieuDe: 'Tám cột đá khắc hoa văn',
      lyThuyet: 'Mỗi cột sáng lên khi tu vi tăng thêm một nấc. Tám cột sáng hết, ' +
                'động phủ vẫn là động phủ — lượng đổi mà chất chưa đổi, vẫn trong <b>độ</b>.'
    },
    tranPhap: {
      nhan: 'ĐIỂM NÚT',
      tieuDe: 'Trận pháp dưới chân',
      lyThuyet: 'Trận pháp quay nhanh dần theo tu vi. Khi tu vi chạm <b>điểm nút</b>, ' +
                'nó chờ một hành động dứt khoát: bước nhảy.'
    },
    tienTinh: {
      nhan: 'CHẤT MỚI',
      tieuDe: 'Tiên tinh',
      lyThuyet: 'Quả cầu khí không “to hơn” mà vỡ ra và trở thành một thứ khác. ' +
                '<b>Chất</b> mới không phải là lượng cũ cộng thêm.'
    },
    cay: {
      nhan: 'CHẤT MỚI',
      tieuDe: 'Cây tiên',
      lyThuyet: 'Không có cây nào trong động phủ cũ. Bước nhảy làm xuất hiện những thuộc tính ' +
                'mà chất cũ không có.'
    }
  },

  soTay: {
    ten: 'Lượng → Chất',
    tom: 'Những thay đổi dần dần về lượng, khi tới điểm nút, gây ra bước nhảy làm thay đổi chất; chất mới lại quy định lượng mới.'
  }
};
