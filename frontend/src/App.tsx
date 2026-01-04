import { useState, useEffect } from 'react'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { Dashboard } from './views/Dashboard'
import { Tasks } from './views/Tasks'
import { Goals } from './views/Goals'
import { Achievements } from './views/Achievements'
import { Auth } from './views/Auth'
import { AdminDashboard } from './views/AdminDashboard'

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [registered, setRegistered] = useState(false)
  const [userRole, setUserRole] = useState<string | undefined>()

  useEffect(() => {
    const auth = localStorage.getItem('authHeader');
    if (auth) setRegistered(true);

    const handleAuthError = () => {
      localStorage.removeItem('authHeader');
      setRegistered(false);
      setUserRole(undefined);
    };

    window.addEventListener('auth-expired', handleAuthError);
    return () => window.removeEventListener('auth-expired', handleAuthError);
  }, []);

  // If not registered/logged in, show Auth screen
  if (!registered) {
    return <Auth onAuthSuccess={() => setRegistered(true)} />
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard onDataLoaded={(data) => setUserRole(data.role)} />
      case 'tasks': return <Tasks />
      case 'goals': return <Goals />
      case 'achievements': return <Achievements />
      case 'admin': return <AdminDashboard />
      default: return <Dashboard onDataLoaded={(data) => setUserRole(data.role)} />
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        userRole={userRole}
        onLogout={() => {
          localStorage.removeItem('authHeader');
          setRegistered(false);
          setUserRole(undefined);
          setCurrentView('dashboard');
        }}
      />

      {/* Main Content Area */}
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
        <Header title={currentView.charAt(0).toUpperCase() + currentView.slice(1)} />

        <div className="container mx-auto max-w-6xl">
          {renderView()}
        </div>
      </main>
    </div>
  )
}
