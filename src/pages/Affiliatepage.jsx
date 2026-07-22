// src/pages/AffiliatePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AffiliatePage.css';

const AffiliatePage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [handle, setHandle] = useState('');
  const [followers, setFollowers] = useState("Under 1,000");
  const [reason, setReason] = useState('');

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = `* NEW AFFILIATE APPLICATION - LAILA HIJABS*\n\n`;
    message += `*Full Name:* ${fullName || 'N/A'}\n`;
    message += `*WhatsApp:* ${phone || 'N/A'}\n`;
    message += `*Handle:* ${handle || 'N/A'}\n`;
    message += `*Followers:* ${followers}\n`;
    if (reason) message += `*Reason:* ${reason}\n\n`;
    message += `Please review my application. Thank you!`;

    const whatsappUrl = `https://wa.me/923238399480?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const stats = [
    { num: "10%", label: "Base Commission" },
    { num: "30 Days", label: "Cookie / Link Window" },
    { num: "Monthly", label: "Payout via Bank / JazzCash" }
  ];

  const steps = [
    { num: "01", title: "Apply & Get Approved", desc: "Fill out the form below with your Instagram, TikTok, or blog. We review and approve within 2â€“3 days." },
    { num: "02", title: "Share Your Link", desc: "Get a unique referral link and discount code to share on your stories, posts, or with friends directly." },
    { num: "03", title: "Earn on Every Order", desc: "Track your clicks and orders in real time, and receive your commission automatically each month." }
  ];

  const tiers = [
    { name: "Starter", title: "New Affiliate", rate: "10%", desc: "Every approved affiliate starts here â€” commission on all orders placed through your link.", featured: false },
    { name: "Growth", title: "10+ Orders / Month", rate: "15%", desc: "Unlocked automatically once you cross 10 successful referred orders in a month.", featured: true, badge: "Most Popular" },
    { name: "Studio Partner", title: "25+ Orders / Month", rate: "20%", desc: "Our top affiliates â€” with early access to new collections and personal styling support.", featured: false }
  ];

  const faqs = [
    { question: "Do I need a large following to join?", answer: "No â€” we welcome everyday customers who love the brand just as much as influencers. Your commission is based on results, not follower count." },
    { question: "How and when do I get paid?", answer: "Commissions are calculated monthly and paid via bank transfer or JazzCash, once your referred orders are confirmed and delivered." },
    { question: "Is there a minimum payout amount?", answer: "Yes, a small minimum threshold applies before payout is processed â€” full details are shared once you're approved." },
    { question: "Can I use my own discount code?", answer: "Yes, every approved affiliate receives a personal discount code their audience can use, which also tracks your referrals automatically." }
  ];

  return (
    <div className="aff-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Affiliate Program
        </div>

        {/* Hero Section */}
        <section className="aff-hero">
          <div className="aff-hero-grid">
            <div className="aff-hero-copy">
              <span className="eyebrow">Earn With Laila</span>
              <h1>Share the grace,<br/>earn on every <em>order.</em></h1>
              <p>Love Laila Hijabs? Turn your recommendation into income. Share your unique link with your audience or friends, and earn a commission on every order placed through it.</p>
              <a href="#aff-form" className="btn-primary">
                <svg viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 1 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/></svg>
                Apply to Join
              </a>
            </div>
            <div className="aff-hero-img">
              <div className="v1"><img src="/hero2.png" alt="Laila Hijab affiliate" /></div>
               {/* <div className="v2"><img src="/hero2.png" alt="Fabric detail" /></div> */} 
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <section style={{ paddingTop: 0 }}>
          <div className="stats-strip">
            {stats.map((stat, idx) => (
              <div className="stat-card" key={idx}>
                <div className="num">{stat.num}</div>
                <div className="lbl">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2>Three steps to your first payout</h2>
          </div>
          <div className="steps">
            {steps.map((step, idx) => (
              <div className="step-card" key={idx}>
                <div className="step-num">{step.num}</div>
                <h4>{step.title}</h4>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Commission Tiers */}
        <section style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">Commission Tiers</span>
            <h2>The more you share, the more you earn</h2>
          </div>
          <div className="tiers">
            {tiers.map((tier, idx) => (
              <div className={`tier-card ${tier.featured ? 'featured' : ''}`} key={idx}>
                {tier.badge && <div className="tier-badge">{tier.badge}</div>}
                <span className="eyebrow">{tier.name}</span>
                <h3>{tier.title}</h3>
                <div className="tier-rate">{tier.rate}</div>
                <p>{tier.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Application Form */}
      <section className="aff-form-band" id="aff-form">
        <div className="wrap aff-form-grid">
          <div className="aff-form-copy">
            <span className="eyebrow">Ready to Start?</span>
            <h2 style={{ marginTop: '12px' }}>Apply to the program</h2>
            <p>Tell us a little about yourself and where you'll be sharing Laila â€” we personally review every application.</p>
            <ul>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> No fee to join, ever</li>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> Open to students, influencers &amp; everyday customers</li>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> Approval within 2â€“3 business days</li>
            </ul>
          </div>

          <form className="aff-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your name" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required 
                />
              </div>
              <div className="form-field">
                <label>WhatsApp Number</label>
                <input 
                  type="tel" 
                  placeholder="03XX-XXXXXXX" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required 
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Instagram / TikTok Handle</label>
                <input 
                  type="text" 
                  placeholder="@yourhandle" 
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  required 
                />
              </div>
              <div className="form-field">
                <label>Follower Range *</label>
                <select 
                  value={followers}
                  onChange={(e) => setFollowers(e.target.value)}
                  required
                >
                  <option value="Under 1,000">Under 1,000</option>
                  <option value="1,000 – 5,000">1,000 – 5,000</option>
                  <option value="5,000 – 20,000">5,000 – 20,000</option>
                  <option value="20,000+">20,000+</option>
                  <option value="I'm a customer, not an influencer">I'm a customer, not an influencer</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Why do you want to join? *</label>
              <textarea 
                placeholder="Tell us a little about your audience or how you'd share Laila"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">Submit Application</button>
            <div className="form-note">We'll reach out on WhatsApp once your application is reviewed.</div>
          </form>
        </div>
      </section>

      {/* FAQ Section with interactive accordion */}
      <div className="wrap">
        <section>
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Affiliate program, clarified</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div className="faq-item" key={idx}>
                <h4 onClick={() => toggleFaq(idx)}>
                  {faq.question}
                  <span>{openFaq === idx ? 'âˆ’' : '+'}</span>
                </h4>
                {openFaq === idx && <p>{faq.answer}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Floating WhatsApp Action Button */}
    </div>
  );
};

export default AffiliatePage;