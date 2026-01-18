import { useState, useEffect } from 'react';
import { api, type DashboardData } from '../api';
import {
    User,
    Camera,
    Save,
    AtSign,
    ShieldCheck,
    Info,
    RefreshCcw,
    Trophy
} from 'lucide-react';

export function Profile() {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [achievementsCount, setAchievementsCount] = useState(0);

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

        api.getAchievements()
            .then(ach => {
                const unlocked = ach.filter((a: any) => a.unlocked).length;
                setAchievementsCount(unlocked);
            })
            .catch(console.error);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const updatedData = await api.updateProfile(username, profilePictureUrl);
            setData(updatedData);
            setMessage({ type: 'success', text: 'Profile settings updated successfully.' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Synchronization failed. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-12 text-slate-500 animate-pulse text-center font-medium">Retrieving identity data...</div>;
    if (!data) return <div className="p-12 text-rose-500 text-center font-bold">Failed to initialize profile view.</div>;

    return (
        <div className="max-w-5xl mx-auto pb-12">
            <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
                    <User size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Professional Profile</h2>
                    <p className="text-slate-500 font-medium">Manage your professional identity and public account settings.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-card overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Sidebar / Identity Summary */}
                    <div className="lg:col-span-1 bg-slate-50/50 p-10 border-r border-slate-100 flex flex-col items-center">
                        <div className="relative group mb-8">
                            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white flex items-center justify-center transition-transform group-hover:scale-105">
                                {profilePictureUrl ? (
                                    <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-5xl text-indigo-100">
                                        <User size={80} />
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 bg-indigo-600 text-white p-3 rounded-full shadow-lg border-4 border-white cursor-pointer hover:bg-indigo-700 transition-colors">
                                <Camera size={18} />
                            </div>
                        </div>

                        <div className="text-center w-full">
                            <h3 className="text-2xl font-black text-slate-900 leading-tight">{data.trainerName}</h3>
                            <div className="flex items-center gap-2 justify-center mt-3">
                                <span className="px-3 py-1 bg-white text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg border border-slate-100 shadow-sm">
                                    {data.role}
                                </span>
                                <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-md">
                                    Tier {data.level}
                                </span>
                            </div>
                        </div>

                        <div className="w-full h-px bg-slate-200/50 my-10" />

                        <div className="space-y-6 w-full">
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authentication Status</span>
                                <span className="text-sm font-bold text-emerald-600 flex items-center gap-2">
                                    <ShieldCheck size={16} />
                                    System Authenticated
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operational Rank</span>
                                <span className="text-sm font-bold text-slate-900">{data.evolutionStage}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Achievements Unlocked</span>
                                <span className="text-sm font-bold text-amber-600 flex items-center gap-2">
                                    <Trophy size={16} />
                                    {achievementsCount} Milestones
                                </span>
                            </div>
                        </div>

                    </div>

                    {/* Main Settings Form */}
                    <div className="lg:col-span-2 p-12">
                        <form onSubmit={handleSave} className="space-y-10 h-full flex flex-col">
                            <div className="grid grid-cols-1 gap-10">
                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                        <AtSign size={14} className="text-indigo-500" />
                                        Professional Name
                                    </label>
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                                        placeholder="Enter your professional alias"
                                        required
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium px-2">This name is your primary identifier within the operational network.</p>
                                </div>

                                <div className="space-y-4">
                                    <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest px-1">
                                        <Camera size={14} className="text-indigo-500" />
                                        Avatar Resource Link
                                    </label>
                                    <input
                                        type="url"
                                        value={profilePictureUrl}
                                        onChange={(e) => setProfilePictureUrl(e.target.value)}
                                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 focus:bg-white transition-all shadow-sm"
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                    <p className="text-[10px] text-slate-400 font-medium px-2">Provide a secure URL to a professional avatar or identification image.</p>
                                </div>
                            </div>

                            {message && (
                                <div className={`p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                                    {message.type === 'success' ? <ShieldCheck size={20} /> : <Info size={20} />}
                                    <span className="text-sm font-bold">{message.text}</span>
                                </div>
                            )}

                            <div className="mt-auto pt-10">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 group"
                                >
                                    {saving ? (
                                        <RefreshCcw size={22} className="animate-spin" />
                                    ) : (
                                        <Save size={22} className="group-hover:scale-110 transition-transform" />
                                    )}
                                    <span className="text-lg tracking-tight">{saving ? 'Processing...' : 'Save Profile Changes'}</span>
                                </button>
                                <p className="text-center mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Authorized identity updates only</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
