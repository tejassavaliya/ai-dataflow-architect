import { useLocation } from "react-router-dom";
import Chat, { type ChatRef } from "@/components/Chat";
import Canvas from "@/components/Canvas";
import PropertiesPanel from "@/components/PropertiesPanel";
import { useCallback, useEffect, useState, useRef } from "react";
import { useFlowStore, FlowNode, FlowEdge } from "@/store/useFlowStore";
import type { GraphPayload } from "@/lib/ai";
import { useSlots } from "@/store/useSlots";
import { useLayout } from "@/context/LayoutContext";
import {
  PanelLeft,
  Minus,
  Maximize2,
  Minimize2,
  Workflow,
  Settings,
  SlidersHorizontal,
} from "lucide-react";

export default function Studio() {
  const loc = useLocation();
  const seed = (loc.state as any)?.seed as string | undefined;
  const { setNodes, setEdges } = useFlowStore();
  const chatRef = useRef<ChatRef | null>(null);

  // Seed basic 3-node layout from initial prompt
  useEffect(() => {
    if (!seed) return;
    const lower = seed.toLowerCase();
    const parts = lower.split(" to ");
    const source =
      parts[0]?.replace(/^connect\s+|^stream\s+|^sync\s+/, "").trim() ||
      "source";
    const destination = parts[1]?.trim() || "destination";

    const initialNodes: FlowNode[] = [
      {
        id: "src",
        type: "source",
        label: titleCase(source),
        status: "pending",
        properties: {},
      },
      {
        id: "xform",
        type: "transform",
        label: "Transform",
        status: "pending",
        properties: {},
      },
      {
        id: "dst",
        type: "destination",
        label: titleCase(destination),
        status: "pending",
        properties: {},
      },
    ];
    const initialEdges: FlowEdge[] = [
      { id: "e1", from: "src", to: "xform" },
      { id: "e2", from: "xform", to: "dst" },
    ];
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [seed, setNodes, setEdges]);

  // Separate effect to trigger AI call when chatRef is available
  useEffect(() => {
    if (seed && chatRef.current) {
      const timer = setTimeout(() => {
        chatRef.current?.triggerAICall(seed);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [seed]);

  function handleAIGuidance(graph?: GraphPayload, rawText?: string) {
    // If server sent a graph → apply it
    if (graph?.nodes?.length) {
      applyGraph(graph);
      return;
    }

    // Fallback: if message implies ready and slots are complete → synthesize locally
    const ready = /ready|configured|finali[sz]ed?|pipeline.*ready/i.test(
      rawText || ""
    );
    if (ready && useSlots.getState().isComplete()) {
      const g = buildGraphFromSlots(useSlots.getState().slots);
      applyGraph(g);
    }
  }

  const applyGraph = useCallback((graph: GraphPayload) => {
    if (!graph) return;

    const nodes: FlowNode[] = (graph.nodes ?? []).map((n: any) => ({
      id: n.id,
      type: n.type,
      label: n.label,
      status: normalizeStatus(n.status ?? "pending"),
      properties: n.properties ?? {},
    }));

    const edges: FlowEdge[] = (graph.edges ?? []).map((e: any) => ({
      id: e.id,
      from: e.from,
      to: e.to,
    }));

    // Clear any existing selection when applying a new graph
    useFlowStore.getState().selectNode(undefined);
    useFlowStore.getState().setNodes(nodes);
    useFlowStore.getState().setEdges(edges);
  }, []);

  const { density, setDensity, isPanelOpen, togglePanel } = useLayout();
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = window.innerWidth < 768; // Simple mobile detection

  // Auto-collapse panels on mobile
  useEffect(() => {
    if (isMobile) {
      togglePanel("chat");
      togglePanel("properties");
    }
  }, [isMobile]);

  const panelClass = (panel: "chat" | "canvas" | "properties") =>
    `flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 
    bg-white/70 dark:bg-zinc-950/50 shadow-sm backdrop-blur transition-all duration-200 
    ${isPanelOpen[panel] ? "flex-1" : "w-12 overflow-hidden min-w-[48px]"}
    ${density === "compact" ? "text-sm" : "text-base"} h-full min-h-0`;

  const headerClass =
    "flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 px-4 py-2 bg-white/70 dark:bg-zinc-950/50 backdrop-blur rounded-t-2xl";
  const iconButtonClass =
    "p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors";

  return (
    <section className="relative h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Subtle background gradient */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_45rem_at_0%_20%,rgba(99,102,241,0.08),transparent),radial-gradient(40rem_40rem_at_100%_80%,rgba(34,197,94,0.06),transparent)]" />

        {/* Settings panel */}
        {showSettings && (
          <div className="absolute right-4 top-4 z-20 w-64 rounded-xl border border-zinc-200/60 bg-white/90 p-4 shadow-xl backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-900/90">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium">Display Settings</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                <Minus size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Density
                </label>
                <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-0.5">
                  <button
                    onClick={() => setDensity("comfortable")}
                    className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${density === "comfortable" ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"}`}
                  >
                    Comfortable
                  </button>
                  <button
                    onClick={() => setDensity("compact")}
                    className={`flex-1 rounded-md py-1.5 text-sm transition-colors ${density === "compact" ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white" : "text-zinc-600 hover:bg-zinc-100/50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"}`}
                  >
                    Compact
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Panels
                </label>
                <div className="space-y-2">
                  {(["chat", "canvas", "properties"] as const).map((panel) => (
                    <div
                      key={panel}
                      className="flex items-center justify-between"
                    >
                      <span className="text-sm capitalize">{panel}</span>
                      <button
                        onClick={() => togglePanel(panel)}
                        className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                      >
                        {isPanelOpen[panel] ? (
                          <Minimize2 size={16} />
                        ) : (
                          <Maximize2 size={16} />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="relative flex flex-1 gap-2 overflow-hidden min-h-0">
          {/* Chat Panel */}
          <div className={panelClass("chat")}>
            <div className={headerClass}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanel("chat")}
                  className={iconButtonClass}
                  aria-label={
                    isPanelOpen.chat ? "Collapse chat" : "Expand chat"
                  }
                >
                  <PanelLeft size={16} className="text-indigo-500" />
                </button>
                {isPanelOpen.chat && (
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Chat
                  </span>
                )}
              </div>
              {isPanelOpen.chat && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={iconButtonClass}
                  aria-label="Settings"
                >
                  <Settings size={16} className="text-zinc-500" />
                </button>
              )}
            </div>
            {isPanelOpen.chat && (
              <div className="flex-1 flex flex-col min-h-0">
                <Chat onAIGuidance={handleAIGuidance} ref={chatRef} />
              </div>
            )}
          </div>

          {/* Canvas Panel */}
          <div className={panelClass("canvas")}>
            <div className={headerClass}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanel("canvas")}
                  className={iconButtonClass}
                  aria-label={
                    isPanelOpen.canvas ? "Collapse canvas" : "Expand canvas"
                  }
                >
                  <Workflow size={16} className="text-fuchsia-500" />
                </button>
                {isPanelOpen.canvas && (
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Canvas
                  </span>
                )}
              </div>
              {isPanelOpen.canvas && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className={iconButtonClass}
                    aria-label="Settings"
                  >
                    <Settings size={16} className="text-zinc-500" />
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col min-h-0">
              <Canvas />
            </div>
          </div>

          {/* Properties Panel */}
          <div className={panelClass("properties")}>
            <div className={headerClass}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePanel("properties")}
                  className={iconButtonClass}
                  aria-label={
                    isPanelOpen.properties
                      ? "Collapse properties"
                      : "Expand properties"
                  }
                >
                  <SlidersHorizontal size={16} className="text-cyan-500" />
                </button>
                {isPanelOpen.properties && (
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                    Properties
                  </span>
                )}
              </div>
              {isPanelOpen.properties && (
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className={iconButtonClass}
                  aria-label="Settings"
                >
                  <Settings size={16} className="text-zinc-500" />
                </button>
              )}
            </div>
            {isPanelOpen.properties && (
              <div className="flex-1 flex flex-col min-h-0">
                <PropertiesPanel />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function titleCase(s: string) {
  return s
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
function normalizeStatus(s: string): FlowNode["status"] {
  const k = s.toLowerCase();
  if (k.startsWith("pend")) return "pending";
  if (k.startsWith("part")) return "partial";
  if (k.startsWith("comp")) return "complete";
  if (k.startsWith("err")) return "error";
  return "pending";
}
function buildGraphFromSlots(slots: any) {
  return {
    nodes: [
      {
        id: "src",
        type: "source",
        label: "Shopify Orders",
        status: "complete",
        properties: { ...(slots?.shopify ?? {}) },
      },
      {
        id: "xform",
        type: "transform",
        label: "Transform",
        status: "complete",
        properties: { mappings: [], filters: [] },
      },
      {
        id: "dst",
        type: "destination",
        label: "Snowflake",
        status: "complete",
        properties: { ...(slots?.snowflake ?? {}) },
      },
    ],
    edges: [
      { id: "e1", from: "src", to: "xform" },
      { id: "e2", from: "xform", to: "dst" },
    ],
  };
}
