import { type ReactNode, useMemo, useState } from "react";
import {
  Bell,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  Globe,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  WalletCards,
} from "lucide-react";
import { toast } from "sonner";
import { useLang } from "@/contexts/LanguageContext";

type JobStatus = "Open" | "Applied" | "Shortlisted" | "Hired";
type BidStatus = Exclude<JobStatus, "Open">;

type Job = {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: string;
  postedAgo: string;
  description: string;
  materialsHint: string;
  status: JobStatus;
  saved?: boolean;
};

type Bid = {
  id: string;
  jobId: string;
  jobTitle: string;
  amount: string;
  timeline: string;
  materials: string;
  message: string;
  status: BidStatus;
  updatedAt: string;
};

type NotificationItem = {
  id: string;
  title: string;
  detail: string;
  read: boolean;
};

const categoryAr: Record<string, string> = {
  Renovation: "تجديد وبناء",
  Electrical: "كهرباء",
  Plumbing: "سباكة",
  Painting: "دهان وتشطيب",
};

const jobArCopy: Record<
  string,
  {
    title: string;
    location: string;
    budget: string;
    postedAgo: string;
    description: string;
    materialsHint: string;
  }
> = {
  "job-1": {
    title: "تجديد مطبخ",
    location: "القاهرة",
    budget: "120,000 - 180,000 ج.م",
    postedAgo: "من ساعتين",
    description: "تجديد كامل للمطبخ: كابينات حديثة + أرضيات + دهان.",
    materialsHint: "العميل عايز خامات بجودة متوسطة.",
  },
  "job-2": {
    title: "تمديدات كهرباء لفيلا",
    location: "القاهرة الجديدة",
    budget: "40,000 - 60,000 ج.م",
    postedAgo: "من 4 ساعات",
    description: "إعادة سلك كهرباء لدارات قديمة وتركيب قواطع جديدة لفيلا من 3 طوابق.",
    materialsHint: "المحترف يقدر يوفّر كابلات وقواطع.",
  },
  "job-3": {
    title: "إصلاح سباكة حمام",
    location: "الجيزة",
    budget: "6,000 - 10,000 ج.م",
    postedAgo: "من يوم",
    description: "إصلاح تسريب المواسير واستبدال التركيبات التالفة في حمام رئيسي.",
    materialsHint: "العميل اشترى الخامات/التركيبات بالفعل.",
  },
  "job-4": {
    title: "دهان داخلي لمكتب",
    location: "الإسكندرية",
    budget: "15,000 - 22,000 ج.م",
    postedAgo: "من يومين",
    description: "دهان داخلي لمكتب مساحته 400 متر مع مدة تنفيذ سريعة.",
    materialsHint: "براند الدهان محدد من قبل العميل.",
  },
};

function ff(base: "poppins" | "barlow" | "inter", lang: "en" | "ar") {
  const fonts = { poppins: "'Poppins'", barlow: "'Barlow'", inter: "'Inter'" };
  return lang === "ar" ? `'Noto Naskh Arabic', ${fonts[base]}, sans-serif` : `${fonts[base]}, sans-serif`;
}

const initialJobs: Job[] = [
  {
    id: "job-1",
    title: "Kitchen Renovation",
    category: "Renovation",
    location: "Cairo",
    budget: "EGP 120,000 - 180,000",
    postedAgo: "2h ago",
    description: "Full kitchen remodel with modern cabinets, flooring, and repainting.",
    materialsHint: "Client wants mid-range quality materials.",
    status: "Open",
  },
  {
    id: "job-2",
    title: "Villa Electrical Rewiring",
    category: "Electrical",
    location: "New Cairo",
    budget: "EGP 40,000 - 60,000",
    postedAgo: "4h ago",
    description: "Rewire old circuits and install new breakers for a 3-floor villa.",
    materialsHint: "Professional can supply cables and breakers.",
    status: "Open",
    saved: true,
  },
  {
    id: "job-3",
    title: "Bathroom Plumbing Fix",
    category: "Plumbing",
    location: "Giza",
    budget: "EGP 6,000 - 10,000",
    postedAgo: "1d ago",
    description: "Fix leaking pipes and replace damaged fittings in master bathroom.",
    materialsHint: "Client already purchased fittings.",
    status: "Shortlisted",
  },
  {
    id: "job-4",
    title: "Office Interior Painting",
    category: "Painting",
    location: "Alexandria",
    budget: "EGP 15,000 - 22,000",
    postedAgo: "2d ago",
    description: "Indoor painting for 400 sqm office with quick turnaround.",
    materialsHint: "Paint brand already selected by client.",
    status: "Hired",
  },
];

