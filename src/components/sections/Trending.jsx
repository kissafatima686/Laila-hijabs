import { useState, useEffect } from 'react';
import ProductCard from '../Products/ProductCard';
import { products } from '../../data/products';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Trending.css';

const Trending = () => {
  const displayProducts = [...products, ...products, ...products];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalOriginal = products.length;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    if (currentIndex >= totalOriginal) {
      setNoTransition(true);
      setCurrentIndex(0);
      setTimeout(() => {
        setNoTransition(false);
        setCurrentIndex(1);
      }, 20);
    } else {
      setNoTransition(false);
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex <= 0) {
      setNoTransition(true);
      setCurrentIndex(totalOriginal);
      setTimeout(() => {
        setNoTransition(false);
        setCurrentIndex(totalOriginal - 1);
      }, 20);
    } else {
      setNoTransition(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex]);

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

      <div className="trending-slider-viewport">
        <div 
          className="trending-slider-track"
          style={{
            transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * 240}px)`,
            transition: noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {displayProducts.map((item, idx) => (
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