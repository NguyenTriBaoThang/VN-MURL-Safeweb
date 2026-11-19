import React, { useState } from 'react';
import { ScanResult } from '../types';
import { LabelBadge, ActionBadge } from './Badge';
import {
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Cpu,
  Gauge,
  Brain,
  Sparkles,
  Layers,
  Activity,
  Lightbulb,
} from 'lucide-react';

interface ResultCardProps {
  result: ScanResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBenign = result.label === 'BENIGN';
  const isPhishing = result.label === 'PHISHING';
  const isAdult = result.label === 'ADULT';

  // Highlight style & icon
  const cardBorderClass = isBenign
    ? 'border-emerald-500/40 glow-benign bg-gradient-to-b from-emerald-950/20 to-slate-900/60'
    : isPhishing
    ? 'border-rose-500/50 glow-phishing bg-gradient-to-b from-rose-950/25 to-slate-900/60'
    : 'border-amber-500/50 glow-adult bg-gradient-to-b from-amber-950/25 to-slate-900/60';

  const titleText = isBenign
    ? 'Cho phép truy cập'
    : isPhishing
    ? 'Đã chặn URL lừa đảo'
    : 'Đã chặn nội dung không phù hợp trẻ em';

  const statusColor = isBenign ? 'text-emerald-400' : isPhishing ? 'text-rose-400' : 'text-amber-400';

