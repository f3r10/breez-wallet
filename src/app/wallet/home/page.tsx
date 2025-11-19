'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useWalletStore } from '@/store/wallet-store';
import { useLightningStore } from '@/store/lightning-store';
import { BalanceDisplay, BalanceCard } from '@/components/wallet/balance-display';
import { TransactionList } from '@/components/wallet/transaction-list';

export default function WalletHomePage() {
  const router = useRouter();
  const { isInitialized, hasBackedUp } = useWalletStore();
  const {
    isNodeReady,
    isSyncing,
    channelsBalanceMsat,
    maxPayableMsat,
    maxReceivableMsat,
    payments,
    isConnected,
    lastSyncTime,
  } = useLightningStore();

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      router.push('/welcome');
    }
  }, [isInitialized, router]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // TODO: Implement actual Lightning sync with Breez SDK
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleSend = () => {
    // TODO: Navigate to send screen
    router.push('/wallet/send');
  };

  const handleReceive = () => {
    // TODO: Navigate to receive screen
    router.push('/wallet/receive');
  };

  const handleBackupNow = () => {
    router.push('/wallet/cloud-backup');
  };

  if (!isInitialized) {
    return null;
  }

  const syncStatusText = isSyncing ? 'Syncing...' : isConnected ? 'Synced' : 'Offline';
  const syncStatusColor = isSyncing
    ? 'bg-yellow-500'
    : isConnected
    ? 'bg-green-500'
    : 'bg-gray-400';

  const lastSyncText = lastSyncTime
    ? new Date(lastSyncTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Never';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 pt-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Wallet</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <span className={refreshing ? 'inline-block animate-spin' : ''}>
                  ⟳
                </span>
              </button>
              <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-sm">
                <div className={`w-2 h-2 rounded-full ${syncStatusColor}`}></div>
                <span>{syncStatusText}</span>
              </div>
            </div>
          </div>

          {/* Balance Display */}
          <BalanceDisplay balanceMsat={channelsBalanceMsat} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-12">
        {/* Backup Warning */}
        {!hasBackedUp && (
          <Card className="mb-6 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-200 mb-1">
                    Backup Your Wallet
                  </h3>
                  <p className="text-sm text-orange-800 dark:text-orange-300 mb-3">
                    Secure your funds by backing up your recovery phrase.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBackupNow}
                    className="border-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                  >
                    Backup Now
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Balance Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <BalanceCard
            label="Can Send"
            amountMsat={maxPayableMsat}
            variant="default"
          />
          <BalanceCard
            label="Can Receive"
            amountMsat={maxReceivableMsat}
            variant="success"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            variant="primary"
            size="lg"
            onClick={handleSend}
            className="h-24 flex flex-col gap-2"
          >
            <span className="text-3xl">↑</span>
            <span>Send</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleReceive}
            className="h-24 flex flex-col gap-2"
          >
            <span className="text-3xl">↓</span>
            <span>Receive</span>
          </Button>
        </div>

        {/* Transaction List */}
        <TransactionList
          payments={payments}
          onPaymentClick={(payment) => {
            // TODO: Show payment details
            console.log('Payment clicked:', payment);
          }}
        />

        {/* Node Info */}
        {isNodeReady && (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="font-semibold">Lightning Node</h3>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <span className="font-medium">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Last Sync</span>
                <span className="font-medium">{lastSyncText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Network</span>
                <span className="font-medium">Testnet</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Development Notice */}
        {!isNodeReady && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              ⚡ <strong>Lightning Node:</strong> Your Lightning node will be initialized on first payment.
              The wallet is ready to use!
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-6 mb-8 grid grid-cols-3 gap-3">
          <button className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-center">
            <div className="text-2xl mb-1">📋</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">History</div>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-center">
            <div className="text-2xl mb-1">⚙️</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Settings</div>
          </button>
          <button className="p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors text-center">
            <div className="text-2xl mb-1">🔒</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Security</div>
          </button>
        </div>
      </div>
    </div>
  );
}
