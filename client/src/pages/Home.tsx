import { useEffect, useRef, useState } from "react";
import {
  Zap, Droplets, Paintbrush2, Hammer, Car, Wrench,
  ShieldCheck, Star, ArrowRight, CheckCircle2, XCircle,
  MapPin, Clock, ChevronRight, Menu, X,
  Twitter, Instagram, Linkedin, Youtube,
  BadgeCheck, TrendingUp, MessageSquare, Lock,
  Users, Briefcase, ThumbsUp, Building2,
  Globe
} from "lucide-react";
import { useLang } from "@/contexts/LanguageContext";

/* ============================================================
   SHAKOSHY — Bold Industrial · Orange Energy · Dark Authority
   Barlow Condensed (display) + Barlow (body) + Inter (UI)
   Primary: #F97316  Dark: #111111 / #1A1A1A
   ============================================================ */

// ── Image CDN URLs ──────────────────────────────────────────
const IMG = {
  heroBg:        "https://d2xsxph8kpxj0f.cloudfront.net/310519663070593594/4LpDdvGUVXZjosrxkWg8mo/hero-bg-GZ8EkCjFWxU9c6mRxdmuyt.webp",
  professionals: "https://d2xsxph8kpxj0f.cloudfront.net/310519663070593594/4LpDdvGUVXZjosrxkWg8mo/professionals-team-fsZcmigsSdcQVPgTy7m8gN.webp",
  renovation:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663070593594/4LpDdvGUVXZjosrxkWg8mo/home-renovation-C6rmaDHCgG5tPMQb33xhSA.webp",
  appMockup:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663070593594/4LpDdvGUVXZjosrxkWg8mo/app-mockup-4dStCbJ79HAmZAchWz2QGW.webp",
  trust:         "https://d2xsxph8kpxj0f.cloudfront.net/310519663070593594/4LpDdvGUVXZjosrxkWg8mo/trust-section-D3nGD5FEMaf8snqjRjLuvW.webp",
};

// ── Font helper (switches to Arabic font when RTL) ──────────
function ff(base: "poppins" | "barlow" | "inter", lang: "en" | "ar") {
  const fonts = { poppins: "'Poppins'", barlow: "'Barlow'", inter: "'Inter'" };
  return lang === "ar" ? `'Noto Naskh Arabic', ${fonts[base]}, sans-serif` : `${fonts[base]}, sans-serif`;
}

