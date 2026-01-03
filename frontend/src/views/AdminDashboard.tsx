import { useState, useEffect } from 'react';
import { api } from '../api';

export function AdminDashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.getAdminUsers()
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleBan = async (id: number) => {
        if (confirm("Are you sure you want to delete this trainer?")) {
            await api.deleteUser(id);
            fetchUsers();
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">
                Admin Control Center
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* System Stats */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">System Overview</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-slate-300">
                            <span>Total Users</span>
                            <span className="font-mono text-blue-400">3</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <span>Active Sessions</span>
                            <span className="font-mono text-green-400">1</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-300">
                            <span>Database Size</span>
                            <span className="font-mono text-yellow-400">24 KB</span>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h3 className="text-xl font-bold mb-4">Trainers</h3>
                    {loading ? <div className="text-slate-500">Loading trainers...</div> : (
                        <div className="space-y-4">
                            {users.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                                    <div>
                                        <div className="font-bold">{user.username}</div>
                                        <div className="text-xs text-slate-400">{user.role} • Lvl {user.level}</div>
                                    </div>
                                    <button
                                        onClick={() => handleBan(user.id)}
                                        className="text-xs bg-red-900/50 text-red-400 px-2 py-1 rounded hover:bg-red-900 border border-red-800"
                                    >
                                        Ban
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
