export function Tasks() {
    const tasks = [
        { id: 1, title: "Refactor Database Logic", xp: 50, difficulty: "Medium", completed: false },
        { id: 2, title: "Design User Interface", xp: 100, difficulty: "Hard", completed: true },
        { id: 3, title: "Fix Login Bug", xp: 30, difficulty: "Easy", completed: false },
    ]

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Adventure Board (Tasks)</h2>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-poke-accent">Active Quests</h3>
                    <button className="bg-poke-accent hover:bg-cyan-600 text-slate-900 font-bold py-2 px-4 rounded-lg transition-colors">
                        + New Quest
                    </button>
                </div>

                <div className="space-y-4">
                    {tasks.map(task => (
                        <div key={task.id} className={`p-4 rounded-xl border flex items-center justify-between group transition-all ${task.completed ? 'bg-slate-900/50 border-slate-800 opacity-50' : 'bg-slate-700/50 border-slate-600 hover:border-poke-yellow'}`}>
                            <div className="flex items-center space-x-4">
                                <div className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${task.completed ? 'bg-green-500 border-green-500' : 'border-slate-400 hover:border-poke-accent'}`}>
                                    {task.completed && <span>✓</span>}
                                </div>
                                <div>
                                    <div className={`font-medium ${task.completed ? 'line-through text-slate-500' : 'text-white'}`}>{task.title}</div>
                                    <div className="text-xs text-slate-400 flex space-x-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${getDifficultyColor(task.difficulty)}`}>
                                            {task.difficulty}
                                        </span>
                                        <span>+{task.xp} XP</span>
                                    </div>
                                </div>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="text-slate-400 hover:text-red-400">🗑️</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
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
