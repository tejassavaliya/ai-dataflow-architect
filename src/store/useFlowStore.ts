import { create } from 'zustand';

export type NodeType = 'source' | 'transform' | 'destination';
export type NodeStatus = 'pending' | 'partial' | 'complete' | 'error';

export interface FlowNode {
  id: string;
  type: NodeType;
  label: string;
  status: NodeStatus;
  properties?: Record<string, any>;
}

export interface FlowEdge {
  id: string;
  from: string;
  to: string;
}

interface State {
  nodes: FlowNode[];
  edges: FlowEdge[];
  selectedNodeId?: string;
  setNodes: (nodes: FlowNode[]) => void;
  setEdges: (edges: FlowEdge[]) => void;
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (edgeId: string) => void;
  selectNode: (id?: string) => void;
  updateNode: (id: string, patch: Partial<FlowNode>) => void;
  reset: () => void;
  resetFlow: () => void;
}

export const useFlowStore = create<State>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: undefined,
  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addEdge: (edge) => set({ edges: [...get().edges, edge] }),
  removeEdge: (edgeId) =>
    set({ edges: get().edges.filter((e) => e.id !== edgeId) }),
  selectNode: (id) => set({ selectedNodeId: id }),
  updateNode: (id, patch) =>
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? {
              ...n,
              ...patch,
              properties: { ...n.properties, ...patch.properties },
            }
          : n
      ),
    }),
  reset: () => set({ nodes: [], edges: [], selectedNodeId: undefined }),
  resetFlow: () => {
    set({ nodes: [], edges: [], selectedNodeId: undefined });
    // Clear any related state in other stores if needed
    // For example: useSlots.getState().reset()
  },
}));
