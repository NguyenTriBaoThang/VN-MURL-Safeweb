import React, { useEffect, useState } from 'react';
import { getUsersApi } from '../api/client';
import { UserSummary } from '../types';
import { Users, ShieldCheck, ShieldAlert, Key, Check, X, RefreshCw, Lock, Sparkles } from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsersApi();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const permissions = [
    { name: 'Cấu hình ngưỡng Machine Learning (Phishing, Adult, Strict Mode)', admin: true, user: false },
    { name: 'Thêm / Xóa quy tắc Danh Sách Trắng (Allowlist)', admin: true, user: false },
    { name: 'Thêm / Xóa quy tắc Danh Sách Đen (Blocklist)', admin: true, user: false },
    { name: 'Xem toàn bộ nhật ký quét của tất cả người dùng (Audit Logs)', admin: true, user: false },
    { name: 'Quản lý tài khoản & xem danh sách người dùng hệ thống', admin: true, user: false },
    { name: 'Xem báo cáo chi tiết mô hình ML (ROC/PR Curves, Feature Weights)', admin: true, user: false },
    { name: 'Quét & phân tích độ an toàn của đường link URL', admin: true, user: true },
    { name: 'Xem lịch sử quét cá nhân của tài khoản', admin: true, user: true },
    { name: 'Gửi báo cáo đường link độc hại / lừa đảo lên quản trị viên', admin: true, user: true },
    { name: 'Cài đặt Extension trình duyệt để bảo vệ khi lướt web', admin: true, user: true },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Users className="w-4 h-4" />
            Quản Trị Người Dùng &amp; Phân Quyền
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Danh Sách Tài Khoản &amp; Ma Trận Phân Quyền (RBAC)
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Quản lý tài khoản đăng nhập, vai trò truy cập và kiểm soát quyền hạn giữa Admin Portal và User Portal.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Two Configured Local Accounts Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Card */}
        <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tài Khoản Quản Trị Viên (Admin)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono font-semibold">
                  Role: Admin
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-950/40 px-2.5 py-1 rounded-lg border border-cyan-500/30">
              Quyền Quản Trị
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-400">Tên đăng nhập: <strong className="text-white">admin</strong></div>
            <div className="text-slate-400">Mật khẩu mặc định: <strong className="text-cyan-400">Admin@123</strong></div>
            <div className="text-slate-400">Phạm vi: <strong className="text-slate-200">Khu vực quản trị hệ thống /admin</strong></div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Có toàn quyền cấu hình mô hình Machine Learning, kiểm soát danh sách chặn/cho phép, duyệt báo cáo người dùng và giám sát toàn bộ hoạt động hệ thống.
          </p>
        </div>

        {/* User Card */}
        <div className="glass-card rounded-2xl p-6 border border-emerald-500/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Tài Khoản Người Dùng (User)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-semibold">
                  Role: User
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Quyền Người Dùng
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-400">Tên đăng nhập: <strong className="text-white">user</strong></div>
            <div className="text-slate-400">Mật khẩu mặc định: <strong className="text-emerald-400">User@123</strong></div>
            <div className="text-slate-400">Phạm vi: <strong className="text-slate-200">Khu vực người dùng /user</strong></div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Dành cho người dùng thông thường, gia đình và trẻ nhỏ: kiểm tra liên kết an toàn, bảo vệ trước mã độc và nội dung người lớn, gửi báo cáo link lừa đảo.
          </p>
        </div>
      </div>

      {/* Users Database Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Tài Khoản Trong Cơ Sở Dữ Liệu ({users.length})
          </h4>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Tên Đăng Nhập</th>
              <th className="py-3 px-4">Vai Trò (Role)</th>
              <th className="py-3 px-4">Lượt Quét Đã Thực Hiện</th>
              <th className="py-3 px-4">Ngày Khởi Tạo</th>
              <th className="py-3 px-4 text-right">Trạng Thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500">
                  {loading ? 'Đang tải danh sách tài khoản...' : 'Chưa có dữ liệu người dùng.'}
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-white flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        u.role === 'Admin' ? 'bg-cyan-400' : 'bg-emerald-400'
                      }`}
                    />
                    {u.username}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        u.role === 'Admin'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-300">
                    {u.scanCount} lượt
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="text-[11px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Hoạt động
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* RBAC Permission Matrix */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h4 className="text-sm font-bold text-white">
            Bảng Ma Trận Phân Quyền Chi Tiết (RBAC Matrix)
          </h4>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 uppercase font-semibold">
              <th className="py-3 px-4">Chức Năng &amp; Thao Tác Hệ Thống</th>
              <th className="py-3 px-4 text-center w-36 text-cyan-400">Quản Trị (Admin)</th>
              <th className="py-3 px-4 text-center w-36 text-emerald-400">Người Dùng (User)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {permissions.map((p, idx) => (
              <tr key={idx} className="hover:bg-slate-900/40">
                <td className="py-3 px-4 text-slate-300">{p.name}</td>
                <td className="py-3 px-4 text-center">
                  {p.admin ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <X className="w-4 h-4" />
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {p.user ? (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      <X className="w-4 h-4" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
