import {
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeChange,
  Handle,
  MiniMap,
  Node,
  NodeChange,
  NodeTypes,
  Position,
  ReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Cog, Database, Server, MessageCircle, Sparkles } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLayout } from '../context/LayoutContext';
import { FlowNode, NodeStatus, useFlowStore } from '../store/useFlowStore';

// Status helper functions
function getStatusBackground(data: FlowNode) {
  switch (data.status) {
    case 'pending':
      return 'bg-amber-50/80 dark:bg-amber-950/20';
    case 'partial':
      return 'bg-blue-50/80 dark:bg-blue-950/20';
    case 'complete':
      return 'bg-emerald-50/80 dark:bg-emerald-950/20';
    case 'error':
      return 'bg-red-50/80 dark:bg-red-950/20';
    default:
      return 'bg-white/80 dark:bg-zinc-950/60';
  }
}

function getStatusDot(status: NodeStatus) {
  switch (status) {
    case 'pending':
      return 'bg-amber-400 animate-pulse';
    case 'partial':
      return 'bg-blue-400 animate-pulse';
    case 'complete':
      return 'bg-emerald-400';
    case 'error':
      return 'bg-red-400 animate-pulse';
    default:
      return 'bg-zinc-400';
  }
}

function getStatusBar(status: NodeStatus) {
  switch (status) {
    case 'pending':
      return 'bg-gradient-to-r from-amber-400 to-amber-500';
    case 'partial':
      return 'bg-gradient-to-r from-blue-400 to-blue-500';
    case 'complete':
      return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
    case 'error':
      return 'bg-gradient-to-r from-red-400 to-red-500';
    default:
      return 'bg-gradient-to-r from-zinc-400 to-zinc-500';
  }
}

