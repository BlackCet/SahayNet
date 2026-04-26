import { useAuth } from "../contexts/AuthContext";
import { Award, CheckCircle2, Shield, UserCircle, Briefcase, Zap } from "lucide-react";

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto space-y-6 flex-1">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-white font-bold tracking-tight">User Profile</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account details and stats.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 border border-[#1a2540] bg-[#0d1221] rounded-xl p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-3xl text-white mb-4 shadow-lg shadow-blue-500/20" style={{ fontWeight: 700 }}>
              {user.avatar}
            </div>
            <h2 className="text-xl text-white font-bold">{user.name}</h2>
            <p className="text-sm text-slate-400 mt-1">{user.email}</p>
            
            <div className="mt-4 px-3 py-1 rounded border border-[#1a2540] bg-[#151f35] flex items-center gap-2">
                <Shield size={14} className="text-slate-400" />
                <span className="text-xs text-slate-300 font-medium tracking-wider">{user.role}</span>
            </div>
        </div>

        <div className="md:col-span-2 border border-[#1a2540] bg-[#0d1221] rounded-xl p-6">
            <h3 className="text-lg text-white font-semibold mb-4 border-b border-[#1a2540] pb-2">Account Overview</h3>
            
            <div className="grid grid-cols-2 gap-4">
               {user.role === "VOLUNTEER" || user.role === "GIG_WORKER" ? (
                 <>
                   <div className="p-4 rounded-lg bg-[#070b14] border border-[#1a2540] flex items-center gap-4">
                     <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
                       <CheckCircle2 size={24} />
                     </div>
                     <div>
                       <div className="text-sm text-slate-400">Completed Tasks</div>
                       <div className="text-2xl text-white font-bold">{user.completedTasks || 0}</div>
                     </div>
                   </div>
                   
                   <div className="p-4 rounded-lg bg-[#070b14] border border-[#1a2540] flex items-center gap-4">
                     <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg">
                       <Award size={24} />
                     </div>
                     <div>
                       <div className="text-sm text-slate-400">Karma Earned</div>
                       <div className="text-2xl text-white font-bold">{user.karmaBalance || 0}</div>
                     </div>
                   </div>
                 </>
               ) : user.role === "NGO" ? (
                 <>
                   <div className="p-4 rounded-lg bg-[#070b14] border border-[#1a2540] flex items-center gap-4">
                     <div className="p-3 bg-orange-500/10 text-orange-400 rounded-lg">
                       <Briefcase size={24} />
                     </div>
                     <div>
                       <div className="text-sm text-slate-400">Missions Created</div>
                       <div className="text-2xl text-white font-bold">34</div>
                     </div>
                   </div>
                   <div className="p-4 rounded-lg bg-[#070b14] border border-[#1a2540] flex items-center gap-4">
                     <div className="p-3 bg-green-500/10 text-green-400 rounded-lg">
                       <Zap size={24} />
                     </div>
                     <div>
                       <div className="text-sm text-slate-400">Impact Score</div>
                       <div className="text-2xl text-white font-bold">98.5</div>
                     </div>
                   </div>
                 </>
               ) : (
                 <div className="col-span-2 p-6 rounded-lg bg-[#070b14] border border-[#1a2540] text-center">
                    <p className="text-slate-400">Admin dashboard has access to global system metrics.</p>
                 </div>
               )}
            </div>
            
            <div className="mt-8 border-t border-[#1a2540] pt-6">
                <h3 className="text-sm text-slate-300 font-semibold mb-4">Role Characteristics</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                    {user.role === "ADMIN" && (
                        <>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Full system access to Command Center</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Can moderate nodes and unverify tasks</li>
                        </>
                    )}
                    {user.role === "NGO" && (
                        <>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Authorized to submit high-priority Needs</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Tracks dispatch statuses over time</li>
                        </>
                    )}
                    {(user.role === "VOLUNTEER" || user.role === "GIG_WORKER") && (
                        <>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Subscribes to nearby Bounty nodes</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Earns verifiable Karma tokens on completion</li>
                            <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-400" /> Subject to verification pipeline for anti-fraud</li>
                        </>
                    )}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
}
