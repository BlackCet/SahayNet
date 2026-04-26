import { useState } from "react";
import React from "react";
import {
  Search,
  Filter,
  ThumbsUp,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { tasks as initialTasks, urgencyColors, categoryColors, inputMethodIcons, TaskCategory } from "../data/mockData";

const statusColors: Record<string, string> = {
  Pending: "#64748b",
  Matched: "#8b5cf6",
  "In Progress": "#3b82f6",
  Completed: "#22c55e",
  Verified: "#22c55e",
};

const statusBg: Record<string, string> = {
  Pending: "#64748b20",
  Matched: "#8b5cf620",
  "In Progress": "#3b82f620",
  Completed: "#22c55e20",
  Verified: "#22c55e20",
};

function UrgencyBadge({ level }: { level: number }) {
  const color = urgencyColors[level as keyof typeof urgencyColors];
  const labels: Record<number, string> = { 5: "U5 CRITICAL", 4: "U4 HIGH", 3: "U3 MEDIUM", 2: "U2 LOW", 1: "U1 MINIMAL" };
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40`, fontWeight: 700 }}
    >
      {labels[level]}
    </span>
  );
}

function CategoryBadge({ category }: { category: TaskCategory }) {
  const color = categoryColors[category];
  return (
    <span
      className="text-[10px] px-2 py-0.5 rounded-full"
      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}40`, fontWeight: 600 }}
    >
      {category}
    </span>
  );
}

export function TaskManagement() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterUrgency, setFilterUrgency] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"urgency" | "time" | "upvotes">("urgency");
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>(
    Object.fromEntries(initialTasks.map((t) => [t.id, t.upvotes]))
  );

  const handleUpvote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (upvotedIds.includes(id)) {
      setUpvotedIds((prev) => prev.filter((v) => v !== id));
      setUpvoteCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    } else {
      setUpvotedIds((prev) => [...prev, id]);
      setUpvoteCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
  };

  const tasks = initialTasks.map((t) => ({ ...t, upvotes: upvoteCounts[t.id] ?? t.upvotes }));

  const filtered = tasks
    .filter((t) => {
      const s = search.toLowerCase();
      return (
        (t.title.toLowerCase().includes(s) || t.location.toLowerCase().includes(s) || t.id.toLowerCase().includes(s)) &&
        (filterCategory === "All" || t.category === filterCategory) &&
        (filterStatus === "All" || t.status === filterStatus) &&
        (filterUrgency === "All" || t.urgency === Number(filterUrgency))
      );
    })
    .sort((a, b) => {
      if (sortBy === "urgency") return b.urgency - a.urgency;
      if (sortBy === "upvotes") return b.upvotes - a.upvotes;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  const categories = ["All", "Critical Resource", "Infrastructure", "Skill-Based", "Micro-Task"];
  const statuses = ["All", "Pending", "Matched", "In Progress", "Completed", "Verified"];

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-white">Task Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">All ingested needs — {tasks.length} total, {tasks.filter(t => t.status === "Pending").length} pending dispatch</p>
        </div>
        <div className="flex gap-2">
          {["urgency", "time", "upvotes"].map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s as any)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors capitalize ${
                sortBy === s
                  ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                  : "bg-[#0d1221] text-slate-400 border-[#1a2540] hover:border-[#253050]"
              }`}
            >
              Sort: {s}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search tasks, locations, IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#0d1221] border border-[#1a2540] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="text-xs bg-[#0d1221] border border-[#1a2540] rounded-lg text-slate-300 py-2 px-3 focus:outline-none focus:border-blue-500/50"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs bg-[#0d1221] border border-[#1a2540] rounded-lg text-slate-300 py-2 px-3 focus:outline-none focus:border-blue-500/50"
          >
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="text-xs bg-[#0d1221] border border-[#1a2540] rounded-lg text-slate-300 py-2 px-3 focus:outline-none focus:border-blue-500/50"
          >
            <option value="All">All Urgency</option>
            {[5, 4, 3, 2, 1].map((u) => <option key={u} value={u}>U{u}</option>)}
          </select>
        </div>

        <div className="ml-auto text-xs text-slate-500">{filtered.length} results</div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {filtered.map((task) => (
          <div
            key={task.id}
            className="bg-[#0d1221] border border-[#1a2540] rounded-xl overflow-hidden hover:border-[#253050] transition-colors"
          >
            {/* Main row */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer"
              onClick={() => setExpandedId(expandedId === task.id ? null : task.id)}
            >
              {/* Urgency bar */}
              <div
                className="w-1 h-12 rounded-full shrink-0"
                style={{ backgroundColor: urgencyColors[task.urgency] }}
              />

              {/* ID */}
              <div className="text-xs text-slate-600 shrink-0 w-14 font-mono">{task.id}</div>

              {/* Title + badges */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <UrgencyBadge level={task.urgency} />
                  <CategoryBadge category={task.category} />
                  <span className="text-sm">{inputMethodIcons[task.inputMethod]}</span>
                  <span className="text-[10px] text-slate-600">{task.inputMethod}</span>
                </div>
                <p className="text-sm text-white truncate">{task.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <MapPin size={10} />
                    {task.location}
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock size={10} />
                    {new Date(task.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              {/* Upvotes */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleUpvote(e, task.id)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all ${
                    upvotedIds.includes(task.id)
                      ? "bg-orange-500/20 border-orange-500/40 text-orange-400"
                      : "bg-[#070b14] border-[#1a2540] text-slate-500 hover:border-orange-500/30 hover:text-orange-400"
                  }`}
                >
                  <ThumbsUp size={12} />
                  <span className="text-sm">{upvoteCounts[task.id]}</span>
                </button>
              </div>

              {/* Status */}
              <div
                className="shrink-0 text-xs px-3 py-1 rounded-full"
                style={{
                  color: statusColors[task.status],
                  backgroundColor: statusBg[task.status],
                  border: `1px solid ${statusColors[task.status]}40`,
                  fontWeight: 600,
                }}
              >
                {task.status}
              </div>

              {/* Expand toggle */}
              <div className="shrink-0 text-slate-500">
                {expandedId === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>

            {/* Expanded details */}
            {expandedId === task.id && (
              <div className="border-t border-[#1a2540] p-4 bg-[#070b14] grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <h4 className="text-xs text-slate-500 mb-1" style={{ letterSpacing: "0.1em" }}>DESCRIPTION</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">{task.description}</p>
                  {task.assignedTo && (
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">Assigned to:</span>
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20" style={{ fontWeight: 600 }}>
                        {task.assignedTo}
                      </span>
                    </div>
                  )}
                  {task.clusterCount && task.clusterCount > 1 && (
                    <div className="mt-2 text-xs text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-lg border border-yellow-400/20 inline-flex items-center gap-2">
                      <span>🔗</span>
                      AI auto-clustered {task.clusterCount} duplicate reports into this node
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  {task.blockchainHash && (
                    <div className="bg-[#0d1221] rounded-lg p-3 border border-green-900/30">
                      <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>BLOCKCHAIN HASH</div>
                      <div className="text-[10px] text-green-400 font-mono break-all">{task.blockchainHash}...</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-green-400">
                        <span>✓</span> Verified on Polygon
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1 text-xs text-slate-500">
                    <div>Task ID: <span className="text-slate-300 font-mono">{task.id}</span></div>
                    <div>Ingested via: <span className="text-slate-300">{task.inputMethod}</span></div>
                    <div>GPS: <span className="text-slate-300">({task.mapX}°N, {task.mapY}°E approx.)</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
