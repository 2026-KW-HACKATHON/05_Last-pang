import { useEffect, useRef, useState } from 'react';

import {
  GRID_END_MIN,
  GRID_START_MIN,
  LONG_PRESS_MS,
  MOVE_CANCEL_PX,
  SLOT_COUNT,
  SLOT_MIN,
  SLOT_PX,
  WEEK_DAYS,
} from './constants';

import type { DragRange } from './types';
import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';

interface Gesture {
  pointerId: number;
  dow: number;
  anchor: number; // 처음 누른 칸
  current: number; // 지금 손가락이 있는 칸
  x: number;
  y: number;
  isActive: boolean;
  timerId?: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

function toRange(gesture: Gesture): DragRange {
  const low = Math.min(gesture.anchor, gesture.current);
  const high = Math.max(gesture.anchor, gesture.current) + 1;
  return {
    dow: gesture.dow,
    startMin: GRID_START_MIN + low * SLOT_MIN,
    endMin: GRID_START_MIN + high * SLOT_MIN,
  };
}

// 빈 칸을 톡 누르면 1시간짜리로 시작
function toTapRange(gesture: Gesture): DragRange {
  const startMin = GRID_START_MIN + gesture.anchor * SLOT_MIN;
  return { dow: gesture.dow, startMin, endMin: Math.min(startMin + 60, GRID_END_MIN) };
}

/** 빈 칸 끌어서 시간 고르기. 마우스는 바로, 터치는 꾹 누른 뒤 끌기 (스크롤과 구분) */
export function useDragSelect(onSelect: (range: DragRange) => void) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const [range, setRange] = useState<DragRange | null>(null);

  const cellAt = (clientX: number, clientY: number) => {
    const rect = bodyRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const column = clamp(Math.floor(((clientX - rect.left) / rect.width) * 7), 0, 6);
    const slot = clamp(Math.floor((clientY - rect.top) / SLOT_PX), 0, SLOT_COUNT - 1);
    return { dow: WEEK_DAYS[column]?.dow ?? 1, slot };
  };

  const reset = () => {
    window.clearTimeout(gestureRef.current?.timerId);
    gestureRef.current = null;
    setRange(null);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    if (event.target instanceof Element && event.target.closest('[data-block]')) return;
    const cell = cellAt(event.clientX, event.clientY);
    if (!cell) return;
    const gesture: Gesture = {
      pointerId: event.pointerId,
      dow: cell.dow,
      anchor: cell.slot,
      current: cell.slot,
      x: event.clientX,
      y: event.clientY,
      isActive: false,
    };
    gestureRef.current = gesture;
    const activate = () => {
      gesture.isActive = true;
      setRange(toRange(gesture));
      try {
        bodyRef.current?.setPointerCapture(gesture.pointerId);
      } catch {
        // 이미 손을 뗀 포인터면 무시
      }
    };
    if (event.pointerType === 'mouse') activate();
    else gesture.timerId = window.setTimeout(activate, LONG_PRESS_MS);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    if (!gesture.isActive) {
      const moved = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y);
      if (moved > MOVE_CANCEL_PX) reset(); // 꾹 누르기 전에 움직이면 스크롤
      return;
    }
    const cell = cellAt(event.clientX, event.clientY);
    if (!cell || cell.slot === gesture.current) return;
    gesture.current = cell.slot;
    setRange(toRange(gesture));
  };

  const handlePointerUp = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const selected = gesture.current === gesture.anchor ? toTapRange(gesture) : toRange(gesture);
    reset();
    onSelect(selected);
  };

  // 끄는 중에는 페이지가 스크롤되지 않게 (React 터치 핸들러는 passive라 직접 단다)
  useEffect(() => {
    const body = bodyRef.current;
    if (!body) return;
    const blockScroll = (event: TouchEvent) => {
      if (gestureRef.current?.isActive && event.cancelable) event.preventDefault();
    };
    body.addEventListener('touchmove', blockScroll, { passive: false });
    return () => {
      body.removeEventListener('touchmove', blockScroll);
      window.clearTimeout(gestureRef.current?.timerId);
    };
  }, []);

  return {
    bodyRef,
    range,
    handlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: reset,
      onContextMenu: (event: ReactMouseEvent) => event.preventDefault(), // 꾹 누를 때 메뉴 막기
    },
  };
}
