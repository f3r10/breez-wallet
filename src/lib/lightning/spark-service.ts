/**
 * Breez Spark SDK Service
 *
 * This service wraps the Breez Spark SDK and provides a simplified interface
 * for Lightning Network operations in the wallet.
 *
 * Reference: https://github.com/breez/breez-sdk-spark-example
 */

// Note: Using 'any' types for Breez SDK since types are not properly exported
// The SDK is imported dynamically at runtime
let sdk: any = null;

export interface SparkConfig {
  network: 'bitcoin' | 'testnet' | 'signet' | 'regtest';
  workingDir?: string;
}

/**
 * Initialize the Breez Spark SDK
 */
export async function initSpark(config: SparkConfig): Promise<void> {
  try {
    // Dynamic import to handle SDK initialization
    const breezSdk = await import('@breeztech/breez-sdk-spark');

    // Get default configuration (using any to avoid type issues)
    const sdkConfig: any = (breezSdk as any).defaultConfig?.(
      config.network === 'bitcoin' ? 'PRODUCTION' : 'STAGING'
    ) || {};

    // Override with custom settings if needed
    if (config.workingDir) {
      sdkConfig.workingDir = config.workingDir;
    }

    // Connect to Spark
    const connectRequest: any = {
      config: sdkConfig,
      seed: new Uint8Array(), // Will be set during wallet creation/restore
      storageDir: config.workingDir || './storage',
    };

    sdk = await (breezSdk as any).connect(connectRequest);

    // Set up event listener
    sdk.addEventListener((event: any) => {
      console.log('Spark SDK Event:', event);
      // TODO: Handle events (payment received, synced, etc.)
    });

    console.log('Spark SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Spark SDK:', error);
    throw error;
  }
}

/**
 * Get current node state
 */
export async function getNodeState(): Promise<any | null> {
  if (!sdk) {
    throw new Error('Spark SDK not initialized');
  }

  try {
    return await sdk.nodeInfo();
  } catch (error) {
    console.error('Failed to get node state:', error);
    return null;
  }
}

/**
 * Generate a Lightning invoice to receive payment
 */
export async function receivePayment(
  amountSats: number,
  description: string
): Promise<any> {
  if (!sdk) {
    throw new Error('Spark SDK not initialized');
  }

  const request = {
    amountMsat: amountSats * 1000, // Convert sats to millisats
    description,
  };

  return await sdk.receivePayment(request);
}

/**
 * Send a Lightning payment
 */
export async function sendPayment(
  bolt11Invoice: string
): Promise<any> {
  if (!sdk) {
    throw new Error('Spark SDK not initialized');
  }

  const request = {
    bolt11: bolt11Invoice,
  };

  return await sdk.sendPayment(request);
}

/**
 * List all payments (sent and received)
 */
export async function listPayments(): Promise<any[]> {
  if (!sdk) {
    throw new Error('Spark SDK not initialized');
  }

  try {
    return await sdk.listPayments();
  } catch (error) {
    console.error('Failed to list payments:', error);
    return [];
  }
}

/**
 * Get wallet balance
 */
export async function getBalance(): Promise<{ totalSats: number; spendableSats: number }> {
  if (!sdk) {
    throw new Error('Spark SDK not initialized');
  }

  try {
    const nodeState = await sdk.nodeInfo();
    return {
      totalSats: nodeState.channelsBalanceMsat / 1000,
      spendableSats: nodeState.maxPayableMsat / 1000,
    };
  } catch (error) {
    console.error('Failed to get balance:', error);
    return { totalSats: 0, spendableSats: 0 };
  }
}

/**
 * Disconnect from Spark SDK
 */
export async function disconnectSpark(): Promise<void> {
  if (sdk) {
    try {
      await sdk.disconnect();
      sdk = null;
      console.log('Spark SDK disconnected');
    } catch (error) {
      console.error('Failed to disconnect Spark SDK:', error);
    }
  }
}

/**
 * Check if SDK is initialized
 */
export function isSparkInitialized(): boolean {
  return sdk !== null;
}
