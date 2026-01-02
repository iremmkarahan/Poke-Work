import { useState } from 'react'
import { Dashboard } from './views/Dashboard'
import { Tasks } from './views/Tasks'
import { Goals } from './views/Goals'
import { Achievements } from './views/Achievements'

type View = 'dashboard' | 'tasks' | 'goals' | 'achievements';

function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="flex h-screen bg-poke-dark text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-700 flex flex-col">
        <div className="p-6 flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
          <div className="w-8 h-8 rounded-full bg-red-600 border-2 border-white flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
          <h1 className="text-xl font-bold tracking-tighter">Poke-Work</h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem
            icon="🏠"
            label="Dashboard"
            active={view === 'dashboard'}
            onClick={() => setView('dashboard')}
          />
          <NavItem
            icon="📋"
            label="Tasks"
            active={view === 'tasks'}
            onClick={() => setView('tasks')}
          />
          <NavItem
            icon="📈"
            label="Goals"
            active={view === 'goals'}
            onClick={() => setView('goals')}
          />
          <NavItem
            icon="🏆"
            label="Achievements"
            active={view === 'achievements'}
            onClick={() => setView('achievements')}
          />
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {view === 'dashboard' && <Dashboard />}
        {view === 'tasks' && <Tasks />}
        {view === 'goals' && <Goals />}
        {view === 'achievements' && <Achievements />}
      </main>
    </div>
  )
}

function NavItem({ icon, label, active = false, onClick }: { icon: string, label: string, active?: boolean, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${active ? 'bg-poke-accent/20 text-poke-accent border border-poke-accent/30 shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </div>
  )
}

export default App
