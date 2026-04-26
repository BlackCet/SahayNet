import { useState } from "react";
import { karmaRecords, volunteers } from "../data/mockData";
import { Trophy, Star, Zap, Gift, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const rewardOptions = [
  { id: "fuel", label: "Fuel Voucher", value: "₹200", cost: 80, icon: "⛽", desc: "Redeemable at BPCL / HP stations" },
  { id: "tier", label: "Tier Upgrade", value: "Gold", cost: 200, icon: "🏅", desc: "Priority dispatch in Rapido/Zomato" },
  { id: "priority", label: "Platform Priority", value: "7 Days", cost: 150, icon: "⚡", desc: "Jump the queue for premium orders" },
  { id: "cashback", label: "Cashback", value: "₹100", cost: 120, icon: "💸", desc: "Direct wallet credit" },
];

const leaderboard = [...volunteers]
  .sort((a, b) => (b.karmaPoints || 0) - (a.karmaPoints || 0))
  .slice(0, 8);

const chartData = leaderboard.slice(0, 6).map((v) => ({
  name: v.name.split(" ")[0],
  points: v.karmaPoints,
  isGig: v.isGigWorker,
}));

const barColors = ["#facc15", "#f97316", "#3b82f6", "#8b5cf6", "#22c55e", "#22d3ee"];

export function KarmaLedger() {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [redeemed, setRedeemed] = useState<string[]>([]);

  const myPoints = 2100; // Dev Singh simulation
  const myVolunteer = volunteers.find((v) => v.id === "V-005")!;

  const handleRedeem = (id: string) => {
    setRedeeming(id);
    setTimeout(() => {
      setRedeemed((prev) => [...prev, id]);
      setRedeeming(null);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
          <Trophy size={20} className="text-yellow-400" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Karma Ledger</h1>
          <p className="text-sm text-slate-500 mt-0.5">Every completed micro-task earns Karma points redeemable for gig-app perks via CSR API partnerships</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* My Karma Profile */}
        <div className="xl:col-span-1 space-y-4">
          {/* Karma card */}
          <div className="relative bg-gradient-to-br from-yellow-900/30 to-orange-900/20 border border-yellow-500/30 rounded-2xl p-5 overflow-hidden">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle at 80% 20%, #facc15 0%, transparent 60%)",
            }} />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/30 flex items-center justify-center text-lg">
                  🏍️
                </div>
                <div>
                  <div className="text-sm text-white" style={{ fontWeight: 600 }}>{myVolunteer?.name}</div>
                  <div className="text-[11px] text-yellow-400/80">{myVolunteer?.platform} · {myVolunteer?.vehicleType}</div>
                </div>
              </div>
              <div className="text-4xl text-yellow-400 mb-1" style={{ fontWeight: 800 }}>
                {myPoints.toLocaleString()}
              </div>
              <div className="text-xs text-yellow-400/60">Total Karma Points</div>
              <div className="mt-3 flex gap-3 text-[11px] text-slate-400">
                <div><span className="text-white" style={{ fontWeight: 600 }}>{myVolunteer?.completedTasks}</span> tasks done</div>
                <div>|</div>
                <div><span className="text-white" style={{ fontWeight: 600 }}>3</span> redeemed</div>
              </div>

              {/* Progress to next tier */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                  <span>Gold Tier</span>
                  <span>{myPoints}/2500 → Platinum</span>
                </div>
                <div className="h-1.5 bg-[#0d1221] rounded-full">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-orange-400"
                    style={{ width: `${(myPoints / 2500) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Redeem rewards */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={14} className="text-purple-400" />
              <span className="text-sm text-white">Redeem Points</span>
            </div>
            <div className="space-y-2">
              {rewardOptions.map((r) => {
                const canAfford = myPoints >= r.cost;
                const isRedeeming = redeeming === r.id;
                const isRedeemed = redeemed.includes(r.id);
                return (
                  <div
                    key={r.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isRedeemed
                        ? "border-green-500/30 bg-green-500/5"
                        : canAfford
                        ? "border-[#1a2540] hover:border-purple-500/30 bg-[#070b14]"
                        : "border-[#1a2540] bg-[#070b14] opacity-50"
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-white" style={{ fontWeight: 600 }}>{r.label} — {r.value}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{r.desc}</div>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] text-yellow-400">{r.cost} pts</span>
                      {isRedeemed ? (
                        <CheckCircle2 size={16} className="text-green-400" />
                      ) : (
                        <button
                          onClick={() => handleRedeem(r.id)}
                          disabled={!canAfford || isRedeeming}
                          className="text-[10px] px-2 py-1 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 hover:bg-purple-600/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ fontWeight: 600 }}
                        >
                          {isRedeeming ? <Clock size={10} className="animate-spin" /> : "Redeem"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right - Leaderboard + History */}
        <div className="xl:col-span-2 space-y-4">
          {/* Bar chart */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={14} className="text-yellow-400" />
              <span className="text-sm text-white">Top Earners — All Time</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#475569", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d1221", border: "1px solid #1a2540", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8", fontSize: 11 }}
                  itemStyle={{ fontSize: 11 }}
                  formatter={(val: any) => [`${val} pts`, "Karma"]}
                />
                <Bar dataKey="points" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, i) => (
                    <Cell key={i} fill={barColors[i] ?? "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Leaderboard */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Star size={14} className="text-yellow-400" />
              <span className="text-sm text-white">Global Leaderboard</span>
            </div>
            <div className="space-y-2">
              {leaderboard.map((vol, idx) => (
                <div key={vol.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#070b14] transition-colors">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                    idx === 0 ? "bg-yellow-500/30 text-yellow-400" :
                    idx === 1 ? "bg-slate-400/20 text-slate-300" :
                    idx === 2 ? "bg-orange-700/30 text-orange-400" :
                    "bg-[#0d1221] text-slate-500"
                  }`} style={{ fontWeight: 700 }}>
                    {idx < 3 ? ["🥇","🥈","🥉"][idx] : `#${idx + 1}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white" style={{ fontWeight: vol.id === "V-005" ? 700 : 400 }}>{vol.name}</span>
                      {vol.isGigWorker && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">{vol.platform}</span>
                      )}
                      {vol.id === "V-005" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-400/10 text-blue-400 border border-blue-400/20">You</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-600 mt-0.5">{vol.completedTasks} tasks · {vol.locationString}</div>
                  </div>
                  <div className="shrink-0 flex items-center gap-1.5">
                    <Zap size={12} className="text-yellow-400" />
                    <span className="text-sm text-yellow-400" style={{ fontWeight: 700 }}>{vol.karmaPoints?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction history */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-blue-400" />
              <span className="text-sm text-white">Transaction History</span>
            </div>
            <div className="space-y-2">
              {karmaRecords.map((rec) => (
                <div key={rec.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#070b14] border border-[#1a2540]">
                  <div className={`p-1.5 rounded-lg ${rec.redeemed ? "bg-purple-500/20" : "bg-green-500/20"}`}>
                    {rec.redeemed ? <Gift size={12} className="text-purple-400" /> : <Zap size={12} className="text-green-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-white truncate">{rec.taskTitle}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {rec.volunteerName} · {new Date(rec.timestamp).toLocaleDateString("en-IN")}
                      {rec.redeemed && <span className="text-purple-400 ml-2">→ {rec.redemptionType}</span>}
                    </div>
                  </div>
                  <div className={`text-sm shrink-0 ${rec.redeemed ? "text-slate-500 line-through" : "text-green-400"}`} style={{ fontWeight: 700 }}>
                    {rec.points > 0 ? "+" + rec.points : rec.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