// ── Intersection Observer hook ───────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Animated counter ─────────────────────────────────────────
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Fade-up wrapper ──────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════
function Navbar() {
  const { lang, toggleLang, t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: t("nav.howItWorks"), href: "#how" },
    { label: t("nav.categories"), href: "#categories" },
    { label: t("nav.forProfessionals"), href: "#professionals" },
    { label: t("nav.about"), href: "#about" },
  ];

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "background 0.3s, box-shadow 0.3s",
        background: scrolled ? "rgba(17,17,17,0.97)" : "transparent",
        boxShadow: scrolled ? "0 2px 24px rgba(0,0,0,0.4)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/shakoshy-icon.png" alt="Shakoshy" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
          <span style={{ fontFamily: ff("poppins", lang), fontWeight: 800, fontSize: 22, color: "white", letterSpacing: "-0.02em" }}>
            shakoshy
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ gap: 8, alignItems: "center" }} className="hidden lg:flex">
          {links.map(l => (
            <a key={l.href} href={l.href} style={{
              color: "rgba(255,255,255,0.75)", textDecoration: "none",
              fontFamily: ff("poppins", lang), fontWeight: 600, fontSize: 14,
              letterSpacing: "0.04em", padding: "6px 14px", borderRadius: 6,
              transition: "color 0.2s, background 0.2s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.color = "#F97316"; (e.target as HTMLElement).style.background = "rgba(249,115,22,0.08)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.color = "rgba(255,255,255,0.75)"; (e.target as HTMLElement).style.background = "transparent"; }}
            >{l.label}</a>
          ))}
        </div>

        {/* Right side: lang toggle + CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Language toggle */}
          <button
            onClick={toggleLang}
            title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8, padding: "6px 12px",
              color: "rgba(255,255,255,0.8)", cursor: "pointer",
              fontFamily: lang === "ar" ? "'Poppins', sans-serif" : "'Noto Naskh Arabic', sans-serif",
              fontWeight: 600, fontSize: 13,
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
          >
            <Globe size={16} />
            <span>{lang === "en" ? "عربي" : "EN"}</span>
          </button>

          {/* Unique pro login CTA */}
          <a
            href="/professional/dashboard"
            className="hidden lg:inline-flex"
            style={{
              position: "relative",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
              borderRadius: 999,
              padding: "9px 14px 9px 12px",
              background: "linear-gradient(90deg, rgba(249,115,22,0.2), rgba(249,115,22,0.05))",
              border: "1px solid rgba(249,115,22,0.45)",
              color: "#FDE7D8",
              fontFamily: ff("poppins", lang),
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              boxShadow: "0 10px 24px rgba(249,115,22,0.22)",
              transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
              maxWidth: 230,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 14px 30px rgba(249,115,22,0.32)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.7)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 24px rgba(249,115,22,0.22)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.45)";
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: "rgba(249,115,22,0.25)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(249,115,22,0.5)",
                flexShrink: 0,
              }}
            >
              <Briefcase size={11} />
            </span>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#F97316",
                boxShadow: "0 0 0 6px rgba(249,115,22,0.12)",
              }}
            />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {t("nav.loginProfessional")}
            </span>
          </a>

          {/* CTA */}
          <a href="/post-job" className="btn-primary hidden lg:inline-flex" style={{ fontSize: 13, padding: "10px 20px", fontFamily: ff("poppins", lang) }}>
            {t("nav.postAJob")}
          </a>

          {/* Mobile hamburger */}
          <button onClick={() => setOpen(!open)} className="lg:hidden" style={{ background: "none", border: "none", color: "white", padding: 8 }}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background: "rgba(17,17,17,0.98)", borderTop: "1px solid rgba(255,255,255,0.08)", padding: "1rem 1.25rem 1.5rem" }}>
          {links.map(l => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} style={{
              display: "block", color: "rgba(255,255,255,0.8)", textDecoration: "none",
              fontFamily: ff("barlow", lang), fontWeight: 600, fontSize: 16,
              padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>{l.label}</a>
          ))}
          <a
            href="/professional/dashboard"
            onClick={() => setOpen(false)}
            style={{
              marginTop: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 10,
              padding: "12px 14px",
              textDecoration: "none",
              background: "linear-gradient(90deg, rgba(249,115,22,0.2), rgba(249,115,22,0.06))",
              border: "1px solid rgba(249,115,22,0.45)",
              color: "#FDE7D8",
              fontFamily: ff("poppins", lang),
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <Briefcase size={14} />
            {t("nav.loginProfessional")}
          </a>
          <a href="/post-job" className="btn-primary" style={{ marginTop: 16, width: "100%", justifyContent: "center", fontFamily: ff("poppins", lang) }}>{t("nav.postAJob")}</a>
        </div>
      )}
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════
// HERO
// ══════════════════════════════════════════════════════════════
function Hero() {
  const { lang, t } = useLang();
  return (
    <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", overflow: "hidden", background: "#111" }}>
      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${IMG.heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center",
        opacity: 0.35,
      }} />
      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(105deg, rgba(17,17,17,0.95) 45%, rgba(17,17,17,0.5) 100%)",
      }} />
      {/* Orange glow */}
      <div style={{
        position: "absolute", top: "20%", left: "5%", width: 600, height: 600,
        background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: 100, paddingBottom: 80 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* Left: Copy */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 28 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#F97316" }} />
              <span style={{ fontFamily: ff("poppins", lang), fontWeight: 700, fontSize: 11, letterSpacing: lang === "ar" ? "0.04em" : "0.16em", textTransform: lang === "ar" ? "none" : "uppercase", color: "#F97316" }}>
                {t("hero.badge")}
              </span>
            </div>

            <h1 style={{
              fontFamily: ff("poppins", lang), fontWeight: 900, fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
              lineHeight: 1.05, letterSpacing: "-0.03em", color: "white", marginBottom: 12,
            }}>
              {t("hero.titleLine1")}<br />
              {t("hero.titleLine2")}<br />
              <span style={{ color: "#F97316" }}>{t("hero.titleHighlight")}</span>
            </h1>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.15rem", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, maxWidth: 480, marginBottom: 36 }}>
              {t("hero.description")}
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 40 }}>
              <a href="/post-job" className="btn-primary" style={{ fontSize: 14, padding: "14px 28px", fontFamily: ff("poppins", lang) }}>
                {t("hero.postAJob")} <ArrowRight size={16} style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
              </a>
              <a href="/join-professional" className="btn-outline-white" style={{ fontSize: 14, padding: "14px 28px", fontFamily: ff("poppins", lang) }}>
                {t("hero.joinProfessional")}
              </a>
            </div>

            <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
              {[
                { icon: <ShieldCheck size={15} />, label: t("hero.verifiedPros") },
                { icon: <TrendingUp size={15} />, label: t("hero.transparentBidding") },
                { icon: <Lock size={15} />, label: t("hero.securePayments") },
              ].map(f => (
                <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 7, color: "rgba(255,255,255,0.55)", fontFamily: ff("barlow", lang), fontSize: 13, fontWeight: 500 }}>
                  <span style={{ color: "#F97316" }}>{f.icon}</span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right: Job card mockup */}
          <div style={{ justifyContent: "center" }} className="hidden lg:flex">
            <div style={{
              background: "rgba(26,26,26,0.92)", border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20, padding: 24, width: 340,
              boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.08)",
              backdropFilter: "blur(16px)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{t("hero.activeJob")}</span>
                <span style={{ background: "#F97316", color: "white", fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", padding: "3px 10px", borderRadius: 100 }}>{t("hero.live")}</span>
              </div>
              <h3 style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 20, color: "white", marginBottom: 6 }}>{t("hero.kitchenRenovation")}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.45)", fontSize: 13, marginBottom: 20, fontFamily: ff("inter", lang) }}>
                <MapPin size={12} /> {t("hero.location")}
                <span style={{ opacity: 0.4 }}>·</span>
                <Clock size={12} /> {t("hero.postedAgo")}
              </div>
              <img src={IMG.renovation} alt="Kitchen renovation" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 12, marginBottom: 20 }} />
              {[
                { initial: "A", name: "Ahmed K.", rating: 4.9, jobs: 142, price: "EGP 24,000" },
                { initial: "M", name: "Mohamed S.", rating: 4.7, jobs: 89, price: "EGP 21,000" },
              ].map(p => (
                <div key={p.name} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 14px", marginBottom: 8,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 14, color: "white" }}>{p.initial}</div>
                    <div>
                      <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 14, color: "white" }}>{p.name}</div>
                      <div style={{ fontFamily: ff("inter", lang), fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                        ★ {p.rating} · {p.jobs} {t("hero.jobs")}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 14, color: "#F97316" }}>{p.price}</span>
                </div>
              ))}
              <button className="btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: 8, fontSize: 13, fontFamily: ff("poppins", lang) }}>
                {t("hero.compareHire")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// STATS BAR
// ══════════════════════════════════════════════════════════════
function StatsBar() {
  const { lang, t } = useLang();
  const stats = [
    { value: 5000, suffix: "+", label: t("stats.activeProfessionals") },
    { value: 20000, suffix: "+", label: t("stats.completedJobs") },
    { value: 98, suffix: "%", label: t("stats.positiveReviews") },
    { value: 15, suffix: "+", label: t("stats.citiesCovered") },
  ];
  return (
    <section style={{ background: "#F97316" }}>
      <div className="container" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem" }}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {stats.map((s, i) => (
            <FadeUp key={i} delay={i * 80}>
              <div style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 2.8rem)", color: "white", lineHeight: 1 }}>
                <Counter target={s.value} suffix={s.suffix} />
              </div>
              <div style={{ fontFamily: ff("barlow", lang), fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.75)", marginTop: 4 }}>
                {s.label}
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// PROBLEM SECTION
// ══════════════════════════════════════════════════════════════
function ProblemSection() {
  const { lang, t } = useLang();
  const before = [t("problem.before1"), t("problem.before2"), t("problem.before3"), t("problem.before4")];
  const after = [t("problem.after1"), t("problem.after2"), t("problem.after3"), t("problem.after4")];
  return (
    <section id="about" style={{ background: "#FAFAF8", paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image */}
          <FadeUp>
            <div style={{ position: "relative" }}>
              <img src={IMG.professionals} alt="Shakoshy professionals" style={{ width: "100%", borderRadius: 16, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 24px 60px rgba(0,0,0,0.15)" }} />
              <div style={{
                position: "absolute", bottom: -20, ...(lang === "ar" ? { left: -20 } : { right: -20 }),
                background: "#F97316", borderRadius: 12, padding: "16px 24px",
                boxShadow: "0 12px 32px rgba(249,115,22,0.4)",
              }}>
                <div style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: 28, color: "white", lineHeight: 1 }}>5,000+</div>
                <div style={{ fontFamily: ff("barlow", lang), fontWeight: 600, fontSize: 12, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("problem.verifiedPros")}</div>
              </div>
            </div>
          </FadeUp>

          {/* Text */}
          <FadeUp delay={120}>
            <p className="section-label" style={{ marginBottom: 12, fontFamily: ff("poppins", lang) }}>{t("problem.label")}</p>
            <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#111", marginBottom: 16 }}>
              {t("problem.title")}<br />{t("problem.titleLine2")}
            </h2>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.05rem", color: "#555", lineHeight: 1.7, marginBottom: 32 }}>
              {t("problem.desc1")}
            </p>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1rem", color: "#777", lineHeight: 1.7, marginBottom: 36 }}>
              {t("problem.desc2")}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Before */}
              <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#ef4444", marginBottom: 14 }}>{t("problem.before")}</div>
                {before.map(txt => (
                  <div key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <XCircle size={15} color="#ef4444" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: ff("barlow", lang), fontSize: 13, color: "#444", lineHeight: 1.4 }}>{txt}</span>
                  </div>
                ))}
              </div>
              {/* With Shakoshy */}
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "#16a34a", marginBottom: 14 }}>{t("problem.withShakoshy")}</div>
                {after.map(txt => (
                  <div key={txt} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                    <CheckCircle2 size={15} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontFamily: ff("barlow", lang), fontSize: 13, color: "#444", lineHeight: 1.4 }}>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// HOW IT WORKS
// ══════════════════════════════════════════════════════════════
function HowItWorks() {
  const { lang, t } = useLang();
  const clientSteps = [
    { n: "01", title: t("how.client1Title"), desc: t("how.client1Desc") },
    { n: "02", title: t("how.client2Title"), desc: t("how.client2Desc") },
    { n: "03", title: t("how.client3Title"), desc: t("how.client3Desc") },
    { n: "04", title: t("how.client4Title"), desc: t("how.client4Desc") },
  ];
  const proSteps = [
    { n: "01", title: t("how.pro1Title"), desc: t("how.pro1Desc") },
    { n: "02", title: t("how.pro2Title"), desc: t("how.pro2Desc") },
    { n: "03", title: t("how.pro3Title"), desc: t("how.pro3Desc") },
    { n: "04", title: t("how.pro4Title"), desc: t("how.pro4Desc") },
  ];

  return (
    <section id="how" style={{ background: "#111", paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="container">
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="section-label" style={{ marginBottom: 12, fontFamily: ff("poppins", lang) }}>{t("how.label")}</p>
            <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.2rem)", letterSpacing: "-0.03em", color: "white" }}>
              {t("how.title")}
            </h2>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* For Clients */}
          <FadeUp delay={80}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={18} color="#F97316" />
                </div>
                <span style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 16, color: "white", letterSpacing: "0.02em" }}>{t("how.forClients")}</span>
              </div>
              {clientSteps.map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 16, marginBottom: i < 3 ? 24 : 0 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: 13, color: "white" }}>{s.n}</div>
                    {i < 3 && <div style={{ width: 1, height: 24, background: "rgba(249,115,22,0.25)", margin: "4px auto" }} />}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 16, color: "white", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontFamily: ff("barlow", lang), fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* For Professionals */}
          <FadeUp delay={160}>
            <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(249,115,22,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Briefcase size={18} color="#F97316" />
                </div>
                <span style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 16, color: "white", letterSpacing: "0.02em" }}>{t("how.forProfessionals")}</span>
              </div>
              {proSteps.map((s, i) => (
                <div key={s.n} style={{ display: "flex", gap: 16, marginBottom: i < 3 ? 24 : 0 }}>
                  <div style={{ flexShrink: 0 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.08)", border: "2px solid rgba(249,115,22,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: 13, color: "#F97316" }}>{s.n}</div>
                    {i < 3 && <div style={{ width: 1, height: 24, background: "rgba(249,115,22,0.15)", margin: "4px auto" }} />}
                  </div>
                  <div style={{ paddingTop: 8 }}>
                    <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 16, color: "white", marginBottom: 4 }}>{s.title}</div>
                    <div style={{ fontFamily: ff("barlow", lang), fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>{s.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// SERVICE CATEGORIES
// ══════════════════════════════════════════════════════════════
function Categories() {
  const { lang, t } = useLang();
  const cats = [
    { icon: <Zap size={26} />, label: t("cat.electrical"), color: "#F97316", bg: "rgba(249,115,22,0.1)", slug: "electrical" },
    { icon: <Droplets size={26} />, label: t("cat.plumbing"), color: "#3b82f6", bg: "rgba(59,130,246,0.1)", slug: "plumbing" },
    { icon: <Paintbrush2 size={26} />, label: t("cat.painting"), color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", slug: "painting" },
    { icon: <Hammer size={26} />, label: t("cat.renovation"), color: "#F97316", bg: "rgba(249,115,22,0.1)", slug: "renovation" },
    { icon: <Car size={26} />, label: t("cat.automotive"), color: "#06b6d4", bg: "rgba(6,182,212,0.1)", slug: "automotive" },
    { icon: <Wrench size={26} />, label: t("cat.maintenance"), color: "#10b981", bg: "rgba(16,185,129,0.1)", slug: "maintenance" },
  ];
  return (
    <section id="categories" style={{ background: "#FAFAF8", paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="container">
        <FadeUp>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p className="section-label" style={{ marginBottom: 12, fontFamily: ff("poppins", lang) }}>{t("cat.label")}</p>
            <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em", color: "#111", marginBottom: 12 }}>
              {t("cat.title")}
            </h2>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.05rem", color: "#777", maxWidth: 480, margin: "0 auto" }}>
              {t("cat.subtitle")}
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
          {cats.map((c, i) => (
            <FadeUp key={i} delay={i * 60}>
              <a href={`/category/${c.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{
                  background: "white", borderRadius: 16, padding: "28px 24px",
                  border: "1px solid rgba(0,0,0,0.06)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s",
                  textAlign: "center",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
                >
                  <div style={{ width: 60, height: 60, borderRadius: 14, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: c.color }}>
                    {c.icon}
                  </div>
                  <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 15, color: "#111" }}>{c.label}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginTop: 8, color: "#F97316", fontFamily: ff("barlow", lang), fontWeight: 600, fontSize: 12 }}>
                    {t("cat.browse")} <ChevronRight size={12} style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
                  </div>
                </div>
              </a>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// TRUST ENGINE
// ══════════════════════════════════════════════════════════════
function TrustSection() {
  const { lang, t } = useLang();
  const features = [
    { icon: <BadgeCheck size={22} />, title: t("trust.verifiedTitle"), desc: t("trust.verifiedDesc") },
    { icon: <TrendingUp size={22} />, title: t("trust.biddingTitle"), desc: t("trust.biddingDesc") },
    { icon: <Star size={22} />, title: t("trust.ratingsTitle"), desc: t("trust.ratingsDesc") },
    { icon: <MessageSquare size={22} />, title: t("trust.commsTitle"), desc: t("trust.commsDesc") },
  ];
  return (
    <section id="professionals" style={{ background: "#111", paddingTop: "6rem", paddingBottom: "6rem", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 500, height: 500, background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          <FadeUp>
            <p className="section-label" style={{ marginBottom: 12, fontFamily: ff("poppins", lang) }}>{t("trust.label")}</p>
            <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", color: "white", lineHeight: 1.1, marginBottom: 20 }}>
              {t("trust.titleLine1")}<br />
              <span style={{ color: "#F97316" }}>{t("trust.titleHighlight")}</span>
            </h2>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.05rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: 36 }}>
              {t("trust.desc")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {features.map((f, i) => (
                <FadeUp key={i} delay={i * 70}>
                  <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: 18 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(249,115,22,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#F97316", marginBottom: 12 }}>
                      {f.icon}
                    </div>
                    <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 14, color: "white", marginBottom: 6 }}>{f.title}</div>
                    <div style={{ fontFamily: ff("barlow", lang), fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </FadeUp>

          <FadeUp delay={120}>
            <div style={{ position: "relative" }}>
              <img src={IMG.trust} alt="Trust and reliability" style={{ width: "100%", borderRadius: 20, objectFit: "cover", aspectRatio: "4/3", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }} />
              <div style={{
                position: "absolute", bottom: 20, left: 20, right: 20,
                background: "rgba(17,17,17,0.9)", backdropFilter: "blur(12px)",
                border: "1px solid rgba(249,115,22,0.2)", borderRadius: 14, padding: "14px 18px",
                display: "flex", alignItems: "center", gap: 14,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#F97316", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ThumbsUp size={20} color="white" />
                </div>
                <div>
                  <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 16, color: "white" }}>{t("trust.satisfactionRate")}</div>
                  <div style={{ fontFamily: ff("inter", lang), fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{t("trust.basedOn")}</div>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// APP SECTION
// ══════════════════════════════════════════════════════════════
function AppSection() {
  const { lang, t } = useLang();
  return (
    <section style={{ background: "#FAFAF8", paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          <FadeUp>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={IMG.appMockup} alt="Shakoshy App" style={{ maxHeight: 520, width: "100%", objectFit: "contain", filter: "drop-shadow(0 32px 60px rgba(0,0,0,0.25))" }} />
            </div>
          </FadeUp>

          <FadeUp delay={100}>
            <p className="section-label" style={{ marginBottom: 12, fontFamily: ff("poppins", lang) }}>{t("app.label")}</p>
            <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2rem, 3.5vw, 3rem)", letterSpacing: "-0.03em", color: "#111", lineHeight: 1.1, marginBottom: 20 }}>
              {t("app.titleLine1")}<br />{t("app.titleLine2")}
            </h2>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.05rem", color: "#666", lineHeight: 1.7, marginBottom: 32 }}>
              {t("app.desc")}
            </p>
            {([
              t("app.feature1"),
              t("app.feature2"),
              t("app.feature3"),
              t("app.feature4"),
            ] as string[]).map(f => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <CheckCircle2 size={18} color="#F97316" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: ff("barlow", lang), fontSize: 15, color: "#333", fontWeight: 500 }}>{f}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 32, flexWrap: "wrap" }}>
              <a href="#" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#111", color: "white", borderRadius: 10, padding: "12px 20px",
                textDecoration: "none", transition: "background 0.2s",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div style={{ fontFamily: ff("inter", lang), fontSize: 10, opacity: 0.7 }}>{t("app.downloadOn")}</div>
                  <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 14 }}>{t("app.appStore")}</div>
                </div>
              </a>
              <a href="#" style={{
                display: "inline-flex", alignItems: "center", gap: 10,
                background: "#111", color: "white", borderRadius: 10, padding: "12px 20px",
                textDecoration: "none", transition: "background 0.2s",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.83-2.83-10.76 9.9zM20.68 10.3L17.5 8.47l-3.12 3.12 3.12 3.12 3.2-1.85c.91-.52.91-1.04 0-1.56zM2.17.24C1.83.68 1.67 1.24 1.67 1.9v20.2c0 .66.16 1.22.5 1.66l.09.09 11.32-11.32v-.27L2.26.15l-.09.09zM13.58 12.53l-3.12-3.12L2.17.24l12.6 7.27-1.19 5.02z"/></svg>
                <div>
                  <div style={{ fontFamily: ff("inter", lang), fontSize: 10, opacity: 0.7 }}>{t("app.getItOn")}</div>
                  <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 14 }}>{t("app.googlePlay")}</div>
                </div>
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// CTA
// ══════════════════════════════════════════════════════════════
function CTASection() {
  const { lang, t } = useLang();
  return (
    <section id="post-job" style={{ position: "relative", overflow: "hidden", background: "#111", paddingTop: "6rem", paddingBottom: "6rem" }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${IMG.heroBg})`,
        backgroundSize: "cover", backgroundPosition: "center 60%",
        opacity: 0.15,
      }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(17,17,17,0.95), rgba(17,17,17,0.7))" }} />
      <div className="container" style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
        <FadeUp>
          <p className="section-label" style={{ marginBottom: 16, fontFamily: ff("poppins", lang) }}>{t("cta.label")}</p>
          <h2 style={{ fontFamily: ff("barlow", lang), fontWeight: 900, fontSize: "clamp(2.2rem, 5vw, 4rem)", letterSpacing: "-0.03em", color: "white", lineHeight: 1.05, marginBottom: 20 }}>
            {t("cta.title")}
          </h2>
          <p style={{ fontFamily: ff("barlow", lang), fontSize: "1.1rem", color: "rgba(255,255,255,0.6)", maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.65 }}>
            {t("cta.desc")}
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#" className="btn-primary" style={{ fontSize: 15, padding: "16px 36px", fontFamily: ff("poppins", lang) }}>
              {t("cta.postAJob")} <ArrowRight size={17} style={{ transform: lang === "ar" ? "scaleX(-1)" : "none" }} />
            </a>
            <a href="/join-professional" className="btn-outline-white" style={{ fontSize: 15, padding: "16px 36px", fontFamily: ff("poppins", lang) }}>
              {t("cta.joinProfessional")}
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

// ══════════════════════════════════════════════════════════════
// FOOTER
// ══════════════════════════════════════════════════════════════
function Footer() {
  const { lang, t } = useLang();
  const platform = [t("footer.howItWorks"), t("footer.serviceCategories"), t("footer.materialsMarketplace"), t("footer.projectTracking")];
  const forPros = [t("footer.createProfile"), t("footer.findJobs"), t("footer.growBusiness"), t("footer.supplierRegistration")];
  const company = [t("footer.aboutShakoshy"), t("footer.meetTeam"), t("footer.contact"), t("footer.careers")];

  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "4rem", paddingBottom: "2rem" }}>
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">

          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <img src="/shakoshy-icon.png" alt="Shakoshy" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
              <span style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 20, color: "white" }}>shakoshy</span>
            </div>
            <p style={{ fontFamily: ff("barlow", lang), fontSize: 14, color: "rgba(255,255,255,0.4)", lineHeight: 1.65, marginBottom: 20, maxWidth: 240 }}>
              {t("footer.desc")}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              {[
                { icon: <Twitter size={16} />, href: "#" },
                { icon: <Instagram size={16} />, href: "#" },
                { icon: <Linkedin size={16} />, href: "#" },
                { icon: <Youtube size={16} />, href: "#" },
              ].map((s, i) => (
                <a key={i} href={s.href} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "rgba(255,255,255,0.5)", textDecoration: "none",
                  transition: "background 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)"; (e.currentTarget as HTMLElement).style.color = "#F97316"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: t("footer.platform"), links: platform },
            { title: t("footer.forProfessionals"), links: forPros },
            { title: t("footer.company"), links: company },
          ].map(col => (
            <div key={col.title}>
              <div style={{ fontFamily: ff("barlow", lang), fontWeight: 800, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>{col.title}</div>
              {col.links.map(l => (
                <a key={l} href="#" style={{
                  display: "block", fontFamily: ff("barlow", lang), fontSize: 14, color: "rgba(255,255,255,0.5)",
                  textDecoration: "none", marginBottom: 10, transition: "color 0.2s",
                }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = "#F97316"}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.5)"}
                >{l}</a>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontFamily: ff("inter", lang), fontSize: 13, color: "rgba(255,255,255,0.3)" }}>
            {t("footer.copyright")}
          </span>
          <div style={{ display: "flex", gap: 20 }}>
            {[t("footer.privacy"), t("footer.terms"), "www.shakoshy.com"].map(l => (
              <a key={l} href="#" style={{ fontFamily: ff("inter", lang), fontSize: 13, color: "rgba(255,255,255,0.3)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = "#F97316"}
                onMouseLeave={e => (e.target as HTMLElement).style.color = "rgba(255,255,255,0.3)"}
              >{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ══════════════════════════════════════════════════════════════
// PAGE
// ══════════════════════════════════════════════════════════════
export default function Home() {
  return (
    <div style={{ overflowX: "hidden" }}>
      <Navbar />
      <Hero />
      <StatsBar />
      <ProblemSection />
      <HowItWorks />
      <Categories />
      <TrustSection />
      <AppSection />
      <CTASection />
      <Footer />
    </div>
  );
}
