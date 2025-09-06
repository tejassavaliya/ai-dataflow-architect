# Component Documentation

## AI Dataflow Architect - Component Reference

This document provides comprehensive documentation for all components in the AI Dataflow Architect application, including their props, methods, accessibility features, and usage examples.

## Table of Contents

- [Core Components](#core-components)
  - [App](#app)
  - [Canvas](#canvas)
  - [Chat](#chat)
  - [PropertiesPanel](#propertiespanel)
- [Page Components](#page-components)
  - [Landing](#landing)
  - [Studio](#studio)
- [Context Providers](#context-providers)
  - [LayoutProvider](#layoutprovider)
- [Store Hooks](#store-hooks)
  - [useFlowStore](#useflowstore)
  - [useSlots](#useslots)

---

## Core Components

### App

**File:** `src/App.tsx`

The root application component that provides the main layout structure, theme management, and navigation.

#### Features
- Theme switching (light/dark mode)
- Fixed header and footer layout
- Skip-to-content accessibility link
- Navigation with active state indicators
- Responsive design

#### Props
None - Root component

#### State
- `theme`: Current theme ('dark' | 'light')

#### Methods
- `setTheme(theme)`: Toggle between light and dark themes

#### Accessibility Features
- Skip-to-content link for keyboard navigation
- Proper ARIA labels and roles
- Focus management with visible focus indicators
- Semantic HTML structure (header, main, footer)

#### Usage Example
```tsx
// App is the root component, used in main.tsx
import App from './App'

// Wrapped with React Router
<BrowserRouter>
  <App />
</BrowserRouter>
```

---

### Canvas

**File:** `src/components/Canvas.tsx`

Interactive data flow canvas using ReactFlow for visualizing and editing data pipelines.

#### Props
None - Uses global state from stores

#### Features
- Visual node representation with status indicators
- Drag and drop node positioning
- Connection creation between nodes
- Keyboard navigation between nodes
- Minimap and zoom controls
- Real-time status updates

#### Node Types
- **Source**: Data input nodes (Database icon)
- **Transform**: Data processing nodes (Cog icon)
- **Destination**: Data output nodes (Server icon)

#### Node Status
- `pending`: Amber color with pulse animation
- `partial`: Blue color with pulse animation
- `complete`: Green color (solid)
- `error`: Red color with pulse animation

#### Keyboard Navigation
- **Arrow Keys**: Navigate between nodes
- **Enter/Space**: Select node
- **Escape**: Deselect current node

#### Accessibility Features
- Full keyboard navigation support
- ARIA labels for all interactive elements
- Screen reader instructions
- Focus management and visual indicators
- Role-based element identification

#### Usage Example
```tsx
import Canvas from '@/components/Canvas'

function Studio() {
  return (
    <div className="canvas-container">
      <Canvas />
    </div>
  )
}
```

#### Custom Node Component
The Canvas uses a custom node component with the following features:
- Status-based styling and animations
- Connection handles for linking nodes
- Keyboard interaction support
- Accessibility labels and descriptions

---

### Chat

**File:** `src/components/Chat.tsx`

AI-powered chat interface for natural language pipeline creation and modification.

#### Props
```tsx
interface Props {
  onAIGuidance?: (graph?: GraphPayload, rawText?: string) => void;
}
```

#### Ref Interface
```tsx
interface ChatRef {
  triggerAICall: (prompt: string) => void;
}
```

#### Features
- Real-time AI conversation
- Auto-scrolling message history
- Message parsing for pipeline configuration
- Loading states with typing indicators
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)
- Automatic slot extraction from user input

#### State
- `messages`: Array of chat messages
- `input`: Current input text
- `loading`: AI request loading state
- `hasInitialized`: Prevents duplicate initialization

#### Methods
- `send()`: Send message to AI
- `triggerAICall(prompt)`: Programmatically trigger AI call
- `captureSlotsFromText(text)`: Extract configuration from text
- `handleNewPipeline()`: Reset flow for new pipeline

#### Message Types
```tsx
type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
}
```

#### Accessibility Features
- ARIA live regions for message updates
- Proper form labeling and validation
- Keyboard navigation support
- Screen reader friendly message structure
- Focus management for input elements

#### Usage Example
```tsx
import Chat, { type ChatRef } from '@/components/Chat'

function Studio() {
  const chatRef = useRef<ChatRef>(null)
  
  const handleAIGuidance = (graph, text) => {
    // Process AI response
  }
  
  return (
    <Chat 
      onAIGuidance={handleAIGuidance} 
      ref={chatRef}
    />
  )
}
```

---

### PropertiesPanel

**File:** `src/components/PropertiesPanel.tsx`

Property editor for selected nodes in the data flow canvas.

#### Props
None - Uses global state from `useFlowStore`

#### Features
- Node label editing
- Status selection dropdown
- JSON property editor with validation
- Real-time property count display
- Responsive layout based on density setting

#### Form Fields
- **Label**: Text input for node display name
- **Status**: Dropdown for node processing status
- **Properties**: JSON textarea for node configuration

#### State Management
Uses `useFlowStore` for:
- `selectedNodeId`: Currently selected node
- `updateNode(id, patch)`: Update node properties

#### Accessibility Features
- Proper form labels with `htmlFor` attributes
- ARIA descriptions for form fields
- Live regions for property count updates
- Fieldset/legend structure for organization
- Screen reader friendly help text

#### Usage Example
```tsx
import PropertiesPanel from '@/components/PropertiesPanel'

function Studio() {
  return (
    <div className="properties-container">
      <PropertiesPanel />
    </div>
  )
}
```

#### JSON Validation
The properties editor includes automatic JSON validation:
- Invalid JSON is ignored (no error thrown)
- Real-time parsing and formatting
- Syntax highlighting through monospace font

---

## Page Components

### Landing

**File:** `src/pages/Landing.tsx`

Landing page with prompt input and example pipeline options.

#### Features
- Gradient background with animated orbs
- Interactive prompt input with examples
- Keyboard navigation between example buttons
- Responsive grid layout for examples

#### State
- `value`: Current prompt input text

#### Methods
- `go(prompt)`: Navigate to studio with prompt
- `handleKeyDown(e)`: Handle arrow key navigation

#### Example Prompts
- "Connect Shopify to BigQuery"
- "Sync Salesforce contacts to Mailchimp"
- "Stream Stripe payments to Google Sheets"
- "Connect Shopify orders to Snowflake"

#### Accessibility Features
- Keyboard navigation for example buttons
- ARIA labels and descriptions
- Arrow key navigation between examples
- Focus management and skip links
- Proper semantic structure

#### Usage Example
```tsx
import Landing from '@/pages/Landing'

// Used in router configuration
<Route path="/" element={<Landing />} />
```

---

### Studio

**File:** `src/pages/Studio.tsx`

Main studio interface combining chat, canvas, and properties panels.

#### Features
- Three-panel layout (chat, canvas, properties)
- Collapsible panels with toggle controls
- Settings dialog for density and panel management
- Mobile-responsive design with auto-collapse
- AI guidance processing and graph application

#### State
- `showSettings`: Settings dialog visibility
- Panel states managed by `LayoutContext`

#### Methods
- `handleAIGuidance(graph, rawText)`: Process AI responses
- `applyGraph(graph)`: Apply graph data to canvas
- `titleCase(string)`: Format text to title case
- `normalizeStatus(status)`: Normalize status strings

#### Panel Management
Each panel can be:
- Expanded/collapsed individually
- Configured through settings dialog
- Auto-collapsed on mobile devices

#### Accessibility Features
- ARIA expanded states for collapsible panels
- Focus management for settings dialog
- Proper role attributes (main, application, dialog)
- Enhanced button accessibility with labels

#### Usage Example
```tsx
import Studio from '@/pages/Studio'

// Used in router with optional state
<Route path="/studio" element={<Studio />} />

// Navigate with initial prompt
navigate('/studio', { state: { seed: 'Connect Shopify to Snowflake' } })
```

---

## Context Providers

### LayoutProvider

**File:** `src/context/LayoutContext.tsx`

Context provider for managing layout state across the application.

#### Context Type
```tsx
type LayoutContextType = {
  density: Density;
  setDensity: (density: Density) => void;
  isPanelOpen: Record<Panel, boolean>;
  togglePanel: (panel: Panel) => void;
};
```

#### Types
```tsx
type Density = 'comfortable' | 'compact';
type Panel = 'chat' | 'canvas' | 'properties';
```

#### Default State
- `density`: 'comfortable'
- `isPanelOpen`: All panels open by default

#### Methods
- `setDensity(density)`: Change UI density
- `togglePanel(panel)`: Toggle panel visibility

#### Usage Example
```tsx
import { LayoutProvider, useLayout } from '@/context/LayoutContext'

// Wrap app with provider
<LayoutProvider>
  <App />
</LayoutProvider>

// Use in components
function MyComponent() {
  const { density, togglePanel } = useLayout()
  return <div className={density === 'compact' ? 'text-sm' : 'text-base'} />
}
```

---

## Store Hooks

### useFlowStore

**File:** `src/store/useFlowStore.ts`

Zustand store for managing data flow state (nodes, edges, selection).

#### Types
```tsx
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
```

#### State
- `nodes`: Array of flow nodes
- `edges`: Array of flow edges
- `selectedNodeId`: Currently selected node ID

#### Actions
- `setNodes(nodes)`: Replace all nodes
- `setEdges(edges)`: Replace all edges
- `addEdge(edge)`: Add new edge
- `removeEdge(edgeId)`: Remove edge by ID
- `selectNode(id?)`: Select/deselect node
- `updateNode(id, patch)`: Update node properties
- `reset()`: Clear all state
- `resetFlow()`: Reset flow (alias for reset)

#### Usage Example
```tsx
import { useFlowStore } from '@/store/useFlowStore'

function MyComponent() {
  const { nodes, selectNode, updateNode } = useFlowStore()
  
  const handleNodeClick = (nodeId: string) => {
    selectNode(nodeId)
  }
  
  const updateNodeLabel = (id: string, label: string) => {
    updateNode(id, { label })
  }
}
```

---

### useSlots

**File:** `src/store/useSlots.ts`

Zustand store for managing pipeline configuration slots (Shopify, Snowflake settings).

#### Types
```tsx
type Slots = {
  shopify: {
    storeUrl?: string;
    clientId?: string;
    clientSecret?: string;
    refreshToken?: string;
    entity?: 'orders';
    fields?: string[];
  };
  snowflake: {
    account?: string;
    username?: string;
    password?: string;
    database?: string;
    schema?: string;
    table?: string;
    loadMode?: 'append' | 'merge';
    key?: string;
  };
};
```

#### State
- `slots`: Configuration object for services

#### Actions
- `merge(patch)`: Merge partial configuration
- `isComplete()`: Check if all required fields are filled

#### Required Fields
Defined in `REQUIRED` constant for validation:
- **Shopify**: storeUrl, clientId, clientSecret, refreshToken, entity, fields
- **Snowflake**: account, username, password, database, schema, table, loadMode, key

#### Usage Example
```tsx
import { useSlots } from '@/store/useSlots'

function ConfigForm() {
  const { slots, merge, isComplete } = useSlots()
  
  const updateShopifyUrl = (storeUrl: string) => {
    merge({ shopify: { storeUrl } })
  }
  
  const canProceed = isComplete()
}
```

---

## Accessibility Features Summary

This application implements comprehensive accessibility features throughout:

### Global Features
- Skip-to-content link for keyboard users
- Proper semantic HTML structure
- High contrast mode support
- Reduced motion support
- Focus management and visual indicators

### Component-Specific Features
- **Canvas**: Full keyboard navigation, ARIA labels, screen reader instructions
- **Chat**: Live regions, proper form labeling, keyboard shortcuts
- **Properties Panel**: Form labels, ARIA descriptions, live updates
- **Landing**: Arrow key navigation, focus management
- **Studio**: Panel state management, dialog accessibility

### Standards Compliance
- WCAG 2.1 AA compliance
- Proper ARIA labeling and descriptions
- Keyboard navigation support
- Screen reader compatibility
- Focus management throughout the application

---

## Development Guidelines

### Adding New Components
1. Follow the established patterns for accessibility
2. Include proper TypeScript interfaces
3. Add ARIA labels and descriptions
4. Implement keyboard navigation where applicable
5. Test with screen readers
6. Document props and usage examples

### Styling Conventions
- Use Tailwind CSS classes
- Follow the established design system
- Support both light and dark themes
- Implement responsive design patterns
- Use semantic color meanings (red for error, green for success, etc.)

### State Management
- Use Zustand stores for global state
- Use React Context for UI state
- Keep component state local when possible
- Follow immutable update patterns
