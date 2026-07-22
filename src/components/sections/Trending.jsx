import { useState, useEffect, useRef } from 'react';
import ProductCard from '../Products/ProductCard';
import { products } from '../../data/products';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Trending.css';

const Trending = () => {
  const trendingItems = products.concat(products);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewportRef = useRef(null);
  const maxIndex = products.length;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    if (isMobile && viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        viewportRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: viewportRef.current.offsetWidth, behavior: 'smooth' });
      }
    } else {
      setCurrentIndex((prev) => (prev + 1) % maxIndex);
    }
  };

  const prevSlide = () => {
    if (isMobile && viewportRef.current) {
      const { scrollLeft, scrollWidth } = viewportRef.current;
      if (scrollLeft <= 10) {
        viewportRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: -viewportRef.current.offsetWidth, behavior: 'smooth' });
      }
    } else {
      setCurrentIndex((prev) => (prev - 1 + maxIndex) % maxIndex);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, isMobile]);

  return (
    <section 
      className="trending-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="trending-header">
        <h2>TRENDING</h2>
        <div className="trending-controls">
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous trending items">
            <FaChevronLeft />
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Next trending items">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="trending-slider-viewport" ref={viewportRef}>
        <div 
          className="trending-slider-track"
          style={isMobile ? {} : {
            transform: `translateX(-${currentIndex * (220 + 20)}px)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {trendingItems.map((item, idx) => (
            <div key={idx} className="trending-card-item">
              <ProductCard product={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trending;