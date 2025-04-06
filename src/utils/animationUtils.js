import { useEffect, useRef, useState } from 'react';

// Custom hook for scroll animations
export function useScrollAnimation(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // When the element enters the viewport
      if (entry.isIntersecting) {
        setIsVisible(true);
        // Once the animation has triggered, we can stop observing
        if (options.once !== false && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (options.once === false) {
        // If once is false, we want to animate every time the element enters the viewport
        setIsVisible(false);
      }
    }, {
      root: null, // viewport
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0.1, // trigger when 10% of the element is visible
    });
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.once, options.rootMargin, options.threshold]);
  
  return [ref, isVisible];
}
