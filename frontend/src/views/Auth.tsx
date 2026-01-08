import { useState } from 'react'
import { api } from '../api'
import {
    ShieldCheck,
    AtSign,
    Lock,
    Zap,
    LayoutDashboard,
    Loader2
} from 'lucide-react';

export function Auth({ onAuthSuccess }: { onAuthSuccess: () => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isLogin) {
                await api.login(username, password);
            } else {
                await api.register(username, password);
            }

            const authHeader = 'Basic ' + btoa(username + ':' + password);
            localStorage.setItem('authHeader', authHeader);

            onAuthSuccess();
        } catch (err: any) {
            setError(err.message || (isLogin ? 'Authentication failed. Please verify credentials.' : 'Registration failed. Protocol error.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-stretch overflow-hidden">
            {/* Left Side: Branding/Intro */}
            <div className="flex-1 bg-indigo-900 p-12 md:p-24 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-800 rounded-full translate-x-1/2 -translate-y-1/2 opacity-20 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600 rounded-full -translate-x-1/2 translate-y-1/2 opacity-20 pointer-events-none" />

                <div className="relative z-1">
                    <div className="flex items-center space-x-3 font-black text-3xl tracking-tighter text-white mb-16">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center">
                            <div className="w-3 h-3 bg-indigo-900 rounded-full animate-pulse" />
                        </div>
                        <span>Poke-Work</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-8">
                        The Professional <br />
                        <span className="text-indigo-300 italic">Workforce</span> <br />
                        Evolution.
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100/80 font-medium max-w-lg leading-relaxed">
                        A gamified productivity ecosystem designed for senior software engineers. Track quests, manage objectives, and visualize your career trajectory.
                    </p>
                </div>

                <div className="relative z-1 mt-12 grid grid-cols-2 gap-8 max-w-md">
                    <div className="space-y-2">
                        <ShieldCheck className="text-indigo-400" size={32} />
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Verified tracking</h3>
                        <p className="text-indigo-200/60 text-xs font-medium">Cryptographically synced effort metrics.</p>
                    </div>
                    <div className="space-y-2">
                        <Zap className="text-indigo-400" size={32} />
                        <h3 className="font-bold text-white uppercase tracking-widest text-xs">Agile Methodology</h3>
                        <p className="text-indigo-200/60 text-xs font-medium">Sprint-based quest cycles and daily habits.</p>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 p-12 md:p-24 flex items-center justify-center bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-slate-900 mb-2">
                            {isLogin ? 'Internal Access' : 'Create Credentials'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {isLogin ? 'Provide your credentials to synchronize the workspace.' : 'Initialize your professional trainer profile.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <ShieldCheck size={20} className="rotate-180" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                <AtSign size={14} />
                                Trainer Alias
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                                placeholder="ash.ketchum"
                                required
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                <Lock size={14} />
                                Secret Passphrase
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98]"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <LayoutDashboard size={24} />
                            )}
                            <span className="text-xl tracking-tight">
                                {loading ? 'Authorizing...' : (isLogin ? 'Initiate Session' : 'Registry Entry')}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 font-bold text-sm">
                            {isLogin ? "Lacking entry credentials? " : "Already registered within the manifest? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-600 hover:underline hover:text-indigo-700 underline-offset-4 transition-colors"
                            >
                                {isLogin ? 'Apply for Registry' : 'Initiate Internal Access'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-24 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                            End-to-End Encrypted Portfolio Framework v1.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
