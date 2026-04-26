import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  Users,
  Award,
  Trophy,
  Shield,
  Menu,
  X,
  Radio,
  Zap,
  Bell,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Info,
  LogOut,
  Settings,
  UserCircle,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useAuth, Role } from "../contexts/AuthContext";

const getNavItems = (role: string) => {
  const items: { path: string; icon: any; label: string; exact?: boolean }[] = [
    { path: "/", icon: LayoutDashboard, label: "Command Center", exact: true },
  ];

  if (role === "ADMIN" || role === "NGO") {
    items.push({ path: "/tasks", icon: ListChecks, label: "Task Management" });
    items.push({ path: "/submit", icon: PlusCircle, label: "Submit a Need" });
    items.push({ path: "/volunteers", icon: Users, label: "Volunteer Matching" });
  }

  if (role === "VOLUNTEER" || role === "GIG_WORKER" || role === "ADMIN") {
    items.push({ path: "/bounty", icon: Award, label: "Bounty Board" });
    items.push({ path: "/karma", icon: Trophy, label: "Karma Ledger" });
  }

  items.push({ path: "/transparency", icon: Shield, label: "Traceability Portal" });

  return items;
};

const notificationData = [
  {
    id: 1,
    icon: AlertTriangle,
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-400/20",
    title: "U5 Critical — Water Shortage Cluster",
    desc: "6 reports merged in Sector 7. No volunteer matched yet.",
    time: "2 min ago",
    unread: true,
  },
  {
    id: 2,
    icon: AlertTriangle,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    title: "Disease Outbreak Alert",
    desc: "Predictive AI flagged Sector 9 for pre-emptive dispatch.",
    time: "11 min ago",
    unread: true,
  },
  {
    id: 3,
    icon: CheckCircle2,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    title: "T-010 Verified on Blockchain",
    desc: "Warm Clothing Drop-off hashed to Polygon. Karma awarded.",
    time: "24 min ago",
    unread: true,
  },
  {
    id: 4,
    icon: Info,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    title: "New volunteer registered",
    desc: "Kiran Bose (Boat + Car) joined the East Zone pool.",
    time: "1 hr ago",
    unread: false,
  },
];

