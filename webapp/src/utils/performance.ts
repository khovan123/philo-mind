/**
 * T-G06 — Performance optimization utilities
 *
 * Provides React.memo wrappers, memoized selectors, and RTK Query
 * cache configuration helpers for the Philomind app.
 */

import React, { type ComponentType, type PropsWithChildren } from "react";

// ── 1. Generic memo wrapper with display name ───────────────────

/**
 * Wraps a component with React.memo while preserving its display name.
 * Optionally accepts a custom comparator for fine-grained re-render control.
 *
 * @example
 * const Card = optimizedMemo(function Card(props: CardProps) { ... });
 */
export function optimizedMemo<P extends object>(
  Component: ComponentType<P>,
  areEqual?: (
    prevProps: Readonly<PropsWithChildren<P>>,
    nextProps: Readonly<PropsWithChildren<P>>,
  ) => boolean,
): React.MemoExoticComponent<ComponentType<P>> {
  const Memoized = React.memo(Component, areEqual);
  Memoized.displayName = `Memo(${Component.displayName || Component.name || "Component"})`;
  return Memoized;
}

// ── 2. Shallow equality check (for selector memoization) ────────

/**
 * Shallow-equal comparison for objects (single level deep).
 * Useful as `equalityFn` for `useAppSelector` to avoid
 * unnecessary re-renders when selecting derived objects.
 */
export function shallowEqual<T extends Record<string, unknown>>(a: T, b: T): boolean {
  if (a === b) return true;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (a[key] !== b[key]) return false;
  }
  return true;
}

// ── 3. RTK Query cache lifetime presets ─────────────────────────

/**
 * Standard cache lifetime presets for RTK Query endpoints.
 * Use these as `keepUnusedDataFor` values in endpoint definitions
 * to standardise cache behaviour across the app.
 */
export const CacheLifetimes = {
  /** Static data that rarely changes (e.g., badge definitions). 10 min. */
  LONG: 600,
  /** Semi-dynamic data (e.g., user profile, learning progress). 3 min. */
  MEDIUM: 180,
  /** Frequently changing data (e.g., notification count). 30 sec. */
  SHORT: 30,
  /** Real-time data. No caching beyond the component lifecycle. */
  NONE: 0,
} as const;

// ── 4. Debounced callback for search / input fields ─────────────

/**
 * Creates a debounced version of a callback.
 * Useful for search inputs to avoid excessive API calls.
 */
export function debounce<T extends (...args: never[]) => void>(
  fn: T,
  delayMs: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

// ── 5. List item key extractor ──────────────────────────────────

/**
 * Reusable key extractor for FlatList / SectionList.
 * Avoids creating a new function reference on every render.
 */
export const keyExtractor = (item: { id: string }): string => item.id;
