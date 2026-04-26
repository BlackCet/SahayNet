import { useState } from "react";
import { volunteers, tasks, urgencyColors, categoryColors } from "../data/mockData";
import {
  Brain,
  MapPin,
  Star,
  Car,
  Languages,
  CheckCircle2,
  Clock,
  Send,
  Cpu,
  Zap,
  ChevronRight,
} from "lucide-react";

const statusColor: Record<string, string> = {
  Available: "#22c55e",
  "On Task": "#3b82f6",
  Offline: "#64748b",
};

const statusBg: Record<string, string> = {
  Available: "#22c55e20",
  "On Task": "#3b82f620",
  Offline: "#64748b20",
};

export function VolunteerMatching() {
  const [selectedTask, setSelectedTask] = useState(tasks.find(t => t.status === "Pending" && t.urgency >= 4) ?? tasks[0]);
  const [dispatching, setDispatching] = useState<string | null>(null);
  const [dispatched, setDispatched] = useState<string[]>([]);

  const dispatchable = tasks.filter((t) => t.status === "Pending" || t.status === "Matched");

  const ranked = volunteers
    .filter((v) => v.status !== "Offline")
    .map((v) => ({
      ...v,
      score: v.matchScore ?? Math.floor(60 + Math.random() * 35),
    }))
    .sort((a, b) => b.score - a.score);

  const handleDispatch = (volunteerId: string, volunteerName: string) => {
    setDispatching(volunteerId);
    setTimeout(() => {
      setDispatching(null);
      setDispatched((prev) => [...prev, volunteerId]);
    }, 2000);
  };

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-purple-500/20 border border-purple-500/30">
          <Brain size={20} className="text-purple-400" />
        </div>
        <div>
          <h1 className="text-white text-2xl font-bold">Volunteer Matching & Smart Dispatch</h1>
          <p className="text-sm text-slate-500 mt-0.5">Agentic RAG system — volunteer profiles are vector embeddings matched semantically to task context</p>
        </div>
      </div>

      {/* AI Pipeline indicator */}
      <div className="flex items-center gap-2 flex-wrap">
        {["Task Context", "Vector Embedding", "Pinecone RAG Query", "Semantic Score", "Ranked Results", "Dispatch"].map((step, i, arr) => (
          <div key={step} className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0d1221] border border-[#1a2540] text-[11px] text-slate-400">
              {i === 2 && <Cpu size={10} className="text-purple-400" />}
              {i === 3 && <Star size={10} className="text-yellow-400" />}
              {step}
            </div>
            {i < arr.length - 1 && <ChevronRight size={12} className="text-slate-700 shrink-0" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Task selector */}
        <div className="xl:col-span-1 space-y-3">
          <h3 className="text-sm text-slate-300">Select Task to Match</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {dispatchable.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  selectedTask?.id === task.id
                    ? "border-purple-500/50 bg-purple-500/10"
                    : "border-[#1a2540] bg-[#0d1221] hover:border-[#253050]"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      color: urgencyColors[task.urgency as keyof typeof urgencyColors] || "#10b981",
                      backgroundColor: `${urgencyColors[task.urgency as keyof typeof urgencyColors] || "#10b981"}20`,
                      border: `1px solid ${urgencyColors[task.urgency as keyof typeof urgencyColors] || "#10b981"}40`,
                      fontWeight: 700,
                    }}
                  >
                    U{task.urgency}
                  </span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      color: categoryColors[task.category] || "#10b981",
                      backgroundColor: `${categoryColors[task.category] || "#10b981"}20`,
                      fontWeight: 600,
                    }}
                  >
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-white leading-tight">{task.title}</p>
                <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin size={9} />{task.location}
                </p>
              </button>
            ))}
          </div>

          {/* Selected task card */}
          {selectedTask && (
            <div className="bg-[#070b14] border border-purple-500/20 rounded-xl p-4">
              <div className="text-[10px] text-purple-400 mb-2" style={{ letterSpacing: "0.08em", fontWeight: 700 }}>
                RAG QUERY CONTEXT
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedTask.description}</p>
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-600">
                <Cpu size={10} className="text-purple-400" />
                Querying Pinecone vector space...
              </div>
            </div>
          )}
        </div>

        {/* Ranked volunteers */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm text-slate-300">AI-Ranked Volunteer Matches</h3>
            <span className="text-[10px] text-slate-600">— sorted by semantic match score</span>
          </div>
          <div className="space-y-3">
            {ranked.map((vol, idx) => {
              const isDispatching = dispatching === vol.id;
              const isDispatched = dispatched.includes(vol.id);
              return (
                <div
                  key={vol.id}
                  className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4 hover:border-[#253050] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank + score */}
                    <div className="shrink-0 text-center">
                      <div className="text-xs text-slate-600">#{idx + 1}</div>
                      <div
                        className="w-14 h-14 rounded-xl flex flex-col items-center justify-center border mt-1"
                        style={{
                          borderColor: vol.score >= 90 ? "#22c55e40" : vol.score >= 75 ? "#3b82f640" : "#64748b40",
                          backgroundColor: vol.score >= 90 ? "#22c55e10" : vol.score >= 75 ? "#3b82f610" : "#64748b10",
                        }}
                      >
                        <span
                          className="text-lg"
                          style={{
                            fontWeight: 800,
                            color: vol.score >= 90 ? "#22c55e" : vol.score >= 75 ? "#3b82f6" : "#94a3b8",
                          }}
                        >
                          {vol.score}
                        </span>
                        <span className="text-[9px] text-slate-500">match</span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-sm text-white" style={{ fontWeight: 600 }}>{vol.name}</span>
                        {vol.isGigWorker && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-400/10 text-yellow-400 border border-yellow-400/20">
                            {vol.platform}
                          </span>
                        )}
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{
                            color: statusColor[vol.status] || "#10b981",
                            backgroundColor: statusBg[vol.status] || "#10b98120",
                            fontWeight: 600,
                          }}
                        >
                          {vol.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                        <div className="flex items-start gap-1.5">
                          <Star size={11} className="text-yellow-400 mt-0.5 shrink-0" />
                          <div className="text-[11px] text-slate-400">
                            <div className="text-slate-500 text-[10px]">Skills</div>
                            {vol.skills.slice(0, 2).join(", ")}
                            {vol.skills.length > 2 && <span className="text-slate-600"> +{vol.skills.length - 2}</span>}
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Languages size={11} className="text-blue-400 mt-0.5 shrink-0" />
                          <div className="text-[11px] text-slate-400">
                            <div className="text-slate-500 text-[10px]">Languages</div>
                            {vol.languages.join(", ")}
                          </div>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <Car size={11} className="text-cyan-400 mt-0.5 shrink-0" />
                          <div className="text-[11px] text-slate-400">
                            <div className="text-slate-500 text-[10px]">Vehicle</div>
                            {vol.vehicleType}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-[11px] text-slate-600">
                          <CheckCircle2 size={10} />
                          {vol.completedTasks} tasks done
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-600">
                          <MapPin size={10} />
                          {vol.locationString}
                        </div>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="shrink-0">
                      {isDispatched ? (
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                            <CheckCircle2 size={18} className="text-green-400" />
                          </div>
                          <span className="text-[10px] text-green-400">Dispatched</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleDispatch(vol.id, vol.name)}
                          disabled={isDispatching || vol.status === "On Task"}
                          className="flex flex-col items-center gap-1 group"
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            vol.status === "On Task"
                              ? "bg-slate-800 border border-slate-700 cursor-not-allowed"
                              : "bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 hover:border-blue-500/60"
                          }`}>
                            {isDispatching ? (
                              <Clock size={16} className="text-blue-400 animate-spin" />
                            ) : (
                              <Send size={16} className={vol.status === "On Task" ? "text-slate-600" : "text-blue-400"} />
                            )}
                          </div>
                          <span className={`text-[10px] ${vol.status === "On Task" ? "text-slate-600" : "text-blue-400"}`}>
                            {isDispatching ? "Sending..." : vol.status === "On Task" ? "Busy" : "Dispatch"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Match reason */}
                  {idx === 0 && (
                    <div className="mt-3 border-t border-[#1a2540] pt-3 flex items-center gap-2 text-[11px] text-purple-400">
                      <Zap size={11} />
                      Top match: Vehicle type matches terrain requirement. Languages include task-required dialect.
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
