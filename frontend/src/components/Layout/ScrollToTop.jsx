import React, { useState, useEffect } from 'react';
import { IoArrowUpOutline } from 'react-icons/io5';
import './ScrollToTop.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`} 
      onClick={scrollToTop} 
      aria-label="Scroll to top"
    >
      <IoArrowUpOutline size={22} />
    </button>
  );
};

export default ScrollToTop;
