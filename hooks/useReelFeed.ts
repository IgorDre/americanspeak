"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useReelFeed(total: number, onIndexChange?: (index: number) => void) {
  const [index, setIndex] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Refs mirror state so event handlers never read a stale closure — critical
  // when the component re-renders (e.g. hydration) on LAN/external access.
  const indexRef = useRef(0);
  const isTransitioningRef = useRef(false);

  const startY = useRef(0);
  const startX = useRef(0);
  const startTime = useRef(0); // ← real timestamp for velocity
  const draggingRef = useRef(false);
  const isPointerDown = useRef(false);
  const wheelAccum = useRef(0);
  const wheelTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep the latest callback without re-creating goTo / re-binding listeners.
  const onIndexChangeRef = useRef(onIndexChange);
  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  }, [onIndexChange]);

  const DRAG_THRESHOLD = 60; // px to commit a swipe
  const VELOCITY_THRESHOLD = 0.4; // px/ms — quick flick commits even under threshold
  const AXIS_LOCK = 8; // px horizontal movement before we cancel vertical drag

  const goTo = useCallback(
    (nextIndex: number) => {
      if (isTransitioningRef.current) return;
      if (nextIndex < 0 || nextIndex >= total) return;
      setIsTransitioning(true);
      isTransitioningRef.current = true;
      setDragY(0);
      indexRef.current = nextIndex;
      setIndex(nextIndex);
      setTimeout(() => {
        setIsTransitioning(false);
        isTransitioningRef.current = false;
        // Fires after the transition, immediately following the user gesture —
        // this is what unlocks speech playback on the new phrase.
        onIndexChangeRef.current?.(nextIndex);
      }, 380);
    },
    [total],
  );

  const goNext = useCallback(() => goTo(indexRef.current + 1), [goTo]);
  const goPrev = useCallback(() => goTo(indexRef.current - 1), [goTo]);

  // ── Pointer events — handles mouse, touch, and stylus uniformly ──────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    // Let button/link clicks pass through uninterrupted
    if ((e.target as HTMLElement).closest("button, a")) return;
    isPointerDown.current = true;
    draggingRef.current = false;
    startY.current = e.clientY;
    startX.current = e.clientX;
    startTime.current = Date.now(); // ← start timing here
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      /* capture unsupported — fall back to bubbling */
    }
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current || isTransitioningRef.current) return;
    const dy = e.clientY - startY.current;
    const dx = Math.abs(e.clientX - startX.current);
    // Cancel if user moves horizontally first (axis lock)
    if (!draggingRef.current && dx > AXIS_LOCK && Math.abs(dy) < AXIS_LOCK) {
      isPointerDown.current = false;
      return;
    }
    if (Math.abs(dy) > 10) {
      draggingRef.current = true;
      setIsDragging(true);
    }
    if (draggingRef.current) {
      const current = indexRef.current;
      // Rubber-band at edges: 25% resistance when there's nothing to swipe to
      const atEdge = (current === 0 && dy > 0) || (current === total - 1 && dy < 0);
      setDragY(dy * (atEdge ? 0.25 : 1));
    }
  }, [total]);

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isPointerDown.current) return;
      isPointerDown.current = false;
      if (!draggingRef.current) {
        setDragY(0);
        return;
      }
      draggingRef.current = false;
      setIsDragging(false);

      const dy = e.clientY - startY.current;
      const dt = Date.now() - startTime.current; // ← real elapsed ms
      const velocity = Math.abs(dy) / Math.max(dt, 1);
      const isFlick = velocity > VELOCITY_THRESHOLD;
      const isCommit = Math.abs(dy) > DRAG_THRESHOLD || isFlick;

      if (isCommit && dy < 0) goNext();
      else if (isCommit && dy > 0) goPrev();
      else setDragY(0);
    },
    [goNext, goPrev],
  );

  // ── Mouse wheel / trackpad — attached imperatively so preventDefault works ──
  // React attaches onWheel as a passive listener, where preventDefault() is a
  // no-op (and warns). Binding manually with { passive: false } restores it.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isTransitioningRef.current) return;
      wheelAccum.current += e.deltaY;
      if (wheelTimer.current) clearTimeout(wheelTimer.current);
      wheelTimer.current = setTimeout(() => {
        if (Math.abs(wheelAccum.current) > 50) {
          if (wheelAccum.current > 0) goNext();
          else goPrev();
        }
        wheelAccum.current = 0;
      }, 80);
    };

    el.addEventListener("wheel", handleWheel, { passive: false }); // ← critical
    return () => el.removeEventListener("wheel", handleWheel);
  }, [goNext, goPrev]);

  return {
    index,
    dragY,
    isTransitioning,
    isDragging,
    containerRef,
    goNext,
    goPrev,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
