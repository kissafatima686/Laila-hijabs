import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

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
  contact_channels: {
    label: 'Support Channels',
    fields: ['title'],
    metaKeys: [
      { key: 'channels', label: 'Contact Channels', type: 'array', subfields: ['icon', 'label', 'value', 'link'] }
    ]
  },
  contact_hours: {
    label: 'Support Hours',
    fields: ['title', 'subtitle'],
    metaKeys: [
      { key: 'hours', label: 'Hours', type: 'array', subfields: ['day', 'time'] }
    ]
  },
  contact_faq: {
    label: 'Contact FAQs',
    fields: ['title'],
    metaKeys: [
      { key: 'faqs', label: 'FAQ Items', type: 'array', subfields: ['q', 'a'] }
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

  // ─── LOCATION PAGE ──────────────────────────────────────────────────────────
  location_page_header: {
    label: 'Locations Page Header',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  location_visit_us_section: {
    label: 'Visit Us — Fabric In Person Section',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link', 'badge_text'],
    metaKeys: [
      { key: 'location_label', label: 'Location Label (e.g. "Location:")', type: 'text' },
      { key: 'location_value', label: 'Location Value (address snippet)', type: 'text' },
      { key: 'hours_label', label: 'Hours Label (e.g. "Hours:")', type: 'text' },
      { key: 'hours_value', label: 'Hours Value (e.g. Mon–Sat, 11am–8pm)', type: 'text' },
      { key: 'reach_us_label', label: 'Reach Us Label', type: 'text' },
      { key: 'reach_us_value', label: 'Reach Us Value (e.g. WhatsApp or call...)', type: 'text' },
      { key: 'cta_button_text', label: 'CTA Button Text', type: 'text' },
      { key: 'cta_button_link', label: 'CTA Button Link', type: 'text' }
    ]
  },
  location_detail_page: {
    label: 'Location Detail Page — Static Text',
    fields: ['title', 'subtitle', 'body_content', 'badge_text'],
    metaKeys: [
      { key: 'section_contact_label', label: '"Location & Contact Details" Section Title', type: 'text' },
      { key: 'map_section_label', label: '"Find Us on Google Maps" Section Title', type: 'text' },
      { key: 'full_address_label', label: 'Address Field Label', type: 'text' },
      { key: 'opening_hours_label', label: 'Opening Hours Field Label', type: 'text' },
      { key: 'phone_label', label: 'Phone Field Label', type: 'text' },
      { key: 'whatsapp_label', label: 'WhatsApp Field Label', type: 'text' },
      { key: 'email_label', label: 'Email Field Label', type: 'text' },
      { key: 'view_location_btn', label: '"View Location Details" Button Text', type: 'text' },
      { key: 'call_studio_btn', label: '"Call the Studio" Button Text', type: 'text' },
      { key: 'get_directions_btn', label: '"Get Directions" Button Text', type: 'text' }
    ]
  },

  // ─── HOME PAGE EXTENDED ──────────────────────────────────────────────────────
  home_announcement_bar: {
    label: 'Announcement Bar',
    fields: ['title', 'button_text', 'button_link', 'badge_text'],
    metaKeys: [
      { key: 'is_enabled', label: 'Enabled? (true/false)', type: 'text' },
      { key: 'background_color', label: 'Background Color (hex)', type: 'text' },
      { key: 'text_color', label: 'Text Color (hex)', type: 'text' }
    ]
  },
  home_value_strip: {
    label: 'Value Strip',
    fields: ['title'],
    metaKeys: [
      { key: 'items', label: 'Value Strip Items', type: 'array', subfields: ['icon', 'title', 'subtitle'] }
    ]
  },
  home_trending: {
    label: 'Trending Section',
    fields: ['title', 'subtitle', 'badge_text'],
    metaKeys: []
  },
  home_testimonials_section: {
    label: 'Testimonials Section Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text'],
    metaKeys: []
  },
  home_review_banner: {
    label: 'Review Banner',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'badge_text'],
    metaKeys: []
  },
  home_whatsapp_float: {
    label: 'Floating WhatsApp & Socials',
    fields: ['title', 'button_link'],
    metaKeys: [
      { key: 'is_enabled', label: 'Enabled? (true/false)', type: 'text' },
      { key: 'phone', label: 'WhatsApp Phone Number (with country code)', type: 'text' },
      { key: 'message', label: 'Pre-filled WhatsApp Message', type: 'text' },
      { key: 'position', label: 'Position (bottom-right / bottom-left)', type: 'text' },
      { key: 'social_items', label: 'Floating Social Icons & Links', type: 'array', subfields: ['icon', 'label', 'url'] }
    ]
  },
  home_value_slider: {
    label: 'Value Slider Section',
    fields: ['title', 'subtitle', 'body_content', 'image_url', 'image_url_2', 'button_text', 'button_link', 'badge_text'],
    metaKeys: []
  },
  scroll_to_top_settings: {
    label: 'Scroll To Top Button',
    fields: ['title'],
    metaKeys: [
      { key: 'is_enabled', label: 'Enabled? (true/false)', type: 'text' },
      { key: 'threshold_px', label: 'Show After Scroll (px)', type: 'text' },
      { key: 'position', label: 'Position (bottom-right / bottom-left)', type: 'text' }
    ]
  },

  // ─── PRODUCTS PAGE EXTENDED ──────────────────────────────────────────────────
  products_page_header: {
    label: 'Products Page Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text'],
    metaKeys: []
  },
  products_size_guide: {
    label: 'Size Guide Header',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: []
  },
  products_filters_config: {
    label: 'Product Filter Options',
    fields: ['title'],
    metaKeys: [
      { key: 'colors', label: 'Color Options (comma separated)', type: 'csv' },
      { key: 'sizes', label: 'Size Options (comma separated)', type: 'csv' },
      { key: 'fabrics', label: 'Fabric Options (comma separated)', type: 'csv' },
      { key: 'sort_options', label: 'Sort Options (comma separated)', type: 'csv' }
    ]
  },
  products_specs_template: {
    label: 'Product Specifications & Tailoring Template',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: [
      { key: 'spec_labels', label: 'Specification Fields (comma separated)', type: 'csv', placeholder: 'Fabric, Fit, Care Instructions, Country of Origin, Lining' },
      { key: 'default_fabric', label: 'Default Fabric Specification', type: 'text', placeholder: 'Korean Nida / Silk Crepe' },
      { key: 'default_fit', label: 'Default Fit Specification', type: 'text', placeholder: 'Saudi Flared Loose Fit' },
      { key: 'care_instructions', label: 'Default Care Instructions', type: 'textarea', placeholder: 'Dry clean only. Do not bleach. Store in a cool dry place.' },
      { key: 'country_of_origin', label: 'Country of Origin / Craftsmanship', type: 'text', placeholder: 'Handcrafted in Pakistan' },
      { key: 'customization_note', label: 'Customization & Tailoring Note', type: 'textarea', placeholder: 'Custom colours and bespoke sizing available on request.' }
    ]
  },

  // ─── OFFERS PAGE ─────────────────────────────────────────────────────────────
  offers_page_header: {
    label: 'Offers Page Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text', 'body_content'],
    metaKeys: []
  },

  // ─── BLOGS PAGE ──────────────────────────────────────────────────────────────
  blogs_page_header: {
    label: 'Blogs Page Header',
    fields: ['title', 'subtitle', 'image_url', 'badge_text', 'body_content'],
    metaKeys: []
  },
  blogs_filters_config: {
    label: 'Blog Filter Categories',
    fields: ['title'],
    metaKeys: [
      { key: 'categories', label: 'Filter Categories (comma separated)', type: 'csv' }
    ]
  },

  // ─── PAGE SETTINGS ────────────────────────────────────────────────────────────
  account_page_settings: {
    label: 'Account Page Settings',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: []
  },
  cart_page_settings: {
    label: 'Cart Page Settings',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: [
      { key: 'empty_cart_title', label: 'Empty Cart Title', type: 'text' },
      { key: 'empty_cart_message', label: 'Empty Cart Message', type: 'text' },
      { key: 'empty_cart_button', label: 'Empty Cart Button Text', type: 'text' },
      { key: 'empty_cart_link', label: 'Empty Cart Link Path', type: 'text' },
      { key: 'free_delivery_threshold', label: 'Free Shipping Threshold Amount (Rs.)', type: 'text' },
      { key: 'currency', label: 'Currency Symbol / Code (e.g. Rs.)', type: 'text' },
      { key: 'step_1_label', label: 'Step 1 Label (e.g. 1. Cart)', type: 'text' },
      { key: 'order_summary_title', label: 'Order Summary Card Header', type: 'text' },
      { key: 'subtotal_label', label: 'Sub Total Label', type: 'text' },
      { key: 'shipping_label', label: 'Shipping Label', type: 'text' },
      { key: 'free_shipping_text', label: 'Free Shipping Display Text', type: 'text' },
      { key: 'proceed_to_checkout_btn', label: 'Proceed to Checkout Button Text', type: 'text' },
      { key: 'estimated_delivery_text', label: 'Estimated Delivery Note Text', type: 'text' },
      { key: 'coupon_section_title', label: 'Coupon Section Title', type: 'text' },
      { key: 'coupon_placeholder', label: 'Coupon Input Placeholder', type: 'text' },
      { key: 'coupon_apply_btn', label: 'Coupon Apply Button Text', type: 'text' }
    ]
  },
  checkout_page_settings: {
    label: 'Checkout Page Settings',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: [
      { key: 'step_2_label', label: 'Step 2 Label (e.g. 2. Checkout)', type: 'text' },
      { key: 'contact_info_title', label: 'Contact Info Section Header', type: 'text' },
      { key: 'email_label', label: 'Email Field Label', type: 'text' },
      { key: 'phone_label', label: 'Phone Field Label', type: 'text' },
      { key: 'shipping_address_title', label: 'Shipping Address Section Header', type: 'text' },
      { key: 'first_name_label', label: 'First Name Label', type: 'text' },
      { key: 'last_name_label', label: 'Last Name Label', type: 'text' },
      { key: 'street_address_label', label: 'Street Address Label', type: 'text' },
      { key: 'town_city_label', label: 'Town / City Label', type: 'text' },
      { key: 'postcode_label', label: 'Postcode Label', type: 'text' },
      { key: 'country_label', label: 'Country / Region Label', type: 'text' },
      { key: 'continue_to_payment_btn', label: 'Continue to Payment Button Text', type: 'text' },
      { key: 'return_to_cart_btn', label: 'Return to Cart Link Text', type: 'text' }
    ]
  },
  payment_page_settings: {
    label: 'Payment & Receipt Page Settings',
    fields: ['title', 'subtitle', 'body_content'],
    metaKeys: [
      { key: 'step_3_label', label: 'Step 3 Label (e.g. 3. Payment)', type: 'text' },
      { key: 'payment_confirmed_badge', label: 'Payment Confirmed Badge Text', type: 'text' },
      { key: 'thank_you_title', label: 'Thank You Title', type: 'text' },
      { key: 'billed_to_header', label: 'Billed To Section Header', type: 'text' },
      { key: 'order_info_header', label: 'Order Info Section Header', type: 'text' },
      { key: 'item_breakdown_header', label: 'Item Breakdown Header', type: 'text' },
      { key: 'send_whatsapp_btn', label: 'Send Receipt to WhatsApp Button Text', type: 'text' },
      { key: 'return_home_btn', label: 'Return to Home Button Text', type: 'text' }
    ]
  },
  wishlist_page_settings: {
    label: 'Wishlist Page Settings',
    fields: ['title', 'subtitle'],
    metaKeys: [
      { key: 'empty_wishlist_message', label: 'Empty Wishlist Message', type: 'text' },
      { key: 'empty_wishlist_button', label: 'Empty Wishlist Button Text', type: 'text' },
      { key: 'empty_wishlist_link', label: 'Empty Wishlist Button Link', type: 'text' }
    ]
  },

  // ─── GLOBAL ──────────────────────────────────────────────────────────────────
  navbar_settings: {
    label: 'Branding & Logo',
    fields: [],
    metaKeys: [
      { key: 'logo_text', label: 'Logo Text (e.g., Laila)', type: 'text' },
      { key: 'badge_text', label: 'Badge Text (e.g., HIJABS)', type: 'text' },
      { key: 'logo_font_size', label: 'Logo Text Size (e.g., 28px or 1.5rem)', type: 'text' },
      { key: 'logo_font_color', label: 'Logo Text Color (e.g., #FFFFFF)', type: 'text' }
    ]
  },
  footer_settings: {
    label: 'Footer Settings',
    fields: ['title', 'subtitle', 'body_content', 'image_url'],
    metaKeys: [
      { key: 'copyright', label: 'Copyright Text', type: 'text' },
      { key: 'show_newsletter', label: 'Show Newsletter Form (true/false)', type: 'text' },
      { key: 'newsletter_placeholder', label: 'Newsletter Input Placeholder', type: 'text' },
      { key: 'newsletter_button', label: 'Newsletter Button Text', type: 'text' },
      { key: 'social', label: 'Social Links', type: 'array', subfields: ['platform', 'url'] }
    ]
  },
  footer_about_text: {
    label: 'Footer About Text',
    fields: ['title', 'body_content'],
    metaKeys: []
  }
};


