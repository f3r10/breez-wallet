/**
 * Lightning State Management with Zustand
 * Manages Breez Spark SDK state and Lightning operations
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Payment {
  id: string;
  paymentType: 'sent' | 'received';
  paymentTime: number;
  amountMsat: number;
  feeMsat: number;
  status: 'pending' | 'complete' | 'failed';
  description?: string;
  bolt11?: string;
  preimage?: string;
}

interface LightningState {
  // Node state
  isNodeReady: boolean;
  nodeId: string | null;
  isSyncing: boolean;

  // Balance (in millisats)
  channelsBalanceMsat: number;
  maxPayableMsat: number;
  maxReceivableMsat: number;

  // Payments
  payments: Payment[];

  // Connection status
  isConnected: boolean;
  lastSyncTime: number | null;

  // Actions
  setNodeReady: (ready: boolean) => void;
  setNodeId: (nodeId: string) => void;
  setSyncing: (syncing: boolean) => void;
  setBalance: (channelsBalance: number, maxPayable: number, maxReceivable: number) => void;
  addPayment: (payment: Payment) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  setPayments: (payments: Payment[]) => void;
  setConnected: (connected: boolean) => void;
  setLastSyncTime: (time: number) => void;
  clearLightning: () => void;
}

export const useLightningStore = create<LightningState>()(
  persist(
    (set) => ({
      // Initial state
      isNodeReady: false,
      nodeId: null,
      isSyncing: false,
      channelsBalanceMsat: 0,
      maxPayableMsat: 0,
      maxReceivableMsat: 0,
      payments: [],
      isConnected: false,
      lastSyncTime: null,

      // Actions
      setNodeReady: (ready) => set({ isNodeReady: ready }),

      setNodeId: (nodeId) => set({ nodeId }),

      setSyncing: (syncing) => set({ isSyncing: syncing }),

      setBalance: (channelsBalance, maxPayable, maxReceivable) =>
        set({
          channelsBalanceMsat: channelsBalance,
          maxPayableMsat: maxPayable,
          maxReceivableMsat: maxReceivable,
        }),

      addPayment: (payment) =>
        set((state) => ({
          payments: [payment, ...state.payments],
        })),

      updatePayment: (id, updates) =>
        set((state) => ({
          payments: state.payments.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        })),

      setPayments: (payments) => set({ payments }),

      setConnected: (connected) => set({ isConnected: connected }),

      setLastSyncTime: (time) => set({ lastSyncTime: time }),

      clearLightning: () =>
        set({
          isNodeReady: false,
          nodeId: null,
          isSyncing: false,
          channelsBalanceMsat: 0,
          maxPayableMsat: 0,
          maxReceivableMsat: 0,
          payments: [],
          isConnected: false,
          lastSyncTime: null,
        }),
    }),
    {
      name: 'etta-lightning-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
