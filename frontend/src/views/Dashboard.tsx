import { useState } from 'react'

export function Dashboard() {
    const [level] = useState(5)
    const [xp] = useState(400)

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
                        <div className="font-bold text-lg">Trainer Alex</div>
                        <div className="text-xs text-slate-400">Level {level} • {xp}/1000 XP</div>
                        <div className="w-32 h-2 bg-slate-700 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500" style={{ width: '40%' }}></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard title="Work Hours" value="42h" subtext="Total this week" color="text-cyan-400" />
                <StatCard title="Avg. Daily" value="6h" subtext="+12% vs last week" color="text-purple-400" />
                <StatCard title="Goal Progress" value="84%" subtext="Almost there!" color="text-green-400" />
            </div>

            {/* Large Graph Area */}
            <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl h-64 flex items-center justify-center text-slate-500">
                [Interactive Graph Component Placeholder]
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-3">
                    <ActivityItem icon="✅" text="Completed 'Project Alpha' task (+50 XP)" time="2h ago" />
                    <ActivityItem icon="🕒" text="Logged 2h of deep work (+20 XP)" time="4h ago" />
                    <ActivityItem icon="🏆" text="Earned 'Early Bird' Badge (+100 XP)" time="6h ago" />
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
