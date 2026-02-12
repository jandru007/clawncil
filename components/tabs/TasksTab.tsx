'use client';

export function TasksTab() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 kanban-scroll">
        <div className="flex h-full gap-3 min-w-max">
          {['To Do', 'Queued', 'In Progress', 'To Review', 'Completed'].map((col, i) => {
            const colors = ['bg-zinc-500', 'bg-violet-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500'];
            return (
              <div key={col} className="w-72 flex flex-col">
                <div className="glass p-3 border border-white/10 border-b-0 flex items-center justify-between bg-zinc-900/50">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2", colors[i], i === 2 && "animate-pulse")} />
                    <span className="font-medium text-sm text-zinc-300 font-inter">{col}</span>
                    <span className="text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5">0</span>
                  </div>
                </div>
                <div className="flex-1 glass border border-white/10 p-2 overflow-y-auto space-y-2 min-h-0">
                  <div className="text-center py-8 text-zinc-600 text-sm">No tasks</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
