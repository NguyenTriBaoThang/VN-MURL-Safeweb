import React, { useEffect, useState } from 'react';
import { getDashboardSummary, getRecentScans } from '../api/client';
import { DashboardSummary, ScanResult } from '../types';
import { LabelBadge, ActionBadge } from '../components/Badge';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Cpu,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [sum, rec] = await Promise.all([
        getDashboardSummary(),
        getRecentScans(10),
      ]);
      setSummary(sum);
      setRecentScans(rec);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Security &amp; Child-Safe Dashboard
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Tổng quan thời gian thực về lưu lượng giám sát URL và phân loại tự động bằng Machine Learning
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <Link
            to="/scan"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 text-xs font-bold flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            Quét URL mới
          </Link>
        </div>
      </div>

      {/* 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Scans */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Scans</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-white font-mono">
            {summary?.totalScans ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Lượt kiểm tra đã ghi nhận</div>
        </div>

        {/* Allowed */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Allowed</span>
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-emerald-400 font-mono">
            {summary?.allowed ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Hợp lệ &amp; An toàn</div>
        </div>

        {/* Blocked */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Blocked</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-rose-400 font-mono">
            {summary?.blocked ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Đã ngăn chặn thành công</div>
        </div>

        {/* Phishing Detected */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Phishing</span>
            <Shield className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-rose-400 font-mono">
            {summary?.phishingDetected ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Lừa đảo an ninh mạng</div>
        </div>

        {/* Adult Detected */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Adult</span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl md:text-3xl font-extrabold text-amber-400 font-mono">
            {summary?.adultDetected ?? 0}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">Nội dung người lớn</div>
        </div>

        {/* Model Status */}
        <div className="glass-card glass-card-hover rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Model Status</span>
            <Cpu className="w-4 h-4" />
          </div>
          <div className="text-base font-bold text-emerald-400 flex items-center gap-1.5 mt-1">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            ONLINE
          </div>
          <div className="text-[11px] text-slate-500 mt-2 font-mono truncate">
            RF (0.425) + LR (0.14)
          </div>
        </div>
      </div>

      {/* 7-Day Trend Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Biểu Đồ Xu Hướng Giám Sát URL (7 Ngày Gần Nhất)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Phân bố số lượng URL theo 3 nhãn: BENIGN, PHISHING, và ADULT
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Benign</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <span className="text-slate-300">Phishing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Adult</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          {summary?.recentTrend && summary.recentTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summary.recentTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBenign" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorPhishing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAdult" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="benign" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBenign)" name="Benign (Cho phép)" />
                <Area type="monotone" dataKey="phishing" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorPhishing)" name="Phishing (Chặn)" />
                <Area type="monotone" dataKey="adult" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorAdult)" name="Adult (Chặn)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs">
              Chưa có đủ dữ liệu theo ngày. Hãy thực hiện thêm các lượt quét URL.
            </div>
          )}
        </div>
      </div>

      {/* Recent Scans Table */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Lượt Quét URL Gần Đây
            </h3>
            <p className="text-xs text-slate-400">10 bản ghi phân loại URL mới nhất</p>
          </div>
          <Link
            to="/history"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            Xem tất cả lịch sử
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3 pl-2">URL</th>
                <th className="pb-3 px-3">Nhãn Model</th>
                <th className="pb-3 px-3">Hành động</th>
                <th className="pb-3 px-3">Độ tin cậy</th>
                <th className="pb-3 px-3">Lý do</th>
                <th className="pb-3 pr-2 text-right">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {recentScans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    Chưa có lịch sử quét URL nào. Hãy nhập URL đầu tiên trên trang Scan URL!
                  </td>
                </tr>
              ) : (
                recentScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-2 max-w-[280px] md:max-w-md truncate font-mono text-slate-300">
                      {scan.url}
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <LabelBadge label={scan.label} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <ActionBadge action={scan.action} size="sm" />
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-slate-300">
                      {(scan.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-3 text-slate-400 max-w-xs truncate">
                      {scan.reason}
                    </td>
                    <td className="py-3.5 pr-2 text-right text-slate-500 whitespace-nowrap">
                      {scan.created_at ? new Date(scan.created_at).toLocaleTimeString('vi-VN') : 'Vừa xong'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
