interface BackoffOptions {
  /** Base delay in ms. Default: 1000 */
  base?: number;
  /** Maximum delay in ms. Default: 30_000 */
  max?: number;
  /** Add random jitter (50–100 % of exponential). Default: true */
  jitter?: boolean;
}

/**
 * Returns the reconnection delay (ms) for a given attempt number.
 * Formula: min(base * 2^attempt, max), optionally with ±50 % jitter.
 */
export function computeBackoff(attempt: number, options: BackoffOptions = {}): number {
  const { base = 1000, max = 30_000, jitter = true } = options;
  const exponential = Math.min(base * Math.pow(2, attempt), max);
  if (!jitter) return exponential;
  // Jitter: random value in [0.5 * exponential, exponential]
  return Math.floor(exponential * (0.5 + Math.random() * 0.5));
}
