import { useState, useRef } from "react";
import {
  ArrowRight, ArrowLeft, Upload, X, Camera, Clock,
  MapPin, ChevronDown, Search, Check, Briefcase,
  Zap, Droplets, Paintbrush2, Hammer, Wrench, Sparkles, Grid3X3,
  Globe, Menu,
} from "lucide-react";
import { useLang } from "../contexts/LanguageContext";
import { useLocation } from "wouter";

/* ============================================================
   POST A JOB — Multi-step job posting form
   Step 1: Job Details (category, description, location, urgency, budget, photos)
   Step 2: Category Questionnaire (optional, skippable)
   Step 3: Confirmation / Success
   ============================================================ */

// ── Types ────────────────────────────────────────────────────
interface JobFormData {
  category: string;
  subCategory: string;
  description: string;
  governorate: string;
  urgency: string;
  specificDate: string;
  budget: string;
  photos: File[];
  questionnaireAnswers: Record<string, string>;
}

// ── Constants ────────────────────────────────────────────────
const CATEGORIES = [
  { id: "plumbing", icon: Droplets, color: "#3B82F6" },
  { id: "ac", icon: Zap, color: "#8B5CF6" },
  { id: "electrical", icon: Zap, color: "#EAB308" },
  { id: "painting", icon: Paintbrush2, color: "#EC4899" },
  { id: "carpentry", icon: Hammer, color: "#A16207" },
  { id: "cleaning", icon: Sparkles, color: "#10B981" },
  { id: "flooring", icon: Grid3X3, color: "#6366F1" },
  { id: "renovation", icon: Wrench, color: "#F97316" },
  { id: "maintenance", icon: Wrench, color: "#64748B" },
];

const GOVERNORATES = [
  "newCairo", "giza", "alexandria", "cairo", "mansoura",
  "tanta", "aswan", "luxor", "portSaid", "suez",
];

const URGENCY_OPTIONS = ["asap", "thisWeek", "flexible", "specificDate"];

const BUDGET_OPTIONS = ["under1k", "1kTo5k", "5kTo20k", "over20k"];

// Category-specific questionnaires
const QUESTIONNAIRES: Record<string, string[]> = {
  plumbing: ["plumbing.q1", "plumbing.q2"],
  ac: ["ac.q1"],
  electrical: ["electrical.q1"],
  painting: ["painting.q1"],
  carpentry: ["carpentry.q1"],
  cleaning: ["cleaning.q1"],
  flooring: ["flooring.q1"],
};

const QUESTIONNAIRE_OPTIONS: Record<string, string[]> = {
  "plumbing.q1": ["plumbing.q1.a1", "plumbing.q1.a2", "plumbing.q1.a3", "plumbing.q1.a4"],
  "plumbing.q2": ["plumbing.q2.a1", "plumbing.q2.a2", "plumbing.q2.a3"],
  "ac.q1": ["ac.q1.a1", "ac.q1.a2", "ac.q1.a3", "ac.q1.a4", "ac.q1.a5"],
  "electrical.q1": ["electrical.q1.a1", "electrical.q1.a2", "electrical.q1.a3", "electrical.q1.a4"],
  "painting.q1": ["painting.q1.a1", "painting.q1.a2", "painting.q1.a3", "painting.q1.a4"],
  "carpentry.q1": ["carpentry.q1.a1", "carpentry.q1.a2", "carpentry.q1.a3"],
  "cleaning.q1": ["cleaning.q1.a1", "cleaning.q1.a2", "cleaning.q1.a3", "cleaning.q1.a4", "cleaning.q1.a5", "cleaning.q1.a6"],
  "flooring.q1": ["flooring.q1.a1", "flooring.q1.a2", "flooring.q1.a3"],
};

