// Static text constants for the AI Dataflow Architect application

export const UI_TEXT = {
  // Application branding
  APP_NAME: 'AI Data Flow Architect',
  APP_TAGLINE: 'Conversational Data Integration',
  APP_DESCRIPTION: 'Describe your pipeline and watch it become an interactive flow. Natural language in, production‑ready orchestration out.',

  // Landing page
  LANDING: {
    HERO_TITLE: 'Conversational Data Integration',
    HERO_SUBTITLE: 'Describe your pipeline and watch it become an interactive flow.\nNatural language in, production‑ready orchestration out.',
    PROMPT_SECTION: 'Prompt',
    PROMPT_PLACEHOLDER: 'e.g., Connect Shopify orders to Snowflake',
    BUILD_BUTTON: 'Build',
    TRY_ONE_LABEL: 'Try one',
    INSTRUCTIONS: 'Press Enter to build, or pick an example. Use Tab to navigate between elements.',
  },

  // Chat component
  CHAT: {
    DEFAULT_MESSAGE: 'Hi! Tell me your data flow, e.g., "Connect Shopify orders to Snowflake". I\'ll ask for details and finalize the canvas when ready. You can also say "Create a new pipeline" to start over.',
    NEW_PIPELINE_MESSAGE: 'Starting a new pipeline. What would you like to connect?',
    ERROR_MESSAGE: 'Sorry, I encountered an error. Please try again.',
    PLACEHOLDER: 'Describe your data flow or answer a question…',
    SEND_BUTTON: 'Send',
    AI_LABEL: 'AI',
    USER_LABEL: 'U',
    TYPING_INDICATOR: 'AI is typing',
    ATTACH_FILE: 'Attach file',
    SEND_MESSAGE: 'Send message',
    SENDING_MESSAGE: 'Sending message...',
    MESSAGE_INSTRUCTIONS: 'Type your message and press Enter to send, or Shift+Enter for a new line.',
    SEND_BUTTON_HELP: 'Click to send your message',
    SENDING_HELP: 'Message is being sent',
  },

  // Canvas component
  CANVAS: {
    EMPTY_STATE: {
      TITLE: 'Start Your Data Flow',
      DESCRIPTION: 'Describe your data integration needs in the chat to begin building your pipeline.',
      EXAMPLE_TEXT: 'Try: "Connect Shopify orders to Snowflake"',
    },
    NAVIGATION_INSTRUCTIONS: 'Use arrow keys to navigate between nodes. Press Enter or Space to select a node. Press Escape to deselect.',
    ARIA_LABELS: {
      CANVAS: 'Data flow canvas',
      CONTROLS: 'Canvas controls',
      MINIMAP: 'Canvas minimap',
      DATABASE_SOURCE: 'Database source',
      TRANSFORM_OPERATION: 'Transform operation',
      SERVER_DESTINATION: 'Server destination',
    },
    CONNECTION_LABELS: {
      CONNECT_FROM: 'Connect from',
      CONNECT_TO: 'Connect to',
    },
  },

  // Properties panel
  PROPERTIES: {
    NO_SELECTION: 'Select a node to view and edit its properties.',
    LABELS: {
      LABEL: 'Label',
      STATUS: 'Status',
      PROPERTIES_JSON: 'Properties (JSON)',
    },
    STATUS_OPTIONS: {
      PENDING: 'Pending',
      PARTIAL: 'Partial',
      COMPLETE: 'Complete',
      ERROR: 'Error',
    },
    HELP_TEXT: {
      LABEL: 'Enter a descriptive name for this {type} node',
      STATUS: 'Select the current processing status of this node',
      PROPERTIES: 'Enter valid JSON configuration for this node. Invalid JSON will be ignored.',
    },
    PROPERTY_COUNT: {
      SINGLE: 'property',
      PLURAL: 'properties',
    },
  },

  // Studio page
  STUDIO: {
    PANEL_NAMES: {
      CHAT: 'Chat',
      CANVAS: 'Canvas',
      PROPERTIES: 'Properties',
    },
    SETTINGS: {
      TITLE: 'Display Settings',
      DENSITY_LABEL: 'Density',
      PANELS_LABEL: 'Panels',
      COMFORTABLE: 'Comfortable',
      COMPACT: 'Compact',
    },
    ARIA_LABELS: {
      STUDIO: 'Data flow studio',
      WORKSPACE: 'Studio workspace',
      CLOSE_SETTINGS: 'Close settings',
      OPEN_SETTINGS: 'Open settings',
      COLLAPSE_PANEL: 'Collapse {panel}',
      EXPAND_PANEL: 'Expand {panel}',
      SWITCH_TO_PANEL: 'Switch to {panel} panel',
    },
  },

  // Node types and statuses
  NODE_TYPES: {
    SOURCE: 'source',
    TRANSFORM: 'transform',
    DESTINATION: 'destination',
  },

  NODE_STATUSES: {
    PENDING: 'pending',
    PARTIAL: 'partial',
    COMPLETE: 'complete',
    ERROR: 'error',
  },

  // Common UI elements
  COMMON: {
    BUTTONS: {
      CLOSE: 'Close',
      OPEN: 'Open',
      EXPAND: 'Expand',
      COLLAPSE: 'Collapse',
      SETTINGS: 'Settings',
    },
    ACCESSIBILITY: {
      AI_ASSISTANT: 'AI Assistant',
      USER: 'User',
      TYPING_INDICATOR: 'Typing indicator',
      SCREEN_READER_ONLY: 'sr-only',
    },
  },
} as const;

