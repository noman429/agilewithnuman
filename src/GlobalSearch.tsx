import { useEffect, useMemo, useRef, useState } from 'react';
import type { Theme } from './data/theme';
import { getSearchResults, SEARCH_CATEGORIES } from './data/search';

const RESULT_LIMIT = 12;

export default function GlobalSearch({ theme }: { theme: Theme }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [shortcutLabel, setShortcutLabel] = useState('Ctrl K');
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const allResults = useMemo(() => getSearchResults(query), [query]);
  const results = allResults.slice(0, RESULT_LIMIT);

  const close = (returnFocus = true) => {
    setOpen(false);
    setQuery('');
    if (returnFocus) window.setTimeout(() => triggerRef.current?.focus(), 0);
  };

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (/Mac|iPhone|iPad/.test(navigator.platform)) setShortcutLabel('⌘ K');
  }, []);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onShortcut);
    return () => window.removeEventListener('keydown', onShortcut);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
      if (event.key === 'Tab' && window.matchMedia('(max-width: 767px)').matches) {
        const focusable = rootRef.current?.querySelectorAll<HTMLElement>('.global-search-input-wrap input, .global-search-close, .global-search-result');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onEscape);
    window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onEscape);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !window.matchMedia('(max-width: 767px)').matches) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  const select = (index: number) => {
    const result = results[index];
    if (!result) return;
    close(false);
    const section = result.route.slice(1);
    window.setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.history.replaceState(null, '', result.route);
    }, 0);
  };

  return (
    <div ref={rootRef} className={`global-search search-slot${open ? ' is-open' : ''}`} data-open={open}>
      <button
        ref={triggerRef}
        className="global-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Open portfolio search"
        aria-expanded={open}
        aria-controls="global-search-panel"
        title="Search (Ctrl/⌘ K)"
        style={{ background: theme.card, borderColor: theme.cardBorder, color: theme.text }}
      >
        <span className="global-search-trigger-icon" aria-hidden="true">⌕</span>
        <span className="global-search-trigger-label">Search</span>
      </button>

      {open && <button className="global-search-backdrop" onClick={() => close()} aria-label="Close search" />}
      <div
        id="global-search-panel"
        className="global-search-panel search-shell"
        role="dialog"
        aria-modal={open ? 'true' : undefined}
        aria-label="Search portfolio"
        aria-hidden={!open}
        style={{ background: theme.navBg, borderColor: theme.cardBorder, color: theme.text }}
      >
        {open && <div className="global-search-input-wrap" style={{ borderColor: theme.cardBorder }}>
          <span className="global-search-icon" aria-hidden="true">⌕</span>
          <input
            ref={inputRef}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'ArrowDown') { event.preventDefault(); setActive((value) => Math.min(value + 1, results.length - 1)); }
              if (event.key === 'ArrowUp') { event.preventDefault(); setActive((value) => Math.max(value - 1, 0)); }
              if (event.key === 'Enter') { event.preventDefault(); select(active); }
            }}
            placeholder="Search portfolio…"
            aria-label="Search all portfolio content"
            aria-controls="global-search-results"
            aria-activedescendant={results[active] ? `global-search-result-${results[active].id}` : undefined}
          />
          <kbd aria-label="Keyboard shortcut Control or Command plus K">{shortcutLabel}</kbd>
          <button className="global-search-close" onClick={() => close()} aria-label="Close search">✕</button>
        </div>}
      </div>
      {open && <div className="global-search-dropdown search-dropdown" style={{ background: theme.navBg, borderColor: theme.cardBorder, color: theme.text }}>
          <div className="global-search-meta" style={{ color: theme.muted }}>
            <span>{query ? `${allResults.length} result${allResults.length === 1 ? '' : 's'}` : 'Explore portfolio'}</span>
            <span className="global-search-hint">↑↓ navigate · ↵ open</span>
          </div>
          <div id="global-search-results" className="global-search-results" role="listbox" aria-label="Portfolio search results">
            {results.map((result, index) => {
              const category = SEARCH_CATEGORIES[result.category];
              return (
                <button
                  id={`global-search-result-${result.id}`}
                  key={result.id}
                  role="option"
                  aria-selected={index === active}
                  aria-label={`${result.title}. ${category.label}. ${result.description}`}
                  className={`global-search-result${index === active ? ' active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => select(index)}
                  style={{ color: theme.text, borderColor: index === active ? '#5b7cfa' : 'transparent' }}
                >
                  <span className="global-search-result-icon" aria-hidden="true">{category.icon}</span>
                  <span className="global-search-result-copy"><strong>{result.title}</strong><small style={{ color: theme.muted }}>{result.description}</small></span>
                  <span className={`global-search-category ${category.badgeClass}`} aria-label={category.accessibleLabel}>{category.label}</span>
                </button>
              );
            })}
            {!results.length && <div className="global-search-empty" role="status"><span aria-hidden="true">⌕</span><strong>No matches found</strong><small style={{ color: theme.muted }}>Try a project, methodology, document, or tool name.</small></div>}
            {allResults.length > RESULT_LIMIT && <div className="global-search-more" style={{ color: theme.muted }}>{allResults.length - RESULT_LIMIT} more matching resources</div>}
          </div>
        </div>}
    </div>
  );
}
