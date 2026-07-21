"use client";

import { RefObject, useCallback, useEffect, useRef } from "react";
import type { PointerEvent } from "react";

const MIN_POINTER_DELTA_SECONDS = 1 / 240;
const STICKY_RELEASE_DISTANCE = 64;

export type ElasticPointer = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  velocityX: number;
  velocityY: number;
  time: number;
  isInside: boolean;
  isEngaged: boolean;
  isSticky: boolean;
};

type PointerTrackerOptions = {
  elementRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
  onActivity: () => void;
};

/**
 * Tracks pointer position and velocity in local SVG coordinates. Bounds are cached
 * and refreshed only on enter, resize, and scroll to avoid layout reads per frame.
 */
export function usePointerTracker({ elementRef, disabled = false, onActivity }: PointerTrackerOptions) {
  const pointerRef = useRef<ElasticPointer>({ x: 0, y: 0, previousX: 0, previousY: 0, velocityX: 0, velocityY: 0, time: 0, isInside: false, isEngaged: false, isSticky: false });
  const boundsRef = useRef({ left: 0, top: 0, width: 1, height: 1 });
  const stickyListenerRef = useRef<((event: globalThis.PointerEvent) => void) | null>(null);

  const refreshBounds = useCallback(() => {
    const bounds = elementRef.current?.getBoundingClientRect();
    if (!bounds) return;
    boundsRef.current.left = bounds.left;
    boundsRef.current.top = bounds.top;
    boundsRef.current.width = Math.max(bounds.width, 1);
    boundsRef.current.height = Math.max(bounds.height, 1);
  }, [elementRef]);

  /** Updates the ref-only pointer state without scheduling a React render. */
  const updatePointerPosition = useCallback((clientX: number, clientY: number) => {
    if (disabled) return;

    const pointer = pointerRef.current;
    const bounds = boundsRef.current;
    const now = performance.now();
    const nextX = clientX - bounds.left;
    const nextY = clientY - bounds.top;
    const elapsed = Math.max((now - pointer.time) / 1000, MIN_POINTER_DELTA_SECONDS);

    pointer.previousX = pointer.x;
    pointer.previousY = pointer.y;
    pointer.x = nextX;
    pointer.y = nextY;
    pointer.velocityX = (nextX - pointer.previousX) / elapsed;
    pointer.velocityY = (nextY - pointer.previousY) / elapsed;
    pointer.time = now;
    onActivity();
  }, [disabled, onActivity]);

  const detachStickyPointer = useCallback(() => {
    if (stickyListenerRef.current) document.removeEventListener("pointermove", stickyListenerRef.current);
    stickyListenerRef.current = null;
  }, []);

  /** Keeps tracking after exit until the pointer exceeds the sticky-release radius. */
  const trackStickyPointer = useCallback((event: globalThis.PointerEvent) => {
    if (disabled || !pointerRef.current.isSticky) return;

    updatePointerPosition(event.clientX, event.clientY);
    const bounds = boundsRef.current;
    const horizontalDistance = Math.max(bounds.left - event.clientX, 0, event.clientX - (bounds.left + bounds.width));
    const verticalDistance = Math.max(bounds.top - event.clientY, 0, event.clientY - (bounds.top + bounds.height));

    if (Math.hypot(horizontalDistance, verticalDistance) > STICKY_RELEASE_DISTANCE) {
      pointerRef.current.isSticky = false;
      pointerRef.current.isEngaged = false;
      detachStickyPointer();
      onActivity();
    }
  }, [detachStickyPointer, disabled, onActivity, updatePointerPosition]);

  const updatePointer = useCallback((event: PointerEvent<HTMLElement>) => {
    updatePointerPosition(event.clientX, event.clientY);
  }, [updatePointerPosition]);

  const onPointerEnter = useCallback((event: PointerEvent<HTMLElement>) => {
    if (disabled) return;
    detachStickyPointer();
    refreshBounds();
    pointerRef.current.isInside = true;
    pointerRef.current.isEngaged = true;
    pointerRef.current.isSticky = false;
    pointerRef.current.time = performance.now();
    updatePointer(event);
  }, [detachStickyPointer, disabled, refreshBounds, updatePointer]);

  const onPointerLeave = useCallback((event: PointerEvent<HTMLElement>) => {
    if (disabled) return;
    pointerRef.current.isInside = false;
    pointerRef.current.isEngaged = true;
    pointerRef.current.isSticky = true;
    updatePointer(event);
    stickyListenerRef.current = trackStickyPointer;
    document.addEventListener("pointermove", trackStickyPointer, { passive: true });
    onActivity();
  }, [disabled, onActivity, trackStickyPointer, updatePointer]);

  /** Cancels sticky tracking for keyboard blur, disabled state, or unmount. */
  const deactivate = useCallback(() => {
    const pointer = pointerRef.current;
    pointer.isInside = false;
    pointer.isSticky = false;
    pointer.isEngaged = false;
    detachStickyPointer();
    onActivity();
  }, [detachStickyPointer, onActivity]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new ResizeObserver(refreshBounds);
    observer.observe(element);
    window.addEventListener("scroll", refreshBounds, { passive: true, capture: true });
    window.addEventListener("resize", refreshBounds, { passive: true });
    refreshBounds();

    return () => {
      observer.disconnect();
      detachStickyPointer();
      window.removeEventListener("scroll", refreshBounds, true);
      window.removeEventListener("resize", refreshBounds);
    };
  }, [detachStickyPointer, elementRef, refreshBounds]);

  return { pointerRef, pointerHandlers: { onPointerEnter, onPointerMove: updatePointer, onPointerLeave }, deactivate };
}
