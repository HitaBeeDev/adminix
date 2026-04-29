import { describe, it, expect } from 'vitest';
import { computeBackoff } from '@/lib/backoff';

describe('computeBackoff()', () => {
  describe('without jitter', () => {
    it('returns base delay on attempt 0', () => {
      expect(computeBackoff(0, { base: 1000, jitter: false })).toBe(1000);
    });

    it('doubles each attempt', () => {
      expect(computeBackoff(1, { base: 1000, jitter: false })).toBe(2000);
      expect(computeBackoff(2, { base: 1000, jitter: false })).toBe(4000);
      expect(computeBackoff(3, { base: 1000, jitter: false })).toBe(8000);
    });

    it('caps at max', () => {
      expect(computeBackoff(10, { base: 1000, max: 30_000, jitter: false })).toBe(30_000);
      expect(computeBackoff(20, { base: 1000, max: 30_000, jitter: false })).toBe(30_000);
    });

    it('respects custom base and max', () => {
      expect(computeBackoff(2, { base: 500, max: 5000, jitter: false })).toBe(2000);
      expect(computeBackoff(5, { base: 500, max: 5000, jitter: false })).toBe(5000);
    });
  });

  describe('with jitter (default)', () => {
    it('returns a value between 50% and 100% of the exponential delay', () => {
      for (let attempt = 0; attempt < 5; attempt++) {
        const exponential = Math.min(1000 * Math.pow(2, attempt), 30_000);
        const result = computeBackoff(attempt);
        expect(result).toBeGreaterThanOrEqual(Math.floor(exponential * 0.5));
        expect(result).toBeLessThanOrEqual(exponential);
      }
    });

    it('never exceeds max even with jitter', () => {
      for (let i = 0; i < 20; i++) {
        expect(computeBackoff(10)).toBeLessThanOrEqual(30_000);
      }
    });
  });
});
