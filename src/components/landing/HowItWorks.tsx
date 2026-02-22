import { Fragment } from "react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Describe Your Project",
      desc: "Enter your project idea with key details. Our AI analyzes the scope, tech stack, and requirements to understand the full picture.",
    },
    {
      num: "02",
      title: "AI Generates Blueprint",
      desc: "Get an intelligent task breakdown with priorities, time estimates, and skill requirements. Review, customize, and approve the plan.",
    },
    {
      num: "03",
      title: "Team Checks In",
      desc: "Employees open Nexofi and clock in with one tap. Their avatar appears at a virtual desk, ready to work with assigned tasks waiting.",
    },
    {
      num: "04",
      title: "Manage & Optimize",
      desc: "Watch your team in real time. AI handles reassignment, flags bottlenecks, and delivers daily efficiency reports to managers.",
    },
  ];

  return (
    <section id="how-it-works" className="section section-alt snap-section">
      <div className="container">
        <div className="section-header">
          <span className="section-tag glass-pill"><span className="badge-dot" /> How It Works</span>
          <h2>From idea to execution<br /><span className="gradient-text">in four simple steps</span></h2>
        </div>

        <div className="steps-grid">
          {steps.map((s, i) => (
            <Fragment key={s.num}>
              <div className="step-card glass-card">
                <div className="step-number">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div key={`conn-${i}`} className="step-connector">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <path d="M12 20h16m0 0l-6-6m6 6l-6 6" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
