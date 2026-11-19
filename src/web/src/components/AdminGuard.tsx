import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, KeyRound, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const { isAdmin, user, isAuthenticated, loading, quickLogin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-slate-300">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <p className="text-sm font-medium">Đang xác thực thông tin quyền hạn...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-6 md:p-8 rounded-2xl border border-rose-500/30 text-center space-y-6 shadow-2xl shadow-rose-950/40">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-semibold">
              Yêu Cầu Quyền Quản Trị Viên (Admin)
            </span>
            <h2 className="text-xl font-bold text-white mt-3">Truy Cập Bị Giới Hạn</h2>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Khu vực Quản Trị Hệ Thống (Admin Portal) chỉ dành riêng cho tài khoản có vai trò <strong>Admin</strong>.
              {isAuthenticated && (
                <span className="block mt-1 text-amber-300">
                  Bạn đang đăng nhập bằng tài khoản: <strong>{user?.username}</strong> (Vai trò: {user?.role}).
                </span>
              )}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs font-mono space-y-1">
            <div className="text-slate-400 text-[11px]">Tài khoản Quản Trị Viên thử nghiệm:</div>
            <div className="text-cyan-400">Tên đăng nhập: <strong>admin</strong></div>
            <div className="text-cyan-400">Mật khẩu: <strong>Admin@123</strong></div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              onClick={async () => {
                await quickLogin('Admin');
              }}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-4 h-4" />
              Đăng Nhập Nhanh Bằng Tài Khoản Admin
            </button>

            <Link
              to="/login?portal=admin"
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <KeyRound className="w-4 h-4" />
              Chuyển Đến Trang Đăng Nhập
            </Link>

            <Link
              to="/user/dashboard"
              className="w-full py-2 text-slate-400 hover:text-white text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Quay lại Cổng Người Dùng (User Portal)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
