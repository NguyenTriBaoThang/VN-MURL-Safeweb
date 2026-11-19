import React, { useState } from 'react';
import { submitUserReportApi } from '../api/client';
import { ShieldAlert, Send, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

export const UserReportPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [threatType, setThreatType] = useState<'PHISHING' | 'ADULT' | 'MALWARE'>('PHISHING');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await submitUserReportApi(url.trim(), threatType, reason.trim() || 'Người dùng báo cáo liên kết nghi vấn');
      setSuccess(res.message || 'Cảm ơn bạn! Báo cáo đã được chuyển tới Ban Quản Trị để thẩm định.');
      setUrl('');
      setReason('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Không thể gửi báo cáo lúc này. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
          <ShieldAlert className="w-4 h-4" />
          Báo Cáo An Toàn Cộng Đồng
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Báo Cáo Liên Kết Nguy Hiểm &amp; Độc Hại
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Nếu bạn phát hiện liên kết lừa đảo mạo danh ngân hàng, tin nhắn giả mạo hoặc trang web nội dung người lớn nguy hại, hãy gửi thông tin để quản trị viên kiểm tra và cập nhật Blocklist.
        </p>
      </div>

      {/* Form Card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Địa Chỉ Đường Link (URL) Cần Báo Cáo *
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://vietcombank-xac-thuc-otp.top/login..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 font-mono"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Loại Nguy Cơ Nhận Diện
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setThreatType('PHISHING')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  threatType === 'PHISHING'
                    ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">PHISHING (Lừa đảo)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Giả mạo ngân hàng, nạp thẻ, trúng thưởng</div>
              </button>

              <button
                type="button"
                onClick={() => setThreatType('ADULT')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  threatType === 'ADULT'
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">ADULT (Người lớn)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Nội dung khiêu dâm, độc hại với trẻ nhỏ</div>
              </button>

              <button
                type="button"
                onClick={() => setThreatType('MALWARE')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  threatType === 'MALWARE'
                    ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">MALWARE (Mã độc)</div>
                <div className="text-[11px] text-slate-400 mt-0.5">Tự động tải file virus, phần mềm gián điệp</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Mô Tả Chi Tiết / Bối Cảnh Nhận Được Link
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ví dụ: Nhận được tin nhắn SMS giả mạo ngân hàng yêu cầu bấm vào link để hủy gói vay..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
            />
          </div>

          {success && (
            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="w-full py-3 bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-rose-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              'Đang gửi báo cáo...'
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Gửi Báo Cáo Cho Ban Quản Trị</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
        <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-300">Quy trình thẩm định an toàn:</div>
          <p>
            Mọi báo cáo từ người dùng đều được lưu vào cơ sở dữ liệu và chuyển đến giao diện Quản Trị Viên (Admin Portal). 
            Quản trị viên sẽ kiểm tra đặc trưng và có thể đưa tên miền vào Danh Sách Đen (Blocklist) trên toàn hệ thống trong vòng vài phút.
          </p>
        </div>
      </div>
    </div>
  );
};