export default function ProfessionalDashboard() {
  const { lang, toggleLang } = useLang();
  const isAr = lang === "ar";
  const jobCopy = (jobId: string) => jobArCopy[jobId];

  const text = {
    pageBadge: isAr ? "لوحة المحترفين" : "Professional Dashboard",
    pageTitle: isAr ? "إدارة الشغل والعروض في مكان واحد" : "Manage jobs and bids in one place",
    pageDesc: isAr
      ? "حساب تجريبي كمحترف مسجل. تقدر تتصفح كل الشغلانات، تعمل عرض، وتتابع حالته."
      : "Temporary mock logged-in professional account. Browse all jobs, bid, and track status.",
    tabs: {
      jobs: isAr ? "كل الشغلانات" : "All Jobs",
      bids: isAr ? "عروضي" : "My Bids",
      saved: isAr ? "المحفوظة" : "Saved Jobs",
      profile: isAr ? "الملف المهني" : "Profile",
    },
    bidNow: isAr ? "اعمل عرض" : "Bid Now",
    save: isAr ? "حفظ" : "Save",
    saved: isAr ? "محفوظ" : "Saved",
    notifications: isAr ? "الإشعارات" : "Notifications",
    noNotifications: isAr ? "لا يوجد إشعارات جديدة" : "No new notifications",
    bidFormTitle: isAr ? "تقديم عرض" : "Submit Bid",
    amount: isAr ? "قيمة العرض (EGP)" : "Bid Amount (EGP)",
    timeline: isAr ? "المدة المتوقعة" : "Timeline",
    materials: isAr ? "المواد المطلوبة/المتاحة" : "Materials",
    message: isAr ? "رسالة للعميل" : "Message to Client",
    submitBid: isAr ? "إرسال العرض" : "Send Bid",
    cancel: isAr ? "إلغاء" : "Cancel",
  };

  const [activeTab, setActiveTab] = useState<"jobs" | "bids" | "saved" | "profile">("jobs");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "n1",
      title: isAr ? "شغلانة جديدة مناسبة" : "New matching job",
      detail: isAr ? "فيلا كهرباء - القاهرة الجديدة" : "Villa Electrical Rewiring - New Cairo",
      read: false,
    },
    {
      id: "n2",
      title: isAr ? "تم قبول عرضك مبدئياً" : "Your bid was shortlisted",
      detail: isAr ? "إصلاح سباكة الحمام - الجيزة" : "Bathroom Plumbing Fix - Giza",
      read: false,
    },
  ]);
  const [bids, setBids] = useState<Bid[]>([
    {
      id: "b1",
      jobId: "job-3",
      jobTitle: "Bathroom Plumbing Fix",
      amount: "EGP 8,500",
      timeline: "2 days",
      materials: "Client materials + extra sealant",
      message: "Can start tomorrow morning.",
      status: "Shortlisted",
      updatedAt: "1h ago",
    },
    {
      id: "b2",
      jobId: "job-4",
      jobTitle: "Office Interior Painting",
      amount: "EGP 19,000",
      timeline: "5 days",
      materials: "Paint by client, tools by me",
      message: "Team of 3 painters available.",
      status: "Hired",
      updatedAt: "3h ago",
    },
  ]);
  const [filter, setFilter] = useState("All");
  const [activeBidJob, setActiveBidJob] = useState<Job | null>(null);
  const [amount, setAmount] = useState("");
  const [timeline, setTimeline] = useState("");
  const [materials, setMaterials] = useState("");
  const [message, setMessage] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const categories = useMemo(() => ["All", ...Array.from(new Set(jobs.map((j) => j.category)))], [jobs]);
  const filteredJobs = jobs.filter((j) => filter === "All" || j.category === filter);
  const savedJobs = jobs.filter((j) => j.saved);

  const statusBadge = (status: JobStatus | BidStatus) => {
    const colors: Record<JobStatus | BidStatus, { bg: string; color: string }> = {
      Open: { bg: "rgba(34,197,94,0.14)", color: "#22c55e" },
      Applied: { bg: "rgba(59,130,246,0.14)", color: "#60a5fa" },
      Shortlisted: { bg: "rgba(249,115,22,0.14)", color: "#f97316" },
      Hired: { bg: "rgba(168,85,247,0.14)", color: "#c084fc" },
    };
    const style = colors[status];
    const label = isAr
      ? ({
        Open: "مفتوح",
        Applied: "تم إرسال عرض",
        Shortlisted: "مرشح",
        Hired: "تم التوظيف",
      } as const)[status]
      : status;

    return (
      <span
        style={{
          background: style.bg,
          color: style.color,
          border: `1px solid ${style.color}40`,
          borderRadius: 999,
          fontFamily: ff("inter", lang),
          fontWeight: 700,
          fontSize: 11,
          padding: "4px 10px",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    );
  };

  function toggleSave(jobId: string) {
    setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, saved: !j.saved } : j)));
  }

  function openBid(job: Job) {
    setActiveBidJob(job);
    setAmount("");
    setTimeline("");
    setMaterials(isAr ? jobCopy(job.id)?.materialsHint ?? job.materialsHint : job.materialsHint);
    setMessage("");
  }

  function submitBid() {
    if (!activeBidJob) return;
    if (!amount.trim() || !timeline.trim() || !materials.trim()) {
      toast.error(isAr ? "من فضلك كمل بيانات العرض الأساسية" : "Please complete amount, timeline, and materials");
      return;
    }
    const newBid: Bid = {
      id: `b-${Date.now()}`,
      jobId: activeBidJob.id,
      jobTitle: activeBidJob.title,
      amount: `EGP ${amount.replace(/[^\d]/g, "") || amount}`,
      timeline,
      materials,
      message,
      status: "Applied",
      updatedAt: isAr ? "الآن" : "just now",
    };
    setBids((prev) => [newBid, ...prev]);
    setJobs((prev) => prev.map((j) => (j.id === activeBidJob.id ? { ...j, status: "Applied" } : j)));
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        title: isAr ? "تم إرسال عرضك بنجاح" : "Bid submitted successfully",
        detail: isAr ? jobCopy(activeBidJob.id)?.title ?? activeBidJob.title : activeBidJob.title,
        read: false,
      },
      ...prev,
    ]);
    toast.success(isAr ? "تم إرسال العرض" : "Bid submitted");
    setActiveBidJob(null);
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "white" }}>
      <section style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "linear-gradient(180deg, #161616, #0f0f0f)" }}>
        <div className="container" style={{ paddingTop: 34, paddingBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p className="section-label" style={{ marginBottom: 10, fontFamily: ff("poppins", lang) }}>{text.pageBadge}</p>
              <h1 style={{ fontFamily: ff("poppins", lang), fontWeight: 900, fontSize: "clamp(1.5rem, 3.5vw, 2.7rem)", marginBottom: 8 }}>
                {text.pageTitle}
              </h1>
              <p style={{ fontFamily: ff("barlow", lang), color: "rgba(255,255,255,0.62)", fontSize: 15, maxWidth: 780 }}>
                {text.pageDesc}
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
              <button
                onClick={toggleLang}
                title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  borderRadius: 10,
                  padding: "6px 12px",
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(255,255,255,0.8)",
                  fontFamily: ff("poppins", lang),
                  fontWeight: 600,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(249,115,22,0.15)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(249,115,22,0.3)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
              >
                <Globe size={16} />
                <span>{lang === "en" ? "عربي" : "EN"}</span>
              </button>

              <div style={{ position: "relative" }}>
              <button
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  markAllRead();
                }}
                style={{
                  position: "relative",
                  width: 46,
                  height: 46,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.15)",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -6,
                      right: -6,
                      minWidth: 20,
                      height: 20,
                      borderRadius: 10,
                      background: "#f97316",
                      color: "white",
                      border: "2px solid #0f0f0f",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: ff("inter", lang),
                      fontWeight: 700,
                      fontSize: 11,
                      padding: "0 4px",
                    }}
                  >
                    {unreadCount}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: "absolute",
                    top: 58,
                    ...(isAr ? { left: 0 } : { right: 0 }),
                    width: "min(340px, calc(100vw - 32px))",
                    zIndex: 40,
                    background: "#1a1a1a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14,
                    boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
                    padding: 14,
                  }}
                >
                  <div style={{ fontFamily: ff("poppins", lang), fontWeight: 800, fontSize: 13, marginBottom: 10 }}>{text.notifications}</div>
                  {notifications.length === 0 && (
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontFamily: ff("barlow", lang) }}>{text.noNotifications}</p>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        background: n.read ? "rgba(255,255,255,0.03)" : "rgba(249,115,22,0.08)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: 10,
                        padding: 10,
                        marginBottom: 8,
                      }}
                    >
                      <div style={{ fontFamily: ff("barlow", lang), fontWeight: 700, fontSize: 13 }}>{n.title}</div>
                      <div style={{ fontFamily: ff("inter", lang), fontSize: 12, color: "rgba(255,255,255,0.58)" }}>{n.detail}</div>
                    </div>
                  ))}
                </div>
              )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 22, overflowX: "auto", flexWrap: "nowrap", paddingBottom: 4, scrollbarWidth: "none" }}>
            {[
              { id: "jobs", label: text.tabs.jobs, icon: <Briefcase size={15} /> },
              { id: "bids", label: text.tabs.bids, icon: <WalletCards size={15} /> },
              { id: "saved", label: text.tabs.saved, icon: <Star size={15} /> },
              { id: "profile", label: text.tabs.profile, icon: <Settings size={15} /> },
            ].map((tab) => {
              const selected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "jobs" | "bids" | "saved" | "profile")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 8,
                    border: selected ? "1px solid rgba(249,115,22,0.45)" : "1px solid rgba(255,255,255,0.12)",
                    background: selected ? "rgba(249,115,22,0.16)" : "rgba(255,255,255,0.04)",
                    color: selected ? "#f97316" : "rgba(255,255,255,0.78)",
                    padding: "10px 16px",
                    fontFamily: ff("poppins", lang),
                    fontWeight: 700,
                    fontSize: 13,
                    flexShrink: 0,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section style={{ paddingTop: 24, paddingBottom: 56 }}>
        <div className="container">
          {activeTab === "jobs" && (
            <>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 16 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.72)", fontFamily: ff("barlow", lang), fontSize: 14 }}>
                  <Filter size={14} /> {isAr ? "تصفية" : "Filter"}
                </span>
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setFilter(c)}
                    style={{
                      borderRadius: 999,
                      border: filter === c ? "1px solid rgba(249,115,22,0.4)" : "1px solid rgba(255,255,255,0.1)",
                      background: filter === c ? "rgba(249,115,22,0.16)" : "rgba(255,255,255,0.03)",
                      color: filter === c ? "#f97316" : "rgba(255,255,255,0.72)",
                      padding: "6px 12px",
                      fontFamily: ff("inter", lang),
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {c === "All" ? (isAr ? "الكل" : "All") : isAr ? categoryAr[c] ?? c : c}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    style={{
                      background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 16,
                      padding: 18,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <h3 style={{ margin: 0, fontFamily: ff("poppins", lang), fontWeight: 800, fontSize: 18 }}>
                          {isAr ? jobCopy(job.id)?.title ?? job.title : job.title}
                        </h3>
                        <div style={{ display: "flex", gap: 10, marginTop: 6, color: "rgba(255,255,255,0.58)", fontFamily: ff("inter", lang), fontSize: 12, flexWrap: "wrap" }}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <MapPin size={12} /> {isAr ? jobCopy(job.id)?.location ?? job.location : job.location}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Clock3 size={12} /> {isAr ? jobCopy(job.id)?.postedAgo ?? job.postedAgo : job.postedAgo}
                          </span>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                            <Briefcase size={12} /> {isAr ? categoryAr[job.category] ?? job.category : job.category}
                          </span>
                        </div>
                      </div>
                      {statusBadge(job.status)}
                    </div>

                    <p style={{ margin: "0 0 8px", fontFamily: ff("barlow", lang), color: "rgba(255,255,255,0.78)" }}>
                      {isAr ? jobCopy(job.id)?.description ?? job.description : job.description}
                    </p>
                    <p style={{ margin: "0 0 16px", fontFamily: ff("inter", lang), color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
                      {isAr ? jobCopy(job.id)?.materialsHint ?? job.materialsHint : job.materialsHint}
                    </p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                      <div style={{ color: "#f97316", fontFamily: ff("poppins", lang), fontWeight: 800, fontSize: 14 }}>
                        {isAr ? jobCopy(job.id)?.budget ?? job.budget : job.budget}
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => openBid(job)}
                        className="btn-primary"
                        style={{ flex: 1, padding: "12px 16px", fontSize: 14, letterSpacing: "0.04em" }}
                        disabled={job.status === "Hired"}
                      >
                        {text.bidNow}
                      </button>
                      <button
                        onClick={() => toggleSave(job.id)}
                        style={{
                          borderRadius: 8,
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: job.saved ? "rgba(249,115,22,0.18)" : "rgba(255,255,255,0.05)",
                          color: job.saved ? "#f97316" : "rgba(255,255,255,0.75)",
                          padding: "12px 16px",
                          fontFamily: ff("poppins", lang),
                          fontWeight: 700,
                          fontSize: 14,
                          flexShrink: 0,
                          cursor: "pointer",
                        }}
                      >
                        {job.saved ? text.saved : text.save}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "bids" && (
            <div className="grid grid-cols-1 gap-4">
              {bids.map((bid) => (
                <div key={bid.id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontFamily: ff("poppins", lang), fontWeight: 800, fontSize: 16 }}>
                      {isAr ? jobCopy(bid.jobId)?.title ?? bid.jobTitle : bid.jobTitle}
                    </h3>
                    {statusBadge(bid.status)}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 8 }}>
                    <Info
                      icon={<WalletCards size={14} />}
                      label={isAr ? "المبلغ" : "Amount"}
                      value={isAr ? bid.amount.replace(/^EGP\s/, "ج.م ") : bid.amount}
                      lang={lang}
                    />
                    <Info icon={<CalendarDays size={14} />} label={isAr ? "المدة" : "Timeline"} value={bid.timeline} lang={lang} />
                    <Info icon={<MessageSquare size={14} />} label={isAr ? "آخر تحديث" : "Last update"} value={bid.updatedAt} lang={lang} />
                  </div>
                  <p style={{ margin: "12px 0 4px", color: "rgba(255,255,255,0.7)", fontFamily: ff("barlow", lang), fontSize: 14 }}>
                    <strong>{isAr ? "المواد:" : "Materials:"}</strong> {bid.materials}
                  </p>
                  {bid.message && (
                    <p style={{ margin: "0", color: "rgba(255,255,255,0.62)", fontFamily: ff("inter", lang), fontSize: 13 }}>
                      <strong>{isAr ? "رسالة:" : "Message:"}</strong> {bid.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "saved" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {savedJobs.length === 0 && (
                <p style={{ margin: 0, color: "rgba(255,255,255,0.62)", fontFamily: ff("barlow", lang) }}>
                  {isAr ? "مفيش شغلانات محفوظة حالياً." : "No saved jobs yet."}
                </p>
              )}
              {savedJobs.map((job) => (
                <div key={job.id} style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 16 }}>
                  <h3 style={{ margin: 0, fontFamily: ff("poppins", lang), fontWeight: 800 }}>
                    {isAr ? jobCopy(job.id)?.title ?? job.title : job.title}
                  </h3>
                  <p style={{ margin: "8px 0 12px", fontFamily: ff("barlow", lang), color: "rgba(255,255,255,0.7)" }}>
                    {isAr ? jobCopy(job.id)?.location ?? job.location : job.location} - {isAr ? jobCopy(job.id)?.budget ?? job.budget : job.budget}
                  </p>
                  <button className="btn-primary" style={{ padding: "12px 20px", fontSize: 14 }} onClick={() => openBid(job)}>
                    {text.bidNow}
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === "profile" && (
            <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#f97316", display: "grid", placeItems: "center", fontFamily: ff("poppins", lang), fontWeight: 900 }}>
                  AK
                </div>
                <div>
                  <h3 style={{ margin: 0, fontFamily: ff("poppins", lang), fontSize: 18 }}>Ahmed Kamal</h3>
                  <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.62)", fontFamily: ff("inter", lang), fontSize: 13 }}>
                    {isAr ? "محترف موثّق - تجديد وكهرباء" : "Verified Professional - Renovation & Electrical"}
                  </p>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 10 }}>
                <Info icon={<Star size={14} />} label={isAr ? "التقييم" : "Rating"} value="4.8 / 5.0" lang={lang} />
                <Info icon={<CheckCircle2 size={14} />} label={isAr ? "المشاريع المكتملة" : "Completed Jobs"} value="96" lang={lang} />
                <Info icon={<MapPin size={14} />} label={isAr ? "الموقع" : "Location"} value="Cairo" lang={lang} />
              </div>
            </div>
          )}
        </div>
      </section>

      {activeBidJob && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 60, display: "flex", alignItems: "flex-end", justifyContent: "center", padding: "0 0 0 0" }} className="sm:items-center sm:p-4">
          <div style={{ width: "min(560px,100%)", background: "#171717", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px 16px 0 0", padding: 20, maxHeight: "90vh", overflowY: "auto" }} className="sm:rounded-2xl">
            <h3 style={{ margin: "0 0 6px", fontFamily: ff("poppins", lang), fontWeight: 800 }}>
              {text.bidFormTitle}: {isAr ? jobCopy(activeBidJob.id)?.title ?? activeBidJob.title : activeBidJob.title}
            </h3>
            <p style={{ margin: "0 0 14px", color: "rgba(255,255,255,0.6)", fontFamily: ff("barlow", lang), fontSize: 14 }}>
              {isAr ? jobCopy(activeBidJob.id)?.location ?? activeBidJob.location : activeBidJob.location} -{" "}
              {isAr ? jobCopy(activeBidJob.id)?.budget ?? activeBidJob.budget : activeBidJob.budget}
            </p>

            <Label title={text.amount} lang={lang} />
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={isAr ? "مثال: 25000" : "e.g. 25000"}
              style={inputStyle(lang)}
            />

            <Label title={text.timeline} lang={lang} />
            <input
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              placeholder={isAr ? "مثال: 7 أيام" : "e.g. 7 days"}
              style={inputStyle(lang)}
            />

            <Label title={text.materials} lang={lang} />
            <textarea value={materials} onChange={(e) => setMaterials(e.target.value)} rows={3} style={inputStyle(lang)} />

            <Label title={text.message} lang={lang} />
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3} style={inputStyle(lang)} />

            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setActiveBidJob(null)}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.04)",
                  color: "white",
                  padding: "13px 16px",
                  fontFamily: ff("poppins", lang),
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {text.cancel}
              </button>
              <button className="btn-primary" style={{ flex: 2, padding: "13px 16px", fontSize: 14 }} onClick={submitBid}>
                {text.submitBid}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Label({ title, lang }: { title: string; lang: "en" | "ar" }) {
  return (
    <div style={{ margin: "10px 0 6px", color: "rgba(255,255,255,0.8)", fontFamily: ff("poppins", lang), fontWeight: 700, fontSize: 12 }}>
      {title}
    </div>
  );
}

function Info({ icon, label, value, lang }: { icon: ReactNode; label: string; value: string; lang: "en" | "ar" }) {
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 10 }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.52)", fontFamily: ff("inter", lang), fontSize: 12 }}>
        {icon} {label}
      </div>
      <div style={{ marginTop: 5, color: "white", fontFamily: ff("poppins", lang), fontWeight: 700, fontSize: 14 }}>{value}</div>
    </div>
  );
}

function inputStyle(lang: "en" | "ar") {
  return {
    width: "100%",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.03)",
    color: "white",
    padding: "10px 12px",
    fontFamily: ff("inter", lang),
    fontSize: 14,
    outline: "none",
  } as const;
}