const FIELD_LABELS = {
  title: 'Main Title',
  subtitle: 'Subtitle / Tagline',
  body_content: 'Body Content / Description',
  image_url: 'Primary Image URL',
  image_url_2: 'Secondary Image URL',
  button_text: 'Button Label',
  button_link: 'Button Link / URL',
  badge_text: 'Badge / Label Text'
};

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '8px',
  backgroundColor: '#182012',
  border: '1px solid rgba(184, 147, 91, 0.5)',
  color: '#F6F1E3',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box',
  fontFamily: 'Inter, sans-serif'
};

const labelStyle = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#B8935B',
  letterSpacing: '0.8px',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px'
};

// ─── Array Sub-editor ──────────────────────────────────────────────────────────
const ArrayEditor = ({ items = [], subfields, onChange }) => {
  const addRow = () => {
    const empty = {};
    subfields.forEach(f => (empty[f] = ''));
    onChange([...items, empty]);
  };
  const removeRow = (i) => onChange(items.filter((_, idx) => idx !== i));
  const updateRow = (i, field, value) => {
    const updated = items.map((row, idx) => idx === i ? { ...row, [field]: value } : row);
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {items.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {subfields.map(field => (
            <div key={field} style={{ flex: 1, minWidth: '120px' }}>
              <input
                placeholder={field}
                value={row[field] || ''}
                onChange={(e) => updateRow(i, field, e.target.value)}
                style={{ ...inputStyle, fontSize: '12px', padding: '8px 12px' }}
              />
            </div>
          ))}
          <button onClick={() => removeRow(i)} style={{
            background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)',
            color: '#EF4444', borderRadius: '6px', padding: '8px 12px', cursor: 'pointer', fontSize: '12px', flexShrink: 0
          }}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
      ))}
      <button onClick={addRow} style={{
        marginTop: '4px', padding: '8px 16px', borderRadius: '6px',
        backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3',
        fontSize: '12px', cursor: 'pointer', alignSelf: 'flex-start'
      }}>+ Add Row</button>
    </div>
  );
};

