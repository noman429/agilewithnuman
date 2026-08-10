import { useEffect, useState, type CSSProperties } from 'react';

type ScrollHint = {
  element: HTMLElement;
  key: string;
  left: number;
  bottom: number;
  width: number;
  background: string;
};

const MANAGED_SELECTOR = '.modal-pop,.pl-modal,.proj-detail-overlay';
const BOTTOM_TOLERANCE = 12;

const isVisible = (element: HTMLElement) => {
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < window.innerHeight;
};

const hasMoreContent = (element: HTMLElement) =>
  element.scrollHeight > element.clientHeight + 8
  && element.scrollTop + element.clientHeight < element.scrollHeight - BOTTOM_TOLERANCE;

export default function ScrollHintManager() {
  const [hints, setHints] = useState<ScrollHint[]>([]);

  useEffect(() => {
    const listeners = new Map<HTMLElement, () => void>();
    const resizeObservers = new Map<HTMLElement, ResizeObserver>();
    const ids = new WeakMap<HTMLElement, number>();
    let nextId = 1;
    let frame = 0;

    const refresh = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const next = Array.from(document.querySelectorAll<HTMLElement>(MANAGED_SELECTOR))
          .filter((element) => isVisible(element) && hasMoreContent(element))
          .map((element) => {
            let id = ids.get(element);
            if (!id) {
              id = nextId++;
              ids.set(element, id);
            }
            const rect = element.getBoundingClientRect();
            const background = window.getComputedStyle(element).backgroundColor || 'rgb(18, 22, 38)';
            return {
              element,
              key: `scroll-surface-${id}`,
              left: Math.max(0, rect.left),
              bottom: Math.max(0, window.innerHeight - Math.min(window.innerHeight, rect.bottom)),
              width: Math.min(rect.width, window.innerWidth),
              background,
            };
          });
        setHints(next);
      });
    };

    const attach = () => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(MANAGED_SELECTOR));
      elements.forEach((element) => {
        if (listeners.has(element)) return;
        const onScroll = () => refresh();
        element.addEventListener('scroll', onScroll, { passive: true });
        listeners.set(element, onScroll);

        if ('ResizeObserver' in window) {
          const observer = new ResizeObserver(refresh);
          observer.observe(element);
          if (element.firstElementChild instanceof HTMLElement) observer.observe(element.firstElementChild);
          resizeObservers.set(element, observer);
        }
      });

      for (const [element, onScroll] of listeners) {
        if (document.contains(element)) continue;
        element.removeEventListener('scroll', onScroll);
        listeners.delete(element);
        resizeObservers.get(element)?.disconnect();
        resizeObservers.delete(element);
      }
      refresh();
    };

    const mutationObserver = new MutationObserver(attach);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('scroll', refresh, { passive: true });
    attach();

    return () => {
      mutationObserver.disconnect();
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh);
      window.cancelAnimationFrame(frame);
      for (const [element, onScroll] of listeners) element.removeEventListener('scroll', onScroll);
      for (const observer of resizeObservers.values()) observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
        .modal-pop,.pl-modal,.proj-detail-overlay,.ai-modal{
          scrollbar-width:none!important;
          -ms-overflow-style:none!important;
          overscroll-behavior:contain;
        }
        .modal-pop::-webkit-scrollbar,.pl-modal::-webkit-scrollbar,.proj-detail-overlay::-webkit-scrollbar,.ai-modal::-webkit-scrollbar{
          display:none!important;width:0!important;height:0!important;
        }
        .shared-scroll-hint-wrap{
          position:fixed;z-index:1210;height:72px;display:flex;align-items:flex-end;justify-content:center;padding-bottom:11px;
          border-radius:0 0 20px 20px;pointer-events:none;animation:sharedScrollHintIn .22s ease both;
        }
        .shared-scroll-hint{
          pointer-events:auto;border:1px solid rgba(34,211,238,.3);background:rgba(15,20,34,.9);color:#22d3ee;
          border-radius:999px;padding:7px 12px 6px;display:flex;align-items:center;gap:8px;cursor:pointer;
          box-shadow:0 10px 30px -18px rgba(34,211,238,.85);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);
        }
        .shared-scroll-hint:focus-visible{outline:2px solid #22d3ee;outline-offset:3px}
        .shared-scroll-hint-label{font-size:9px;font-weight:850;letter-spacing:.12em;text-transform:uppercase}
        .shared-scroll-chevrons{display:flex;flex-direction:column;line-height:.42;font-size:12px;transform:translateY(-1px)}
        .shared-scroll-chevrons span:first-child{animation:sharedScrollPulse 1.25s ease-in-out infinite}
        .shared-scroll-chevrons span:last-child{animation:sharedScrollPulse 1.25s .16s ease-in-out infinite}
        @keyframes sharedScrollPulse{0%,100%{opacity:.25;transform:translateY(-1px)}50%{opacity:1;transform:translateY(2px)}}
        @keyframes sharedScrollHintIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:translateY(0)}}
        @media(prefers-reduced-motion:reduce){
          .shared-scroll-hint-wrap,.shared-scroll-chevrons span{animation:none!important}
        }
      `}</style>

      {hints.map((hint) => {
        const style = {
          left: hint.left,
          bottom: hint.bottom,
          width: hint.width,
          background: `linear-gradient(to bottom, transparent 0%, color-mix(in srgb, ${hint.background} 78%, transparent) 42%, ${hint.background} 88%)`,
        } as CSSProperties;

        return (
          <div key={hint.key} className="shared-scroll-hint-wrap" style={style}>
            <button
              type="button"
              className="shared-scroll-hint"
              onClick={() => hint.element.scrollBy({ top: Math.max(220, hint.element.clientHeight * 0.42), behavior: 'smooth' })}
              aria-label="Scroll for more content"
            >
              <span className="shared-scroll-hint-label">Scroll for more</span>
              <span className="shared-scroll-chevrons" aria-hidden="true"><span>⌄</span><span>⌄</span></span>
            </button>
          </div>
        );
      })}
    </>
  );
}
