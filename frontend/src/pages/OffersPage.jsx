// src/pages/OffersPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';
import './OffersPage.css';

const OffersPage = () => {
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

  // Automatic move to next image every 1 second (1000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const products = [
    { id: 5, slug: "luxury-occasion-abaya-5", name: "Gold-Trim Eid Abaya", sizes: "XS – XXL", was: "7,490", now: "5,990", discount: "20% Off", image: "/Categories/abaya/abaya5.png" },
    { id: 6, slug: "premium-chiffon-hijab-1", name: "Ivory Silk Hijab", sizes: "One Size", was: "2,890", now: "2,170", discount: "25% Off", image: "/Categories/hijabs/hijab1.png" },
    { id: 4, slug: "elegant-abaya-4", name: "Structured Day Abaya", sizes: "XS – XXL", was: "6,990", now: "5,940", discount: "15% Off", image: "/Categories/abaya/abaya4.png" },
    { id: 7, slug: "everyday-jersey-hijab-2", name: "Olive Chiffon Hijab", sizes: "One Size", was: "1,790", now: "1,430", discount: "20% Off", image: "/Categories/hijabs/hijab2.png" }
  ];

  return (
    <div className="offers-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Offers &amp; Discounts
        </div>

        {/* Hero Section with Countdown */}
        <div className="offer-hero">
          <img src="/Categories/abaya/abaya1.png" alt="Eid sale" />
          <div className="offer-hero-copy">
            <span className="eyebrow">Limited Time · Ends Soon</span>
            <h1>The Eid Edit Sale — up to 25% off</h1>
            <p>Premium abayas and silk hijabs, marked down for a limited time. Once a piece sells out at our studio, it's gone.</p>
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
        <section style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">Ways to Save</span>
            <h2>Every kind of grace, at a kinder price</h2>
          </div>
          <div className="offer-grid">
            <Link to="/Products/gold-trim-eid-abaya" className="offer-card-link" onClick={() => window.scrollTo(0, 0)}>
              <div className="offer-card">
                <div className="offer-card-img-wrapper">
                  <img src="/hero2.png" alt="First Order Offer" className="offer-card-hero-img" />
                </div>
                <div className="offer-card-content">
                  <span className="offer-badge">First Order</span>
                  <h3>10% Off Your First Purchase</h3>
                  <p>New to Laila? Enjoy 10% off your first purchase from our Everyday Grace & Premium Collections.</p>
                </div>
              </div>
            </Link>

            <Link to="/Products/premium-chiffon-hijab-1" className="offer-card-link" onClick={() => window.scrollTo(0, 0)}>
              <div className="offer-card">
                <div className="offer-card-img-wrapper">
                  <img src="/hero2.png" alt="Bundle Offer" className="offer-card-hero-img" />
                </div>
                <div className="offer-card-content">
                  <span className="offer-badge">Bundle</span>
                  <h3>Buy 2 Hijabs, Save 15%</h3>
                  <p>Mix and match any two Everyday or Premium hijabs and the discount is applied automatically.</p>
                </div>
              </div>
            </Link>

            <Link to="/Products/structured-day-abaya" className="offer-card-link" onClick={() => window.scrollTo(0, 0)}>
              <div className="offer-card">
                <div className="offer-card-img-wrapper">
                  <img src="/hero2.png" alt="Special Edit Offer" className="offer-card-hero-img" />
                </div>
                <div className="offer-card-content">
                  <span className="offer-badge">Special Edit</span>
                  <h3>Exclusive Eid Collection Offer</h3>
                  <p>Explore luxury abayas and silk hijabs marked down for a limited time during our Eid edit event.</p>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Sale Products Horizontal Slider */}
        <section id="sale-items" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">On Sale Now</span>
            <h2>The Eid Edit — marked down</h2>
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
                {products.map((item, index) => (
                  <Link to={`/Products/${item.slug}`} className="prod-card-link" key={index}>
                    <div className="prod-card">
                      <div className="prod-frame">
                        <span className="discount-tag">{item.discount}</span>
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="prod-info">
                        <div><h4>{item.name}</h4><span className="sizes">{item.sizes}</span></div>
                        <div className="price"><span className="was">Rs. {item.was}</span><span className="now">Rs. {item.now}</span></div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

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