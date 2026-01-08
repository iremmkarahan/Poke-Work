import { useState, useEffect } from 'react';
import { api, type DashboardData } from '../api';
import {
    User,
    Camera,
    Save,
    AtSign,
    ShieldCheck,
    Info,
    RefreshCcw
} from 'lucide-react';

export function Profile() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        api.getDashboard()
            .then(data => {
                setData(data);
                setUsername(data.trainerName);
                setProfilePictureUrl(data.profilePictureUrl || '');
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const updatedData = await api.updateProfile(username, profilePictureUrl);
            setData(updatedData);
            setMessage({ type: 'success', text: 'Identity manifest updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Synchronization failed. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-slate-500 animate-pulse text-center font-medium">Retrieving identity data...</div>;
    if (!data) return <div className="p-12 text-rose-500 text-center font-bold">Failed to initialize profile view.</div>;

    return (
        <div className="max-w-4xl mx-auto pb-12">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center shadow-inner">
                    <User size={40} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Identity Settings</h2>
                    <p className="text-slate-500 font-medium">Manage your public professional profile and trainer persona.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-card flex flex-col items-center">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-slate-50 flex items-center justify-center transition-transform group-hover:scale-105">
                                {profilePictureUrl ? (
                                    <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-4xl text-indigo-200">
                                        <User size={64} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2.5 rounded-full shadow-lg border-4 border-white cursor-pointer hover:bg-indigo-700 transition-colors">
                                <Camera size={16} />
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold text-slate-900">{data.trainerName}</h3>
                            <div className="flex items-center gap-2 justify-center mt-1">
                                <span className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-md border border-slate-100">
                                    {data.role}
                                </span>
                                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-md border border-indigo-100">
                                    Lvl {data.level}
                                </span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-50 my-6" />

                        <div className="space-y-4 w-full text-slate-500">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold uppercase tracking-widest opacity-60">Status</span>
                                <span className="font-bold text-indigo-600 italic">Verified Identity</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-bold uppercase tracking-widest opacity-60">Evolution</span>
                                <span className="font-bold text-slate-900">{data.evolutionStage}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -translate-y-16 translate-x-16 opacity-30" />
                        <div className="relative z-1">
                            <ShieldCheck size={32} className="text-indigo-300 mb-4" />
                            <h4 className="font-bold text-lg mb-2">Portfolio Ready</h4>
                            <p className="text-indigo-200 text-xs font-medium leading-relaxed opacity-80">
                                Your profile metrics are verified and ready to be integrated into your professional resume.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-card h-full">
                        <form onSubmit={handleSave} className="space-y-8 h-full flex flex-col">
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    <AtSign size={14} />
                                    Trainer Pseudonym
                                </label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all"
                                    placeholder="Enter your professional alias"
                                    required
                                />
                                <p className="text-[10px] text-slate-400 font-medium px-1 italic">This name will be visible across the global leaderboard.</p>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                    <Camera size={14} />
                                    Avatar Resource Link
                                </label>
                                <input
                                    type="url"
                                    value={profilePictureUrl}
                                    onChange={(e) => setProfilePictureUrl(e.target.value)}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all"
                                    placeholder="https://example.com/professional-avatar.jpg"
                                />
                                <p className="text-[10px] text-slate-400 font-medium px-1 italic">Provide a direct URL to a professional headshot or custom avatar.</p>
                            </div>

                            {message && (
                                <div className={`p-5 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {message.type === 'success' ? <ShieldCheck size={20} /> : <Info size={20} />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}

                            <div className="mt-auto pt-10">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3"
                                >
                                    {saving ? (
                                        <RefreshCcw size={22} className="animate-spin" />
                                    ) : (
                                        <Save size={22} />
                                    )}
                                    <span className="text-lg tracking-tight">{saving ? 'Synchronizing...' : 'Save Manifest Changes'}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
