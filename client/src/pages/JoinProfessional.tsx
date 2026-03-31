import { useState, useRef } from "react";
import {
  ArrowRight, ArrowLeft, Upload, X, Camera,
  MapPin, Check, UserPlus, Eye, EyeOff,
  Zap, Droplets, Paintbrush2, Hammer, Wrench, Sparkles, Grid3X3, Car,
  Globe, FileText, Briefcase, Shield, Crown, Star, Download,
  Smartphone, Users, Award,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { useLocation } from "wouter";

/* ============================================================
   JOIN AS PROFESSIONAL — 4-step provider registration
   Step 1: Create Account (name, phone, email, password, governorate)
   Step 2: Professional Profile (categories, trust tier, bio, photos)
   Step 3: Portfolio & Work Samples
   Step 4: Success / Welcome
   ============================================================ */

// ── Types ────────────────────────────────────────────────────
interface ProFormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  governorate: string;
  services: string[];
  trustTier: "basic" | "verified" | "plus";
  businessName: string;
  bio: string;
  profilePhoto: File | null;
  crewPhoto: File | null;
  portfolioPhotos: File[];
}

// ── Constants ────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  { id: "plumbing", icon: Droplets, color: "#3B82F6" },
  { id: "ac", icon: Zap, color: "#8B5CF6" },
  { id: "electrical", icon: Zap, color: "#EAB308" },
  { id: "painting", icon: Paintbrush2, color: "#EC4899" },
  { id: "carpentry", icon: Hammer, color: "#A16207" },
  { id: "cleaning", icon: Sparkles, color: "#10B981" },
  { id: "flooring", icon: Grid3X3, color: "#6366F1" },
  { id: "renovation", icon: Wrench, color: "#F97316" },
  { id: "maintenance", icon: Wrench, color: "#64748B" },
  { id: "automotive", icon: Car, color: "#0EA5E9" },
];

const GOVERNORATES = [
  "newCairo", "giza", "alexandria", "cairo", "mansoura",
  "tanta", "aswan", "luxor", "portSaid", "suez",
];

