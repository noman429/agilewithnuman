import { useEffect, useState } from 'react';
import type { Theme } from '../data/theme';
import GlobalSearch from '../GlobalSearch';

const NAV_SECTIONS = ['about', 'experience', 'projects', 'practices', 'docs', 'tools', 'contact'] as const;
const NAV_LABELS: Record<string, string> = {
  about: 'About', experience: 'Experience', projects: 'Projects', practices: 'Knowledge',
  docs: 'Documentation', tools: 'Skills', contact: 'Contact',
};

export { NAV_SECTIONS };

export default function Nav({
  theme, navVisible, activeSection, themeName, onToggleTheme,
}: {
  theme: Theme;
  navVisible: boolean;
  activeSection: string;
  themeName: 'dark' | 'light';
  onToggleTheme: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnScroll = () => setMenuOpen(false);
    const closeOnOutsideTap = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest && (target.closest('.nav-mobile-menu') || target.closest('.nav-burger-corner'))) return;
      setMenuOpen(false);
    };
    window.addEventListener('scroll', closeOnScroll, { passive: true });
    document.addEventListener('click', closeOnOutsideTap, true);
    return () => {
      window.removeEventListener('scroll', closeOnScroll);
      document.removeEventListener('click', closeOnOutsideTap, true);
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header" style={{
        top: navVisible ? '24px' : '-90px',
      }}>
        <div className="site-header__inner">
          <button
            className="nav-burger-corner"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            style={{ border: `1px solid ${theme.cardBorder}`, background: theme.card, color: theme.text }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <nav className="site-nav nav-pill" aria-label="Primary navigation" style={{
            background: theme.navBg, border: `1px solid ${theme.cardBorder}`,
            boxShadow: '0 18px 50px -28px rgba(0,0,0,0.75)',
          }}>
            <div className="nav-links">
              {NAV_SECTIONS.map((id) => {
                const active = activeSection === id;
                return (
                  <a
                    key={id}
                    href={`#${id}`}
                    aria-current={active ? 'page' : undefined}
                    className={`nav-link${active ? ' active' : ''}`}
                    style={{
                      color: active ? '#ffffff' : theme.muted,
                      background: active ? 'linear-gradient(90deg,#5b7cfa,#9b6bfa)' : 'transparent',
                    }}
                  >
                    {NAV_LABELS[id]}
                  </a>
                );
              })}
            </div>
          </nav>
          <GlobalSearch theme={theme} />
          <button
            className="nav-theme-toggle"
            onClick={onToggleTheme}
            aria-label={themeName === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            style={{
              border: `1px solid ${theme.cardBorder}`,
              background: theme.card, color: theme.text, cursor: 'pointer', fontSize: 13,
            }}
          >
            {themeName === 'dark' ? '☀' : '☽'}
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav id="mobile-navigation" className="nav-mobile-menu" aria-label="Mobile navigation" style={{ background: theme.navBg, border: `1px solid ${theme.cardBorder}` }}>
          {NAV_SECTIONS.map((id) => {
            const active = activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`nav-mobile-link${active ? ' active' : ''}`}
                style={{
                  color: active ? '#ffffff' : theme.text,
                  background: active ? 'linear-gradient(90deg,#5b7cfa,#9b6bfa)' : 'transparent',
                }}
              >
                {NAV_LABELS[id]}
              </a>
            );
          })}
        </nav>
      )}
    </>
  );
}
