import React from 'react';
import { BookOpen, ShieldCheck, AlertTriangle, Eye, Lock, Smartphone, Users } from 'lucide-react';

export const UserGuidePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
          <BookOpen className="w-4 h-4" />
          Cẩm Nang An Toàn Số
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Hướng Dẫn An Toàn Cho Trẻ Em &amp; Gia Đình
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Trang bị kỹ năng nhận diện lừa đảo trực tuyến và bảo vệ thanh thiếu niên khỏi nội dung độc hại trên không gian mạng Việt Nam.
        </p>
      </div>

      {/* Guide Content Sections */}
      <div className="space-y-6">
        {/* Section 1 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">1. Nhận Diện 5 Dấu Hiệu Lừa Đảo Phổ Biến</h3>
              <p className="text-xs text-slate-400">Các chiêu trò tinh vi thường gặp nhắm vào người dùng internet</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-rose-400">• Tên miền sai lệch chính tả (Typosquatting):</div>
              <p className="text-slate-400">
                Kẻ gian thay thế ký tự tương đồng như <code className="text-white">vletcombank.com</code> thay vì <code className="text-emerald-400">vietcombank.com.vn</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-rose-400">• Tên miền phụ (Subdomain lừa dối):</div>
              <p className="text-slate-400">
                Địa chỉ thực tế nằm ở đuôi: <code className="text-white">vietcombank.com.evil-server.top</code> &rarr; Tên miền thực tế là <code className="text-rose-400">evil-server.top</code>!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-rose-400">• Đuôi tên miền lạ giá rẻ:</div>
              <p className="text-slate-400">
                Các đuôi <code className="text-white">.top, .xyz, .space, .biz, .club</code> thường được sử dụng cho các chiến dịch lừa đảo ngắn ngày rồi bỏ.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <div className="font-semibold text-rose-400">• Thúc ép khẩn cấp tâm lý:</div>
              <p className="text-slate-400">
                Tin nhắn dọa khóa tài khoản sau 24h, yêu cầu cập nhật sinh trắc học hoặc thông báo trúng thưởng điện thoại.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">2. Nguyên Tắc Bảo Vệ Trẻ Em (Child Safety)</h3>
              <p className="text-xs text-slate-400">Cơ chế phát hiện sớm nội dung người lớn của VN-MURL SafeWeb</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-3 leading-relaxed text-slate-300">
            <p>
              Hệ thống áp dụng mô hình <strong>Logistic Regression Pipeline</strong> kết hợp phân tích từ vựng nhạy cảm đa ngôn ngữ (Tiếng Việt và Tiếng Anh), giúp ngăn chặn các trang web có nội dung khiêu dâm, cờ bạc và độc hại ngay từ cấp độ phân giải liên kết.
            </p>
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
              <strong>Nguyên tắc Zero-Crawl:</strong> Hệ thống không bao giờ truy cập hay tải mã nguồn của trang web nghi vấn về máy của bạn, đảm bảo tuyệt đối không bị dính mã độc Drive-by Download.
            </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">3. Tích Hợp Extension Trình Duyệt</h3>
              <p className="text-xs text-slate-400">Tự động cảnh báo trước khi mở tab</p>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Bạn có thể cài đặt Extension Chrome / Edge của dự án tại thư mục <code className="text-cyan-400 font-mono">src/browser-extension</code>. 
            Mỗi khi bạn hoặc con em nhấp vào bất kỳ đường dẫn nào, Extension sẽ tự động gửi URL lên API SafeWeb. 
            Nếu phát hiện nguy hiểm, trang cảnh báo đỏ sẽ tự động khóa truy cập lại ngay lập tức.
          </p>
        </div>
      </div>
    </div>
  );
};
