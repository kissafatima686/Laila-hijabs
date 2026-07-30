import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };

const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>;

const OffersManagerPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Hero Banner, Timer & CTA Button
    sec1_tag: 'LIMITED EID SALE',
    sec1_title: 'Exclusive Offers & Marked Down Edits',
    sec1_subtitle: 'Hand-picked luxury modest pieces at special studio prices.',
    sec1_timer_end: '2026-08-31T23:59',
    sec1_timer_label: 'SALE ENDS IN:',
    sec1_btn_text: 'Shop The Sale',
    sec1_btn_link: '#on-sale-now',
    sec1_bg_image: '/hero2.png',
    sec1_active: true,

    // Section 2: On Sale Now Products & Off Prices Overlay
    sec2_tag: 'ON SALE NOW',
    sec2_title: 'The Eid Edit — marked down',
    sale_products: [
      { id: 'sp1', name: 'Gold-Trim Eid Abaya', size: 'XS — XXL', price: 'Rs. 12,500', compare_at: 'Rs. 15,625', discount_badge: '20% OFF', image_url: '/hero1.png', status: 'Live' },
      { id: 'sp2', name: 'Ivory Silk Hijab', size: 'ONE SIZE', price: 'Rs. 3,600', compare_at: 'Rs. 4,800', discount_badge: '25% OFF', image_url: '/hero2.png', status: 'Live' },
      { id: 'sp3', name: 'Structured Day Abaya', size: 'XS — XXL', price: 'Rs. 10,200', compare_at: 'Rs. 12,000', discount_badge: '15% OFF', image_url: '/hero3.png', status: 'Live' }
    ],
    sec2_active: true,

    // Section 3: Never Miss a Drop (WhatsApp Broadcast Banner)
    sec3_tag: 'NEVER MISS A DROP',
    sec3_title: 'Get notified the moment a new offer goes live',
    sec3_subtitle: 'Join our WhatsApp broadcast list or Instagram close friends for first access to every sale — before it\'s posted anywhere else.',
    phone_label: 'Your WhatsApp number *',
    phone_placeholder: '03XX-XXXXXXX',
    notify_btn_text: 'NOTIFY ME',
    sec3_active: true,

    // Section 4: Active Discount Codes & Promos
    promos: [
      { id: 'p1', code: 'EID2026', discount: '20% OFF', description: '20% discount on orders above Rs. 5,000', status: 'Active' },
      { id: 'p2', code: 'FREEHIJAB', discount: 'Free Gift', description: 'Free chiffon hijab with any 2 abayas', status: 'Active' }
    ],
    sec4_active: true,

    // Section 5: Offer Terms & FAQs
    sec5_title: 'Offers & Promotions FAQs',
    faqs: [
      { q: 'Can discount codes be combined?', a: 'Only one promo code can be applied per order at checkout.' },
      { q: 'How long do marked-down prices last?', a: 'On Sale items are limited quantity and prices apply until stock runs out or the sale timer ends.' }
    ],
    sec5_active: true
  });

  useEffect(() => {
    fetch(`${API}/sections/offers_page_header`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            sec1_title: d.title || prev.sec1_title,
            sec1_subtitle: d.subtitle || prev.sec1_subtitle,
            sec1_bg_image: d.image_url || prev.sec1_bg_image,
            sec1_tag: meta.sec1_tag || prev.sec1_tag,
            sec1_timer_end: meta.sec1_timer_end || prev.sec1_timer_end,
            sec1_timer_label: meta.sec1_timer_label || prev.sec1_timer_label,
            sec1_btn_text: meta.sec1_btn_text || prev.sec1_btn_text,
            sec1_btn_link: meta.sec1_btn_link || prev.sec1_btn_link,
            sec1_active: meta.sec1_active !== false,
            sec2_tag: meta.sec2_tag || prev.sec2_tag,
            sec2_title: meta.sec2_title || prev.sec2_title,
            sale_products: meta.sale_products || prev.sale_products,
            sec2_active: meta.sec2_active !== false,
            sec3_tag: meta.sec3_tag || prev.sec3_tag,
            sec3_title: meta.sec3_title || prev.sec3_title,
            sec3_subtitle: meta.sec3_subtitle || prev.sec3_subtitle,
            phone_label: meta.phone_label || prev.phone_label,
            phone_placeholder: meta.phone_placeholder || prev.phone_placeholder,
            notify_btn_text: meta.notify_btn_text || prev.notify_btn_text,
            sec3_active: meta.sec3_active !== false,
            promos: meta.promos || prev.promos,
            sec4_active: meta.sec4_active !== false,
            sec5_title: meta.sec5_title || prev.sec5_title,
            faqs: meta.faqs || prev.faqs,
            sec5_active: meta.sec5_active !== false
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    fetch(`${API}/sections/offers_page_header`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.sec1_title,
        subtitle: form.sec1_subtitle,
        image_url: form.sec1_bg_image,
        metadata: {
          sec1_tag: form.sec1_tag,
          sec1_timer_end: form.sec1_timer_end,
          sec1_timer_label: form.sec1_timer_label,
          sec1_btn_text: form.sec1_btn_text,
          sec1_btn_link: form.sec1_btn_link,
          sec1_active: form.sec1_active,
          sec2_tag: form.sec2_tag,
          sec2_title: form.sec2_title,
          sale_products: form.sale_products,
          sec2_active: form.sec2_active,
          sec3_tag: form.sec3_tag,
          sec3_title: form.sec3_title,
          sec3_subtitle: form.sec3_subtitle,
          phone_label: form.phone_label,
          phone_placeholder: form.phone_placeholder,
          notify_btn_text: form.notify_btn_text,
          sec3_active: form.sec3_active,
          promos: form.promos,
          sec4_active: form.sec4_active,
          sec5_title: form.sec5_title,
          faqs: form.faqs,
          sec5_active: form.sec5_active
        }
      })
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .finally(() => setSaving(false));
  };

  const handleSaleProductChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.sale_products];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, sale_products: copy };
    });
  };

  const addSaleProduct = () => setForm(p => ({
    ...p,
    sale_products: [...p.sale_products, { id: `sp_${Date.now()}`, name: 'New Sale Item', size: 'XS — XXL', price: 'Rs. 8,500', compare_at: 'Rs. 10,000', discount_badge: '15% OFF', image_url: '/hero1.png', status: 'Live' }]
  }));

  const removeSaleProduct = (idx) => setForm(p => ({ ...p, sale_products: p.sale_products.filter((_, i) => i !== idx) }));

  const handlePromoChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.promos];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, promos: copy };
    });
  };

  const addPromo = () => setForm(p => ({ ...p, promos: [...p.promos, { id: `p_${Date.now()}`, code: 'PROMO15', discount: '15% OFF', description: '15% off discount code', status: 'Active' }] }));
  const removePromo = (idx) => setForm(p => ({ ...p, promos: p.promos.filter((_, i) => i !== idx) }));

  const handleFaqChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.faqs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, faqs: copy };
    });
  };

  const addFaq = () => setForm(p => ({ ...p, faqs: [...p.faqs, { q: '', a: '' }] }));
  const removeFaq = (idx) => setForm(p => ({ ...p, faqs: p.faqs.filter((_, i) => i !== idx) }));

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Offers & Promos Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>OFFERS & PROMOTIONS</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Offers & Promos Manager Page</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Control Hero Banner & Sale Timer, On Sale Now marked-down cards with Off Prices, WhatsApp Notification Bar, Discount Codes, and FAQs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save Offers & Promos'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: Banner, Info, Timer & Shop The Sale Button ──────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Page Header Banner, Countdown Timer & CTA</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec1_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec1_active ? '#F6F1E3' : '#EF4444', border: form.sec1_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec1_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Tagline / Badge</label>
                <input value={form.sec1_tag} onChange={e => setForm(p => ({ ...p, sec1_tag: e.target.value }))} style={iStyle} placeholder="LIMITED EID SALE" />
              </div>
              <div>
                <label style={lStyle}>Main Heading Title *</label>
                <input required value={form.sec1_title} onChange={e => setForm(p => ({ ...p, sec1_title: e.target.value }))} style={iStyle} placeholder="Exclusive Offers & Marked Down Edits" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Subtitle Description</label>
              <input value={form.sec1_subtitle} onChange={e => setForm(p => ({ ...p, sec1_subtitle: e.target.value }))} style={iStyle} placeholder="Hand-picked luxury modest pieces at special studio prices." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lStyle}>Timer Countdown End Date</label>
                <input type="datetime-local" value={form.sec1_timer_end} onChange={e => setForm(p => ({ ...p, sec1_timer_end: e.target.value }))} style={iStyle} />
              </div>
              <div>
                <label style={lStyle}>Timer Label</label>
                <input value={form.sec1_timer_label} onChange={e => setForm(p => ({ ...p, sec1_timer_label: e.target.value }))} style={iStyle} placeholder="SALE ENDS IN:" />
              </div>
              <div>
                <label style={lStyle}>CTA Button Text *</label>
                <input required value={form.sec1_btn_text} onChange={e => setForm(p => ({ ...p, sec1_btn_text: e.target.value }))} style={{ ...iStyle, fontWeight: '700', color: '#B8935B' }} placeholder="Shop The Sale" />
              </div>
              <div>
                <label style={lStyle}>CTA Button Link</label>
                <input value={form.sec1_btn_link} onChange={e => setForm(p => ({ ...p, sec1_btn_link: e.target.value }))} style={iStyle} placeholder="#on-sale-now" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: On Sale Now Images, Texts & OFF Prices (Matching Screenshot) */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 2 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>On Sale Now Cards & Off Prices Overlay (Matching Screenshot)</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addSaleProduct} style={btnG}>+ Add Sale Item</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec2_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec2_active ? '#F6F1E3' : '#EF4444', border: form.sec2_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec2_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Badge Tag</label>
                <input value={form.sec2_tag} onChange={e => setForm(p => ({ ...p, sec2_tag: e.target.value }))} style={iStyle} placeholder="ON SALE NOW" />
              </div>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec2_title} onChange={e => setForm(p => ({ ...p, sec2_title: e.target.value }))} style={iStyle} placeholder="The Eid Edit — marked down" />
              </div>
            </div>

            {/* Sale Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', marginTop: '8px' }}>
              {form.sale_products.map((sp, idx) => (
                <div key={sp.id || idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  
                  {/* Visual Card Image Preview with Off Price Overlay */}
                  <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#222C1A' }}>
                    <img src={sp.image_url} alt={sp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    
                    {/* Red OFF Price Badge Overlay matching screenshot */}
                    <div style={{ position: 'absolute', top: '10px', left: '10px', backgroundColor: 'rgba(180,50,50,0.9)', color: '#FFF', fontSize: '11px', fontWeight: '800', padding: '4px 8px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.2)' }}>
                      {sp.discount_badge || '20% OFF'}
                    </div>
                  </div>

                  <div>
                    <label style={lStyle}>Product Name & Size</label>
                    <input value={sp.name} onChange={e => handleSaleProductChange(idx, 'name', e.target.value)} style={{ ...iStyle, fontWeight: '700', marginBottom: '6px' }} placeholder="Gold-Trim Eid Abaya" />
                    <input value={sp.size} onChange={e => handleSaleProductChange(idx, 'size', e.target.value)} style={iStyle} placeholder="XS — XXL or ONE SIZE" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={lStyle}>Discounted Price</label>
                      <input value={sp.price} onChange={e => handleSaleProductChange(idx, 'price', e.target.value)} style={{ ...iStyle, color: '#B8935B', fontWeight: '800' }} placeholder="Rs. 12,500" />
                    </div>
                    <div>
                      <label style={lStyle}>Original Price</label>
                      <input value={sp.compare_at} onChange={e => handleSaleProductChange(idx, 'compare_at', e.target.value)} style={iStyle} placeholder="Rs. 15,625" />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={lStyle}>OFF Badge Text</label>
                      <input value={sp.discount_badge} onChange={e => handleSaleProductChange(idx, 'discount_badge', e.target.value)} style={{ ...iStyle, color: '#EF4444', fontWeight: '700' }} placeholder="20% OFF" />
                    </div>
                    <div>
                      <label style={lStyle}>Image URL</label>
                      <input value={sp.image_url} onChange={e => handleSaleProductChange(idx, 'image_url', e.target.value)} style={iStyle} placeholder="/hero1.png" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '4px' }}>
                    <button type="button" onClick={() => removeSaleProduct(idx)} style={btnD}>Delete Card</button>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Never Miss a Drop (WhatsApp Broadcast Banner) ────────── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 3 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Never Miss a Drop — WhatsApp Notification Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec3_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec3_active ? '#F6F1E3' : '#EF4444', border: form.sec3_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec3_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Badge Tag</label>
                <input value={form.sec3_tag} onChange={e => setForm(p => ({ ...p, sec3_tag: e.target.value }))} style={iStyle} placeholder="NEVER MISS A DROP" />
              </div>
              <div>
                <label style={lStyle}>Banner Heading *</label>
                <input required value={form.sec3_title} onChange={e => setForm(p => ({ ...p, sec3_title: e.target.value }))} style={iStyle} placeholder="Get notified the moment a new offer goes live" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Banner Subtitle Description *</label>
              <textarea rows={2} required value={form.sec3_subtitle} onChange={e => setForm(p => ({ ...p, sec3_subtitle: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Join our WhatsApp broadcast list or Instagram close friends..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>WhatsApp Field Label *</label>
                <input required value={form.phone_label} onChange={e => setForm(p => ({ ...p, phone_label: e.target.value }))} style={iStyle} placeholder="Your WhatsApp number *" />
              </div>
              <div>
                <label style={lStyle}>Field Placeholder</label>
                <input value={form.phone_placeholder} onChange={e => setForm(p => ({ ...p, phone_placeholder: e.target.value }))} style={iStyle} placeholder="03XX-XXXXXXX" />
              </div>
              <div>
                <label style={lStyle}>Button Text *</label>
                <input required value={form.notify_btn_text} onChange={e => setForm(p => ({ ...p, notify_btn_text: e.target.value }))} style={{ ...iStyle, fontWeight: '700', color: '#B8935B' }} placeholder="NOTIFY ME" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Active Discount Codes & Promos ──────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec4_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Active Discount Codes & Promos</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addPromo} style={btnG}>+ Add Discount Code</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec4_active: !p.sec4_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec4_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec4_active ? '#F6F1E3' : '#EF4444', border: form.sec4_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec4_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {form.promos.map((p, idx) => (
              <div key={p.id || idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 100px', gap: '12px', alignItems: 'center' }}>
                <input value={p.code} onChange={e => handlePromoChange(idx, 'code', e.target.value)} style={{ ...iStyle, color: '#B8935B', fontWeight: '800' }} placeholder="PROMO CODE" />
                <input value={p.discount} onChange={e => handlePromoChange(idx, 'discount', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Discount (e.g. 20% OFF)" />
                <input value={p.description} onChange={e => handlePromoChange(idx, 'description', e.target.value)} style={iStyle} placeholder="Description..." />
                <button type="button" onClick={() => removePromo(idx)} style={btnD}>Delete</button>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION 5: Offer FAQs ──────────────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 5 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Offers & Promotions FAQs Section</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addFaq} style={btnG}>+ Add FAQ Item</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec5_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec5_active ? '#F6F1E3' : '#EF4444', border: form.sec5_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec5_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lStyle}>FAQ Section Title</label>
              <input value={form.sec5_title} onChange={e => setForm(p => ({ ...p, sec5_title: e.target.value }))} style={iStyle} placeholder="Offers & Promotions FAQs" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.faqs.map((faq, idx) => (
                <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700' }}>FAQ ITEM #{idx + 1}</span>
                    <button type="button" onClick={() => removeFaq(idx)} style={btnD}>Delete FAQ</button>
                  </div>
                  <div>
                    <label style={lStyle}>Question</label>
                    <input value={faq.q} onChange={e => handleFaqChange(idx, 'q', e.target.value)} style={iStyle} placeholder="FAQ Question" />
                  </div>
                  <div>
                    <label style={lStyle}>Answer</label>
                    <textarea rows={2} value={faq.a} onChange={e => handleFaqChange(idx, 'a', e.target.value)} style={{ ...iStyle, resize: 'vertical' }} placeholder="FAQ Answer..." />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
            {saving ? 'Saving...' : 'Save All Offers & Promos Sections'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default OffersManagerPage;
