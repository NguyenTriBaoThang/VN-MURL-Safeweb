import React, { useState } from 'react';
import { scanUrl } from '../api/client';
import { ScanResult } from '../types';
import { ResultCard } from '../components/ResultCard';
import { Search, Loader2, Shield, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const ScanPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const sampleUrls = [
    { label: 'Báo Tuổi Trẻ (An toàn)', url: 'https://tuoitre.vn/cong-nghe.htm', type: 'BENIGN' },
    { label: 'Bộ GD&ĐT (An toàn)', url: 'https://moet.gov.vn/tintuc/Pages/tin-tong-hop.aspx', type: 'BENIGN' },
    { label: 'Phishing mẫu (Lừa đảo)', url: 'http://paypal-security-update-account-verification-alert.com/login', type: 'PHISHING' },
    { label: 'Adult mẫu (Nội dung người lớn)', url: 'http://adult-porn-free-xxx-videos.com/watch', type: 'ADULT' },
  ];

  const handleScan = async (e?: React.FormEvent, targetUrl?: string) => {
    if (e) e.preventDefault();
    const scanTarget = targetUrl || url;
    if (!scanTarget.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await scanUrl(scanTarget.trim());
      setResult(res);
      if (targetUrl) setUrl(targetUrl);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Không thể kết nối đến hệ thống kiểm tra URL.';
      setError(msg);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-4 h-4" />
          <span>Lá Chắn Trực Tuyến &amp; Bảo Vệ Trẻ Em (AI Zero-Crawl)</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Kiểm Tra Độ An Toàn Của Đường Link
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          Nhập đường dẫn URL bất kỳ để phát hiện trang web lừa đảo (Phishing) và ngăn chặn nội dung người lớn (Adult) theo thời gian thực.
        </p>
      </div>

      {/* Input scanner card */}
      <div className="glass-card rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {loading && (
          <div className="absolute inset-0 bg-emerald-500/5 backdrop-blur-[1px] flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 text-emerald-400 animate-spin" />
              <div className="text-emerald-300 font-medium text-sm tracking-wide animate-pulse">
                ĐANG PHÂN TÍCH &amp; ĐÁNH GIÁ MỨC ĐỘ NGUY HIỂM...
              </div>
            </div>
          </div>
        )}

        <form onSubmit={(e) => handleScan(e)} className="space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Nhập URL cần kiểm tra:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/login hoặc domain.com..."
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900/90 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 font-mono text-sm transition-all"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !url.trim()}
              className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Đang phân tích...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Phân tích URL</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Sample buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="text-xs text-slate-400 font-medium mb-2.5">
            Hoặc thử nhanh các URL mẫu:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sampleUrls.map((s, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleScan(undefined, s.url)}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/70 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-colors group"
              >
                <div className="min-w-0 pr-2">
                  <div className="text-xs font-semibold text-slate-300 group-hover:text-cyan-400 transition-colors">
                    {s.label}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {s.url}
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-semibold">Lỗi kiểm tra URL:</span> {error}
          </div>
        </div>
      )}

      {/* Scan Result */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
            Kết quả đánh giá an toàn:
          </div>
          <ResultCard result={result} />
        </div>
      )}

      {/* Security Guarantee Note */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-2">
        <div className="font-semibold text-slate-300 flex items-center gap-2">
          <Shield className="w-4 h-4 text-cyan-400" />
          Nguyên tắc Zero-Crawl &amp; Bảo vệ Trẻ em Tuyệt đối:
        </div>
        <p className="leading-relaxed">
          Hệ thống <strong className="text-slate-300">VN-MURL SafeWeb</strong> chỉ trích xuất đúng 48 đặc trưng hình thái (Lexical Features) từ chuỗi URL. Chúng tôi tuyệt đối không gửi request đến máy chủ đích, không tải HTML, ảnh hoặc video của các trang web độc hại hay đồi trụy. Điều này đảm bảo tốc độ phản hồi tính bằng mili-giây, ngăn chặn nguy cơ tấn công SSRF và triệt để bảo vệ không gian mạng cho trẻ em.
        </p>
      </div>
    </div>
  );
};
