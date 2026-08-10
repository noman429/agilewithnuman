import { useEffect, useRef, useState } from 'react';
import { THEMES, type ThemeName } from './data/theme';
import Nav, { NAV_SECTIONS } from './sections/Nav';
import Hero from './sections/Hero';
import About from './sections/About';
import Experience from './sections/Experience';
import Projects from './sections/Projects';
import Practices from './sections/Practices';
import ProjectLifecycle from './sections/ProjectLifecycle';
import './sections/ProjectLifecycle.layout.css';
import Docs from './sections/Docs';
import Tools from './sections/Tools';
import EducationContact from './sections/EducationContact';
import Contact from './sections/Contact';

const PARTICLES = [
  { size: 4, top: '12%', left: '8%', duration: '16s', delay: '0s' },
  { size: 3, top: '28%', left: '78%', duration: '20s', delay: '-4s' },
  { size: 5, top: '55%', left: '22%', duration: '19s', delay: '-9s' },
  { size: 3, top: '70%', left: '85%', duration: '17s', delay: '-2s' },
  { size: 4, top: '85%', left: '45%', duration: '21s', delay: '-13s' },
  { size: 3, top: '40%', left: '60%', duration: '18s', delay: '-6s' },
];

export default function App() {
  const [themeName, setThemeName] = useState<ThemeName>('dark');
  const [navVisible, setNavVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');
  const theme = THEMES[themeName];

  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const visible = y < 80 || y < lastY.current;
      lastY.current = y;
      setNavVisible((prev) => (prev === visible ? prev : visible));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection((prev) => (prev === entry.target.id ? prev : entry.target.id));
            break;
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );
    for (const id of NAV_SECTIONS) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;
    const onMouseMoveSpotlight = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const el = target.closest && (target.closest('.card, .btn') as HTMLElement | null);
      if (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
      }
    };
    document.addEventListener('mousemove', onMouseMoveSpotlight);
    return () => document.removeEventListener('mousemove', onMouseMoveSpotlight);
  }, []);

  const toggleTheme = () => setThemeName((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 15% 20%,rgba(91,124,250,0.16),transparent 45%),radial-gradient(circle at 85% 15%,rgba(244,95,176,0.13),transparent 42%),radial-gradient(circle at 50% 90%,rgba(155,107,250,0.13),transparent 45%)',
          backgroundSize: '200% 200%, 200% 200%, 200% 200%',
          animation: 'meshDrift 22s ease-in-out infinite',
        }}
      >
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="amb-particle"
            style={{ width: p.size, height: p.size, top: p.top, left: p.left, animationDuration: p.duration, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div style={{ fontFamily: "-apple-system,'Segoe UI',system-ui,sans-serif", background: theme.bg, color: theme.text, minHeight: '100vh', overflowX: 'hidden', position: 'relative', zIndex: 1, transition: 'background .4s ease, color .4s ease' }}>
        <Nav theme={theme} navVisible={navVisible} activeSection={activeSection} themeName={themeName} onToggleTheme={toggleTheme} />
        <Hero theme={theme} />
        <About theme={theme} />
        <Experience theme={theme} />
        <Projects theme={theme} />
        <Practices theme={theme} />
        <ProjectLifecycle theme={theme} />
        <Docs theme={theme} />
        <Tools theme={theme} />
        <EducationContact theme={theme} />
        <Contact theme={theme} />
      </div>
    </>
  );
}
