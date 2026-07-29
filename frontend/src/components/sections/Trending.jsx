import React, { useState, useEffect } from 'react';
import ProductCard from '../Products/ProductCard';
import { products } from '../../data/products';
import { useContent } from '../../context/useContent';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './Trending.css';

const DEFAULT_TRENDING = [
  { id: 1, name: 'EVERYDAY ABAYA', price: 4990, badge: 'BESTSELLER', img: '/Categories/abaya/abaya1.png', category: 'abaya' },
  { id: 2, name: 'CLASSIC BLACK ABAYA', price: 5490, badge: '', img: '/Categories/abaya/abaya2.png', category: 'abaya' },
  { id: 3, name: 'ELEGANT ABAYA', price: 6490, badge: '', img: '/Categories/abaya/abaya3.png', category: 'abaya' },
  { id: 4, name: 'LUXURY OCCASION ABAYA', price: 7490, badge: 'NEW IN', img: '/Categories/kaftan/kaftan1.png', category: 'kaftan' },
  { id: 5, name: 'PREMIUM CHIFFON HIJAB', price: 2400, badge: 'BEST SELLER', img: '/Categories/hijabs/hijab1.png', category: 'hijabs' },
  { id: 6, name: 'EVERYDAY JERSEY HIJAB', price: 2200, badge: '', img: '/Categories/hijabs/hijab2.png', category: 'hijabs' }
];

const Trending = () => {
  const { getSectionContent } = useContent();

  const isEnabled = getSectionContent('home_trending', 'is_enabled', 'true') !== 'false';
  const sectionTitle = getSectionContent('home_trending', 'title', 'TRENDING');

  const metaRaw = getSectionContent('home_trending', 'metadata', {});
  let meta = {};
  try { meta = typeof metaRaw === 'string' ? JSON.parse(metaRaw) : (metaRaw || {}); } catch(e) {}

  const rawCards = Array.isArray(meta.cards) ? meta.cards : DEFAULT_TRENDING;

  const activeCards = rawCards
    .filter(c => c.status === 'Active' || c.status === 'Live' || c.status === undefined)
    .map((c, idx) => {
      const fallbackProd = products[idx % products.length] || {};
      return {
        ...fallbackProd,
        id: c.key || c.id || idx + 1,
        name: c.name || fallbackProd.name || 'TRENDING PRODUCT',
        price: parseInt(c.price || fallbackProd.price || '4990', 10),
        badge: c.badge !== undefined ? c.badge : fallbackProd.badge,
        img: c.image_url || c.img || fallbackProd.img || '/Categories/abaya/abaya1.png'
      };
    });

  const displayProducts = [...activeCards, ...activeCards, ...activeCards];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalOriginal = activeCards.length;

  const speedMs = (parseInt(meta.slide_speed || '3', 10) || 3) * 1000;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const nextSlide = () => {
    if (totalOriginal <= 1) return;
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
    if (totalOriginal <= 1) return;
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
    if (isPaused || totalOriginal <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, speedMs);
    return () => clearInterval(interval);
  }, [isPaused, currentIndex, totalOriginal, speedMs]);

  if (!isEnabled || meta.is_enabled === 'false' || activeCards.length === 0) return null;

  return (
    <section 
      className="trending-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="trending-header">
        <h2>{sectionTitle || 'TRENDING'}</h2>
        {totalOriginal > 1 && (
          <div className="trending-controls">
            <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous trending items">
              <FaChevronLeft />
            </button>
            <button className="slider-arrow next" onClick={nextSlide} aria-label="Next trending items">
              <FaChevronRight />
            </button>
          </div>
        )}
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