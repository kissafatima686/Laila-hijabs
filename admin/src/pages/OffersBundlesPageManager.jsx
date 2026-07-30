import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const OffersBundlesPageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    sec1_tag: 'EXCLUSIVE BUNDLES',
    sec1_title: 'Curated Modest Fashion Sets & Bundles',
    sec1_subtitle: 'Save up to 30% when you buy full matching hijab and abaya sets.',
    
    // Ways To Save Section (Matching User Screenshot)
    ways_tag: 'WAYS TO SAVE',
    ways_title: 'Every kind of grace, at a kinder price',
    ways_cards: [
      {
        badge: 'FIRST ORDER',
        title: '10% Off Your First Purchase',
        description: 'New to Laila? Enjoy 10% off your first purchase from our Everyday Grace & Premium Collections.',
        image_url: '/hero1.png'
      },
      {
        badge: 'BUNDLE',
        title: 'Buy 2 Hijabs, Save 15%',
        description: 'Mix and match any two Everyday or Premium hijabs and the discount is applied automatically.',
        image_url: '/hero2.png'
      },
      {
        badge: 'SPECIAL EDIT',
        title: 'Exclusive Eid Collection Offer',
        description: 'Explore luxury abayas and silk hijabs marked down for a limited time during our Eid edit event.',
        image_url: '/hero3.png'
      }
    ],

    // Product Catalogue Redirection Shortcut
    catalogue_title: 'Explore Full Collection',
    catalogue_subtitle: 'Browse all products in our catalog to build your own custom bundle set.',
    catalogue_btn_text: 'Take Me To The Product Catalogue',
    catalogue_btn_link: '/products',

    bundles: [
      { id: 'b1', title: 'Everyday Grace 3-Hijab Bundle', original_price: 'Rs. 7,500', bundle_price: 'Rs. 5,500', savings: 'SAVE 26%', image_url: '/hero1.png', items_included: '3x Jersey Hijabs (Black, Nude, Taupe)', status: 'Live' },
      { id: 'b2', title: 'Silk & Abaya Luxury Eid Bundle', original_price: 'Rs. 18,000', bundle_price: 'Rs. 13,500', savings: 'SAVE 25%', image_url: '/hero2.png', items_included: '1x Gold-Trim Abaya + 1x Mulberry Silk Hijab', status: 'Live' }
    ]
  });

  useEffect(() => {
    fetch(`${API}/sections/offers_bundles_page`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            sec1_title: d.title || prev.sec1_title,
            sec1_subtitle: d.subtitle || prev.sec1_subtitle,
            sec1_tag: meta.sec1_tag || prev.sec1_tag,
            bundles: meta.bundles || prev.bundles
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    fetch(`${API}/sections/offers_bundles_page`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.sec1_title,
        subtitle: form.sec1_subtitle,
        metadata: {
          sec1_tag: form.sec1_tag,
          bundles: form.bundles
        }
      })
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .finally(() => setSaving(false));
  };

  const handleBundleChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.bundles];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, bundles: copy };
    });
  };

  const addBundle = () => setForm(p => ({
    ...p,
    bundles: [...p.bundles, { id: `b_${Date.now()}`, title: 'New Curated Bundle Set', original_price: 'Rs. 10,000', bundle_price: 'Rs. 7,900', savings: 'SAVE 21%', image_url: '/hero1.png', items_included: 'Full Matching Set', status: 'Live' }]
  }));

  const removeBundle = (idx) => setForm(p => ({ ...p, bundles: p.bundles.filter((_, i) => i !== idx) }));

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Offers Bundles Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>OFFERS & BUNDLES</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Offers Bundles Page Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage curated bundle packages, special bundle prices, savings badges, and items included.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved Bundles!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save Bundles Page'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* ── ALL OFFERS BUNDLES SECTIONS IN ONE CARD ──────────────────────── */}
        <div style={cardStyle}>
          
          {/* Header Sub-Section */}
          <div style={{ marginBottom: '22px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '16px' }}>
            <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>BUNDLES PAGE HEADER</span>
            <h3 style={{ margin: '4px 0 14px 0', fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>Header Title & Subtitle</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div>
                  <label style={lStyle}>Tagline Badge</label>
                  <input value={form.sec1_tag} onChange={e => setForm(p => ({ ...p, sec1_tag: e.target.value }))} style={iStyle} placeholder="EXCLUSIVE BUNDLES" />
                </div>
                <div>
                  <label style={lStyle}>Page Header Title *</label>
                  <input required value={form.sec1_title} onChange={e => setForm(p => ({ ...p, sec1_title: e.target.value }))} style={iStyle} placeholder="Curated Modest Fashion Sets & Bundles" />
                </div>
              </div>

              <div>
                <label style={lStyle}>Subtitle Description</label>
                <input value={form.sec1_subtitle} onChange={e => setForm(p => ({ ...p, sec1_subtitle: e.target.value }))} style={iStyle} placeholder="Save up to 30% when you buy full matching sets..." />
              </div>
            </div>
          </div>

          {/* Curated Bundles List */}
          <div style={{ marginBottom: '26px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>CURATED BUNDLE PACKAGES ({form.bundles.length})</span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Bundle Cards (Clicking opens product detail page)</h3>
              </div>
              <button type="button" onClick={addBundle} style={btnG}>+ Add Bundle Package</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {form.bundles.map((b, idx) => (
                <div key={b.id || idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700' }}>BUNDLE PACKAGE #{idx + 1}</span>
                    <button type="button" onClick={() => removeBundle(idx)} style={btnD}>Delete</button>
                  </div>

                  <div>
                    <label style={lStyle}>Bundle Name</label>
                    <input value={b.title} onChange={e => handleBundleChange(idx, 'title', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Everyday Grace 3-Hijab Bundle" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={lStyle}>Bundle Price</label>
                      <input value={b.bundle_price} onChange={e => handleBundleChange(idx, 'bundle_price', e.target.value)} style={{ ...iStyle, color: '#B8935B', fontWeight: '800' }} placeholder="Rs. 5,500" />
                    </div>
                    <div>
                      <label style={lStyle}>Original Price</label>
                      <input value={b.original_price} onChange={e => handleBundleChange(idx, 'original_price', e.target.value)} style={iStyle} placeholder="Rs. 7,500" />
                    </div>
                    <div>
                      <label style={lStyle}>Savings Badge</label>
                      <input value={b.savings} onChange={e => handleBundleChange(idx, 'savings', e.target.value)} style={{ ...iStyle, color: '#22c55e', fontWeight: '700' }} placeholder="SAVE 26%" />
                    </div>
                  </div>

                  <div>
                    <label style={lStyle}>Items Included</label>
                    <input value={b.items_included} onChange={e => handleBundleChange(idx, 'items_included', e.target.value)} style={iStyle} placeholder="3x Jersey Hijabs (Black, Nude, Taupe)" />
                  </div>

                  <div>
                    <label style={lStyle}>Cover Image URL</label>
                    <input value={b.image_url} onChange={e => handleBundleChange(idx, 'image_url', e.target.value)} style={iStyle} placeholder="/hero1.png" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ways To Save Sub-Section */}
          <div>
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>WAYS TO SAVE</span>
              <h3 style={{ margin: '2px 0 0 0', fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Every kind of grace, at a kinder price</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                <div>
                  <label style={lStyle}>Tagline Badge</label>
                  <input value={form.ways_tag} onChange={e => setForm(p => ({ ...p, ways_tag: e.target.value }))} style={iStyle} placeholder="WAYS TO SAVE" />
                </div>
                <div>
                  <label style={lStyle}>Section Title *</label>
                  <input required value={form.ways_title} onChange={e => setForm(p => ({ ...p, ways_title: e.target.value }))} style={iStyle} placeholder="Every kind of grace, at a kinder price" />
                </div>
              </div>

              {/* 3 Ways Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                {form.ways_cards.map((wc, idx) => (
                  <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800' }}>CARD #{idx + 1}</div>
                    <div>
                      <label style={lStyle}>Badge Tag</label>
                      <input value={wc.badge} onChange={e => {
                        const copy = [...form.ways_cards];
                        copy[idx].badge = e.target.value;
                        setForm(p => ({ ...p, ways_cards: copy }));
                      }} style={{ ...iStyle, fontWeight: '800', color: '#B8935B' }} placeholder="FIRST ORDER / BUNDLE" />
                    </div>
                    <div>
                      <label style={lStyle}>Title</label>
                      <input value={wc.title} onChange={e => {
                        const copy = [...form.ways_cards];
                        copy[idx].title = e.target.value;
                        setForm(p => ({ ...p, ways_cards: copy }));
                      }} style={{ ...iStyle, fontWeight: '700' }} placeholder="Card Title" />
                    </div>
                    <div>
                      <label style={lStyle}>Description</label>
                      <textarea rows={3} value={wc.description} onChange={e => {
                        const copy = [...form.ways_cards];
                        copy[idx].description = e.target.value;
                        setForm(p => ({ ...p, ways_cards: copy }));
                      }} style={{ ...iStyle, resize: 'vertical' }} placeholder="Card Description..." />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
            {saving ? 'Saving...' : 'Save All Bundle Packages'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default OffersBundlesPageManager;