// ══════════════════════════════════════════════════════════════
// NAVBAR (simplified for post-job page)
// ══════════════════════════════════════════════════════════════
function PostJobNavbar() {
  const { t: _t, lang, toggleLang } = useLang();
  const t = _t as (key: string) => string;
  const isRTL = lang === "ar";
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
            {lang === "ar" ? "شاكوشي" : "shakoshy"}
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
            {isRTL ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP INDICATOR
// ══════════════════════════════════════════════════════════════
function StepIndicator({ currentStep, totalSteps, t }: { currentStep: number; totalSteps: number; t: (key: string) => string }) {
  const steps = [
    { num: 1, label: t("postJob.step1.label") },
    { num: 2, label: t("postJob.step2.label") },
    { num: 3, label: t("postJob.step3.label") },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.slice(0, totalSteps).map((step, i) => (
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
            {i < totalSteps - 1 && (
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
// CATEGORY MODAL
// ══════════════════════════════════════════════════════════════
function CategoryModal({
  open, onClose, onSelect, t,
}: {
  open: boolean; onClose: () => void; onSelect: (id: string) => void; t: (key: string) => string;
}) {
  const [search, setSearch] = useState("");

  if (!open) return null;

  const filtered = CATEGORIES.filter(c =>
    t(`postJob.cat.${c.id}`).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#1A1A1A", borderRadius: 16, width: "100%", maxWidth: 520,
        maxHeight: "80vh", overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 24px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontWeight: 800, fontSize: 20, color: "white", margin: 0 }}>
            {t("postJob.selectCategory")}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "16px 24px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.06)", borderRadius: 10,
            padding: "10px 14px", border: "1px solid rgba(255,255,255,0.1)",
          }}>
            <Search size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("postJob.searchCategory")}
              style={{
                background: "none", border: "none", outline: "none",
                color: "white", fontSize: 15, width: "100%",
              }}
            />
          </div>
        </div>

        {/* Category grid */}
        <div style={{ padding: "0 24px 24px", overflowY: "auto", maxHeight: "50vh" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 12 }}>
            {filtered.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => { onSelect(cat.id); onClose(); }}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12, padding: "20px 12px",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = cat.color;
                    (e.currentTarget as HTMLElement).style.background = `${cat.color}10`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${cat.color}18`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={22} style={{ color: cat.color }} />
                  </div>
                  <span style={{ color: "white", fontWeight: 600, fontSize: 13, textAlign: "center" }}>
                    {t(`postJob.cat.${cat.id}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 1: JOB DETAILS
// ══════════════════════════════════════════════════════════════
function StepJobDetails({
  form, setForm, errors, t, isRTL,
}: {
  form: JobFormData;
  setForm: React.Dispatch<React.SetStateAction<JobFormData>>;
  errors: Record<string, boolean>;
  t: (key: string) => string;
  isRTL: boolean;
}) {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCat = CATEGORIES.find(c => c.id === form.category);

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

  const handlePhotoAdd = (files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files).filter(f => f.size <= 3 * 1024 * 1024).slice(0, 10 - form.photos.length);
    setForm(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }));
  };

  const removePhoto = (index: number) => {
    setForm(prev => ({ ...prev, photos: prev.photos.filter((_, i) => i !== index) }));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Category Selector */}
      <div>
        <label style={labelStyle}>
          {t("postJob.category")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <button
          onClick={() => setCategoryModalOpen(true)}
          style={{
            ...inputStyle(!!errors.category),
            display: "flex", alignItems: "center", justifyContent: "space-between",
            cursor: "pointer", textAlign: isRTL ? "right" : "left",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {selectedCat ? (
              <>
                <selectedCat.icon size={20} style={{ color: selectedCat.color }} />
                <span>{t(`postJob.cat.${form.category}`)}</span>
              </>
            ) : (
              <span style={{ color: "rgba(255,255,255,0.35)" }}>{t("postJob.selectCategory")}</span>
            )}
          </div>
          <ChevronDown size={18} style={{ color: "rgba(255,255,255,0.4)" }} />
        </button>
        {errors.category && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("postJob.error.category")}</p>}
      </div>

      <CategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        onSelect={(id) => setForm(prev => ({ ...prev, category: id }))}
        t={t}
      />

      {/* Description */}
      <div>
        <label style={labelStyle}>
          {t("postJob.description")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <textarea
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          placeholder={t("postJob.descriptionPlaceholder")}
          rows={4}
          style={{
            ...inputStyle(!!errors.description),
            resize: "vertical" as const, minHeight: 100,
            fontFamily: "inherit",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
          {errors.description && <p style={{ color: "#EF4444", fontSize: 12 }}>{t("postJob.error.description")}</p>}
          <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginLeft: "auto" as const }}>
            {form.description.length}/500
          </p>
        </div>
      </div>

      {/* Location */}
      <div>
        <label style={labelStyle}>
          {t("postJob.location")} <span style={{ color: "#F97316" }}>*</span>
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
            <option value="" style={{ background: "#1A1A1A" }}>{t("postJob.selectGovernorate")}</option>
            {GOVERNORATES.map(g => (
              <option key={g} value={g} style={{ background: "#1A1A1A" }}>{t(`postJob.gov.${g}`)}</option>
            ))}
          </select>
        </div>
        {errors.governorate && <p style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{t("postJob.error.governorate")}</p>}
      </div>

      {/* Urgency */}
      <div>
        <label style={labelStyle}>
          {t("postJob.urgency")} <span style={{ color: "#F97316" }}>*</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {URGENCY_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => {
                setForm(prev => ({ ...prev, urgency: opt, specificDate: opt !== "specificDate" ? "" : prev.specificDate }));
                setShowDatePicker(opt === "specificDate");
              }}
              style={{
                padding: "12px 16px", borderRadius: 10,
                background: form.urgency === opt ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                border: form.urgency === opt ? "2px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                color: form.urgency === opt ? "#F97316" : "rgba(255,255,255,0.7)",
                fontWeight: 600, fontSize: 14, cursor: "pointer",
                transition: "all 0.2s", textAlign: "center",
              }}
            >
              {t(`postJob.urgency.${opt}`)}
            </button>
          ))}
        </div>
        {(form.urgency === "specificDate" || showDatePicker) && (
          <input
            type="date"
            value={form.specificDate}
            onChange={e => setForm(prev => ({ ...prev, specificDate: e.target.value }))}
            style={{ ...inputStyle(false), marginTop: 10, colorScheme: "dark" }}
          />
        )}
      </div>

      {/* Budget (optional) */}
      <div>
        <label style={labelStyle}>
          {t("postJob.budget")} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 }}>({t("postJob.optional")})</span>
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
          {BUDGET_OPTIONS.map(opt => (
            <button
              key={opt}
              onClick={() => setForm(prev => ({ ...prev, budget: prev.budget === opt ? "" : opt }))}
              style={{
                padding: "12px 16px", borderRadius: 10,
                background: form.budget === opt ? "rgba(249,115,22,0.15)" : "rgba(255,255,255,0.04)",
                border: form.budget === opt ? "2px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                color: form.budget === opt ? "#F97316" : "rgba(255,255,255,0.7)",
                fontWeight: 600, fontSize: 13, cursor: "pointer",
                transition: "all 0.2s", textAlign: "center",
              }}
            >
              {t(`postJob.budget.${opt}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Photos (optional) */}
      <div>
        <label style={labelStyle}>
          {t("postJob.photos")} <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400, fontSize: 12 }}>({t("postJob.optional")} · {t("postJob.maxPhotos")})</span>
        </label>
        <input
          ref={fileInputRef}
          type="file" accept="image/jpeg,image/png" multiple
          style={{ display: "none" }}
          onChange={e => handlePhotoAdd(e.target.files)}
        />

        {/* Photo thumbnails */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: form.photos.length > 0 ? 12 : 0 }}>
          {form.photos.map((photo, i) => (
            <div key={i} style={{ position: "relative", width: 80, height: 80, borderRadius: 10, overflow: "hidden" }}>
              <img src={URL.createObjectURL(photo)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                onClick={() => removePhoto(i)}
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

        {form.photos.length < 10 && (
          <button
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: "100%", padding: "24px 16px", borderRadius: 12,
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
            <Camera size={24} />
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t("postJob.uploadPhotos")}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>JPG, PNG · {t("postJob.max3mb")}</span>
          </button>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 2: CATEGORY QUESTIONNAIRE
// ══════════════════════════════════════════════════════════════
function StepQuestionnaire({
  form, setForm, t,
}: {
  form: JobFormData;
  setForm: React.Dispatch<React.SetStateAction<JobFormData>>;
  t: (key: string) => string;
}) {
  const questions = QUESTIONNAIRES[form.category] || [];
  const [currentQ, setCurrentQ] = useState(0);

  if (questions.length === 0) return null;

  const question = questions[currentQ];
  const options = QUESTIONNAIRE_OPTIONS[question] || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Progress */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600 }}>
          {t("postJob.questionOf").replace("{current}", String(currentQ + 1)).replace("{total}", String(questions.length))}
        </p>
        <div style={{ display: "flex", gap: 4 }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: i === currentQ ? 24 : 8, height: 8, borderRadius: 4,
              background: i <= currentQ ? "#F97316" : "rgba(255,255,255,0.1)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 16,
        padding: "32px 28px", border: "1px solid rgba(255,255,255,0.08)",
      }}>
        <h3 style={{ fontWeight: 800, fontSize: 20, color: "white", marginBottom: 24 }}>
          {t(`postJob.q.${question}`)}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {options.map(opt => {
            const selected = form.questionnaireAnswers[question] === opt;
            return (
              <button
                key={opt}
                onClick={() => {
                  setForm(prev => ({
                    ...prev,
                    questionnaireAnswers: { ...prev.questionnaireAnswers, [question]: opt },
                  }));
                  // Auto-advance after short delay
                  setTimeout(() => {
                    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
                  }, 300);
                }}
                style={{
                  padding: "14px 20px", borderRadius: 12, textAlign: "start",
                  background: selected ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.04)",
                  border: selected ? "2px solid #F97316" : "1px solid rgba(255,255,255,0.1)",
                  color: selected ? "#F97316" : "rgba(255,255,255,0.8)",
                  fontWeight: 600, fontSize: 15, cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 12,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  border: selected ? "2px solid #F97316" : "2px solid rgba(255,255,255,0.2)",
                  background: selected ? "#F97316" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {selected && <Check size={12} style={{ color: "white" }} />}
                </div>
                {t(`postJob.q.${opt}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation within questionnaire */}
      {currentQ > 0 && (
        <button
          onClick={() => setCurrentQ(currentQ - 1)}
          style={{
            background: "none", border: "none", color: "rgba(255,255,255,0.5)",
            fontWeight: 600, fontSize: 14, cursor: "pointer", padding: "8px 0",
          }}
        >
          ← {t("postJob.previousQuestion")}
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// STEP 3: SUCCESS
// ══════════════════════════════════════════════════════════════
function StepSuccess({ form, t }: { form: JobFormData; t: (key: string) => string }) {
  const [, navigate] = useLocation();
  const selectedCat = CATEGORIES.find(c => c.id === form.category);

  return (
    <div style={{ textAlign: "center", padding: "40px 0" }}>
      {/* Success animation */}
      <div style={{
        width: 80, height: 80, borderRadius: "50%",
        background: "rgba(16,185,129,0.15)", border: "3px solid #10B981",
        display: "flex", alignItems: "center", justifyContent: "center",
        margin: "0 auto 24px",
      }}>
        <Check size={40} style={{ color: "#10B981" }} />
      </div>

      <h2 style={{ fontWeight: 900, fontSize: 28, color: "white", marginBottom: 12 }}>
        {t("postJob.success.title")}
      </h2>
      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 40, maxWidth: 420, margin: "0 auto 40px" }}>
        {t("postJob.success.desc")}
      </p>

      {/* Job summary card */}
      <div style={{
        background: "rgba(255,255,255,0.04)", borderRadius: 16,
        padding: 28, border: "1px solid rgba(255,255,255,0.08)",
        textAlign: "start", maxWidth: 480, margin: "0 auto 32px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          {selectedCat && (
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: `${selectedCat.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <selectedCat.icon size={22} style={{ color: selectedCat.color }} />
            </div>
          )}
          <div>
            <p style={{ fontWeight: 700, fontSize: 16, color: "white" }}>{t(`postJob.cat.${form.category}`)}</p>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
              {t(`postJob.gov.${form.governorate}`)} · {t(`postJob.urgency.${form.urgency}`)}
            </p>
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, lineHeight: 1.6 }}>
          {form.description.slice(0, 150)}{form.description.length > 150 ? "..." : ""}
        </p>
        {form.budget && (
          <div style={{ marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(249,115,22,0.1)", borderRadius: 8, padding: "6px 12px" }}>
            <span style={{ color: "#F97316", fontWeight: 600, fontSize: 13 }}>{t(`postJob.budget.${form.budget}`)}</span>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/")}
        className="btn-primary"
        style={{ fontSize: 14, padding: "14px 32px" }}
      >
        {t("postJob.backToHome")}
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN POST JOB PAGE
// ══════════════════════════════════════════════════════════════
export default function PostJob() {
  const { t: _t, lang } = useLang();
  const t = _t as (key: string) => string;
  const isRTL = lang === "ar";
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const [form, setForm] = useState<JobFormData>({
    category: "",
    subCategory: "",
    description: "",
    governorate: "",
    urgency: "asap",
    specificDate: "",
    budget: "",
    photos: [],
    questionnaireAnswers: {},
  });

  const hasQuestionnaire = !!(QUESTIONNAIRES[form.category] && QUESTIONNAIRES[form.category].length > 0);
  const totalSteps = hasQuestionnaire ? 3 : 2;

  const validateStep1 = () => {
    const newErrors: Record<string, boolean> = {};
    if (!form.category) newErrors.category = true;
    if (form.description.length < 20) newErrors.description = true;
    if (!form.governorate) newErrors.governorate = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateStep1()) return;
      if (hasQuestionnaire) {
        setStep(2);
      } else {
        setStep(totalSteps); // Go to success
      }
    } else if (step === 2) {
      setStep(3);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLastFormStep = (hasQuestionnaire && step === 2) || (!hasQuestionnaire && step === 1);
  const isSuccess = (hasQuestionnaire && step === 3) || (!hasQuestionnaire && step === 2);
  const Arrow = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div style={{ minHeight: "100vh", background: "#111" }}>
      <PostJobNavbar />

      <div className="container" style={{ paddingTop: 100, paddingBottom: 60 }}>
        {/* Page header */}
        {!isSuccess && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(249,115,22,0.12)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 100, padding: "6px 14px", marginBottom: 16 }}>
              <Briefcase size={14} style={{ color: "#F97316" }} />
              <span style={{ fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: "#F97316", letterSpacing: "0.08em" }}>
                {t("postJob.badge")}
              </span>
            </div>
            <h1 style={{ fontWeight: 900, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "white", lineHeight: 1.1, marginBottom: 8 }}>
              {t("postJob.title")}
            </h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 16, maxWidth: 500 }}>
              {t("postJob.subtitle")}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left sidebar: Step indicator (desktop) */}
          {!isSuccess && (
            <div className="hidden lg:block lg:col-span-3">
              <div style={{ position: "sticky", top: 100 }}>
                <StepIndicator currentStep={step} totalSteps={totalSteps} t={t} />

                {/* Trust signals */}
                <div style={{ marginTop: 40, padding: 20, background: "rgba(255,255,255,0.03)", borderRadius: 12, border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>{t("postJob.whyPost")}</p>
                  {["trust1", "trust2", "trust3"].map(key => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                      <Check size={16} style={{ color: "#10B981", flexShrink: 0 }} />
                      <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>{t(`postJob.${key}`)}</span>
                    </div>
                  ))}
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
                    {t("postJob.stepOf").replace("{current}", String(step)).replace("{total}", String(totalSteps))}
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

            {step === 1 && (
              <StepJobDetails form={form} setForm={setForm} errors={errors} t={t} isRTL={isRTL} />
            )}
            {step === 2 && hasQuestionnaire && (
              <StepQuestionnaire form={form} setForm={setForm} t={t} />
            )}
            {isSuccess && (
              <StepSuccess form={form} t={t} />
            )}

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
                    {t("postJob.back")}
                  </button>
                ) : <div />}

                <div style={{ display: "flex", gap: 10 }}>
                  {step === 2 && hasQuestionnaire && (
                    <button onClick={() => setStep(3)} style={{
                      background: "none", border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 10, padding: "12px 24px",
                      color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: 14,
                      cursor: "pointer", transition: "all 0.2s",
                    }}>
                      {t("postJob.skip")}
                    </button>
                  )}
                  <button onClick={handleNext} className="btn-primary" style={{ fontSize: 14, padding: "12px 28px" }}>
                    {isLastFormStep ? t("postJob.submit") : t("postJob.next")}
                    <Arrow size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar: Live preview (desktop) */}
          {!isSuccess && step === 1 && (
            <div className="hidden lg:block lg:col-span-3">
              <div style={{ position: "sticky", top: 100 }}>
                <p style={{ fontWeight: 700, fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {t("postJob.preview")}
                </p>
                <div style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 16,
                  padding: 20, border: "1px solid rgba(255,255,255,0.08)",
                }}>
                  {/* Mini job card preview */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ color: "#10B981", fontWeight: 700, fontSize: 11, textTransform: "uppercase" }}>{t("postJob.previewLive")}</span>
                  </div>

                  {form.category ? (
                    <>
                      <p style={{ fontWeight: 700, fontSize: 16, color: "white", marginBottom: 6 }}>
                        {t(`postJob.cat.${form.category}`)}
                      </p>
                      {form.governorate && (
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                          <MapPin size={13} style={{ color: "rgba(255,255,255,0.4)" }} />
                          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>{t(`postJob.gov.${form.governorate}`)}</span>
                        </div>
                      )}
                      {form.description && (
                        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>
                          {form.description.slice(0, 80)}{form.description.length > 80 ? "..." : ""}
                        </p>
                      )}
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {form.urgency && (
                          <span style={{
                            background: "rgba(249,115,22,0.1)", color: "#F97316",
                            padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          }}>
                            <Clock size={11} style={{ display: "inline", marginRight: 4, verticalAlign: "middle" }} />
                            {t(`postJob.urgency.${form.urgency}`)}
                          </span>
                        )}
                        {form.budget && (
                          <span style={{
                            background: "rgba(16,185,129,0.1)", color: "#10B981",
                            padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                          }}>
                            {t(`postJob.budget.${form.budget}`)}
                          </span>
                        )}
                      </div>
                      {form.photos.length > 0 && (
                        <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
                          {form.photos.slice(0, 3).map((p, i) => (
                            <img key={i} src={URL.createObjectURL(p)} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                          ))}
                          {form.photos.length > 3 && (
                            <div style={{
                              width: 48, height: 48, borderRadius: 8,
                              background: "rgba(255,255,255,0.08)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600,
                            }}>
                              +{form.photos.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, fontStyle: "italic" }}>
                      {t("postJob.previewEmpty")}
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
