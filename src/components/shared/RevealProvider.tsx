'use client';

import { useEffect } from 'react';

/**
 * One-shot reveal: помечает <html> классом js-reveal (CSS скрывает [data-reveal]
 * только в этом режиме) и добавляет .is-revealed при первом входе во viewport.
 * prefers-reduced-motion: reduce → ничего не делает (контент виден сразу).
 * Рендерит null.
 */
export default function RevealProvider() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('js-reveal');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      },
      // -10% снизу: блок стартует, когда реально вошёл в кадр, а не на границе
      { rootMargin: '0px 0px -10% 0px' }
    );

    // Допущение: все [data-reveal] серверно отрендерены к моменту mount (no dynamic()/Suspense). При появлении динамических блоков — заменить на MutationObserver.
    document.querySelectorAll('[data-reveal]').forEach((el) => {
      // Deep-link с якорем: всё, что уже выше вьюпорта, показываем сразу
      if (el.getBoundingClientRect().bottom < 0) {
        el.classList.add('is-revealed');
        return;
      }
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
      document.documentElement.classList.remove('js-reveal');
    };
  }, []);

  return null;
}
