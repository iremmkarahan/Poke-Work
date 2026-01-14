

export function Header({ title }: { title: string }) {
    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 px-8 py-4 flex justify-between items-center shadow-sm">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {title}
            </h1>
            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs ring-2 ring-indigo-100">
                        IK
                    </div>
                </div>
            </div>
        </header>
    );
}
