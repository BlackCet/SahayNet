import { useState } from "react";
import {
  MapPin,
  Clock,
  Zap,
  Bell,
  CheckCircle2,
  Navigation,
  Trophy,
  Filter,
  Award,
} from "lucide-react";
import { tasks, urgencyColors, inputMethodIcons } from "../data/mockData";

const bountyPoints: Record<number, number> = { 5: 300, 4: 200, 3: 120, 2: 80, 1: 40 };
const distanceKm = [0.8, 1.4, 2.1, 2.8, 1.1, 3.2, 1.7, 0.5, 2.4, 1.9];

export function BountyBoard() {
  const [claimedIds, setClaimedIds] = useState<string[]>([]);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<string>("All");
  const [driverRadius] = useState(3);
  const [upvotedIds, setUpvotedIds] = useState<string[]>([]);
  const [upvoteCounts, setUpvoteCounts] = useState<Record<string, number>>(
    Object.fromEntries(tasks.map((t) => [t.id, t.upvotes]))
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

  const availableTasks = tasks
    .filter((t) => t.status === "Pending")
    .filter((t) => filterUrgency === "All" || t.urgency === Number(filterUrgency));

  const handleClaim = (id: string) => {
    setClaimingId(id);
    setTimeout(() => {
      setClaimedIds((prev) => [...prev, id]);
      setClaimingId(null);
    }, 1500);
  };

  const urgentBroadcast = tasks.filter((t) => t.urgency === 5 && t.status === "Pending");

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <Award size={20} className="text-yellow-400" />
          </div>
          <div>
            <h1 className="text-white text-2xl font-bold">Bounty Board</h1>
            <p className="text-sm text-slate-500 mt-0.5">Hyper-local micro-tasks for gig workers — zero-detour route matching within {driverRadius}km</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-500" />
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value)}
            className="text-xs bg-[#0d1221] border border-[#1a2540] rounded-lg text-slate-300 py-2 px-3 focus:outline-none"
          >
            <option value="All">All Urgency</option>
            {[5, 4, 3, 2, 1].map((u) => <option key={u} value={u}>U{u} Only</option>)}
          </select>
        </div>
      </div>

      {/* Broadcast notifications for U5 tasks */}
      {urgentBroadcast.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-red-400 animate-bounce" />
            <span className="text-sm text-red-400" style={{ fontWeight: 700 }}>URGENT BROADCAST — All drivers within 3km</span>
          </div>
          <div className="space-y-2">
            {urgentBroadcast.map((task) => (
              <div key={task.id} className="flex items-center gap-3 bg-[#070b14] rounded-lg p-3 border border-red-900/30">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <div className="flex-1 text-xs text-slate-300">
                  <span className="text-red-400" style={{ fontWeight: 600 }}>{task.title}</span>
                  <span className="text-slate-500"> — {task.location}</span>
                </div>
                <span className="text-[11px] text-yellow-400" style={{ fontWeight: 600 }}>+{bountyPoints[task.urgency]} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Driver status bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Your Karma", value: "2,100", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
          { label: "Radius", value: `${driverRadius} km`, icon: Navigation, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
          { label: "Tasks Nearby", value: availableTasks.length.toString(), icon: MapPin, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
          { label: "Claimed Today", value: claimedIds.length.toString(), icon: CheckCircle2, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl p-3 ${s.bg} border ${s.border} flex items-center gap-3`}>
            <s.icon size={18} className={s.color} />
            <div>
              <div className={`text-lg ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Task Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableTasks.map((task, idx) => {
          const isClaimed = claimedIds.includes(task.id);
          const isClaiming = claimingId === task.id;
          const pts = bountyPoints[task.urgency];
          const dist = distanceKm[idx % distanceKm.length];
          const urgColor = urgencyColors[task.urgency as keyof typeof urgencyColors];
          const isZeroDetour = task.category === "Micro-Task";

          return (
            <div
              key={task.id}
              className={`relative rounded-xl border overflow-hidden transition-all ${
                isClaimed
                  ? "border-green-500/30 bg-green-500/5"
                  : task.urgency === 5
                  ? "border-red-500/30 bg-[#0d1221]"
                  : "border-[#1a2540] bg-[#0d1221]"
              }`}
            >
              {/* Urgency strip */}
              <div className="h-1 w-full" style={{ backgroundColor: urgColor }} />

              {/* Zero-detour badge */}
              {isZeroDetour && !isClaimed && (
                <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full border border-green-400/20">
                  <Zap size={9} />
                  Zero-Detour
                </div>
              )}

              <div className="p-4">
                {/* Title + urgency */}
                <div className="flex items-start gap-2 mb-3">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ color: urgColor, backgroundColor: `${urgColor}20`, border: `1px solid ${urgColor}40`, fontWeight: 700 }}
                  >
                    U{task.urgency}
                  </span>
                  <h4 className="text-sm text-white leading-tight" style={{ fontWeight: 600 }}>{task.title}</h4>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">{task.description}</p>

                {/* Meta info */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <MapPin size={10} className="text-slate-600" />
                    {task.location}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Navigation size={10} className="text-blue-400" />
                    <span className="text-blue-400">{dist} km away</span>
                    <span>•</span>
                    <span>{inputMethodIcons[task.inputMethod]} {task.inputMethod}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <Clock size={10} />
                    {new Date(task.timestamp).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                    <span>•</span>
                    <button
                      onClick={(e) => handleUpvote(e, task.id)}
                      className={`flex items-center gap-1 transition-colors ${
                        upvotedIds.includes(task.id) ? "text-orange-400" : "text-slate-500 hover:text-orange-400"
                      }`}
                    >
                      👍 {upvoteCounts[task.id]}
                    </button>
                  </div>
                </div>

                {/* Points + Claim */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-1.5">
                    <Trophy size={14} className="text-yellow-400" />
                    <span className="text-yellow-400" style={{ fontWeight: 700 }}>+{pts} Karma</span>
                  </div>
                  {isClaimed ? (
                    <div className="flex items-center gap-1.5 text-sm text-green-400" style={{ fontWeight: 600 }}>
                      <CheckCircle2 size={16} />
                      Claimed!
                    </div>
                  ) : (
                    <button
                      onClick={() => handleClaim(task.id)}
                      disabled={isClaiming}
                      className={`px-4 py-2 rounded-lg text-xs transition-all ${
                        task.urgency === 5
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30"
                      } disabled:opacity-50`}
                      style={{ fontWeight: 600 }}
                    >
                      {isClaiming ? (
                        <span className="flex items-center gap-1.5">
                          <Clock size={12} className="animate-spin" />
                          Claiming...
                        </span>
                      ) : (
                        "Claim Task"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {availableTasks.length === 0 && (
        <div className="text-center py-16 text-slate-600">
          <Award size={32} className="mx-auto mb-3 opacity-30" />
          <p>No tasks available in your radius. Check back soon!</p>
        </div>
      )}
    </div>
  );
}
