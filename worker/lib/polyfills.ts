/**
 * Polyfills for Cloudflare Workers environment
 * This module provides necessary polyfills for Node.js modules that aren't available in Workers
 */

import { Buffer } from 'buffer';

// Make Buffer available globally
if (!globalThis.Buffer) {
  globalThis.Buffer = Buffer;
}

// Export for explicit imports
export { Buffer };
