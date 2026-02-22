import { CheckIcon } from "@/components/Icons";

export default function Features() {
  return (
    <section id="features" className="section snap-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag glass-pill"><span className="badge-dot" /> Core Features</span>
          <h2>Everything you need to<br /><span className="gradient-text">run projects smarter</span></h2>
        </div>

        {/* Hero feature — AI Blueprints */}
        <div className="feature-hero glass-card">
          <div className="feature-hero-text">
            <svg className="feature-icon" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3>AI Project Blueprints</h3>
            <p>Describe your project idea and our AI generates a complete blueprint, tasks, milestones, and dependencies in seconds.</p>
          </div>
          <div className="feature-hero-visual">
            <div className="blueprint-demo glass-inner">
              <div className="bp-row"><span className="bp-check done"><CheckIcon size={12} /></span><span>Setup authentication service</span><span className="bp-tag">Backend</span></div>
              <div className="bp-row"><span className="bp-check done"><CheckIcon size={12} /></span><span>Design database schema</span><span className="bp-tag">Database</span></div>
              <div className="bp-row highlight"><span className="bp-check ai">AI</span><span>Implement rate limiting</span><span className="bp-tag new">Suggested</span></div>
              <div className="bp-row highlight"><span className="bp-check ai">AI</span><span>Add WebSocket handlers</span><span className="bp-tag new">Suggested</span></div>
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div className="features-row">
          <div className="feature-pill glass-card">
            <svg className="feature-icon" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div><strong>Skill Matching</strong><span>AI finds the right person for every task</span></div>
          </div>
          <div className="feature-pill glass-card">
            <svg className="feature-icon" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div><strong>Virtual Office</strong><span>See your whole team in a 2D workspace</span></div>
          </div>
          <div className="feature-pill glass-card">
            <svg className="feature-icon" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div><strong>Efficiency Scoring</strong><span>AI-powered daily performance insights</span></div>
          </div>
          <div className="feature-pill glass-card">
            <svg className="feature-icon" width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div><strong>Time Tracking</strong><span>Automatic work sessions & break logging</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
