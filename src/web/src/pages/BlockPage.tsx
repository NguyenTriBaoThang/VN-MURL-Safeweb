import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldAlert, AlertTriangle, ArrowLeft, Home, ShieldCheck } from 'lucide-react';

export const BlockPage: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const url = params.get('url') || 'Không rõ URL';
  const label = params.get('label') || 'PHISHING';
  const reasonParam = params.get('reason');

  const isPhishing = label.toUpperCase() === 'PHISHING';
  const isAdult = label.toUpperCase() === 'ADULT';

  const defaultReason = isPhishing
    ? 'Phát hiện URL có dấu hiệu phishing/lừa đảo.'
    : 'Nội dung có thể không phù hợp với trẻ em.';

  const reason = reasonParam || defaultReason;

  const glowClass = isPhishing ? 'glow-phishing border-rose-500/40' : 'glow-adult border-amber-500/40';

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className={`glass-card rounded-3xl max-w-xl w-full p-8 md:p-10 border text-center space-y-6 ${glowClass}`}>
        {/* Warning Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl flex items-center justify-center p-4 shadow-2xl">
          {isPhishing ? (
            <div className="w-full h-full rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-12 h-12" />
            </div>
          ) : (
            <div className="w-full h-full rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <AlertTriangle className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Title & Message */}
        <div className="space-y-2">
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPhishing ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
            {isPhishing ? 'CẢNH BÁO BẢO MẬT PHISHING' : 'CẢNH BÁO AN TOÀN TRẺ EM'}
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Trang web đã bị chặn
          </h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-medium">
            Hệ thống an ninh <strong className="text-white">VN-MURL SafeWeb</strong> đã chủ động ngăn chặn kết nối tới trang web này nhằm bảo vệ bạn và trẻ em.
          </p>
        </div>

        {/* Block details box */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-left space-y-2 text-xs">
          <div>
            <span className="text-slate-500 uppercase tracking-wider font-semibold">URL bị chặn:</span>
            <div className="font-mono text-slate-300 break-all select-all mt-0.5">
              {url}
            </div>
          </div>
          <div className="pt-2 border-t border-slate-900">
            <span className="text-slate-500 uppercase tracking-wider font-semibold">Lý do:</span>
            <div className={`font-semibold mt-0.5 ${isPhishing ? 'text-rose-400' : 'text-amber-400'}`}>
              {reason}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại trang trước
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Home className="w-4 h-4" />
            Về Dashboard VN-MURL
          </button>
        </div>

        <div className="pt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>VN-MURL SafeWeb • Machine Learning for URL Security</span>
        </div>
      </div>
    </div>
  );
};
