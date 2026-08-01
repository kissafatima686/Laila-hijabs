import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useContent } from '../context/useContent';
import './AboutUsPage.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const DEFAULT_FALLBACK_IMG = '/hero2.png';

const formatImgSrc = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return DEFAULT_FALLBACK_IMG;
  const cleanUrl = url.trim();
  if (cleanUrl.startsWith('/uploads/')) return `${API_BASE}${cleanUrl}`;
  if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) return cleanUrl;
  return cleanUrl;
};

const AboutUsPage = () => {
  const { getSectionContent } = useContent();

  const title = getSectionContent('about_who_we_are', 'title', 'Who We Are');
  const body = getSectionContent('about_who_we_are', 'body_content', 'Laila Hijabs is Pakistan\'s leading luxury modest fashion house. Founded in Lahore, we blend traditional craftsmanship with contemporary design to create pieces that celebrate both faith and fashion.');
  const imageUrl = getSectionContent('about_who_we_are', 'image_url', '/hero2.png');
  const imageUrl2 = getSectionContent('about_who_we_are', 'image_url_2', '/hero2.png');

  // Metadata
  const badgeText = getSectionContent('about_who_we_are', 'badge_text', 'A Legacy of Modest Luxury');
  const badgeTextActive = getSectionContent('about_who_we_are', 'badge_text_active', true);
  const titleActive = getSectionContent('about_who_we_are', 'title_active', true);
  const bodyContentActive = getSectionContent('about_who_we_are', 'body_content_active', true);
  const imageUrlActive = getSectionContent('about_who_we_are', 'image_url_active', true);
  const imageUrl2Active = getSectionContent('about_who_we_are', 'image_url_2_active', true);
  const sec1Active = getSectionContent('about_who_we_are', 'sec1_active', true);

  // Section 2
  const sec2Title = getSectionContent('about_who_we_are', 'sec2_title', 'Our Philosophy');
  const sec2TitleActive = getSectionContent('about_who_we_are', 'sec2_title_active', true);
  const quoteText = getSectionContent('about_who_we_are', 'quote_text', '"She doesn\'t compete loudly. She attracts quietly."');
  const quoteTextActive = getSectionContent('about_who_we_are', 'quote_text_active', true);
  const quoteAuthor = getSectionContent('about_who_we_are', 'quote_author', '— The Laila Hijab Studio');
  const quoteAuthorActive = getSectionContent('about_who_we_are', 'quote_author_active', true);
  const sec2Active = getSectionContent('about_who_we_are', 'sec2_active', true);

  // Section 3
  const sec3Title = getSectionContent('about_who_we_are', 'sec3_title', 'What We Stand For');
  const sec3TitleActive = getSectionContent('about_who_we_are', 'sec3_title_active', true);
  const sec3Subtitle = getSectionContent('about_who_we_are', 'sec3_subtitle', 'Grace, built on four values');
  const sec3SubtitleActive = getSectionContent('about_who_we_are', 'sec3_subtitle_active', true);
  const rawValues = getSectionContent('about_who_we_are', 'values', [
    { letter: 'E', title: 'Elegance', desc: 'Refined design over excess — every piece earns its place in the collection.', active: true },
    { letter: 'C', title: 'Comfort', desc: 'Fabrics chosen to move with you, not against you, across a full day.', active: true },
    { letter: 'I', title: 'Inclusivity', desc: 'Sizes XS through XXL, always — grace was never meant for one body type.', active: true },
    { letter: 'R', title: 'Respect', desc: 'For tradition, for modern taste, and for every woman\'s own idea of modesty.', active: true }
  ]);
  const sec3Active = getSectionContent('about_who_we_are', 'sec3_active', true);

  // Section 4
  const sec4Title = getSectionContent('about_who_we_are', 'sec4_title', 'Where We\'re Headed');
  const sec4TitleActive = getSectionContent('about_who_we_are', 'sec4_title_active', true);
  const sec4Subtitle = getSectionContent('about_who_we_are', 'sec4_subtitle', 'A brand built in phases, not overnight');
  const sec4SubtitleActive = getSectionContent('about_who_we_are', 'sec4_subtitle_active', true);
  const rawRoadmap = getSectionContent('about_who_we_are', 'roadmap', [
    { year: '2026', title: 'Laila Hijabs is born', desc: 'Launched from our studio in Lahore with the Everyday Grace Collection.', active: true },
    { year: 'Next', title: 'Premium & Abaya lines', desc: 'Expanding into silk premium hijabs and structured abayas sized XS–XXL.', active: true },
    { year: 'Later', title: 'Pakistan-wide, then the Gulf', desc: 'Growing city by city across Pakistan, before bringing Laila to the UAE.', active: true }
  ]);
  const sec4Active = getSectionContent('about_who_we_are', 'sec4_active', true);

  // Section 5
  const founderQuote = getSectionContent('about_who_we_are', 'founder_quote', '"Modesty and elegance were never meant to be a compromise. Laila is the brand I wanted to find and couldn\'t — so we made it."');
  const founderQuoteActive = getSectionContent('about_who_we_are', 'founder_quote_active', true);
  const founderTitle = getSectionContent('about_who_we_are', 'founder_title', 'Founder, Laila Hijabs');
  const founderTitleActive = getSectionContent('about_who_we_are', 'founder_title_active', true);
  const founderLogo = getSectionContent('about_who_we_are', 'founder_logo', '/hero2.png');
  const founderLogoActive = getSectionContent('about_who_we_are', 'founder_logo_active', true);
  const sec5Active = getSectionContent('about_who_we_are', 'sec5_active', true);

  // Filtered lists
  const activeValues = (Array.isArray(rawValues) ? rawValues : []).filter(v => v.active !== false && v.status !== 'Hidden');
  const activeRoadmap = (Array.isArray(rawRoadmap) ? rawRoadmap : []).filter(r => r.active !== false && r.status !== 'Hidden');

  // Dynamic Location Slider Cards
  const [dbLocations, setDbLocations] = useState([]);
  const sliderSecActive = getSectionContent('location_visit_us_section', 'slider_sec_active', true);

  useEffect(() => {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    fetch(`${API_BASE}/api/admin/module/locations`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Filter ONLY items that are Live or Active (excluding Hidden, Inactive, or Draft)
          setDbLocations(data.filter(l => l.status === 'Live' || l.status === 'Active'));
        }
      })
      .catch(() => {});
  }, []);

  const studioImages = dbLocations.map((loc, idx) => ({
    id: loc.location_id || loc.id || (idx + 1),
    src: formatImgSrc(loc.image_url || (idx % 2 === 0 ? '/hero1.png' : '/hero2.png')),
    alt: loc.name || loc.city || 'Laila Hijabs Studio'
  }));

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (studioImages.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % studioImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [studioImages.length]);

  const handlePrevSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex - 1 + studioImages.length) % studioImages.length);
  };

  const handleNextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % studioImages.length);
  };

  const navigate = useNavigate();

  const handleSlideClick = (index, imgId) => {
    if (index === currentSlideIndex) {
      navigate(`/location/${imgId}`);
    } else {
      setCurrentSlideIndex(index);
    }
  };

  const showV2 = imageUrl2Active !== false && imageUrl2 && imageUrl2.trim() !== '';

  // Visit Us Section Metadata
  const visitUsSecActive = getSectionContent('location_visit_us_section', 'sec_active', true);

  return (
    <div className="about-page-wrapper">
      <div className="wrap">
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> About Us
        </div>
      </div>

      {/* Section 1: Hero Section */}
      {sec1Active !== false && (
        <section className="about-hero" style={{ paddingBottom: 0 }}>
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              {badgeTextActive !== false && badgeText && <span className="eyebrow">{badgeText}</span>}
              {titleActive !== false && title && <h1>{title}</h1>}
              {bodyContentActive !== false && body && <p>{body}</p>}
            </div>
            
            <div className="about-hero-img">
              {imageUrlActive !== false && (
                <div className={`v1 ${!showV2 ? 'full-width' : ''}`}>
                  <img 
                    src={formatImgSrc(imageUrl)} 
                    alt="Laila Hijab studio" 
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMG; }}
                  />
                </div>
              )}
              {showV2 && (
                <div className="v2">
                  <img 
                    src={formatImgSrc(imageUrl2)} 
                    alt="Fabric detail" 
                    onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMG; }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Section 2: Philosophy Quote Band */}
      {sec2Active !== false && (
        <section className="story-band">
          <div className="wrap">
            {sec2TitleActive !== false && sec2Title && <span className="eyebrow" style={{ color: '#D9BD8E' }}>{sec2Title}</span>}
            {quoteTextActive !== false && quoteText && <blockquote style={{ marginTop: '18px' }}>{quoteText}</blockquote>}
            {quoteAuthorActive !== false && quoteAuthor && <div className="sign">{quoteAuthor}</div>}
          </div>
        </section>
      )}

      {/* Section 3: Brand Values Grid */}
      {sec3Active !== false && activeValues.length > 0 && (
        <section>
          <div className="wrap">
            {(sec3TitleActive !== false || sec3SubtitleActive !== false) && (
              <div className="section-head">
                {sec3TitleActive !== false && sec3Title && <span className="eyebrow">{sec3Title}</span>}
                {sec3SubtitleActive !== false && sec3Subtitle && <h2>{sec3Subtitle}</h2>}
              </div>
            )}
            <div className="values-grid">
              {activeValues.map((val, idx) => (
                <div className="value-card" key={idx}>
                  <div className="value-icon">{val.letter || val.icon || 'V'}</div>
                  <h4>{val.title}</h4>
                  <p>{val.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 4: Journey Timeline */}
      {sec4Active !== false && activeRoadmap.length > 0 && (
        <section style={{ background: '#EFE4CC' }}>
          <div className="wrap">
            {(sec4TitleActive !== false || sec4SubtitleActive !== false) && (
              <div className="section-head">
                {sec4TitleActive !== false && sec4Title && <span className="eyebrow">{sec4Title}</span>}
                {sec4SubtitleActive !== false && sec4Subtitle && <h2>{sec4Subtitle}</h2>}
              </div>
            )}
            <div className="timeline">
              {activeRoadmap.map((item, idx) => (
                <div className="t-item" key={idx}>
                  <span className="eyebrow">{item.year || item.period}</span>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Section 5: Founder Note */}
      {sec5Active !== false && (
        <section>
          <div className="wrap founder">
            {founderLogoActive !== false && founderLogo && (
              <div className="founder-photo">
                <img 
                  src={formatImgSrc(founderLogo)} 
                  alt="Founder" 
                  onError={(e) => { e.target.onerror = null; e.target.src = DEFAULT_FALLBACK_IMG; }}
                />
              </div>
            )}
            {founderQuoteActive !== false && founderQuote && <p>{founderQuote}</p>}
            {founderTitleActive !== false && founderTitle && <div className="name">{founderTitle}</div>}
          </div>
        </section>
      )}

      {/* Studio Visit & Contact Band */}
      {visitUsSecActive !== false && (
        <section className="shop-band">
          <div className="wrap shop-grid">
            {sliderSecActive !== false && studioImages.length > 0 && (
              <div className="shop-slider-container">
                <div className="popup-slider-wrapper">
                  <div className="popup-slider-track">
                    {studioImages.map((img, index) => {
                      let position = 'hidden';
                      const total = studioImages.length;
                      const diff = (index - currentSlideIndex + total) % total;

                      if (diff === 0) {
                        position = 'active';
                      } else if (diff === 1 || (currentSlideIndex === total - 1 && index === 0)) {
                        position = 'next';
                      } else if (diff === total - 1 || (currentSlideIndex === 0 && index === total - 1)) {
                        position = 'prev';
                      }

                      return (
                        <div 
                          key={img.id} 
                          className={`popup-slide ${position}`}
                          onClick={() => handleSlideClick(index, img.id)}
                        >
                          <img src={img.src} alt={img.alt} />
                          {position === 'active' && (
                            <div className="slide-badge-overlay">
                              View Location Details 
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="slider-controls">
                  <button 
                    type="button" 
                    className="slider-arrow prev-arrow" 
                    onClick={handlePrevSlide}
                    aria-label="Previous slide"
                  >
                    <IoChevronBackOutline size={18} />
                  </button>
                  <button 
                    type="button" 
                    className="slider-arrow next-arrow" 
                    onClick={handleNextSlide}
                    aria-label="Next slide"
                  >
                    <IoChevronForwardOutline size={18} />
                  </button>
                </div>
              </div>
            )}
            <div className="shop-copy">
              {getSectionContent('location_visit_us_section', 'badge_active', true) !== false && (
                <span className="eyebrow">{getSectionContent('location_visit_us_section', 'badge_text', 'VISIT US')}</span>
              )}
              {getSectionContent('location_visit_us_section', 'title_active', true) !== false && (
                <h2 style={{ marginTop: '12px' }}>{getSectionContent('location_visit_us_section', 'title', 'Prefer to see the fabric in person?')}</h2>
              )}
              {getSectionContent('location_visit_us_section', 'subtitle_active', true) !== false && (
                <p style={{ fontWeight: '600', color: '#3E4930', marginBottom: '8px' }}>
                  {getSectionContent('location_visit_us_section', 'subtitle', 'Our studio welcomes visits by appointment.')}
                </p>
              )}
              {getSectionContent('location_visit_us_section', 'body_active', true) !== false && (
                <p>{getSectionContent('location_visit_us_section', 'body_content', 'If you\'re not close by, our team is just as happy to guide you over WhatsApp or a call.')}</p>
              )}
              {getSectionContent('location_visit_us_section', 'button_active', true) !== false && (
                <div className="shop-actions" style={{ marginTop: '18px' }}>
                  <Link to="/visit-us" className="btn-ghost">
                    {getSectionContent('location_visit_us_section', 'button_text', 'View Location Details')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default AboutUsPage;