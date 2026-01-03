export function Header({ title }: { title: string }) {
    return (
        <header className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-700/50 px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                {title}
            </h1>
            <div className="flex items-center space-x-4">
                <div className="bg-slate-800 px-4 py-2 rounded-full text-sm font-mono border border-slate-700 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-slate-400">System Online</span>
                </div>
            </div>
        </header>
    );
}
