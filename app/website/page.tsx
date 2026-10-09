"use client";

import { useEffect, useState } from "react";

const services = [
  {
    title: "Personal Numerology",
    subtitle: "Discover Your Strengths. Understand Your Numbers.",
    description:
      "Explore your Mulank, Bhagyank, Lo Shu Grid, name numerology and personal strengths.",
  },
  {
    title: "Premium Life Path",
    subtitle: "Understand Your Life. Find Your Direction.",
    description:
      "An integrated guidance experience combining numerology and traditional Vedic astrology.",
  },
  {
    title: "Professional Guidance",
    subtitle: "Clarity for Your Challenges.",
    description:
      "Thoughtful guidance for career, business and important personal decisions.",
  },
  {
    title: "Ambition Support",
    subtitle: "Your Ambition Matters.",
    description:
      "Explore your aspirations and develop practical steps toward meaningful goals.",
  },
  {
    title: "Manifestation Support",
    subtitle: "Turn Intentions into Action.",
    description:
      "Build supportive routines, set meaningful intentions and focus on progress.",
  },
  {
    title: "Action & Progress Support",
    subtitle: "Every Step Counts.",
    description:
      "Review your goals, understand your progress and plan your next steps.",
  },
];

export default function JeevanSutraWebsite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    const target = new Date("2026-10-20T14:19:00+05:30").getTime();

    function updateCountdown() {
      const difference = target - Date.now();

      if (difference <= 0) {
        setRemaining("Our launch date has arrived");
        return;
      }

      const seconds = Math.floor(difference / 1000);
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      setRemaining(
        `${days} Days · ${hours} Hours · ${minutes} Minutes`
      );
    }

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 60000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="js-site">
      <header className="js-header">
        <a href="#home" className="js-brand">
          JEEVAN SUTRA
        </a>

        <button
          type="button"
          className="js-menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className={menuOpen ? "js-nav open" : "js-nav"}>
          <a href="#home" onClick={() => setMenuOpen(false)}>
            Home
          </a>
          <a href="#services" onClick={() => setMenuOpen(false)}>
            Services
          </a>
          <a href="#consultation" onClick={() => setMenuOpen(false)}>
            Free Consultation
          </a>
          <a href="#about" onClick={() => setMenuOpen(false)}>
            About Us
          </a>
          <a href="/login" className="js-login">
            Login
          </a>
          <a href="#registration" className="js-register">
            Register Now
          </a>
        </nav>
      </header>

      <main>
        <section id="home" className="js-hero">
          <div className="js-hero-inner">
            <img
              src="/logo.png"
              alt="Jeevan Sutra original logo"
              className="js-logo"
            />

            <p className="js-eyebrow">
              THE COMPLETE GUIDANCE EXPERIENCE
            </p>

            <h1>
              Wisdom for
              <br />
              <em>Your Life&apos;s Journey.</em>
            </h1>

            <p className="js-intro">
              Discover a thoughtful guidance experience
              bringing together Indian wisdom, numerology,
              Vedic astrology and practical support for
              your personal journey.
            </p>

            <div className="js-buttons">
              <a href="#registration" className="js-primary">
                REGISTER NOW
              </a>
              <a href="#services" className="js-secondary">
                EXPLORE SERVICES
              </a>
            </div>
          </div>
        </section>

        <section id="consultation" className="js-section js-light">
          <div className="js-container js-center">
            <p className="js-eyebrow js-dark-gold">
              BEGIN YOUR JOURNEY
            </p>

            <h2>Start with a Free Consultation</h2>

            <p className="js-description">
              Begin discovering your personal numerology
              with an introductory consultation from
              the Jeevan Sutra team.
            </p>

            <p className="js-description">
              Our Free Consultation Team is led by
              Pranita Ghode, Principal Numerologist,
              who supervises training and consultation quality.
            </p>

            <a href="#registration" className="js-primary">
              REGISTER FOR FREE CONSULTATION
            </a>
          </div>
        </section>

        <section id="services" className="js-section">
          <div className="js-container">
            <div className="js-center">
              <p className="js-eyebrow">
                THE JEEVAN SUTRA EXPERIENCE
              </p>

              <h2>Guidance for Every Dimension of Life</h2>

              <p className="js-description">
                Explore our developing collection of
                personalized guidance experiences.
              </p>
            </div>

            <div className="js-grid">
              {services.map((service, index) => (
                <article className="js-card" key={service.title}>
                  <span className="js-card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{service.title}</h3>
                  <strong>{service.subtitle}</strong>
                  <p>{service.description}</p>

                  <a href="#registration">
                    EXPLORE THIS SERVICE →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="js-section js-light">
          <div className="js-container js-center">
            <p className="js-eyebrow js-dark-gold">
              HOW JEEVAN SUTRA WORKS
            </p>

            <h2>Your Guidance Journey</h2>

            <div className="js-steps">
              <div>
                <span>01</span>
                <h3>Register</h3>
                <p>Create your Jeevan Sutra client profile.</p>
              </div>

              <div>
                <span>02</span>
                <h3>Select Service</h3>
                <p>Choose free consultation or another service.</p>
              </div>

              <div>
                <span>03</span>
                <h3>Connect</h3>
                <p>Connect with an authorized professional.</p>
              </div>

              <div>
                <span>04</span>
                <h3>Receive Guidance</h3>
                <p>Access your guidance and next steps.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="registration" className="js-section js-register-section">
          <div className="js-container js-center">
            <p className="js-eyebrow">
              ONE PROFILE · MULTIPLE SERVICES
            </p>

            <h2>Join Jeevan Sutra</h2>

            <p className="js-description">
              Our unified registration will allow you
              to select either Free Consultation or
              Other Services using one client profile.
            </p>

            <div className="js-registration-options">
              <div>
                <h3>Free Consultation</h3>
                <p>Register for introductory numerology guidance.</p>
              </div>

              <div>
                <h3>Other Services</h3>
                <p>Explore our personalized reports and guidance.</p>
              </div>
            </div>

            <p className="js-note">
              Online registration is being developed.
              This preview does not collect personal information.
            </p>
          </div>
        </section>

        <section className="js-section js-launch">
          <div className="js-container js-center">
            <p className="js-eyebrow">
              JEEVAN SUTRA · GRAND LAUNCH
            </p>

            <h2>The Grand Unveiling</h2>

            <div className="js-launch-date">
              20 October 2026
            </div>

            <p>2:19 PM IST · INDIA</p>

            <div className="js-countdown" aria-live="off">
              {remaining || "Preparing countdown..."}
            </div>

            <h3>100 Lucky Winners</h3>

            <p className="js-description">
              Complimentary personal numerology
              prediction sessions as part of
              our launch celebration.
            </p>

            <a
              className="js-primary"
              href="https://wa.me/919960096018?text=Congratulations%20on%20the%20launch%20of%20Jeevan%20Sutra!"
              target="_blank"
              rel="noopener noreferrer"
            >
              SEND YOUR CONGRATULATIONS
            </a>

            <p className="js-note">
              No purchase necessary. Eligibility,
              deadlines and winner-selection details
              will be announced separately.
            </p>
          </div>
        </section>

        <section id="about" className="js-section">
          <div className="js-container">
            <div className="js-center">
              <p className="js-eyebrow">
                THE PEOPLE & PURPOSE
              </p>

              <h2>Vision, Research & Guidance</h2>
            </div>

            <div className="js-grid js-two">
              <article className="js-card">
                <span className="js-card-number">
                  FOUNDER · JEEVAN SUTRA
                </span>

                <h3>Shashank Shekhar</h3>

                <p>
                  Leading the vision, research and
                  technology development of Jeevan Sutra.
                  His work explores global numerological
                  traditions and respected sources of
                  ancient Vedic astrology.
                </p>
              </article>

              <article className="js-card">
                <span className="js-card-number">
                  PRINCIPAL NUMEROLOGIST
                </span>

                <h3>Pranita Ghode</h3>

                <p>
                  Principal Numerologist, Jeevan Sutra.
                  Head of the Free Consultation Team,
                  responsible for professional training,
                  supervision and consultation quality.
                </p>

                <p>
                  Founder, The Swastik Indian Art.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="js-section js-light">
          <div className="js-container js-center">
            <p className="js-eyebrow js-dark-gold">
              REMEDY PRODUCTS PARTNER
            </p>

            <h2>The Swastik Indian Art</h2>

            <p className="js-description">
              Jeevan Sutra collaborates with
              The Swastik Indian Art for selected
              numerology artwork, yantras and
              traditional remedy products.
            </p>

            <p className="js-description">
              The Swastik Indian Art is an
              independent partner brand.
            </p>
          </div>
        </section>
      </main>

      <footer className="js-footer">
        <h2>JEEVAN SUTRA</h2>
        <p>THE COMPLETE GUIDANCE EXPERIENCE</p>
        <p>jeevansutra.co.in</p>
        <p>
          © 2026 Jeevan Sutra. Guidance is intended
          to support thoughtful decisions, not
          guarantee outcomes.
        </p>
      </footer>

      <style jsx global>{`
        .js-site {
          --burgundy: #260c19;
          --burgundy-light: #401729;
          --gold: #dcb77c;
          --ivory: #f8eddf;
          --muted: #ddc8ce;
          background: var(--burgundy);
          color: var(--ivory);
          min-height: 100vh;
          font-family: Arial, Helvetica, sans-serif;
        }

        .js-site * {
          box-sizing: border-box;
        }

        .js-site a {
          text-decoration: none;
        }

        .js-site h1,
        .js-site h2,
        .js-site h3 {
          font-family: Georgia, "Times New Roman", serif;
          font-weight: normal;
        }

        .js-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 5%;
          background: #200a15;
          position: relative;
          z-index: 10;
        }

        .js-brand {
          color: var(--gold);
          font-family: Georgia, serif;
          font-size: 22px;
          letter-spacing: 2px;
        }

        .js-nav {
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .js-nav a {
          color: var(--ivory);
          font-size: 13px;
        }

        .js-nav .js-register,
        .js-primary {
          background: var(--gold);
          color: #30101e;
          padding: 15px 23px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: bold;
          display: inline-block;
        }

        .js-menu-button {
          display: none;
          background: transparent;
          color: var(--gold);
          border: 0;
          font-size: 28px;
          cursor: pointer;
        }

        .js-hero {
          text-align: center;
          padding: 65px 20px 100px;
          background: radial-gradient(
            ellipse at 50% 20%,
            #572337,
            #260c19 75%
          );
        }

        .js-hero-inner {
          max-width: 850px;
          margin: auto;
        }

        .js-logo {
          display: block;
          width: min(100%, 400px);
          height: auto;
          margin: 0 auto 30px;
          border: 0;
          box-shadow: none;
          background: transparent;
        }

        .js-eyebrow {
          color: var(--gold);
          letter-spacing: 3px;
          font-size: 12px;
          font-weight: bold;
          line-height: 1.8;
        }

        .js-hero h1 {
          font-size: clamp(43px, 7vw, 78px);
          line-height: 1.15;
          margin: 22px 0;
        }

        .js-hero h1 em {
          color: var(--gold);
        }

        .js-intro,
        .js-description {
          max-width: 690px;
          margin: 20px auto 32px;
          line-height: 1.9;
          font-size: 16px;
          color: var(--muted);
        }

        .js-buttons {
          display: flex;
          justify-content: center;
          gap: 15px;
          flex-wrap: wrap;
          margin-top: 30px;
        }

        .js-secondary {
          border: 1px solid var(--gold);
          color: var(--ivory);
          padding: 15px 23px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: bold;
        }

        .js-section {
          padding: 85px 20px;
        }

        .js-container {
          max-width: 1150px;
          margin: auto;
        }

        .js-center {
          text-align: center;
        }

        .js-section h2 {
          font-size: clamp(36px, 5vw, 58px);
          line-height: 1.18;
          margin: 15px 0 25px;
        }

        .js-light {
          background: #f8eee2;
          color: #361623;
        }

        .js-light .js-description {
          color: #6f5760;
        }

        .js-dark-gold {
          color: #98682f;
        }

        .js-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-top: 45px;
        }

        .js-two {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .js-card {
          background: var(--burgundy-light);
          border-radius: 7px;
          padding: 30px;
          min-height: 280px;
        }

        .js-card-number {
          color: var(--gold);
          font-size: 12px;
          letter-spacing: 2px;
        }

        .js-card h3 {
          color: #f2d2a0;
          font-size: 29px;
          margin: 18px 0;
        }

        .js-card strong {
          color: #f7e7d7;
          font-size: 14px;
          line-height: 1.7;
        }

        .js-card p {
          color: #e0cbd0;
          font-size: 14px;
          line-height: 1.85;
        }

        .js-card a {
          color: var(--gold);
          font-size: 12px;
          font-weight: bold;
          display: inline-block;
          margin-top: 18px;
        }

        .js-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 45px;
        }

        .js-steps div {
          padding: 25px 15px;
          background: #fff9f2;
          border-radius: 5px;
        }

        .js-steps span {
          color: #9b682d;
          font-size: 25px;
          font-family: Georgia, serif;
        }

        .js-steps h3 {
          font-size: 24px;
        }

        .js-steps p {
          font-size: 14px;
          line-height: 1.7;
          color: #6f5760;
        }

        .js-register-section {
          background: linear-gradient(130deg, #451629, #260c19);
        }

        .js-registration-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 800px;
          margin: 35px auto;
          text-align: left;
        }

        .js-registration-options div {
          border: 1px solid #926c59;
          border-radius: 6px;
          padding: 25px;
        }

        .js-registration-options h3 {
          color: var(--gold);
          font-size: 25px;
        }

        .js-registration-options p {
          line-height: 1.8;
          color: var(--muted);
        }

        .js-note {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.8;
          margin-top: 25px;
        }

        .js-launch {
          background: linear-gradient(140deg, #421426, #200b16);
          text-align: center;
        }

        .js-launch-date {
          font-family: Georgia, serif;
          font-size: clamp(35px, 6vw, 60px);
          color: var(--gold);
          margin: 30px 0 15px;
        }

        .js-countdown {
          display: inline-block;
          background: #ffffff0c;
          border: 1px solid #795263;
          padding: 20px 30px;
          margin: 30px 0;
          color: var(--gold);
          font-size: 20px;
        }

        .js-launch h3 {
          color: var(--gold);
          font-size: 35px;
          margin-top: 35px;
        }

        .js-footer {
          background: #1b0912;
          text-align: center;
          padding: 50px 20px;
        }

        .js-footer h2 {
          font-size: 29px;
          letter-spacing: 3px;
          color: var(--gold);
        }

        .js-footer p {
          color: var(--muted);
          font-size: 12px;
          line-height: 1.8;
        }

        @media (max-width: 900px) {
          .js-menu-button {
            display: block;
          }

          .js-nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: #200a15;
            flex-direction: column;
            align-items: stretch;
            padding: 22px;
            gap: 20px;
          }

          .js-nav.open {
            display: flex;
          }

          .js-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .js-steps {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .js-header {
            padding: 18px;
          }

          .js-brand {
            font-size: 18px;
          }

          .js-hero {
            padding: 35px 18px 70px;
          }

          .js-section {
            padding: 65px 20px;
          }

          .js-grid,
          .js-two,
          .js-steps,
          .js-registration-options {
            grid-template-columns: 1fr;
          }

          .js-card {
            min-height: 0;
          }

          .js-logo {
            max-width: 330px;
          }

          .js-countdown {
            font-size: 16px;
            padding: 17px;
          }
        }
      `}</style>
    </div>
  );
}