  const confidencePercent = Math.round(result.confidence * 100);
  const phishingScore = result.phishing_score ?? result.phishingScore;
  const adultScore = result.adult_score ?? result.adultScore;
  const phishingThreshold = result.phishing_threshold ?? result.phishingThreshold ?? 0.425;
  const adultThreshold = result.adult_threshold ?? result.adultThreshold ?? 0.140;

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-6 md:p-8 backdrop-blur-xl transition-all duration-300 ${cardBorderClass}`}>
      {/* Top Banner Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className={`p-3.5 rounded-2xl ${isBenign ? 'bg-emerald-500/20 text-emerald-400' : isPhishing ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'}`}>
            {isBenign && <ShieldCheck className="w-8 h-8" />}
            {isPhishing && <ShieldAlert className="w-8 h-8" />}
            {isAdult && <AlertTriangle className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`text-2xl md:text-3xl font-extrabold tracking-tight ${statusColor}`}>
                {result.label}
              </span>
              <LabelBadge label={result.label} size="md" />
              <ActionBadge action={result.action} size="md" />
            </div>
            <p className="text-slate-300 font-medium text-base mt-0.5">
              {titleText}
            </p>
          </div>
        </div>

        {/* Confidence Gauge Pill */}
        <div className="flex items-center gap-3 bg-slate-900/80 px-4 py-2.5 rounded-xl border border-white/10">
          <Gauge className="w-5 h-5 text-cyan-400" />
          <div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Độ tin cậy Model</div>
            <div className="text-lg font-bold text-white font-mono">{confidencePercent}%</div>
          </div>
        </div>
      </div>

      {/* URL Display Box */}
      <div className="mt-6 bg-slate-950/70 rounded-xl p-4 border border-white/5 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-1 font-semibold">URL đã phân tích</div>
          <div className="text-slate-200 font-mono text-sm md:text-base truncate select-all">
            {result.url}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Sao chép URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          {isBenign && (
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 transition-colors"
              title="Truy cập an toàn"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>

      {/* XAI (Explainable AI) Breakdown Section */}
      {result.xai ? (
        <div className="mt-6 space-y-5">
          {/* Section Title Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  Giải Thích Quyết Định Trí Tuệ Nhân Tạo (XAI)
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    Zero-Crawl Safe
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Bóc tách nguồn gốc, bằng chứng hình thái và cơ chế phân loại của mô hình
                </p>
              </div>
            </div>
          </div>

          {/* Verdict & Summary Card */}
          <div className={`p-4 rounded-xl border ${
            isBenign
              ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-200'
              : isPhishing
              ? 'bg-rose-950/20 border-rose-500/20 text-rose-200'
              : 'bg-amber-950/20 border-amber-500/20 text-amber-200'
          }`}>
            <div className="flex items-center gap-2 text-sm font-semibold mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>{result.xai.verdict}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {result.xai.summary}
            </p>
          </div>

          {/* Key Decision Factors */}
          {result.xai.factors && result.xai.factors.length > 0 && (
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                Các nhân tố cốt lõi quyết định (Decision Factors)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.xai.factors.map((factor, idx) => {
                  const isCrit = factor.severity === 'CRITICAL';
                  const isHigh = factor.severity === 'HIGH';
                  const isMed = factor.severity === 'MEDIUM';

                  const badgeBg = isCrit
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : isHigh
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : isMed
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';

                  const badgeText = isCrit
                    ? 'CỰC KỲ NGUY HIỂM'
                    : isHigh
                    ? 'RỦI RO CAO'
                    : isMed
                    ? 'CẢNH BÁO'
                    : 'TIN CẬY / AN TOÀN';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700/80 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="font-semibold text-slate-200 text-sm">{factor.title}</span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${badgeBg}`}>
                            {badgeText}
                          </span>
                        </div>
                        {factor.evidence && (
                          <div className="mb-2 inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-950/80 border border-white/5 text-[11px] font-mono text-cyan-300 max-w-full truncate">
                            <span className="text-slate-500 font-sans">Bằng chứng:</span>
                            <span className="truncate">{factor.evidence}</span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          {factor.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Morphological Feature Breakdown */}
          {result.xai.features && result.xai.features.length > 0 && (
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-3 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Bóc tách đặc trưng hình thái URL & So sánh Benchmark
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {result.xai.features.map((feat, idx) => {
                  const isDanger = feat.status === 'DANGER';
                  const isWarning = feat.status === 'WARNING';
                  const statusColor = isDanger
                    ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    : isWarning
                    ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                    : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-[11px] text-slate-400 font-sans truncate mb-1" title={feat.name}>
                          {feat.name}
                        </div>
                        <div className="text-base font-bold font-mono text-white flex items-center gap-1.5">
                          <span>{String(feat.value)}</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-white/5">
                        <div className="text-[10px] text-slate-500 truncate" title={`Chuẩn: ${feat.benchmark}`}>
                          Chuẩn: {feat.benchmark}
                        </div>
                        <div className={`mt-1 text-[10px] px-1.5 py-0.5 rounded border inline-block font-mono ${statusColor}`}>
                          {feat.status}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {result.xai.recommendations && result.xai.recommendations.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-900/70 border border-white/10">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                Khuyến nghị an toàn cho người dùng
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {result.xai.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      isBenign ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* Fallback: Security Assessment / Reason */
        <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
            Đánh giá Bảo mật & An toàn Trẻ em
          </div>
          <p className="text-slate-200 text-sm leading-relaxed">
            {result.reason}
          </p>
        </div>
      )}

      {/* Technical Score Inspection Drawer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition-colors py-1"
        >
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            Chi tiết Dual-Branch Model Scores
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            {/* Phishing Branch */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400 font-sans mb-1 flex justify-between">
                <span>Security Branch (Phishing):</span>
                <span className="font-semibold text-rose-400">
                  {phishingScore !== undefined ? (phishingScore * 100).toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (phishingScore ?? 0) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                <span>Ngưỡng kích hoạt:</span>
                <span>{phishingThreshold}</span>
              </div>
            </div>

            {/* Adult Branch */}
            <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="text-slate-400 font-sans mb-1 flex justify-between">
                <span>Child-Safety Branch (Adult):</span>
                <span className="font-semibold text-amber-400">
                  {adultScore !== undefined ? (adultScore * 100).toFixed(2) + '%' : 'N/A'}
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (adultScore ?? 0) * 100)}%` }}
                />
              </div>
              <div className="mt-1 text-[11px] text-slate-500 flex justify-between">
                <span>Ngưỡng kích hoạt:</span>
                <span>{adultThreshold}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
