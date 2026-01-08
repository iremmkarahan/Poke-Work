import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Target,
    Plus,
    Trash2,
    TrendingUp,
    Shield,
    ChevronRight,
    Search
} from 'lucide-react';

interface Goal {
    id: number;
    title: string;
    currentValue: number;
    targetValue: number;
    unit: string;
    color: string;
}

export function Goals() {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // New Goal Form
    const [title, setTitle] = useState('');
    const [target, setTarget] = useState(100);
    const [unit, setUnit] = useState('hours');
    const [color, setColor] = useState('bg-indigo-600');

    useEffect(() => {
        fetchGoals();
    }, []);

    const fetchGoals = async () => {
        try {
            const data = await api.getGoals();
            setGoals(data);
        } catch (error) {
            console.error("Failed to fetch goals:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createGoal(title, target, unit, color);
            setTitle('');
            setShowModal(false);
            fetchGoals();
        } catch (error) {
            alert("Failed to create goal");
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this goal?")) return;
        try {
            await api.deleteGoal(id);
            fetchGoals();
        } catch (error) {
            alert("Failed to delete goal");
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center text-slate-900">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Focus Objectives</h2>
                    <p className="text-slate-500 font-medium">Define and track your long-term skill development.</p>
                </div>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-400 font-medium animate-pulse">Retrieving training objectives...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {goals.map(goal => (
                        <div key={goal.id} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-card hover:shadow-lg transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -translate-y-16 translate-x-16 -z-0 opacity-50 transition-transform group-hover:scale-110" />

                            <div className="relative z-1">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${goal.color.replace('bg-', 'bg-opacity-90 bg-')}`}>
                                            <Target size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-900">{goal.title}</h3>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                Objective: {goal.targetValue} {goal.unit}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(goal.id)}
                                        className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-3xl font-black text-slate-900">{goal.currentValue}</span>
                                            <span className="text-slate-400 font-bold text-sm uppercase">/ {goal.targetValue} {goal.unit}</span>
                                        </div>
                                        <div className="text-xs font-black text-slate-900">
                                            {Math.floor((goal.currentValue / goal.targetValue) * 100)}%
                                        </div>
                                    </div>

                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${goal.color} transition-all duration-1000 ease-out rounded-full shadow-inner`}
                                            style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-8 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                                    ST
                                                </div>
                                            ))}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Contributor streak</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-indigo-600 font-bold text-xs group-hover:gap-2 transition-all">
                                        Details <ChevronRight size={14} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-slate-50/50 p-8 rounded-[2rem] border-4 border-dashed border-slate-100 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-indigo-600 hover:text-indigo-600 transition-all group h-full min-h-[280px]"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-slate-300 mb-4 group-hover:scale-110 group-hover:border-indigo-600 group-hover:text-indigo-600 transition-all shadow-sm">
                            <Plus size={32} />
                        </div>
                        <span className="text-slate-400 group-hover:text-indigo-600 font-black uppercase text-xs tracking-[0.2em]">Initialize New Objective</span>
                    </button>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Target size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">Define Objective</h3>
                                <p className="text-slate-500 font-medium">Establish a new performance metric to track.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddGoal} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Objective Title</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., Master Advanced TypeScript"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Target Threshold</label>
                                    <input
                                        required
                                        type="number"
                                        value={target}
                                        onChange={e => setTarget(Number(e.target.value))}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Metric Unit</label>
                                    <input
                                        required
                                        type="text"
                                        value={unit}
                                        onChange={e => setUnit(e.target.value)}
                                        placeholder="hours/tasks"
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Visual Marker</label>
                                <div className="flex gap-4">
                                    {['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-500', 'bg-violet-600'].map(c => (
                                        <div
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-10 h-10 rounded-xl cursor-pointer transition-all ${c} ${color === c ? 'ring-4 ring-indigo-100 scale-110 shadow-lg' : 'hover:scale-110 opacity-70 hover:opacity-100'}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-8 py-4 rounded-2xl border-2 border-slate-100 text-slate-400 font-bold hover:bg-slate-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
                                >
                                    Save Objective
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
