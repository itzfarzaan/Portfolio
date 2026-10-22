import { useEffect, useState } from 'react';
import NavLogo from './NavLogo';

// A floating back-to-top button in the bottom-right corner. It stays hidden at the top of the page and
// appears once the visitor scrolls: the orbit loads in around the dot first, then the "fa" letters.
export default function BackToTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setShown(window.scrollY > 240));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', update);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <button type="button" className={`to-top${shown ? ' is-shown' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top" aria-hidden={!shown} tabIndex={shown ? 0 : -1}>
    <NavLogo />
  </button>;
}