export function Layout() {
  const { user, switchRole } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const dismissNotif = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const currentNavItems = getNavItems(user.role);

  const currentPage = currentNavItems.find(
    (item) =>
      item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  );

  return (
    <div className="flex h-screen bg-[#070b14] text-white overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`flex flex-col transition-all duration-300 bg-[#0d1221] border-r border-[#1a2540] ${sidebarOpen ? "w-64" : "w-16"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1a2540]">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <div className="text-sm text-white" style={{ fontWeight: 700, letterSpacing: "0.05em" }}>
                SahayNet
              </div>
              <div className="text-[10px] text-slate-400" style={{ letterSpacing: "0.1em" }}>
                SMART RESOURCE ALLOCATION
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto text-slate-400 hover:text-white transition-colors shrink-0"
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Live indicator */}
        {sidebarOpen && (
          <div className="mx-3 mt-3 px-3 py-2 rounded-lg bg-[#0f1d0f] border border-green-900/50 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[11px] text-green-400" style={{ fontWeight: 600, letterSpacing: "0.08em" }}>
              SYSTEM LIVE
            </span>
            <Radio size={11} className="ml-auto text-green-400 animate-pulse" />
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {currentNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:text-white hover:bg-[#151f35]"
                }`
              }
            >
              <item.icon size={18} className="shrink-0" />
              {sidebarOpen && (
                <>
                  <span className="text-sm flex-1">{item.label}</span>
                  <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom stats */}
        {sidebarOpen && (
          <div className="p-3 border-t border-[#1a2540]">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#070b14] rounded-lg p-2 text-center">
                <div className="text-lg text-red-400" style={{ fontWeight: 700 }}>7</div>
                <div className="text-[10px] text-slate-500">Active</div>
              </div>
              <div className="bg-[#070b14] rounded-lg p-2 text-center">
                <div className="text-lg text-green-400" style={{ fontWeight: 700 }}>10</div>
                <div className="text-[10px] text-slate-500">Volunteers</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-[#1a2540] bg-[#0d1221]/80 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-[11px]" style={{ letterSpacing: "0.1em" }}>SahayNet</span>
            <span className="text-slate-600">/</span>
            <span className="text-sm text-white">{currentPage?.label ?? "Dashboard"}</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-xs text-slate-500 hidden sm:block">
              {new Date().toLocaleDateString("en-IN", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
            </div>

            {/* Notification Bell */}
            <div ref={notifRef} className="relative z-50">
              <button
                onClick={() => { setNotifOpen((v) => !v); setProfileOpen(false); }}
                className="relative p-2 rounded-lg hover:bg-[#1a2540] text-slate-400 hover:text-white transition-colors"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center text-white" style={{ fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d1221] border border-[#1a2540] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-[#1a2540]">
                    <span className="text-sm text-white" style={{ fontWeight: 600 }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-[#1a2540]">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications</div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`flex items-start gap-3 px-4 py-3 hover:bg-[#151f35] transition-colors relative ${n.unread ? "bg-blue-500/5" : ""}`}
                        >
                          <div className={`p-1.5 rounded-lg shrink-0 ${n.bg} border ${n.border}`}>
                            <n.icon size={13} className={n.color} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2">
                              <p className="text-xs text-white leading-tight flex-1" style={{ fontWeight: n.unread ? 600 : 400 }}>{n.title}</p>
                              {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 mt-1" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-tight">{n.desc}</p>
                            <p className="text-[10px] text-slate-600 mt-1">{n.time}</p>
                          </div>
                          <button
                            onClick={() => dismissNotif(n.id)}
                            className="shrink-0 text-slate-700 hover:text-slate-400 transition-colors mt-0.5"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-2.5 border-t border-[#1a2540]">
                      <button
                        onClick={() => setNotifications([])}
                        className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors w-full text-center"
                      >
                        Clear all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative z-50">
              <button
                onClick={() => { setProfileOpen((v) => !v); setNotifOpen(false); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a2540] border border-[#253050] hover:border-[#2d3d60] hover:bg-[#1e2b4a] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs text-white" style={{ fontWeight: 700 }}>
                  {user.avatar}
                </div>
                <span className="text-sm text-slate-300 hidden sm:block">{user.name}</span>
                <ChevronDown size={13} className={`text-slate-500 transition-transform duration-200 hidden sm:block ${profileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-[#0d1221] border border-[#1a2540] rounded-xl shadow-2xl shadow-black/50 overflow-hidden">
                  {/* Profile header */}
                  <div className="px-4 py-3 border-b border-[#1a2540]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm text-white" style={{ fontWeight: 700 }}>
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm text-white" style={{ fontWeight: 600 }}>{user.name}</div>
                        <div className="text-[11px] text-slate-500">{user.email}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                      <span className="text-[10px] text-green-400">Role: {user.role}</span>
                    </div>
                  </div>
                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      key="profile"
                      onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-[#151f35] transition-colors text-left"
                    >
                      <UserCircle size={15} />
                      My Profile
                    </button>
                    <button
                      key="settings"
                      onClick={() => setProfileOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-[#151f35] transition-colors text-left"
                    >
                      <Settings size={15} />
                      Settings
                    </button>
                  </div>
                  <div className="border-t border-[#1a2540] py-2 px-4">
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-2 block">Switch Roles (Demo)</span>
                     <div className="space-y-1">
                       {["ADMIN", "NGO", "VOLUNTEER", "GIG_WORKER"].filter(r => r !== user.role).map((role) => (
                          <button
                            key={role}
                            onClick={() => { switchRole(role as Role); setProfileOpen(false); navigate('/'); }}
                            className="w-full flex items-center gap-2 px-2 py-1.5 text-[11px] text-slate-400 hover:text-white hover:bg-[#151f35] rounded transition-colors text-left"
                          >
                            <RefreshCw size={12} />
                            Switch to {role}
                          </button>
                       ))}
                     </div>
                  </div>
                  <div className="border-t border-[#1a2540] py-1">
                    <button
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
