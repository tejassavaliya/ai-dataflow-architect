import { useLayout } from '@/context/LayoutContext';
import { useFlowStore } from '@/store/useFlowStore';
import { UI_TEXT } from '@/constants/text';

export default function PropertiesPanel() {
  const { nodes, selectedNodeId, updateNode } = useFlowStore();
  const { density } = useLayout();
  const node = nodes.find((n) => n.id === selectedNodeId);

  if (!node) {
    return (
      <div
        className="p-6 text-sm text-zinc-500"
        role="status"
        aria-live="polite"
      >
        {UI_TEXT.PROPERTIES.NO_SELECTION}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full min-h-0 ${density === 'compact' ? 'p-2' : 'p-4'}`}
      role="region"
      aria-label={`Properties for ${node.label} node`}
    >
      <div className="flex-1 overflow-y-auto space-y-4 min-h-0">
        <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/50">
          <label
            className={`${density === 'compact' ? 'mb-0.5' : 'mb-1'} block text-xs font-medium text-zinc-600 dark:text-zinc-400`}
            htmlFor="node-label"
          >
            {UI_TEXT.PROPERTIES.LABELS.LABEL}
          </label>
          <input
            id="node-label"
            className={`w-full rounded-lg border border-zinc-200/60 bg-white/70 px-3 ${density === 'compact' ? 'py-1.5 text-xs' : 'py-2 text-sm'} outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/60 dark:bg-zinc-950/40`}
            value={node.label}
            onChange={(e) => updateNode(node.id, { label: e.target.value })}
            aria-describedby="label-help"
          />
          <div id="label-help" className="sr-only">
            {UI_TEXT.PROPERTIES.HELP_TEXT.LABEL.replace('{type}', node.type)}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/50">
          <label
            className={`${density === 'compact' ? 'mb-0.5' : 'mb-1'} block text-xs font-medium text-zinc-600 dark:text-zinc-400`}
            htmlFor="node-status"
          >
            {UI_TEXT.PROPERTIES.LABELS.STATUS}
          </label>
          <select
            id="node-status"
            className={`w-full rounded-lg border border-zinc-200/60 bg-white/70 px-3 ${density === 'compact' ? 'py-1.5 text-xs' : 'py-2 text-sm'} outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/60 dark:bg-zinc-950/40`}
            value={node.status}
            onChange={(e) =>
              updateNode(node.id, { status: e.target.value as any })
            }
            aria-describedby="status-help"
          >
            <option value="pending">{UI_TEXT.PROPERTIES.STATUS_OPTIONS.PENDING}</option>
            <option value="partial">{UI_TEXT.PROPERTIES.STATUS_OPTIONS.PARTIAL}</option>
            <option value="complete">{UI_TEXT.PROPERTIES.STATUS_OPTIONS.COMPLETE}</option>
            <option value="error">{UI_TEXT.PROPERTIES.STATUS_OPTIONS.ERROR}</option>
          </select>
          <div id="status-help" className="sr-only">
            {UI_TEXT.PROPERTIES.HELP_TEXT.STATUS}
          </div>
        </div>

        <div className="rounded-xl border border-zinc-200/60 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-zinc-800/60 dark:bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <label
              className={`${density === 'compact' ? 'mb-0.5' : 'mb-1'} block text-xs font-medium text-zinc-600 dark:text-zinc-400`}
              htmlFor="node-properties"
            >
              {UI_TEXT.PROPERTIES.LABELS.PROPERTIES_JSON}
            </label>
            {density === 'compact' && (
              <div className="text-[10px] text-zinc-400" aria-live="polite">
                {Object.keys(node.properties || {}).length}{' '}
                {Object.keys(node.properties || {}).length === 1
                  ? UI_TEXT.PROPERTIES.PROPERTY_COUNT.SINGLE
                  : UI_TEXT.PROPERTIES.PROPERTY_COUNT.PLURAL}
              </div>
            )}
          </div>
          <textarea
            id="node-properties"
            className={`w-full rounded-lg border border-zinc-200/60 bg-zinc-50/70 px-3 py-2 font-mono outline-none shadow-sm focus:ring-2 focus:ring-indigo-500/40 dark:border-zinc-800/60 dark:bg-zinc-900/50 ${density === 'compact' ? 'h-32 text-[11px]' : 'h-48 text-xs'}`}
            value={JSON.stringify(
              node.properties ?? {},
              null,
              density === 'compact' ? 1 : 2
            )}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                updateNode(node.id, { properties: parsed });
              } catch {
                /* ignore */
              }
            }}
            aria-describedby="properties-help"
            spellCheck={false}
          />
          <div id="properties-help" className="sr-only">
            {UI_TEXT.PROPERTIES.HELP_TEXT.PROPERTIES}
          </div>
        </div>
      </div>
    </div>
  );
}
