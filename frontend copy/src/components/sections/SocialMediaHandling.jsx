import React, { useState, useEffect, useRef } from 'react';
import { 
  IoChevronBackOutline, 
  IoChevronForwardOutline
} from 'react-icons/io5';
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from 'react-icons/fa';
import './SocialMediaHandling.css';

const SocialMediaHandling = () => {
  const viewportRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Exactly the 7 real Instagram reel MP4 videos from /instagram folder
  const mediaItems = [
    { 
      id: 1, 
      videoUrl: "/instagram/SnapInsta-Ai_3891013814913564917_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/DX_qHL-D4D1/",
      title: "ELEGANT STYLE",
      subtitle: "Watch Video"
    },
    { 
      id: 2, 
      videoUrl: "/instagram/SnapInsta-Ai_3937470966992729306_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/DbDV-aFOx3H/",
      title: "LUXURY COLLECTION",
      subtitle: "Watch Video"
    },
    { 
      id: 3, 
      videoUrl: "/instagram/SnapInsta-Ai_3937470966992729306_80486484222 (1).mp4",
      instagramLink: "https://www.instagram.com/p/DbAcrMrO4gT/",
      title: "PREMIUM SELECTION",
      subtitle: "Watch Video"
    },
    { 
      id: 4, 
      videoUrl: "/instagram/SnapInsta-Ai_3940375736038315188_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/Da44B6cuYaj/",
      title: "EVERYDAY ESSENTIAL",
      subtitle: "Watch Video"
    },
    { 
      id: 5, 
      videoUrl: "/instagram/SnapInsta-Ai_3943147895845914275_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/DavBtrcIdS0/",
      title: "CLASSIC DRAPE",
      subtitle: "Watch Video"
    },
    { 
      id: 6, 
      videoUrl: "/instagram/SnapInsta-Ai_3945279387426588691_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/DanNm37IkfE/",
      title: "FLOWING SILHOUETTE",
      subtitle: "Watch Video"
    },
    { 
      id: 7, 
      videoUrl: "/instagram/SnapInsta-Ai_3946094346096025031_80486484222.mp4",
      instagramLink: "https://www.instagram.com/p/DaktPudA_Ta/",
      title: "MODEST ELEGANCE",
      subtitle: "Watch Video"
    }
  ];

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
              {mediaItems.concat(mediaItems).map((item, index) => (
                <div key={index} className="social-slider-item">
                  
                  {/* Real MP4 Video Frame */}
                  <div className="pure-media-card">
                    <a 
                      href={item.instagramLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
                      aria-label={`Watch ${item.title} on Instagram`}
                    >
                      <video 
                        src={item.videoUrl} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline
                        className="edge-to-edge-media" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </a>
                  </div>

                  {/* Text Below Frame */}
                  <div className="card-text-container">
                    <h3 className="card-title">{item.title}</h3>
                    <p className="card-subtitle">{item.subtitle}</p>
                  </div>

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