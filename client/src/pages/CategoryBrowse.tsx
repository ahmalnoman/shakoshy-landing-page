import { useState, useMemo } from "react";
import {
  ArrowRight, ArrowLeft, MapPin, Check, ChevronRight,
  Zap, Droplets, Paintbrush2, Hammer, Wrench, Sparkles, Grid3X3, Car,
  Globe, Shield, Crown, Star, Users, Briefcase, Clock, Search,
  ClipboardList, BadgeCheck, ThumbsUp, UserPlus,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { useLocation, useParams } from "wouter";

/* ============================================================
   CATEGORY BROWSE — Provider directory + quick job posting
   Sections: Hero (form + stats), How It Works, Sub-Categories,
   Provider Grid, Join CTA
   ============================================================ */

// ── Category config ──────────────────────────────────────────
const CATEGORY_CONFIG: Record<string, {
  slug: string;
  icon: typeof Zap;
  color: string;
  bgColor: string;
  labelKey: string;
  subCategories: string[];
}> = {
  electrical: {
    slug: "electrical", icon: Zap, color: "#F97316", bgColor: "rgba(249,115,22,0.1)",
    labelKey: "cat.electrical",
    subCategories: ["installLight", "repairSocket", "fixPower", "mainBoard"],
  },
  plumbing: {
    slug: "plumbing", icon: Droplets, color: "#3B82F6", bgColor: "rgba(59,130,246,0.1)",
    labelKey: "cat.plumbing",
    subCategories: ["fixLeak", "installFaucet", "repairShower", "unclogDrain", "waterHeater"],
  },
  painting: {
    slug: "painting", icon: Paintbrush2, color: "#8B5CF6", bgColor: "rgba(139,92,246,0.1)",
    labelKey: "cat.painting",
    subCategories: ["indoor", "outdoor", "doorWindow", "wallRepair"],
  },
  renovation: {
    slug: "renovation", icon: Hammer, color: "#F97316", bgColor: "rgba(249,115,22,0.1)",
    labelKey: "cat.renovation",
    subCategories: ["fullReno", "kitchen", "bathroom", "roomAddition"],
  },
  automotive: {
    slug: "automotive", icon: Car, color: "#06B6D4", bgColor: "rgba(6,182,212,0.1)",
    labelKey: "cat.automotive",
    subCategories: ["generalRepair", "oilChange", "tireService", "acRepair"],
  },
  maintenance: {
    slug: "maintenance", icon: Wrench, color: "#10B981", bgColor: "rgba(16,185,129,0.1)",
    labelKey: "cat.maintenance",
    subCategories: ["generalCheckup", "applianceRepair", "handyman", "pestControl"],
  },
  ac: {
    slug: "ac", icon: Zap, color: "#8B5CF6", bgColor: "rgba(139,92,246,0.1)",
    labelKey: "postJob.cat.ac",
    subCategories: ["installNew", "repair", "cleaning", "gasRefill"],
  },
  cleaning: {
    slug: "cleaning", icon: Sparkles, color: "#10B981", bgColor: "rgba(16,185,129,0.1)",
    labelKey: "postJob.cat.cleaning",
    subCategories: ["home", "windows", "carpet", "furniture", "postReno"],
  },
  carpentry: {
    slug: "carpentry", icon: Hammer, color: "#A16207", bgColor: "rgba(161,98,7,0.1)",
    labelKey: "postJob.cat.carpentry",
    subCategories: ["doorRepair", "windowRepair", "furnitureRepair", "wardrobeInstall"],
  },
  flooring: {
    slug: "flooring", icon: Grid3X3, color: "#6366F1", bgColor: "rgba(99,102,241,0.1)",
    labelKey: "postJob.cat.flooring",
    subCategories: ["tileInstall", "floorRepair", "bathroomFloor", "kitchenFloor"],
  },
};

const GOVERNORATES = [
  "newCairo", "giza", "alexandria", "cairo", "mansoura",
  "tanta", "aswan", "luxor", "portSaid", "suez",
];

// ── Mock provider data ──────────────────────────────────────
interface MockProvider {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  tier: "basic" | "verified" | "plus";
  rating: number;
  reviewCount: number;
  services: string[];
  governorate: string;
  bio: string;
}

function generateMockProviders(slug: string): MockProvider[] {
  const names = [
    { name: "Ahmed Hassan", biz: "Hassan Electrical" },
    { name: "Mohamed Ali", biz: "Ali Pro Services" },
    { name: "Omar Khalil", biz: "Khalil & Sons" },
    { name: "Youssef Samir", biz: "Samir Technical" },
    { name: "Karim Nasser", biz: "Nasser Group" },
    { name: "Tarek Ibrahim", biz: "Ibrahim Works" },
    { name: "Mahmoud Fathy", biz: "Fathy Maintenance" },
    { name: "Amr Gamal", biz: "Gamal Services" },
    { name: "Hossam Adel", biz: "Adel Professional" },
    { name: "Walid Mostafa", biz: "Mostafa Expert" },
    { name: "Ashraf Samy", biz: "Samy Solutions" },
    { name: "Khaled Rami", biz: "Rami Technical" },
  ];
  const tiers: ("basic" | "verified" | "plus")[] = ["verified", "plus", "verified", "basic", "verified", "plus", "basic", "verified", "verified", "basic", "plus", "verified"];
  const govs = ["newCairo", "giza", "cairo", "alexandria", "mansoura", "tanta", "newCairo", "giza", "cairo", "alexandria", "suez", "luxor"];
  const config = CATEGORY_CONFIG[slug];
  const subs = config?.subCategories || [];

  return names.map((n, i) => ({
    id: `${slug}-${i}`,
    name: n.name,
    businessName: n.biz,
    avatar: "",
    tier: tiers[i],
    rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 30) + (tiers[i] === "plus" ? 10 : 0),
    services: subs.slice(0, 2 + (i % 3)),
    governorate: govs[i],
    bio: "",
  }));
}

