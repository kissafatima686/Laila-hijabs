import { useState, useEffect, useRef } from 'react';
import ProductCard from '../Products/ProductCard';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './ShopHijab.css';

const ShopHijab = () => {
  const [hijabItems, setHijabItems] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/products?category=hijabs`)
      .then(res => res.json())
      .then(data => setHijabItems(data))
      .catch(err => console.error("Failed to fetch hijabs", err));
  }, []);

  const extendedItems = hijabItems.concat(hijabItems).concat(hijabItems);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const viewportRef = useRef(null);

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
      viewportRef.current.scrollBy({ left: viewportRef.current.offsetWidth, behavior: 'smooth' });
    } else {
      setCurrentIndex((prev) => (prev + 1) % hijabItems.length);
    }
  };

  const prevSlide = () => {
    if (isMobile && viewportRef.current) {
      viewportRef.current.scrollBy({ left: -viewportRef.current.offsetWidth, behavior: 'smooth' });
    } else {
      setCurrentIndex((prev) => (prev - 1 + hijabItems.length) % hijabItems.length);
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
      className="shop-hijab-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="shop-hijab-header">
        <h2>SHOP HIJAB</h2>
        <div className="slider-controls">
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous hijabs">
            <FaChevronLeft />
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Next hijabs">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="shop-hijab-viewport" ref={viewportRef}>
        <div 
          className="shop-hijab-track"
          style={isMobile ? {} : {
            transform: `translateX(-${currentIndex * (230 + 20)}px)`,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {extendedItems.map((product, idx) => (
            <div key={idx} className="hijab-slider-item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopHijab;