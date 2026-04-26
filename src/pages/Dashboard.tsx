import { useState, useEffect } from "react";
import { Link } from "react-router";
import {
  AlertTriangle,
  Users,
  CheckCircle2,
  Trophy,
  ArrowUpRight,
  Clock,
  Cpu,
  TrendingUp,
  Zap,
  Radio,
} from "lucide-react";
import { MapView } from "../components/MapView";
import { tasks, volunteers, urgencyColors, categoryColors, inputMethodIcons } from "../data/mockData";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

const ingestData = [
  { time: "06:00", webhook: 2, nlp: 1, social: 0, ocr: 1 },
  { time: "07:00", webhook: 1, nlp: 3, social: 2, ocr: 0 },
  { time: "08:00", webhook: 4, nlp: 2, social: 3, ocr: 2 },
  { time: "09:00", webhook: 3, nlp: 5, social: 4, ocr: 1 },
  { time: "10:00", webhook: 5, nlp: 4, social: 2, ocr: 3 },
  { time: "11:00", webhook: 2, nlp: 6, social: 5, ocr: 1 },
  { time: "12:00", webhook: 3, nlp: 3, social: 3, ocr: 2 },
];

const urgencyDist = [
  { label: "U5 Critical", count: 3, color: "#ef4444" },
  { label: "U4 High", count: 2, color: "#f97316" },
  { label: "U3 Medium", count: 1, color: "#eab308" },
  { label: "U2 Low", count: 2, color: "#3b82f6" },
  { label: "U1 Minimal", count: 2, color: "#22c55e" },
];

const liveEvents = [
  { id: 1, time: "12:14", icon: "💬", text: "WhatsApp NLP parsed: 'Need water Sector 7'", color: "text-blue-400" },
  { id: 2, time: "12:11", icon: "🤖", text: "AI matched Raj Kumar to T-002 (98% score)", color: "text-purple-400" },
  { id: 3, time: "12:08", icon: "📡", text: "Social scrape: flood SOS detected — East Zone", color: "text-orange-400" },
  { id: 4, time: "12:05", icon: "✅", text: "T-010 verified on Polygon blockchain", color: "text-green-400" },
  { id: 5, time: "12:01", icon: "🏍️", text: "Dev Singh claimed T-001 — 1.4km away", color: "text-yellow-400" },
  { id: 6, time: "11:58", icon: "📷", text: "OCR: Paper form digitized from Block C", color: "text-cyan-400" },
  { id: 7, time: "11:55", icon: "⚡", text: "Auto-cluster: 6 reports merged → T-003 node", color: "text-red-400" },
];

