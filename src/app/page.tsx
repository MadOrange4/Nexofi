import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import VirtualOffice from "@/components/landing/VirtualOffice";
import Analytics from "@/components/landing/Analytics";
import Waitlist from "@/components/landing/Waitlist";
import Footer from "@/components/landing/Footer";
import ScrollReveal from "@/components/ScrollReveal";

export default function LandingPage() {
  return (
    <>
      <Nav />
      <ScrollReveal />

      <main className="snap-container">
        {/* ── Hero ── */}
        <Hero />

        {/* ── Logos strip ── */}
        <section className="logos-section">
          <div className="container">
            <p className="logos-label">Designed for teams that build the future</p>
            <div className="logos-row">
              {["TechCorp", "CloudBase", "DevSync", "QuantumLab", "StackFlow"].map((name) => (
                <span key={name} className="logo-placeholder">{name}</span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <Features />

        {/* ── How It Works ── */}
        <HowItWorks />

        {/* ── Virtual Office ── */}
        <VirtualOffice />

        {/* ── Analytics ── */}
        <Analytics />

        {/* ── CTA + Footer ── */}
        <div className="snap-section snap-section-end">
          <Waitlist />
          <Footer />
        </div>
      </main>
    </>
  );
}
