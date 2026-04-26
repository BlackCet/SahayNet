import { useState } from "react";
import { blockchainRecords, tasks } from "../data/mockData";
import {
  Shield,
  Link,
  CheckCircle2,
  Clock,
  MapPin,
  Camera,
  ExternalLink,
  Search,
  Lock,
  Eye,
  Hash,
} from "lucide-react";

function HashDisplay({ hash }: { hash: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 font-mono text-[11px] text-green-400 bg-green-400/5 border border-green-400/20 rounded-lg px-3 py-1.5 hover:bg-green-400/10 transition-colors group w-full"
      title="Click to copy"
    >
      <Hash size={11} className="shrink-0" />
      <span className="truncate">{hash}</span>
      <span className="ml-auto shrink-0 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
}

export function Transparency() {
  const [search, setSearch] = useState("");
  const [selectedHash, setSelectedHash] = useState<string | null>(null);

  const filtered = blockchainRecords.filter(
    (r) =>
      r.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      r.volunteerName.toLowerCase().includes(search.toLowerCase()) ||
      r.hash.includes(search)
  );

  const selectedRecord = blockchainRecords.find((r) => r.hash === selectedHash);

  const stats = [
    { label: "Total Tasks Hashed", value: blockchainRecords.length, icon: Hash, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
    { label: "Verified", value: blockchainRecords.filter(r => r.verificationStatus === "Verified").length, icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
    { label: "Public Records", value: blockchainRecords.filter(r => r.donorVisible).length, icon: Eye, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
    { label: "Network", value: "Polygon", icon: Link, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-xl bg-green-500/20 border border-green-500/30">
          <Shield size={20} className="text-green-400" />
        </div>
        <div>
          <h1 className="text-white">Public Traceability Portal</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Blockchain-verified proof of impact. Every completed task is hashed onto Polygon — donors can verify GPS, photo, and timestamp.
          </p>
        </div>
      </div>

      {/* Trust explanation */}
      <div className="bg-gradient-to-r from-green-900/20 to-cyan-900/20 border border-green-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Lock size={14} className="text-green-400" />
          <span className="text-sm text-green-400" style={{ fontWeight: 600 }}>How Blockchain Trust Works</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: "1", icon: "✅", title: "Task Verified", desc: "AI vision model analyzes before/after photo + GPS metadata" },
            { step: "2", icon: "🔐", title: "Hash Generated", desc: "Cryptographic hash of task data, photo, timestamp, and GPS" },
            { step: "3", icon: "⛓️", title: "Polygon Ledger", desc: "Hash written to Polygon blockchain — immutable, tamper-proof" },
            { step: "4", icon: "👁️", title: "Public Portal", desc: "Donors verify deployment with full transparency, defeating mistrust" },
          ].map((s) => (
            <div key={s.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-xs text-green-400 shrink-0" style={{ fontWeight: 700 }}>
                {s.step}
              </div>
              <div>
                <div className="text-sm text-white">{s.icon} {s.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-4 ${s.bg} border ${s.border} flex items-center gap-3`}>
            <s.icon size={18} className={s.color} />
            <div>
              <div className={`text-xl ${s.color}`} style={{ fontWeight: 700 }}>{s.value}</div>
              <div className="text-[11px] text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Records list */}
        <div className="xl:col-span-2 space-y-4">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by task, volunteer, or hash..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-[#0d1221] border border-[#1a2540] rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-green-500/50"
            />
          </div>

          <div className="space-y-3">
            {filtered.map((rec) => (
              <div
                key={rec.id}
                className={`bg-[#0d1221] border rounded-xl p-5 cursor-pointer hover:border-green-500/30 transition-all ${
                  selectedHash === rec.hash ? "border-green-500/50 bg-green-500/5" : "border-[#1a2540]"
                }`}
                onClick={() => setSelectedHash(selectedHash === rec.hash ? null : rec.hash)}
              >
                <div className="flex items-start gap-4">
                  {/* Status icon */}
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    rec.verificationStatus === "Verified" ? "bg-green-500/20 border border-green-500/30" : "bg-yellow-500/20 border border-yellow-500/30"
                  }`}>
                    {rec.verificationStatus === "Verified" ? (
                      <CheckCircle2 size={18} className="text-green-400" />
                    ) : (
                      <Clock size={18} className="text-yellow-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="text-sm text-white" style={{ fontWeight: 600 }}>{rec.taskTitle}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          rec.verificationStatus === "Verified"
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                        }`}
                        style={{ fontWeight: 600 }}
                      >
                        {rec.verificationStatus}
                      </span>
                      {rec.donorVisible && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full text-blue-400 bg-blue-400/10 border border-blue-400/20">
                          Public
                        </span>
                      )}
                    </div>

                    {/* Hash */}
                    <HashDisplay hash={rec.hash} />

                    <div className="flex flex-wrap gap-4 mt-2.5 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <span>👤</span>
                        {rec.volunteerName}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        {rec.gpsMetadata}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(rec.timestamp).toLocaleString("en-IN")}
                      </div>
                      {rec.photo && (
                        <div className="flex items-center gap-1 text-cyan-400">
                          <Camera size={10} />
                          Photo verified
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    className="shrink-0 p-2 rounded-lg bg-[#070b14] border border-[#1a2540] hover:border-green-500/30 transition-colors"
                    title="View on blockchain explorer"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(`https://polygonscan.com/tx/${rec.hash}`, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <ExternalLink size={14} className="text-slate-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Panel */}
        <div className="xl:col-span-1 space-y-4">
          {selectedRecord ? (
            <div className="bg-[#0d1221] border border-green-500/30 rounded-xl overflow-hidden sticky top-4">
              <div className="px-4 py-3 bg-green-500/10 border-b border-green-500/20 flex items-center gap-2">
                <Shield size={14} className="text-green-400" />
                <span className="text-sm text-green-400" style={{ fontWeight: 600 }}>Verification Details</span>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>TASK</div>
                  <div className="text-sm text-white">{selectedRecord.taskTitle}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>BLOCKCHAIN HASH</div>
                  <div className="font-mono text-[11px] text-green-400 break-all leading-relaxed">{selectedRecord.hash}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>NETWORK</div>
                  <div className="flex items-center gap-2 text-sm text-white">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    Polygon Mainnet
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>GPS METADATA</div>
                  <div className="text-sm text-cyan-400">{selectedRecord.gpsMetadata}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>COMPLETED BY</div>
                  <div className="text-sm text-white">{selectedRecord.volunteerName}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 mb-1" style={{ letterSpacing: "0.08em" }}>TIMESTAMP</div>
                  <div className="text-sm text-white">{new Date(selectedRecord.timestamp).toLocaleString("en-IN")}</div>
                </div>
                {selectedRecord.photo && (
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-3 flex items-center gap-2">
                    <Camera size={14} className="text-cyan-400" />
                    <div>
                      <div className="text-xs text-cyan-400" style={{ fontWeight: 600 }}>AI-Verified Photo</div>
                      <div className="text-[10px] text-slate-500">Gemini Vision analyzed before/after</div>
                    </div>
                  </div>
                )}
                <div className={`rounded-xl p-3 flex items-center gap-2 ${
                  selectedRecord.verificationStatus === "Verified"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-yellow-500/10 border border-yellow-500/20"
                }`}>
                  {selectedRecord.verificationStatus === "Verified" ? (
                    <>
                      <CheckCircle2 size={16} className="text-green-400" />
                      <div className="text-xs text-green-400" style={{ fontWeight: 600 }}>Immutably verified on-chain</div>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-yellow-400" />
                      <div className="text-xs text-yellow-400">Awaiting AI verification</div>
                    </>
                  )}
                </div>
                <button
                  className="w-full py-2.5 rounded-xl bg-green-600/20 hover:bg-green-600/30 text-green-400 text-sm border border-green-500/30 transition-colors flex items-center justify-center gap-2"
                  style={{ fontWeight: 600 }}
                  onClick={() => window.open(`https://polygonscan.com/tx/${selectedRecord.hash}`, "_blank", "noopener,noreferrer")}
                >
                  <ExternalLink size={14} />
                  View on Polygonscan
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-6 text-center">
              <Shield size={28} className="mx-auto text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">Select a blockchain record to view verification details</p>
            </div>
          )}

          {/* About panel */}
          <div className="bg-[#0d1221] border border-[#1a2540] rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-3" style={{ letterSpacing: "0.08em", fontWeight: 600 }}>TRUST LAYER</div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2"><span className="text-green-400">●</span>Polygon/Hyperledger blockchain</div>
              <div className="flex items-center gap-2"><span className="text-cyan-400">●</span>Gemini 1.5 Flash photo verification</div>
              <div className="flex items-center gap-2"><span className="text-purple-400">●</span>GPS metadata cross-referenced</div>
              <div className="flex items-center gap-2"><span className="text-blue-400">●</span>Zero-knowledge donor access</div>
              <div className="flex items-center gap-2"><span className="text-yellow-400">●</span>Tamper-proof, auditable forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
