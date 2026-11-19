import React, { useState } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Sliders,
  ShieldCheck,
  ClipboardList,
  Users,
  FlaskConical,
  Network,
  Menu,
  Lock,
  LogOut,
  ExternalLink,
  Shield,
  Search,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Bảng Điều Khiển SOC', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Cài Đặt Ngưỡng ML', path: '/admin/settings', icon: Sliders },
    { name: 'Danh Sách Cho Phép / Chặn', path: '/admin/policy', icon: ShieldCheck },
    { name: 'Nhật Ký Quét Toàn Hệ Thống', path: '/admin/logs', icon: ClipboardList },
    { name: 'Quản Lý Người Dùng & RBAC', path: '/admin/users', icon: Users },
    { name: 'Nghiên Cứu & Benchmark ML', path: '/admin/research', icon: FlaskConical },
    { name: 'Kiến Trúc & Tài Liệu API', path: '/admin/architecture', icon: Network },
  ];

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col">
      <div className="flex-1 flex">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}

        {/* Sidebar for Admin */}
        <aside
          className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#0a0f1d] border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-rose-500 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Lock className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="font-extrabold text-white text-base tracking-tight">
                SafeWeb Admin
              </div>
              <div className="text-[11px] text-cyan-400 font-medium">Trung tâm giám sát SOC</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Admin Diagnostics Footer */}
          <div className="p-4 mx-4 mb-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">AI Model Engine:</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Trạng thái API:</span>
              <span className="text-cyan-400 font-semibold">Sẵn sàng</span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
          {/* Admin Top Navbar */}
          <header className="sticky top-0 z-30 bg-[#0a0f1d]/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  Bảng Điều Khiển An Ninh Mạng (SOC)
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    Quyền Admin
                  </span>
                </h1>
                <p className="hidden md:block text-xs text-slate-400">
                  Cấu hình Machine Learning, kiểm duyệt chính sách và theo dõi toàn diện nguy cơ an ninh
                </p>
              </div>
            </div>

            {/* Quick Actions & Profile */}
            <div className="flex items-center gap-3">
              <Link
                to="/user/scan"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Chuyển sang giao diện người dùng"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Về Trang Người Dùng</span>
              </Link>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <span className="text-white font-medium">{user?.username || 'admin'}</span>
              </div>

              <button
                onClick={logout}
                title="Đăng xuất"
                className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
