// src/pages/OffersPage.jsx
import React, { useState, useEffect } from 'react';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './OffersPage.css';

const OffersPage = () => {
  // Timer Hook replacing static HTML Script
  const [time, setTime] = useState({ d: 3, h: 14, m: 52, s: 9 });

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

  const products = [
    { id: 1041, name: "Gold-Trim Eid Abaya", sizes: "XS â€“ XXL", was: "7,490", now: "5,990", discount: "20% Off", image: "/Categories/abaya/abaya5.png" },
    { id: 1039, name: "Ivory Silk Hijab", sizes: "One Size", was: "2,890", now: "2,170", discount: "25% Off", image: "/Categories/hijabs/hijab1.png" },
    { id: 1040, name: "Structured Day Abaya", sizes: "XS â€“ XXL", was: "6,990", now: "5,940", discount: "15% Off", image: "/Categories/abaya/abaya4.png" },
    { id: 1035, name: "Olive Chiffon Hijab", sizes: "One Size", was: "1,790", now: "1,430", discount: "20% Off", image: "/Categories/hijabs/hijab2.png" }
  ];

  return (
    <div className="offers-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb Navigation */}
        <div className="crumb">
          <a href="#">Home</a><span>/</span> Offers &amp; Discounts
        </div>

        {/* Hero Section with Countdown */}
        <div className="offer-hero">
          <img src="/Categories/abaya/abaya1.png" alt="Eid sale" />
          <div className="offer-hero-copy">
            <span className="eyebrow">Limited Time Â· Ends Soon</span>
            <h1>The Eid Edit Sale â€” up to 25% off</h1>
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
            <div className="offer-card">
              <span className="offer-badge">First Order</span>
              <h3>10% Off Your First Message</h3>
              <p>New to Laila? Message us on WhatsApp and mention this code for 10% off your first order, no minimum spend.</p>
              <div className="offer-code"><b>LAILA10</b><span>Copy Code</span></div>
            </div>
            <div className="offer-card">
              <span className="offer-badge">Bundle</span>
              <h3>Buy 2 Hijabs, Save 15%</h3>
              <p>Mix and match any two Everyday or Premium hijabs and the discount is applied automatically at checkout.</p>
              <div className="offer-code"><b>BUNDLE15</b><span>Copy Code</span></div>
            </div>
            <div className="offer-card">
              <span className="offer-badge">Refer a Friend</span>
              <h3>Give Rs. 500, Get Rs. 500</h3>
              <p>Share your referral link â€” your friend gets Rs. 500 off their first order, and you get Rs. 500 credit too.</p>
              <div className="offer-code"><b>Share via WhatsApp</b><span>Get Link</span></div>
            </div>
          </div>
        </section>

        {/* Sale Products Grid */}
        <section id="sale-items" style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">On Sale Now</span>
            <h2>The Eid Edit â€” marked down</h2>
          </div>
          <div className="prod-grid">
            {products.map((item, index) => (
              <div className="prod-card" key={index}>
                <div className="prod-frame">
                  <span className="discount-tag">{item.discount}</span>
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="prod-info">
                  <div><h4>{item.name}</h4><span className="sizes">{item.sizes}</span></div>
                  <div className="price"><span className="was">Rs. {item.was}</span><span className="now">Rs. {item.now}</span></div>
                </div>
              </div>
            ))}
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