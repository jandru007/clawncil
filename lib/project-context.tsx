'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';

export interface Project {
  id: string;
  name: string;
  description?: string;
}

interface ProjectContextType {
  projects: Project[];
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  selectProject: (project: Project) => void;
  createProject: (name: string, description?: string) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data.projects || []);
      // Auto-select first project if none selected
      if (!selectedProject && data.projects?.length > 0) {
        setSelectedProject(data.projects[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  }, [selectedProject]);

  const createProject = useCallback(async (name: string, description?: string) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description }),
      });
      if (!response.ok) throw new Error('Failed to create project');
      const data = await response.json();
      setProjects(prev => [...prev, data.project]);
      setSelectedProject(data.project);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create project');
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        selectedProject,
        loading,
        error,
        fetchProjects,
        selectProject: setSelectedProject,
        createProject,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjectContext() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjectContext must be used within ProjectProvider');
  }
  return context;
}
