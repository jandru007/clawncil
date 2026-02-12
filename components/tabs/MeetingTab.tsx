'use client';

export function MeetingTab() {
  return (
    <div className="h-full flex">
      {/* Chat Area */}
      <div className="flex-[2] flex flex-col min-w-0 bg-black/50 border-r border-white/10 h-full">
        <div className="h-14 border-b border-white/10 flex items-center px-4 bg-zinc-950/30 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-700/50 flex items-center justify-center border border-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-200">
                <line x1="4" x2="20" y1="9" y2="9"/>
                <line x1="4" x2="20" y1="15" y2="15"/>
                <line x1="10" x2="8" y1="3" y2="21"/>
                <line x1="16" x2="14" y1="3" y2="21"/>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm font-inter">general</h3>
              <p className="text-xs text-zinc-600">General discussion</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          <div className="text-center py-8 text-zinc-600 text-sm">Select a channel to start chatting</div>
        </div>

        <div className="p-3 border-t border-white/10 bg-zinc-950/30">
          <div className="flex gap-2">
            <button className="p-2.5 hover:bg-white/5 text-zinc-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </button>
            <input 
              type="text" 
              placeholder="Message... (use @ to mention)" 
              className="flex-1 bg-zinc-900/50 border border-zinc-800 px-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500/50 transition-colors font-inter"
            />
            <button className="p-2.5 bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-lg shadow-orange-500/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m22 2-7 20-4-9-9-4Z"/>
                <path d="M22 2 11 13"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Channel List + Live Feed */}
      <div className="flex-1 flex flex-col glass border-l border-white/10 shrink-0 h-full">
        <div className="h-1/3 flex flex-col border-b border-white/10">
          <div className="p-3 border-b border-white/10 flex items-center justify-between shrink-0">
            <span className="font-semibold text-sm text-white font-inter">Channels</span>
            <button className="p-1 hover:bg-white/5 text-zinc-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5v14"/>
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="p-2 bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <span className="text-sm"># general</span>
            </div>
          </div>
        </div>

        <div className="h-2/3 flex flex-col">
          <div className="p-3 border-b border-white/10 shrink-0">
            <span className="font-semibold text-sm text-white flex items-center gap-2 font-inter">
              <span className="w-2 h-2 bg-emerald-500 animate-pulse"></span>
              Live Updates
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="text-center py-8 text-zinc-600 text-sm">No updates yet</div>
          </div>
        </div>
      </div>
    </div>
  );
}
