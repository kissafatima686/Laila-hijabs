import React, { useState, useEffect } from 'react';
import * as FaIcons from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

const SECTION_CONFIGS = {
  global_navbar: {
    label: 'Navigation Bar',
    fields: ['title', 'subtitle', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: [
      { key: 'announcement_bar', label: 'Announcement Bar Text', type: 'text' },
      { key: 'logo_text', label: 'Logo Text', type: 'text' },
      { key: 'nav_links', label: 'Nav Links (array)', type: 'array', subfields: ['label', 'url'] }
    ]
  },
  global_footer: {
    label: 'Footer',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link'],
    metaKeys: [
      { key: 'quick_links', label: 'Quick Links', type: 'array', subfields: ['label', 'url'] },
      { key: 'social_links', label: 'Social Links', type: 'array', subfields: ['platform', 'url'] },
      { key: 'copyright', label: 'Copyright Text', type: 'text' }
    ]
  },
  home_hero: {
    label: 'Hero Banner',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  home_about: {
    label: 'About Section',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  home_choose_us: {
    label: 'Why Choose Us',
    fields: ['title', 'subtitle'],
    metaKeys: [
      { key: 'pillars', label: 'Value Pillars', type: 'array', subfields: ['icon', 'title', 'desc'] }
    ]
  },
  home_faq: {
    label: 'Home FAQs',
    fields: ['title', 'subtitle'],
    metaKeys: [
      { key: 'faqs', label: 'FAQ Items', type: 'array', subfields: ['q', 'a'] }
    ]
  },
  home_services_header: {
    label: 'Collections Header',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'badge_text'],
    metaKeys: []
  },
  home_featured_collections: {
    label: 'Featured Banner',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  home_cta: {
    label: 'CTA Banner',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  about_stats: {
    label: 'About Stats',
    fields: ['title', 'subtitle'],
    metaKeys: [
      { key: 'stats', label: 'Stat Counters', type: 'array', subfields: ['value', 'label'] }
    ]
  },
  about_who_we_are: {
    label: 'Who We Are',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link'],
    metaKeys: []
  },
  about_mission: {
    label: 'Brand Mission',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: []
  },
  contact_main_section: {
    label: 'Contact Page Settings',
    fields: ['title', 'subtitle', 'body_content', 'image_url'],
    metaKeys: [
      { key: 'seo_description', label: 'SEO Meta Description', type: 'text' },
      { key: 'badge_text', label: 'Badge Text (e.g. GET IN TOUCH)', type: 'text' },
      { key: 'main_heading', label: 'Main Heading (e.g. Contact Us)', type: 'text' },
      { key: 'whatsapp_label', label: 'WhatsApp Title', type: 'text' },
      { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text' },
      { key: 'email_address', label: 'Support Email Address', type: 'text' },
      { key: 'pakistan_office', label: 'Pakistan Office Address', type: 'text' },
      { key: 'uae_office', label: 'UAE Office Address', type: 'text' },
      { key: 'follow_us_heading', label: 'Follow Us Heading', type: 'text' },
      { key: 'facebook_link', label: 'Facebook URL', type: 'text' },
      { key: 'instagram_link', label: 'Instagram URL', type: 'text' },
      { key: 'tiktok_link', label: 'TikTok URL', type: 'text' },
      { key: 'form_heading', label: 'Form Heading (e.g. Contact Me)', type: 'text' },
      { key: 'first_name_placeholder', label: 'First Name Placeholder', type: 'text' },
      { key: 'last_name_placeholder', label: 'Last Name Placeholder', type: 'text' },
      { key: 'phone_placeholder', label: 'Phone Number Placeholder', type: 'text' },
      { key: 'email_placeholder', label: 'Email Address Placeholder', type: 'text' },
      { key: 'message_placeholder', label: 'Message Textarea Placeholder', type: 'text' },
      { key: 'submit_btn_text', label: 'Submit Button Text', type: 'text' },
      { key: 'success_title', label: 'Success Message Title', type: 'text' },
      { key: 'success_text', label: 'Success Message Text', type: 'text' }
    ]
  },
  custom_orders_settings: {
    label: 'Custom Orders Settings',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: [
      { key: 'garment_types', label: 'Garment Types (comma separated)', type: 'csv' },
      { key: 'fabric_options', label: 'Fabric Options (comma separated)', type: 'csv' },
      { key: 'steps', label: 'Process Steps', type: 'array', subfields: ['step', 'title', 'desc'] }
    ]
  },
  affiliate_program_settings: {
    label: 'Affiliate Program Settings',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: [
      { key: 'commission_rate', label: 'Commission Rate', type: 'text' },
      { key: 'perks', label: 'Perks (comma separated)', type: 'csv' },
      { key: 'tiers', label: 'Tier Levels', type: 'array', subfields: ['name', 'requirement', 'reward'] }
    ]
  },
  location_page_header: {
    label: 'Locations Page Header',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  location_visit_us_section: {
    label: 'Visit Us Section',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  location_detail_page: {
    label: 'Location Detail Page',
    fields: ['title', 'subtitle', 'body_content', 'badge_text'],
    metaKeys: []
  },
  home_announcement_bar: {
    label: 'Announcement Bar',
    fields: ['title', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  products_specs_template: {
    label: 'Product Specs & Care Template',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: []
  },
  offers_page_header: {
    label: 'Offers Page Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text', 'body_content'],
    metaKeys: []
  },
  blogs_page_header: {
    label: 'Blogs Page Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text', 'body_content'],
    metaKeys: []
  },
  gift_card: {
    label: 'Gift Card Settings',
    fields: ['title', 'subtitle', 'body_content', 'button_text', 'button_link'],
    metaKeys: []
  }
};

const cardStyle = {
  backgroundColor: '#FFFFFF',
  borderRadius: '12px',
  padding: '24px',
  border: '1px solid #E7D9C9',
  boxShadow: '0 2px 8px rgba(62, 73, 48, 0.04)',
  marginBottom: '20px'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '6px',
  backgroundColor: '#F6F1E3',
  border: '1px solid #B8935B',
  color: '#3E4930',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#3E4930',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '5px'
};

const AVAILABLE_ICONS = [
  'FaCut', 'FaUserTie', 'FaTools', 'FaStore', 'FaDesktop', 
  'FaGift', 'FaCreditCard', 'FaShippingFast', 'FaUndo', 
  'FaHeadset', 'FaShoppingBag', 'FaTag', 'FaHeart', 
  'FaStar', 'FaTshirt', 'FaTruck', 'FaBoxOpen', 
  'FaMapMarkerAlt', 'FaInstagram', 'FaFacebook', 'FaTiktok'
];

const ArrayEditor = ({ items = [], subfields = ['subheading', 'text'], onChange }) => {
  const addRow = () => {
    const empty = { status: 'Live' };
    subfields.forEach(f => (empty[f] = ''));
    onChange([...items, empty]);
  };

  const removeRow = (i) => {
    const updated = items.filter((_, idx) => idx !== i);
    onChange(updated);
  };

  const updateRow = (i, field, value) => {
    const updated = items.map((row, idx) => idx === i ? { ...row, [field]: value } : row);
    onChange(updated);
  };

  const toggleRowStatus = (i) => {
    const updated = items.map((row, idx) => {
      if (idx === i) {
        const nextStatus = row.status === 'Hidden' ? 'Live' : 'Hidden';
        return { ...row, status: nextStatus };
      }
      return row;
    });
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {items.map((row, i) => {
        const isHidden = row.status === 'Hidden';
        return (
          <div key={i} style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '8px',
            padding: '16px',
            border: '1px solid #E7D9C9',
            boxShadow: '0 2px 6px rgba(62,73,48,0.03)',
            opacity: isHidden ? 0.6 : 1,
            transition: 'opacity 0.2s',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.8px' }}>
                CONTENT BLOCK #{i + 1}
              </span>
              
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{
                  fontSize: '10px', padding: '2px 8px', borderRadius: '8px', fontWeight: '700',
                  color: isHidden ? '#6B7280' : '#15803D',
                  backgroundColor: isHidden ? '#E7D9C9' : 'rgba(34,197,94,0.15)',
                  border: `1px solid ${isHidden ? '#B8935B' : 'rgba(34,197,94,0.3)'}`
                }}>
                  {row.status || 'Live'}
                </span>

                <button
                  type="button"
                  onClick={() => toggleRowStatus(i)}
                  style={{
                    padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '700', cursor: 'pointer',
                    backgroundColor: isHidden ? '#E0E7FF' : '#FEE2E2',
                    color: isHidden ? '#3730A3' : '#DC2626',
                    border: `1px solid ${isHidden ? '#A5B4FC' : '#FCA5A5'}`
                  }}
                >
                  {isHidden ? 'Show' : 'Hide'}
                </button>

                <button
                  type="button"
                  onClick={() => removeRow(i)}
                  style={{
                    padding: '4px 8px', borderRadius: '4px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5',
                    color: '#DC2626', cursor: 'pointer', fontSize: '11px', fontWeight: '600'
                  }}
                  title="Delete Block"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {subfields.map(field => {
                const isTextArea = ['desc', 'description', 'text', 'content', 'a', 'answer'].includes(field.toLowerCase());
                const isIconField = field.toLowerCase().includes('icon');
                const fieldLabel = field === 'subheading' || field === 'q' ? 'Subheading / Title' : (field === 'text' || field === 'a' ? 'Text / Description' : field);

                return (
                  <div key={field}>
                    <label style={{ fontSize: '10px', fontWeight: '700', color: '#3E4930', textTransform: 'uppercase', marginBottom: '3px', display: 'block' }}>
                      {fieldLabel}
                    </label>
                    {isIconField ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '34px', height: '34px', borderRadius: '6px', 
                          backgroundColor: '#F6F1E3', border: '1px solid #B8935B',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#3E4930', fontSize: '15px', flexShrink: 0
                        }}>
                          {(() => {
                            const IconComponent = FaIcons[row[field]] || FaIcons.FaRegCircle;
                            return <IconComponent />;
                          })()}
                        </div>
                        <select
                          value={row[field] || ''}
                          onChange={(e) => updateRow(i, field, e.target.value)}
                          style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }}
                        >
                          <option value="">Select Icon...</option>
                          {AVAILABLE_ICONS.map(icon => (
                            <option key={icon} value={icon}>{icon.replace('Fa', '')}</option>
                          ))}
                        </select>
                      </div>
                    ) : isTextArea ? (
                      <textarea
                        placeholder={`Enter ${fieldLabel}...`}
                        value={row[field] || ''}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px', resize: 'vertical', minHeight: '70px' }}
                      />
                    ) : (
                      <input
                        placeholder={`Enter ${fieldLabel}...`}
                        value={row[field] || ''}
                        onChange={(e) => updateRow(i, field, e.target.value)}
                        style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      <button onClick={addRow} style={{
        marginTop: '4px', padding: '9px 18px', borderRadius: '6px',
        backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3',
        fontSize: '12.5px', fontWeight: '700', cursor: 'pointer', alignSelf: 'flex-start'
      }}>+ Add Row</button>
    </div>
  );
};

const SectionEditorPage = ({ sectionKey: propSectionKey }) => {
  const params = useParams();
  const sectionKey = propSectionKey || params?.sectionKey;
  const [activeSectionKey, setActiveSectionKey] = useState(sectionKey);
  const fallbackConfig = { 
    label: (sectionKey || '').replace(/_/g, ' ').toUpperCase(), 
    fields: ['title', 'subtitle', 'body_content'], 
    hideCustomFields: true,
    metaKeys: [
      { key: 'content_blocks', label: 'Content Blocks (Subheadings & Text)', type: 'array', subfields: ['subheading', 'text'] }
    ] 
  };
  const [config, setConfig] = useState(SECTION_CONFIGS[sectionKey] || fallbackConfig);
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [metaForm, setMetaForm] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reloaded, setReloaded] = useState(false);
  const [error, setError] = useState(null);
  const [sectionActive, setSectionActive] = useState(true);

  const [showNewSectionModal, setShowNewSectionModal] = useState(false);
  const [newSectionForm, setNewSectionForm] = useState({
    key: '',
    title: '',
    subtitle: '',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link']
  });

  const fetchSection = () => {
    setLoading(true);
    setError(null);
    const targetKey = activeSectionKey || sectionKey;
    const currentFallback = { 
      label: targetKey.replace(/_/g, ' ').toUpperCase(), 
      fields: ['title', 'subtitle', 'body_content'], 
      hideCustomFields: true,
      metaKeys: [
        { key: 'content_blocks', label: 'Content Blocks (Subheadings & Text)', type: 'array', subfields: ['subheading', 'text'] }
      ] 
    };
    const currentConfig = SECTION_CONFIGS[targetKey] || currentFallback;
    setConfig(currentConfig);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/sections/${targetKey}`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        const f = {};
        (currentConfig.fields || []).forEach(field => {
          f[field] = d[field] || '';
        });
        setForm(f);
        const meta = d.metadata || {};
        const mf = {};
        (currentConfig.metaKeys || []).forEach(mk => {
          if (mk.type === 'csv') {
            mf[mk.key] = Array.isArray(meta[mk.key]) ? meta[mk.key].join(', ') : (meta[mk.key] || '');
          } else {
            mf[mk.key] = meta[mk.key] || (mk.type === 'array' ? [] : '');
          }
        });
        setMetaForm(mf);
        setSectionActive(d.status !== 'Inactive' && d.status !== 'Hidden');
        setReloaded(true);
        setTimeout(() => setReloaded(false), 2000);
      })
      .catch(() => setError('Could not connect to backend server.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setActiveSectionKey(sectionKey);
  }, [sectionKey]);

  useEffect(() => {
    fetchSection();
  }, [activeSectionKey]);

  const handleSave = (customMetaForm = null, customSectionActive = null) => {
    setSaving(true);
    setSaved(false);
    const activeState = customSectionActive !== null ? customSectionActive : sectionActive;
    const currentMeta = customMetaForm ? { ...metaForm, ...customMetaForm } : metaForm;

    const builtMeta = {};
    (config?.metaKeys || []).forEach(mk => {
      if (mk.type === 'csv') {
        builtMeta[mk.key] = currentMeta[mk.key] ? (typeof currentMeta[mk.key] === 'string' ? currentMeta[mk.key].split(',').map(s => s.trim()).filter(Boolean) : currentMeta[mk.key]) : [];
      } else {
        builtMeta[mk.key] = currentMeta[mk.key] !== undefined ? currentMeta[mk.key] : (mk.type === 'array' ? [] : '');
      }
    });

    const payload = { 
      ...form, 
      status: activeState ? 'Live' : 'Hidden',
      metadata: Object.keys(builtMeta).length > 0 ? builtMeta : null 
    };
    const targetKey = activeSectionKey || sectionKey;

    return fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/sections/${targetKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); })
      .catch(() => setError('Failed to save. Please try again.'))
      .finally(() => setSaving(false));
  };

  const handleToggleSectionActive = () => {
    const nextState = !sectionActive;
    setSectionActive(nextState);
    handleSave(null, nextState);
  };

  const handleFileUpload = (fieldKey, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, [fieldKey]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCreateNewSection = (e) => {
    e.preventDefault();
    if (!newSectionForm.key || !newSectionForm.title) return;
    const cleanKey = newSectionForm.key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const payload = {
      title: newSectionForm.title,
      subtitle: newSectionForm.subtitle || '',
      status: 'Live',
      metadata: { content_blocks: [] }
    };

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/sections/${cleanKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        SECTION_CONFIGS[cleanKey] = {
          label: newSectionForm.title,
          fields: newSectionForm.fields,
          metaKeys: [
            { key: 'content_blocks', label: 'Content Blocks (Subheadings & Text)', type: 'array', subfields: ['subheading', 'text'] }
          ]
        };
        setShowNewSectionModal(false);
        navigate(`/sections/${cleanKey}`);
      })
      .catch(err => console.error("Error creating new section:", err));
  };

  const handleDeleteSection = () => {
    const targetKey = activeSectionKey || sectionKey;
    if (!window.confirm(`Are you sure you want to delete section "${targetKey}"?`)) return;
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/sections/${targetKey}`, {
      method: 'DELETE'
    })
      .then(() => {
        navigate('/footer-manager');
      })
      .catch(err => console.error("Error deleting section:", err));
  };

  if (loading) return <div style={{ padding: '60px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading section editor...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '60px' }}>

      {/* Top Bar Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', backgroundColor: '#FFFFFF', padding: '18px 24px', borderRadius: '12px', border: '1px solid #E7D9C9', boxShadow: '0 2px 8px rgba(62,73,48,0.04)' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>
            SECTION EDITOR › {config.label}
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#3E4930' }}>
            Edit: {config.label}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {saved && (
            <span style={{ fontSize: '12px', color: '#15803D', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              Saved Changes ✓
            </span>
          )}

          {reloaded && (
            <span style={{ fontSize: '12px', color: '#1D4ED8', fontWeight: '600', padding: '6px 12px', borderRadius: '6px', backgroundColor: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
              Reloaded ✓
            </span>
          )}

          <button onClick={() => setShowNewSectionModal(true)} style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '12.5px', fontWeight: '700', cursor: 'pointer' }}>
            + Add New Section
          </button>

          <button onClick={handleDeleteSection} style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>
            🗑️ Delete Section
          </button>

          <button onClick={fetchSection} style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }}>
            🔄 Reload
          </button>

          <button onClick={() => handleSave()} disabled={saving} style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '12.5px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            💾 {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ padding: '14px 20px', borderRadius: '8px', backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5', color: '#DC2626', fontSize: '13px' }}>
          {error}
        </div>
      )}

      {/* Content Fields Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#3E4930' }}>
            ✏️ Content Fields
          </h3>
          <button onClick={handleToggleSectionActive} style={{ padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', backgroundColor: sectionActive ? '#FEE2E2' : '#E0E7FF', color: sectionActive ? '#DC2626' : '#3730A3', border: `1px solid ${sectionActive ? '#FCA5A5' : '#A5B4FC'}` }}>
            {sectionActive ? 'Deactivate Section' : 'Activate Section'}
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(config.fields || []).includes('title') && (
            <div>
              <label style={labelStyle}>Main Title</label>
              <input value={form.title || ''} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} style={inputStyle} placeholder="Enter Section Title..." />
            </div>
          )}

          {(config.fields || []).includes('subtitle') && (
            <div>
              <label style={labelStyle}>Subtitle / Tagline</label>
              <input value={form.subtitle || ''} onChange={e => setForm(p => ({ ...p, subtitle: e.target.value }))} style={inputStyle} placeholder="Enter Subtitle / Tagline..." />
            </div>
          )}

          {(config.fields || []).includes('body_content') && (
            <div>
              <label style={labelStyle}>Body Content / Description</label>
              <textarea rows={4} value={form.body_content || ''} onChange={e => setForm(p => ({ ...p, body_content: e.target.value }))} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Enter Body Content..." />
            </div>
          )}

          {(config.fields || []).includes('image_url') && (
            <div>
              <label style={labelStyle}>Cover Image</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#3E4930', color: '#F6F1E3', fontSize: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>
                  📁 Upload Image
                  <input type="file" accept="image/*" onChange={(e) => handleFileUpload('image_url', e)} style={{ display: 'none' }} />
                </label>
                <input value={form.image_url || ''} onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))} style={inputStyle} placeholder="Upload image file or enter URL..." />
              </div>
              {form.image_url && (
                <div style={{ marginTop: '6px' }}>
                  <img src={form.image_url} alt="Preview" style={{ height: '50px', borderRadius: '4px', border: '1px solid #E7D9C9', objectFit: 'cover' }} />
                </div>
              )}
            </div>
          )}

          {(config.fields || []).includes('button_text') && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Button Text</label>
                <input value={form.button_text || ''} onChange={e => setForm(p => ({ ...p, button_text: e.target.value }))} style={inputStyle} placeholder="e.g. SHOP NOW" />
              </div>
              <div>
                <label style={labelStyle}>Button Link URL</label>
                <input value={form.button_link || ''} onChange={e => setForm(p => ({ ...p, button_link: e.target.value }))} style={inputStyle} placeholder="e.g. /products" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Data Blocks Card */}
      {(config.metaKeys || []).length > 0 && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #E7D9C9', paddingBottom: '10px' }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#3E4930' }}>
              ⚙️ Dynamic Data (Lists, FAQs, Links)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {(config.metaKeys || []).map(mk => (
              <div key={mk.key} style={{ backgroundColor: '#F6F1E3', borderRadius: '8px', padding: '18px', border: '1px solid #E7D9C9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#3E4930' }}>{mk.label}</label>
                </div>

                {mk.type === 'array' ? (
                  <ArrayEditor
                    items={metaForm[mk.key] || []}
                    subfields={mk.subfields}
                    onChange={(updated) => {
                      const newMeta = { ...metaForm, [mk.key]: updated };
                      setMetaForm(newMeta);
                      handleSave(newMeta);
                    }}
                  />
                ) : (
                  <input
                    value={metaForm[mk.key] || ''}
                    onChange={e => setMetaForm(p => ({ ...p, [mk.key]: e.target.value }))}
                    style={{ ...inputStyle, backgroundColor: '#FFFFFF' }}
                    placeholder={`Enter ${mk.label}...`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal to create brand new custom section */}
      {showNewSectionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(62,73,48,0.4)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '26px', width: '90%', maxWidth: '440px', border: '1px solid #E7D9C9', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#3E4930' }}>Add New Section</h3>
              <button onClick={() => setShowNewSectionModal(false)} style={{ background: 'none', border: 'none', color: '#3E4930', cursor: 'pointer' }}>✕</button>
            </div>

            <form onSubmit={handleCreateNewSection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Section Name / Title *</label>
                <input required value={newSectionForm.title} onChange={e => setNewSectionForm(p => ({ ...p, title: e.target.value, key: e.target.value.toLowerCase().replace(/\s+/g, '_') }))} style={inputStyle} placeholder="e.g. Shipping Policies" />
              </div>

              <div>
                <label style={labelStyle}>Subtitle / Description</label>
                <input value={newSectionForm.subtitle} onChange={e => setNewSectionForm(p => ({ ...p, subtitle: e.target.value }))} style={inputStyle} placeholder="e.g. Details about delivery times..." />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowNewSectionModal(false)} style={{ padding: '8px 14px', borderRadius: '6px', backgroundColor: '#F6F1E3', border: '1px solid #B8935B', color: '#3E4930', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#3E4930', border: 'none', color: '#F6F1E3', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Create Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditorPage;
