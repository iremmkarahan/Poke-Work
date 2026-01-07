import { useState, useEffect } from 'react';
import { api } from '../api';

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
    const [color, setColor] = useState('bg-blue-500');

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
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-white tracking-tight">Training Goals</h2>

            {loading ? (
                <div className="text-slate-400">Loading goals...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map(goal => (
                        <div key={goal.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-all shadow-lg group">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{goal.title}</h3>
                                    <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Target: {goal.targetValue} {goal.unit}</div>
                                </div>
                                <span className="text-sm font-mono text-slate-300">
                                    {goal.currentValue} / {goal.targetValue}
                                </span>
                            </div>

                            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                                <div
                                    className={`h-full ${goal.color} transition-all duration-1000 ease-out`}
                                    style={{ width: `${Math.min(100, (goal.currentValue / goal.targetValue) * 100)}%` }}
                                ></div>
                            </div>

                            <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleDelete(goal.id)}
                                    className="text-xs text-red-400 hover:text-red-300 font-bold"
                                >
                                    Delete
                                </button>
                                <div className="text-[10px] text-slate-500 font-bold uppercase">Progress: {Math.floor((goal.currentValue / goal.targetValue) * 100)}%</div>
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={() => setShowModal(true)}
                        className="bg-slate-800/30 p-6 rounded-2xl border border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-poke-accent transition-all group h-40"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-2xl mb-3 group-hover:bg-poke-accent group-hover:text-slate-900 transition-all">+</div>
                        <span className="text-slate-400 group-hover:text-white font-bold uppercase text-xs tracking-widest">Set New Goal</span>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold mb-6 text-poke-accent">New Training Goal</h3>
                        <form onSubmit={handleAddGoal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Goal Title</label>
                                <input
                                    required
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="e.g., Master React Hooks"
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-poke-accent transition-colors"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Target Value</label>
                                    <input
                                        required
                                        type="number"
                                        value={target}
                                        onChange={e => setTarget(Number(e.target.value))}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-poke-accent transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Unit</label>
                                    <input
                                        required
                                        type="text"
                                        value={unit}
                                        onChange={e => setUnit(e.target.value)}
                                        placeholder="hours/sessions"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-poke-accent transition-colors"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Color Theme</label>
                                <div className="flex gap-3">
                                    {['bg-blue-500', 'bg-orange-500', 'bg-purple-500', 'bg-green-500', 'bg-pink-500'].map(c => (
                                        <div
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-8 h-8 rounded-full cursor-pointer transition-all ${c} ${color === c ? 'ring-4 ring-white' : 'hover:scale-110'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 rounded-xl border border-slate-600 text-slate-400 font-bold hover:bg-slate-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 rounded-xl bg-poke-accent text-slate-900 font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-poke-accent/20"
                                >
                                    Save Goal
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
