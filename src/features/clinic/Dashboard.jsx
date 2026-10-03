"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock3, RefreshCw, ArrowLeft, UsersRound } from "lucide-react";
import { useAppointments } from "./useAppointments";
import { appointmentDateKey, localDateKey, persianDate } from "./date";
import AppointmentTable from "./AppointmentTable";

export default function Dashboard() {
  const router = useRouter();
  const { appointments, vets, loading, error, refresh } = useAppointments();
  const today = localDateKey();
  const daily = appointments.filter((item) => appointmentDateKey(item.scheduledAtUtc) === today);
  const pending = daily.filter((item) => item.status === "Pending").length;
  const completed = daily.filter((item) => item.status === "Completed").length;

  return <>
    <div className="clinic-page-title"><div><span className="clinic-eyebrow">داشبورد کلینیک</span><h1>نمای کلی امروز</h1><p>{persianDate(today)} · زمان تهران</p></div><button onClick={() => refresh()} className="clinic-secondary" disabled={loading}><RefreshCw size={17}/> به‌روزرسانی</button></div>
    {error && <p role="alert" className="clinic-error-banner">{error}</p>}
    <div className="clinic-stats">
      <div className="clinic-stat"><span className="clinic-stat-icon coral"><CalendarDays size={27}/></span><div><strong>{loading ? "…" : daily.length}</strong><span>نوبت‌های امروز</span></div></div>
      <div className="clinic-stat"><span className="clinic-stat-icon amber"><Clock3 size={27}/></span><div><strong>{loading ? "…" : pending}</strong><span>در انتظار تأیید</span></div></div>
      <div className="clinic-stat"><span className="clinic-stat-icon mint"><CheckCircle2 size={27}/></span><div><strong>{loading ? "…" : completed}</strong><span>ویزیت تکمیل شده</span></div></div>
    </div>
    <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2>برنامه نوبت‌های امروز</h2><p>مرتب شده بر اساس ساعت مراجعه</p></div><Link href="/clinic/appointments" className="clinic-link">همه نوبت‌ها <ArrowLeft size={17}/></Link></div>
      {loading ? <div className="clinic-empty">در حال دریافت نوبت‌ها…</div> : <AppointmentTable appointments={daily} onSelect={() => router.push("/clinic/appointments")}/>}</section>
    <section className="clinic-panel clinic-team-panel"><div className="clinic-panel-heading"><div><h2><UsersRound size={20}/> دامپزشکان کلینیک</h2><p>اطلاعات از سرویس کلینیک خوانده می‌شود</p></div></div>
      {loading ? <div className="clinic-empty">در حال دریافت…</div> : vets.length ? <div className="clinic-vet-grid">{vets.map((vet) => <div className="clinic-vet" key={vet.id}><span className="clinic-vet-avatar">{vet.firstName?.[0]}{vet.lastName?.[0]}</span><div><strong>دکتر {vet.firstName} {vet.lastName}</strong><small>{vet.specialization || "دامپزشک"}</small></div></div>)}</div> : <div className="clinic-empty">دامپزشک فعالی برای این کلینیک ثبت نشده است.</div>}
    </section>
  </>;
}
