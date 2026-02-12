'use client';

import { useState } from 'react';

const settingsMenu = [
  {
    title: 'General',
    items: [
      { id: 'visuals', label: 'Visuals & Appearance', icon: 'globe' },
      { id: 'agents', label: 'Agent Settings', icon: 'bot' },
    ],
  },
  {
    title: 'Workspace',
    items: [
      { id: 'tasks', label: 'Task Board', icon: 'layout' },
      { id: 'meeting', label: 'Meeting Room', icon: 'message' },
      { id: 'analytics', label: 'Analytics', icon: 'barChart' },
    ],
  },
  {
    title: 'System',
    items: [
      { id: 'system', label: 'System & Security', icon: 'settings' },
    ],
  },
];

export function SettingsTab() {
  const [activePanel, setActivePanel] = useState<string | null>(null);

  if (activePanel) {
    return (
      <div className="h-full overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto py-8 px-4">
          <button 
            onClick={() => setActivePanel(null)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            <span>Back</span>
          </button>
          
          <div className="glass p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 font-inter capitalize">{activePanel} Settings</h2>
            <p className="text-zinc-400">Configure your {activePanel} preferences here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto custom-scrollbar">
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h2 className="text-xl font-bold text-white mb-6 font-inter">Settings</h2>
        
        {/* User Profile */}
        <div className="bg-zinc-900/50 border border-zinc-800 p-4 mb-6 hover:border-zinc-700 transition-colors cursor-pointer">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                <span className="text-lg text-zinc-400">J</span>
              </div>
              <div>
                <p className="text-white font-medium font-inter">Manager</p>
                <p className="text-xs text-zinc-500">Admin</p>
              </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingsMenu.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs text-zinc-500 uppercase font-bold mb-3 px-1 font-inter">{section.title}</h3>
              <div className="bg-zinc-900/50 border border-zinc-800 overflow-hidden">
                {section.items.map((item, i) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePanel(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors ${
                      i !== section.items.length - 1 ? 'border-b border-zinc-800' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <SettingsIcon name={item.icon} />
                      <span className="text-sm text-zinc-200">{item.label}</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                      <path d="m9 18 6-6-6-6"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SettingsIcon({ name }: { name: string }) {
  const icons: Record<string, React.ReactNode> = {
    globe: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M2 12h20"/></svg>,
    bot: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
    layout: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>,
    message: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    barChart: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>,
    settings: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-400"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l-.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  };
  
  return icons[name] || null;
}
