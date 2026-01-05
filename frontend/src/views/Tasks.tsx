import { useState, useEffect } from 'react';
import { api } from '../api';

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

    // Timer State
    const [activeQuestId, setActiveQuestId] = useState<number | null>(null);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        fetchQuests();
        // Restore active timer from localStorage if exists
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
        if (!startTime) return;

        const durationSeconds = (Date.now() - startTime) / 1000;
        const durationHours = durationSeconds / 3600;

        try {
            await api.finishQuest(id, durationHours);
            setActiveQuestId(null);
            setStartTime(null);
            localStorage.removeItem('activeQuest');
            fetchQuests();
        } catch (error) {
            alert("Failed to finish quest");
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
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Adventure Board (Tasks)</h2>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-poke-accent">Active Quests</h3>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-poke-accent hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        + New Quest
                    </button>
                </div>

                {activeQuestId && (
                    <div className="mb-8 p-8 bg-slate-900/60 border-2 border-poke-accent/30 rounded-3xl flex flex-col md:flex-row items-center justify-between animate-pulse-subtle gap-6">
                        <div className="flex-1">
                            <div className="text-poke-accent text-xs font-bold uppercase tracking-[0.2em] mb-2">Quest in Progress</div>
                            <div className="text-3xl font-bold text-white tracking-tight">
                                {quests.find(q => q.id === activeQuestId)?.title}
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="fliqlo-container">
                                <div className="fliqlo-group">
                                    <div className="fliqlo-card">
                                        {Math.floor(elapsedTime / 3600).toString().padStart(2, '0')}
                                    </div>
                                    <span className="fliqlo-label">Hours</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-500 mb-6">:</div>
                                <div className="fliqlo-group">
                                    <div className="fliqlo-card">
                                        {Math.floor((elapsedTime % 3600) / 60).toString().padStart(2, '0')}
                                    </div>
                                    <span className="fliqlo-label">Minutes</span>
                                </div>
                                <div className="text-2xl font-bold text-slate-500 mb-6">:</div>
                                <div className="fliqlo-group">
                                    <div className="fliqlo-card text-poke-yellow">
                                        {(elapsedTime % 60).toString().padStart(2, '0')}
                                    </div>
                                    <span className="fliqlo-label">Seconds</span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleFinishQuest(activeQuestId)}
                                className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2"
                            >
                                <span className="text-xl">🏁</span> Finish Quest
                            </button>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading quests...</div>
                ) : (
                    <div className="space-y-4">
                        {quests.length === 0 && <div className="text-center py-10 text-slate-500 italic">No quests found. Start your adventure!</div>}
                        {quests.map(quest => (
                            <div key={quest.id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${quest.completed ? 'bg-slate-900/50 border-slate-800 opacity-50' : 'bg-slate-700/50 border-slate-600 hover:border-poke-yellow'} ${activeQuestId === quest.id ? 'ring-2 ring-poke-accent' : ''}`}>
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`w-10 h-10 rounded-xl border flex items-center justify-center ${quest.completed ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-slate-800 border-slate-700'}`}
                                    >
                                        {quest.completed ? "✓" : "⚔️"}
                                    </div>
                                    <div>
                                        <div className={`font-medium ${quest.completed ? 'line-through text-slate-500' : 'text-white'}`}>{quest.title}</div>
                                        <div className="text-xs text-slate-400 flex space-x-2 mt-1">
                                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${getDifficultyColor(quest.difficulty)}`}>
                                                {quest.difficulty}
                                            </span>
                                            {quest.completed && <span className="text-poke-yellow">+{quest.earnedXp || 0} XP gained</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    {!quest.completed && activeQuestId !== quest.id && (
                                        <button
                                            onClick={() => handleStartQuest(quest.id)}
                                            disabled={!!activeQuestId}
                                            className={`px-4 py-2 rounded-lg font-bold transition-all ${activeQuestId ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-poke-accent/10 border border-poke-accent/30 text-poke-accent hover:bg-poke-accent hover:text-slate-900'}`}
                                        >
                                            Start Task
                                        </button>
                                    )}
                                    <button onClick={() => handleDelete(quest.id)} className="text-slate-400 hover:text-red-400 p-2">🗑️</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* New Quest Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6 text-poke-yellow">Post New Quest</h3>
                        <form onSubmit={handleAddQuest} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Quest Title</label>
                                <input
                                    required
                                    type="text"
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    placeholder="Enter quest description..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-poke-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">Difficulty</label>
                                <select
                                    value={newDifficulty}
                                    onChange={(e) => setNewDifficulty(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-poke-accent"
                                >
                                    <option>Easy</option>
                                    <option>Medium</option>
                                    <option>Hard</option>
                                </select>
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 px-6 py-3 rounded-xl border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-3 rounded-xl bg-poke-accent text-slate-900 font-bold hover:bg-cyan-600 transition-colors"
                                >
                                    Create Quest
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

function getDifficultyColor(diff: string) {
    switch (diff) {
        case 'Easy': return 'bg-green-900 text-green-300';
        case 'Medium': return 'bg-yellow-900 text-yellow-300';
        case 'Hard': return 'bg-red-900 text-red-300';
        default: return 'bg-slate-700 text-slate-300';
    }
}

