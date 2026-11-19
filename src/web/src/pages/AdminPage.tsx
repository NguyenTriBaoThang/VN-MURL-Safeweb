import React, { useState } from 'react';
import { Lock, ShieldCheck, Database, RefreshCw, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';

export const AdminPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin@SafeWeb2026');
  const [token, setToken] = useState<string | null>(localStorage.getItem('safeweb_token'));
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      const jwtToken = res.data.token;
      localStorage.setItem('safeweb_token', jwtToken);
      setToken(jwtToken);
      setMessage('Đăng nhập Quản Trị Viên thành công! Token JWT đã được kích hoạt.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại. Kiểm tra tài khoản hoặc mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('safeweb_token');
    setToken(null);
    setMessage('Đã đăng xuất phiên quản trị.');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Lock className="w-4 h-4" />
          Quản Trị Hệ Thống
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Cổng Xác Thực &amp; Quản Trị Bảo Mật
        </h2>
        <p className="text-slate-400 text-sm mt-0.5">
          Quản lý tài khoản quản trị viên, kiểm soát cấu hình và chẩn đoán dịch vụ lõi VN-MURL SafeWeb.
        </p>
      </div>

      {/* Login Card */}
      {!token ? (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Đăng Nhập Quản Trị Viên (Admin)</h3>
              <p className="text-xs text-slate-400">Nhập tài khoản để cấp quyền chỉnh sửa danh sách chính sách và xuất dữ liệu</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                placeholder="admin"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800 font-mono">
              Tài khoản mặc định: <strong>admin</strong> | Mật khẩu: <strong>Admin@SafeWeb2026</strong>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? 'Đang xác thực...' : 'Đăng Nhập'}
            </button>
          </form>
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 md:p-8 border border-emerald-500/30 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Phiên Quản Trị Viên Đang Hoạt Động</h3>
                <div className="text-xs text-emerald-400 font-mono">Role: Administrator (JWT Authenticated)</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Đăng xuất
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="font-semibold text-slate-300">Trạng Thái Hệ Thống:</div>
            <div className="text-slate-400">• FastAPI AI Engine: Kết nối bình thường (localhost:8000)</div>
            <div className="text-slate-400">• Cơ sở dữ liệu: SQL Server / SQLite Local Fallback hoạt động</div>
            <div className="text-slate-400">• Bộ nạp Model: VN_MURL_SafeWeb_Final_Model.joblib (Ready)</div>
          </div>
        </div>
      )}

      {/* Messages */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 flex items-center gap-2.5 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
