import { useState, useEffect } from 'react';

/**
 * A hook to detect if the screen is below a certain width.
 * @param breakpoint The width in pixels to check against. Defaults to 768px (md).
 * @returns {boolean} True if the window width is less than the breakpoint.
 */
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, [breakpoint]);

  return isMobile;
};

export default useIsMobile;