// Custom Node Component
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
  const { density } = useLayout();
  const { selectNode } = useFlowStore();

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectNode(data.id);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => selectNode(data.id)}
      onKeyDown={handleKeyDown}
      aria-label={`${data.type} node: ${data.label}, status: ${data.status}${selected ? ', selected' : ''}`}
      aria-pressed={selected}
      className={`group relative text-left ${density === 'compact' ? 'p-6' : 'p-8'} rounded-2xl border-2 transition-all duration-300 ${selected ? 'border-indigo-400 dark:border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105' : 'border-zinc-200/80 dark:border-zinc-700/80'} ${getStatusBackground(data)} backdrop-blur-sm ring-offset-2 hover:shadow-xl hover:scale-102 cursor-pointer min-w-[300px] max-w-[350px] min-h-[140px] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      <div
        className={`flex items-center ${density === 'compact' ? 'gap-3' : 'gap-4'}`}
      >
        <div
          className={`flex ${density === 'compact' ? 'h-14 w-14' : 'h-16 w-16'} items-center justify-center rounded-xl bg-gradient-to-br ${iconBg(data)} text-white shadow-lg ring-2 ring-white/20`}
          aria-hidden="true"
        >
          {data.type === 'source' && (
            <Database size={density === 'compact' ? 24 : 28} aria-label="Database source" />
          )}
          {data.type === 'transform' && (
            <Cog size={density === 'compact' ? 24 : 28} aria-label="Transform operation" />
          )}
          {data.type === 'destination' && (
            <Server size={density === 'compact' ? 24 : 28} aria-label="Server destination" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium mb-1">
            {data.type}
          </div>
          <div
            className={`font-semibold text-zinc-900 dark:text-zinc-100 truncate ${density === 'compact' ? 'text-sm' : 'text-base'}`}
          >
            {data.label}
          </div>
          <div
            className={`flex items-center gap-2 mt-2 ${density === 'compact' ? 'text-xs' : 'text-sm'}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getStatusDot(data.status)}`}
              aria-hidden="true"
            ></div>
            <span className="text-zinc-600 dark:text-zinc-300 capitalize font-medium" aria-label={`Status: ${data.status}`}>
              {data.status}
            </span>
          </div>
        </div>
      </div>

      {/* Status indicator bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl ${getStatusBar(data.status)}`}
      ></div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 -z-10"></div>
      )}

      {/* Connection Handles */}
      {data.type !== 'destination' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-indigo-500 border-2 border-white shadow-lg"
          style={{ right: -6 }}
          aria-label={`Connect from ${data.label}`}
        />
      )}
      {data.type !== 'source' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-indigo-500 border-2 border-white shadow-lg"
          style={{ left: -6 }}
          aria-label={`Connect to ${data.label}`}
        />
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

export default function Canvas() {
  const { nodes, edges, selectedNodeId, selectNode, addEdge } = useFlowStore();

  const [reactFlowNodes, setReactFlowNodes] = useState<Node[]>([]);
  const [reactFlowEdges, setReactFlowEdges] = useState<Edge[]>([]);

  // Keyboard navigation for canvas
  const handleCanvasKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedNodeId) return;
    
    const currentNode = nodes.find(n => n.id === selectedNodeId);
    if (!currentNode) return;

    let targetNodeId: string | undefined;
    
    switch (e.key) {
      case 'ArrowLeft':
        // Navigate to previous node type
        if (currentNode.type === 'transform') {
          targetNodeId = nodes.find(n => n.type === 'source')?.id;
        } else if (currentNode.type === 'destination') {
          targetNodeId = nodes.find(n => n.type === 'transform')?.id;
        }
        break;
      case 'ArrowRight':
        // Navigate to next node type
        if (currentNode.type === 'source') {
          targetNodeId = nodes.find(n => n.type === 'transform')?.id;
        } else if (currentNode.type === 'transform') {
          targetNodeId = nodes.find(n => n.type === 'destination')?.id;
        }
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Navigate within same type
        const sameTypeNodes = nodes.filter(n => n.type === currentNode.type);
        const currentIndex = sameTypeNodes.findIndex(n => n.id === selectedNodeId);
        if (e.key === 'ArrowUp' && currentIndex > 0) {
          targetNodeId = sameTypeNodes[currentIndex - 1].id;
        } else if (e.key === 'ArrowDown' && currentIndex < sameTypeNodes.length - 1) {
          targetNodeId = sameTypeNodes[currentIndex + 1].id;
        }
        break;
      case 'Escape':
        selectNode(undefined);
        return;
    }
    
    if (targetNodeId) {
      e.preventDefault();
      selectNode(targetNodeId);
    }
  }, [selectedNodeId, nodes, selectNode]);

  // Convert FlowStore nodes to ReactFlow nodes
  useEffect(() => {
    const positions = { source: 0, transform: 1, destination: 2 };

    const calculatedNodes = nodes.map((node) => {
      const colIndex = positions[node.type] ?? 0;
      const nodesInCol = nodes.filter((n) => n.type === node.type);
      const nodeIndexInCol = nodesInCol.findIndex((n) => n.id === node.id);

      return {
        id: node.id,
        type: 'custom',
        position: {
          x: colIndex * 500,
          y: nodeIndexInCol * 200 + 50,
        },
        data: {
          ...node,
          selected: selectedNodeId === node.id,
        },
        selected: selectedNodeId === node.id,
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
      };
    });

    setReactFlowNodes(calculatedNodes);
  }, [nodes, selectedNodeId]);

  useEffect(() => {
    const formattedEdges: Edge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: 'smoothstep',
      animated: true,
      style: {
        stroke: '#6366f1',
        strokeWidth: 3,
      },
      markerEnd: {
        type: 'arrowclosed',
        width: 25,
        height: 25,
        color: '#6366f1',
      },
    }));

    setReactFlowEdges(formattedEdges);
  }, [edges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (params.source && params.target) {
        // Generate a unique edge ID
        const edgeId = `edge-${params.source}-${params.target}-${Date.now()}`;

        // Create the new edge
        const newEdge = {
          id: edgeId,
          from: params.source,
          to: params.target,
        };

        // Add the edge to the store
        addEdge(newEdge);

        console.log('Connection created:', newEdge);
      }
    },
    [addEdge]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      selectNode(node.id);
    },
    [selectNode]
  );

  const onNodesChange = useCallback((changes: NodeChange[]) => {
    setReactFlowNodes((nds) => applyNodeChanges(changes, nds));
  }, []);

  const onEdgesChange = useCallback((changes: EdgeChange[]) => {
    setReactFlowEdges((eds) => applyEdgeChanges(changes, eds));
  }, []);

  return (
    <div 
      className="relative h-full flex flex-col min-h-0 outline-none"
      role="application"
      aria-label="Data flow canvas"
      tabIndex={0}
      onKeyDown={handleCanvasKeyDown}
    >
      {/* Empty State Message */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="text-center max-w-md px-6 py-8 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-lg">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
              <MessageCircle size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
              Start Your Data Flow
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              Describe your data integration needs in the chat to begin building your pipeline.
            </p>
            <div className="flex items-center justify-center gap-2 text-xs text-indigo-600 dark:text-indigo-400">
              <Sparkles size={14} />
              <span>Try: "Connect Shopify orders to Snowflake"</span>
            </div>
          </div>
        </div>
      )}
      
      <ReactFlow
        connectionLineStyle={{
          stroke: '#6366f1',
          strokeWidth: 3,
        }}
        nodes={reactFlowNodes}
        onNodesChange={onNodesChange}
        edges={reactFlowEdges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        fitView
        fitViewOptions={{
          padding: 0.1,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 2,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
        aria-describedby="canvas-instructions"
      >
        <Background gap={16} size={1} color="#64748b" className="opacity-80" />
        <Controls
          className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl shadow-lg backdrop-blur-sm"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
          aria-label="Canvas controls"
        />
        <MiniMap
          className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl shadow-lg backdrop-blur-sm"
          nodeColor={(node) => {
            const data = node.data as unknown as FlowNode;
            if (data.type === 'source') return '#6366f1';
            if (data.type === 'transform') return '#d946ef';
            return '#10b981';
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable={true}
          zoomable={true}
          aria-label="Canvas minimap"
        />
      </ReactFlow>
      <div id="canvas-instructions" className="sr-only">
        Use arrow keys to navigate between nodes. Press Enter or Space to select a node. Press Escape to deselect.
      </div>
    </div>
  );
}

function statusColor(n: FlowNode) {
  if (n.status === 'pending') return 'ring-pending/50';
  if (n.status === 'partial') return 'ring-partial/50';
  if (n.status === 'complete') return 'ring-complete/50';
  return 'ring-error/50';
}

function iconBg(n: FlowNode) {
  if (n.type === 'source') return 'from-indigo-500 to-blue-500';
  if (n.type === 'transform') return 'from-fuchsia-500 to-purple-500';
  return 'from-emerald-500 to-green-500';
}
