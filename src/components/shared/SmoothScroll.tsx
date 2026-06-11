'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Инициализирует Lenis smooth-scroll один раз на приложение (монтируется в layout).
 * - prefers-reduced-motion: reduce → Lenis не включается (нативный скролл).
 * - Клики по same-page якорям (#waitlist) едут плавно через lenis.scrollTo.
 * Рендерит null — DOM страниц не меняется.
 *
 * lenis 1.3.23: autoRaf + anchors опции поддерживаются нативно.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({ autoRaf: true, anchors: true });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
