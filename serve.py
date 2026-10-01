"""
Máy chủ cục bộ để chạy thử game.

    python serve.py

Khác với `python -m http.server` ở đúng một điểm, nhưng là điểm quan trọng:
nó BÁO TRÌNH DUYỆT KHÔNG ĐƯỢC CACHE. Với http.server thường, sửa một file
trong engine/ hay rooms/ rồi tải lại trang thì trình duyệt vẫn có thể dùng
bản cũ trong cache — gây ra những lỗi kiểu "hàm này không tồn tại" trong khi
file trên đĩa rõ ràng có hàm đó, và phải Ctrl+Shift+R mới hết.

Dùng file này thì sửa xong chỉ cần F5.
"""

import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class KhongCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # chỉ báo lỗi, không in mọi request cho đỡ rối
        if args and str(args[1]).startswith(("4", "5")):
            sys.stderr.write("%s %s\n" % (args[1], args[0]))


if __name__ == "__main__":
    # Console Windows mặc định là cp1252, in tiếng Việt sẽ văng lỗi.
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    print("Thap Xoan Oc -- http://localhost:%d/index.html" % PORT)
    print("Ctrl+C de dung.")
    try:
        ThreadingHTTPServer(("127.0.0.1", PORT), KhongCache).serve_forever()
    except KeyboardInterrupt:
        print("\nĐã dừng.")
