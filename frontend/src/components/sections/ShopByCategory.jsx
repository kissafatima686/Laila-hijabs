import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import './ShopByCategory.css';

const collections = [
  {
    title: "Abayas",
    count: "5 DESIGNS",
    desc: "Structured yet soft silhouettes tailored generously for daily grace and formal Eid gatherings.",
    image: "/Categories/abaya/abaya1.png",
    path: "/categories/abayas"
  },
  {
    title: "Hijabs",
    count: "2 COLORS",
    desc: "Premium fabrics crafted with hand-rolled edges for everyday and formal elegance.",
    image: "/Categories/hijabs/hijab1.png",
    path: "/categories/hijabs"
  },
  {
    title: "Irani Chadar",
    count: "5 DESIGNS",
    desc: "Traditional flowing chadar providing full coverage with an elegant drape.",
    image: "/Categories/iranichadar/irani1.png",
    path: "/categories/irani-chadar"
  },
  {
    title: "Jilbab",
    count: "4 DESIGNS",
    desc: "Classic overhead and two-piece jilbabs designed for comfort and modesty.",
    image: "/Categories/jilbab/jilbab.png",
    path: "/categories/jilbab"
  },
  {
    title: "Namaz Chadar",
    count: "1 DESIGN",
    desc: "Breathable and comfortable prayer chadar for your daily devotions.",
    image: "/Categories/namazchadar/namazchaddar.png",
    path: "/categories/namaz-chadar"
  },
  {
    title: "Round Chadar",
    count: "1 DESIGN",
    desc: "Classic round chadar ensuring perfect coverage with premium nida fabric.",
    image: "/Categories/roundchadar/round1.png",
    path: "/categories/round-chadar"
  }
];

const ShopByCategory = () => {
  const displayCollections = [...collections, ...collections, ...collections];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [noTransition, setNoTransition] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const totalOriginal = collections.length;

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
      className="home-category-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="home-category-header">
        <h2>SHOP BY CATEGORY</h2>
        <div className="home-category-controls">
          <button className="slider-arrow prev" onClick={prevSlide} aria-label="Previous categories">
            <FaChevronLeft />
          </button>
          <button className="slider-arrow next" onClick={nextSlide} aria-label="Next categories">
            <FaChevronRight />
          </button>
        </div>
      </div>

      <div className="home-category-viewport">
        <div 
          className="home-category-track"
          style={{
            transform: isMobile ? `translateX(-${currentIndex * 100}%)` : `translateX(-${currentIndex * 320}px)`,
            transition: noTransition ? 'none' : 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {displayCollections.map((cat, index) => (
            <div className="home-category-card-item" key={index}>
              <Link to={cat.path} className="home-cat-card">
                <img src={cat.image} alt={cat.title} />
                <div className="home-cat-content">
                  <span className="cat-count">{cat.count}</span>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                  <div className="cat-explore-link">
                    EXPLORE COLLECTION &rarr;
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;