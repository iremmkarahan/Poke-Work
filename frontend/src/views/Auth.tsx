import { useState } from 'react'
import { api } from '../api'

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

            // Store Basic Auth header for all subsequent requests
            const authHeader = 'Basic ' + btoa(username + ':' + password);
            localStorage.setItem('authHeader', authHeader);

            onAuthSuccess();
        } catch (err: any) {
            setError(isLogin ? 'Login failed. Check your credentials.' : 'Registration failed. Username might be taken.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl w-96 border border-slate-700">
                <div className="text-center mb-8">
                    <div className="text-4xl mb-2">{isLogin ? '👋' : '🎓'}</div>
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        {isLogin ? 'Welcome Back' : 'Join Poke-Work'}
                    </h2>
                    <p className="text-slate-400 text-sm">
                        {isLogin ? 'Pick up where you left off' : 'Start your productivity journey'}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 text-red-400 text-sm bg-red-900/50 p-2 rounded text-center border border-red-800">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="Ash Ketchum"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-slate-400 mb-1 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded p-2 focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Login' : 'Start Adventure')}
                    </button>
                </form>

                <div className="mt-6 text-center text-xs text-slate-500">
                    {isLogin ? "Don't have an account? " : "Already a trainer? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 hover:underline font-medium"
                    >
                        {isLogin ? 'Register now' : 'Login here'}
                    </button>
                </div>
            </div>
        </div>
    )
}
