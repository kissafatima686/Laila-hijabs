import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTopOnNavigation = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }, [pathname, search, hash]);

  useEffect(() => {
    const handleLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (anchor) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
    };

    document.addEventListener('click', handleLinkClick);
    return () => document.removeEventListener('click', handleLinkClick);
  }, []);

  return null;
};

export default ScrollToTopOnNavigation;
