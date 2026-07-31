import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import { useContent } from '../context/useContent';
import './OffersPage.css';

const OffersPage = () => {
  const { getSectionContent } = useContent();

  const title = getSectionContent('offers_page_header', 'title', 'The Eid Edit Sale — up to 25% off');
  const subtitle = getSectionContent('offers_page_header', 'subtitle', '');
  const body = getSectionContent('offers_page_header', 'body_content', "Premium abayas and silk hijabs, marked down for a limited time. Once a piece sells out at our studio, it's gone.");
  const badgeText = getSectionContent('offers_page_header', 'badge_text', 'Limited Time · Ends Soon');
  const imageUrl = getSectionContent('offers_page_header', 'image_url', '/Categories/abaya/abaya1.png');

  // Dynamic Offers Data
  const waysTitle = getSectionContent('offers_bundles_page', 'ways_title', 'Every kind of grace, at a kinder price');
  const waysCardsRaw = getSectionContent('offers_bundles_page', 'ways_cards', []);
  const waysCards = waysCardsRaw.filter(wc => wc.status !== 'Draft');

  const sec1Title = getSectionContent('offers_bundles_page', 'title', 'Curated Modest Fashion Sets & Bundles');
  const bundlesRaw = getSectionContent('offers_bundles_page', 'bundles', []);
  const bundles = bundlesRaw.filter(b => b.status !== 'Draft');

  // Timer Hook replacing static HTML Script
  const [time, setTime] = useState({ d: 3, h: 14, m: 52, s: 9 });
  const sliderRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { d, h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; d--; }
        return { d, h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft <= 10) {
        sliderRef.current.scrollTo({ left: scrollWidth, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: -clientWidth, behavior: 'smooth' });
      }
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        sliderRef.current.scrollBy({ left: clientWidth, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="offers-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Offers &amp; Discounts
        </div>

        {/* Hero Section with Countdown */}
        <div className="offer-hero">
          <img src={imageUrl} alt="Sale Hero" />
          <div className="offer-hero-copy">
            <span className="eyebrow">{badgeText}</span>
            <h1>{title}</h1>
            {subtitle && <h2>{subtitle}</h2>}
            <p>{body}</p>
            <div className="countdown">
              <div><div className="num">{String(time.d).padStart(2, '0')}</div><div className="lbl">Days</div></div>
              <div><div className="num">{String(time.h).padStart(2, '0')}</div><div className="lbl">Hours</div></div>
              <div><div className="num">{String(time.m).padStart(2, '0')}</div><div className="lbl">Mins</div></div>
              <div><div className="num">{String(time.s).padStart(2, '0')}</div><div className="lbl">Secs</div></div>
            </div>
            <a href="#sale-items" className="btn-primary">Shop the Sale</a>
          </div>
        </div>

        {/* Offer Types Cards */}
        {waysCards.length > 0 && (
          <section style={{ paddingTop: 0 }}>
            <div className="section-head">
              <span className="eyebrow">Ways to Save</span>
              <h2>{waysTitle}</h2>
            </div>
            <div className="offer-grid">
              {waysCards.map((wc, idx) => (
                <Link key={idx} to={wc.slug ? `/Products/${wc.slug}` : '#'} className="offer-card-link" onClick={() => window.scrollTo(0, 0)}>
                  <div className="offer-card">
                    <div className="offer-card-img-wrapper">
                      <img src={wc.image_url || '/hero2.png'} alt={wc.title} className="offer-card-hero-img" />
                    </div>
                    <div className="offer-card-content">
                      <span className="offer-badge">{wc.badge}</span>
                      <h3>{wc.title}</h3>
                      <p>{wc.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Sale Products Horizontal Slider */}
        {bundles.length > 0 && (
          <section id="sale-items" style={{ paddingTop: 0 }}>
            <div className="section-head">
              <span className="eyebrow">On Sale Now</span>
              <h2>{sec1Title}</h2>
            </div>

            <div className="prod-slider-wrapper">
              <button className="img-slider-arrow left" onClick={scrollLeft} aria-label="Scroll left">
                <IoChevronBackOutline />
              </button>
              <button className="img-slider-arrow right" onClick={scrollRight} aria-label="Scroll right">
                <IoChevronForwardOutline />
              </button>

              <div className="prod-slider-container" ref={sliderRef}>
                <div className="prod-slider-track">
                  {bundles.map((b, idx) => (
                    <Link to={b.slug ? `/Products/${b.slug}` : '#'} className="prod-card-link" key={idx}>
                      <div className="prod-card">
                        <div className="prod-frame">
                          <span className="discount-tag">{b.savings}</span>
                          <img src={b.image_url || '/hero1.png'} alt={b.title} />
                        </div>
                        <div className="prod-info">
                          <div><h4 style={{ fontSize: '15px' }}>{b.title}</h4><span className="sizes">{b.items_included}</span></div>
                          <div className="price"><span className="was">{b.original_price}</span><span className="now">{b.bundle_price}</span></div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Referral Strip */}
        <section>
          <div className="refer-band">
            <span className="eyebrow">Never Miss a Drop</span>
            <h2>Get notified the moment a new offer goes live</h2>
            <p>Join our WhatsApp broadcast list or Instagram close friends for first access to every sale â€” before it's posted anywhere else.</p>
            <form className="refer-form" onSubmit={(e) => { e.preventDefault(); alert("Subscribed for offer notifications!"); }}>
              <input type="tel" placeholder="Your WhatsApp number *" required />
              <button type="submit">Notify Me</button>
            </form>
          </div>
        </section>
      </div>

      {/* Floating WhatsApp Action Button */}
    </div>
  );
};

export default OffersPage;