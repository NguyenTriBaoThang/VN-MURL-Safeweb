import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { scanUrl, getScans } from '../api/client';
import { ScanResult } from '../types';
import {
  ShieldCheck,
  Search,
  AlertTriangle,
  Lock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  History,
  ShieldAlert,
  BookOpen,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [urlInput, setUrlInput] = useState('');
  const [scanning, setScanning] = useState(false);
  const [quickResult, setQuickResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    const fetchRecent = async () => {
      setLoadingHistory(true);
      try {
        const res = await getScans(1, 5, '', '', true);
        setRecentScans(res.items);
      } catch (err) {
        console.error('Failed to load recent scans', err);
      } finally {
        setLoadingHistory(false);
      }
    };
    fetchRecent();
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setScanning(true);
    setQuickResult(null);
    try {
      const res = await scanUrl(urlInput.trim());
      setQuickResult(res);
      // Prepend to recent
      setRecentScans((prev) => [res, ...prev.slice(0, 4)]);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Không thể kiểm tra URL lúc này.');
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/30 p-6 md:p-8">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4" />
            Lá Chắn An Toàn Trực Tuyến (Zero-Crawl AI)
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Xin chào, <span className="text-emerald-400">{user?.username || 'Bạn'}</span>! Hệ thống đang bảo vệ bạn.
          </h2>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Hệ thống sử dụng trí tuệ nhân tạo (Machine Learning) phân tích hình thái URL theo chuẩn <strong>Zero-Crawl</strong>. 
            Không bao giờ cào nội dung, giữ trọn vẹn quyền riêng tư cho bạn và gia đình.
          </p>
        </div>
      </div>

      {/* Fast URL Scan Widget */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-emerald-400" />
              Kiểm Tra Nhanh Đường Link URL
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Dán bất kỳ đường dẫn nào từ tin nhắn Zalo, Facebook, SMS hoặc Email để xác minh độ tin cậy tức thì.
            </p>
          </div>
        </div>

        <form onSubmit={handleScan} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/login-verify-otp..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-4 pr-10 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
            />
            {urlInput && (
              <button
                type="button"
                onClick={() => setUrlInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={scanning || !urlInput.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex items-center justify-center gap-2 flex-shrink-0"
          >
            {scanning ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Đang phân tích...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Kiểm Tra Độ An Toàn</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Sample Links */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-400 font-mono">
          <span className="text-slate-500">Mẫu thử nhanh:</span>
          <button
            type="button"
            onClick={() => setUrlInput('https://chinhphu.vn')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 transition-colors"
          >
            chinhphu.vn (An toàn)
          </button>
          <button
            type="button"
            onClick={() => setUrlInput('http://secure-login-vietcombank-update-otp.top/bank/verify')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 transition-colors"
          >
            vietcombank-otp.top (Lừa đảo)
          </button>
          <button
            type="button"
            onClick={() => setUrlInput('http://xxx-adult-free-videos-online.biz')}
            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors"
          >
            xxx-adult.biz (Nhạy cảm)
          </button>
        </div>

        {/* Quick Scan Result Display */}
        {quickResult && (
          <div
            className={`mt-4 p-4 rounded-xl border transition-all ${
              quickResult.action === 'BLOCK'
                ? quickResult.label === 'PHISHING'
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                : 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                {quickResult.action === 'BLOCK' ? (
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                )}
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    {quickResult.action === 'BLOCK' ? 'CẢNH BÁO: NGUY HIỂM' : 'LIÊN KẾT AN TOÀN'}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/30 border border-white/10">
                      {quickResult.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-mono break-all mt-0.5">
                    {quickResult.url}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-mono font-bold bg-black/40 px-2.5 py-1 rounded">
                  Độ tin cậy: {(quickResult.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="pt-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-slate-300">
                <strong>Đánh giá:</strong> {quickResult.reason}
              </span>
              <Link
                to="/user/scan"
                className="text-cyan-400 hover:underline flex items-center gap-1 font-semibold flex-shrink-0"
              >
                Xem chi tiết 48 đặc trưng hình thái &rarr;
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Safety Tips & Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Cảnh Giác Lừa Đảo Ngân Hàng</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kẻ gian thường dùng tên miền lạ chứa từ khóa như <em>-otp, -verify, -bank, .top, .space</em> để chiếm đoạt tài khoản. Luôn quét kiểm tra trước khi bấm.
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Bảo Vệ Trẻ Em Trên Mạng</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Mô hình Machine Learning được tối ưu để phát hiện và ngăn chặn nội dung khiêu dâm, bạo lực ngay lập tức với ngưỡng an toàn nghiêm ngặt (0.140).
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Đóng Góp Báo Cáo URL</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nếu gặp liên kết độc hại hoặc trang giả mạo, hãy gửi báo cáo để Ban Quản Trị đưa vào Danh Sách Đen (Blocklist) bảo vệ cộng đồng.
          </p>
          <Link
            to="/user/report"
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:underline font-semibold"
          >
            Gửi báo cáo ngay &rarr;
          </Link>
        </div>
      </div>

      {/* Recent Scans by Current User */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Lịch Sử Kiểm Tra Gần Đây Của Bạn
          </h3>
          <Link
            to="/user/history"
            className="text-xs text-cyan-400 hover:underline font-semibold flex items-center gap-1"
          >
            Xem tất cả &rarr;
          </Link>
        </div>

        {recentScans.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            Bạn chưa có lượt quét nào gần đây. Hãy dán URL vào ô phía trên để bắt đầu!
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {recentScans.map((scan) => (
              <div key={scan.id || scan.url} className="py-3 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      scan.action === 'ALLOW' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <span className="font-mono text-slate-200 truncate">{scan.url}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      scan.label === 'BENIGN'
                        ? 'bg-emerald-500/10 text-emerald-400'
                        : scan.label === 'PHISHING'
                        ? 'bg-rose-500/10 text-rose-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {scan.label}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {(scan.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
