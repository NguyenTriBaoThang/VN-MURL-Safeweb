import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User, KeyRound, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPortal = searchParams.get('portal') === 'admin' ? 'admin' : 'user';

  const [activePortal, setActivePortal] = useState<'admin' | 'user'>(initialPortal);
  const [username, setUsername] = useState(initialPortal === 'admin' ? 'admin' : 'user');
  const [password, setPassword] = useState(initialPortal === 'admin' ? 'Admin@123' : 'User@123');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, quickLogin, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handlePortalSwitch = (portal: 'admin' | 'user') => {
    setActivePortal(portal);
    setError(null);
    setSuccess(null);
    if (portal === 'admin') {
      setUsername('admin');
      setPassword('Admin@123');
    } else {
      setUsername('user');
      setPassword('User@123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const res = await login(username, password);
      if (res.success) {
        setSuccess(`Đăng nhập thành công với vai trò ${res.role}! Đang chuyển hướng...`);
        setTimeout(() => {
          if (res.role === 'Admin') {
            navigate('/admin/dashboard');
          } else {
            navigate('/user/dashboard');
          }
        }, 600);
      } else {
        setError(res.error || 'Tài khoản hoặc mật khẩu không chính xác.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuick = async (role: 'Admin' | 'User') => {
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    const ok = await quickLogin(role);
    setSubmitting(false);
    if (ok) {
      setSuccess(`Đã đăng nhập nhanh với vai trò ${role}! Đang chuyển hướng...`);
      setTimeout(() => {
        if (role === 'Admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/user/dashboard');
        }
      }, 500);
    } else {
      setError('Đăng nhập nhanh thất bại. Vui lòng kiểm tra lại dịch vụ Backend.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background neon glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Brand Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-500 p-0.5 shadow-xl shadow-cyan-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          VN-MURL SafeWeb
        </h2>
        <p className="mt-1.5 text-xs text-slate-400">
          Cổng Xác Thực &amp; Phân Quyền Truy Cập (Admin / User Portals)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
          {/* Portal Switch Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handlePortalSwitch('user')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activePortal === 'user'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Người Dùng (User)</span>
            </button>

            <button
              type="button"
              onClick={() => handlePortalSwitch('admin')}
              className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activePortal === 'admin'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Quản Trị (Admin)</span>
            </button>
          </div>

          {/* Quick Notice regarding the selected role */}
          <div
            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
              activePortal === 'admin'
                ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="font-bold flex items-center gap-1.5 mb-1">
              {activePortal === 'admin' ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  Cổng Quản Trị Hệ Thống (SOC Admin)
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-400" />
                  Cổng Người Dùng SafeWeb
                </>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              {activePortal === 'admin'
                ? 'Quyền hạn: Cấu hình ngưỡng Machine Learning, thêm bớt White/Blacklist, quản lý người dùng, xem toàn bộ log.'
                : 'Quyền hạn: Quét và phát hiện liên kết lừa đảo/người lớn, xem lịch sử cá nhân, báo cáo đường link độc hại.'}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                Tên đăng nhập
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                placeholder="Nhập tên đăng nhập"
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
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400 font-mono"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Account Credentials Pill */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono space-y-1">
              <div className="text-slate-400 font-sans font-semibold">Tài khoản được cấp sẵn:</div>
              {activePortal === 'admin' ? (
                <div className="text-cyan-400">
                  User: <strong>admin</strong> | Pass: <strong>Admin@123</strong>
                </div>
              ) : (
                <div className="text-emerald-400">
                  User: <strong>user</strong> | Pass: <strong>User@123</strong>
                </div>
              )}
            </div>

            {/* Error / Success alert */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 ${
                activePortal === 'admin'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>{submitting ? 'Đang xác thực...' : `Đăng Nhập Vào ${activePortal === 'admin' ? 'Quản Trị' : 'Người Dùng'}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Quick 1-Click Login Section */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div className="text-center text-[11px] text-slate-400 font-medium">
              Hoặc thử nhanh 1-chạm không cần gõ:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuick('User')}
                disabled={submitting}
                className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-emerald-400" />
                Vào Ngay User
              </button>

              <button
                type="button"
                onClick={() => handleQuick('Admin')}
                disabled={submitting}
                className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Vào Ngay Admin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
