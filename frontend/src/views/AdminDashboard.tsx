import { useState, useEffect } from 'react';
import { api } from '../api';
import {
    ShieldAlert,
    Users,
    Activity,
    Trash2,
    Search,
    ChevronRight,
    Loader2,
    ShieldCheck
} from 'lucide-react';

interface UserRecord {
    id: number;
    username: string;
    role: string;
}

export function AdminDashboard() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        api.getAdminUsers()
            .then((data: UserRecord[]) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err: any) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleDelete = async (userId: number) => {
        if (!confirm("Delete this user record? This action is irreversible.")) return;
        try {
            await api.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
        } catch (err) {
            alert("Failed to terminate user record.");
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-10 pb-12">
            <div className="bg-rose-600 p-12 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-500 rounded-full translate-x-1/4 -translate-y-1/4 opacity-40 pointer-events-none" />

                <div className="relative z-1 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-rose-200 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <ShieldAlert size={14} />
                            Administrative Protocol Active
                        </div>
                        <h2 className="text-5xl font-black tracking-tighter mb-4">Centralized Control</h2>
                        <p className="text-rose-100/80 font-medium max-w-xl text-lg leading-relaxed">
                            Monitor user distribution, manage identity records, and maintain the integrity of the professional training manifest.
                        </p>
                    </div>

                    <div className="flex items-center gap-12 bg-rose-700/30 p-8 rounded-[2rem] backdrop-blur-sm border border-white/10">
                        <div className="text-center">
                            <div className="text-4xl font-black leading-none">{users.length}</div>
                            <div className="text-[10px] font-black text-rose-200 uppercase tracking-widest mt-2">Entities</div>
                        </div>
                        <div className="h-10 w-px bg-white/20" />
                        <div className="text-center">
                            <div className="text-4xl font-black leading-none">{users.filter(u => u.role === 'ADMIN').length}</div>
                            <div className="text-[10px] font-black text-rose-200 uppercase tracking-widest mt-2">Privileged</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-card overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                        <Users size={20} className="text-indigo-600" />
                        <h4 className="text-xl font-black text-slate-900 tracking-tight">User Manifest</h4>
                    </div>

                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input
                            type="text"
                            placeholder="Filter by alias..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-3 pl-14 pr-6 text-slate-900 font-semibold focus:outline-none focus:border-indigo-600 transition-all placeholder:text-slate-300"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-24 flex flex-col items-center justify-center text-slate-400 gap-4">
                        <Loader2 size={48} className="animate-spin text-indigo-100" />
                        <span className="font-bold text-sm uppercase tracking-widest">Synchronizing records...</span>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/50">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Identification</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry ID</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Access Level</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Operations</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold group-hover:border-indigo-200 group-hover:bg-white group-hover:text-indigo-600 transition-all">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-bold text-slate-900">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-mono text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">USR-{user.id.toString().padStart(4, '0')}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border ${user.role === 'ADMIN'
                                                    ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                    : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100">
                                                    <Activity size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-3 text-slate-400 hover:text-rose-600 hover:bg-white rounded-xl shadow-sm transition-all border border-transparent hover:border-slate-100"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredUsers.length === 0 && (
                            <div className="p-24 text-center">
                                <Search size={48} className="text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-400 font-bold italic">No user entities match the criteria.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg">
                        <ShieldCheck size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold tracking-tight">Security Manifest</h4>
                        <p className="text-slate-400 text-sm font-medium">System logging and audit trails are active.</p>
                    </div>
                </div>
                <button className="px-10 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center gap-2 group shadow-xl">
                    Export Audit log
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
