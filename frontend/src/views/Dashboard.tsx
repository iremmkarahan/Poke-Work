import { useState, useEffect } from 'react'
import { api } from '../api'
import {
    Zap,
    TrendingUp,
    Clock,
    RefreshCcw,
    CheckCircle2,
    ShieldCheck,
    Star,
    User
} from 'lucide-react';

interface DashboardData {
    trainerName: string;
    pokemonName: string;
    level: number;
    currentXp: number;
    totalXp: number;
    evolutionStage: string;
    role: string;
    status: string;
    profilePictureUrl: string | null;
}

const STATUSES = ["Ready to Work", "Focusing", "Resting", "On a Break", "Stuck"];

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

    const handleStatusChange = async () => {
        if (!data) return;
        const currentIndex = STATUSES.indexOf(data.status);
        const nextIndex = (currentIndex + 1) % STATUSES.length;
        const nextStatus = STATUSES[nextIndex];

        try {
            const res = await api.updateUserStatus(nextStatus);
            setData({ ...data, status: res.status });
        } catch (error) {
            alert("Failed to update status");
        }
    };

    if (loading) return <div className="p-8 text-slate-500 animate-pulse">Synchronizing dashboard data...</div>

    if (!data) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh]">
                <div className="text-4xl mb-4">⚠️</div>
                <div className="text-xl mb-4 text-center font-bold text-slate-900">Connection Error</div>
                <p className="text-slate-500 mb-6 text-center max-w-sm">We couldn't retrieve your trainer data. Please ensure the backend service is operational.</p>
                <button
                    onClick={() => window.dispatchEvent(new Event('auth-expired'))}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg"
                >
                    Reconnect Session
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Header / Profile Hero */}
            <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center">
                            {data.profilePictureUrl ? (
                                <img src={data.profilePictureUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-4xl text-indigo-200">
                                    <User size={48} />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <Star size={14} fill="currentColor" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-slate-900">{data.trainerName}</h2>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest rounded-md border border-indigo-100">
                                {data.role}
                            </span>
                        </div>
                        <p className="text-slate-500 font-medium">Lvl {data.level} {data.pokemonName}</p>

                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-slate-400 uppercase tracking-tighter">Experience Points</span>
                                <span className="font-mono text-indigo-600">{data.currentXp} / 100 XP</span>
                            </div>
                            <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full transition-all duration-1000" style={{ width: `${Math.min(data.currentXp, 100)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-center px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rank</div>
                        <div className="text-xl font-bold text-indigo-600">Elite</div>
                    </div>
                    <div className="text-center px-6 py-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                        <div className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-xl font-bold text-white">Active</div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Earning"
                    value={`${data.totalXp} XP`}
                    subtext="Lifetime XP accumulated"
                    icon={<TrendingUp size={20} />}
                    color="text-emerald-600"
                    bgColor="bg-emerald-50"
                    borderColor="border-emerald-100"
                />
                <StatCard
                    title="Evolution Stage"
                    value={data.evolutionStage}
                    subtext="Current Pokémon form"
                    icon={<ShieldCheck size={20} />}
                    color="text-indigo-600"
                    bgColor="bg-indigo-50"
                    borderColor="border-indigo-100"
                />
                <button
                    onClick={handleStatusChange}
                    className="group"
                >
                    <StatCard
                        title="Current Focus"
                        value={data.status}
                        subtext="Click to update status"
                        icon={<RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />}
                        color={getStatusColor(data.status)}
                        bgColor={getStatusBg(data.status)}
                        borderColor={getStatusBorder(data.status)}
                    />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-slate-500">
                {/* Visual Chart Placeholder */}
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-card h-80 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            <Clock size={18} className="text-indigo-600" />
                            Work Consistency
                        </h3>
                        <div className="flex gap-2">
                            {['7D', '30D', 'All'].map(t => (
                                <button key={t} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${t === '7D' ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="text-center px-8">
                            <Zap size={32} className="mx-auto text-indigo-200 mb-3" />
                            <p className="text-xs font-semibold text-slate-400 max-w-[200px]">Data visualization of your productivity will appear here.</p>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-card h-80 flex flex-col">
                    <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Zap size={18} className="text-amber-500" />
                        Log feed
                    </h3>
                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <ActivityItem icon={<CheckCircle2 size={14} />} text="Quest synchronization complete" time="2m ago" />
                        <ActivityItem icon={<Star size={14} />} text="Daily login bonus rewarded" time="1h ago" />
                        <ActivityItem icon={<RefreshCcw size={14} />} text="Status updated to Focusing" time="3h ago" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function StatCard({ title, value, subtext, icon, color, bgColor, borderColor }: any) {
    return (
        <div className={`bg-white p-6 rounded-3xl border ${borderColor} hover:shadow-lg transition-all duration-300 shadow-card`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bgColor} ${color}`}>
                    {icon}
                </div>
            </div>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{title}</div>
            <div className={`text-2xl font-bold text-slate-900 mb-2 truncate`}>{value}</div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tighter">{subtext}</div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Ready to Work': return 'text-emerald-600';
        case 'Focusing': return 'text-indigo-600';
        case 'Resting': return 'text-purple-600';
        case 'On a Break': return 'text-amber-600';
        case 'Stuck': return 'text-rose-600';
        default: return 'text-slate-600';
    }
}

function getStatusBg(status: string) {
    switch (status) {
        case 'Ready to Work': return 'bg-emerald-50';
        case 'Focusing': return 'bg-indigo-50';
        case 'Resting': return 'bg-purple-50';
        case 'On a Break': return 'bg-amber-50';
        case 'Stuck': return 'bg-rose-50';
        default: return 'bg-slate-50';
    }
}

function getStatusBorder(status: string) {
    switch (status) {
        case 'Ready to Work': return 'border-emerald-100';
        case 'Focusing': return 'border-indigo-100';
        case 'Resting': return 'border-purple-100';
        case 'On a Break': return 'border-amber-100';
        case 'Stuck': return 'border-rose-100';
        default: return 'border-slate-100';
    }
}

function ActivityItem({ icon, text, time }: any) {
    return (
        <div className="flex items-start space-x-3 p-3 bg-slate-50/50 rounded-2xl border border-slate-100/50 group hover:bg-white hover:border-slate-200 transition-all">
            <div className="mt-0.5 text-indigo-500">{icon}</div>
            <div className="flex-1">
                <div className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{text}</div>
                <div className="text-[10px] text-slate-400 font-medium mt-0.5">{time}</div>
            </div>
        </div>
    )
}