// Example prompts for the landing page
export const EXAMPLE_PROMPTS = [
  'Connect Shopify to BigQuery',
  'Sync Salesforce contacts to Mailchimp',
  'Stream Stripe payments to Google Sheets',
  'Connect Shopify orders to Snowflake',
] as const;

// Keywords for detecting new pipeline requests
export const NEW_PIPELINE_KEYWORDS = [
  'new pipeline',
  'create pipeline',
  'start over',
  'reset flow',
] as const;

// Service configuration keys
export const SERVICE_KEYS = {
  SHOPIFY: [
    'storeUrl',
    'clientId',
    'clientSecret',
    'refreshToken',
    'entity',
    'fields',
  ],
  SNOWFLAKE: [
    'account',
    'username',
    'password',
    'database',
    'schema',
    'table',
    'loadMode',
    'key',
  ],
} as const;

// Default node configurations
export const DEFAULT_NODES = {
  SOURCE: {
    type: 'source' as const,
    status: 'pending' as const,
    properties: {},
  },
  TRANSFORM: {
    type: 'transform' as const,
    label: 'Transform',
    status: 'pending' as const,
    properties: {},
  },
  DESTINATION: {
    type: 'destination' as const,
    status: 'pending' as const,
    properties: {},
  },
} as const;

// CSS classes for consistent styling
export const CSS_CLASSES = {
  GRADIENTS: {
    PRIMARY: 'bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600',
    SECONDARY: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    SUCCESS: 'bg-gradient-to-r from-emerald-500 to-green-500',
    WARNING: 'bg-gradient-to-r from-amber-400 to-amber-500',
    ERROR: 'bg-gradient-to-r from-red-400 to-red-500',
  },
  PANELS: {
    BASE: 'flex flex-col rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/70 dark:bg-zinc-950/50 shadow-sm backdrop-blur transition-all duration-200',
    HEADER: 'flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 px-4 py-2 bg-white/70 dark:bg-zinc-950/50 backdrop-blur rounded-t-2xl',
  },
  BUTTONS: {
    ICON: 'p-1.5 rounded-lg hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 transition-colors',
    PRIMARY: 'inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-cyan-600 px-4 py-2 text-white shadow-md transition active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/70 hover:brightness-110',
  },
} as const;
