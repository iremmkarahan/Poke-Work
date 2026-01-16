import { useState } from 'react'
import { api } from '../api'
import {
    Trophy,
    AtSign,
    Lock,
    Target,
    Loader2,
    Sparkles,
    ArrowRight
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
            setError(err.message || (isLogin ? 'Login failed. Please check your credentials.' : 'Registration failed. Please try a different username.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row items-stretch overflow-hidden">
            {/* Left Side: Branding/Intro */}
            <div className="flex-1 bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 p-12 md:p-24 flex flex-col justify-between relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl pointer-events-none" />

                <div className="relative z-1">
                    <div className="flex items-center space-x-3 font-black text-3xl tracking-tighter text-white mb-16 group cursor-default">
                        <div className="w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                            <Sparkles className="text-indigo-600 w-6 h-6" />
                        </div>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">Poke-Work</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
                        Elevate <br />
                        <span className="text-indigo-300 italic">Every Day</span> <br />
                        Work.
                    </h1>
                    <p className="text-xl md:text-2xl text-indigo-100/90 font-medium max-w-lg leading-relaxed mb-12">
                        Your personal achievement hub. Track your goals, build powerful habits, and turn your daily productivity into a rewarding journey.
                    </p>
                </div>

                <div className="relative z-1 grid grid-cols-2 gap-8 max-w-md">
                    <div className="space-y-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <Trophy className="text-yellow-400" size={32} />
                        <div>
                            <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">Track Progress</h3>
                            <p className="text-indigo-200/70 text-xs font-medium mt-1">Visualize your journey with beautiful metrics.</p>
                        </div>
                    </div>
                    <div className="space-y-4 p-4 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                        <Target className="text-indigo-400" size={32} />
                        <div>
                            <h3 className="font-bold text-white uppercase tracking-widest text-[10px]">Strategic Milestones</h3>
                            <p className="text-indigo-200/70 text-xs font-medium mt-1">Break down big dreams into small, daily wins.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Auth Form */}
            <div className="flex-1 p-12 md:p-24 flex items-center justify-center bg-white">
                <div className="w-full max-w-md">
                    <div className="mb-12">
                        <h2 className="text-5xl font-black text-slate-900 mb-3 tracking-tight">
                            {isLogin ? 'Welcome back.' : 'Take the leap.'}
                        </h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed">
                            {isLogin ? 'Sign in to continue your journey and conquer your goals.' : 'Join a community of high-achievers and start tracking today.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-rose-50 text-rose-700 rounded-2xl border border-rose-100 flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Lock size={20} className="rotate-180" />
                            <span className="text-sm font-bold">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                <AtSign size={14} className="text-indigo-500" />
                                Your Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
                                placeholder="alex.jones"
                                required
                            />
                        </div>

                        <div className="space-y-4">
                            <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
                                <Lock size={14} className="text-indigo-500" />
                                Your Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-5 px-8 text-slate-900 font-bold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300 shadow-sm"
                                placeholder="••••••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-6 rounded-3xl transition-all shadow-2xl shadow-indigo-200 flex items-center justify-center gap-3 active:scale-[0.97] group"
                        >
                            {loading ? (
                                <Loader2 size={24} className="animate-spin" />
                            ) : (
                                <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                            )}
                            <span className="text-xl tracking-tight">
                                {loading ? 'One moment...' : (isLogin ? 'Sign In Now' : 'Create My Account')}
                            </span>
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <p className="text-slate-400 font-bold text-sm">
                            {isLogin ? "New to Poke-Work? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="text-indigo-600 hover:underline hover:text-indigo-800 underline-offset-4 transition-colors"
                            >
                                {isLogin ? 'Create an account' : 'Sign in here'}
                            </button>
                        </p>
                    </div>

                    <div className="mt-24 pt-8 border-t border-slate-50 text-center">
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">
                            Personal Productivity & Goal Achievement Framework v2.0.0
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
