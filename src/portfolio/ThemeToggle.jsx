import { useRef } from 'react';
import { toggleTheme, useTheme } from './theme';

// Sun and moon share one SVG: the rays retract and a bite slides across the disc as the theme changes.
// A short spin plays on the button first, then the page reveal starts from its centre.
export default function ThemeToggle() {
  const theme = useTheme(), button = useRef(null);
  const onClick = () => {
    const el = button.current;
    el.classList.remove('is-switching');
    void el.offsetWidth;
    el.classList.add('is-switching');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => toggleTheme(el), reduce ? 0 : 260);
  };
  const dark = theme === 'dark';
  return <button ref={button} type="button" className={`theme-toggle${dark ? ' is-dark' : ''}`} onClick={onClick} onAnimationEnd={() => button.current?.classList.remove('is-switching')} aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'} aria-pressed={dark}>
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <mask id="theme-bite"><rect width="24" height="24" fill="#fff" /><circle className="theme-bite" cx="24" cy="4" r="7" fill="#000" /></mask>
      <circle className="theme-disc" cx="12" cy="12" r="5" mask="url(#theme-bite)" />
      <g className="theme-rays">{[0, 45, 90, 135, 180, 225, 270, 315].map(angle => <line key={angle} x1="12" y1="2.5" x2="12" y2="4.5" transform={`rotate(${angle} 12 12)`} />)}</g>
    </svg>
  </button>;
}
