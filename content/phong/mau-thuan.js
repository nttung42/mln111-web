/* ═══════════════════════════════════════════════════════════════════
   CHỮ CỦA PHÒNG: Mâu thuẫn   (id: mau-thuan)
   ───────────────────────────────────────────────────────────────────
   Phòng đọc khối này qua ctx.text. Quy tắc chung: xem content/vi.js.
   ═══════════════════════════════════════════════════════════════════ */

TX.VI['mau-thuan'] = {
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
};
