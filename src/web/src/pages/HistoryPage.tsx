import React, { useEffect, useState } from 'react';
import { getScans } from '../api/client';
import { ScanResult, FinalLabel } from '../types';
import { LabelBadge, ActionBadge } from '../components/Badge';
import { Search, Filter, Download, ChevronLeft, ChevronRight, History as HistoryIcon, Eye, X } from 'lucide-react';

interface HistoryPageProps {
  onlyMine?: boolean;
  title?: string;
  subtitle?: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onlyMine = false,
  title = 'Nhật Ký & Lịch Sử Quét URL',
  subtitle,
}) => {
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(15);
  const [search, setSearch] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState<ScanResult | null>(null);

  const fetchScansData = async () => {
    setLoading(true);
    try {
      const data = await getScans(page, pageSize, search, labelFilter, onlyMine);
      setScans(data.items);
      setTotal(data.total);
    } catch (err) {
      console.error('Failed to load scan history', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScansData();
  }, [page, labelFilter, onlyMine]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchScansData();
  };

  const exportCsv = () => {
    if (scans.length === 0) return;
    const headers = ['ID', 'URL', 'Label', 'Action', 'Confidence', 'PhishingScore', 'AdultScore', 'Reason', 'CreatedAt'];
    const rows = scans.map((s) => [
      s.id ?? '',
      `"${s.url.replace(/"/g, '""')}"`,
      s.label,
      s.action,
      s.confidence,
      s.phishing_score ?? '',
      s.adult_score ?? '',
      `"${s.reason.replace(/"/g, '""')}"`,
      s.created_at ?? '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vn_murl_safeweb_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = Math.ceil(total / pageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HistoryIcon className="w-7 h-7 text-cyan-400" />
            {title}
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            {subtitle || `Tổng cộng ${total} lượt quét đã được ghi nhận`}
          </p>
        </div>
        <button
          onClick={exportCsv}
          disabled={scans.length === 0}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          Xuất CSV
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm URL..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </form>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <select
            value={labelFilter}
            onChange={(e) => {
              setLabelFilter(e.target.value);
              setPage(1);
            }}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2.5 text-white text-xs focus:outline-none focus:border-cyan-400"
          >
            <option value="">Tất cả nhãn</option>
            <option value="BENIGN">BENIGN (Cho phép)</option>
            <option value="PHISHING">PHISHING (Chặn lừa đảo)</option>
            <option value="ADULT">ADULT (Chặn người lớn)</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="py-3.5 pl-4">ID</th>
                {!onlyMine && <th className="py-3.5 px-3">Tài khoản</th>}
                <th className="py-3.5 px-3">URL</th>
                <th className="py-3.5 px-3">Nhãn Model</th>
                <th className="py-3.5 px-3">Hành động</th>
                <th className="py-3.5 px-3">Độ tin cậy</th>
                <th className="py-3.5 px-3">Thời gian</th>
                <th className="py-3.5 pr-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={onlyMine ? 7 : 8} className="py-12 text-center text-slate-400">
                    Đang tải nhật ký quét...
                  </td>
                </tr>
              ) : scans.length === 0 ? (
                <tr>
                  <td colSpan={onlyMine ? 7 : 8} className="py-12 text-center text-slate-500">
                    Không tìm thấy bản ghi quét nào phù hợp với điều kiện lọc.
                  </td>
                </tr>
              ) : (
                scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 pl-4 font-mono text-slate-500">
                      #{scan.id}
                    </td>
                    {!onlyMine && (
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                          {scan.userId || 'Hệ thống'}
                        </span>
                      </td>
                    )}
                    <td className="py-3.5 px-3 max-w-[240px] md:max-w-md truncate font-mono text-slate-200">
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
                    <td className="py-3.5 px-3 whitespace-nowrap text-slate-400">
                      {scan.created_at ? new Date(scan.created_at).toLocaleString('vi-VN') : 'N/A'}
                    </td>
                    <td className="py-3.5 pr-4 text-right">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Trang <span className="text-white font-bold">{page}</span> / {totalPages} (Tổng {total} bản ghi)
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-700 relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-white text-base">
                Chi Tiết Bản Ghi Quét #{selectedScan.id}
              </h3>
              <button
                onClick={() => setSelectedScan(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">URL</div>
                <div className="p-2.5 rounded-lg bg-slate-950 font-mono text-slate-200 break-all select-all">
                  {selectedScan.url}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 mb-1">Nhãn Model</div>
                  <LabelBadge label={selectedScan.label} size="md" />
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 mb-1">Hành Động</div>
                  <ActionBadge action={selectedScan.action} size="md" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 font-sans mb-1">Phishing Score</div>
                  <div className="text-rose-400 text-sm font-bold">
                    {selectedScan.phishing_score !== undefined ? (selectedScan.phishing_score * 100).toFixed(2) + '%' : 'N/A'}
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                  <div className="text-slate-400 font-sans mb-1">Adult Score</div>
                  <div className="text-amber-400 text-sm font-bold">
                    {selectedScan.adult_score !== undefined ? (selectedScan.adult_score * 100).toFixed(2) + '%' : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-400 uppercase tracking-wider font-semibold mb-1">Đánh giá hệ thống</div>
                <p className="text-slate-300 leading-relaxed">{selectedScan.reason}</p>
              </div>

              <div className="text-slate-500 text-[11px] text-right">
                Ghi nhận lúc: {selectedScan.created_at ? new Date(selectedScan.created_at).toLocaleString('vi-VN') : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
