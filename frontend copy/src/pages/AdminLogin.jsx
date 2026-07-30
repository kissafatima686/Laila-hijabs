import { useState } from "react";
import { useAuth } from "../context/useAuth";

export default function AdminLogin() {
  const { token, login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    // Already logged in — jump straight to the admin app
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
      // Redirect to the admin app (runs on its own dev server / port)
      window.location.href = "http://localhost:5174/dashboard";
    } catch (err) {
      const message = err?.response?.data?.message || err?.message || "Invalid email or password";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F1E3] px-4 py-10 font-sans text-[#3E4930]">
      {/* Background Soft Glow Accents */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(184,147,91,0.12),transparent_44%),radial-gradient(circle_at_82%_24%,rgba(62,73,48,0.08),transparent_42%)]" />

      {/* Main Container Card */}
      <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-[#B8935B]/30 bg-[#3E4930] shadow-[0_30px_120px_rgba(62,73,48,0.25)] backdrop-blur-xl">
        <div className="grid min-h-[580px] lg:grid-cols-[1.1fr_0.9fr]">
          
          {/* Left Branding Panel */}
          <section className="relative hidden flex-col justify-center border-r border-[#B8935B]/20 p-12 lg:flex bg-gradient-to-br from-[#3E4930] to-[#2c3322]">
            <div className="absolute -left-16 top-16 h-52 w-52 rounded-full bg-[#B8935B]/10 blur-3xl" />
            <div className="absolute bottom-6 right-8 h-56 w-56 rounded-full bg-[#E7D9C9]/5 blur-3xl" />

            <div className="relative mx-auto flex w-full max-w-lg flex-col items-start justify-center">
              {/* Brand Typography Header */}
              <div className="flex flex-col items-start">
                <h1 className="font-serif text-5xl font-normal tracking-tight text-[#F6F1E3]">
                  Laila
                </h1>
                <span className="mt-2 text-sm font-bold tracking-[0.35em] text-[#B8935B]">
                  H I J A B S
                </span>
              </div>

              <p className="mt-8 max-w-md text-3xl font-extrabold leading-[1.1] tracking-tight text-[#F6F1E3]">
                Administrator
                <span className="block bg-gradient-to-r from-[#B8935B] to-[#E7D9C9] bg-clip-text text-transparent">
                  Control Panel
                </span>
              </p>

              <p className="mt-5 max-w-md text-sm leading-6 text-[#E7D9C9]/80">
                Manage inventory catalog, monitor customer order fulfillment, and publish store updates from one elegant dashboard.
              </p>
            </div>
          </section>

          {/* Right Form Panel */}
          <section className="flex items-center justify-center p-6 sm:p-8 lg:p-10 bg-[#F6F1E3]">
            <form
              onSubmit={onSubmit}
              className="w-full max-w-md rounded-2xl border border-[#B8935B]/40 bg-[#E7D9C9] p-6 shadow-[0_14px_48px_rgba(62,73,48,0.12)] sm:p-8"
            >
              <div className="lg:hidden mb-2">
                <h1 className="font-serif text-3xl font-normal text-[#3E4930]">Laila</h1>
                <span className="text-[10px] font-bold tracking-[0.25em] text-[#B8935B]">H I J A B S</span>
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#3E4930]">
                Admin Sign In
              </h2>
              <p className="mt-1 text-xs text-[#3E4930]/70">
                Sign in to continue to your admin dashboard.
              </p>

              <div className="mt-6 flex w-full flex-col gap-4">
                <label className="text-[11px] font-bold uppercase tracking-[0.13em] text-[#3E4930]">
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
                  className="h-12 w-full rounded-xl border border-[#B8935B]/60 bg-[#F6F1E3] px-4 text-[#3E4930] placeholder:text-[#3E4930]/40 outline-none transition-colors focus:border-[#3E4930] focus:ring-1 focus:ring-[#3E4930]"
                />

                <label className="mt-1 text-[11px] font-bold uppercase tracking-[0.13em] text-[#3E4930]">
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
                  className="h-12 w-full rounded-xl border border-[#B8935B]/60 bg-[#F6F1E3] px-4 text-[#3E4930] placeholder:text-[#3E4930]/40 outline-none transition-colors focus:border-[#3E4930] focus:ring-1 focus:ring-[#3E4930]"
                />
              </div>

              {error ? (
                <p className="mt-4 w-full rounded-xl border border-red-300 bg-red-500/10 px-3 py-2 text-center text-xs font-medium text-red-700">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-xl bg-[#3E4930] text-sm font-bold tracking-wide text-[#F6F1E3] shadow-[0_10px_20px_rgba(62,73,48,0.2)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2c3322] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Logging in..." : "Log In"}
              </button>

              <p className="mt-4 text-center text-[11px] text-[#3E4930]/60">
                Protected access for authorized Laila Hijabs staff.
              </p>
            </form>
          </section>

        </div>
      </div>
    </div>
  );
}