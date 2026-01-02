export function Achievements() {
    const badges = [
        { id: 1, name: "First Steps", desc: "Log your first work session", icon: "👟", unlocked: true },
        { id: 2, name: "Early Bird", desc: "Start working before 8 AM", icon: "🌅", unlocked: true },
        { id: 3, name: "Night Owl", desc: "Work past midnight", icon: "🦉", unlocked: false },
        { id: 4, name: "Marathon Runner", desc: "Work 8 hours in one day", icon: "🏃", unlocked: false },
        { id: 5, name: "Consistency King", desc: "Work 7 days in a row", icon: "👑", unlocked: false },
        { id: 6, name: "Level Up!", desc: "Reach Level 10", icon: "⭐", unlocked: false },
    ]

    return (
        <div className="p-8">
            <div className="flex items-center space-x-3 mb-8">
                <h2 className="text-3xl font-bold">Trophy Case</h2>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-sm font-bold rounded-full border border-yellow-500/30">
                    2 / {badges.length} Unlocked
                </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map(badge => (
                    <div key={badge.id} className={`flex flex-col items-center justify-center p-6 rounded-2xl border text-center transition-all ${badge.unlocked ? 'bg-slate-800 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]' : 'bg-slate-900 border-slate-800 grayscale opacity-60'}`}>
                        <div className={`text-4xl mb-3 p-3 rounded-full ${badge.unlocked ? 'bg-slate-700' : 'bg-slate-800'}`}>
                            {badge.icon}
                        </div>
                        <h3 className={`font-bold mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-500'}`}>{badge.name}</h3>
                        <p className="text-xs text-slate-400 leading-tight">{badge.desc}</p>
                        {!badge.unlocked && <div className="mt-2 text-[10px] uppercase font-bold text-slate-600 tracking-wider">LOCKED</div>}
                    </div>
                ))}
            </div>
        </div>
    )
}
