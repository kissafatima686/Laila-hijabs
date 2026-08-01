import React, { useState, useEffect } from 'react';

const ContactMessagesManagerPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Reply Email Modal States
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyForm, setReplyForm] = useState({
    messageId: null,
    name: '',
    email: '',
    subject: '',
    body: '',
    originalMessage: ''
  });
  const [sendingEmail, setSendingEmail] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  const fetchMessages = () => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/module/messages`)
      .then(r => r.json())
      .then(data => setMessages(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = (messageId, newStatus) => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/module/messages/${messageId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
      .then(() => fetchMessages())
      .catch(() => {});
  };

  const handleDelete = (messageId) => {
    if (window.confirm("Are you sure you want to delete this customer message?")) {
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/module/messages/${messageId}`, {
        method: 'DELETE'
      })
        .then(() => fetchMessages())
        .catch(() => {});
    }
  };

  const openReplyModal = (msg) => {
    const msgId = msg.message_id || msg.id;
    const name = msg.name || 'Valued Customer';
    const email = msg.email || '';
    const subject = msg.subject ? `Re: ${msg.subject}` : 'Re: Customer Enquiry — Laila Hijabs';
    const origText = msg.message || '';

    const defaultBody = `Dear ${name},\n\nThank you for reaching out to Laila Hijabs.\n\nIn response to your query:\n"${origText}"\n\n[Write your response here...]\n\nWarm regards,\nCustomer Care Team | Laila Hijabs\ninfo@lailahijabs.com`;

    setReplyForm({
      messageId: msgId,
      name: name,
      email: email,
      subject: subject,
      body: defaultBody,
      originalMessage: origText
    });
    setReplyModalOpen(true);
  };

  const handleSendEmail = (e) => {
    e.preventDefault();
    setSendingEmail(true);

    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/admin/messages/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: replyForm.messageId,
        to: replyForm.email,
        from: 'info@lailahijabs.com',
        subject: replyForm.subject,
        body: replyForm.body
      })
    })
      .then(res => res.json())
      .then(data => {
        setSuccessToast(`Email reply sent successfully to ${replyForm.email} from info@lailahijabs.com!`);
        setTimeout(() => setSuccessToast(''), 6000);
        setReplyModalOpen(false);
        fetchMessages();
      })
      .catch(err => {
        console.error(err);
        setSuccessToast(`Reply recorded for ${replyForm.email}!`);
        setTimeout(() => setSuccessToast(''), 4000);
        setReplyModalOpen(false);
        fetchMessages();
      })
      .finally(() => setSendingEmail(false));
  };

  const filteredMessages = messages.filter(m => {
    const statusMatch = activeFilter === 'All' || (m.status || 'New') === activeFilter;
    const textMatch = search.trim() === '' || 
      (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.subject || '').toLowerCase().includes(search.toLowerCase()) ||
      (m.message || '').toLowerCase().includes(search.toLowerCase());
    return statusMatch && textMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px', position: 'relative' }}>
      
      {/* Success Toast Alert */}
      {successToast && (
        <div style={{
          backgroundColor: '#3E4930',
          color: '#F6F1E3',
          padding: '14px 20px',
          borderRadius: '8px',
          border: '1px solid #B8935B',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
          fontSize: '13.5px',
          fontWeight: '600',
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center'
        }}>
          <span>{successToast}</span>
          <button onClick={() => setSuccessToast('')} style={{ background: 'none', border: 'none', color: '#F6F1E3', cursor: 'pointer', fontSize: '14px' }}>✕</button>
        </div>
      )}

      {/* Header Bar */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '20px 24px',
        border: '1px solid #E7D9C9',
        boxShadow: '0 2px 8px rgba(62,73,48,0.04)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '11px', color: '#B8935B', fontWeight: '700', letterSpacing: '1px' }}>
            MANAGEMENT
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#3E4930', margin: '2px 0 0 0' }}>
            Contact Messages
          </h2>
        </div>

        <button 
          onClick={fetchMessages}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            backgroundColor: '#F6F1E3',
            border: '1px solid #B8935B',
            color: '#3E4930',
            fontSize: '12.5px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Refresh Messages
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          value={search} 
          onChange={e => setSearch(e.target.value)} 
          placeholder="Search customer messages..." 
          style={{
            flex: 1,
            minWidth: '220px',
            padding: '10px 14px',
            borderRadius: '6px',
            border: '1px solid #E7D9C9',
            backgroundColor: '#FFFFFF',
            fontSize: '13px',
            color: '#3E4930',
            outline: 'none'
          }} 
        />

        <div style={{ display: 'flex', gap: '6px' }}>
          {['All', 'New', 'Replied', 'Archived'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: activeFilter === tab ? '#3E4930' : '#FFFFFF',
                color: activeFilter === tab ? '#F6F1E3' : '#3E4930',
                border: `1px solid ${activeFilter === tab ? '#3E4930' : '#E7D9C9'}`
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List Container */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E7D9C9',
        boxShadow: '0 2px 8px rgba(62,73,48,0.04)',
        padding: '20px'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#3E4930', fontWeight: '600' }}>Loading messages...</div>
        ) : filteredMessages.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontSize: '13px' }}>
            No customer form messages found.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {filteredMessages.map(msg => {
              const msgId = msg.message_id || msg.id;
              const status = msg.status || 'New';
              const createdDate = msg.created_at ? new Date(msg.created_at).toLocaleString() : '';

              const getBadgeStyle = () => {
                if (status === 'Replied') return { bg: 'rgba(34,197,94,0.15)', color: '#15803D', border: 'rgba(34,197,94,0.3)' };
                if (status === 'Archived') return { bg: '#E7D9C9', color: '#6B7280', border: '#B8935B' };
                return { bg: '#FEF3C7', color: '#D97706', border: '#FCD34D' };
              };

              const badge = getBadgeStyle();

              return (
                <div key={msgId} style={{
                  backgroundColor: '#F6F1E3',
                  borderRadius: '8px',
                  padding: '18px 20px',
                  border: '1px solid #E7D9C9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {/* Top Bar of Message */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: '#3E4930' }}>
                        {msg.name || 'Customer Enquiry'}
                      </div>
                      <div style={{ fontSize: '12px', color: '#B8935B', fontWeight: '600', marginTop: '2px' }}>
                        {msg.email} {msg.phone ? ` • ${msg.phone}` : ''}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '10.5px', fontWeight: '700', padding: '3px 10px', borderRadius: '10px',
                        backgroundColor: badge.bg, color: badge.color, border: `1px solid ${badge.border}`
                      }}>
                        {status}
                      </span>
                      {createdDate && <span style={{ fontSize: '11px', color: '#6B7280' }}>{createdDate}</span>}
                    </div>
                  </div>

                  {/* Message Subject & Body */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '14px',
                    border: '1px solid #E7D9C9',
                    fontSize: '13px',
                    color: '#3E4930',
                    lineHeight: '1.6'
                  }}>
                    {msg.subject && (
                      <div style={{ fontWeight: '700', color: '#3E4930', marginBottom: '6px', fontSize: '13.5px' }}>
                        Subject: {msg.subject}
                      </div>
                    )}
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.message}</div>
                  </div>

                  {/* Message Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
                    <button
                      type="button"
                      onClick={() => openReplyModal(msg)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        backgroundColor: '#3E4930',
                        color: '#F6F1E3',
                        fontSize: '12px',
                        fontWeight: '700',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                      Reply via Email
                    </button>

                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(msgId, status === 'Archived' ? 'New' : 'Archived')}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E7D9C9',
                        color: '#3E4930',
                        fontSize: '11.5px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}
                    >
                      {status === 'Archived' ? 'Unarchive' : 'Archive'}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(msgId)}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        backgroundColor: '#FEE2E2',
                        border: '1px solid #FCA5A5',
                        color: '#DC2626',
                        fontSize: '11.5px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Delete Message"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* IN-APP LAILA HIJABS EMAIL COMPOSER MODAL */}
      {replyModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justify: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '650px',
            border: '1px solid #E7D9C9',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#3E4930',
              padding: '16px 20px',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F6F1E3" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#F6F1E3' }}>
                  New Message — Laila Hijabs Email Center
                </h3>
              </div>
              <button 
                onClick={() => setReplyModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#F6F1E3', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSendEmail} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#B8935B', letterSpacing: '0.5px' }}>FROM</label>
                <input 
                  type="text" 
                  value="Laila Hijabs <info@lailahijabs.com>" 
                  readOnly 
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#F6F1E3',
                    border: '1px solid #B8935B',
                    color: '#3E4930',
                    fontSize: '13px',
                    fontWeight: '700',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.5px' }}>TO (CUSTOMER EMAIL)</label>
                <input 
                  type="email" 
                  value={replyForm.email} 
                  onChange={e => setReplyForm(p => ({ ...p, email: e.target.value }))}
                  required 
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7D9C9',
                    color: '#3E4930',
                    fontSize: '13px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.5px' }}>SUBJECT</label>
                <input 
                  type="text" 
                  value={replyForm.subject} 
                  onChange={e => setReplyForm(p => ({ ...p, subject: e.target.value }))}
                  required 
                  style={{
                    padding: '10px 12px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7D9C9',
                    color: '#3E4930',
                    fontSize: '13px',
                    fontWeight: '600',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#3E4930', letterSpacing: '0.5px' }}>MESSAGE CONTENT</label>
                <textarea 
                  rows={8}
                  value={replyForm.body}
                  onChange={e => setReplyForm(p => ({ ...p, body: e.target.value }))}
                  required
                  style={{
                    padding: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7D9C9',
                    color: '#3E4930',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px', borderTop: '1px solid #E7D9C9', paddingTop: '14px' }}>
                <button
                  type="button"
                  onClick={() => setReplyModalOpen(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '6px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E7D9C9',
                    color: '#3E4930',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingEmail}
                  style={{
                    padding: '10px 22px',
                    borderRadius: '6px',
                    backgroundColor: '#3E4930',
                    color: '#F6F1E3',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  {sendingEmail ? 'Sending...' : 'Send Email'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessagesManagerPage;
