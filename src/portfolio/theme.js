import { useSyncExternalStore } from 'react';

// The theme lives on <html data-theme>. index.html sets it before first paint from the saved choice or the OS setting.
const root = () => document.documentElement;
export const currentTheme = () => root().dataset.theme === 'dark' ? 'dark' : 'light';

const listeners = new Set();
const subscribe = notify => {
  listeners.add(notify);
  return () => listeners.delete(notify);
};
export const useTheme = () => useSyncExternalStore(subscribe, currentTheme, () => 'light');

function apply(theme) {
  root().dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0e0f13' : '#fafaf8');
  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Private mode or blocked storage: the choice still applies for this visit.
  }
  listeners.forEach(notify => notify());
}

// Switch themes with a circular reveal that grows from the toggle. Phones get a short colour fade
// instead: the reveal snapshots the page, and mobile browsers rescale that snapshot against their
// toolbars, so the page briefly zooms. The fade is also used where view transitions are unsupported,
// and reduced motion swaps instantly.
export function toggleTheme(origin) {
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return apply(next);
  const touch = window.matchMedia('(max-width: 600px), (pointer: coarse)').matches;
  if (!document.startViewTransition || touch) {
    root().classList.add('theme-fading');
    apply(next);
    setTimeout(() => root().classList.remove('theme-fading'), 450);
    return;
  }
  const box = origin?.getBoundingClientRect();
  const x = box ? box.left + box.width / 2 : window.innerWidth - 40, y = box ? box.top + box.height / 2 : 40;
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
  root().style.setProperty('--reveal-x', `${x}px`);
  root().style.setProperty('--reveal-y', `${y}px`);
  root().style.setProperty('--reveal-r', `${radius}px`);
  document.startViewTransition(() => apply(next));
}
