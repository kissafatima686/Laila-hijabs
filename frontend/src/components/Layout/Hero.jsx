import React from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../../context/useContent';
import './Hero.css';

const Hero = () => {
  const { getSectionContent } = useContent();

  const title = getSectionContent('home_hero', 'title', '');
  const subtitle = getSectionContent('home_hero', 'subtitle', '');
  const bgImage = getSectionContent('home_hero', 'image_url', '/hero2.png');
  const btnText = getSectionContent('home_hero', 'button_text', '');
  const btnLink = getSectionContent('home_hero', 'button_link', '/categories');

  return (
    <section 
      className="hero-banner" 
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="hero-content">
        {title && <h1 className="hero-title">{title}</h1>}
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {btnText && (
          <Link to={btnLink} className="hero-btn" style={{
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