import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };

const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
  </svg>
);

const AboutWhoWeAreManagerPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Legacy & Who We Are
    badge_text: 'A Legacy of Modest Luxury',
    title: 'Who We Are',
    body_content: 'Laila Hijabs is Pakistan\'s leading luxury modest fashion house. Founded in Lahore, we blend traditional craftsmanship with contemporary design to create pieces that celebrate both faith and fashion. Our team of expert designers and seamstresses pour their passion into every garment we produce.',
    image_url: '/hero1.png',
    image_url_2: '/hero2.png',
    sec1_active: true,

    // Section 2: Philosophy Quote
    sec2_title: 'Our Philosophy',
    quote_text: '"She doesn\'t compete loudly. She attracts quietly."',
    quote_author: '— The Laila Hijab Studio',
    sec2_active: true,

    // Section 3: Values / What We Stand For
    sec3_title: 'What We Stand For',
    sec3_subtitle: 'Grace, built on four values',
    values: [
      { letter: 'E', title: 'Elegance', desc: 'Refined design over excess — every piece earns its place in the collection.' },
      { letter: 'C', title: 'Comfort', desc: 'Fabrics chosen to move with you, not against you, across a full day.' },
      { letter: 'I', title: 'Inclusivity', desc: 'Sizes XS through XXL, always — grace was never meant for one body type.' },
      { letter: 'R', title: 'Respect', desc: 'For tradition, for modern taste, and for every woman\'s own idea of modesty.' }
    ],
    sec3_active: true,

    // Section 4: Roadmap / Where We're Headed
    sec4_title: 'Where We\'re Headed',
    sec4_subtitle: 'A brand built in phases, not overnight',
    roadmap: [
      { year: '2026', title: 'Laila Hijabs is born', desc: 'Launched from our studio in Lahore with the Everyday Grace Collection — chiffon and jersey hijabs designed for daily wear.' },
      { year: 'Next', title: 'Premium & Abaya lines', desc: 'Expanding into silk premium hijabs and structured abayas sized XS–XXL, with a dedicated Eid edit each season.' },
      { year: 'Later', title: 'Pakistan-wide, then the Gulf', desc: 'Growing city by city across Pakistan, before bringing Laila to Pakistani and South Asian women across the UAE.' }
    ],
    sec4_active: true,

    // Section 5: Founder Quote & Signature
    founder_quote: '"Modesty and elegance were never meant to be a compromise. Laila is the brand I wanted to find and couldn\'t — so we made it."',
    founder_title: 'Founder, Laila Hijabs',
    founder_logo: '/founder-logo.png',
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
            sec1_active: meta.sec1_active !== false,
            sec2_title: meta.sec2_title || prev.sec2_title,
            quote_text: meta.quote_text || prev.quote_text,
            quote_author: meta.quote_author || prev.quote_author,
            sec2_active: meta.sec2_active !== false,
            sec3_title: meta.sec3_title || prev.sec3_title,
            sec3_subtitle: meta.sec3_subtitle || prev.sec3_subtitle,
            values: meta.values || prev.values,
            sec3_active: meta.sec3_active !== false,
            sec4_title: meta.sec4_title || prev.sec4_title,
            sec4_subtitle: meta.sec4_subtitle || prev.sec4_subtitle,
            roadmap: meta.roadmap || prev.roadmap,
            sec4_active: meta.sec4_active !== false,
            founder_quote: meta.founder_quote || prev.founder_quote,
            founder_title: meta.founder_title || prev.founder_title,
            founder_logo: meta.founder_logo || prev.founder_logo,
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
          sec1_active: form.sec1_active,
          sec2_title: form.sec2_title,
          quote_text: form.quote_text,
          quote_author: form.quote_author,
          sec2_active: form.sec2_active,
          sec3_title: form.sec3_title,
          sec3_subtitle: form.sec3_subtitle,
          values: form.values,
          sec3_active: form.sec3_active,
          sec4_title: form.sec4_title,
          sec4_subtitle: form.sec4_subtitle,
          roadmap: form.roadmap,
          sec4_active: form.sec4_active,
          founder_quote: form.founder_quote,
          founder_title: form.founder_title,
          founder_logo: form.founder_logo,
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

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Brand Overview & Story...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>ABOUT OUR BRAND</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Brand Overview & Story Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage all 5 core sections of the About Us page: Legacy, Philosophy, Core Values, Growth Roadmap, and Founder Statement.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All 5 Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save All Brand Sections'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: A Legacy of Modest Luxury — Who We Are ───────────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>A Legacy of Modest Luxury & Who We Are</h3>
            </div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec1_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec1_active ? '#F6F1E3' : '#EF4444', border: form.sec1_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec1_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Badge / Tagline</label>
                <input value={form.badge_text} onChange={e => setForm(p => ({ ...p, badge_text: e.target.value }))} style={iStyle} placeholder="A Legacy of Modest Luxury" />
              </div>
              <div>
                <label style={lStyle}>Main Heading *</label>
                <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={iStyle} placeholder="Who We Are" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Brand Description Story *</label>
              <textarea rows={4} required value={form.body_content} onChange={e => setForm(p => ({ ...p, body_content: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Laila Hijabs is Pakistan's leading luxury modest fashion house..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Primary Story Photo URL</label>
                <input value={form.image_url} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={iStyle} placeholder="/hero1.png" />
              </div>
              <div>
                <label style={lStyle}>Secondary Craftsmanship Photo URL</label>
                <input value={form.image_url_2} onChange={e => setForm(p => ({ ...p, image_url_2: e.target.value }))} style={iStyle} placeholder="/hero2.png" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Our Philosophy Quote ──────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 2 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Our Philosophy Quote Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec2_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec2_active ? '#F6F1E3' : '#EF4444', border: form.sec2_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec2_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lStyle}>Section Title</label>
              <input value={form.sec2_title} onChange={e => setForm(p => ({ ...p, sec2_title: e.target.value }))} style={iStyle} placeholder="Our Philosophy" />
            </div>
            <div>
              <label style={lStyle}>Philosophy Quote *</label>
              <textarea rows={2} value={form.quote_text} onChange={e => setForm(p => ({ ...p, quote_text: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="She does not compete loudly. She attracts quietly." />
            </div>
            <div>
              <label style={lStyle}>Quote Attribution Author</label>
              <input value={form.quote_author} onChange={e => setForm(p => ({ ...p, quote_author: e.target.value }))} style={iStyle} placeholder="— The Laila Hijab Studio" />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: What We Stand For — 4 Values ────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 3 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>What We Stand For — Core Values</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" onClick={handleAddValue} style={btnG}>+ Add Value</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec3_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec3_active ? '#F6F1E3' : '#EF4444', border: form.sec3_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec3_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec3_title} onChange={e => setForm(p => ({ ...p, sec3_title: e.target.value }))} style={iStyle} placeholder="What We Stand For" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec3_subtitle} onChange={e => setForm(p => ({ ...p, sec3_subtitle: e.target.value }))} style={iStyle} placeholder="Grace, built on four values" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              {form.values.map((v, idx) => {
                const isActive = v.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: isActive ? '1px solid rgba(184,147,91,0.3)' : '1px solid rgba(239,68,68,0.3)', opacity: isActive ? 1 : 0.65 }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                      <input value={v.letter} onChange={e => handleValueChange(idx, 'letter', e.target.value)} style={{ ...iStyle, width: '45px', textAlign: 'center', fontWeight: '800', color: '#B8935B' }} maxLength={2} />
                      <input value={v.title} onChange={e => handleValueChange(idx, 'title', e.target.value)} style={{ ...iStyle, flex: 1, fontWeight: '700' }} placeholder="Value Title" />
                      <button type="button" onClick={() => handleToggleValueActive(idx)} style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isActive ? '#22c55e' : '#EF4444', border: '1px solid currentColor', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                        {isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button type="button" onClick={() => handleDeleteValue(idx)} style={{ padding: '5px 8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', borderRadius: '6px', cursor: 'pointer' }}>
                        <TrashIcon />
                      </button>
                    </div>
                    <textarea rows={2} value={v.desc} onChange={e => handleValueChange(idx, 'desc', e.target.value)} style={{ ...iStyle, resize: 'vertical' }} placeholder="Value description..." />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Where We're Headed — Roadmap ───────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec4_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Where We're Headed — Brand Roadmap</h3>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button type="button" onClick={handleAddRoadmap} style={btnG}>+ Add Phase</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec4_active: !p.sec4_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec4_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec4_active ? '#F6F1E3' : '#EF4444', border: form.sec4_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec4_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec4_title} onChange={e => setForm(p => ({ ...p, sec4_title: e.target.value }))} style={iStyle} placeholder="Where We're Headed" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec4_subtitle} onChange={e => setForm(p => ({ ...p, sec4_subtitle: e.target.value }))} style={iStyle} placeholder="A brand built in phases, not overnight" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.roadmap.map((step, idx) => {
                const isActive = step.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: isActive ? '1px solid rgba(184,147,91,0.3)' : '1px solid rgba(239,68,68,0.3)', opacity: isActive ? 1 : 0.65, display: 'grid', gridTemplateColumns: '120px 1fr 2fr auto auto', gap: '12px', alignItems: 'center' }}>
                    <input value={step.year} onChange={e => handleRoadmapChange(idx, 'year', e.target.value)} style={{ ...iStyle, fontWeight: '800', color: '#B8935B' }} placeholder="Phase / Year" />
                    <input value={step.title} onChange={e => handleRoadmapChange(idx, 'title', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Phase Title" />
                    <input value={step.desc} onChange={e => handleRoadmapChange(idx, 'desc', e.target.value)} style={iStyle} placeholder="Phase Details" />
                    <button type="button" onClick={() => handleToggleRoadmapActive(idx)} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isActive ? '#22c55e' : '#EF4444', border: '1px solid currentColor', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button type="button" onClick={() => handleDeleteRoadmap(idx)} style={{ padding: '5px 8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', borderRadius: '6px', cursor: 'pointer' }}>
                      <TrashIcon />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Founder Quote & Logo ─────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 5 OF 5</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Founder Statement & Logo</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec5_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec5_active ? '#F6F1E3' : '#EF4444', border: form.sec5_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec5_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={lStyle}>Founder Quote Statement *</label>
              <textarea rows={3} required value={form.founder_quote} onChange={e => setForm(p => ({ ...p, founder_quote: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder='"Modesty and elegance were never meant to be a compromise..."' />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Founder Title & Name</label>
                <input value={form.founder_title} onChange={e => setForm(p => ({ ...p, founder_title: e.target.value }))} style={iStyle} placeholder="Founder, Laila Hijabs" />
              </div>
              <div>
                <label style={lStyle}>Founder Logo / Signature Image URL</label>
                <input value={form.founder_logo} onChange={e => setForm(p => ({ ...p, founder_logo: e.target.value }))} style={iStyle} placeholder="/founder-logo.png" />
              </div>
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
