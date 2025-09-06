import { useFlowStore, FlowNode, NodeStatus } from "../store/useFlowStore";
import { useMemo, useCallback, useEffect, useState } from "react";
import { useLayout } from "../context/LayoutContext";
import { Database, Server, Cog } from "lucide-react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  NodeTypes,
  Connection,
  addEdge,
  Position,
  Handle,
  applyNodeChanges,
  NodeChange,
  applyEdgeChanges,
  EdgeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Status helper functions
function getStatusBackground(data: FlowNode) {
  switch (data.status) {
    case "pending":
      return "bg-amber-50/80 dark:bg-amber-950/20";
    case "partial":
      return "bg-blue-50/80 dark:bg-blue-950/20";
    case "complete":
      return "bg-emerald-50/80 dark:bg-emerald-950/20";
    case "error":
      return "bg-red-50/80 dark:bg-red-950/20";
    default:
      return "bg-white/80 dark:bg-zinc-950/60";
  }
}

function getStatusDot(status: NodeStatus) {
  switch (status) {
    case "pending":
      return "bg-amber-400 animate-pulse";
    case "partial":
      return "bg-blue-400 animate-pulse";
    case "complete":
      return "bg-emerald-400";
    case "error":
      return "bg-red-400 animate-pulse";
    default:
      return "bg-zinc-400";
  }
}

function getStatusBar(status: NodeStatus) {
  switch (status) {
    case "pending":
      return "bg-gradient-to-r from-amber-400 to-amber-500";
    case "partial":
      return "bg-gradient-to-r from-blue-400 to-blue-500";
    case "complete":
      return "bg-gradient-to-r from-emerald-400 to-emerald-500";
    case "error":
      return "bg-gradient-to-r from-red-400 to-red-500";
    default:
      return "bg-gradient-to-r from-zinc-400 to-zinc-500";
  }
}

// Custom Node Component
function CustomNode({ data, selected }: { data: any; selected: boolean }) {
  const { density } = useLayout();
  const { selectNode } = useFlowStore();

  return (
    <div
      onClick={() => selectNode(data.id)}
      className={`group relative text-left ${density === "compact" ? "p-4" : "p-5"} rounded-2xl border-2 transition-all duration-300 ${selected ? "border-indigo-400 dark:border-indigo-500 shadow-lg shadow-indigo-500/20 scale-105" : "border-zinc-200/80 dark:border-zinc-700/80"} ${getStatusBackground(data)} backdrop-blur-sm ring-offset-2 hover:shadow-xl hover:scale-102 cursor-pointer min-w-[180px] max-w-[220px]`}
    >
      <div
        className={`flex items-center ${density === "compact" ? "gap-3" : "gap-4"}`}
      >
        <div
          className={`flex ${density === "compact" ? "h-10 w-10" : "h-12 w-12"} items-center justify-center rounded-xl bg-gradient-to-br ${iconBg(data)} text-white shadow-lg ring-2 ring-white/20`}
        >
          {data.type === "source" && (
            <Database size={density === "compact" ? 16 : 20} />
          )}
          {data.type === "transform" && (
            <Cog size={density === "compact" ? 16 : 20} />
          )}
          {data.type === "destination" && (
            <Server size={density === "compact" ? 16 : 20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-medium mb-1">
            {data.type}
          </div>
          <div
            className={`font-semibold text-zinc-900 dark:text-zinc-100 truncate ${density === "compact" ? "text-sm" : "text-base"}`}
          >
            {data.label}
          </div>
          <div
            className={`flex items-center gap-2 mt-2 ${density === "compact" ? "text-xs" : "text-sm"}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${getStatusDot(data.status)}`}
            ></div>
            <span className="text-zinc-600 dark:text-zinc-300 capitalize font-medium">
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
      {data.type !== "destination" && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-indigo-500 border-2 border-white shadow-lg"
          style={{ right: -6 }}
        />
      )}
      {data.type !== "source" && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-indigo-500 border-2 border-white shadow-lg"
          style={{ left: -6 }}
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

  // Convert FlowStore nodes to ReactFlow nodes
  useEffect(() => {
    const positions = { source: 0, transform: 1, destination: 2 };

    const calculatedNodes = nodes.map((node) => {
      const colIndex = positions[node.type] ?? 0;
      const nodesInCol = nodes.filter((n) => n.type === node.type);
      const nodeIndexInCol = nodesInCol.findIndex((n) => n.id === node.id);

      return {
        id: node.id,
        type: "custom",
        position: {
          x: colIndex * 400,
          y: nodeIndexInCol * 150 + 50,
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
      type: "smoothstep",
      animated: true,
      style: {
        stroke: "#6366f1",
        strokeWidth: 3,
      },
      markerEnd: {
        type: "arrowclosed",
        width: 25,
        height: 25,
        color: "#6366f1",
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

        console.log("Connection created:", newEdge);
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
    <div className="relative h-full flex flex-col min-h-0">
      <ReactFlow
        connectionLineStyle={{
          stroke: "#6366f1",
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
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        className="bg-transparent"
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={16} size={1} color="#94a3b8" className="opacity-50" />
        <Controls
          className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl shadow-lg backdrop-blur-sm"
          showZoom={true}
          showFitView={true}
          showInteractive={false}
        />
        <MiniMap
          className="bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/60 rounded-xl shadow-lg backdrop-blur-sm"
          nodeColor={(node) => {
            const data = node.data as unknown as FlowNode;
            if (data.type === "source") return "#6366f1";
            if (data.type === "transform") return "#d946ef";
            return "#10b981";
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
          pannable={true}
          zoomable={true}
        />
      </ReactFlow>
    </div>
  );
}

function statusColor(n: FlowNode) {
  if (n.status === "pending") return "ring-pending/50";
  if (n.status === "partial") return "ring-partial/50";
  if (n.status === "complete") return "ring-complete/50";
  return "ring-error/50";
}

function iconBg(n: FlowNode) {
  if (n.type === "source") return "from-indigo-500 to-blue-500";
  if (n.type === "transform") return "from-fuchsia-500 to-purple-500";
  return "from-emerald-500 to-green-500";
}
