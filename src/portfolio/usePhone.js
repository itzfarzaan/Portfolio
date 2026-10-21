import { useSyncExternalStore } from 'react';

// Phones only (not tablets): the self-running mobile hero and footer streaks use this breakpoint.
export const PHONE = '(max-width: 600px)';
const subscribe = notify => {
  const query = window.matchMedia(PHONE);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
};
export const useIsPhone = () => useSyncExternalStore(subscribe, () => window.matchMedia(PHONE).matches, () => false);
