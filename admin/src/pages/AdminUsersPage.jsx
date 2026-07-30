import React, { useState, useEffect } from 'react';

const API = 'http://localhost:5000/api/admin';

// ─── Styles ───────────────────────────────────────────────────────────────────
const iStyle = {
  width: '100%', padding: '11px 14px', borderRadius: '8px',
  backgroundColor: '#0F1A0A', border: '1px solid rgba(184,147,91,0.4)',
  color: '#F6F1E3', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s'
};
const lStyle = {
  fontSize: '12px', fontWeight: '600', color: '#D8CFC4',
  display: 'block', marginBottom: '6px'
};
const cardStyle = { backgroundColor: '#1C2616', borderRadius: '16px', padding: '24px', border: '1px solid rgba(184,147,91,0.25)' };
const btnPrimary = { padding: '10px 22px', borderRadius: '8px', backgroundColor: '#B8935B', border: 'none', color: '#0F1A0A', fontSize: '13px', fontWeight: '700', cursor: 'pointer' };
const btnGhost = { padding: '8px 14px', borderRadius: '6px', backgroundColor: '#2A3520', border: '1px solid rgba(184,147,91,0.4)', color: '#E7D9C9', fontSize: '12px', cursor: 'pointer' };
const btnDanger = { padding: '7px 12px', borderRadius: '6px', backgroundColor: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', color: '#EF4444', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' };

const EMPTY_FORM = {
  full_name: '', email: '', password_hash: '', designation: '',
  phone: '', location: '', role: 'editor', status: 'Active', avatar_url: '',
  perm_add: false, perm_edit: false, perm_delete: false, perm_publish: false
};

const EditIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /></svg>;

// ─── Permission Checkbox ───────────────────────────────────────────────────────
const PermCheck = ({ label, checked, onChange }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '9px', cursor: 'pointer', fontSize: '13px', color: '#D8CFC4', userSelect: 'none' }}>
    <div
      onClick={onChange}
      style={{
        width: '17px', height: '17px', borderRadius: '4px', flexShrink: 0,
        border: `2px solid ${checked ? '#B8935B' : 'rgba(184,147,91,0.4)'}`,
        backgroundColor: checked ? '#B8935B' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', transition: 'all 0.15s'
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#0F1A0A" strokeWidth="3.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      )}
    </div>
    {label}
  </label>
);

// ─── Role Badge ───────────────────────────────────────────────────────────────
const RoleBadge = ({ role }) => {
  const cfg = {
    super_admin: { label: 'Super Admin', color: '#B8935B', bg: 'rgba(184,147,91,0.15)', border: 'rgba(184,147,91,0.4)' },
    editor: { label: 'Editor', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
    viewer: { label: 'Viewer', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
  }[role] || { label: role, color: '#B8A99A', bg: 'rgba(184,147,91,0.08)', border: 'rgba(184,147,91,0.2)' };
  return (
    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '10px', fontWeight: '700', color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {cfg.label}
    </span>
  );
};

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
const UserModal = ({ editUser, onClose, onSaved }) => {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editUser) {
      setForm({
        full_name: editUser.full_name || '',
        email: editUser.email || '',
        password_hash: '',
        designation: editUser.designation || '',
        phone: editUser.phone || '',
        location: editUser.location || '',
        role: editUser.role || 'editor',
        status: editUser.status || 'Active',
        avatar_url: editUser.avatar_url || '',
        perm_add: !!(editUser.permissions?.includes('add')),
        perm_edit: !!(editUser.permissions?.includes('edit')),
        perm_delete: !!(editUser.permissions?.includes('delete')),
        perm_publish: !!(editUser.permissions?.includes('publish')),
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editUser]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!editUser && !form.password_hash.trim()) e.password_hash = 'Required for new users';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);

    const perms = [];
    if (form.perm_add) perms.push('add');
    if (form.perm_edit) perms.push('edit');
    if (form.perm_delete) perms.push('delete');
    if (form.perm_publish) perms.push('publish');

    const payload = {
      full_name: form.full_name,
      email: form.email,
      designation: form.designation,
      phone: form.phone,
      location: form.location,
      role: form.role,
      status: form.status,
      avatar_url: form.avatar_url,
      permissions: perms.join(','),
    };
    if (form.password_hash) payload.password_hash = form.password_hash;

    const id = editUser?.admin_id;
    fetch(id ? `${API}/module/admin-users/${id}` : `${API}/module/admin-users`, {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(() => { onSaved(); onClose(); }).finally(() => setSaving(false));
  };

  const Field = ({ label, children, err }) => (
    <div>
      <label style={lStyle}>{label}</label>
      {children}
      {err && <div style={{ fontSize: '11px', color: '#EF4444', marginTop: '4px' }}>{err}</div>}
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#141F0E', borderRadius: '16px', width: '100%', maxWidth: '540px', border: '1px solid rgba(184,147,91,0.4)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)', maxHeight: '92vh', display: 'flex', flexDirection: 'column' }}>

        {/* Modal Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid rgba(184,147,91,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>{editUser ? 'Edit User' : 'Add User'}</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#B8A99A' }}>
              {editUser ? 'Update account details and permissions.' : 'Create a new account and assign its role permissions.'}
            </p>
          </div>
          <button onClick={onClose} style={{ padding: '6px 14px', borderRadius: '6px', backgroundColor: '#2A3520', border: '1px solid rgba(184,147,91,0.3)', color: '#D8CFC4', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
            Close
          </button>
        </div>

        {/* Modal Body — Scrollable */}
        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Full Name */}
          <Field label="Full Name" err={errors.full_name}>
            <input
              value={form.full_name}
              onChange={e => set('full_name', e.target.value)}
              placeholder="Jane Doe"
              style={{ ...iStyle, borderColor: errors.full_name ? '#EF4444' : 'rgba(184,147,91,0.4)' }}
            />
          </Field>

          {/* Email */}
          <Field label="Email" err={errors.email}>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="admin@lailahijabs.com"
              style={{ ...iStyle, borderColor: errors.email ? '#EF4444' : 'rgba(184,147,91,0.4)' }}
            />
          </Field>

          {/* Designation + Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Designation">
              <input value={form.designation} onChange={e => set('designation', e.target.value)} placeholder="Senior Editor" style={iStyle} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+92 300 1234567" style={iStyle} />
            </Field>
          </div>

          {/* Location */}
          <Field label="Location">
            <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="Lahore, Pakistan" style={iStyle} />
          </Field>

          {/* Password */}
          <Field label="Password" err={errors.password_hash}>
            <input
              type="password"
              value={form.password_hash}
              onChange={e => set('password_hash', e.target.value)}
              placeholder={editUser ? 'Leave blank to keep current password' : '••••••••••••••••••••'}
              style={{ ...iStyle, letterSpacing: form.password_hash ? '3px' : 'normal', borderColor: errors.password_hash ? '#EF4444' : 'rgba(184,147,91,0.4)' }}
            />
          </Field>

          {/* Role + Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <Field label="Role">
              <select value={form.role} onChange={e => set('role', e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="super_admin">Super Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e => set('status', e.target.value)} style={{ ...iStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </Field>
          </div>

          {/* Avatar URL */}
          <Field label="Avatar Image URL (optional)">
            <input value={form.avatar_url} onChange={e => set('avatar_url', e.target.value)} placeholder="https://..." style={iStyle} />
          </Field>

          {/* Permissions */}
          <div>
            <label style={lStyle}>Permissions</label>
            <div style={{ padding: '16px', borderRadius: '10px', border: '1px solid rgba(184,147,91,0.25)', backgroundColor: '#0F1A0A', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <PermCheck label="Add Data" checked={form.perm_add} onChange={() => set('perm_add', !form.perm_add)} />
              <PermCheck label="Edit Data" checked={form.perm_edit} onChange={() => set('perm_edit', !form.perm_edit)} />
              <PermCheck label="Delete Data" checked={form.perm_delete} onChange={() => set('perm_delete', !form.perm_delete)} />
              <PermCheck label="Publish / Active" checked={form.perm_publish} onChange={() => set('perm_publish', !form.perm_publish)} />
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '6px', borderTop: '1px solid rgba(184,147,91,0.12)', marginTop: '4px' }}>
            <button type="button" onClick={onClose} style={btnGhost}>Cancel</button>
            <button type="submit" disabled={saving} style={{ ...btnPrimary, opacity: saving ? 0.7 : 1, minWidth: '80px' }}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('All');

  const fetch_ = () => {
    setLoading(true);
    fetch(`${API}/module/admin-users`).then(r => r.json()).then(d => setUsers(Array.isArray(d) ? d : [])).catch(() => setUsers([])).finally(() => setLoading(false));
  };
  useEffect(() => { fetch_(); }, []);

  const openAdd = () => { setEditUser(null); setShowModal(true); };
  const openEdit = (u) => { setEditUser(u); setShowModal(true); };

  const handleDelete = (id) => {
    if (!window.confirm('Permanently delete this admin user?')) return;
    fetch(`${API}/module/admin-users/${id}`, { method: 'DELETE' }).then(fetch_);
  };
  const handleToggleStatus = (u) => {
    const next = (u.status === 'Active' || u.status === 'Live') ? 'Inactive' : 'Active';
    fetch(`${API}/module/admin-users/${u.admin_id}/status`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: next }) }).then(fetch_);
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    const match = (u.full_name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.designation || '').toLowerCase().includes(q);
    const roleMatch = filterRole === 'All' || u.role === filterRole;
    return match && roleMatch;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', paddingBottom: '40px' }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #3E4930 0%, #1C2616 100%)', borderRadius: '16px', padding: '26px 28px', border: '1px solid #B8935B', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#B8935B', fontWeight: '700', letterSpacing: '2px', marginBottom: '5px' }}>MAIN</div>
          <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '800', color: '#F6F1E3' }}>Admin Users</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#E7D9C9' }}>Manage staff accounts, roles, and permissions for this admin panel.</p>
        </div>
        <button onClick={openAdd} style={{ ...btnPrimary, display: 'flex', alignItems: 'center', gap: '7px', fontSize: '13px', padding: '11px 22px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Add User
        </button>
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text" placeholder="Search by name, email, or designation..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...{ width: '300px', padding: '10px 14px', borderRadius: '8px', backgroundColor: '#1C2616', border: '1px solid rgba(184,147,91,0.4)', color: '#F6F1E3', fontSize: '13px', outline: 'none' } }}
        />
        {['All', 'super_admin', 'editor', 'viewer'].map(r => (
          <button key={r} onClick={() => setFilterRole(r)} style={{ padding: '8px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', border: filterRole === r ? '1px solid #B8935B' : '1px solid rgba(184,147,91,0.25)', backgroundColor: filterRole === r ? '#B8935B' : 'transparent', color: filterRole === r ? '#0F1A0A' : '#E7D9C9', transition: 'all 0.15s' }}>
            {r === 'All' ? 'All Roles' : r === 'super_admin' ? 'Super Admin' : r.charAt(0).toUpperCase() + r.slice(1)}
          </button>
        ))}
        <span style={{ fontSize: '12px', color: '#B8A99A', marginLeft: 'auto' }}>{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Users Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#E7D9C9' }}>Loading admin users...</div>
      ) : filtered.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '50px' }}>
          <div style={{ fontSize: '13px', color: '#B8A99A', marginBottom: '14px' }}>No admin users found.</div>
          <button onClick={openAdd} style={btnPrimary}>+ Add First Admin User</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '16px' }}>
          {filtered.map(u => {
            const isActive = u.status === 'Active';
            const perms = (u.permissions || '').split(',').filter(Boolean);
            return (
              <div key={u.admin_id} style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: '14px', transition: 'border-color 0.2s', backgroundColor: '#1C2616' }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(184,147,91,0.5)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(184,147,91,0.25)'}
              >
                {/* User Top Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', backgroundColor: '#3E4930', border: '2px solid #B8935B', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {u.avatar_url ? (
                      <img src={u.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#F6F1E3' }}>{(u.full_name || '?')[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#F6F1E3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name}</div>
                    <div style={{ fontSize: '11px', color: '#B8A99A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                    {u.designation && <div style={{ fontSize: '11px', color: '#B8935B', marginTop: '1px' }}>{u.designation}</div>}
                  </div>
                  <span style={{ fontSize: '11px', padding: '3px 9px', borderRadius: '10px', fontWeight: '700', color: isActive ? '#22c55e' : '#EF4444', backgroundColor: isActive ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`, flexShrink: 0 }}>
                    {u.status || 'Active'}
                  </span>
                </div>

                {/* Meta Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {u.phone && <div style={{ fontSize: '12px', color: '#B8A99A', display: 'flex', gap: '6px' }}><span style={{ color: '#B8935B', fontWeight: '600' }}>Phone:</span>{u.phone}</div>}
                  {u.location && <div style={{ fontSize: '12px', color: '#B8A99A', display: 'flex', gap: '6px' }}><span style={{ color: '#B8935B', fontWeight: '600' }}>Location:</span>{u.location}</div>}
                </div>

                {/* Role + Permissions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
                  <RoleBadge role={u.role} />
                  {perms.map(p => (
                    <span key={p} style={{ fontSize: '10px', padding: '2px 7px', borderRadius: '6px', fontWeight: '600', color: '#B8935B', backgroundColor: 'rgba(184,147,91,0.1)', border: '1px solid rgba(184,147,91,0.25)' }}>
                      {p}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '7px', paddingTop: '10px', borderTop: '1px solid rgba(184,147,91,0.12)' }}>
                  <button onClick={() => handleToggleStatus(u)} style={{ ...btnGhost, flex: 1, fontSize: '11px', textAlign: 'center' }}>
                    {isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => openEdit(u)} style={{ ...btnGhost, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                    <EditIcon /> Edit
                  </button>
                  <button onClick={() => handleDelete(u.admin_id)} style={btnDanger} title="Delete user">
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <UserModal
          editUser={editUser}
          onClose={() => setShowModal(false)}
          onSaved={fetch_}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;
