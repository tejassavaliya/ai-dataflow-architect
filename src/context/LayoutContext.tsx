import { createContext, useContext, useState, ReactNode } from 'react';

type Density = 'comfortable' | 'compact';
type Panel = 'chat' | 'canvas' | 'properties';

type LayoutContextType = {
  density: Density;
  setDensity: (density: Density) => void;
  isPanelOpen: Record<Panel, boolean>;
  togglePanel: (panel: Panel) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [density, setDensity] = useState<Density>('comfortable');
  const [isPanelOpen, setIsPanelOpen] = useState<Record<Panel, boolean>>({
    chat: true,
    canvas: true,
    properties: true,
  });

  const togglePanel = (panel: Panel) => {
    setIsPanelOpen(prev => ({
      ...prev,
      [panel]: !prev[panel],
    }));
  };

  return (
    <LayoutContext.Provider value={{ density, setDensity, isPanelOpen, togglePanel }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
