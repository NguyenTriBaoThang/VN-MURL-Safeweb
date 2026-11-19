# VN-MURL SafeWeb Browser Extension (Manifest V3)

Extension giám sát URL thời gian thực bảo vệ người dùng trước các mối đe dọa lừa đảo (**PHISHING**) và nội dung không phù hợp với trẻ em (**ADULT**).

## 1. Tính Năng Chính
- **Tự động quét URL (Auto-Scan):** Khi người dùng truy cập một website mới, content script gửi URL về Service Worker để kiểm tra qua SafeWeb API.
- **Chặn tức thì (Instant Block):**
  - Nếu kết quả là `PHISHING` hoặc `ADULT` (Action = `BLOCK`), điều hướng người dùng ngay lập tức tới trang cảnh báo `block.html`.
  - Tuyệt đối không tải nội dung nhạy cảm của trang web đích (Zero-Crawl).
- **Hỗ trợ Edge / Chrome:** Tuân thủ chuẩn Manifest V3 mới nhất.

## 2. Hướng Dẫn Cài Đặt (Developer Mode)
1. Mở trình duyệt Google Chrome hoặc Microsoft Edge.
2. Truy cập: `chrome://extensions` hoặc `edge://extensions`.
3. Bật công tắc **Chế độ dành cho nhà phát triển (Developer mode)** ở góc trên bên phải.
4. Nhấn **Tải tiện ích đã giải nén (Load unpacked)**.
5. Chọn thư mục `src/browser-extension` trong dự án VN-MURL SafeWeb.

## 3. Cấu Hình API Endpoint
- Mặc định Extension kết nối tới ASP.NET Core API tại `http://localhost:5000`.
- Nếu triển khai Docker, API chạy tại cổng đã cấu hình.

## 4. Kiểm Thử
- **URL An Toàn:** Truy cập `https://tuoitre.vn` hoặc `https://moet.gov.vn` -> Cho phép truy cập bình thường (BENIGN).
- **URL Phishing Mẫu:** Truy cập `http://paypal-security-update-account-verification-alert.com/login` -> Bị chuyển hướng ngay đến trang `block.html` với cảnh báo PHISHING màu đỏ.
- **URL Adult Mẫu:** Truy cập `http://adult-porn-free-xxx-videos.com/watch` -> Bị chuyển hướng ngay đến trang `block.html` với cảnh báo ADULT màu cam.