// ─── Main Section Editor ───────────────────────────────────────────────────────
const SectionEditorPage = ({ sectionKey: propSectionKey }) => {
  const params = useParams();
  const sectionKey = propSectionKey || params?.sectionKey;
  const [activeSectionKey, setActiveSectionKey] = useState(sectionKey);
  const [config, setConfig] = useState(SECTION_CONFIGS[sectionKey] || { label: sectionKey, fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link'], metaKeys: [] });
  const [data, setData] = useState(null);
  const [form, setForm] = useState({});
  const [metaForm, setMetaForm] = useState({});
  const [customFields, setCustomFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);

  // New Section Modal State
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
    const currentConfig = SECTION_CONFIGS[targetKey] || { label: targetKey, fields: ['title', 'subtitle', 'body_content', 'image_url', 'button_text', 'button_link'], metaKeys: [] };
    setConfig(currentConfig);

    fetch(`http://localhost:5000/api/admin/sections/${targetKey}`)
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
        if (Array.isArray(meta.custom_fields)) {
          setCustomFields(meta.custom_fields);
        } else {
          setCustomFields([]);
        }
        setImagePreview(d.image_url || null);
        setImagePreview2(d.image_url_2 || null);
      })
      .catch(() => setError('Could not connect to backend. Check your server is running.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    setActiveSectionKey(sectionKey);
  }, [sectionKey]);

  useEffect(() => {
    fetchSection();
  }, [activeSectionKey]);

  const handleSave = () => {
    setSaving(true);
    setSaved(false);
    const builtMeta = {};
    (config?.metaKeys || []).forEach(mk => {
      if (mk.type === 'csv') {
        builtMeta[mk.key] = metaForm[mk.key] ? metaForm[mk.key].split(',').map(s => s.trim()).filter(Boolean) : [];
      } else {
        builtMeta[mk.key] = metaForm[mk.key] || (mk.type === 'array' ? [] : '');
      }
    });

    if (customFields.length > 0) {
      builtMeta.custom_fields = customFields;
    }

    const payload = { ...form, metadata: Object.keys(builtMeta).length > 0 ? builtMeta : null };
    const targetKey = activeSectionKey || sectionKey;

    fetch(`http://localhost:5000/api/admin/sections/${targetKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(() => { setSaved(true); setTimeout(() => setSaved(false), 3000); })
      .catch(() => setError('Failed to save. Please try again.'))
      .finally(() => setSaving(false));
  };

  const handleAddCustomField = () => {
    const fieldName = window.prompt("Enter the label for the new text field / column:");
    if (!fieldName || !fieldName.trim()) return;
    const fieldKey = fieldName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    setCustomFields(prev => [...prev, { key: fieldKey, label: fieldName.trim(), value: '' }]);
  };

  const handleRemoveCustomField = (index) => {
    setCustomFields(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateCustomField = (index, val) => {
    setCustomFields(prev => prev.map((f, idx) => idx === index ? { ...f, value: val } : f));
  };

  const handleCreateNewSection = (e) => {
    e.preventDefault();
    if (!newSectionForm.key || !newSectionForm.title) return;
    const cleanKey = newSectionForm.key.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');

    const payload = {
      title: newSectionForm.title,
      subtitle: newSectionForm.subtitle || '',
      metadata: { custom_fields: [] }
    };

    fetch(`http://localhost:5000/api/admin/sections/${cleanKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => {
        SECTION_CONFIGS[cleanKey] = {
          label: newSectionForm.title,
          fields: newSectionForm.fields,
          metaKeys: []
        };
        setShowNewSectionModal(false);
        setActiveSectionKey(cleanKey);
        alert(`New section "${newSectionForm.title}" created successfully!`);
      })
      .catch(err => console.error("Error creating new section:", err));
  };

  const handleDeleteSection = () => {
    const targetKey = activeSectionKey || sectionKey;
    if (!window.confirm(`Are you sure you want to delete section "${targetKey}"?`)) return;
    fetch(`http://localhost:5000/api/admin/sections/${targetKey}`, {
      method: 'DELETE'
    })
      .then(() => {
        alert("Section deleted successfully!");
        window.location.reload();
      })
      .catch(err => console.error("Error deleting section:", err));
  };

  if (!config) return (
    <div style={{ padding: '40px', color: '#E7D9C9', textAlign: 'center' }}>
      Section <strong>{sectionKey}</strong> is not yet configured.
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '60px' }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3E4930 0%, #222C1A 100%)',
        borderRadius: '16px', padding: '28px 32px',
        border: '1px solid #B8935B', boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1.5px', marginBottom: '6px', textTransform: 'uppercase' }}>
            {data?.page_name || '—'} › {config.label}
          </div>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '800', color: '#F6F1E3' }}>
            Edit: {config.label}
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#E7D9C9' }}>
            All changes are saved to MySQL and reflected on the live frontend.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowNewSectionModal(true)} style={{ padding: '10px 16px', borderRadius: '8px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            + Add New Section
          </button>
          <button onClick={handleDeleteSection} style={{ padding: '10px 14px', borderRadius: '8px', backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#EF4444', fontSize: '13px', cursor: 'pointer' }}>
            Delete Section
          </button>
          {saved && (
            <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: '600', padding: '8px 16px', borderRadius: '8px', backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Saved
            </span>
          )}
          <button onClick={fetchSection} style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg> Reload
          </button>
          <button onClick={handleSave} disabled={saving} style={{ padding: '10px 24px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '13px', fontWeight: '700', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, boxShadow: '0 4px 14px rgba(184,147,91,0.4)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: '10px', padding: '14px 20px', color: '#EF4444', fontSize: '13px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> {error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: '#E7D9C9', fontSize: '15px' }}>Loading section data...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>

          {/* LEFT: Text Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Content Fields</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {config.fields.filter(f => !['image_url', 'image_url_2'].includes(f)).map(field => (
                  <div key={field}>
                    <label style={labelStyle}>{FIELD_LABELS[field] || field}</label>
                    {field === 'body_content' ? (
                      <textarea
                        rows={5}
                        value={form[field] || ''}
                        onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                        style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                      />
                    ) : (
                      <input
                        type="text"
                        value={form[field] || ''}
                        onChange={e => {
                          setForm(prev => ({ ...prev, [field]: e.target.value }));
                        }}
                        style={inputStyle}
                        placeholder={`Enter ${FIELD_LABELS[field] || field}...`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Text Fields & Columns Section */}
            <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#F6F1E3' }}>
                  Custom Text Fields & Columns
                </h3>
                <button onClick={handleAddCustomField} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>
                  + Add Text Field / Column
                </button>
              </div>

              {customFields.length === 0 ? (
                <div style={{ color: '#B8A99A', fontSize: '13px', fontStyle: 'italic' }}>
                  No custom text fields or columns added yet. Click "+ Add Text Field / Column" above to add new fields to this section!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {customFields.map((cf, idx) => (
                    <div key={idx} style={{ backgroundColor: '#182012', padding: '14px', borderRadius: '10px', border: '1px solid rgba(184,147,91,0.2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label style={{ ...labelStyle, marginBottom: 0 }}>{cf.label || `Field ${idx + 1}`}</label>
                        <button onClick={() => handleRemoveCustomField(idx)} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#EF4444', borderRadius: '4px', padding: '4px 8px', fontSize: '11px', cursor: 'pointer' }}>
                          Remove Field
                        </button>
                      </div>
                      <input 
                        type="text" 
                        value={cf.value || ''} 
                        onChange={e => handleUpdateCustomField(idx, e.target.value)} 
                        style={inputStyle} 
                        placeholder={`Enter ${cf.label}...`} 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metadata / Dynamic Config Fields */}
            {config.metaKeys && config.metaKeys.length > 0 && (
              <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> Dynamic Data (Lists, FAQs, Links)</span>
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {config.metaKeys.map(mk => {
                    const rawVal = metaForm[mk.key];
                    const val = typeof rawVal === 'string' ? rawVal : (rawVal !== undefined && rawVal !== null ? JSON.stringify(rawVal, null, 2) : '');
                    const isEnabled = !val.startsWith('[DISABLED]');
                    const cleanVal = val.replace(/^\[DISABLED\]\s*/, '');

                    return (
                      <div key={mk.key} style={{
                        backgroundColor: '#182012',
                        borderRadius: '12px',
                        padding: '16px 20px',
                        border: isEnabled ? '1px solid rgba(184,147,91,0.35)' : '1px solid rgba(239,68,68,0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <label style={{ fontSize: '12px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.5px' }}>
                            {mk.label}
                          </label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {/* Active Toggle Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setMetaForm(prev => ({
                                  ...prev,
                                  [mk.key]: isEnabled ? `[DISABLED] ${cleanVal}` : cleanVal
                                }));
                              }}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                backgroundColor: '#3E4930',
                                border: '1px solid #B8935B',
                                color: '#F6F1E3',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              {isEnabled ? 'Deactivate' : 'Activate'}
                            </button>

                            {/* Edit Button */}
                            <button
                              type="button"
                              title="Edit"
                              onClick={() => {
                                const inputEl = document.getElementById(`meta_input_${mk.key}`);
                                if (inputEl) inputEl.focus();
                              }}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                backgroundColor: '#3E4930',
                                border: '1px solid #B8935B',
                                color: '#F6F1E3',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              title="Delete"
                              onClick={() => {
                                setMetaForm(prev => ({ ...prev, [mk.key]: '' }));
                              }}
                              style={{
                                padding: '7px 12px',
                                borderRadius: '6px',
                                backgroundColor: '#3E4930',
                                border: '1px solid #ef4444',
                                color: '#ef4444',
                                fontSize: '12px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.15s ease'
                              }}
                            >
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                            </button>
                          </div>
                        </div>

                        {mk.type === 'text' && (
                          <input
                            id={`meta_input_${mk.key}`}
                            type="text"
                            disabled={!isEnabled}
                            value={cleanVal}
                            onChange={e => setMetaForm(prev => ({
                              ...prev,
                              [mk.key]: isEnabled ? e.target.value : `[DISABLED] ${e.target.value}`
                            }))}
                            style={{
                              ...inputStyle,
                              opacity: isEnabled ? 1 : 0.5,
                              backgroundColor: '#12180E'
                            }}
                            placeholder={`Enter ${mk.label}...`}
                          />
                        )}
                        {mk.type === 'csv' && (
                          <input
                            id={`meta_input_${mk.key}`}
                            type="text"
                            disabled={!isEnabled}
                            value={cleanVal}
                            onChange={e => setMetaForm(prev => ({
                              ...prev,
                              [mk.key]: isEnabled ? e.target.value : `[DISABLED] ${e.target.value}`
                            }))}
                            style={{
                              ...inputStyle,
                              opacity: isEnabled ? 1 : 0.5,
                              backgroundColor: '#12180E'
                            }}
                            placeholder="Item 1, Item 2, Item 3 (comma separated)"
                          />
                        )}
                        {mk.type === 'array' && (
                          <ArrayEditor
                            items={Array.isArray(metaForm[mk.key]) ? metaForm[mk.key] : []}
                            subfields={mk.subfields}
                            onChange={rows => setMetaForm(prev => ({ ...prev, [mk.key]: rows }))}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Image Preview + URL Input */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Primary Image */}
            {config.fields.includes('image_url') && (
              <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Primary Image</span>
                </h3>
                <div style={{ marginBottom: '14px' }}>
                  {(imagePreview || form.image_url) ? (
                    <img
                      src={form.image_url || imagePreview}
                      alt="Primary"
                      onError={e => { e.target.src = 'https://placehold.co/600x400/222C1A/B8935B?text=No+Image'; }}
                      style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(184,147,91,0.3)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '200px', borderRadius: '10px', border: '2px dashed rgba(184,147,91,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '8px' }}>
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(184,147,91,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                      <span style={{ color: '#B8A99A', fontSize: '13px' }}>No image set</span>
                    </div>
                  )}
                </div>
                <label style={labelStyle}>Image URL</label>
                <input
                  type="text"
                  value={form.image_url || ''}
                  onChange={e => { setForm(prev => ({ ...prev, image_url: e.target.value })); setImagePreview(e.target.value); }}
                  style={inputStyle}
                  placeholder="/path/to/image.jpg or https://..."
                />
              </div>
            )}

            {/* Secondary Image */}
            {config.fields.includes('image_url_2') && (
              <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.3)' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.2)', paddingBottom: '12px' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> Secondary Image</span>
                </h3>
                <div style={{ marginBottom: '14px' }}>
                  {(imagePreview2 || form.image_url_2) ? (
                    <img
                      src={form.image_url_2 || imagePreview2}
                      alt="Secondary"
                      onError={e => { e.target.src = 'https://placehold.co/600x400/222C1A/B8935B?text=No+Image'; }}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', border: '1px solid rgba(184,147,91,0.3)' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '160px', borderRadius: '10px', border: '2px dashed rgba(184,147,91,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ color: '#B8A99A', fontSize: '13px' }}>No secondary image</span>
                    </div>
                  )}
                </div>
                <label style={labelStyle}>Secondary Image URL</label>
                <input
                  type="text"
                  value={form.image_url_2 || ''}
                  onChange={e => { setForm(prev => ({ ...prev, image_url_2: e.target.value })); setImagePreview2(e.target.value); }}
                  style={inputStyle}
                  placeholder="/path/to/image2.jpg or https://..."
                />
              </div>
            )}

            {/* Live Preview Card */}
            <div style={{ backgroundColor: '#182012', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.2)' }}>
              <h3 style={{ margin: '0 0 16px 0', fontSize: '15px', fontWeight: '700', color: '#F6F1E3', borderBottom: '1px solid rgba(184,147,91,0.1)', paddingBottom: '12px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B8935B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Content Preview</span>
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {form.badge_text && (
                  <span style={{ fontSize: '10px', fontWeight: '700', letterSpacing: '2px', color: '#B8935B', backgroundColor: 'rgba(184,147,91,0.1)', padding: '4px 10px', borderRadius: '4px', alignSelf: 'flex-start' }}>
                    {form.badge_text}
                  </span>
                )}
                {form.title && (
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#F6F1E3', lineHeight: 1.3 }}>
                    {form.title}
                  </div>
                )}
                {form.subtitle && (
                  <div style={{ fontSize: '14px', color: '#B8935B', fontWeight: '600' }}>
                    {form.subtitle}
                  </div>
                )}
                {form.body_content && (
                  <div style={{ fontSize: '12px', color: '#E7D9C9', lineHeight: 1.6, borderTop: '1px solid rgba(184,147,91,0.15)', paddingTop: '10px', marginTop: '4px' }}>
                    {form.body_content}
                  </div>
                )}
                {form.button_text && (
                  <div style={{ marginTop: '8px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', padding: '8px 16px', borderRadius: '6px', backgroundColor: '#B8935B', color: '#1A2010', display: 'inline-block' }}>
                      {form.button_text} →
                    </span>
                  </div>
                )}
                {!form.title && !form.subtitle && !form.body_content && (
                  <div style={{ color: '#B8A99A', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>
                    Fill in the fields on the left to see a live preview.
                  </div>
                )}
              </div>
            </div>

            {/* Last Updated */}
            {data?.updated_at && (
              <div style={{ fontSize: '12px', color: '#B8A99A', textAlign: 'right', padding: '4px 0' }}>
                Last saved: {new Date(data.updated_at).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Section Creation Modal */}
      {showNewSectionModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#222C1A', borderRadius: '16px', padding: '26px', width: '90%', maxWidth: '480px', border: '1px solid #B8935B' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>CMS MANAGEMENT</div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: '#F6F1E3' }}>Add New Site Section</h3>
              </div>
              <button onClick={() => setShowNewSectionModal(false)} style={{ background: 'none', border: 'none', color: '#E7D9C9', cursor: 'pointer', fontSize: '18px' }}>✕</button>
            </div>

            <form onSubmit={handleCreateNewSection} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Section Display Title *</label>
                <input 
                  required 
                  value={newSectionForm.title} 
                  onChange={e => setNewSectionForm(p => ({ ...p, title: e.target.value }))} 
                  style={inputStyle} 
                  placeholder="e.g. Home Special Deals Banner" 
                />
              </div>

              <div>
                <label style={labelStyle}>Section Identifier Key *</label>
                <input 
                  required 
                  value={newSectionForm.key} 
                  onChange={e => setNewSectionForm(p => ({ ...p, key: e.target.value }))} 
                  style={inputStyle} 
                  placeholder="e.g. home_special_deals" 
                />
                <span style={{ fontSize: '11px', color: '#B8A99A', marginTop: '4px', display: 'block' }}>Unique slug key in lowercase (e.g. home_promo_strip)</span>
              </div>

              <div>
                <label style={labelStyle}>Subtitle / Description</label>
                <input 
                  value={newSectionForm.subtitle} 
                  onChange={e => setNewSectionForm(p => ({ ...p, subtitle: e.target.value }))} 
                  style={inputStyle} 
                  placeholder="Optional section description..." 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px', paddingTop: '14px', borderTop: '1px solid rgba(184,147,91,0.2)' }}>
                <button type="button" onClick={() => setShowNewSectionModal(false)} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#3E4930', border: '1px solid #B8935B', color: '#F6F1E3', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '8px 18px', borderRadius: '6px', backgroundColor: '#B8935B', border: 'none', color: '#1A2010', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Create & Edit Section</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionEditorPage;
