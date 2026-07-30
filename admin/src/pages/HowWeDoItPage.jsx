import React, { useState, useEffect } from 'react';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/admin';

const iStyle = { width: '100%', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#182012', border: '1px solid rgba(184,147,91,0.5)', color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box' };
const lStyle = { fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px', textTransform: 'uppercase', display: 'block', marginBottom: '6px' };
const cardStyle = { backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' };
const btnPrimary = { padding: '9px 18px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '7px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer' };

const DEFAULT_CARDS = [
  {
    id: 'c1',
    icon_type: 'bag',
    title: 'DIRECT TO CONSUMER',
    button_text: 'Learn More →',
    modal_title: 'Direct To Consumer Model',
    modal_description: 'We cut out middlemen to bring you luxury handcrafted modest wear directly from our master artisans at fair prices.',
    status: 'Active'
  },
  {
    id: 'c2',
    icon_type: 'house',
    title: 'DESIGNED IN HOUSE',
    button_text: 'Learn More →',
    modal_title: 'In-House Studio Design',
    modal_description: 'Every silhouette, embroidery pattern, and drape is designed in our Lahore studio by experienced modest fashion specialists.',
    status: 'Active'
  },
  {
    id: 'c3',
    icon_type: 'box',
    title: 'NO MASS PRODUCTION',
    button_text: 'Learn More →',
    modal_title: 'Ethical Small Batches',
    modal_description: 'We produce limited seasonal capsules to avoid waste, ensuring every garment receives personal quality control.',
    status: 'Active'
  },
  {
    id: 'c4',
    icon_type: 'factory',
    title: 'SUPPORTING SMALL FACTORIES',
    button_text: 'Learn More →',
    modal_title: 'Fair Wages & Ethical Craft',
    modal_description: 'We partner with ethical small workshops across Pakistan, empowering local master tailors and embroiderers with fair wages.',
    status: 'Active'
  },
  {
    id: 'c5',
    icon_type: 'screen',
    title: 'ONLINE & CONCESSIONS',
    button_text: 'Learn More →',
    modal_title: 'Seamless Experience',
    modal_description: 'Shop conveniently online with worldwide insured shipping or visit our boutique concessions in major cities.',
    status: 'Active'
  }
];

const HowWeDoItPage = () => {
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [sectionTitle, setSectionTitle] = useState('HOW WE DO IT');
  const [saving, setSaving] = useState(false);
  const [activeModalCard, setActiveModalCard] = useState(null); // Preview popup modal state

  const fetch_ = () => {
    fetch(`${API}/sections/home_cta`)
      .then(r => r.json())
      .then(d => {
        if (d && d.metadata) {
          let m = {};
          try { m = typeof d.metadata === 'string' ? JSON.parse(d.metadata) : d.metadata; } catch(e) {}
          if (Array.isArray(m.cards) && m.cards.length > 0) setCards(m.cards);
          if (m.section_title) setSectionTitle(m.section_title);
        }
      })
      .catch(() => {});
  };

  useEffect(() => { fetch_(); }, []);

  const handleSaveAll = () => {
    setSaving(true);
    fetch(`${API}/sections/home_cta`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'How We Do It',
        subtitle: sectionTitle,
        metadata: { section_title: sectionTitle, cards }
      })
    })
      .then(() => alert('How We Do It section saved successfully!'))
      .catch(() => alert('Error saving section.'))
      .finally(() => setSaving(false));
  };

  const addCard = () => {
    setCards(prev => [...prev, {
      id: `card_${Date.now()}`,
      icon_type: 'bag',
      title: 'NEW PROCESS STEP',
      button_text: 'Learn More →',
      modal_title: 'Process Step Title',
      modal_description: 'Enter detailed pop-up description text here...',
      status: 'Active'
    }]);
  };

  const deleteCard = (id) => setCards(prev => prev.filter(c => c.id !== id));

  const toggleStatus = (id) => setCards(prev => prev.map(c => c.id === id ? { ...c, status: (c.status === 'Active' || c.status === 'Live') ? 'Inactive' : 'Active' } : c));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '50px' }}>
      
      {/* Header Banner */}
      <div style={{ 
        ...cardStyle, 
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)', 
        border: '1px solid #B8935B', 
        display: 'flex', 
        justify: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '12px' 
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px' }}>PRODUCTS & CATALOG</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>"How We Do It" Section Manager</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Configure process cards, button labels, and pop-up modal descriptions.</p>
        </div>
        <button onClick={handleSaveAll} disabled={saving} style={{ ...btnPrimary, boxShadow: '0 4px 14px rgba(184, 147, 91, 0.4)' }}>
          {saving ? 'Saving...' : 'Save Section'}
        </button>
      </div>

      {/* Main Section Controls */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '20px' }}>
          <label style={lStyle}>Section Header Text</label>
          <input 
            value={sectionTitle} 
            onChange={e => setSectionTitle(e.target.value)} 
            style={{ ...iStyle, maxWidth: '400px', fontWeight: '800', letterSpacing: '2px' }} 
            placeholder="HOW WE DO IT"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderTop: '1px solid rgba(184,147,91,0.2)', paddingTop: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#B8935B', letterSpacing: '1.5px' }}>
            PROCESS CARDS ({cards.length})
          </h3>
          <button onClick={addCard} style={btnGhost}>+ Add Card Section</button>
        </div>

        {/* Process Cards List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {cards.map((c, index) => {
            const isActive = c.status === 'Active';
            return (
              <div key={c.id} style={{ backgroundColor: '#182012', padding: '18px', borderRadius: '12px', border: '1px solid rgba(184,147,91,0.3)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B' }}>SECTION #{index + 1}</span>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', backgroundColor: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: isActive ? '#22c55e' : '#EF4444', fontWeight: '700' }}>
                    {c.status}
                  </span>
                </div>

                <div>
                  <label style={lStyle}>Card Title *</label>
                  <input 
                    value={c.title} 
                    onChange={e => setCards(prev => prev.map(item => item.id === c.id ? { ...item, title: e.target.value } : item))} 
                    style={{ ...iStyle, fontWeight: '700' }} 
                  />
                </div>

                <div>
                  <label style={lStyle}>Button Text</label>
                  <input 
                    value={c.button_text} 
                    onChange={e => setCards(prev => prev.map(item => item.id === c.id ? { ...item, button_text: e.target.value } : item))} 
                    style={iStyle} 
                  />
                </div>

                {/* Pop-up Modal Fields */}
                <div style={{ backgroundColor: '#222C1A', padding: '12px', borderRadius: '8px', border: '1px dashed rgba(184,147,91,0.4)', marginTop: '4px' }}>
                  <div style={{ fontSize: '10px', fontWeight: '800', color: '#B8935B', letterSpacing: '1px', marginBottom: '8px' }}>POP-UP MODAL CONTENT</div>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={lStyle}>Pop-up Title</label>
                    <input 
                      value={c.modal_title} 
                      onChange={e => setCards(prev => prev.map(item => item.id === c.id ? { ...item, modal_title: e.target.value } : item))} 
                      style={iStyle} 
                    />
                  </div>

                  <div>
                    <label style={lStyle}>Pop-up Description</label>
                    <textarea 
                      rows="3"
                      value={c.modal_description} 
                      onChange={e => setCards(prev => prev.map(item => item.id === c.id ? { ...item, modal_description: e.target.value } : item))} 
                      style={{ ...iStyle, resize: 'vertical' }} 
                    />
                  </div>
                </div>

                {/* Standard 3-Button Controls matching screenshot */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => toggleStatus(c.id)} 
                    style={{ 
                      height: '36px', 
                      padding: '0 16px', 
                      borderRadius: '8px', 
                      backgroundColor: isActive ? '#182012' : 'rgba(239,68,68,0.15)', 
                      color: isActive ? '#F6F1E3' : '#EF4444', 
                      border: isActive ? '1px solid #B8935B' : '1px solid rgba(239,68,68,0.4)',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setActiveModalCard(c)} 
                    style={{ 
                      height: '36px', 
                      width: '36px', 
                      borderRadius: '8px', 
                      backgroundColor: '#182012', 
                      border: '1px solid #B8935B', 
                      color: '#F6F1E3', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center', 
                      cursor: 'pointer' 
                    }} 
                    title="Preview Pop-up & Edit"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button 
                    type="button" 
                    onClick={() => deleteCard(c.id)} 
                    style={{ 
                      height: '36px', 
                      width: '36px', 
                      borderRadius: '8px', 
                      backgroundColor: 'rgba(239,68,68,0.15)', 
                      border: '1px solid rgba(239,68,68,0.4)', 
                      color: '#EF4444', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justify: 'center', 
                      cursor: 'pointer' 
                    }} 
                    title="Delete Section"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pop-up Preview Dialog */}
      {activeModalCard && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FAF8F5', borderRadius: '16px', padding: '32px', width: '90%', maxWidth: '480px', color: '#1A2010', textAlign: 'center', border: '2px solid #B8935B' }}>
            <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px' }}>HOW WE DO IT — POP-UP PREVIEW</div>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '20px', fontWeight: '800', color: '#1A2010' }}>{activeModalCard.modal_title || activeModalCard.title}</h3>
            <p style={{ fontSize: '14px', color: '#4A5568', lineHeight: '1.6', margin: '0 0 24px 0' }}>{activeModalCard.modal_description}</p>
            <button onClick={() => setActiveModalCard(null)} style={{ ...btnPrimary, width: '100%' }}>Close Preview</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default HowWeDoItPage;
