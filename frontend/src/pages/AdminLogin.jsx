import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function AdminLogin() {
  const { token, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    // Already logged in — jump straight to the admin app on port 5174
    window.location.href = "http://localhost:5174/dashboard";
    return null;
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
      // Redirect to the admin app running on port 5174
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
      padding: '30px 16px',
      boxSizing: 'border-box',
      fontFamily: "'Jost', system-ui, -apple-system, sans-serif"
    }}>
      {/* Main Container Card */}
      <div style={{
        width: '100%',
        maxWidth: '960px',
        backgroundColor: '#3E4930',
        borderRadius: '24px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(62, 73, 48, 0.25)',
        border: '1px solid rgba(184, 147, 91, 0.3)',
        display: 'flex',
        flexWrap: 'wrap'
      }}>

        {/* Left Branding Panel */}
        <div style={{
          flex: '1 1 380px',
          padding: '48px 40px',
          background: 'linear-gradient(135deg, #3E4930 0%, #2A3320 100%)',
          color: '#F6F1E3',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          borderRight: '1px solid rgba(184, 147, 91, 0.2)',
          boxSizing: 'border-box'
        }}>
          {/* Logo */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: '44px',
              fontWeight: '400',
              color: '#F6F1E3',
              margin: '0',
              lineHeight: '1'
            }}>
              Laila
            </h1>
            <span style={{
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '4px',
              color: '#B8935B',
              marginTop: '6px',
              display: 'block'
            }}>
              H I J A B S
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Fraunces', serif",
            fontSize: '28px',
            fontWeight: '600',
            color: '#F6F1E3',
            lineHeight: '1.25',
            margin: '0 0 16px 0'
          }}>
            Administrator<br />
            <span style={{ color: '#B8935B' }}>Control Panel</span>
          </h2>

          <p style={{
            fontSize: '13px',
            lineHeight: '1.6',
            color: 'rgba(231, 217, 201, 0.85)',
            margin: '0 0 32px 0'
          }}>
            Manage inventory catalog, monitor customer order fulfillment, and publish store updates from one elegant dashboard.
          </p>

          {/* Direct Admin Server Link Option */}
          <div style={{
            padding: '14px 16px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(184, 147, 91, 0.2)',
            fontSize: '12px',
            color: '#E7D9C9'
          }}>
            <div style={{ fontWeight: '600', color: '#B8935B', marginBottom: '4px' }}>⚡ Direct Portal Access</div>
            <span>Standalone Admin app runs at <a href="http://localhost:5174" target="_blank" rel="noreferrer" style={{ color: '#B8935B', textDecoration: 'underline' }}>http://localhost:5174</a></span>
          </div>
        </div>

        {/* Right Form Panel */}
        <div style={{
          flex: '1 1 360px',
          backgroundColor: '#F6F1E3',
          padding: '44px 36px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          <div style={{
            backgroundColor: '#E7D9C9',
            padding: '32px 28px',
            borderRadius: '16px',
            border: '1px solid rgba(184, 147, 91, 0.4)',
            boxShadow: '0 10px 30px rgba(62, 73, 48, 0.08)'
          }}>
            <h3 style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#3E4930',
              margin: '0 0 6px 0',
              fontFamily: "'Fraunces', serif"
            }}>
              Admin Sign In
            </h3>
            <p style={{
              fontSize: '12px',
              color: 'rgba(62, 73, 48, 0.75)',
              margin: '0 0 24px 0'
            }}>
              Sign in to continue to your admin dashboard.
            </p>

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
                    height: '44px',
                    borderRadius: '10px',
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  value={form.password}
                  onChange={onChange}
                  style={{
                    width: '100%',
                    height: '44px',
                    borderRadius: '10px',
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
                  borderRadius: '10px',
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
                  height: '46px',
                  borderRadius: '10px',
                  backgroundColor: '#3E4930',
                  color: '#F6F1E3',
                  fontSize: '13px',
                  fontWeight: '700',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  marginTop: '8px',
                  boxShadow: '0 6px 16px rgba(62, 73, 48, 0.2)',
                  transition: 'all 0.2s ease'
                }}
              >
                {submitting ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div style={{
              marginTop: '18px',
              backgroundColor: '#F6F1E3',
              border: '1px dashed #B8935B',
              borderRadius: '10px',
              padding: '10px 12px',
              textAlign: 'center',
              fontSize: '11px',
              color: '#3E4930'
            }}>
              <strong>Demo Login:</strong> admin@lailahijabs.com / admin123
            </div>

            <p style={{
              marginTop: '14px',
              textAlign: 'center',
              fontSize: '11px',
              color: 'rgba(62, 73, 48, 0.65)'
            }}>
              Protected access for authorized staff.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}