const statCards = [
  { label: "Active Tasks", value: "7", delta: "+3 today", icon: AlertTriangle, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
  { label: "Deployed Resources", value: "5", delta: "4 volunteers, 1 gig", icon: Users, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
  { label: "Resolved Today", value: "12", delta: "↑ 3 vs yesterday", icon: CheckCircle2, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  { label: "Karma Issued", value: "1,800", delta: "+650 this session", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
];

function UrgencyBadge({ level }: { level: number }) {
  const color = urgencyColors[level as keyof typeof urgencyColors] || "#10b981";
  const labels: Record<number, string> = { 5: "CRITICAL", 4: "HIGH", 3: "MEDIUM", 2: "LOW", 1: "MINIMAL" };
  return (
    <span
      className="text-[10px] px-1.5 py-0.5 rounded"
      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40`, fontWeight: 700, letterSpacing: "0.05em" }}
    >
      {labels[level] || "UNKNOWN"}
    </span>
  );
}

export function Dashboard() {
  const [liveIndex, setLiveIndex] = useState(0);
  const [ingestCount, setIngestCount] = useState(247);

  useEffect(() => {
    const iv = setInterval(() => {
      setLiveIndex((i) => (i + 1) % liveEvents.length);
      setIngestCount((c) => c + Math.floor(Math.random() * 3));
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const criticalTasks = tasks
    .filter((t) => t.urgency >= 4 && t.status !== "Verified")
    .sort((a, b) => b.urgency - a.urgency)
    .slice(0, 5);

  return (
    <div className="p-4 space-y-4 h-full">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.bg} border ${s.border} flex items-start gap-3`}>
            <div className={`p-2 rounded-lg ${s.bg}`}>
              <s.icon size={18} className={s.color} />
            </div>
            <div>
              <div className={`text-2xl ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</div>
              <div className="text-xs text-slate-300">{s.label}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.delta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Map - takes 2 cols */}
        <div className="xl:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio size={14} className="text-green-400 animate-pulse" />
              <h2 className="text-sm text-white">Geospatial Command Map</h2>
              <span className="text-[10px] text-slate-500">— Live urgency nodes + volunteer tracking</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />
              WebSocket Connected
            </div>
          </div>
          <div className="min-h-[400px]">
            <MapView />
          </div>

          {/* Ingest chart */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-sm text-white">Omni-Ingestor Pipeline — Today</span>
              </div>
              <div className="text-xs text-slate-500">Total: <span className="text-blue-400" style={{ fontWeight: 600 }}>{ingestCount}</span> data points</div>
            </div>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={ingestData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d1221", border: "1px solid #1a2540", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#94a3b8", fontSize: 11 }}
                />
                <Area type="monotone" dataKey="webhook" stackId="1" stroke="#3b82f6" fill="#3b82f620" name="Webhook" />
                <Area type="monotone" dataKey="nlp" stackId="1" stroke="#8b5cf6" fill="#8b5cf620" name="WhatsApp NLP" />
                <Area type="monotone" dataKey="social" stackId="1" stroke="#f97316" fill="#f9731620" name="Social Scrape" />
                <Area type="monotone" dataKey="ocr" stackId="1" stroke="#22d3ee" fill="#22d3ee20" name="OCR" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2">
              {["Webhook/ODK", "WhatsApp NLP", "Social Scrape", "OCR"].map((m, i) => {
                const colors = ["#3b82f6", "#8b5cf6", "#f97316", "#22d3ee"];
                return (
                  <div key={m} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                    <span className="text-[10px] text-slate-500">{m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-3">
          {/* Live Event Feed */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4 flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-yellow-400" />
              <span className="text-sm text-white">Live Event Feed</span>
              <span className="ml-auto text-[10px] text-slate-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping inline-block" />
                streaming
              </span>
            </div>
            <div className="space-y-2.5 max-h-48 overflow-y-auto">
              {[...liveEvents.slice(liveIndex), ...liveEvents.slice(0, liveIndex)].map((ev, i) => (
                <div
                  key={ev.id}
                  className={`flex items-start gap-2 transition-all duration-700 ${i === 0 ? "opacity-100" : i === 1 ? "opacity-70" : "opacity-40"}`}
                >
                  <span className="text-sm mt-0.5">{ev.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${i === 0 ? ev.color : "text-slate-400"} leading-tight`}>{ev.text}</p>
                    <p className="text-[10px] text-slate-600 mt-0.5">{ev.time} AM</p>
                  </div>
                  {i === 0 && (
                    <span className="text-[9px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20 shrink-0">NEW</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Urgency Distribution */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={14} className="text-purple-400" />
              <span className="text-sm text-white">Urgency Distribution</span>
            </div>
            <ResponsiveContainer width="100%" height={90}>
              <BarChart data={urgencyDist} margin={{ top: 0, right: 0, bottom: 0, left: -30 }}>
                <XAxis dataKey="label" tick={{ fill: "#475569", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d1221", border: "1px solid #1a2540", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8", fontSize: 11 }}
                  itemStyle={{ fontSize: 11 }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {urgencyDist.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Critical Tasks */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-sm text-white">Priority Queue</span>
              </div>
              <Link to="/tasks" className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All tasks <ArrowUpRight size={11} />
              </Link>
            </div>
            <div className="space-y-2">
              {criticalTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-[#070b14] border border-[#1a2540] hover:border-[#253050] transition-colors"
                >
                  <div
                    className="w-1.5 h-full min-h-8 rounded-full mt-0.5 shrink-0"
                    style={{ backgroundColor: urgencyColors[task.urgency as keyof typeof urgencyColors] || "#10b981" }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <UrgencyBadge level={task.urgency} />
                      <span className="text-[10px]">{inputMethodIcons[task.inputMethod] || ""}</span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-tight truncate">{task.title}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Clock size={10} className="text-slate-600" />
                      <span className="text-[10px] text-slate-600">{task.location}</span>
                    </div>
                  </div>
                  {task.assignedTo && (
                    <div className="shrink-0 text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                      Matched
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
