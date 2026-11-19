import React from 'react';
import { ShieldCheck, HeartHandshake, Lock, Sparkles, BookOpen, ExternalLink, Code2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Sứ Mạng Bảo Vệ Không Gian Số</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Về Dự Án VN-MURL SafeWeb
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Machine Learning for URL Security &amp; Child-Safe Web Access. Giải pháp an toàn mạng ứng dụng học máy tiên tiến bảo vệ trẻ em và người dùng Việt Nam.
        </p>
      </div>

      {/* Mission & Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-cyan-500/10 text-cyan-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Bảo Vệ Trẻ Em Trên Không Gian Số</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Trẻ em và học sinh ngày càng tiếp xúc sớm với Internet. VN-MURL SafeWeb được thiết kế với cơ chế chặn tự động các liên kết chứa nội dung người lớn (Adult Content) mà không cần phải truy cập hay tải nội dung nhạy cảm đó về máy tính, đảm bảo trải nghiệm học tập và giải trí an toàn.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="p-3 w-fit rounded-xl bg-rose-500/10 text-rose-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Phòng Chống Lừa Đảo Trực Tuyến</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Các hình thức Phishing ngày càng tinh vi với tên miền giả mạo ngân hàng, cơ quan nhà nước và mạng xã hội. Nhánh Security Model phát hiện các chiêu thức lừa đảo dựa trên 48 đặc trưng hình thái URL như entropy, subdomains, punycode và từ khóa nghi vấn.
          </p>
        </div>
      </div>

      {/* Zero-Crawl Commitment */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-emerald-500/30 glow-benign space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Cam Kết Đạo Đức An Toàn &amp; Bảo Mật</h3>
            <div className="text-xs text-emerald-400 font-semibold font-mono">Zero-Crawl Ethical Policy</div>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Chúng tôi tuân thủ nghiêm ngặt nguyên tắc đạo đức trong nghiên cứu an toàn thông tin:
        </p>

        <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
          <li><strong>Không Crawl hoặc Download:</strong> Tuyệt đối không gửi HTTP requests tới trang web độc hại khi suy luận phân loại.</li>
          <li><strong>Bảo vệ quyền riêng tư người dùng:</strong> Không lưu trữ cookie, thông tin đăng nhập hoặc dữ liệu nhạy cảm của người dùng.</li>
          <li><strong>Không thiên vị / Không bịa đặt số liệu:</strong> Toàn bộ độ tin cậy và báo cáo thực nghiệm đều phản ánh chính xác từ Colab training.</li>
        </ul>
      </div>

      {/* Tech Specifications */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Code2 className="w-5 h-5 text-cyan-400" />
          Thông Số Kỹ Thuật Công Nghệ
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500">Frontend</div>
            <div className="text-white font-bold mt-1">React 18 + Vite</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500">Backend API</div>
            <div className="text-white font-bold mt-1">ASP.NET Core 8</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500">AI Service</div>
            <div className="text-white font-bold mt-1">FastAPI Python 3.13</div>
          </div>
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
            <div className="text-slate-500">Extension</div>
            <div className="text-white font-bold mt-1">Manifest V3</div>
          </div>
        </div>
      </div>
    </div>
  );
};
