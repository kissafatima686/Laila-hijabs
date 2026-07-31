import React, { useState, useEffect, useRef } from 'react';
import { 
  IoChevronBackOutline, 
  IoChevronForwardOutline
} from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './SocialMediaHandling.css';
import { useContent } from '../../context/useContent';

const SocialMediaHandling = () => {
  const viewportRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const { getSectionContent } = useContent();

  const isEnabled = getSectionContent('home_social_media', 'is_enabled', 'true') !== 'false';
  const rawCards = getSectionContent('home_social_media', 'cards', []);
  const activeMediaItems = Array.isArray(rawCards) ? rawCards.filter(c => c.status === 'Active' || c.status === 'Live') : [];
  
  
  const scrollRight = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = viewportRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 15) {
        viewportRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: 280, behavior: 'smooth' });
      }
    }
  };

  const scrollLeft = () => {
    if (viewportRef.current) {
      const { scrollLeft, scrollWidth } = viewportRef.current;
      if (scrollLeft <= 10) {
        viewportRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        viewportRef.current.scrollBy({ left: -280, behavior: 'smooth' });
      }
    }
  };

  // Self moving slider effect
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      scrollRight();
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  if (!isEnabled || activeMediaItems.length === 0) return null;

  return (
    <section 
      className="social-handling-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="slider-wrapper">
        <div className="social-handling-header">
          <div className="social-handling-title-group">
            <h2>SOCIAL MEDIA HANDLES</h2>
            <div className="social-icons">
              <a href="https://www.facebook.com/thelailahijab/?rdid=bXKFISlW0hph3zh4" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><FaFacebookF /></a>
              <a href="https://www.instagram.com/the_lailahijabs/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://www.tiktok.com/@the_lailahijabs?is_from_webapp=1&sender_device=pc" target="_blank" rel="noopener noreferrer" aria-label="TikTok"><FaTiktok /></a>
              <a href="https://wa.me/923238399480" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Channel"><FaWhatsapp /></a>
            </div>
          </div>
          <div className="slider-arrows-top">
            <button className="slider-arrow-top" onClick={scrollLeft} aria-label="Scroll left">
              <IoChevronBackOutline />
            </button>
            <button className="slider-arrow-top" onClick={scrollRight} aria-label="Scroll right">
              <IoChevronForwardOutline />
            </button>
          </div>
        </div>
        

        <div className="slider-container">
          <div className="social-handling-viewport" ref={viewportRef}>
            <div className="social-handling-track">
              {activeMediaItems.concat(activeMediaItems).map((item, index) => (
                <div key={`${item.key || item.id}-${index}`} className="social-slider-item">
                  
                  <a 
                    href={item.instagramLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                    aria-label={`Watch ${item.title} on Instagram`}
                  >
                    {/* Real MP4 Video Frame */}
                    <div className="pure-media-card">
                      <video 
                        src={item.videoUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="edge-to-edge-media" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>

                    {/* Text Below Frame */}
                    <div className="card-text-container">
                      <h3 className="card-title">{item.title}</h3>
                      <p className="card-subtitle">{item.subtitle}</p>
                    </div>
                  </a>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialMediaHandling;