// src/pages/AboutUsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { IoLogoWhatsapp } from 'react-icons/io5';
import './AboutUsPage.css';

const AboutUsPage = () => {
  // Brand values mapped from your original structure
  const values = [
    { icon: "E", title: "Elegance", desc: "Refined design over excess â€” every piece earns its place in the collection." },
    { icon: "C", title: "Comfort", desc: "Fabrics chosen to move with you, not against you, across a full day." },
    { icon: "I", title: "Inclusivity", desc: "Sizes XS through XXL, always â€” grace was never meant for one body type." },
    { icon: "R", title: "Respect", desc: "For tradition, for modern taste, and for every woman's own idea of modesty." }
  ];

  // Journey milestones mapped from your original timeline
  const timelineMilestones = [
    { period: "2026", title: "Laila Hijabs is born", desc: "Launched from our studio in Lahore with the Everyday Grace Collection â€” chiffon and jersey hijabs designed for daily wear." },
    { period: "Next", title: "Premium & Abaya lines", desc: "Expanding into silk premium hijabs and structured abayas sized XSâ€“XXL, with a dedicated Eid edit each season." },
    { period: "Later", title: "Pakistan-wide, then the Gulf", desc: "Growing city by city across Pakistan, before bringing Laila to Pakistani and South Asian women across the UAE." }
  ];

  return (
    <div className="about-page-wrapper">
      <div className="wrap">
        {/* Clickable Breadcrumb[cite: 6] */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> About Us
        </div>
      </div>

      {/* Hero Section[cite: 6] */}
      <section className="about-hero" style={{ paddingBottom: 0 }}>
        <div className="about-hero-grid">
          <div className="about-hero-copy">
            <span className="eyebrow">Our Story</span>
            <h1>Composed beauty,<br/>from Lahore <em>outward.</em></h1>
            <p>Laila Hijabs began with one belief â€” that modesty and modern style were never opposites. We design for the woman who moves through her day with quiet confidence: to campus, to work, to Eid morning.</p>
          </div>
          <div className="about-hero-img">
            <div className="v1"><img src="/hero2.png" alt="Laila Hijab studio" /></div>
            <div className="v2"><img src="/hero2.png" alt="Fabric detail" /></div>
          </div>
        </div>
      </section>

      {/* Philosophy Quote Band[cite: 6] */}
      <section className="story-band">
        <div className="wrap">
          <span className="eyebrow" style={{ color: '#D9BD8E' }}>Our Philosophy</span>
          <blockquote style={{ marginTop: '18px' }}>"She doesn't compete loudly. She attracts quietly."</blockquote>
          <div className="sign">â€” The Laila Hijab Studio</div>
        </div>
      </section>

      {/* Brand Values Grid[cite: 6] */}
      <section>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">What We Stand For</span>
            <h2>Grace, built on four values</h2>
          </div>
          <div className="values-grid">
            {values.map((val, idx) => (
              <div className="value-card" key={idx}>
                <div className="value-icon">{val.icon}</div>
                <h4>{val.title}</h4>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline[cite: 6] */}
      <section style={{ background: '#EFE4CC' }}>
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Where We're Headed</span>
            <h2>A brand built in phases, not overnight</h2>
          </div>
          <div className="timeline">
            {timelineMilestones.map((item, idx) => (
              <div className="t-item" key={idx}>
                <span className="eyebrow">{item.period}</span>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note[cite: 6] */}
      <section>
        <div className="wrap founder">
          <div className="founder-photo"><img src="/hero2.png" alt="Founder" /></div>
          <p>"Modesty and elegance were never meant to be a compromise. Laila is the brand I wanted to find and couldn't â€” so we made it."</p>
          <div className="name">Founder, Laila Hijabs</div>
        </div>
      </section>

      {/* Studio Visit & Contact Band[cite: 6] */}
      <section className="shop-band">
        <div className="wrap shop-grid">
          <div className="shop-img"><img src="/hero2.png" alt="Laila Hijabs physical shop" /></div>
          <div className="shop-copy">
            <span className="eyebrow">Visit Us</span>
            <h2 style={{ marginTop: '12px' }}>Prefer to see the fabric in person?</h2>
            <p>Our studio welcomes visits by appointment. If you're not close by, our team is just as happy to guide you over WhatsApp or a call â€” sharing fabric details, sizing, and photos before you decide.</p>
            <div className="shop-info">
              <div><b>Location:</b> [Studio address â€” city, area]</div>
              <div><b>Hours:</b> [Monâ€“Sat, 11am â€“ 8pm]</div>
              <div><b>Reach us:</b> WhatsApp or call for full product details</div>
            </div>
            <div className="shop-actions">
              <a href="tel:+923238399480" className="btn-ghost">Call the Studio</a>
            </div>
          </div>
        </div>
      </section>

      {/* Floating WhatsApp Action Button */}
    </div>
  );
};

export default AboutUsPage;