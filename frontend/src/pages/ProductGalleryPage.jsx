import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import './ProductGalleryPage.css';

// Product Gallery Page Component
const ProductGalleryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { thumbnails = [], initialIndex = 0 } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!thumbnails || thumbnails.length === 0) {
      navigate(-1);
    }
  }, [thumbnails, navigate]);

  if (!thumbnails || thumbnails.length === 0) return null;

  const nextImage = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev + 1) % thumbnails.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setIsZoomed(false);
    setCurrentIndex((prev) => (prev - 1 + thumbnails.length) % thumbnails.length);
  };

  const closeGallery = () => {
    navigate(-1);
  };

  const toggleZoom = (e) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  return createPortal(
    <div className="product-gallery-page">
      <button className="gallery-close-btn" onClick={closeGallery}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
      <button className="gallery-nav-btn prev" onClick={prevImage}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div className="gallery-image-container" onClick={() => setIsZoomed(false)}>
        <img 
          key={currentIndex} 
          src={thumbnails[currentIndex]} 
          alt={`Product detail ${currentIndex + 1}`} 
          className={`gallery-img ${isZoomed ? 'zoomed' : ''}`}
          onClick={toggleZoom}
        />
      </div>
      <button className="gallery-nav-btn next" onClick={nextImage}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>,
    document.body
  );
};

export default ProductGalleryPage;
