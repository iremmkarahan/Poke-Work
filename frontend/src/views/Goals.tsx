export function Goals() {
    const goals = [
        { id: 1, title: "Master Java Backend", current: 40, total: 100, color: "bg-orange-500" },
        { id: 2, title: "Complete 50 Work Hours", current: 42, total: 50, color: "bg-blue-500" },
        { id: 3, title: "Evolve Charmander", current: 800, total: 1000, color: "bg-purple-500", isXp: true },
    ]

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8">Training Goals</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {goals.map(goal => (
                    <div key={goal.id} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-500 transition-colors shadow-lg">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="text-lg font-bold">{goal.title}</h3>
                            <span className="text-sm text-slate-400 font-mono">
                                {goal.current} / {goal.total} {goal.isXp ? 'XP' : '%'}
                            </span>
                        </div>

                        <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
                            <div
                                className={`h-full ${goal.color} transition-all duration-1000 ease-out`}
                                style={{ width: `${(goal.current / goal.total) * 100}%` }}
                            ></div>
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button className="text-xs text-poke-accent font-bold hover:underline">Edit Goal ➜</button>
                        </div>
                    </div>
                ))}

                {/* Add New Goal Card */}
                <div className="bg-slate-800/30 p-6 rounded-2xl border border-dashed border-slate-600 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800/50 hover:border-poke-accent transition-all group h-40">
                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-xl mb-2 group-hover:bg-poke-accent group-hover:text-slate-900 transition-colors">+</div>
                    <span className="text-slate-400 group-hover:text-white font-medium">Set New Goal</span>
                </div>
            </div>
        </div>
    )
}
