// Utility functions for managing timestamps and soft deletes

import { eq, isNull, and, not } from 'drizzle-orm';
import { SQLiteColumn } from 'drizzle-orm/sqlite-core';

/**
 * Get current timestamp in ISO string format
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Generate timestamps for create operations
 */
export function createTimestamps() {
  const now = getCurrentTimestamp();
  return {
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
}

/**
 * Generate timestamps for update operations
 */
export function updateTimestamps() {
  return {
    updatedAt: getCurrentTimestamp(),
  };
}

/**
 * Generate timestamps for soft delete operations
 */
export function deleteTimestamps() {
  const now = getCurrentTimestamp();
  return {
    updatedAt: now,
    deletedAt: now,
  };
}

/**
 * Create a where condition to exclude soft deleted records
 */
export function excludeDeleted(deletedAtColumn: SQLiteColumn) {
  return isNull(deletedAtColumn);
}

/**
 * Create a where condition to include only soft deleted records
 */
export function onlyDeleted(deletedAtColumn: SQLiteColumn) {
  return not(isNull(deletedAtColumn));
}

/**
 * Create a where condition for active records with additional condition
 */
export function activeWithCondition(deletedAtColumn: SQLiteColumn, condition: any) {
  return and(isNull(deletedAtColumn), condition);
}

/**
 * Restore a soft deleted record
 */
export function restoreTimestamps() {
  return {
    updatedAt: getCurrentTimestamp(),
    deletedAt: null,
  };
}
