import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/useContent';
import './Hero.css';

const Hero = () => {
  const { getSectionContent } = useContent();

  const cmsTitle = getSectionContent('home_hero', 'title', '');
  const cmsSubtitle = getSectionContent('home_hero', 'subtitle', '');
  const cmsImage = getSectionContent('home_hero', 'image_url', '/hero2.png');
  const cmsBtnText = getSectionContent('home_hero', 'button_text', '');
  const cmsBtnLink = getSectionContent('home_hero', 'button_link', '/categories');

  const [sliders, setSliders] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('http://localhost:5000/api/admin/module/sliders')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const active = data.filter(s => s.status === 'Live' || s.status === 'Active');
          setSliders(active);
        }
      })
      .catch(err => console.error("Error fetching hero sliders:", err));
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  const activeSlide = sliders.length > 0 ? sliders[currentIndex] : null;

  const title = activeSlide ? activeSlide.title : cmsTitle;
  const subtitle = activeSlide ? activeSlide.subtitle : cmsSubtitle;
  const bgImage = activeSlide ? activeSlide.image_url : cmsImage;
  const btnLink = activeSlide ? activeSlide.button_link : cmsBtnLink;
  const btnText = activeSlide ? (cmsBtnText || 'EXPLORE COLLECTION') : (cmsBtnText || 'EXPLORE COLLECTION');

  return (
    <section 
      className="hero-banner" 
      style={{ 
        backgroundImage: `url(${bgImage || '/hero2.png'})`,
        transition: 'background-image 0.6s ease-in-out'
      }}
    >
      <div className="hero-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {btnText && (
          <Link to={btnLink || '/categories'} className="hero-btn" style={{
            display: 'inline-block',
            marginTop: '20px',
            padding: '12px 32px',
            backgroundColor: 'transparent',
            color: '#fff',
            border: '1px solid #fff',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            textDecoration: 'none',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}>
            {btnText}
          </Link>
        )}
      </div>
    </section>
  );
};

export default Hero;