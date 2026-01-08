import {
    LayoutDashboard,
    Sword,
    Target,
    Trophy,
    User,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface SidebarProps {
    currentView: string;
    setCurrentView: (view: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onLogout: () => void;
    userRole?: string;
}

export function Sidebar({ currentView, setCurrentView, isOpen, setIsOpen, onLogout, userRole }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'tasks', label: 'Quests', icon: Sword },
        { id: 'goals', label: 'Training Goals', icon: Target },
        { id: 'achievements', label: 'Accomplishments', icon: Trophy },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'admin', label: 'Admin Panel', icon: Settings, adminOnly: true },
    ].filter(item => !item.adminOnly || userRole === 'ADMIN');

    return (
        <aside className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 transition-all duration-300 z-50 shadow-soft ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="p-6 flex items-center justify-between">
                {isOpen && (
                    <div className="flex items-center space-x-3 font-bold text-xl tracking-tight text-slate-900">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg shadow-lg flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">Poke-Work</span>
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors"
                >
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                </button>
            </div>

            <div className="flex flex-col h-[calc(100%-100px)]">
                <nav className="mt-4 space-y-1 px-3 flex-1">
                    {menuItems.map(item => {
                        const Icon = item.icon;
                        const isActive = currentView === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className={`w-full flex items-center space-x-4 p-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                                    }`}
                            >
                                <Icon size={22} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                                {isOpen && <span className="font-semibold text-sm">{item.label}</span>}
                            </button>
                        );
                    })}
                </nav>

                <div className="mt-auto px-3 mb-6">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center space-x-4 p-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                    >
                        <LogOut size={22} />
                        {isOpen && <span className="font-semibold text-sm">Logout</span>}
                    </button>
                    {isOpen && (
                        <div className="mt-4 px-3">
                            <div className="h-px bg-slate-100 w-full mb-4" />
                            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest opacity-60">
                                Portfolio Version 1.0.0
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
