import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '5px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '14px', padding: '22px', border: '1px solid rgba(184,147,91,0.25)' };
const btnP = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnG = { padding: '7px 12px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnD = { padding: '7px 10px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const CustomOrderPageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    // Section 1: Made Just For You — Hero Banner
    sec1_tag: 'Made Just For You',
    sec1_title: 'Your idea, stitched into grace.',
    sec1_body: 'Have a fabric, color, or design in mind that you haven\'t seen in our collection? Tell us about it — our studio can bring custom hijabs and abayas to life, tailored to your size and vision.',
    sec1_btn_text: 'Start Custom Order',
    sec1_btn_link: '#custom-form',
    sec1_image_1: '/custom-hero-1.png',
    sec1_image_2: '/custom-hero-2.png',
    sec1_active: true,

    // Section 2: How It Works — 4 Steps
    sec2_title: 'How It Works',
    sec2_subtitle: 'From idea to doorstep, in four steps',
    steps: [
      {
        num: '01',
        title: 'Share Your Vision',
        desc: 'Fill the form below with your idea, preferred fabric, color, and size — attach a reference photo if you have one.'
      },
      {
        num: '02',
        title: 'We Confirm on WhatsApp',
        desc: 'Our team reaches out within a few hours to discuss details, fabric availability, and final pricing.'
      },
      {
        num: '03',
        title: 'Crafted at Our Studio',
        desc: 'Your piece is cut and stitched by hand, with a progress photo shared before it\'s finalized.'
      },
      {
        num: '04',
        title: 'Delivered to You',
        desc: 'Nationwide delivery with cash on delivery available, or pick up in person at our studio.'
      }
    ],
    sec2_active: true,

    // Section 3: Brought to Life Gallery Images
    sec3_title: 'Brought to Life',
    sec3_subtitle: 'Custom designs crafted for our clients',
    gallery: [
      { image_url: '/custom-gallery-1.png', label: 'Bespoke Silk Abaya in Emerald' },
      { image_url: '/custom-gallery-2.png', label: 'Custom Layered Chiffon Hijab Set' },
      { image_url: '/custom-gallery-3.png', label: 'Embroidered Velvet Bridal Kaftan' }
    ],
    sec3_active: true,

    // Section 4: Tell Us What You Need — Highlights & Form Header
    sec4_title: 'Tell Us What You Need',
    sec4_subtitle: 'Submit your custom request',
    sec4_body: 'The more detail you share, the closer we get to your vision on the first try. Once submitted, you can also continue the conversation directly on WhatsApp.',
    highlights: [
      'No design fee for the first consultation',
      'Available in sizes XS – XXL',
      'Typical turnaround: 7–12 days'
    ],
    sec4_active: true,

    // Section 5: Contact Form Details & Edit Controls
    sec5_title: 'Custom Order Request Form',
    form_name_label: 'FULL NAME',
    form_phone_label: 'WHATSAPP NUMBER',
    form_garment_label: 'GARMENT TYPE',
    form_garment_options: 'Abaya, Hijab Set, Kaftan, Gown, Custom Suit',
    form_desc_label: 'TELL US ABOUT YOUR VISION',
    form_btn_text: 'Submit Custom Request',
    sec5_active: true,

    // Section 6: Custom Order FAQs
    sec6_title: 'Custom Order FAQs',
    faqs: [
      { q: 'How long does a custom order take?', a: 'Typical turnaround is 7–12 business days from the moment fabric and measurements are confirmed.' },
      { q: 'Can I bring my own fabric to the studio?', a: 'Yes! You can drop off your fabric at our Lahore studio or courier it to us.' },
      { q: 'What is the return policy on custom orders?', a: 'Since custom pieces are tailored specifically to your size, they are non-refundable, but free alterations are provided if needed.' }
    ],
    sec6_active: true
  });

  useEffect(() => {
    fetch(`${API}/sections/custom_orders_settings`)
      .then(r => r.json())
      .then(d => {
        if (d && d.title) {
          const meta = d.metadata || {};
          setForm(prev => ({
            ...prev,
            sec1_title: d.title || prev.sec1_title,
            sec1_subtitle: d.subtitle || prev.sec1_subtitle,
            sec1_body: d.body_content || prev.sec1_body,
            sec1_image_1: d.image_url || prev.sec1_image_1,
            sec1_image_2: d.image_url_2 || prev.sec1_image_2,
            sec1_btn_text: d.button_text || prev.sec1_btn_text,
            sec1_btn_link: d.button_link || prev.sec1_btn_link,
            sec1_tag: meta.sec1_tag || prev.sec1_tag,
            sec1_active: meta.sec1_active !== false,
            sec2_title: meta.sec2_title || prev.sec2_title,
            sec2_subtitle: meta.sec2_subtitle || prev.sec2_subtitle,
            steps: meta.steps || prev.steps,
            sec2_active: meta.sec2_active !== false,
            sec3_title: meta.sec3_title || prev.sec3_title,
            sec3_subtitle: meta.sec3_subtitle || prev.sec3_subtitle,
            gallery: meta.gallery || prev.gallery,
            sec3_active: meta.sec3_active !== false,
            sec4_title: meta.sec4_title || prev.sec4_title,
            sec4_subtitle: meta.sec4_subtitle || prev.sec4_subtitle,
            sec4_body: meta.sec4_body || prev.sec4_body,
            highlights: meta.highlights || prev.highlights,
            sec4_active: meta.sec4_active !== false,
            sec5_title: meta.sec5_title || prev.sec5_title,
            form_name_label: meta.form_name_label || prev.form_name_label,
            form_phone_label: meta.form_phone_label || prev.form_phone_label,
            form_garment_label: meta.form_garment_label || prev.form_garment_label,
            form_garment_options: meta.form_garment_options || prev.form_garment_options,
            form_desc_label: meta.form_desc_label || prev.form_desc_label,
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

    fetch(`${API}/sections/custom_orders_settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.sec1_title,
        subtitle: form.sec1_subtitle,
        body_content: form.sec1_body,
        image_url: form.sec1_image_1,
        image_url_2: form.sec1_image_2,
        button_text: form.sec1_btn_text,
        button_link: form.sec1_btn_link,
        metadata: {
          sec1_tag: form.sec1_tag,
          sec1_active: form.sec1_active,
          sec2_title: form.sec2_title,
          sec2_subtitle: form.sec2_subtitle,
          steps: form.steps,
          sec2_active: form.sec2_active,
          sec3_title: form.sec3_title,
          sec3_subtitle: form.sec3_subtitle,
          gallery: form.gallery,
          sec3_active: form.sec3_active,
          sec4_title: form.sec4_title,
          sec4_subtitle: form.sec4_subtitle,
          sec4_body: form.sec4_body,
          highlights: form.highlights,
          sec4_active: form.sec4_active,
          sec5_title: form.sec5_title,
          form_name_label: form.form_name_label,
          form_phone_label: form.form_phone_label,
          form_garment_label: form.form_garment_label,
          form_garment_options: form.form_garment_options,
          form_desc_label: form.form_desc_label,
          form_btn_text: form.form_btn_text,
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

  const handleGalleryChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.gallery];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, gallery: copy };
    });
  };

  const addGalleryItem = () => setForm(p => ({ ...p, gallery: [...p.gallery, { image_url: '/hero1.png', label: 'New Custom Design' }] }));
  const removeGalleryItem = (idx) => setForm(p => ({ ...p, gallery: p.gallery.filter((_, i) => i !== idx) }));

  const handleHighlightChange = (idx, val) => {
    setForm(p => {
      const copy = [...p.highlights];
      copy[idx] = val;
      return { ...p, highlights: copy };
    });
  };

  const handleFaqChange = (idx, field, val) => {
    setForm(p => {
      const copy = [...p.faqs];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...p, faqs: copy };
    });
  };

  const addFaq = () => setForm(p => ({ ...p, faqs: [...p.faqs, { q: '', a: '' }] }));
  const removeFaq = (idx) => setForm(p => ({ ...p, faqs: p.faqs.filter((_, i) => i !== idx) }));

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9' }}>Loading Custom Order Page Manager...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '60px' }}>
      
      {/* Header Banner */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', borderRadius: '16px', padding: '26px 30px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '5px' }}>CUSTOM DESIGN ORDERS</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Custom Order Page Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            Manage all 6 sections: Made Just For You, How It Works, Brought to Life Gallery, Tell Us What You Need, Form Details, and FAQs.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {saved && <span style={{ fontSize: '12px', color: '#22c55e', fontWeight: '600', padding: '7px 14px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>Saved All 6 Sections!</span>}
          <button onClick={handleSave} disabled={saving} style={btnP}>
            {saving ? 'Saving...' : 'Save Custom Order Page'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

        {/* ── SECTION 1: Made Just For You ─────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec1_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 1 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Made Just For You — Hero Banner</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec1_active: !p.sec1_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec1_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec1_active ? '#F6F1E3' : '#EF4444', border: form.sec1_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec1_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Tagline Badge</label>
                <input value={form.sec1_tag} onChange={e => setForm(p => ({ ...p, sec1_tag: e.target.value }))} style={iStyle} placeholder="Made Just For You" />
              </div>
              <div>
                <label style={lStyle}>Hero Main Title *</label>
                <input required value={form.sec1_title} onChange={e => setForm(p => ({ ...p, sec1_title: e.target.value }))} style={iStyle} placeholder="Your idea, stitched into grace." />
              </div>
            </div>

            <div>
              <label style={lStyle}>Hero Body Description *</label>
              <textarea rows={3} required value={form.sec1_body} onChange={e => setForm(p => ({ ...p, sec1_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="Have a fabric, color, or design in mind..." />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={lStyle}>CTA Button Text</label>
                <input value={form.sec1_btn_text} onChange={e => setForm(p => ({ ...p, sec1_btn_text: e.target.value }))} style={iStyle} placeholder="Start Custom Order" />
              </div>
              <div>
                <label style={lStyle}>CTA Button Link</label>
                <input value={form.sec1_btn_link} onChange={e => setForm(p => ({ ...p, sec1_btn_link: e.target.value }))} style={iStyle} placeholder="#custom-form" />
              </div>
              <div>
                <label style={lStyle}>Primary Image URL</label>
                <input value={form.sec1_image_1} onChange={e => setForm(p => ({ ...p, sec1_image_1: e.target.value }))} style={iStyle} placeholder="/custom-hero-1.png" />
              </div>
              <div>
                <label style={lStyle}>Secondary Image URL</label>
                <input value={form.sec1_image_2} onChange={e => setForm(p => ({ ...p, sec1_image_2: e.target.value }))} style={iStyle} placeholder="/custom-hero-2.png" />
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: How It Works — 4 Steps ────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec2_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 2 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>How It Works — Four Steps</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec2_active: !p.sec2_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec2_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec2_active ? '#F6F1E3' : '#EF4444', border: form.sec2_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec2_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec2_title} onChange={e => setForm(p => ({ ...p, sec2_title: e.target.value }))} style={iStyle} placeholder="How It Works" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec2_subtitle} onChange={e => setForm(p => ({ ...p, sec2_subtitle: e.target.value }))} style={iStyle} placeholder="From idea to doorstep, in four steps" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {form.steps.map((st, idx) => (
                <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '16px', border: '1px solid rgba(184,147,91,0.3)', display: 'grid', gridTemplateColumns: '80px 1fr 2fr', gap: '12px', alignItems: 'center' }}>
                  <input value={st.num} onChange={e => handleStepChange(idx, 'num', e.target.value)} style={{ ...iStyle, fontWeight: '800', color: '#B8935B', textAlign: 'center' }} />
                  <input value={st.title} onChange={e => handleStepChange(idx, 'title', e.target.value)} style={{ ...iStyle, fontWeight: '700' }} placeholder="Step Title" />
                  <input value={st.desc} onChange={e => handleStepChange(idx, 'desc', e.target.value)} style={iStyle} placeholder="Step Description" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Brought to Life Gallery ───────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec3_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 3 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Brought to Life Gallery</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button type="button" onClick={addGalleryItem} style={btnG}>+ Add Gallery Photo</button>
              <button type="button" onClick={() => setForm(p => ({ ...p, sec3_active: !p.sec3_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec3_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec3_active ? '#F6F1E3' : '#EF4444', border: form.sec3_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
                {form.sec3_active ? 'Deactivate Section' : 'Activate Section'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec3_title} onChange={e => setForm(p => ({ ...p, sec3_title: e.target.value }))} style={iStyle} placeholder="Brought to Life" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec3_subtitle} onChange={e => setForm(p => ({ ...p, sec3_subtitle: e.target.value }))} style={iStyle} placeholder="Custom designs crafted for our clients" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
              {form.gallery.map((g, idx) => (
                <div key={idx} style={{ backgroundColor: '#182012', borderRadius: '12px', padding: '14px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700' }}>PHOTO #{idx + 1}</span>
                    <button type="button" onClick={() => removeGalleryItem(idx)} style={btnD}>Remove</button>
                  </div>
                  <input value={g.image_url} onChange={e => handleGalleryChange(idx, 'image_url', e.target.value)} style={iStyle} placeholder="Image URL (e.g. /custom1.png)" />
                  <input value={g.label} onChange={e => handleGalleryChange(idx, 'label', e.target.value)} style={iStyle} placeholder="Design Title / Label" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 4: Tell Us What You Need — Highlights ──────────────────── */}
        <div style={{ ...cardStyle, border: form.sec4_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 4 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Tell Us What You Need — Form Intro & Highlights</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec4_active: !p.sec4_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec4_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec4_active ? '#F6F1E3' : '#EF4444', border: form.sec4_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec4_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Section Title</label>
                <input value={form.sec4_title} onChange={e => setForm(p => ({ ...p, sec4_title: e.target.value }))} style={iStyle} placeholder="Tell Us What You Need" />
              </div>
              <div>
                <label style={lStyle}>Subtitle Tagline</label>
                <input value={form.sec4_subtitle} onChange={e => setForm(p => ({ ...p, sec4_subtitle: e.target.value }))} style={iStyle} placeholder="Submit your custom request" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Section Body Description</label>
              <textarea rows={2} value={form.sec4_body} onChange={e => setForm(p => ({ ...p, sec4_body: e.target.value }))} style={{ ...iStyle, resize: 'vertical' }} placeholder="The more detail you share, the closer we get to your vision..." />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={lStyle}>3 Custom Service Highlights</label>
              {form.highlights.map((hl, idx) => (
                <input key={idx} value={hl} onChange={e => handleHighlightChange(idx, e.target.value)} style={iStyle} placeholder={`Highlight ${idx + 1}`} />
              ))}
            </div>
          </div>
        </div>

        {/* ── SECTION 5: Contact Form Details & Field Labels Customizer ─────── */}
        <div style={{ ...cardStyle, border: form.sec5_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 5 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Custom Order Form Fields & Placeholders Customizer</h3>
            </div>
            <button type="button" onClick={() => setForm(p => ({ ...p, sec5_active: !p.sec5_active }))} style={{ height: '32px', padding: '0 14px', borderRadius: '8px', backgroundColor: form.sec5_active ? '#182012' : 'rgba(239,68,68,0.15)', color: form.sec5_active ? '#F6F1E3' : '#EF4444', border: form.sec5_active ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>
              {form.sec5_active ? 'Deactivate Section' : 'Activate Section'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Form Title</label>
                <input value={form.sec5_title} onChange={e => setForm(p => ({ ...p, sec5_title: e.target.value }))} style={iStyle} placeholder="Custom Order Request Form" />
              </div>
              <div>
                <label style={lStyle}>CTA Submit Button Text *</label>
                <input value={form.form_btn_text || 'SUBMIT & CONTINUE ON WHATSAPP'} onChange={e => setForm(p => ({ ...p, form_btn_text: e.target.value }))} style={{ ...iStyle, fontWeight: '700', color: '#B8935B' }} placeholder="SUBMIT & CONTINUE ON WHATSAPP" />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginTop: '6px' }}>PERSONAL DETAILS & GARMENT CHOICES</div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Full Name Label & Placeholder</label>
                <input value={form.form_name_label || 'FULL NAME'} onChange={e => setForm(p => ({ ...p, form_name_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="FULL NAME" />
                <input value={form.form_name_placeholder || 'Your name'} onChange={e => setForm(p => ({ ...p, form_name_placeholder: e.target.value }))} style={iStyle} placeholder="Your name" />
              </div>
              <div>
                <label style={lStyle}>WhatsApp Number Label & Placeholder</label>
                <input value={form.form_phone_label || 'WHATSAPP NUMBER'} onChange={e => setForm(p => ({ ...p, form_phone_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="WHATSAPP NUMBER" />
                <input value={form.form_phone_placeholder || '03XX-XXXXXXX'} onChange={e => setForm(p => ({ ...p, form_phone_placeholder: e.target.value }))} style={iStyle} placeholder="03XX-XXXXXXX" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Garment Type Options (comma separated)</label>
                <input value={form.form_garment_options || 'Abaya, Hijab Set, Kaftan, Gown, Custom Suit'} onChange={e => setForm(p => ({ ...p, form_garment_options: e.target.value }))} style={iStyle} placeholder="Abaya, Hijab Set, Kaftan..." />
              </div>
              <div>
                <label style={lStyle}>Size Options (comma separated)</label>
                <input value={form.form_size_options || 'XS, S, M, L, XL, XXL, Custom'} onChange={e => setForm(p => ({ ...p, form_size_options: e.target.value }))} style={iStyle} placeholder="XS, S, M, L, XL, XXL" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={lStyle}>Fabric Type Options (comma separated)</label>
                <input value={form.form_fabric_options || 'Nida Crepe, Chiffon, Silk, Jersey, Velvet'} onChange={e => setForm(p => ({ ...p, form_fabric_options: e.target.value }))} style={iStyle} placeholder="Nida Crepe, Chiffon..." />
              </div>
              <div>
                <label style={lStyle}>Color Field Placeholder</label>
                <input value={form.form_color_placeholder || 'e.g. Olive Green, Dusty Rose, Black'} onChange={e => setForm(p => ({ ...p, form_color_placeholder: e.target.value }))} style={iStyle} placeholder="e.g. Olive Green, Dusty Rose, Black" />
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px', marginTop: '6px' }}>CUSTOM MEASUREMENTS (OPTIONAL IN INCHES)</div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '10px' }}>
              <div>
                <label style={lStyle}>CHEST</label>
                <input value={form.measure_chest || 'CHEST'} onChange={e => setForm(p => ({ ...p, measure_chest: e.target.value }))} style={iStyle} placeholder="CHEST" />
              </div>
              <div>
                <label style={lStyle}>HIPS</label>
                <input value={form.measure_hips || 'HIPS'} onChange={e => setForm(p => ({ ...p, measure_hips: e.target.value }))} style={iStyle} placeholder="HIPS" />
              </div>
              <div>
                <label style={lStyle}>SHOULDERS</label>
                <input value={form.measure_shoulders || 'SHOULDERS'} onChange={e => setForm(p => ({ ...p, measure_shoulders: e.target.value }))} style={iStyle} placeholder="SHOULDERS" />
              </div>
              <div>
                <label style={lStyle}>WAIST</label>
                <input value={form.measure_waist || 'WAIST'} onChange={e => setForm(p => ({ ...p, measure_waist: e.target.value }))} style={iStyle} placeholder="WAIST" />
              </div>
              <div>
                <label style={lStyle}>LENGTH</label>
                <input value={form.measure_length || 'LENGTH'} onChange={e => setForm(p => ({ ...p, measure_length: e.target.value }))} style={iStyle} placeholder="LENGTH" />
              </div>
              <div>
                <label style={lStyle}>WIDTH</label>
                <input value={form.measure_width || 'WIDTH'} onChange={e => setForm(p => ({ ...p, measure_width: e.target.value }))} style={iStyle} placeholder="WIDTH" />
              </div>
            </div>

            <div>
              <label style={lStyle}>Describe Your Design Label & Placeholder</label>
              <input value={form.form_desc_label || 'DESCRIBE YOUR DESIGN *'} onChange={e => setForm(p => ({ ...p, form_desc_label: e.target.value }))} style={{ ...iStyle, marginBottom: '6px' }} placeholder="DESCRIBE YOUR DESIGN *" />
              <input value={form.form_desc_placeholder || 'Fabric, color, occasion, inspiration — tell us everything'} onChange={e => setForm(p => ({ ...p, form_desc_placeholder: e.target.value }))} style={iStyle} placeholder="Fabric, color, occasion, inspiration..." />
            </div>

            <div>
              <label style={lStyle}>Reference Image Upload Box Text</label>
              <input value={form.upload_box_text || 'CLICK TO UPLOAD OR DRAG A PHOTO HERE'} onChange={e => setForm(p => ({ ...p, upload_box_text: e.target.value }))} style={iStyle} placeholder="CLICK TO UPLOAD OR DRAG A PHOTO HERE" />
            </div>

            <div style={{ padding: '12px 16px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.2)', fontSize: '12px', color: '#E7D9C9' }}>
              ℹ️ Submitted custom orders automatically display in <a href="/custom-orders" style={{ color: '#B8935B', fontWeight: 'bold' }}>Custom Order Requests Manager</a>.
            </div>
          </div>
        </div>

        {/* ── SECTION 6: Custom Order FAQs ─────────────────────────────────── */}
        <div style={{ ...cardStyle, border: form.sec6_active ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.35)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
            <div>
              <span style={{ fontSize: '10px', color: '#B8935B', fontWeight: '800', letterSpacing: '1.5px' }}>SECTION 6 OF 6</span>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: '#F6F1E3' }}>Custom Order FAQs Section</h3>
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
              <input value={form.sec6_title} onChange={e => setForm(p => ({ ...p, sec6_title: e.target.value }))} style={iStyle} placeholder="Custom Order FAQs" />
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
            {saving ? 'Saving...' : 'Save All 6 Custom Order Sections'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default CustomOrderPageManager;
