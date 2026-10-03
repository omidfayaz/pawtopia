"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CalendarDays, LayoutDashboard, LogOut, PawPrint, RefreshCw, Stethoscope, UserRound } from "lucide-react";
import { clinicApi, SESSION_KEY } from "./api";

const ClinicContext = createContext(null);
export const useClinic = () => useContext(ClinicContext);

const menu = [
  { href: "/clinic", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/clinic/appointments", label: "نوبت‌ها", icon: CalendarDays },
  { href: "/clinic/management", label: "داشبورد مدیر", icon: BarChart3, managerOnly: true },
];

export default function ClinicShell({ children }) {
  const pathname = usePathname();
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [clinics, setClinics] = useState([]);
  const [clinicId, setClinicId] = useState(null);
  const [members, setMembers] = useState([]);
  const [role, setRole] = useState(null);
  const [stage, setStage] = useState("loading");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const restore = useCallback(async (accessToken, signal) => {
    try {
      const [account, availableClinics] = await Promise.all([
        clinicApi.me(accessToken, signal), clinicApi.clinics(signal),
      ]);
      if (signal?.aborted) return;
      setToken(accessToken);
      setUser(account);
      setClinics(availableClinics);
      if (account.role !== "ClinicStaff" && account.role !== "Vet") {
        setStage("denied");
        return;
      }
      setStage("select");
    } catch (cause) {
      if (signal?.aborted) return;
      if (cause.status === 401) {
        sessionStorage.removeItem(SESSION_KEY);
        setStage("login");
      } else {
        setError(cause.message);
        setStage("error");
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) queueMicrotask(() => { if (!controller.signal.aborted) restore(saved, controller.signal); });
    else queueMicrotask(() => { if (!controller.signal.aborted) setStage("login"); });
    return () => controller.abort();
  }, [restore]);

  async function signIn(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await clinicApi.login(form.get("email"), form.get("password"));
      sessionStorage.setItem(SESSION_KEY, result.accessToken);
      await restore(result.accessToken);
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  async function selectClinic(id) {
    setBusy(true);
    setError("");
    try {
      let list = [];
      let memberRole = user.role === "Vet" ? "Vet" : "Secretary";
      try {
        list = await clinicApi.members(id, token);
        const ownMembership = list.find((member) => member.userId === user.id && member.isActive);
        if (!ownMembership) throw new Error("عضویت فعال شما در این کلینیک پیدا نشد.");
        memberRole = ownMembership.roleInClinic;
      } catch (cause) {
        if (cause.status !== 403) throw cause;
        // The members endpoint is manager-only. Appointment access validates
        // active membership for secretaries and veterinarians.
        await clinicApi.appointments(id, token);
      }
      setMembers(list);
      setRole(memberRole);
      setClinicId(id);
      setStage("ready");
    } catch (cause) { setError(cause.message); }
    finally { setBusy(false); }
  }

  function signOut() {
    sessionStorage.removeItem(SESSION_KEY);
    setToken(null); setUser(null); setClinicId(null); setClinics([]); setMembers([]); setRole(null);
    setError(""); setStage("login");
  }

  const clinic = clinics.find((item) => item.id === clinicId);
  if (stage !== "ready") {
    return <main className="clinic-entry" dir="rtl">
      <div className="clinic-entry-card">
        <div className="clinic-entry-brand"><PawPrint size={32} /> پاتوپیا</div>
        {stage === "loading" && <p>در حال بررسی نشست…</p>}
        {stage === "login" && <>
          <h1>ورود به فضای کلینیک</h1>
          <p>با حساب پرسنل یا دامپزشک وارد شوید.</p>
          <form onSubmit={signIn} className="clinic-entry-form">
            <label>ایمیل<input name="email" type="email" autoComplete="username" required placeholder="name@clinic.com" dir="ltr" /></label>
            <label>رمز عبور<input name="password" type="password" autoComplete="current-password" required /></label>
            {error && <p role="alert" className="clinic-error">{error}</p>}
            <button type="submit" className="clinic-primary" disabled={busy}>{busy ? "در حال ورود…" : "ورود به پنل"}</button>
          </form>
        </>}
        {stage === "select" && <>
          <h1>کلینیک خود را انتخاب کنید</h1>
          <p>فقط کلینیک‌هایی که عضو فعالشان هستید باز می‌شوند.</p>
          <div className="clinic-choice-list">{clinics.map((item) =>
            <button key={item.id} onClick={() => selectClinic(item.id)} disabled={busy} className="clinic-choice">
              <Stethoscope size={20} /><span>{item.name}<small>{item.city}</small></span>
            </button>)}</div>
          {clinics.length === 0 && <p>هنوز کلینیک فعالی ثبت نشده است.</p>}
          {error && <p role="alert" className="clinic-error">{error}</p>}
          <button type="button" className="clinic-text-button" onClick={signOut}>خروج از حساب</button>
        </>}
        {stage === "denied" && <><h1>دسترسی کلینیک ندارید</h1><p>این حساب، نقش پرسنل یا دامپزشک ندارد.</p><button onClick={signOut} className="clinic-primary">ورود با حساب دیگر</button></>}
        {stage === "error" && <><h1>اتصال به سرویس برقرار نشد</h1><p role="alert">{error}</p><button onClick={() => restore(sessionStorage.getItem(SESSION_KEY))} className="clinic-primary">تلاش دوباره</button></>}
      </div>
    </main>;
  }

  return <ClinicContext.Provider value={{ token, user, clinic, clinicId, role, members }}>
    <div className="clinic-shell" dir="rtl">
      <aside className="clinic-sidebar">
        <Link href="/" className="clinic-logo"><PawPrint size={34} /><span>پاتوپیا<small>مدیریت کلینیک دامپزشکی</small></span></Link>
        <nav aria-label="ناوبری کلینیک">{menu.filter((item) => !item.managerOnly || ["Owner", "Manager"].includes(role)).map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={pathname === href ? "active" : ""}><Icon size={20}/>{label}</Link>)}</nav>
        <div className="clinic-sidebar-note">حال خوب حیوانات، آغاز دنیای بهتر است. <PawPrint size={20}/></div>
      </aside>
      <div className="clinic-workspace">
        <header className="clinic-topbar">
          <div className="clinic-heading"><strong>{clinic?.name}</strong><span>{clinic?.city} · پنل کلینیک</span></div>
          <div className="clinic-topbar-actions">
            <button type="button" onClick={() => { setClinicId(null); setStage("select"); }} title="تغییر کلینیک" className="clinic-icon-button"><RefreshCw size={18}/><span>تغییر کلینیک</span></button>
            <span className="clinic-user"><UserRound size={20}/><span>{user.firstName} {user.lastName}<small>{role === "Secretary" ? "منشی" : role === "Vet" ? "دامپزشک" : "مدیریت کلینیک"}</small></span></span>
            <button type="button" onClick={signOut} title="خروج" aria-label="خروج" className="clinic-icon-button"><LogOut size={19}/></button>
          </div>
        </header>
        <div className="clinic-content">{children}</div>
      </div>
    </div>
  </ClinicContext.Provider>;
}