// ══════════════════════════════════════════════════════════════
// NAVBAR
// ══════════════════════════════════════════════════════════════
function JoinProNavbar() {
  const { t: _t, lang, toggleLang } = useLang();
  const [, navigate] = useLocation();

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(17,17,17,0.97)",
      boxShadow: "0 2px 24px rgba(0,0,0,0.4)",
      backdropFilter: "blur(12px)",
    }}>
      <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 72 }}>
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/shakoshy-icon.png" alt="Shakoshy" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain" }} />
          <span style={{ fontWeight: 800, fontSize: 22, color: "white", letterSpacing: "-0.02em" }}>
            shakoshy
          </span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={toggleLang} style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 100, padding: "6px 14px", color: "rgba(255,255,255,0.75)",
            fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            transition: "background 0.2s, border-color 0.2s",
          }}>
            <Globe size={14} />
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP INDICATOR
// ══════════════════════════════════════════════════════════════
function StepIndicator({ currentStep, t }: { currentStep: number; t: (key: string) => string }) {
  const steps = [
    { num: 1, label: t("joinPro.step1.label") },
    { num: 2, label: t("joinPro.step2.label") },
    { num: 3, label: t("joinPro.step3.label") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((step, i) => (
        <div key={step.num} style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, fontWeight: 700,
              background: currentStep >= step.num ? "#F97316" : "rgba(255,255,255,0.08)",
              color: currentStep >= step.num ? "white" : "rgba(255,255,255,0.4)",
              border: currentStep >= step.num ? "2px solid #F97316" : "2px solid rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}>
              {currentStep > step.num ? <Check size={18} /> : step.num}
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: 2, height: 40,
                background: currentStep > step.num ? "#F97316" : "rgba(255,255,255,0.1)",
                transition: "background 0.3s",
              }} />
            )}
          </div>
          <div style={{ paddingTop: 8 }}>
            <p style={{
              fontWeight: 700, fontSize: 14,
              color: currentStep >= step.num ? "white" : "rgba(255,255,255,0.4)",
              transition: "color 0.3s",
            }}>
              {step.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 1: CREATE ACCOUNT
// ══════════════════════════════════════════════════════════════
function StepCreateAccount({
  form, setForm, errors, t, isRTL,
}: {
  form: ProFormData;
  setForm: React.Dispatch<React.SetStateAction<ProFormData>>;
  errors: Record<string, boolean>;
  t: (key: string) => string;
  isRTL: boolean;
}) {
  const [showPassword, setShowPassword] = useState(false);

  const inputStyle = (hasError: boolean) => ({
    width: "100%", padding: "14px 16px",
    background: "rgba(255,255,255,0.06)",
    border: `1px solid ${hasError ? "#EF4444" : "rgba(255,255,255,0.12)"}`,
    borderRadius: 10, color: "white", fontSize: 15,
    outline: "none", transition: "border-color 0.2s",
  });

  const labelStyle = {
    fontWeight: 700 as const, fontSize: 14, color: "rgba(255,255,255,0.9)",
    marginBottom: 8, display: "block" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Full Name */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.fullName")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <input
          type="text"
          value={form.fullName}
          onChange={e => setForm(prev => ({ ...prev, fullName: e.target.value }))}
          placeholder={t("joinPro.fullNamePlaceholder")}
          style={inputStyle(!!errors.fullName)}
        />
        {errors.fullName && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.fullName")}</p>}
      </div>

      {/* Phone */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.phone")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
          placeholder={t("joinPro.phonePlaceholder")}
          style={{ ...inputStyle(!!errors.phone), direction: "ltr" }}
        />
        {errors.phone && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.phone")}</p>}
      </div>

      {/* Email */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.email")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <input
          type="email"
          value={form.email}
          onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
          placeholder={t("joinPro.emailPlaceholder")}
          style={{ ...inputStyle(!!errors.email), direction: "ltr" }}
        />
        {errors.email && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.email")}</p>}
      </div>

      {/* Password */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.password")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
            placeholder={t("joinPro.passwordPlaceholder")}
            style={{ ...inputStyle(!!errors.password), direction: "ltr", paddingRight: 48 }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute", top: "50%", right: 14, transform: "translateY(-50%)",
              background: "none", border: "none", color: "rgba(255,255,255,0.4)",
              cursor: "pointer", padding: 0, display: "flex",
            }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.password")}</p>}
        {/* Password strength indicator */}
        {form.password.length > 0 && (
          <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: form.password.length >= i * 3
                  ? (form.password.length >= 12 ? "#10B981" : form.password.length >= 8 ? "#F97316" : "#EF4444")
                  : "rgba(255,255,255,0.1)",
                transition: "background 0.3s",
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.location")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <div style={{ position: "relative" }}>
          <MapPin size={18} style={{ position: "absolute", top: 14, left: isRTL ? "auto" : 14, right: isRTL ? 14 : "auto", color: "rgba(255,255,255,0.4)" }} />
          <select
            value={form.governorate}
            onChange={e => setForm(prev => ({ ...prev, governorate: e.target.value }))}
            style={{
              ...inputStyle(!!errors.governorate),
              paddingLeft: isRTL ? 16 : 42,
              paddingRight: isRTL ? 42 : 16,
              appearance: "none" as const,
              WebkitAppearance: "none" as const,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: isRTL ? "left 14px center" : "right 14px center",
            }}
          >
            <option value="" style={{ background: "#1A1A1A" }}>{t("joinPro.selectGovernorate")}</option>
            {GOVERNORATES.map(g => (
              <option key={g} value={g} style={{ background: "#1A1A1A" }}>{t(`postJob.gov.${g}`)}</option>
            ))}
          </select>
        </div>
        {errors.governorate && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.governorate")}</p>}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// TRUST TIER CARDS
// ══════════════════════════════════════════════════════════════
function TrustTierCards({ selected, onSelect, t }: {
  selected: "basic" | "verified" | "plus";
  onSelect: (tier: "basic" | "verified" | "plus") => void;
  t: (key: string) => string;
}) {
  const tiers = [
    {
      id: "basic" as const,
      icon: <Shield size={28} />,
      color: "rgba(255,255,255,0.5)",
      borderColor: "rgba(255,255,255,0.15)",
      bgActive: "rgba(255,255,255,0.08)",
      name: t("joinPro.tier.basic"),
      price: t("joinPro.tier.basicPrice"),
      features: [
        t("joinPro.tier.basicF1"),
        t("joinPro.tier.basicF2"),
        t("joinPro.tier.basicF3"),
      ],
    },
    {
      id: "verified" as const,
      icon: <Shield size={28} />,
      color: "#2563EB",
      borderColor: "#2563EB",
      bgActive: "rgba(37,99,235,0.12)",
      name: t("joinPro.tier.verified"),
      price: t("joinPro.tier.verifiedPrice"),
      popular: true,
      features: [
        t("joinPro.tier.verifiedF1"),
        t("joinPro.tier.verifiedF2"),
        t("joinPro.tier.verifiedF3"),
      ],
    },
    {
      id: "plus" as const,
      icon: <Crown size={28} />,
      color: "#16A34A",
      borderColor: "#16A34A",
      bgActive: "rgba(22,163,74,0.12)",
      name: t("joinPro.tier.plus"),
      price: t("joinPro.tier.plusPrice"),
      features: [
        t("joinPro.tier.plusF1"),
        t("joinPro.tier.plusF2"),
        t("joinPro.tier.plusF3"),
      ],
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
      {tiers.map(tier => {
        const isSelected = selected === tier.id;
        return (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            style={{
              background: isSelected ? tier.bgActive : "rgba(255,255,255,0.03)",
              border: `2px solid ${isSelected ? tier.borderColor : "rgba(255,255,255,0.08)"}`,
              borderRadius: 16, padding: "20px 16px",
              cursor: "pointer", transition: "all 0.25s",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
              position: "relative", textAlign: "center",
            }}
          >
            {tier.popular && (
              <div style={{
                position: "absolute", top: -10,
                background: "#2563EB", color: "white",
                padding: "3px 12px", borderRadius: 100,
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}>
                {t("joinPro.tier.popular")}
              </div>
            )}
            <div style={{ color: tier.color }}>{tier.icon}</div>
            <p style={{ fontWeight: 800, fontSize: 16, color: "white" }}>{tier.name}</p>
            <p style={{ fontWeight: 700, fontSize: 14, color: tier.color }}>{tier.price}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, width: "100%", marginTop: 4 }}>
              {tier.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Check size={13} style={{ color: tier.color, flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, textAlign: "start" }}>{f}</span>
                </div>
              ))}
            </div>
            {isSelected && (
              <div style={{
                position: "absolute", top: 10, right: 10,
                width: 22, height: 22, borderRadius: "50%",
                background: tier.color,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={13} style={{ color: "white" }} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 2: PROFESSIONAL PROFILE
// ══════════════════════════════════════════════════════════════
function StepProfile({
  form, setForm, errors, t,
}: {
  form: ProFormData;
  setForm: React.Dispatch<React.SetStateAction<ProFormData>>;
  errors: Record<string, boolean>;
  t: (key: string) => string;
}) {
  const profilePhotoRef = useRef<HTMLInputElement>(null);

  const toggleService = (id: string) => {
    setForm(prev => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter(s => s !== id)
        : [...prev.services, id],
    }));
  };

  const labelStyle = {
    fontWeight: 700 as const, fontSize: 14, color: "rgba(255,255,255,0.9)",
    marginBottom: 8, display: "block" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Service Categories */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.services")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>{t("joinPro.servicesHint")}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          {SERVICE_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const selected = form.services.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleService(cat.id)}
                style={{
                  background: selected ? `${cat.color}15` : "rgba(255,255,255,0.04)",
                  border: selected ? `2px solid ${cat.color}` : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12, padding: "14px 10px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                  cursor: "pointer", transition: "all 0.2s", position: "relative",
                }}
              >
                {selected && (
                  <div style={{
                    position: "absolute", top: 5, right: 5,
                    width: 18, height: 18, borderRadius: "50%",
                    background: cat.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={11} style={{ color: "white" }} />
                  </div>
                )}
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${cat.color}18`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={18} style={{ color: cat.color }} />
                </div>
                <span style={{ color: selected ? "white" : "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 11, textAlign: "center" }}>
                  {t(`joinPro.cat.${cat.id}`)}
                </span>
              </button>
            );
          })}
        </div>
        {errors.services && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("joinPro.error.services")}</p>}
      </div>

      {/* Trust Tier */}
      <div>
        <label style={labelStyle}>{t("joinPro.trustTier")}</label>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 12 }}>{t("joinPro.trustTierHint")}</p>
        <TrustTierCards
          selected={form.trustTier}
          onSelect={tier => setForm(prev => ({ ...prev, trustTier: tier }))}
          t={t}
        />
      </div>

      {/* Business Name (optional) */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.businessName")} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 }}>({t("joinPro.optional")})</span>
        </label>
        <input
          type="text"
          value={form.businessName}
          onChange={e => setForm(prev => ({ ...prev, businessName: e.target.value }))}
          placeholder={t("joinPro.businessNamePlaceholder")}
          style={{
            width: "100%", padding: "14px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, color: "white", fontSize: 15,
            outline: "none", transition: "border-color 0.2s",
          }}
        />
      </div>

      {/* Bio */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.bio")} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 }}>({t("joinPro.optional")})</span>
        </label>
        <textarea
          value={form.bio}
          onChange={e => setForm(prev => ({ ...prev, bio: e.target.value.slice(0, 140) }))}
          placeholder={t("joinPro.bioPlaceholder")}
          rows={3}
          style={{
            width: "100%", padding: "14px 16px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10, color: "white", fontSize: 15,
            outline: "none", resize: "vertical" as const, minHeight: 80,
            fontFamily: "inherit",
          }}
        />
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginTop: 6, textAlign: "right" }}>
          {form.bio.length}/140
        </p>
      </div>

      {/* Profile Photo */}
      <div>
        <label style={labelStyle}>
          {t("joinPro.profilePhoto")} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 }}>({t("joinPro.optional")})</span>
        </label>
        <input
          ref={profilePhotoRef}
          type="file" accept="image/jpeg,image/png"
          style={{ display: "none" }}
          onChange={e => {
            const file = e.target.files?.[0];
            if (file && file.size <= 3 * 1024 * 1024) {
              setForm(prev => ({ ...prev, profilePhoto: file }));
            }
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => profilePhotoRef.current?.click()}
            style={{
              width: 72, height: 72, borderRadius: "50%",
              background: form.profilePhoto ? "transparent" : "rgba(255,255,255,0.06)",
              border: "2px dashed rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", overflow: "hidden", flexShrink: 0,
              transition: "border-color 0.2s",
            }}
          >
            {form.profilePhoto ? (
              <img src={URL.createObjectURL(form.profilePhoto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <Camera size={24} style={{ color: "rgba(255,255,255,0.3)" }} />
            )}
          </div>
          <div>
            <button
              onClick={() => profilePhotoRef.current?.click()}
              style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.7)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
              }}
            >
              {form.profilePhoto ? t("joinPro.changePhoto") : t("joinPro.uploadPhoto")}
            </button>
            {form.profilePhoto && (
              <button
                onClick={() => setForm(prev => ({ ...prev, profilePhoto: null }))}
                style={{
                  background: "none", border: "none", color: "#EF4444",
                  fontWeight: 600, fontSize: 12, cursor: "pointer", marginLeft: 10,
                }}
              >
                {t("joinPro.remove")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 3: PORTFOLIO & WORK SAMPLES
// ══════════════════════════════════════════════════════════════
function StepPortfolio({
  form, setForm, t,
}: {
  form: ProFormData;
  setForm: React.Dispatch<React.SetStateAction<ProFormData>>;
  t: (key: string) => string;
}) {
  const portfolioInputRef = useRef<HTMLInputElement>(null);

  const handlePortfolioAdd = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).filter(f => f.size <= 3 * 1024 * 1024).slice(0, 10 - form.portfolioPhotos.length);
    setForm(prev => ({ ...prev, portfolioPhotos: [...prev.portfolioPhotos, ...newPhotos] }));
  };

  const removePortfolioPhoto = (index: number) => {
    setForm(prev => ({ ...prev, portfolioPhotos: prev.portfolioPhotos.filter((_, i) => i !== index) }));
  };

  const labelStyle = {
    fontWeight: 700 as const, fontSize: 14, color: "rgba(255,255,255,0.9)",
    marginBottom: 8, display: "block" as const,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Portfolio Photos */}
      <div>
        <label style={labelStyle}>{t("joinPro.portfolio")}</label>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 14 }}>{t("joinPro.portfolioHint")}</p>

        <input
          ref={portfolioInputRef}
          type="file" accept="image/jpeg,image/png" multiple
          style={{ display: "none" }}
          onChange={e => handlePortfolioAdd(e.target.files)}
        />

        {/* Photo thumbnails */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: form.portfolioPhotos.length > 0 ? 12 : 0 }}>
          {form.portfolioPhotos.map((photo, i) => (
            <div key={i} style={{ position: "relative", width: 90, height: 90, borderRadius: 10, overflow: "hidden" }}>
              <img src={URL.createObjectURL(photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => removePortfolioPhoto(i)}
                style={{
                  position: "absolute", top: 4, right: 4,
                  width: 22, height: 22, borderRadius: "50%",
                  background: "rgba(0,0,0,0.7)", border: "none",
                  color: "white", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {form.portfolioPhotos.length < 10 && (
          <button
            onClick={() => portfolioInputRef.current?.click()}
            style={{
              width: "100%", padding: "32px 16px", borderRadius: 12,
              border: "2px dashed rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.02)",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
              transition: "border-color 0.2s, background 0.2s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.4)";
              (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.04)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
            }}
          >
            <Camera size={28} />
            <span style={{ fontSize: 15, fontWeight: 600 }}>{t("joinPro.uploadPhotos")}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>JPG, PNG · {t("joinPro.max3mb")}</span>
          </button>
        )}
      </div>

      {/* Portfolio tip */}
      <div style={{
        background: "rgba(249,115,22,0.06)", borderRadius: 12,
        padding: 20, border: "1px solid rgba(249,115,22,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <Star size={16} style={{ color: "#F97316" }} />
          <span style={{ fontWeight: 700, fontSize: 14, color: "#F97316" }}>{t("joinPro.portfolioTip")}</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.6 }}>
          {t("joinPro.portfolioTipDesc")}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 4: SUCCESS / WELCOME
// ══════════════════════════════════════════════════════════════
function StepSuccess({ form, t }: { form: ProFormData; t: (key: string) => string }) {
  const [, navigate] = useLocation();

  const tierInfo = {
    basic: { icon: <Shield size={20} />, color: "rgba(255,255,255,0.5)", label: t("joinPro.tier.basic") },
    verified: { icon: <Shield size={20} />, color: "#2563EB", label: t("joinPro.tier.verified") },
    plus: { icon: <Crown size={20} />, color: "#16A34A", label: t("joinPro.tier.plus") },
  }[form.trustTier];

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      {/* Success icon */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(16,185,129,0.15)", border: "3px solid #10B981",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <Check size={40} style={{ color: "#10B981" }} />
      </div>

      <h2 style={{ fontWeight: 900, fontSize: 28, color: "white", marginBottom: 12 }}>
        {t("joinPro.success.title")}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, maxWidth: 420, margin: "0 auto 40px" }}>
        {t("joinPro.success.desc")}
      </p>

      {/* Profile summary card */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 16,
        padding: 28, border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "start", maxWidth: 480, margin: "0 auto 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "rgba(249,115,22,0.15)", border: "2px solid #F97316",
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            {form.profilePhoto ? (
              <img src={URL.createObjectURL(form.profilePhoto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <UserPlus size={22} style={{ color: "#F97316" }} />
            )}
          </div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "white" }}>
              {form.businessName || form.fullName}
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MapPin size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
                {t(`postJob.gov.${form.governorate}`)}
              </span>
            </div>
          </div>
        </div>

        {/* Tier badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: `${tierInfo.color}15`,
          padding: "5px 12px", borderRadius: 8, marginBottom: 14,
        }}>
          <span style={{ color: tierInfo.color }}>{tierInfo.icon}</span>
          <span style={{ color: tierInfo.color, fontWeight: 700, fontSize: 12 }}>{tierInfo.label}</span>
        </div>

        {/* Services */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
          {form.services.map(svc => {
            const cat = SERVICE_CATEGORIES.find(c => c.id === svc);
            return (
              <span key={svc} style={{
                background: cat ? `${cat.color}15` : "rgba(255,255,255,0.08)",
                color: cat?.color || "rgba(255,255,255,0.7)",
                padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600,
              }}>
                {t(`joinPro.cat.${svc}`)}
              </span>
            );
          })}
        </div>

        {form.portfolioPhotos.length > 0 && (
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {form.portfolioPhotos.slice(0, 4).map((p, i) => (
              <img key={i} src={URL.createObjectURL(p)} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover" }} />
            ))}
            {form.portfolioPhotos.length > 4 && (
              <div style={{
                width: 52, height: 52, borderRadius: 8,
                background: "rgba(255,255,255,0.08)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600,
              }}>
                +{form.portfolioPhotos.length - 4}
              </div>
            )}
          </div>
        )}
      </div>

      {/* What happens next */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 16,
        padding: 28, border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "start", maxWidth: 480, margin: "0 auto 32px",
      }}>
        <h3 style={{ fontWeight: 800, fontSize: 16, color: "white", marginBottom: 16 }}>
          {t("joinPro.success.whatsNext")}
        </h3>
        {[
          { icon: <Award size={18} />, text: t("joinPro.success.next1") },
          { icon: <Smartphone size={18} />, text: t("joinPro.success.next2") },
          { icon: <Briefcase size={18} />, text: t("joinPro.success.next3") },
          { icon: <Star size={18} />, text: t("joinPro.success.next4") },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "rgba(249,115,22,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#F97316", flexShrink: 0,
            }}>
              {item.icon}
            </div>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>{item.text}</span>
          </div>
        ))}
      </div>

      {/* App download CTA */}
      <div style={{
        background: "linear-gradient(135deg, rgba(249,115,22,0.12), rgba(249,115,22,0.04))",
        borderRadius: 16, padding: 28, border: "1px solid rgba(249,115,22,0.2)",
        maxWidth: 480, margin: "0 auto 32px", textAlign: "center",
      }}>
        <Download size={28} style={{ color: "#F97316", marginBottom: 12 }} />
        <p style={{ fontWeight: 700, fontSize: 16, color: "white", marginBottom: 6 }}>
          {t("joinPro.success.downloadApp")}
        </p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, marginBottom: 16 }}>
          {t("joinPro.success.downloadAppDesc")}
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: "white", color: "#111", border: "none",
            borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            App Store
          </button>
          <button style={{
            background: "white", color: "#111", border: "none",
            borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 13,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            Google Play
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="btn-primary"
        style={{ fontSize: 14, padding: "14px 32px" }}
      >
        {t("joinPro.backToHome")}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN JOIN AS PROFESSIONAL PAGE
// ══════════════════════════════════════════════════════════════
export default function JoinProfessional() {
  const { t: _t, lang } = useLang();
  const t = _t as (key: string) => string;
  const isRTL = lang === "ar";
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<ProFormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    governorate: "",
    services: [],
    trustTier: "basic",
    businessName: "",
    bio: "",
    profilePhoto: null,
    crewPhoto: null,
    portfolioPhotos: [],
  });

  const totalSteps = 3;
  const isSuccess = step === 4;

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (form.fullName.trim().length < 3) newErrors.fullName = true;
    if (!form.phone.trim() || form.phone.trim().length < 8) newErrors.phone = true;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = true;
    if (form.password.length < 8) newErrors.password = true;
    if (!form.governorate) newErrors.governorate = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, boolean> = {};
    if (form.services.length === 0) newErrors.services = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(step + 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setErrors({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div style={{ minHeight: "100vh", background: "#111" }}>
      <JoinProNavbar />

      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
        {/* Page header */}
        {!isSuccess && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 16 }}>
              <UserPlus size={14} style={{ color: "#F97316" }} />
              <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: "#F97316", letterSpacing: "0.08em" }}>
                {t("joinPro.badge")}
              </span>
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "white", lineHeight: 1.1, marginBottom: 8 }}>
              {t("joinPro.title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 500 }}>
              {t("joinPro.subtitle")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left sidebar: Step indicator (desktop) */}
          {!isSuccess && (
            <div className="hidden lg:block lg:col-span-3">
              <div style={{ position: "sticky", top: 100 }}>
                <StepIndicator currentStep={step} t={t} />

                {/* Trust signals */}
                <div style={{ marginTop: 40, padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{t("joinPro.whyJoin")}</p>
                  {["trust1", "trust2", "trust3"].map(key => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Check size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{t(`joinPro.${key}`)}</span>
                    </div>
                  ))}
                </div>

                {/* Social proof */}
                <div style={{ marginTop: 20, padding: 20, background: "rgba(249,115,22,0.06)", borderRadius: 12, border: "1px solid rgba(249,115,22,0.12)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <Users size={16} style={{ color: "#F97316" }} />
                    <span style={{ color: "#F97316", fontWeight: 700, fontSize: 13 }}>{t("joinPro.socialProof")}</span>
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>
                    {t("joinPro.testimonial")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className={isSuccess ? "lg:col-span-12" : "lg:col-span-6"}>
            {/* Mobile step indicator */}
            {!isSuccess && (
              <div className="lg:hidden" style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "#F97316", fontWeight: 700, fontSize: 14 }}>
                    {t("joinPro.stepOf").replace("{current}", String(step)).replace("{total}", String(totalSteps))}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} style={{
                      flex: 1, height: 4, borderRadius: 2,
                      background: i < step ? "#F97316" : "rgba(255,255,255,0.1)",
                      transition: "background 0.3s",
                    }} />
                  ))}
                </div>
              </div>
            )}

            {step === 1 && <StepCreateAccount form={form} setForm={setForm} errors={errors} t={t} isRTL={isRTL} />}
            {step === 2 && <StepProfile form={form} setForm={setForm} errors={errors} t={t} />}
            {step === 3 && <StepPortfolio form={form} setForm={setForm} t={t} />}
            {isSuccess && <StepSuccess form={form} t={t} />}

            {/* Navigation buttons */}
            {!isSuccess && (
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginTop: 36, paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.08)",
              }}>
                {step > 1 ? (
                  <button onClick={handleBack} style={{
                    background: "none", border: "1px solid rgba(255,255,255,0.15)",
                    borderRadius: 10, padding: "12px 24px",
                    color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 14,
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 8,
                  }}>
                    {isRTL ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
                    {t("joinPro.back")}
                  </button>
                ) : <div />}

                <button onClick={handleNext} className="btn-primary" style={{ fontSize: 14, padding: "12px 28px" }}>
                  {step === 3 ? t("joinPro.submit") : t("joinPro.next")}
                  <Arrow size={16} />
                </button>
              </div>
            )}
          </div>

          {/* Right sidebar: Profile preview (desktop) */}
          {!isSuccess && (
            <div className="hidden lg:block lg:col-span-3">
              <div style={{ position: "sticky", top: 100 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {t("joinPro.profilePreview")}
                </p>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 16,
                  padding: 20, border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  {/* Mini profile preview */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: "50%",
                      background: "rgba(249,115,22,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      overflow: "hidden",
                    }}>
                      {form.profilePhoto ? (
                        <img src={URL.createObjectURL(form.profilePhoto)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <UserPlus size={18} style={{ color: "#F97316" }} />
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 14, color: form.fullName ? "white" : "rgba(255,255,255,0.3)" }}>
                        {form.businessName || form.fullName || t("joinPro.fullNamePlaceholder")}
                      </p>
                      {form.governorate && (
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <MapPin size={11} style={{ color: "rgba(255,255,255,0.4)" }} />
                          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>{t(`postJob.gov.${form.governorate}`)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Trust tier badge */}
                  {form.trustTier !== "basic" && (
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: form.trustTier === "verified" ? "rgba(37,99,235,0.12)" : "rgba(22,163,74,0.12)",
                      padding: "3px 8px", borderRadius: 6, marginBottom: 10,
                    }}>
                      {form.trustTier === "verified"
                        ? <Shield size={11} style={{ color: "#2563EB" }} />
                        : <Crown size={11} style={{ color: "#16A34A" }} />}
                      <span style={{
                        color: form.trustTier === "verified" ? "#2563EB" : "#16A34A",
                        fontSize: 10, fontWeight: 700,
                      }}>
                        {t(`joinPro.tier.${form.trustTier}`)}
                      </span>
                    </div>
                  )}

                  {form.services.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
                      {form.services.slice(0, 3).map(svc => {
                        const cat = SERVICE_CATEGORIES.find(c => c.id === svc);
                        return (
                          <span key={svc} style={{
                            background: cat ? `${cat.color}12` : "rgba(255,255,255,0.06)",
                            color: cat?.color || "rgba(255,255,255,0.6)",
                            padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                          }}>
                            {t(`joinPro.cat.${svc}`)}
                          </span>
                        );
                      })}
                      {form.services.length > 3 && (
                        <span style={{
                          background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)",
                          padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                        }}>
                          +{form.services.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {form.bio && (
                    <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, lineHeight: 1.5 }}>
                      {form.bio.slice(0, 80)}{form.bio.length > 80 ? "..." : ""}
                    </p>
                  )}

                  {form.portfolioPhotos.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 10 }}>
                      {form.portfolioPhotos.slice(0, 3).map((p, i) => (
                        <img key={i} src={URL.createObjectURL(p)} alt="" style={{ width: 40, height: 40, borderRadius: 6, objectFit: "cover" }} />
                      ))}
                      {form.portfolioPhotos.length > 3 && (
                        <div style={{
                          width: 40, height: 40, borderRadius: 6,
                          background: "rgba(255,255,255,0.06)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: 600,
                        }}>
                          +{form.portfolioPhotos.length - 3}
                        </div>
                      )}
                    </div>
                  )}

                  {!form.fullName && !form.governorate && form.services.length === 0 && (
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 13, fontStyle: "italic" }}>
                      {t("joinPro.previewEmpty")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
