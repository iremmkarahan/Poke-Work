import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    Plus,
    Play,
    CheckCircle2,
    Trash2,
    RefreshCcw,
    ArrowRight,
    Timer,
    AlertCircle,
    ClipboardList
} from 'lucide-react';

interface Quest {
    id: number;
    title: string;
    earnedXp: number;
    difficulty: string;
    completed: boolean;
}

export function Tasks() {
    const [quests, setQuests] = useState<Quest[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newDifficulty, setNewDifficulty] = useState('Medium');
    const [loading, setLoading] = useState(true);
    const [finishing, setFinishing] = useState(false);

    // Timer State
    const [activeQuestId, setActiveQuestId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        fetchQuests();
        const savedTimer = localStorage.getItem('activeQuest');
        if (savedTimer) {
            const { id, start } = JSON.parse(savedTimer);
            setActiveQuestId(id);
            setStartTime(start);
        }
    }, []);

    useEffect(() => {
        let interval: any;
        if (activeQuestId && startTime) {
            interval = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [activeQuestId, startTime]);

    const fetchQuests = async () => {
        try {
            const data = await api.getQuests();
            setQuests(data);
        } catch (error) {
            console.error("Failed to fetch quests:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeQuestId && quests.length > 0) {
            const currentQuest = quests.find(q => q.id === activeQuestId);
            if (!currentQuest || currentQuest.completed) {
                setActiveQuestId(null);
                setStartTime(null);
                localStorage.removeItem('activeQuest');
            }
        }
    }, [quests, activeQuestId]);

    const handleAddQuest = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.createQuest(newTitle, 0, newDifficulty);
            setNewTitle('');
            setShowModal(false);
            fetchQuests();
        } catch (error) {
            alert("Failed to create quest");
        }
    };

    const handleStartQuest = (id: number) => {
        const now = Date.now();
        setActiveQuestId(id);
        setStartTime(now);
        localStorage.setItem('activeQuest', JSON.stringify({ id, start: now }));
    };

    const handleFinishQuest = async (id: number) => {
        if (!startTime || finishing) return;

        const durationSeconds = (Date.now() - startTime) / 1000;
        const durationHours = durationSeconds / 3600;

        setFinishing(true);
        try {
            await api.finishQuest(id, durationHours);
            setActiveQuestId(null);
            setStartTime(null);
            localStorage.removeItem('activeQuest');
            fetchQuests();
        } catch (error: any) {
            if (error.message && error.message.includes("already completed")) {
                setActiveQuestId(null);
                setStartTime(null);
                localStorage.removeItem('activeQuest');
                fetchQuests();
            } else {
                alert(error.message || "Failed to finish quest");
            }
        } finally {
            setFinishing(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this quest?")) return;
        try {
            await api.deleteQuest(id);
            if (activeQuestId === id) {
                setActiveQuestId(null);
                setStartTime(null);
                localStorage.removeItem('activeQuest');
            }
            fetchQuests();
        } catch (error) {
            alert("Failed to delete quest");
        }
    };


    return (
        <div className="space-y-8 pb-12">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quest Board</h2>
                    <p className="text-slate-500 font-medium">Manage your professional challenges and track focus time.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-100 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                    New Quest
                </button>
            </div>

            {activeQuestId && (
                <div className="bg-white p-8 rounded-[2rem] border-2 border-indigo-100 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-32 translate-x-32 -z-1" />
                    <div className="flex-1 relative z-1">
                        <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-3">
                            <Timer size={14} />
                            Quest in Progress
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 leading-tight max-w-lg italic">
                            {quests.find(q => q.id === activeQuestId)?.title}
                        </h3>
                    </div>

                    <div className="flex items-center gap-10 relative z-1">
                        <div className="fliqlo-container">
                            <div className="fliqlo-group">
                                <div className="fliqlo-card shadow-indigo-200">
                                    {Math.floor(elapsedTime / 3600).toString().padStart(2, '0')}
                                </div>
                                <span className="fliqlo-label">HR</span>
                            </div>
                            <div className="text-2xl font-black text-slate-200 mt-[-1rem]">:</div>
                            <div className="fliqlo-group">
                                <div className="fliqlo-card shadow-indigo-200 text-indigo-100">
                                    {Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0')}
                                </div>
                                <span className="fliqlo-label">MIN</span>
                            </div>
                            <div className="text-2xl font-black text-slate-200 mt-[-1rem]">:</div>
                            <div className="fliqlo-group">
                                <div className="fliqlo-card shadow-indigo-200 text-indigo-400">
                                    {(elapsedTime % 60).toString().padStart(2, '0')}
                                </div>
                                <span className="fliqlo-label">SEC</span>
                            </div>
                        </div>

                        <button
                            onClick={() => handleFinishQuest(activeQuestId)}
                            disabled={finishing}
                            className={`group relative overflow-hidden ${finishing ? 'bg-slate-100 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white font-bold py-5 px-10 rounded-2xl transition-all shadow-xl hover:shadow-indigo-200 flex items-center gap-3`}
                        >
                            {finishing ? (
                                <RefreshCcw size={20} className="animate-spin" />
                            ) : (
                                <CheckCircle2 size={20} className="group-hover:scale-125 transition-transform" />
                            )}
                            <span className="text-lg tracking-tight">{finishing ? 'Finalizing...' : 'Complete Quest'}</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-card overflow-hidden">
                <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <ClipboardList size={16} />
                        Active Backlog
                    </h4>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{quests.filter(q => !q.completed).length} Tasks remaining</span>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-400 font-medium">Fetching your adventure logs...</div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {quests.length === 0 && (
                            <div className="p-16 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Plus size={32} className="text-slate-300" />
                                </div>
                                <p className="text-slate-400 font-medium italic">No quests available. Start by posting a new challenge.</p>
                            </div>
                        )}
                        {quests.map(quest => (
                            <div
                                key={quest.id}
                                className={`p-5 flex items-center justify-between group transition-all hover:bg-slate-50/80 ${quest.completed ? 'bg-slate-50/40 opacity-50' : 'bg-white'} ${activeQuestId === quest.id ? 'bg-indigo-50/30 border-l-4 border-l-indigo-600' : ''}`}
                            >
                                <div className="flex items-center space-x-5">
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${quest.completed ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-white border border-slate-200 shadow-sm text-slate-400 group-hover:border-indigo-200 group-hover:text-indigo-600'}`}>
                                        {quest.completed ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                    </div>
                                    <div>
                                        <div className={`font-bold transition-all ${quest.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                                            {quest.title} {quest.completed && <span className="ml-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest no-underline inline-block">(Completed)</span>}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border transition-colors ${getDifficultyStyles(quest.difficulty)}`}>
                                                {quest.difficulty}
                                            </span>
                                            {quest.completed && (
                                                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                                                    +{quest.earnedXp || 0} XP EARNED
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!quest.completed && activeQuestId !== quest.id && (
                                        <button
                                            onClick={() => handleStartQuest(quest.id)}
                                            disabled={!!activeQuestId}
                                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeQuestId ? 'text-slate-300 cursor-not-allowed' : 'bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white shadow-sm'}`}
                                        >
                                            <Play size={14} fill="currentColor" />
                                            Start Mission
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(quest.id)}
                                        className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Quest Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-in fade-in duration-300">
                    <div className="bg-white border border-slate-200 p-10 rounded-[2.5rem] w-full max-w-xl shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                                <Plus size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 leading-tight">Post New Quest</h3>
                                <p className="text-slate-500 font-medium">Define a new challenge for your training journey.</p>
                            </div>
                        </div>

                        <form onSubmit={handleAddQuest} className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Mission Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Enter quest description..."
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Challenge Rating</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {['Easy', 'Medium', 'Hard'].map(d => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setNewDifficulty(d)}
                                            className={`py-4 rounded-2xl font-bold text-sm transition-all border-2 ${newDifficulty === d ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-white text-slate-400 hover:border-slate-200'}`}
                                        >
                                            {d}
                                        </button>
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
                                    className="flex-1 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
                                >
                                    Initialize Quest
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function getDifficultyStyles(diff: string) {
    switch (diff) {
        case 'Easy': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'Medium': return 'bg-amber-50 text-amber-600 border-amber-100';
        case 'Hard': return 'bg-rose-50 text-rose-600 border-rose-100';
        default: return 'bg-slate-50 text-slate-500 border-slate-100';
    }
}
