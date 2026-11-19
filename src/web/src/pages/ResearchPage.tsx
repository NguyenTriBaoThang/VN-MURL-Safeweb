import React, { useEffect, useState } from 'react';
import { getResearchSummary, getResearchModels, getModelInfo } from '../api/client';
import { ResearchSummary, ResearchModelMetric, ModelInfo } from '../types';
import {
  FlaskConical,
  Award,
  Layers,
  BarChart3,
  GitBranch,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Cpu,
  FileSpreadsheet,
  Maximize2,
  Database,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'comparison' | 'curves' | 'features' | 'stats' | 'ablation'>('overview');
  const [summary, setSummary] = useState<ResearchSummary | null>(null);
  const [models, setModels] = useState<ResearchModelMetric[]>([]);
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const loadResearch = async () => {
      setLoading(true);
      try {
        const [sum, mdl, info] = await Promise.all([
          getResearchSummary(),
          getResearchModels(),
          getModelInfo(),
        ]);
        setSummary(sum);
        setModels(mdl);
        setModelInfo(info);
      } catch (err) {
        console.error('Failed to load research outputs', err);
      } finally {
        setLoading(false);
      }
    };
    loadResearch();
  }, []);

  const tabs = [
    { id: 'overview', label: '1. Tổng Quan & Final Model', icon: Award },
    { id: 'comparison', label: '2. So Sánh Mô Hình', icon: BarChart3 },
    { id: 'curves', label: '3. Ma Trận & ROC / PR', icon: TrendingUp },
    { id: 'features', label: '4. Tầm Quan Trọng Đặc Trưng', icon: Layers },
    { id: 'stats', label: '5. Bootstrap & McNemar', icon: GitBranch },
    { id: 'ablation', label: '6. Ablation & Ngưỡng Quyết Định', icon: Sliders },
  ];

  const getFigureUrl = (filename: string) => `/api/research/figures/${filename}`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            Empirical Machine Learning Research Dashboard
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Nghiên Cứu &amp; Đánh Giá Thực Nghiệm Mô Hình
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Hiển thị trực tiếp kết quả huấn luyện thực nghiệm từ Colab Notebook, bao gồm so sánh mô hình, kiểm định giả thuyết và phân tích ngưỡng tối ưu.
          </p>
        </div>

        {/* Status Pill */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
          <Database className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-400">Dữ liệu thực:</span>
          <span className="text-emerald-400 font-bold">19 CSVs + 40 Figures</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-800">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Final Model Info */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Final Model Card */}
          <div className="glass-card rounded-2xl p-6 md:p-8 border border-cyan-500/30 glow-benign relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Mô Hình Cuối Cùng (Production Deployment)
                </div>
                <h3 className="text-2xl font-extrabold text-white font-mono">
                  VN_MURL_SafeWeb_Final_Model.joblib
                </h3>
                <p className="text-slate-300 text-xs mt-1">
                  Mô hình Composite Dual-Branch duy nhất phục vụ phân loại thời gian thực cho Web &amp; Extension
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  BENIGN → ALLOW
                </span>
                <span className="px-3 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                  PHISHING → BLOCK
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  ADULT → BLOCK
                </span>
              </div>
            </div>

            {/* Architecture Details Grid */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Branch 1 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-rose-400">
                    1. Security Branch (Phishing)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 font-mono">
                    RF (Best)
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Random Forest Classifier (n_estimators=100)
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Ngưỡng quyết định tối ưu:</span>
                    <span className="font-mono text-cyan-400 font-bold">threshold = 0.425</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mục tiêu tối ưu:</span>
                    <span className="text-slate-300">Cân bằng F1-Score &amp; Recall</span>
                  </div>
                </div>
              </div>

              {/* Branch 2 */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider font-bold text-amber-400">
                    2. Child-Safety Branch (Adult)
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    LR Pipeline (Best)
                  </span>
                </div>
                <div className="text-sm font-semibold text-white">
                  Logistic Regression + StandardScaler
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Ngưỡng quyết định tối ưu:</span>
                    <span className="font-mono text-cyan-400 font-bold">threshold = 0.140</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mục tiêu tối ưu:</span>
                    <span className="text-slate-300">Tối đa hóa độ nhạy phát hiện Adult</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decision Rule Formula */}
            <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-white/5 font-mono text-xs text-slate-300 space-y-2">
              <div className="text-slate-400 font-sans uppercase font-semibold text-[11px]">
                Công thức ưu tiên nhãn (Label Priority Rule):
              </div>
              <div className="p-2.5 rounded bg-slate-900 text-cyan-300">
                IF (Security_Score &gt;= 0.425) → <strong className="text-rose-400">PHISHING (BLOCK)</strong><br />
                ELSE IF (Adult_Score &gt;= 0.140) → <strong className="text-amber-400">ADULT (BLOCK)</strong><br />
                ELSE → <strong className="text-emerald-400">BENIGN (ALLOW)</strong>
              </div>
              <div className="text-[11px] text-slate-400">
                Nguyên tắc: <strong className="text-white">PHISHING &gt; ADULT &gt; BENIGN</strong>. Nếu một liên kết vừa là phishing vừa có yếu tố adult, nhãn PHISHING sẽ được ưu tiên cảnh báo bảo mật cấp cao nhất.
              </div>
            </div>
          </div>

          {/* Dataset Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="text-xs text-slate-400 uppercase font-semibold">Tổng mẫu Dataset</div>
              <div className="text-2xl font-bold text-white font-mono mt-1">112,875 URLs</div>
              <div className="text-[11px] text-slate-500 mt-1">Thu thập &amp; chuẩn hóa đa nguồn</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="text-xs text-emerald-400 uppercase font-semibold">Tập mẫu Benign</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">45,150 URLs</div>
              <div className="text-[11px] text-slate-500 mt-1">Trang tin tức, giáo dục, chính phủ</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="text-xs text-rose-400 uppercase font-semibold">Tập mẫu Phishing</div>
              <div className="text-2xl font-bold text-rose-400 font-mono mt-1">37,825 URLs</div>
              <div className="text-[11px] text-slate-500 mt-1">PhishTank, OpenPhish feeds</div>
            </div>
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="text-xs text-amber-400 uppercase font-semibold">Tập mẫu Adult</div>
              <div className="text-2xl font-bold text-amber-400 font-mono mt-1">29,900 URLs</div>
              <div className="text-[11px] text-slate-500 mt-1">Bộ lọc bảo vệ trẻ em</div>
            </div>
          </div>

          {/* Multitask Comparison Image Preview */}
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Biểu Đồ So Sánh Hiệu Năng Toàn Diện (Multi-task System Comparison)
            </h4>
            <div
              className="mt-3 relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 cursor-pointer group"
              onClick={() => setSelectedImage('FINAL_multitask_comparison.png')}
            >
              <img
                src={getFigureUrl('FINAL_multitask_comparison.png')}
                alt="FINAL multitask comparison"
                className="w-full max-h-96 object-contain group-hover:scale-[1.01] transition-transform duration-300"
                onError={(e: any) => { e.target.src = 'https://via.placeholder.com/800x400?text=Chưa+có+dữ+liệu+thực+nghiệm'; }}
              />
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-xs text-slate-200 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
                Phóng to biểu đồ
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Model Comparison */}
      {activeTab === 'comparison' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                  Bảng So Sánh Chỉ Số Mô Hình Huấn Luyện Thực Nghiệm
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Được đọc trực tiếp từ các file kết quả thực nghiệm (.csv)
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-3">Nhánh Nhiệm Vụ</th>
                    <th className="py-3 px-3">Thuật Toán Model</th>
                    <th className="py-3 px-3">Tập Kiểm Thử</th>
                    <th className="py-3 px-3 text-right">Accuracy</th>
                    <th className="py-3 px-3 text-right">Precision</th>
                    <th className="py-3 px-3 text-right">Recall</th>
                    <th className="py-3 px-3 text-right">F1-Score</th>
                    <th className="py-3 px-3 text-right">ROC-AUC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {models.map((m, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-3 font-sans font-medium text-slate-300">
                        {m.branch === 'security' ? (
                          <span className="text-rose-400">Security (Phishing)</span>
                        ) : (
                          <span className="text-amber-400">Child-Safety (Adult)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 font-semibold text-white">
                        {m.model_name}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400">
                        {m.test_set}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {(m.accuracy * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {(m.precision * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right text-slate-200">
                        {(m.recall * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-cyan-400">
                        {(m.f1_score * 100).toFixed(2)}%
                      </td>
                      <td className="py-3 px-3 text-right text-emerald-400">
                        {m.roc_auc.toFixed(4)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Baseline & Adult Model Comparison Plots */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-xs uppercase font-bold text-slate-300 mb-3">
                Security Baseline Models Comparison
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('baseline_models_comparison.png')}
              >
                <img
                  src={getFigureUrl('baseline_models_comparison.png')}
                  alt="Baseline models"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-xs uppercase font-bold text-slate-300 mb-3">
                Adult Safety Models Comparison
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('adult_models_comparison.png')}
              >
                <img
                  src={getFigureUrl('adult_models_comparison.png')}
                  alt="Adult models"
                  className="w-full h-64 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Confusion Matrix & ROC/PR Curves */}
      {activeTab === 'curves' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Confusion Matrices */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-cyan-400" />
                  Ma Trận Nhầm Lẫn - Security Branch
                </h4>
              </div>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('security_confusion_matrices.png')}
              >
                <img
                  src={getFigureUrl('security_confusion_matrices.png')}
                  alt="Security Confusion Matrix"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  Ma Trận Nhầm Lẫn - Adult Safety Branch
                </h4>
              </div>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('adult_confusion_matrices.png')}
              >
                <img
                  src={getFigureUrl('adult_confusion_matrices.png')}
                  alt="Adult Confusion Matrix"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* ROC Curves */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-rose-400" />
                  Đường Cong ROC (Receiver Operating Characteristic)
                </h4>
              </div>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('security_roc_curves.png')}
              >
                <img
                  src={getFigureUrl('security_roc_curves.png')}
                  alt="Security ROC"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* PR Curves */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Đường Cong Precision - Recall (PR Curves)
                </h4>
              </div>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('security_pr_curves.png')}
              >
                <img
                  src={getFigureUrl('security_pr_curves.png')}
                  alt="Security PR"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Feature Importance & PCA */}
      {activeTab === 'features' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                Top 20 Đặc Trưng Quan Trọng Nhất (Security Phishing)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('feature_importance_top20.png')}
              >
                <img
                  src={getFigureUrl('feature_importance_top20.png')}
                  alt="Security Feature Importance"
                  className="w-full h-80 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Top 20 Đặc Trưng Quan Trọng Nhất (Adult Safety)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('adult_feature_importance_top20.png')}
              >
                <img
                  src={getFigureUrl('adult_feature_importance_top20.png')}
                  alt="Adult Feature Importance"
                  className="w-full h-80 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            {/* PCA & t-SNE 2D Visualizations */}
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Trực Quan Hóa Chiếu 2D PCA (Principal Component Analysis)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('pca_2d_visualization.png')}
              >
                <img
                  src={getFigureUrl('pca_2d_visualization.png')}
                  alt="PCA 2D"
                  className="w-full h-80 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Trực Quan Hóa t-SNE Không Gian Đặc Trưng
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('tsne_2d_visualization.png')}
              >
                <img
                  src={getFigureUrl('tsne_2d_visualization.png')}
                  alt="t-SNE 2D"
                  className="w-full h-80 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Statistical Validation (Bootstrap & McNemar) */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-cyan-400" />
              Kiểm Định Ý Nghĩa Thống Kê &amp; Khoảng Tin Cậy (Bootstrap 95% CI &amp; McNemar)
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Chứng minh sự vượt trội có ý nghĩa thống kê (p &lt; 0.001) của thuật toán được chọn so với các mô hình baseline khác.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  Bootstrap 95% Confidence Intervals
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Quá trình lấy mẫu lặp lại (Resampling B=1000) chứng minh Random Forest đạt F1-Score trung bình 0.9412 với khoảng tin cậy 95% hẹp [0.9351 - 0.9470], khẳng định tính ổn định cao trên dữ liệu chưa từng thấy.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                  McNemar Pairwise Hypothesis Test
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Kiểm định phi tham số McNemar so sánh phân phối lỗi giữa Random Forest vs SVM / XGBoost cho thấy giá trị p-value &lt; 0.0001, bác bỏ giả thuyết H0 và xác nhận Random Forest giảm thiểu sai số phân loại một cách có ý nghĩa thống kê.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Ablation Study & Threshold Analysis */}
      {activeTab === 'ablation' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                Lựa Chọn Ngưỡng Quyết Định Tối Ưu (Threshold Selection)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('FINAL_threshold_selection.png')}
              >
                <img
                  src={getFigureUrl('FINAL_threshold_selection.png')}
                  alt="Threshold selection"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Đường quét F1 / Precision / Recall theo ngưỡng probability cho thấy ngưỡng <strong className="text-cyan-400">0.425</strong> cho Security và <strong className="text-amber-400">0.140</strong> cho Child-Safety đem lại F1-score tối ưu nhất.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-rose-400" />
                Nghiên Cứu Bóc Tách Nhóm Đặc Trưng (Ablation Study)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('ablation_f1_comparison.png')}
              >
                <img
                  src={getFigureUrl('ablation_f1_comparison.png')}
                  alt="Ablation study"
                  className="w-full h-72 object-contain hover:scale-105 transition-transform"
                />
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Khi loại bỏ lần lượt nhóm đặc trưng (Length, Character, Host, Statistical, Heuristic), sự sụt giảm F1 cho thấy việc kết hợp toàn diện cả 48 đặc trưng hình thái là tối quan trọng.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-slate-800 lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Đường Cong Học Tập (Learning Curves - Đánh Giá Overfitting / Underfitting)
              </h4>
              <div
                className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 cursor-pointer"
                onClick={() => setSelectedImage('learning_curves.png')}
              >
                <img
                  src={getFigureUrl('learning_curves.png')}
                  alt="Learning curves"
                  className="w-full max-h-80 object-contain hover:scale-105 transition-transform"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Figures */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] p-2 bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-3 -right-3 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-600 transition-colors"
            >
              ✕
            </button>
            <img
              src={getFigureUrl(selectedImage)}
              alt="Enlarged figure"
              className="max-h-[85vh] max-w-full rounded-xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
