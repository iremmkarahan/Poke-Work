import { useState, useEffect } from 'react'
import { api } from '../api'

interface DashboardData {
    trainerName: string;
    pokemonName: string;
    level: number;
    currentXp: number;
    totalXp: number;
    evolutionStage: string;
    role: string;
}

interface DashboardProps {
    onDataLoaded?: (data: DashboardData) => void;
}

export function Dashboard({ onDataLoaded }: DashboardProps) {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getDashboard()
            .then(data => {
                setData(data);
                if (onDataLoaded) onDataLoaded(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                if (err.message === "AUTH_ERROR") {
                    window.dispatchEvent(new Event('auth-expired'));
                }
                setLoading(false);
            });
    }, []);

    if (loading) return <div className="p-8 text-white">Loading data from backend...</div>

    if (!data) {
        return (
            <div className="p-8 text-white flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-4xl mb-4">⚠️</div>
                <div className="text-xl mb-4 text-center">Error loading dashboard. Ensure backend is running!</div>
                <button
                    onClick={() => window.dispatchEvent(new Event('auth-expired'))}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Clear Session & Return to Register
                </button>
            </div>
        )
    }

    return (
        <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold">Dashboard</h2>

                {/* User Card */}
                <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex items-center space-x-4 shadow-lg">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl border-2 border-yellow-400 animate-pulse">
                        🔥
                    </div>
                    <div>
                        <div className="font-bold text-lg">Trainer {data.trainerName}</div>
                        <div className="text-xs text-slate-400">
                            {data.pokemonName} (Lvl {data.level})
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                            {data.currentXp} / 100 XP to next level
                        </div>
                        <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: `${Math.min(data.currentXp, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Total XP" value={`${data.totalXp}`} subtext="Lifetime Earnings" color="text-cyan-400" />
                <StatCard title="Evolution" value={data.evolutionStage} subtext="Current Form" color="text-purple-400" />
                <StatCard title="Status" value="Active" subtext=" Ready for work!" color="text-green-400" />
            </div>

            {/* Large Graph Area */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl h-64 flex items-center justify-center text-slate-500">
                [Graph: XP Over Time]
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <ActivityItem icon="✅" text="Database synced!" time="Just now" />
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, subtext, color }: { title: string, value: string, subtext: string, color: string }) {
    return (
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-slate-500 transition-colors">
            <div className="text-slate-400 text-sm mb-1">{title}</div>
            <div className={`text-4xl font-bold ${color} mb-2`}>{value}</div>
            <div className="text-xs text-slate-500">{subtext}</div>
        </div>
    )
}

function ActivityItem({ icon, text, time }: { icon: string, text: string, time: string }) {
    return (
        <div className="flex items-center space-x-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <div className="text-xl">{icon}</div>
            <div className="flex-1 text-sm text-slate-300">{text}</div>
            <div className="text-xs text-slate-500 font-mono">{time}</div>
        </div>
    )
}
