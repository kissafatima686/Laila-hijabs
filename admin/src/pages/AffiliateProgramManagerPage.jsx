import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const AffiliateProgramManagerPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Hero Banner — Earn With Laila
    sec1_badge: 'Earn With Laila',
    sec1_title: 'Share the grace, earn on every order.',
    sec1_body: 'Love Laila Hijabs? Turn your recommendation into income. Share your unique link with your audience or friends, and earn a commission on every order placed through it.',
    sec1_btn_text: 'Apply Now',
    sec1_btn_link: '#apply-form',
    sec1_image: '/affiliate-hero.png',
    sec1_active: true,

    // Section 2: Stats Highlights
    stat1_value: '10%',
    stat1_label: 'Base Commission',
    stat2_value: '30 Days',
    stat2_label: 'Cookie / Link Window',
    stat3_value: 'Monthly',
    stat3_label: 'Payout via Bank / JazzCash',
    sec2_active: true,

    // Section 3: How It Works — 3 Steps
    sec3_title: 'How It Works',
    sec3_subtitle: 'Three steps to your first payout',
    steps: [
      {
        num: '01',
        title: 'Apply & Get Approved',
        desc: 'Fill out the form below with your Instagram, TikTok, or blog. We review and approve within 2–3 days.'
      },
      {
        num: '02',
        title: 'Share Your Link',
        desc: 'Get a unique referral link and discount code to share on your stories, posts, or with friends directly.'
      },
      {
        num: '03',
        title: 'Earn on Every Order',
        desc: 'Track your clicks and orders in real time, and receive your commission automatically each month.'
      }
    ],
    sec3_active: true,

    // Section 4: Ready to Start? Program Details
    sec4_title: 'Ready to Start?',
    sec4_subtitle: 'Apply to the program',
    sec4_body: 'Tell us a little about yourself and where you\'ll be sharing Laila — we personally review every application.',
    highlights: [
      'No fee to join, ever',
      'Open to students, influencers & everyday customers',
      'Approval within 2–3 business days'
    ],
    sec4_active: true,

    // Section 5: Application Form Settings
    sec5_title: 'Affiliate Application Form',
    sec5_subtitle: 'Fill out your details below to apply for the Laila Ambassador Program.',
    form_btn_text: 'Submit Application',
    sec5_active: true,

    // Section 6: Affiliate Program FAQs
    sec6_title: 'Frequently Asked Questions',
    faqs: [
      { q: 'Who can join the Laila Affiliate Program?', a: 'Anyone with an active social media presence (Instagram, TikTok, YouTube) or a blog, as well as passionate customers who love sharing Laila Hijabs.' },
      { q: 'How and when do I get paid?', a: 'Commissions are calculated monthly and paid directly to your registered Bank Account or JazzCash/EasyPaisa wallet.' },
      { q: 'Is there any cost to join?', a: 'No, joining the Laila Ambassador & Affiliate Program is 100% free with zero hidden fees.' }
    ],
    sec6_active: true
  });

  useEffect(() => {
    fetch(`${API}/sections/affiliate_program_settings`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            sec1_title: d.title || prev.sec1_title,
            sec1_body: d.body_content || prev.sec1_body,
            sec1_image: d.image_url || prev.sec1_image,
            sec1_btn_text: d.button_text || prev.sec1_btn_text,
            sec1_btn_link: d.button_link || prev.sec1_btn_link,
            sec1_badge: meta.sec1_badge || prev.sec1_badge,
            sec1_active: meta.sec1_active !== false,
            stat1_value: meta.stat1_value || prev.stat1_value,
            stat1_label: meta.stat1_label || prev.stat1_label,
            stat2_value: meta.stat2_value || prev.stat2_value,
            stat2_label: meta.stat2_label || prev.stat2_label,
            stat3_value: meta.stat3_value || prev.stat3_value,
            stat3_label: meta.stat3_label || prev.stat3_label,
            sec2_active: meta.sec2_active !== false,
            sec3_title: meta.sec3_title || prev.sec3_title,
            sec3_subtitle: meta.sec3_subtitle || prev.sec3_subtitle,
            steps: meta.steps || prev.steps,
            sec3_active: meta.sec3_active !== false,
            sec4_title: meta.sec4_title || prev.sec4_title,
            sec4_subtitle: meta.sec4_subtitle || prev.sec4_subtitle,
            sec4_body: meta.sec4_body || prev.sec4_body,
            highlights: meta.highlights || prev.highlights,
            sec4_active: meta.sec4_active !== false,
            sec5_title: meta.sec5_title || prev.sec5_title,
            sec5_subtitle: meta.sec5_subtitle || prev.sec5_subtitle,
            form_btn_text: meta.form_btn_text || prev.form_btn_text,
            sec5_active: meta.sec5_active !== false,
            sec6_title: meta.sec6_title || prev.sec6_title,
            faqs: meta.faqs || prev.faqs,
            sec6_active: meta.sec6_active !== false
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);

    fetch(`${API}/sections/affiliate_program_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.sec1_title,
        subtitle: form.sec3_subtitle,
        body_content: form.sec1_body,
        image_url: form.sec1_image,
        button_text: form.sec1_btn_text,
        button_link: form.sec1_btn_link,
        metadata: {
          sec1_badge: form.sec1_badge,
          sec1_active: form.sec1_active,
          stat1_value: form.stat1_value,
          stat1_label: form.stat1_label,
          stat2_value: form.stat2_value,
          stat2_label: form.stat2_label,
          stat3_value: form.stat3_value,
          stat3_label: form.stat3_label,
          sec2_active: form.sec2_active,
          sec3_title: form.sec3_title,
          sec3_subtitle: form.sec3_subtitle,
          steps: form.steps,
          sec3_active: form.sec3_active,
          sec4_title: form.sec4_title,
          sec4_subtitle: form.sec4_subtitle,
          sec4_body: form.sec4_body,
          highlights: form.highlights,
          sec4_active: form.sec4_active,
          sec5_title: form.sec5_title,
          sec5_subtitle: form.sec5_subtitle,
          form_btn_text: form.form_btn_text,
          name_label: form.name_label,
          name_placeholder: form.name_placeholder,
          phone_label: form.phone_label,
          phone_placeholder: form.phone_placeholder,
          handle_label: form.handle_label,
          handle_placeholder: form.handle_placeholder,
          follower_label: form.follower_label,
          follower_options: form.follower_options,
          why_label: form.why_label,
          why_placeholder: form.why_placeholder,
          footer_note: form.footer_note,
          sec5_active: form.sec5_active,
          sec6_title: form.sec6_title,
          faqs: form.faqs,
          sec6_active: form.sec6_active
        }
      })
    })
      .then(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      })
      .finally(() => setSaving(false));
  };

  const handleStepChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.steps];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, steps: copy };
    });
  };

  const addStep = () => setForm(p => ({ ...p, steps: [...p.steps, { num: `0${p.steps.length + 1}`, title: 'New Step', desc: 'Step description...', active: true }] }));
  const removeStep = (idx) => setForm(p => ({ ...p, steps: p.steps.filter((_, i) => i !== idx) }));
  const toggleStepActive = (idx) => setForm(p => {
    const copy = [...p.steps];
    copy[idx] = { ...copy[idx], active: copy[idx].active === false ? true : false };
    return { ...p, steps: copy };
  });

  const handleHighlightChange = (idx, val) => {
    setForm(p => {
      const copy = [...p.highlights];
      copy[idx] = typeof copy[idx] === 'object' ? { ...copy[idx], text: val } : { text: val, active: true };
      return { ...p, highlights: copy };
    });
  };

  const addHighlight = () => setForm(p => ({ ...p, highlights: [...p.highlights, { text: 'New Highlight', active: true }] }));
  const removeHighlight = (idx) => setForm(p => ({ ...p, highlights: p.highlights.filter((_, i) => i !== idx) }));
  const toggleHighlightActive = (idx) => setForm(p => {
    const copy = [...p.highlights];
    const item = typeof copy[idx] === 'object' ? copy[idx] : { text: copy[idx], active: true };
    copy[idx] = { ...item, active: item.active === false ? true : false };
    return { ...p, highlights: copy };
  });

  const handleFaqChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.faqs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, faqs: copy };
    });
  };

  const addFaq = () => setForm(p => ({ ...p, faqs: [...p.faqs, { q: '', a: '', active: true }] }));
  const removeFaq = (idx) => setForm(p => ({ ...p, faqs: p.faqs.filter((_, i) => i !== idx) }));
  const toggleFaqActive = (idx) => setForm(p => {
    const copy = [...p.faqs];
    copy[idx] = { ...copy[idx], active: copy[idx].active === false ? true : false };
    return { ...p, faqs: copy };
  });

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Affiliate Program Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>AFFILIATE PROGRAM</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Program Information & Banners Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Control all 6 sections: Earn With Laila, Commission Stats, How It Works, Ready to Start, Application Form, and FAQs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All 6 Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save All 6 Sections'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: Earn With Laila ────────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Earn With Laila — Hero Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec1_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec1_active ? '#F6F1E3' : '#EF4444', border: form.sec1_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec1_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Tagline / Badge</label>
                <input value={form.sec1_badge} onChange={e => setForm(p => ({ ...p, sec1_badge: e.target.value }))} style={iStyle} placeholder="Earn With Laila" />
              </div>
              <div>
                <label style={lStyle}>Hero Heading Title *</label>
                <input required value={form.sec1_title} onChange={e => setForm(p => ({ ...p, sec1_title: e.target.value }))} style={iStyle} placeholder="Share the grace, earn on every order." />
              </div>
            </div>

            <div>
              <label style={lStyle}>Hero Body Description *</label>
              <textarea rows={3} required value={form.sec1_body} onChange={e => setForm(p => ({ ...p, sec1_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Love Laila Hijabs? Turn your recommendation into income..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>CTA Button Text</label>
                <input value={form.sec1_btn_text} onChange={e => setForm(p => ({ ...p, sec1_btn_text: e.target.value }))} style={iStyle} placeholder="Apply Now" />
              </div>
              <div>
                <label style={lStyle}>CTA Button Link</label>
                <input value={form.sec1_btn_link} onChange={e => setForm(p => ({ ...p, sec1_btn_link: e.target.value }))} style={iStyle} placeholder="#apply-form" />
              </div>
              <div>
                <label style={lStyle}>Hero Banner Image URL</label>
                <input value={form.sec1_image} onChange={e => setForm(p => ({ ...p, sec1_image: e.target.value }))} style={iStyle} placeholder="/affiliate-hero.png" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: 10% Base Commission, 30 Days Window, Monthly Payout ───── */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 2 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Commission Stats Highlights (3 Stat Cards)</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec2_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec2_active ? '#F6F1E3' : '#EF4444', border: form.sec2_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec2_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)' }}>
              <label style={lStyle}>Card 1 Value</label>
              <input value={form.stat1_value} onChange={e => setForm(p => ({ ...p, stat1_value: e.target.value }))} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', marginBottom: '8px' }} placeholder="10%" />
              <label style={lStyle}>Card 1 Label</label>
              <input value={form.stat1_label} onChange={e => setForm(p => ({ ...p, stat1_label: e.target.value }))} style={iStyle} placeholder="Base Commission" />
            </div>

            <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)' }}>
              <label style={lStyle}>Card 2 Value</label>
              <input value={form.stat2_value} onChange={e => setForm(p => ({ ...p, stat2_value: e.target.value }))} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', marginBottom: '8px' }} placeholder="30 Days" />
              <label style={lStyle}>Card 2 Label</label>
              <input value={form.stat2_label} onChange={e => setForm(p => ({ ...p, stat2_label: e.target.value }))} style={iStyle} placeholder="Cookie / Link Window" />
            </div>

            <div style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)' }}>
              <label style={lStyle}>Card 3 Value</label>
              <input value={form.stat3_value} onChange={e => setForm(p => ({ ...p, stat3_value: e.target.value }))} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', marginBottom: '8px' }} placeholder="Monthly" />
              <label style={lStyle}>Card 3 Label</label>
              <input value={form.stat3_label} onChange={e => setForm(p => ({ ...p, stat3_label: e.target.value }))} style={iStyle} placeholder="Payout via Bank / JazzCash" />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: How It Works — 3 Steps ────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 3 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>How It Works — Steps</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addStep} style={btnG}>+ Add Step</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec3_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec3_active ? '#F6F1E3' : '#EF4444', border: form.sec3_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec3_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec3_title} onChange={e => setForm(p => ({ ...p, sec3_title: e.target.value }))} style={iStyle} placeholder="How It Works" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec3_subtitle} onChange={e => setForm(p => ({ ...p, sec3_subtitle: e.target.value }))} style={iStyle} placeholder="Three steps to your first payout" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.steps.map((st, idx) => {
                const isActive = st.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: isActive ? '1px solid rgba(184,147,91,0.3)' : '1px solid rgba(239,68,68,0.3)', opacity: isActive ? 1 : 0.65, display: 'grid', gridTemplateColumns: '80px 1fr 2fr auto auto', gap: '12px', alignItems: 'center' }}>
                    <input value={st.num} onChange={e => handleStepChange(idx, 'num', e.target.value)} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', textAlign: 'center' }} />
                    <input value={st.title} onChange={e => handleStepChange(idx, 'title', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Step Title" />
                    <input value={st.desc} onChange={e => handleStepChange(idx, 'desc', e.target.value)} style={iStyle} placeholder="Step Description" />
                    <button type="button" onClick={() => toggleStepActive(idx)} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isActive ? '#22c55e' : '#EF4444', border: '1px solid currentColor', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button type="button" onClick={() => removeStep(idx)} style={btnD}>Delete</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Ready to Start? ────────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec4_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Ready to Start? — Program Highlights</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addHighlight} style={btnG}>+ Add Highlight</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec4_active: !p.sec4_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec4_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec4_active ? '#F6F1E3' : '#EF4444', border: form.sec4_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec4_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec4_title} onChange={e => setForm(p => ({ ...p, sec4_title: e.target.value }))} style={iStyle} placeholder="Ready to Start?" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec4_subtitle} onChange={e => setForm(p => ({ ...p, sec4_subtitle: e.target.value }))} style={iStyle} placeholder="Apply to the program" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Section Body Content</label>
              <textarea rows={2} value={form.sec4_body} onChange={e => setForm(p => ({ ...p, sec4_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Tell us a little about yourself..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={lStyle}>Program Bullet Points / Highlights</label>
              {form.highlights.map((hl, idx) => {
                const textVal = typeof hl === 'object' ? hl.text : hl;
                const isActive = typeof hl === 'object' ? hl.active !== false : true;
                return (
                  <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input value={textVal} onChange={e => handleHighlightChange(idx, e.target.value)} style={iStyle} placeholder={`Highlight ${idx + 1}`} />
                    <button type="button" onClick={() => toggleHighlightActive(idx)} style={{ padding: '6px 10px', borderRadius: '6px', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isActive ? '#22c55e' : '#EF4444', border: '1px solid currentColor', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button type="button" onClick={() => removeHighlight(idx)} style={btnD}>Delete</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Application Form Settings ─────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 5 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Application Form & Fields Customizer</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec5_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec5_active ? '#F6F1E3' : '#EF4444', border: form.sec5_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec5_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Form Header Title</label>
                <input value={form.sec5_title} onChange={e => setForm(p => ({ ...p, sec5_title: e.target.value }))} style={iStyle} placeholder="Affiliate Application Form" />
              </div>
              <div>
                <label style={lStyle}>Form Subtitle Description</label>
                <input value={form.sec5_subtitle} onChange={e => setForm(p => ({ ...p, sec5_subtitle: e.target.value }))} style={iStyle} placeholder="Fill out your details below..." />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginTop: '6px' }}>DYNAMIC FORM FIELDS & PLACEHOLDERS</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Field 1: Full Name Label & Placeholder</label>
                <input value={form.name_label || 'FULL NAME'} onChange={e => setForm(p => ({ ...p, name_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="FULL NAME" />
                <input value={form.name_placeholder || 'Your name'} onChange={e => setForm(p => ({ ...p, name_placeholder: e.target.value }))} style={iStyle} placeholder="Your name" />
              </div>

              <div>
                <label style={lStyle}>Field 2: WhatsApp Number Label & Placeholder</label>
                <input value={form.phone_label || 'WHATSAPP NUMBER'} onChange={e => setForm(p => ({ ...p, phone_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="WHATSAPP NUMBER" />
                <input value={form.phone_placeholder || '03XX-XXXXXXX'} onChange={e => setForm(p => ({ ...p, phone_placeholder: e.target.value }))} style={iStyle} placeholder="03XX-XXXXXXX" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Field 3: Instagram / TikTok Label & Placeholder</label>
                <input value={form.handle_label || 'INSTAGRAM / TIKTOK HANDLE'} onChange={e => setForm(p => ({ ...p, handle_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="INSTAGRAM / TIKTOK HANDLE" />
                <input value={form.handle_placeholder || '@yourhandle'} onChange={e => setForm(p => ({ ...p, handle_placeholder: e.target.value }))} style={iStyle} placeholder="@yourhandle" />
              </div>

              <div>
                <label style={lStyle}>Field 4: Follower Range Label</label>
                <input value={form.follower_label || 'FOLLOWER RANGE *'} onChange={e => setForm(p => ({ ...p, follower_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="FOLLOWER RANGE *" />
                <input value={form.follower_options || 'Under 1,000, 1,000 - 5,000, 5,000 - 20,000, 20,000+'} onChange={e => setForm(p => ({ ...p, follower_options: e.target.value }))} style={iStyle} placeholder="Under 1,000, 1,000 - 5,000..." />
              </div>
            </div>

            <div>
              <label style={lStyle}>Field 5: Why Do You Want To Join? Label & Placeholder</label>
              <input value={form.why_label || 'WHY DO YOU WANT TO JOIN? *'} onChange={e => setForm(p => ({ ...p, why_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="WHY DO YOU WANT TO JOIN? *" />
              <input value={form.why_placeholder || 'Tell us a little about your audience or how you’d share Laila'} onChange={e => setForm(p => ({ ...p, why_placeholder: e.target.value }))} style={iStyle} placeholder="Tell us a little about your audience..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Submit Button Text *</label>
                <input value={form.form_btn_text || 'SUBMIT APPLICATION'} onChange={e => setForm(p => ({ ...p, form_btn_text: e.target.value }))} style={{ ...iStyle, fontWeight: '700', color: '#B8935B' }} placeholder="SUBMIT APPLICATION" />
              </div>

              <div>
                <label style={lStyle}>Footer Note Below Button</label>
                <input value={form.footer_note || 'We’ll reach out on WhatsApp once your application is reviewed.'} onChange={e => setForm(p => ({ ...p, footer_note: e.target.value }))} style={iStyle} placeholder="We’ll reach out on WhatsApp..." />
              </div>
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.2)', fontSize: '12px', color: '#E7D9C9' }}>
              ℹ️ Submitted application entries automatically show under <a href="/affiliates" style={{ color: '#B8935B', fontWeight: 'bold' }}>Affiliate Applications Manager</a>.
            </div>
          </div>
        </div>

        {/* ── SECTION 6: Affiliate Program FAQs ─────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec6_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 6 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Affiliate Program FAQs Section</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addFaq} style={btnG}>+ Add FAQ Item</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec6_active: !p.sec6_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec6_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec6_active ? '#F6F1E3' : '#EF4444', border: form.sec6_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec6_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={lStyle}>FAQ Section Title</label>
              <input value={form.sec6_title} onChange={e => setForm(p => ({ ...p, sec6_title: e.target.value }))} style={iStyle} placeholder="Frequently Asked Questions" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.faqs.map((faq, idx) => {
                const isActive = faq.active !== false;
                return (
                  <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: isActive ? '1px solid rgba(184,147,91,0.3)' : '1px solid rgba(239,68,68,0.3)', opacity: isActive ? 1 : 0.65, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700' }}>FAQ ITEM #{idx + 1}</span>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button type="button" onClick={() => toggleFaqActive(idx)} style={{ padding: '4px 8px', borderRadius: '6px', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: isActive ? '#22c55e' : '#EF4444', border: '1px solid currentColor', fontSize: '10px', fontWeight: '700', cursor: 'pointer' }}>
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                        <button type="button" onClick={() => removeFaq(idx)} style={btnD}>Delete FAQ</button>
                      </div>
                    </div>
                    <input value={faq.q} onChange={e => handleFaqChange(idx, 'q', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Question?" />
                    <textarea rows={2} value={faq.a} onChange={e => handleFaqChange(idx, 'a', e.target.value)} style={{ ...iStyle, resize: 'vertical' }} placeholder="Answer..." />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button type="submit" disabled={saving} style={{ ...btnP, padding: '12px 26px', fontSize: '14px' }}>
            {saving ? 'Saving...' : 'Save All 6 Affiliate Program Sections'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AffiliateProgramManagerPage;