// ══════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════
function CategoryNavbar({ categoryLabel }: { categoryLabel: string }) {
  const { lang, toggleLang } = useLang();
  const [, navigate] = useLocation();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(17,17,17,0.97)",
      boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
      backdropFilter: "blur(12px)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/shakoshy-icon.png" alt="Shakoshy" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
            <span style={{ fontWeight: 800, fontSize: 22, color: "white", letterSpacing: "-0.02em" }}>
              {lang === "ar" ? "شاكوشي" : "shakoshy"}
            </span>
          </a>
          <ChevronRight size={14} style={{ color: "rgba(255,255,255,0.3)" }} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontWeight: 600, fontSize: 14 }}>{categoryLabel}</span>
        </div>
        <button onClick={toggleLang} style={{
          background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: 100, padding: "6px 14px", color: "rgba(255,255,255,0.75)",
          fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
        }}>
          <Globe size={14} />
          {lang === "ar" ? "English" : "العربية"}
        </button>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════
// QUICK JOB FORM
// ══════════════════════════════════════════════════════════════
function QuickJobForm({ slug, config, selectedSub, t, isRTL }: {
  slug: string;
  config: typeof CATEGORY_CONFIG[string];
  selectedSub: string;
  t: (key: string) => string;
  isRTL: boolean;
}) {
  const [, navigate] = useLocation();
  const [description, setDescription] = useState("");
  const [governorate, setGovernorate] = useState("");
  const [subCategory, setSubCategory] = useState(selectedSub);
  const [urgency, setUrgency] = useState("asap");
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const inputStyle = (hasError: boolean) => ({
    width: "100%", padding: "12px 14px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${hasError ? "#EF4444" : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10, color: "white", fontSize: 14,
    outline: "none", transition: "border-color 0.2s",
  });

  const handleSubmit = () => {
    const newErrors: Record<string, boolean> = {};
    if (description.length < 20) newErrors.description = true;
    if (!governorate) newErrors.governorate = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const params = new URLSearchParams({
      category: slug,
      ...(subCategory && { sub: subCategory }),
      ...(governorate && { gov: governorate }),
      urgency,
      desc: description,
    });
    navigate(`/post-job?${params.toString()}`);
  };

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)", borderRadius: 20,
      padding: "28px 24px", border: "1px solid rgba(255,255,255,0.08)",
    }}>
      <h2 style={{ fontWeight: 800, fontSize: 20, color: "white", marginBottom: 20 }}>
        {t("catPage.formTitle")}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Description */}
        <div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={t("catPage.formPlaceholder")}
            rows={3}
            style={{ ...inputStyle(!!errors.description), resize: "vertical" as const, minHeight: 80, fontFamily: "inherit" }}
          />
          {errors.description && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{t("catPage.error.description")}</p>}
        </div>

        {/* Governorate */}
        <div style={{ position: "relative" }}>
          <MapPin size={16} style={{ position: "absolute", top: 13, left: isRTL ? "auto" : 12, right: isRTL ? 12 : "auto", color: "rgba(255,255,255,0.4)" }} />
          <select
            value={governorate}
            onChange={e => setGovernorate(e.target.value)}
            style={{
              ...inputStyle(!!errors.governorate),
              paddingLeft: isRTL ? 14 : 36,
              paddingRight: isRTL ? 36 : 14,
              appearance: "none" as const,
              WebkitAppearance: "none" as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: isRTL ? "left 12px center" : "right 12px center",
            }}
          >
            <option value="" style={{ background: "#1A1A1A" }}>{t("catPage.selectGovernorate")}</option>
            {GOVERNORATES.map(g => (
              <option key={g} value={g} style={{ background: "#1A1A1A" }}>{t(`postJob.gov.${g}`)}</option>
            ))}
          </select>
          {errors.governorate && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 4 }}>{t("catPage.error.governorate")}</p>}
        </div>

        {/* Sub-category */}
        <select
          value={subCategory}
          onChange={e => setSubCategory(e.target.value)}
          style={{
            ...inputStyle(false),
            appearance: "none" as const,
            WebkitAppearance: "none" as const,
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: isRTL ? "left 12px center" : "right 12px center",
          }}
        >
          <option value="" style={{ background: "#1A1A1A" }}>{t("catPage.selectSubCategory")}</option>
          {config.subCategories.map(sub => (
            <option key={sub} value={sub} style={{ background: "#1A1A1A" }}>
              {t(`catPage.sub.${slug}.${sub}`)}
            </option>
          ))}
        </select>

        {/* Urgency */}
        <div style={{ display: "flex", gap: 8 }}>
          {["asap", "thisWeek", "flexible"].map(opt => (
            <button
              key={opt}
              onClick={() => setUrgency(opt)}
              style={{
                flex: 1, padding: "10px 8px", borderRadius: 8,
                background: urgency === opt ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                border: urgency === opt ? "2px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                color: urgency === opt ? "#F97316" : "rgba(255,255,255,0.6)",
                fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {t(`catPage.urgency.${opt}`)}
            </button>
          ))}
        </div>

        {/* CTA */}
        <button onClick={handleSubmit} className="btn-primary" style={{ width: "100%", fontSize: 15, padding: "14px 24px", justifyContent: "center" }}>
          {t("catPage.getOffers")} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
        </button>
        <p style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
          {t("catPage.freeNonBinding")}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// HOW IT WORKS BAR
// ══════════════════════════════════════════════════════════════
function HowItWorksBar({ t, color }: { t: (key: string) => string; color: string }) {
  const steps = [
    { icon: <ClipboardList size={24} />, title: t("catPage.how1"), desc: t("catPage.how1Desc") },
    { icon: <BadgeCheck size={24} />, title: t("catPage.how2"), desc: t("catPage.how2Desc") },
    { icon: <ThumbsUp size={24} />, title: t("catPage.how3"), desc: t("catPage.how3Desc") },
  ];

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", borderRadius: 16,
      padding: "32px 28px", border: "1px solid rgba(255,255,255,0.06)",
    }}>
      <h3 style={{ fontWeight: 800, fontSize: 18, color: "white", textAlign: "center", marginBottom: 28 }}>
        {t("catPage.howTitle")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: `${color}15`, color,
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 12px",
            }}>
              {step.icon}
            </div>
            <p style={{ fontWeight: 700, fontSize: 15, color: "white", marginBottom: 4 }}>{step.title}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// PROVIDER CARD
