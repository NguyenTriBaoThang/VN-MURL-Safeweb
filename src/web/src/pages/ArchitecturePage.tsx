import React from 'react';
import { Network, Shield, ArrowDown, Database, Cpu, Globe, Server, Lock, Layers } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
          <Network className="w-4 h-4" />
          Enterprise &amp; Cybersecurity Architecture
        </div>
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Kiến Trúc Hệ Thống VN-MURL SafeWeb
        </h2>
        <p className="text-slate-400 text-sm md:text-base mt-1">
          Thiết kế đa tầng (Multi-tier) bảo mật cao, tách biệt độc lập giữa tầng phân tích hình thái Machine Learning và dịch vụ quản trị người dùng.
        </p>
      </div>

      {/* End-to-End Data Flow Pipeline */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Luồng Xử Lý URL Phân Tầng Thời Gian Thực
        </h3>

        <div className="space-y-4">
          {/* Step 1: Client Layer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-cyan-500/10 text-cyan-400 flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Tầng 1: Clients &amp; Browser Agents</div>
              <div className="text-sm font-semibold text-white">Người dùng cuối / React Web UI / Chrome Extension (Manifest V3)</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Chặn điều hướng web độc hại ngay tại tab trình duyệt hoặc tiếp nhận URL quét trực tiếp từ giao diện dashboard.
              </p>
            </div>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Step 2: Gateway & Business Layer */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0">
              <Server className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-blue-400 font-bold uppercase tracking-wider">Tầng 2: Secure API Gateway &amp; Policy</div>
              <div className="text-sm font-semibold text-white">ASP.NET Core 8 Web API</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Kiểm tra Private IP / SSRF Loopback, xác thực JWT, kiểm tra Allowlist/Blocklist, giới hạn Rate Limit (120 req/min) và chuyển tiếp tới AI Service.
              </p>
            </div>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Step 3: AI Engine */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 flex-shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">Tầng 3: AI Inference Microservice</div>
              <div className="text-sm font-semibold text-white">Python FastAPI &amp; Composite Model (scikit-learn 1.6.1)</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Trích xuất 48 đặc trưng Lexical (tldextract offline), nạp artifact <code className="text-cyan-300">VN_MURL_SafeWeb_Final_Model.joblib</code> chạy song song 2 nhánh Security (RF) và Child-Safety (LR).
              </p>
            </div>
          </div>

          <div className="flex justify-center text-slate-500">
            <ArrowDown className="w-5 h-5 animate-bounce" />
          </div>

          {/* Step 4: Decision & Persistence */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0">
              <Database className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-purple-400 font-bold uppercase tracking-wider">Tầng 4: Quyết Định &amp; Lưu Trữ Kiểm Toán</div>
              <div className="text-sm font-semibold text-white">Quy tắc Ưu Tiên &amp; SQL Server ScanLog</div>
              <p className="text-xs text-slate-400 mt-0.5">
                Áp dụng quy tắc <code className="text-rose-400">PHISHING &gt; ADULT &gt; BENIGN</code>, ghi nhận toàn diện lịch sử và độ tin cậy vào cơ sở dữ liệu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 48 Lexical Features Taxonomy */}
      <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            Bộ 48 Đặc Trưng Hình Thái URL (Lexical Features)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Không tải HTML, không tải ảnh, không crawl nội dung website. 100% trích xuất từ chuỗi URL.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          {/* Length */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-cyan-400 font-sans font-bold uppercase text-[11px]">1. Nhóm Chiều Dài (Length - 5)</div>
            <div className="text-slate-300 space-y-1">
              <div>• url_length</div>
              <div>• hostname_length</div>
              <div>• path_length</div>
              <div>• query_length</div>
              <div>• fragment_length</div>
            </div>
          </div>

          {/* Character */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-emerald-400 font-sans font-bold uppercase text-[11px]">2. Ký Tự Đặc Biệt (Character - 15)</div>
            <div className="text-slate-300 space-y-1">
              <div>• num_dots, num_hyphens, num_underscores</div>
              <div>• num_slashes, num_question_marks, num_equals</div>
              <div>• num_at, num_ampersand, num_percent</div>
              <div>• num_digits, num_letters, num_special_chars</div>
              <div>• digit_ratio, letter_ratio, special_char_ratio</div>
            </div>
          </div>

          {/* Host */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-blue-400 font-sans font-bold uppercase text-[11px]">3. Cấu Trúc Máy Chủ (Host - 15)</div>
            <div className="text-slate-300 space-y-1">
              <div>• num_subdomains, host_label_count</div>
              <div>• has_ip_address, has_https, scheme_missing</div>
              <div>• has_explicit_port, num_query_params</div>
              <div>• has_punycode, has_www, has_wildcard_host</div>
              <div>• has_double_slash_path, tld_length</div>
              <div>• domain_digit_ratio, domain_hyphen_count, path_depth</div>
            </div>
          </div>

          {/* Statistical */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-amber-400 font-sans font-bold uppercase text-[11px]">4. Thống Kê &amp; Entropy (Statistical - 9)</div>
            <div className="text-slate-300 space-y-1">
              <div>• url_entropy, hostname_entropy, path_entropy</div>
              <div>• num_tokens, max_token_length, avg_token_length</div>
              <div>• longest_digit_run, longest_alpha_run</div>
              <div>• non_ascii_count</div>
            </div>
          </div>

          {/* Heuristic */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="text-rose-400 font-sans font-bold uppercase text-[11px]">5. Dấu Hiệu Nghi Ngờ (Heuristic - 4)</div>
            <div className="text-slate-300 space-y-1">
              <div>• suspicious_keyword_count</div>
              <div>• has_suspicious_keyword</div>
              <div>• is_url_shortener</div>
              <div>• is_suspicious_tld</div>
            </div>
          </div>

          {/* Zero-Crawl Security Benefits */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
            <div className="text-emerald-400 font-sans font-bold uppercase text-[11px]">Ưu Điểm Vượt Trội</div>
            <p className="text-slate-300 font-sans leading-tight text-[11px]">
              Tốc độ &lt; 50ms, triệt tiêu hoàn toàn nguy cơ SSRF, bảo vệ trẻ em không bao giờ tiếp xúc với nội dung nhạy cảm, vận hành ngoại tuyến không lệ thuộc băng thông máy chủ đích.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
