/**
 * Test data generator utilities
 */

export class TestDataUtil {
  /**
   * Generate random string
   */
  static randomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, length + 2);
  }

  /**
   * Generate random email
   */
  static randomEmail(): string {
    return `test_${this.randomString(8)}@example.com`;
  }

  /**
   * Generate random number
   */
  static randomNumber(min: number = 0, max: number = 100): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Generate random boolean
   */
  static randomBoolean(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Pick random item from array
   */
  static randomFromArray<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Generate timestamp
   */
  static timestamp(): string {
    return new Date().toISOString();
  }

  /**
   * Sleep/wait utility
   */
  static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Retry utility for flaky operations
 */
export class RetryUtil {
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      delayMs?: number;
      onRetry?: (attempt: number, error: any) => void;
    } = {}
  ): Promise<T> {
    const maxRetries = options.maxRetries || 3;
    const delayMs = options.delayMs || 1000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        if (attempt === maxRetries) {
          throw error;
        }

        if (options.onRetry) {
          options.onRetry(attempt, error);
        }

        await TestDataUtil.sleep(delayMs * attempt);
      }
    }

    throw new Error('Retry failed');
  }
}
