import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '22px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' };
const btnP = { padding: '9px 20px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', fontWeight: '600', cursor: 'pointer' };
const btnD = { padding: '6px 10px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '11.5px', fontWeight: '600', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' };

const TrashIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
  </svg>
);

const FieldBox = ({ label, children, active = true, onToggle, onClear }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', opacity: active !== false ? 1 : 0.6, transition: 'opacity 0.2s' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <label style={lStyle}>{label}</label>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span style={{
          fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700',
          color: active !== false ? '#15803D' : '#6B7280',
          backgroundColor: active !== false ? 'rgba(34,197,94,0.15)' : '#E7D9C9',
          border: `1px solid ${active !== false ? 'rgba(34,197,94,0.3)' : '#B8935B'}`
        }}>
          {active !== false ? 'Live' : 'Hidden'}
        </span>

        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            style={{
              padding: '3px 8px',
              borderRadius: '4px',
              backgroundColor: active !== false ? '#FEE2E2' : '#E0E7FF',
              border: active !== false ? '1px solid #FCA5A5' : '1px solid #A5B4FC',
              color: active !== false ? '#DC2626' : '#3730A3',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {active !== false ? 'Hide' : 'Show'}
          </button>
        )}
        {onClear && (
          <button
            type="button"
            onClick={onClear}
            style={{ ...btnD, padding: '3px 6px' }}
            title="Delete Content"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </div>
    <div>
      {children}
    </div>
  </div>
);

const ImageUploaderBox = ({ label, value, onChange, active = true, onToggle, onClear }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/upload`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64 })
      })
        .then(r => r.json())
        .then(data => {
          if (data.imageUrl) {
            onChange(data.imageUrl);
          }
        })
        .catch(err => console.error("Upload failed", err))
        .finally(() => setUploading(false));
    };
    reader.readAsDataURL(file);
  };

  return (
    <FieldBox label={label} active={active} onToggle={onToggle} onClear={onClear}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            style={{ ...iStyle, flex: 1 }}
            placeholder="/hero1.png or image URL"
          />
          <label style={{
            padding: '8px 14px',
            borderRadius: '6px',
            backgroundColor: '#3E4930',
            color: '#F6F1E3',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            {uploading ? 'Uploading...' : '📁 Upload Image'}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              disabled={uploading}
            />
          </label>
        </div>

        {value && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #E7D9C9' }}>
            <img
              src={value.startsWith('http') ? value : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${value.startsWith('/') ? '' : '/'}${value}`}
              alt="Preview"
              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #E7D9C9' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {value}
            </span>
          </div>
        )}
      </div>
    </FieldBox>
  );
};

const AboutWhoWeAreManagerPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Legacy & Who We Are
    badge_text: 'A Legacy of Modest Luxury',
    badge_text_active: true,
    title: 'Who We Are',
    title_active: true,
    body_content: 'Laila Hijabs is Pakistan\'s leading luxury modest fashion house. Founded in Lahore, we blend traditional craftsmanship with contemporary design to create pieces that celebrate both faith and fashion.',
    body_content_active: true,
    image_url: '/hero1.png',
    image_url_active: true,
    image_url_2: '/hero2.png',
    image_url_2_active: true,
    sec1_active: true,

    // Section 2: Philosophy Quote
    sec2_title: 'Our Philosophy',
    sec2_title_active: true,
    quote_text: '"She doesn\'t compete loudly. She attracts quietly."',
    quote_text_active: true,
    quote_author: '— The Laila Hijab Studio',
    quote_author_active: true,
    sec2_active: true,

    // Section 3: Values / What We Stand For
    sec3_title: 'What We Stand For',
    sec3_title_active: true,
    sec3_subtitle: 'Grace, built on four values',
    sec3_subtitle_active: true,
    values: [
      { letter: 'E', title: 'Elegance', desc: 'Refined design over excess — every piece earns its place in the collection.', active: true },
      { letter: 'C', title: 'Comfort', desc: 'Fabrics chosen to move with you, not against you, across a full day.', active: true },
      { letter: 'I', title: 'Inclusivity', desc: 'Sizes XS through XXL, always — grace was never meant for one body type.', active: true },
      { letter: 'R', title: 'Respect', desc: 'For tradition, for modern taste, and for every woman\'s own idea of modesty.', active: true }
    ],
    sec3_active: true,

    // Section 4: Roadmap / Where We're Headed
    sec4_title: 'Where We\'re Headed',
    sec4_title_active: true,
    sec4_subtitle: 'A brand built in phases, not overnight',
    sec4_subtitle_active: true,
    roadmap: [
      { year: '2026', title: 'Laila Hijabs is born', desc: 'Launched from our studio in Lahore with the Everyday Grace Collection.', active: true },
      { year: 'Next', title: 'Premium & Abaya lines', desc: 'Expanding into silk premium hijabs and structured abayas sized XS–XXL.', active: true },
      { year: 'Later', title: 'Pakistan-wide, then the Gulf', desc: 'Growing city by city across Pakistan, before bringing Laila to the UAE.', active: true }
    ],
    sec4_active: true,

    // Section 5: Founder Quote & Signature
    founder_quote: '"Modesty and elegance were never meant to be a compromise. Laila is the brand I wanted to find and couldn\'t — so we made it."',
    founder_quote_active: true,
    founder_title: 'Founder, Laila Hijabs',
    founder_title_active: true,
    founder_logo: '/founder-logo.png',
    founder_logo_active: true,
    sec5_active: true
  });

  useEffect(() => {
    fetch(`${API}/sections/about_who_we_are`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            title: d.title || prev.title,
            subtitle: d.subtitle || prev.subtitle,
            body_content: d.body_content || prev.body_content,
            image_url: d.image_url || prev.image_url,
            image_url_2: d.image_url_2 || prev.image_url_2,
            badge_text: meta.badge_text || prev.badge_text,
            badge_text_active: meta.badge_text_active !== false,
            title_active: meta.title_active !== false,
            body_content_active: meta.body_content_active !== false,
            image_url_active: meta.image_url_active !== false,
            image_url_2_active: meta.image_url_2_active !== false,
            sec1_active: meta.sec1_active !== false,

            sec2_title: meta.sec2_title || prev.sec2_title,
            sec2_title_active: meta.sec2_title_active !== false,
            quote_text: meta.quote_text || prev.quote_text,
            quote_text_active: meta.quote_text_active !== false,
            quote_author: meta.quote_author || prev.quote_author,
            quote_author_active: meta.quote_author_active !== false,
            sec2_active: meta.sec2_active !== false,

            sec3_title: meta.sec3_title || prev.sec3_title,
            sec3_title_active: meta.sec3_title_active !== false,
            sec3_subtitle: meta.sec3_subtitle || prev.sec3_subtitle,
            sec3_subtitle_active: meta.sec3_subtitle_active !== false,
            values: meta.values || prev.values,
            sec3_active: meta.sec3_active !== false,

            sec4_title: meta.sec4_title || prev.sec4_title,
            sec4_title_active: meta.sec4_title_active !== false,
            sec4_subtitle: meta.sec4_subtitle || prev.sec4_subtitle,
            sec4_subtitle_active: meta.sec4_subtitle_active !== false,
            roadmap: meta.roadmap || prev.roadmap,
            sec4_active: meta.sec4_active !== false,

            founder_quote: meta.founder_quote || prev.founder_quote,
            founder_quote_active: meta.founder_quote_active !== false,
            founder_title: meta.founder_title || prev.founder_title,
            founder_title_active: meta.founder_title_active !== false,
            founder_logo: meta.founder_logo || prev.founder_logo,
            founder_logo_active: meta.founder_logo_active !== false,
            sec5_active: meta.sec5_active !== false
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setSaving(true);

    fetch(`${API}/sections/about_who_we_are`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title,
        subtitle: form.sec3_subtitle,
        body_content: form.body_content,
        image_url: form.image_url,
        image_url_2: form.image_url_2,
        metadata: {
          badge_text: form.badge_text,
          badge_text_active: form.badge_text_active,
          title_active: form.title_active,
          body_content_active: form.body_content_active,
          image_url_active: form.image_url_active,
          image_url_2_active: form.image_url_2_active,
          sec1_active: form.sec1_active,

          sec2_title: form.sec2_title,
          sec2_title_active: form.sec2_title_active,
          quote_text: form.quote_text,
          quote_text_active: form.quote_text_active,
          quote_author: form.quote_author,
          quote_author_active: form.quote_author_active,
          sec2_active: form.sec2_active,

          sec3_title: form.sec3_title,
          sec3_title_active: form.sec3_title_active,
          sec3_subtitle: form.sec3_subtitle,
          sec3_subtitle_active: form.sec3_subtitle_active,
          values: form.values,
          sec3_active: form.sec3_active,

          sec4_title: form.sec4_title,
          sec4_title_active: form.sec4_title_active,
          sec4_subtitle: form.sec4_subtitle,
          sec4_subtitle_active: form.sec4_subtitle_active,
          roadmap: form.roadmap,
          sec4_active: form.sec4_active,

          founder_quote: form.founder_quote,
          founder_quote_active: form.founder_quote_active,
          founder_title: form.founder_title,
          founder_title_active: form.founder_title_active,
          founder_logo: form.founder_logo,
          founder_logo_active: form.founder_logo_active,
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

  const handleValueChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.values];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, values: copy };
    });
  };

  const handleAddValue = () => {
    setForm(p => ({
      ...p,
      values: [...p.values, { letter: 'V', title: 'New Value', desc: 'Description of the new brand value.', active: true }]
    }));
  };

  const handleDeleteValue = (idx) => {
    setForm(p => ({
      ...p,
      values: p.values.filter((_, i) => i !== idx)
    }));
  };

  const handleToggleValueActive = (idx) => {
    setForm(p => {
      const copy = [...p.values];
      copy[idx] = { ...copy[idx], active: copy[idx].active === false ? true : false };
      return { ...p, values: copy };
    });
  };

  const handleRoadmapChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.roadmap];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, roadmap: copy };
    });
  };

  const handleAddRoadmap = () => {
    setForm(p => ({
      ...p,
      roadmap: [...p.roadmap, { year: '2027', title: 'New Phase', desc: 'Phase details...', active: true }]
    }));
  };

  const handleDeleteRoadmap = (idx) => {
    setForm(p => ({
      ...p,
      roadmap: p.roadmap.filter((_, i) => i !== idx)
    }));
  };

  const handleToggleRoadmapActive = (idx) => {
    setForm(p => {
      const copy = [...p.roadmap];
      copy[idx] = { ...copy[idx], active: copy[idx].active === false ? true : false };
      return { ...p, roadmap: copy };
    });
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading Brand Overview & Story...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '20px 24px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px' }}>ABOUT OUR BRAND</div>
          <h2 style={{ margin: '2px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#3E4930' }}>Brand Overview & Story Manager</h2>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save All Brand Sections'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: A Legacy of Modest Luxury — Who We Are ───────────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: form.sec1_active ? 1 : 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>A Legacy of Modest Luxury & Who We Are</h3>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: form.sec1_active ? '#FEE2E2' : '#E0E7FF', color: form.sec1_active ? '#DC2626' : '#3730A3', border: form.sec1_active ? '1px solid #FCA5A5' : '1px solid #A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec1_active ? 'Hide Section' : 'Show Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FieldBox label="Section Badge / Tagline" active={form.badge_text_active} onToggle={() => setForm(p => ({ ...p, badge_text_active: p.badge_text_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, badge_text: '' }))}>
                <input value={form.badge_text} onChange={e => setForm(p => ({ ...p, badge_text: e.target.value }))} style={iStyle} placeholder="A Legacy of Modest Luxury" />
              </FieldBox>
              <FieldBox label="Main Heading *" active={form.title_active} onToggle={() => setForm(p => ({ ...p, title_active: p.title_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, title: '' }))}>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="Who We Are" />
              </FieldBox>
            </div>

            <FieldBox label="Brand Description Story *" active={form.body_content_active} onToggle={() => setForm(p => ({ ...p, body_content_active: p.body_content_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, body_content: '' }))}>
              <textarea rows={4} required value={form.body_content} onChange={e => setForm(p => ({ ...p, body_content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Laila Hijabs is Pakistan's leading luxury modest fashion house..." />
            </FieldBox>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <ImageUploaderBox label="Primary Story Photo" value={form.image_url} onChange={val => setForm(p => ({ ...p, image_url: val }))} active={form.image_url_active} onToggle={() => setForm(p => ({ ...p, image_url_active: p.image_url_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, image_url: '' }))} />
              <ImageUploaderBox label="Secondary Craftsmanship Photo" value={form.image_url_2} onChange={val => setForm(p => ({ ...p, image_url_2: val }))} active={form.image_url_2_active} onToggle={() => setForm(p => ({ ...p, image_url_2_active: p.image_url_2_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, image_url_2: '' }))} />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Our Philosophy Quote ──────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: form.sec2_active ? 1 : 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 2 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>Our Philosophy Quote Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: form.sec2_active ? '#FEE2E2' : '#E0E7FF', color: form.sec2_active ? '#DC2626' : '#3730A3', border: form.sec2_active ? '1px solid #FCA5A5' : '1px solid #A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec2_active ? 'Hide Section' : 'Show Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldBox label="Section Title" active={form.sec2_title_active} onToggle={() => setForm(p => ({ ...p, sec2_title_active: p.sec2_title_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, sec2_title: '' }))}>
              <input value={form.sec2_title} onChange={e => setForm(p => ({ ...p, sec2_title: e.target.value }))} style={iStyle} placeholder="Our Philosophy" />
            </FieldBox>
            <FieldBox label="Philosophy Quote *" active={form.quote_text_active} onToggle={() => setForm(p => ({ ...p, quote_text_active: p.quote_text_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, quote_text: '' }))}>
              <textarea rows={2} value={form.quote_text} onChange={e => setForm(p => ({ ...p, quote_text: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="She does not compete loudly. She attracts quietly." />
            </FieldBox>
            <FieldBox label="Quote Attribution Author" active={form.quote_author_active} onToggle={() => setForm(p => ({ ...p, quote_author_active: p.quote_author_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, quote_author: '' }))}>
              <input value={form.quote_author} onChange={e => setForm(p => ({ ...p, quote_author: e.target.value }))} style={iStyle} placeholder="— The Laila Hijab Studio" />
            </FieldBox>
          </div>
        </div>

        {/* ── SECTION 3: What We Stand For — 4 Values ────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: form.sec3_active ? 1 : 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 3 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>What We Stand For — Core Values</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" onClick={handleAddValue} style={btnG}>+ Add Value</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: form.sec3_active ? '#FEE2E2' : '#E0E7FF', color: form.sec3_active ? '#DC2626' : '#3730A3', border: form.sec3_active ? '1px solid #FCA5A5' : '1px solid #A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec3_active ? 'Hide Section' : 'Show Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FieldBox label="Section Title" active={form.sec3_title_active} onToggle={() => setForm(p => ({ ...p, sec3_title_active: p.sec3_title_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, sec3_title: '' }))}>
                <input value={form.sec3_title} onChange={e => setForm(p => ({ ...p, sec3_title: e.target.value }))} style={iStyle} placeholder="What We Stand For" />
              </FieldBox>
              <FieldBox label="Subtitle Tagline" active={form.sec3_subtitle_active} onToggle={() => setForm(p => ({ ...p, sec3_subtitle_active: p.sec3_subtitle_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, sec3_subtitle: '' }))}>
                <input value={form.sec3_subtitle} onChange={e => setForm(p => ({ ...p, sec3_subtitle: e.target.value }))} style={iStyle} placeholder="Grace, built on four values" />
              </FieldBox>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {form.values.map((v, idx) => {
                const isActive = v.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#F6F1E3', borderRadius: '8px', padding: '16px', border: '1px solid #E7D9C9', opacity: isActive ? 1 : 0.65 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <input value={v.letter} onChange={e => handleValueChange(idx, 'letter', e.target.value)} style={{ ...iStyle, width: '45px', textAlign: 'center', fontWeight: '800', color: '#B8935B', backgroundColor: '#FFFFFF' }} maxLength={2} />
                      <input value={v.title} onChange={e => handleValueChange(idx, 'title', e.target.value)} style={{ ...iStyle, flex: 1, fontWeight: '700', backgroundColor: '#FFFFFF' }} placeholder="Value Title" />
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: isActive ? '#15803D' : '#6B7280', backgroundColor: isActive ? 'rgba(34,197,94,0.15)' : '#E7D9C9' }}>{isActive ? 'Live' : 'Hidden'}</span>
                        <button type="button" onClick={() => handleToggleValueActive(idx)} style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: isActive ? '#FEE2E2' : '#E0E7FF', color: isActive ? '#DC2626' : '#3730A3', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                          {isActive ? 'Hide' : 'Show'}
                        </button>
                        <button type="button" onClick={() => handleDeleteValue(idx)} style={{ ...btnD, padding: '4px 8px' }} title="Delete"><TrashIcon /></button>
                      </div>
                    </div>
                    <textarea rows={2} value={v.desc} onChange={e => handleValueChange(idx, 'desc', e.target.value)} style={{ ...iStyle, resize: 'vertical', backgroundColor: '#FFFFFF' }} placeholder="Value description..." />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Where We're Headed — Roadmap ───────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec4_active ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: form.sec4_active ? 1 : 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>Where We're Headed — Brand Roadmap</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" onClick={handleAddRoadmap} style={btnG}>+ Add Phase</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec4_active: !p.sec4_active }))} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: form.sec4_active ? '#FEE2E2' : '#E0E7FF', color: form.sec4_active ? '#DC2626' : '#3730A3', border: form.sec4_active ? '1px solid #FCA5A5' : '1px solid #A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec4_active ? 'Hide Section' : 'Show Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FieldBox label="Section Title" active={form.sec4_title_active} onToggle={() => setForm(p => ({ ...p, sec4_title_active: p.sec4_title_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, sec4_title: '' }))}>
                <input value={form.sec4_title} onChange={e => setForm(p => ({ ...p, sec4_title: e.target.value }))} style={iStyle} placeholder="Where We're Headed" />
              </FieldBox>
              <FieldBox label="Subtitle Tagline" active={form.sec4_subtitle_active} onToggle={() => setForm(p => ({ ...p, sec4_subtitle_active: p.sec4_subtitle_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, sec4_subtitle: '' }))}>
                <input value={form.sec4_subtitle} onChange={e => setForm(p => ({ ...p, sec4_subtitle: e.target.value }))} style={iStyle} placeholder="A brand built in phases, not overnight" />
              </FieldBox>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.roadmap.map((step, idx) => {
                const isActive = step.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#F6F1E3', borderRadius: '8px', padding: '16px', border: '1px solid #E7D9C9', opacity: isActive ? 1 : 0.65, display: 'grid', gridTemplateColumns: '120px 1fr 2fr auto', gap: '12px', alignItems: 'center' }}>
                    <input value={step.year} onChange={e => handleRoadmapChange(idx, 'year', e.target.value)} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', backgroundColor: '#FFFFFF' }} placeholder="Phase / Year" />
                    <input value={step.title} onChange={e => handleRoadmapChange(idx, 'title', e.target.value)} style={{ ...iStyle, fontWeight: '700', backgroundColor: '#FFFFFF' }} placeholder="Phase Title" />
                    <input value={step.desc} onChange={e => handleRoadmapChange(idx, 'desc', e.target.value)} style={{ ...iStyle, backgroundColor: '#FFFFFF' }} placeholder="Phase Details" />
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700', color: isActive ? '#15803D' : '#6B7280', backgroundColor: isActive ? 'rgba(34,197,94,0.15)' : '#E7D9C9' }}>{isActive ? 'Live' : 'Hidden'}</span>
                      <button type="button" onClick={() => handleToggleRoadmapActive(idx)} style={{ padding: '3px 8px', borderRadius: '4px', backgroundColor: isActive ? '#FEE2E2' : '#E0E7FF', color: isActive ? '#DC2626' : '#3730A3', border: 'none', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                        {isActive ? 'Hide' : 'Show'}
                      </button>
                      <button type="button" onClick={() => handleDeleteRoadmap(idx)} style={{ ...btnD, padding: '4px 8px' }} title="Delete"><TrashIcon /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Founder Quote & Logo ─────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid #E7D9C9' : '1px solid #FCA5A5', opacity: form.sec5_active ? 1 : 0.65 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 5 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: '#3E4930' }}>Founder Statement & Logo</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: form.sec5_active ? '#FEE2E2' : '#E0E7FF', color: form.sec5_active ? '#DC2626' : '#3730A3', border: form.sec5_active ? '1px solid #FCA5A5' : '1px solid #A5B4FC', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec5_active ? 'Hide Section' : 'Show Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <FieldBox label="Founder Quote Statement *" active={form.founder_quote_active} onToggle={() => setForm(p => ({ ...p, founder_quote_active: p.founder_quote_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, founder_quote: '' }))}>
              <textarea rows={3} required value={form.founder_quote} onChange={e => setForm(p => ({ ...p, founder_quote: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder='"Modesty and elegance were never meant to be a compromise..."' />
            </FieldBox>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <FieldBox label="Founder Title & Name" active={form.founder_title_active} onToggle={() => setForm(p => ({ ...p, founder_title_active: p.founder_title_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, founder_title: '' }))}>
                <input value={form.founder_title} onChange={e => setForm(p => ({ ...p, founder_title: e.target.value }))} style={iStyle} placeholder="Founder, Laila Hijabs" />
              </FieldBox>
              <ImageUploaderBox label="Founder Logo / Signature Image" value={form.founder_logo} onChange={val => setForm(p => ({ ...p, founder_logo: val }))} active={form.founder_logo_active} onToggle={() => setForm(p => ({ ...p, founder_logo_active: p.founder_logo_active === false ? true : false }))} onClear={() => setForm(p => ({ ...p, founder_logo: '' }))} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
            {saving ? 'Saving...' : 'Save All Brand Overview Sections'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AboutWhoWeAreManagerPage;
