/**
 * Wallet State Management with Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface WalletState {
  // Wallet status
  isInitialized: boolean;
  hasBackedUp: boolean;

  // Mnemonic (only stored temporarily during setup)
  temporaryMnemonic: string | null;

  // Actions
  setInitialized: (initialized: boolean) => void;
  setHasBackedUp: (backedUp: boolean) => void;
  setTemporaryMnemonic: (mnemonic: string | null) => void;
  clearWallet: () => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      // Initial state
      isInitialized: false,
      hasBackedUp: false,
      temporaryMnemonic: null,

      // Actions
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      setHasBackedUp: (backedUp) => set({ hasBackedUp: backedUp }),
      setTemporaryMnemonic: (mnemonic) => set({ temporaryMnemonic: mnemonic }),

      clearWallet: () =>
        set({
          isInitialized: false,
          hasBackedUp: false,
          temporaryMnemonic: null,
        }),
    }),
    {
      name: 'etta-wallet-storage',
      storage: createJSONStorage(() => localStorage),
      // Don't persist temporary mnemonic
      partialize: (state) => ({
        isInitialized: state.isInitialized,
        hasBackedUp: state.hasBackedUp,
      }),
    }
  )
);
