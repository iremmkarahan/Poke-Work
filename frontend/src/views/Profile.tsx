import { useState, useEffect } from 'react';
import { api, type DashboardData } from '../api';

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
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err) {
            setMessage({ type: 'error', text: 'Failed to update profile.' });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading profile...</div>;
    if (!data) return <div className="p-8 text-white">Error loading profile.</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-8">User Profile</h2>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-poke-accent mb-4 bg-slate-700 flex items-center justify-center">
                        {profilePictureUrl ? (
                            <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl text-slate-500">👤</span>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Trainer Name</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-poke-accent transition-colors"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Profile Picture URL</label>
                        <input
                            type="url"
                            value={profilePictureUrl}
                            onChange={(e) => setProfilePictureUrl(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-poke-accent transition-colors"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    {message && (
                        <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-poke-accent hover:bg-poke-accent/80 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-poke-accent/20"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
