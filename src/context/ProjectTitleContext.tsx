'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const ProjectTitleContext = createContext<{
  projectTitle: string | null;
  setProjectTitle: (title: string | null) => void;
}>({ projectTitle: null, setProjectTitle: () => {} });

export function ProjectTitleProvider({ children }: { children: ReactNode }) {
  const [projectTitle, setProjectTitleState] = useState<string | null>(null);
  const setProjectTitle = useCallback((title: string | null) => setProjectTitleState(title), []);
  return (
    <ProjectTitleContext.Provider value={{ projectTitle, setProjectTitle }}>
      {children}
    </ProjectTitleContext.Provider>
  );
}

export function useProjectTitle() {
  return useContext(ProjectTitleContext);
}
