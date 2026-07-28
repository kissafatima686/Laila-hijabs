import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  if (token || localStorage.getItem('adminToken') || localStorage.getItem('token')) {
    return <Navigate to={redirectTo} replace />;
  }

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await login(form.email, form.password);
      
      // Replace React Router's navigate() with a full browser jump to your admin server port:
      window.location.href = "http://localhost:5174/dashboard"; 
      
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Invalid email or password";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F6F1E3',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      boxSizing: 'border-box'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: '#E7D9C9',
        border: '1px solid rgba(184, 147, 91, 0.4)',
        borderRadius: '16px',
        padding: '36px 32px',
        boxShadow: '0 14px 48px rgba(62, 73, 48, 0.15)',
        boxSizing: 'border-box'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            backgroundColor: '#3E4930',
            color: '#B8935B',
            fontSize: '22px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            fontFamily: 'serif'
          }}>
            LH
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#3E4930',
            margin: '0 0 4px 0',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            Laila Hijabs
          </h1>
          <p style={{
            fontSize: '11px',
            fontWeight: '700',
            color: '#B8935B',
            letterSpacing: '3px',
            margin: 0,
            textTransform: 'uppercase'
          }}>
            Admin Sign In
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#3E4930'
            }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="admin@lailahijabs.com"
              autoComplete="email"
              required
              value={form.email}
              onChange={onChange}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '8px',
                border: '1px solid rgba(184, 147, 91, 0.6)',
                backgroundColor: '#F6F1E3',
                padding: '0 14px',
                fontSize: '14px',
                color: '#3E4930',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{
              fontSize: '11px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#3E4930'
            }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={onChange}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '8px',
                border: '1px solid rgba(184, 147, 91, 0.6)',
                backgroundColor: '#F6F1E3',
                padding: '0 14px',
                fontSize: '14px',
                color: '#3E4930',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error ? (
            <div style={{
              backgroundColor: 'rgba(217, 83, 79, 0.12)',
              border: '1px solid rgba(217, 83, 79, 0.3)',
              borderRadius: '8px',
              padding: '10px',
              color: '#D9534F',
              fontSize: '12px',
              fontWeight: '600',
              textAlign: 'center'
            }}>
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              height: '48px',
              borderRadius: '8px',
              backgroundColor: '#3E4930',
              color: '#F6F1E3',
              fontSize: '13px',
              fontWeight: 'bold',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              border: 'none',
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background 0.2s ease'
            }}
          >
            {submitting ? "Logging in..." : "LOG IN AS ADMIN"}
          </button>
        </form>

        {/* Demo Helper Box */}
        <div style={{
          marginTop: '20px',
          backgroundColor: '#F6F1E3',
          border: '1px dashed #B8935B',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
          fontSize: '12px',
          color: '#3E4930'
        }}>
          <strong>Demo Login:</strong> admin@lailahijabs.com / admin123
        </div>

        <p style={{
          marginTop: '16px',
          textAlign: 'center',
          fontSize: '11px',
          color: 'rgba(62, 73, 48, 0.6)',
          margin: '16px 0 0 0'
        }}>
          Protected access for authorized Laila Hijabs staff.
        </p>
      </div>
    </div>
  );
}