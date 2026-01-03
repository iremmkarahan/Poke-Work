// Sidebar component 


interface SidebarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    userRole?: string;
}

export function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen, userRole }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'tasks', label: 'Tasks', icon: '⚔️' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'achievements', label: 'Achievements', icon: '🏆' },
        { id: 'admin', label: 'Admin Panel', icon: '⚡', adminOnly: true },
    ].filter(item => !item.adminOnly || userRole === 'ADMIN');

    return (
        <aside className={`fixed left-0 top-0 h-full bg-slate-800 border-r border-slate-700 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-6 flex items-center justify-between">
                {isOpen && (
                    <div className="flex items-center space-x-2 font-bold text-xl tracking-tighter">
                        <div className="w-8 h-8 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                        <span>Poke-Work</span>
                    </div>
                )}
                <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-slate-700 rounded text-slate-400">
                    {isOpen ? '◀' : '▶'}
                </button>
            </div>

            <nav className="mt-4 space-y-2 px-4">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-all ${currentView === item.id
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                            : 'text-slate-400 hover:bg-slate-700 hover:text-white'
                            }`}
                    >
                        <span className="text-xl">{item.icon}</span>
                        {isOpen && <span className="font-medium">{item.label}</span>}
                    </button>
                ))}
            </nav>

            <div className="absolute bottom-8 left-0 w-full px-6">
                {isOpen && <div className="text-xs text-slate-500 text-center">v1.0.0 Alpha</div>}
            </div>
        </aside>
    );
}
