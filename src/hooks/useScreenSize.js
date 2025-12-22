import React, { useState, useEffect } from 'react';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLargeScreen: true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 640, // Mobile: < 640px
        isTablet: width >= 640 && width < 1024, // Tablet: 640px - 1023px
        isDesktop: width >= 1024 && width < 1460, // Desktop: 1024px - 1639px
        isLargeScreen: width >= 1460, // Large Screen: >= 1640px
      });
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export default useScreenSize;