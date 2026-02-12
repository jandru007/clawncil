'use client';

import { useState, useEffect } from 'react';
import { useAgentContext } from '@/lib/agent-context';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'queued' | 'progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
  tags: string[];
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'bg-zinc-500' },
  { id: 'queued', label: 'Queued', color: 'bg-violet-500' },
  { id: 'progress', label: 'In Progress', color: 'bg-orange-500' },
  { id: 'review', label: 'To Review', color: 'bg-amber-500' },
  { id: 'completed', label: 'Completed', color: 'bg-emerald-500' },
];

export function TasksTab() {
  const { agents } = useAgentContext();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' as const });

  // Load tasks from Supabase
  useEffect(() => {
    fetch('/api/tasks')
      .then(r => r.json())
      .then(data => setTasks(data.tasks || []))
      .catch(console.error);
  }, []);

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    if (!draggedTask) return;

    const updatedTask = { ...draggedTask, status };
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    setDraggedTask(null);

    // Persist to Supabase
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTask),
    });
  };

  const createTask = async () => {
    if (!newTask.title) return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      tags: [],
    };

    setTasks(prev => [...prev, task]);
    setShowModal(false);
    setNewTask({ title: '', description: '', priority: 'medium' });

    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
  };

  const getTasksByStatus = (status: Task['status']) => tasks.filter(t => t.status === status);

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-3 kanban-scroll">
        <div className="flex h-full gap-3 min-w-max">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-72 flex flex-col">
              <div className="glass p-3 border border-white/10 border-b-0 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2", col.color, col.id === 'progress' && "animate-pulse")} />
                  <span className="font-medium text-sm text-zinc-300 font-inter">{col.label}</span>
                  <span className="text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5">{getTasksByStatus(col.id as Task['status']).length}</span>
                </div>
                {col.id === 'todo' && (
                  <button onClick={() => setShowModal(true)} className="text-zinc-600 hover:text-zinc-200 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14"/>
                      <path d="M12 5v14"/>
                    </svg>
                  </button>
                )}
              </div>
              <div 
                className="flex-1 glass border border-white/10 p-2 overflow-y-auto space-y-2 min-h-0"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id as Task['status'])}
              >
                {getTasksByStatus(col.id as Task['status']).map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className={cn(
                      "p-3 bg-zinc-900/80 border cursor-grab active:cursor-grabbing transition-all hover:translate-y-[-2px] hover:shadow-lg",
                      task.priority === 'high' && "border-red-500/50",
                      task.priority === 'medium' && "border-zinc-700",
                      task.priority === 'low' && "border-blue-500/50",
                    )}
                  >
                    <p className="text-sm text-white font-medium mb-1">{task.title}</p>
                    {task.description && (
                      <p className="text-xs text-zinc-500 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 border",
                        task.priority === 'high' && "text-red-400 border-red-500/30 bg-red-500/10",
                        task.priority === 'medium' && "text-zinc-400 border-zinc-500/30 bg-zinc-500/10",
                        task.priority === 'low' && "text-blue-400 border-blue-500/30 bg-blue-500/10",
                      )}>
                        {task.priority}
                      </span>
                      {task.assignee && (
                        <span className="text-[10px] text-zinc-500">@{task.assignee}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white font-inter">New Task</h3>
              <button onClick={() => setShowModal(false)} className="text-zinc-500 hover:text-white">&times;</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task title..."
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Description..."
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2 text-sm text-white focus:border-orange-500/50 outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1.5 block font-inter">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setNewTask({ ...newTask, priority: p })}
                      className={cn(
                        "flex-1 px-3 py-2 text-sm border transition-all",
                        newTask.priority === p
                          ? p === 'high' ? "bg-red-500/20 border-red-500 text-red-400" :
                            p === 'medium' ? "bg-zinc-700 border-zinc-600 text-white" :
                            "bg-blue-500/20 border-blue-500 text-blue-400"
                          : "bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                      )}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-zinc-800 text-zinc-400 text-sm hover:bg-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createTask}
                  disabled={!newTask.title}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white text-sm hover:bg-orange-500 disabled:opacity-50 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
