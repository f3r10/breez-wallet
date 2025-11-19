'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/config';

export default function WelcomePage() {
  const [creatingWallet, setCreatingWallet] = useState(false);

  const createWalletHandler = async () => {
    setCreatingWallet(true);
    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setCreatingWallet(false);
    // Navigate to mnemonic creation screen
    window.location.href = '/wallet/create';
  };

  const restoreWalletHandler = () => {
    // TODO: Implement wallet restoration logic
    alert('Restore wallet - Coming soon!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between px-6 py-10">
      {/* Logo and Title Section */}
      <div className="flex-1 flex flex-col items-center justify-end pb-20">
        <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">₿</span>
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center">{APP_NAME}</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-xs">
          Your Bitcoin & Lightning wallet for sovereign payments
        </p>
      </div>

      {/* Buttons Section */}
      <div className="flex-1 flex flex-col justify-center space-y-3 max-w-md mx-auto w-full">
        <Button
          variant="primary"
          size="lg"
          onClick={createWalletHandler}
          loading={creatingWallet}
          className="w-full"
        >
          {creatingWallet ? 'Creating wallet...' : 'Create new wallet'}
        </Button>
        <Button
          variant="ghost"
          size="lg"
          onClick={restoreWalletHandler}
          disabled={creatingWallet}
          className="w-full"
        >
          Restore wallet
        </Button>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
