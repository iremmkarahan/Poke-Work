import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Trophy,
    Lock,
    CheckCircle2,
    Star,
    Award,
    Briefcase,
    Zap,
    TrendingUp
} from 'lucide-react';

interface Badge {
    name: string;
    description: string;
    unlocked: boolean;
    currentProgress: number;
    targetProgress: number;
}

interface AchievementResponse {
    badges: Badge[];
    unlockedCount: number;
}

export function Achievements() {
    const [data, setData] = useState<AchievementResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.getAchievements()
            .then(res => {
                setData(res);
                setLoading(false);
            })
            .catch(err => {
                console.error("Achievements error:", err);
                setError("Failed to synchronize accomplishment data.");
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-12 text-slate-500 animate-pulse text-center font-medium">Synchronizing accomplishment manifest...</div>;
    if (error) return <div className="p-12 text-rose-500 text-center font-bold italic">{error}</div>;

    const badges = data?.badges || [];
    const unlockedCount = data?.unlockedCount || 0;

    return (
        <div className="space-y-8 pb-12">
            <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-card flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-32 translate-x-32 -z-0" />

                <div className="flex-1 relative z-1">
                    <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest mb-3">
                        <Award size={14} />
                        Professional Milestones
                    </div>
                    <h2 className="text-4xl font-black text-slate-900 leading-tight">Accolades & Merit</h2>
                    <p className="text-slate-500 font-medium mt-2 max-w-lg">Track your career progression and technical excellence through validated milestones.</p>
                </div>

                <div className="flex items-center gap-8 relative z-1">
                    <div className="text-center">
                        <div className="text-5xl font-black text-indigo-600 leading-none">{unlockedCount}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Unlocked</div>
                    </div>
                    <div className="h-12 w-px bg-slate-100" />
                    <div className="text-center">
                        <div className="text-5xl font-black text-slate-200 leading-none">{badges.length}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Total</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {badges.map((badge, index) => (
                    <div
                        key={index}
                        className={`bg-white p-8 rounded-[2rem] border transition-all duration-500 relative flex flex-col group ${badge.unlocked
                            ? 'border-indigo-100 shadow-card hover:shadow-lg'
                            : 'border-slate-50 opacity-80'}`}
                    >
                        {!badge.unlocked && (
                            <div className="absolute top-4 right-4 text-slate-200 group-hover:text-slate-300 transition-colors">
                                <Lock size={16} />
                            </div>
                        )}

                        <div className="flex items-start gap-5 mb-6">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative ${badge.unlocked
                                ? 'bg-indigo-600 text-white shadow-lg rotate-3 group-hover:rotate-0'
                                : 'bg-slate-50 text-slate-200'}`}>
                                {getIconForBadge(badge.name, 28)}
                                {badge.unlocked && (
                                    <div className="absolute -top-1 -right-1 bg-white text-indigo-600 p-0.5 rounded-full shadow-sm animate-bounce">
                                        <CheckCircle2 size={12} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className={`font-bold transition-colors ${badge.unlocked ? 'text-slate-900' : 'text-slate-400'}`}>
                                    {badge.name}
                                </h3>
                                <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
                                    {badge.description}
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <span className={badge.unlocked ? 'text-indigo-600' : 'text-slate-300'}>
                                    {badge.unlocked ? 'Completed' : 'Propagation'}
                                </span>
                                <span className={badge.unlocked ? 'text-slate-900' : 'text-slate-400'}>
                                    {badge.currentProgress} / {badge.targetProgress}
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${badge.unlocked ? 'bg-indigo-600' : 'bg-slate-200'}`}
                                    style={{ width: `${Math.min(100, (badge.currentProgress / badge.targetProgress) * 100)}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getIconForBadge(name: string, size: number) {
    const n = name.toLowerCase();
    if (n.includes('quest') || n.includes('task')) return <Zap size={size} />;
    if (n.includes('session') || n.includes('work')) return <Briefcase size={size} />;
    if (n.includes('xp') || n.includes('experience')) return <Star size={size} />;
    if (n.includes('level') || n.includes('evolution')) return <TrendingUp size={size} />;
    if (n.includes('day') || n.includes('time')) return <Award size={size} />;
    return <Trophy size={size} />;
}
