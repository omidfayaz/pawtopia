"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, CalendarDays, CheckCircle2, Clock3, RefreshCw, Stethoscope, UsersRound, XCircle } from "lucide-react";
import { useClinic } from "./ClinicShell";
import { useAppointments } from "./useAppointments";
import { appointmentDateKey, appointmentTime, localDateKey, persianDate, STATUS } from "./date";
import { managementMetrics } from "./managementMetrics";

export default function ManagementDashboard() {
  const { role } = useClinic();
  if (!["Owner", "Manager"].includes(role)) {
    return <section className="clinic-panel"><h1>دسترسی مدیر کلینیک لازم است</h1><p>این داشبورد برای نقش‌های مدیر و مالک کلینیک نمایش داده می‌شود.</p><Link className="clinic-link" href="/clinic">بازگشت به نمای کلی</Link></section>;
  }
  return <ManagementContent />;
}

function ManagementContent() {
  const { clinic, members } = useClinic();
  const { appointments, vets, loading, error, refresh } = useAppointments();
  const [days, setDays] = useState(7);
  const today = localDateKey();
  const metrics = useMemo(() => managementMetrics(appointments, vets, members, today, days), [appointments, vets, members, today, days]);
  const weekMax = Math.max(1, ...metrics.week.map((day) => day.total));

  const cards = [
    { label: "نوبت‌های امروز", value: metrics.todayAppointments.length, icon: CalendarDays, tone: "coral", note: "بر اساس زمان تهران" },
    { label: "در انتظار تأیید", value: metrics.pending, icon: Clock3, tone: "amber", note: `در ${days} روز اخیر` },
    { label: "ویزیت تکمیل‌شده", value: metrics.completed, icon: CheckCircle2, tone: "mint", note: `در ${days} روز اخیر` },
    { label: "نوبت لغوشده", value: metrics.cancelled, icon: XCircle, tone: "rose", note: `در ${days} روز اخیر` },
  ];

  if (error) return <>
    <div className="clinic-page-title"><div><span className="clinic-eyebrow">مدیریت کلینیک</span><h1>داشبورد مدیر</h1><p>{clinic?.name}</p></div></div>
    <section className="clinic-panel"><h2>دریافت آمار انجام نشد</h2><p role="alert" className="clinic-error-banner">{error}</p><button className="clinic-secondary" onClick={() => refresh()}><RefreshCw size={17}/> تلاش دوباره</button></section>
  </>;

  return <>
    <div className="clinic-page-title"><div><span className="clinic-eyebrow">مدیریت کلینیک</span><h1>داشبورد مدیر</h1><p>{clinic?.name} · {persianDate(today)}</p></div><div className="clinic-manager-actions"><select aria-label="بازه گزارش" value={days} onChange={(event) => setDays(Number(event.target.value))}><option value={7}>۷ روز اخیر</option><option value={30}>۳۰ روز اخیر</option></select><button className="clinic-secondary" onClick={() => refresh()} disabled={loading}><RefreshCw size={17}/> به‌روزرسانی</button></div></div>
    <div className="clinic-manager-summary"><Activity size={18}/><span>این گزارش از نوبت‌ها و اعضای ثبت‌شده در API تهیه می‌شود. «نوبت‌های امروز» فقط امروز است؛ سایر شمارنده‌ها برای بازه انتخاب‌شده‌اند.</span></div>
    <div className="clinic-stats clinic-manager-stats">{cards.map(({ label, value, icon: Icon, tone, note }) => <div className="clinic-stat" key={label}><span className={`clinic-stat-icon ${tone}`}><Icon size={26}/></span><div><strong>{loading ? "…" : value.toLocaleString("fa-IR")}</strong><span>{label}</span><small>{note}</small></div></div>)}</div>
    <div className="clinic-manager-grid">
      <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2>روند نوبت‌ها</h2><p>۷ روز اخیر، به تفکیک روز</p></div><span className="clinic-panel-number">{loading ? "…" : metrics.week.reduce((sum, day) => sum + day.total, 0).toLocaleString("fa-IR")} نوبت</span></div>
        {loading ? <div className="clinic-empty">در حال دریافت اطلاعات…</div> : <div className="clinic-chart" role="img" aria-label="نمودار تعداد نوبت‌های هفت روز اخیر">{metrics.week.map((day) => <div className="clinic-chart-day" key={day.date}><span className="clinic-chart-count">{day.total.toLocaleString("fa-IR")}</span><div className="clinic-chart-track"><div className="clinic-chart-bar" style={{ height: `${Math.max(day.total ? 12 : 3, day.total / weekMax * 100)}%` }}><span style={{ height: `${day.total ? day.completed / day.total * 100 : 0}%` }}/></div></div><small>{new Intl.DateTimeFormat("fa-IR", { weekday: "short", timeZone: "UTC" }).format(new Date(`${day.date}T12:00:00Z`))}</small></div>)}</div>}
        <div className="clinic-chart-legend"><span><i className="all"/> همه نوبت‌ها</span><span><i className="done"/> تکمیل شده</span></div>
      </section>
      <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2>خلاصه عملکرد</h2><p>بازه {persianDate(metrics.firstDay)} تا {persianDate(today)}</p></div></div>
        <div className="clinic-performance-row"><span>کل نوبت‌ها</span><strong>{loading ? "…" : metrics.inRange.length.toLocaleString("fa-IR")}</strong></div>
        <div className="clinic-performance-row"><span>تأیید شده</span><strong>{loading ? "…" : metrics.confirmed.toLocaleString("fa-IR")}</strong></div>
        <div className="clinic-performance-row"><span>اعضای فعال</span><strong>{metrics.activeMembers.length.toLocaleString("fa-IR")}</strong></div>
        <div className="clinic-performance-row"><span>دامپزشک / منشی</span><strong>{metrics.doctors.toLocaleString("fa-IR")} / {metrics.secretaries.toLocaleString("fa-IR")}</strong></div>
        <div className="clinic-completion"><div><strong>نرخ تکمیل نوبت‌های گذشته</strong><span>{loading ? "…" : metrics.completionRate === null ? "داده کافی نیست" : `${metrics.completionRate.toLocaleString("fa-IR")}٪`}</span></div><div className="clinic-progress"><span style={{ width: `${metrics.completionRate || 0}%` }}/></div><small>از {metrics.pastCount.toLocaleString("fa-IR")} نوبت غیرلغوشده پیش از امروز در بازه انتخابی</small></div>
      </section>
    </div>
    <div className="clinic-manager-grid">
      <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2><Stethoscope size={20}/> عملکرد دامپزشکان</h2><p>تعداد نوبت‌های بازه انتخاب‌شده</p></div></div>
        {loading ? <div className="clinic-empty">در حال دریافت…</div> : metrics.doctorRows.length ? <div className="clinic-doctor-list">{metrics.doctorRows.map((doctor) => <div className="clinic-doctor-row" key={doctor.id}><div className="clinic-vet"><span className="clinic-vet-avatar">✚</span><div><strong>{doctor.name}</strong><small>{doctor.specialty}</small></div></div><div><strong>{doctor.total.toLocaleString("fa-IR")}</strong><small>نوبت</small></div><div><strong>{doctor.completed.toLocaleString("fa-IR")}</strong><small>تکمیل</small></div></div>)}</div> : <div className="clinic-empty">دامپزشک فعالی ثبت نشده است.</div>}
      </section>
      <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2><UsersRound size={20}/> اعضای کلینیک</h2><p>نقش و وضعیت اعضا</p></div></div>
        {metrics.activeMembers.length ? <div className="clinic-member-list">{metrics.activeMembers.slice(0, 6).map((member) => <div className="clinic-member-row" key={member.id}><span className="clinic-vet-avatar">{member.firstName?.[0]}{member.lastName?.[0]}</span><div><strong>{member.firstName} {member.lastName}</strong><small>{({ Owner: "مالک", Manager: "مدیر", Secretary: "منشی", Vet: "دامپزشک" })[member.roleInClinic] || member.roleInClinic}</small></div><span className="clinic-member-active">فعال</span></div>)}</div> : <div className="clinic-empty">اطلاعات اعضای فعال در دسترس نیست.</div>}
      </section>
    </div>
    <section className="clinic-panel"><div className="clinic-panel-heading"><div><h2>نوبت‌های امروز</h2><p>زمان‌ها بر اساس ساعت تهران</p></div><Link className="clinic-link" href="/clinic/appointments">مدیریت نوبت‌ها <ArrowLeft size={17}/></Link></div>
      {loading ? <div className="clinic-empty">در حال دریافت…</div> : metrics.todayAppointments.length ? <div className="clinic-manager-appointments">{metrics.todayAppointments.slice(0, 6).map((item) => <div key={item.id}><span className="clinic-manager-time" dir="ltr">{appointmentTime(item.scheduledAtUtc)}</span><span className="clinic-pet-avatar">🐾</span><strong>{item.petName}</strong><span>دکتر {item.vetFirstName} {item.vetLastName}</span><span className={`clinic-status ${STATUS[item.status]?.tone || "waiting"}`}>{STATUS[item.status]?.label || item.status}</span></div>)}</div> : <div className="clinic-empty">امروز نوبتی ثبت نشده است.</div>}
    </section>
  </>;
}
