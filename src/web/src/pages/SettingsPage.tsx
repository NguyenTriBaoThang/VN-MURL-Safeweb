import React, { useEffect, useState } from 'react';
import {
  getAllowlist,
  addToAllowlist,
  deleteFromAllowlist,
  getBlocklist,
  addToBlocklist,
  deleteFromBlocklist,
} from '../api/client';
import { ListEntry } from '../types';
import { Settings, ShieldCheck, ShieldX, Plus, Trash2, Sliders, CheckCircle2 } from 'lucide-react';

interface SettingsPageProps {
  defaultTab?: 'policy' | 'allowlist' | 'blocklist';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ defaultTab = 'policy' }) => {
  const [activeTab, setActiveTab] = useState<'policy' | 'allowlist' | 'blocklist'>(defaultTab);
  const [allowlist, setAllowlist] = useState<ListEntry[]>([]);
  const [blocklist, setBlocklist] = useState<ListEntry[]>([]);
  const [loading, setLoading] = useState(false);

  // New item inputs
  const [newPattern, setNewPattern] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const loadLists = async () => {
    setLoading(true);
    try {
      const [allow, block] = await Promise.all([getAllowlist(), getBlocklist()]);
      setAllowlist(allow);
      setBlocklist(block);
    } catch (err) {
      console.error('Failed to load lists', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const handleAddAllow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.trim()) return;
    try {
      await addToAllowlist(newPattern.trim(), newDesc.trim() || 'Whitelist domain');
      setNewPattern('');
      setNewDesc('');
      loadLists();
    } catch (err) {
      alert('Không thể thêm vào danh sách cho phép.');
    }
  };

  const handleDeleteAllow = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) return;
    try {
      await deleteFromAllowlist(id);
      loadLists();
    } catch (err) {
      alert('Không thể xóa quy tắc.');
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPattern.trim()) return;
    try {
      await addToBlocklist(newPattern.trim(), newDesc.trim() || 'Blacklist domain');
      setNewPattern('');
      setNewDesc('');
      loadLists();
    } catch (err) {
      alert('Không thể thêm vào danh sách chặn.');
    }
  };

  const handleDeleteBlock = async (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa quy tắc này?')) return;
    try {
      await deleteFromBlocklist(id);
      loadLists();
    } catch (err) {
      alert('Không thể xóa quy tắc.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Settings className="w-4 h-4" />
          Hệ Thống &amp; Chính Sách Kiểm Soát
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Cài Đặt &amp; Quản Lý Danh Sách Ngoại Lệ
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Tùy biến danh sách trắng (Allowlist), danh sách đen (Blocklist) và cấu hình ngưỡng kích hoạt Machine Learning.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('policy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'policy'
              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Ngưỡng Kích Hoạt ML
        </button>
        <button
          onClick={() => setActiveTab('allowlist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'allowlist'
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Danh Sách Trắng ({allowlist.length})
        </button>
        <button
          onClick={() => setActiveTab('blocklist')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'blocklist'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldX className="w-4 h-4" />
          Danh Sách Đen ({blocklist.length})
        </button>
      </div>

      {/* Tab: Policy & Thresholds */}
      {activeTab === 'policy' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            Cấu Hình Ngưỡng Xác Suất Mô Hình (Model Thresholds)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase">Phishing Threshold</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded">0.425</span>
              </div>
              <p className="text-xs text-slate-400">
                Nếu xác suất Phishing từ Random Forest &gt;= 0.425, hệ thống sẽ lập tức gắn nhãn <span className="text-rose-400 font-semibold">PHISHING</span> và chặn truy cập.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase">Adult Threshold</span>
                <span className="text-xs font-mono font-bold text-white bg-slate-800 px-2.5 py-1 rounded">0.140</span>
              </div>
              <p className="text-xs text-slate-400">
                Nếu xác suất Adult từ Logistic Regression Pipeline &gt;= 0.140, hệ thống sẽ gắn nhãn <span className="text-amber-400 font-semibold">ADULT</span> để bảo vệ trẻ em.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
            <div className="text-slate-300 font-sans font-semibold">Đặc tính bảo mật:</div>
            <div>• Chế độ Zero-Crawl: Bật (Tuyệt đối không gửi request ngoại mạng)</div>
            <div>• Ngăn chặn SSRF Loopback &amp; Private IP: Bật (RFC 1918 &amp; Localhost Blocked)</div>
            <div>• Giới hạn tốc độ quét: 120 yêu cầu / phút / Địa chỉ IP</div>
          </div>
        </div>
      )}

      {/* Tab: Allowlist */}
      {activeTab === 'allowlist' && (
        <div className="space-y-6">
          {/* Add form */}
          <form onSubmit={handleAddAllow} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              Thêm Miền Vào Danh Sách Trắng (Luôn Cho Phép)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder="Domain / Regex (vd: moet.gov.vn)"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-mono"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả (vd: Cổng thông tin Giáo dục)"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
              />
            </div>
            <button
              type="submit"
              disabled={!newPattern.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm vào danh sách trắng
            </button>
          </form>

          {/* List Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Pattern Miền</th>
                  <th className="py-3 px-4">Mô tả</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {allowlist.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Chưa có quy tắc Allowlist nào.
                    </td>
                  </tr>
                ) : (
                  allowlist.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-mono text-emerald-400 font-semibold">{item.pattern}</td>
                      <td className="py-3 px-4 text-slate-300">{item.description}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteAllow(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Blocklist */}
      {activeTab === 'blocklist' && (
        <div className="space-y-6">
          {/* Add form */}
          <form onSubmit={handleAddBlock} className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-400" />
              Thêm Miền Vào Danh Sách Đen (Chặn Ngay Lập Tức)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newPattern}
                onChange={(e) => setNewPattern(e.target.value)}
                placeholder="Domain / Regex (vd: malware-site.biz)"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 font-mono"
              />
              <input
                type="text"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Mô tả (vd: Trang chứa mã độc)"
                className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400"
              />
            </div>
            <button
              type="submit"
              disabled={!newPattern.trim()}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm vào danh sách đen
            </button>
          </form>

          {/* List Table */}
          <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-4">Pattern Miền</th>
                  <th className="py-3 px-4">Mô tả</th>
                  <th className="py-3 px-4">Thời gian tạo</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {blocklist.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      Chưa có quy tắc Blocklist nào.
                    </td>
                  </tr>
                ) : (
                  blocklist.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-900/40">
                      <td className="py-3 px-4 font-mono text-rose-400 font-semibold">{item.pattern}</td>
                      <td className="py-3 px-4 text-slate-300">{item.description}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(item.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDeleteBlock(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
