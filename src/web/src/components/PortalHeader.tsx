import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Lock, User as UserIcon, LogOut, ArrowRightLeft, Sparkles, ExternalLink } from 'lucide-react';

interface PortalHeaderProps {
  currentPortal: 'admin' | 'user';
  onToggleSidebar?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ currentPortal }) => {
  const { user, isAuthenticated, logout, quickLogin } = useAuth();
  const location = useLocation();

  return (
    <div className="bg-[#0b101f] border-b border-slate-800/80 px-4 md:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Portal Indicator Badges */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
          <Link
            to="/user/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              currentPortal === 'user'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserIcon className="w-3.5 h-3.5" />
            <span>Cổng Người Dùng</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              Port: 3000
            </span>
          </Link>

          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
              currentPortal === 'admin'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Cổng Quản Trị SOC</span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
              Port: 3001
            </span>
          </Link>
        </div>
      </div>

      {/* User Status & Fast Quick Switch */}
      <div className="flex items-center gap-2.5 ml-auto">
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-400">Tài khoản:</span>
              <strong className="text-white font-mono">{user?.username}</strong>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded font-mono uppercase font-bold ${
                  user?.role === 'Admin'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {user?.role}
              </span>
            </div>

            <button
              onClick={logout}
              title="Đăng xuất"
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-[11px]">Đăng xuất</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => quickLogin('User')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Đăng nhập User (user / User@123)
            </button>

            <button
              onClick={() => quickLogin('Admin')}
              className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              Đăng nhập Admin (admin / Admin@123)
            </button>

            <Link
              to="/login"
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
