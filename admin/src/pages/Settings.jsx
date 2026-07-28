import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'Laila Hijabs',
    currency: 'PKR (Rs.)',
    contactEmail: 'admin@swiftsignbm.com',
    supportPhone: '+92 300 1234567',
    orderNotifications: true,
    autoApproveReviews: false
  });

  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px', maxWidth: '800px' }}>
      
      {/* Header */}
      <div style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        padding: '24px 32px',
        border: '1px solid #B8935B'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#F6F1E3', margin: '0 0 6px 0' }}>
          Admin Settings & Preferences
        </h2>
        <p style={{ fontSize: '13px', color: '#E7D9C9', margin: 0 }}>
          Manage global store settings, notification webhooks, and administrative parameters.
        </p>
      </div>

      {savedToast && (
        <div style={{
          backgroundColor: '#3E4930',
          border: '1px solid #B8935B',
          color: '#F6F1E3',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '700'
        }}>
          Settings saved successfully!
        </div>
      )}

      {/* Settings Form */}
      <form onSubmit={handleSave} style={{
        backgroundColor: '#222C1A',
        borderRadius: '16px',
        padding: '32px',
        border: '1px solid rgba(184, 147, 91, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '600', color: '#E7D9C9', display: 'block', marginBottom: '6px' }}>
            Store Name
          </label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: '8px',
              backgroundColor: '#182012', border: '1px solid #B8935B',
              color: '#F6F1E3', fontSize: '14px', outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#E7D9C9', display: 'block', marginBottom: '6px' }}>
              Support Email
            </label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                backgroundColor: '#182012', border: '1px solid #B8935B',
                color: '#F6F1E3', fontSize: '14px', outline: 'none'
              }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', fontWeight: '600', color: '#E7D9C9', display: 'block', marginBottom: '6px' }}>
              Support Phone
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: '8px',
                backgroundColor: '#182012', border: '1px solid #B8935B',
                color: '#F6F1E3', fontSize: '14px', outline: 'none'
              }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F6F1E3', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.orderNotifications}
              onChange={(e) => setSettings({ ...settings, orderNotifications: e.target.checked })}
            />
            Enable instant email alerts for new customer orders
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#F6F1E3', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.autoApproveReviews}
              onChange={(e) => setSettings({ ...settings, autoApproveReviews: e.target.checked })}
            />
            Auto-publish verified customer reviews
          </label>
        </div>

        <button
          type="submit"
          style={{
            marginTop: '12px',
            alignSelf: 'flex-start',
            padding: '12px 24px',
            borderRadius: '8px',
            backgroundColor: '#B8935B',
            border: 'none',
            color: '#3E4930',
            fontSize: '13px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(184, 147, 91, 0.3)'
          }}
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;
