// src/pages/CustomOrdersPage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CustomOrdersPage.css';

const CustomOrdersPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [garmentType, setGarmentType] = useState('Abaya');
  const [size, setSize] = useState('M');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let message = `* NEW CUSTOM ORDER REQUEST - LAILA HIJABS*\n\n`;
    message += `*Customer:* ${name || 'N/A'}\n`;
    message += `*WhatsApp:* ${phone || 'N/A'}\n`;
    message += `*Garment Type:* ${garmentType}\n`;
    message += `*Size:* ${size}\n`;
    if (description) message += `*Description:* ${description}\n\n`;
    if (file) message += `*Reference Image:* ${file.name} (Ready to send)\n\n`;
    message += `Please let me know how to proceed. Thank you!`;

    const whatsappUrl = `https://wa.me/923238399480?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const steps = [
    { num: "01", title: "Share Your Vision", desc: "Fill the form below with your idea, preferred fabric, color, and size â€” attach a reference photo if you have one." },
    { num: "02", title: "We Confirm on WhatsApp", desc: "Our team reaches out within a few hours to discuss details, fabric availability, and final pricing." },
    { num: "03", title: "Crafted at Our Studio", desc: "Your piece is cut and stitched by hand, with a progress photo shared before it's finalized." },
    { num: "04", title: "Delivered to You", desc: "Nationwide delivery with cash on delivery available, or pick up in person at our studio." }
  ];

  const galleryImages = [
    { src: "/Categories/abaya/abaya4.png", alt: "Custom abaya example" },
    { src: "/Categories/hijabs/hijab2.png", alt: "Custom hijab set example" },
    { src: "/Categories/abaya/abaya5.png", alt: "Custom Eid abaya example" },
    { src: "/Categories/iranichadar/irani3.png", alt: "Custom embroidered abaya example" }
  ];

  const faqs = [
    { question: "How much does a custom order cost?", answer: "Pricing depends on fabric and design complexity â€” our team shares an exact quote on WhatsApp before any work begins, with no obligation to proceed." },
    { question: "How long does it take?", answer: "Most custom pieces are ready in 7â€“12 days. Eid and wedding season requests should be placed at least 3 weeks in advance." },
    { question: "Can I visit the studio in person?", answer: "Yes â€” appointments are welcome if you'd like to choose fabric in person. If you're not nearby, we can share fabric swatches and photos over WhatsApp instead." },
    { question: "Do you offer alterations on existing pieces?", answer: "Yes, minor alterations to fit are available on select pieces â€” mention this when you submit your request." }
  ];

  return (
    <div className="cd-page-wrapper">
      <div className="wrap">
        {/* Breadcrumb */}
        <div className="crumb">
          <Link to="/">Home</Link><span>/</span> Custom Design Orders
        </div>

        {/* Hero Section */}
        <section className="cd-hero">
          <div className="cd-hero-grid">
            <div className="cd-hero-copy">
              <span className="eyebrow">Made Just For You</span>
              <h1>Your idea,<br/>stitched into <em>grace.</em></h1>
              <p>Have a fabric, color, or design in mind that you haven't seen in our collection? Tell us about it â€” our studio can bring custom hijabs and abayas to life, tailored to your size and vision.</p>
              <a href="#cd-form" className="btn-primary">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                Start Your Custom Order
              </a>
            </div>
            <div className="cd-hero-img">
              <div className="v1"><img src="/Categories/jilbab/jilbab.png" alt="Custom design studio" /></div>
              <div className="v2"><img src="/Categories/abaya/abaya3.png" alt="Fabric swatches" /></div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">How It Works</span>
            <h2>From idea to doorstep, in four steps</h2>
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

        {/* Past custom work gallery */}
        <section style={{ paddingTop: 0 }}>
          <div className="section-head">
            <span className="eyebrow">From Our Studio</span>
            <h2>Custom pieces we've brought to life</h2>
          </div>
          <div className="cd-gallery">
            {galleryImages.map((img, idx) => (
              <div className="g-item" key={idx}>
                <img src={img.src} alt={img.alt} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Form Section */}
      <section className="cd-form-band" id="cd-form">
        <div className="wrap cd-form-grid">
          <div className="cd-form-copy">
            <span className="eyebrow">Tell Us What You Need</span>
            <h2 style={{ marginTop: '12px' }}>Submit your custom request</h2>
            <p>The more detail you share, the closer we get to your vision on the first try. Once submitted, you can also continue the conversation directly on WhatsApp.</p>
            <ul>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> No design fee for the first consultation</li>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> Available in sizes XS â€“ XXL</li>
              <li><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg> Typical turnaround: 7â€“12 days</li>
            </ul>
          </div>

          <form className="cd-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Your name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                <label>Garment Type *</label>
                <select 
                  value={garmentType}
                  onChange={(e) => setGarmentType(e.target.value)}
                  required
                >
                  <option value="Abaya">Abaya</option>
                  <option value="Hijab">Hijab</option>
                  <option value="Hijab & Niqab Set">Hijab &amp; Niqab Set</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-field">
                <label>Size *</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  required
                >
                  <option value="XS">XS</option><option value="S">S</option><option value="M">M</option><option value="L">L</option><option value="XL">XL</option><option value="XXL">XXL</option>
                </select>
              </div>
            </div>
            <div className="form-field">
              <label>Describe Your Design *</label>
              <textarea 
                placeholder="Fabric, color, occasion, inspiration — tell us everything"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-field">
              <label>Reference Image (optional)</label>
              <label className="upload-box" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input 
                  type="file" 
                  accept=".pdf, .png, .jpg, .jpeg, .webp"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <svg viewBox="0 0 24 24"><path d="M12 16V4M12 4 7 9M12 4l5 5"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
                <div style={{ textAlign: 'center' }}>
                  {file ? file.name : "Click to upload or drag a photo here"}
                </div>
              </label>
            </div>
            <button type="submit" className="submit-btn">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.07-1.32A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
              Submit &amp; Continue on WhatsApp
            </button>
            <div className="form-note">We'll never share your details. Response within a few hours.</div>
          </form>
        </div>
      </section>

      {/* FAQ Section with interactive accordion */}
      <div className="wrap">
        <section>
          <div className="section-head">
            <span className="eyebrow">Questions</span>
            <h2>Custom orders, clarified</h2>
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
    </div>
  );
};

export default CustomOrdersPage;