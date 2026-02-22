"use client";
import { useState } from "react";

export default function Waitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  return (
    <section id="waitlist" className="section cta-section">
      <div className="container">
        <div className="glass-card cta-card">
          <div className="cta-bg">
            <div className="orb orb-cta-1" />
            <div className="orb orb-cta-2" />
          </div>
          <div className="cta-content">
            <h2>Ready to reimagine<br /><span className="gradient-text">how your team works?</span></h2>
            <p>Join the waitlist and be among the first to experience Nexofi when we launch.</p>
            <form className="waitlist-form" onSubmit={handleSubmit}>
              <div className="input-group glass-input">
                <input
                  type="email"
                  placeholder="Enter your work email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="btn btn-primary">
                  Get Early Access
                </button>
              </div>
            </form>
            <p className="cta-note">Free during beta · No credit card required · Cancel anytime</p>

            {submitted && (
              <div style={{ marginTop: 16, display:"flex", alignItems:"center", justifyContent:"center", gap:8, color:"#10b981", fontWeight:600, fontSize:"0.9rem" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
                  <path d="M20 6L9 17l-5-5" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                You&apos;re on the list! We&apos;ll be in touch soon.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