// ══════════════════════════════════════════════════════════════
function ProviderCard({ provider, slug, t, color }: {
  provider: MockProvider;
  slug: string;
  t: (key: string) => string;
  color: string;
}) {
  const initials = provider.name.split(" ").map(n => n[0]).join("").slice(0, 2);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      borderRadius: 16, padding: 20,
      border: provider.tier === "plus"
        ? "1px solid rgba(22,163,74,0.3)"
        : "1px solid rgba(255,255,255,0.08)",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {/* Header: avatar + name + badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%", flexShrink: 0,
          background: `${color}20`, border: `2px solid ${color}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color, fontWeight: 800, fontSize: 18,
        }}>
          {initials}
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontWeight: 700, fontSize: 15, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {provider.businessName}
          </p>
          {provider.tier !== "basic" && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 4, marginTop: 2,
              background: provider.tier === "verified" ? "rgba(37,99,235,0.12)" : "rgba(22,163,74,0.12)",
              padding: "2px 8px", borderRadius: 6,
            }}>
              {provider.tier === "verified"
                ? <Shield size={11} style={{ color: "#2563EB" }} />
                : <Crown size={11} style={{ color: "#16A34A" }} />}
              <span style={{
                color: provider.tier === "verified" ? "#2563EB" : "#16A34A",
                fontSize: 10, fontWeight: 700,
              }}>
                {t(provider.tier === "verified" ? "catPage.filterVerified" : "catPage.filterPlus")}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
        {provider.reviewCount > 0 ? (
          <>
            <div style={{ display: "flex", gap: 2 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={13} style={{
                  color: i <= Math.round(provider.rating) ? "#F97316" : "rgba(255,255,255,0.15)",
                  fill: i <= Math.round(provider.rating) ? "#F97316" : "none",
                }} />
              ))}
            </div>
            <span style={{ color: "white", fontWeight: 700, fontSize: 13 }}>{provider.rating}</span>
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              ({provider.reviewCount} {t("catPage.reviews")})
            </span>
          </>
        ) : (
          <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontStyle: "italic" }}>
            {t("catPage.noReviews")}
          </span>
        )}
      </div>

      {/* Service tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
        {provider.services.slice(0, 3).map(sub => (
          <span key={sub} style={{
            background: `${color}12`, color,
            padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
          }}>
            {t(`catPage.sub.${slug}.${sub}`)}
          </span>
        ))}
        {provider.services.length > 3 && (
          <span style={{
            background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
            padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
          }}>
            +{provider.services.length - 3}
          </span>
        )}
      </div>

      {/* Location */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <MapPin size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
            {t(`postJob.gov.${provider.governorate}`)}
          </span>
        </div>
        <button style={{
          background: "none", border: `1px solid ${color}40`,
          borderRadius: 8, padding: "5px 12px",
          color, fontWeight: 600, fontSize: 11, cursor: "pointer",
          transition: "background 0.2s",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = `${color}12`; }}
          onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
        >
          {t("catPage.viewProfile")}
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN CATEGORY BROWSE PAGE
// ══════════════════════════════════════════════════════════════
export default function CategoryBrowse() {
  const { t: _t, lang } = useLang();
  const t = _t as (key: string) => string;
  const isRTL = lang === "ar";
  const [, navigate] = useLocation();
  const params = useParams<{ slug: string }>();
  const slug = params.slug || "electrical";

  const config = CATEGORY_CONFIG[slug];
  if (!config) {
    navigate("/404");
    return null;
  }

  const Icon = config.icon;
  const categoryLabel = t(config.labelKey);

  const [selectedSub, setSelectedSub] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | "verified" | "plus">("all");
  const [govFilter, setGovFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);

  const allProviders = useMemo(() => generateMockProviders(slug), [slug]);

  const filteredProviders = useMemo(() => {
    let result = allProviders;
    if (tierFilter !== "all") result = result.filter(p => p.tier === tierFilter);
    if (govFilter) result = result.filter(p => p.governorate === govFilter);
    return result.sort((a, b) => b.rating - a.rating);
  }, [allProviders, tierFilter, govFilter]);

  return (
    <div style={{ minHeight: "100vh", background: "#111" }}>
      <CategoryNavbar categoryLabel={categoryLabel} />

      <div className="container" style={{ paddingTop: 96, paddingBottom: 60 }}>

        {/* ── SECTION A: HERO ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" style={{ marginBottom: 48 }}>
          {/* Left: Quick Job Form */}
          <div className="lg:col-span-7">
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: config.bgColor, color: config.color,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={22} />
                </div>
                <h1 style={{ fontWeight: 900, fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: "white", lineHeight: 1.1 }}>
                  {t("catPage.heroTitle").replace("{category}", categoryLabel)}
                </h1>
              </div>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 15, maxWidth: 480 }}>
                {t("catPage.heroDesc")}
              </p>
            </div>
            <QuickJobForm slug={slug} config={config} selectedSub={selectedSub} t={t} isRTL={isRTL} />
          </div>

          {/* Right: Trust stats */}
          <div className="hidden lg:flex lg:col-span-5" style={{ alignItems: "center" }}>
            <div style={{
              width: "100%", borderRadius: 20,
              background: `linear-gradient(135deg, ${config.color}12, ${config.color}06)`,
              border: `1px solid ${config.color}25`,
              padding: "40px 32px", textAlign: "center",
            }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: `${config.color}18`, color: config.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <Icon size={40} />
              </div>
              <h3 style={{ fontWeight: 800, fontSize: 22, color: "white", marginBottom: 24 }}>
                {categoryLabel}
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <Users size={18} style={{ color: config.color }} />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>
                    {t("catPage.trustStat1")}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
                  <Briefcase size={18} style={{ color: config.color }} />
                  <span style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14 }}>
                    {t("catPage.trustStat2")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── SECTION B: HOW IT WORKS ─────────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <HowItWorksBar t={t} color={config.color} />
        </div>

        {/* ── SECTION C: SUB-CATEGORIES ───────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <h3 style={{ fontWeight: 800, fontSize: 18, color: "white", marginBottom: 16 }}>
            {t("catPage.popularServices").replace("{category}", categoryLabel)}
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <button
              onClick={() => setSelectedSub("")}
              style={{
                padding: "8px 16px", borderRadius: 100,
                background: !selectedSub ? config.color : "rgba(255,255,255,0.06)",
                border: !selectedSub ? `1px solid ${config.color}` : "1px solid rgba(255,255,255,0.1)",
                color: !selectedSub ? "white" : "rgba(255,255,255,0.6)",
                fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {t("catPage.filterAll")}
            </button>
            {config.subCategories.map(sub => (
              <button
                key={sub}
                onClick={() => setSelectedSub(selectedSub === sub ? "" : sub)}
                style={{
                  padding: "8px 16px", borderRadius: 100,
                  background: selectedSub === sub ? config.color : "rgba(255,255,255,0.06)",
                  border: selectedSub === sub ? `1px solid ${config.color}` : "1px solid rgba(255,255,255,0.1)",
                  color: selectedSub === sub ? "white" : "rgba(255,255,255,0.6)",
                  fontWeight: 600, fontSize: 13, cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {t(`catPage.sub.${slug}.${sub}`)}
              </button>
            ))}
          </div>
        </div>

        {/* ── SECTION D: PROVIDER DIRECTORY ────────────────── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 800, fontSize: 18, color: "white" }}>
              {t("catPage.prosNearYou").replace("{category}", categoryLabel)}
            </h3>
          </div>

          {/* Filter bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {/* Governorate filter */}
            <select
              value={govFilter}
              onChange={e => setGovFilter(e.target.value)}
              style={{
                padding: "8px 32px 8px 12px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, color: "rgba(255,255,255,0.7)", fontSize: 13,
                outline: "none",
                appearance: "none" as const,
                WebkitAppearance: "none" as const,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 8px center",
              }}
            >
              <option value="" style={{ background: "#1A1A1A" }}>{t("catPage.governorate")}</option>
              {GOVERNORATES.map(g => (
                <option key={g} value={g} style={{ background: "#1A1A1A" }}>{t(`postJob.gov.${g}`)}</option>
              ))}
            </select>

            {/* Tier filter */}
            {(["all", "verified", "plus"] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  background: tierFilter === tier ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                  border: tierFilter === tier ? "1px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                  color: tierFilter === tier ? "#F97316" : "rgba(255,255,255,0.6)",
                  fontWeight: 600, fontSize: 12, cursor: "pointer", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 4,
                }}
              >
                {tier === "verified" && <Shield size={12} />}
                {tier === "plus" && <Crown size={12} />}
                {t(`catPage.filter${tier.charAt(0).toUpperCase() + tier.slice(1)}`)}
              </button>
            ))}
          </div>

          {/* Provider grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProviders.slice(0, visibleCount).map(provider => (
              <ProviderCard key={provider.id} provider={provider} slug={slug} t={t} color={config.color} />
            ))}
          </div>

          {/* Show more */}
          {visibleCount < filteredProviders.length && (
            <div style={{ textAlign: "center", marginTop: 24 }}>
              <button
                onClick={() => setVisibleCount(prev => prev + 6)}
                style={{
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 10, padding: "12px 28px",
                  color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14,
                  cursor: "pointer", transition: "background 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              >
                {t("catPage.showMore")}
              </button>
            </div>
          )}
        </div>

        {/* ── SECTION E: CTA BANNER ───────────────────────── */}
        <div style={{
          background: `linear-gradient(135deg, ${config.color}15, ${config.color}05)`,
          borderRadius: 20, padding: "40px 32px",
          border: `1px solid ${config.color}25`,
          textAlign: "center",
        }}>
          <UserPlus size={32} style={{ color: config.color, marginBottom: 16 }} />
          <h3 style={{ fontWeight: 900, fontSize: 22, color: "white", marginBottom: 8 }}>
            {t("catPage.ctaTitle").replace("{category}", categoryLabel)}
          </h3>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, maxWidth: 500, margin: "0 auto 24px" }}>
            {t("catPage.ctaDesc")}
          </p>
          <a href="/join-professional" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px" }}>
            {t("catPage.ctaButton")} <ArrowRight size={16} style={{ transform: isRTL ? "scaleX(-1)" : "none" }} />
          </a>
        </div>
      </div>
    </div>
  );
}
