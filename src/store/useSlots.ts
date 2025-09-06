import { create } from 'zustand';

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

export const REQUIRED = {
  shopify: [
    'storeUrl',
    'clientId',
    'clientSecret',
    'refreshToken',
    'entity',
    'fields',
  ] as const,
  snowflake: [
    'account',
    'username',
    'password',
    'database',
    'schema',
    'table',
    'loadMode',
    'key',
  ] as const,
};

type State = {
  slots: Slots;
  merge: (patch: Partial<Slots>) => void;
  isComplete: () => boolean;
};

export const useSlots = create<State>((set, get) => ({
  slots: { shopify: {}, snowflake: {} },
  merge: (patch) => set({ slots: deepMerge(get().slots, patch) }),
  isComplete: () => {
    const s = get().slots;
    return (
      REQUIRED.shopify.every((k) => (s.shopify as any)[k]) &&
      REQUIRED.snowflake.every((k) => (s.snowflake as any)[k])
    );
  },
}));

function deepMerge<T>(a: T, b: Partial<T>): T {
  return JSON.parse(JSON.stringify({ ...a, ...b }, (_, v) => v));
}
