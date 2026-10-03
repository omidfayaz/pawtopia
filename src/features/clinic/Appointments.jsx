"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Check, ChevronLeft, ChevronRight, RefreshCw, Search, X } from "lucide-react";
import { useClinic } from "./ClinicShell";
import { useAppointments } from "./useAppointments";
import { appointmentDateKey, appointmentTime, localDateKey, persianDate, shiftDate, STATUS } from "./date";
import AppointmentTable from "./AppointmentTable";

export default function Appointments() {
  const { role } = useClinic();
  const { appointments, vets, loading, error, actionId, confirm, refresh } = useAppointments();
  const [date, setDate] = useState(localDateKey);
  const [status, setStatus] = useState("all");
  const [vetId, setVetId] = useState("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState("");
  const canConfirm = ["Owner", "Manager", "Secretary"].includes(role);
  const filtered = useMemo(() => appointments.filter((item) =>
    appointmentDateKey(item.scheduledAtUtc) === date &&
    (status === "all" || item.status === status) &&
    (vetId === "all" || item.vetId === vetId) &&
    (!query.trim() || `${item.petName} ${item.vetFirstName} ${item.vetLastName} ${item.chiefComplaint || ""}`.toLocaleLowerCase("fa").includes(query.trim().toLocaleLowerCase("fa")))
  ), [appointments, date, status, vetId, query]);

  async function confirmSelected() {
    if (!selected) return;
    const succeeded = await confirm(selected.id);
    if (succeeded) {
      setSelected((current) => ({ ...current, status: "Confirmed" }));
      setMessage("نوبت با موفقیت تأیید شد.");
    }
  }

  return <>
    <div className="clinic-page-title"><div><span className="clinic-eyebrow">مدیریت پذیرش</span><h1>نوبت‌ها</h1><p>پیگیری و تأیید نوبت‌های کلینیک در زمان تهران</p></div><button onClick={() => refresh()} className="clinic-secondary" disabled={loading}><RefreshCw size={17}/> به‌روزرسانی</button></div>
    {error && <p role="alert" className="clinic-error-banner">{error}</p>}
    {message && <p role="status" className="clinic-success-banner">{message}</p>}
    <section className="clinic-panel">
      <div className="clinic-datebar"><div className="clinic-date-heading"><CalendarDays size={23}/><div><h2>برنامه نوبت‌ها</h2><p>{persianDate(date)}</p></div></div><div className="clinic-date-controls"><button aria-label="روز قبل" onClick={() => setDate(shiftDate(date, -1))}><ChevronRight size={19}/></button><input type="date" aria-label="تاریخ نوبت‌ها" value={date} onChange={(event) => setDate(event.target.value)} /><button aria-label="روز بعد" onClick={() => setDate(shiftDate(date, 1))}><ChevronLeft size={19}/></button><button className="clinic-today" onClick={() => setDate(localDateKey())}>امروز</button></div></div>
      <div className="clinic-filters"><label className="clinic-search"><Search size={18}/><input placeholder="جستجوی نام حیوان، دامپزشک یا علت مراجعه…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="جستجو در نوبت‌ها" /></label><select aria-label="فیلتر وضعیت" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">همه وضعیت‌ها</option>{Object.entries(STATUS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select><select aria-label="فیلتر دامپزشک" value={vetId} onChange={(event) => setVetId(event.target.value)}><option value="all">همه دامپزشکان</option>{vets.map((vet) => <option key={vet.id} value={vet.id}>دکتر {vet.firstName} {vet.lastName}</option>)}</select></div>
      <div className="clinic-table-title"><h3>نوبت‌های این روز</h3><span>{loading ? "…" : filtered.length} نوبت</span></div>
      {loading ? <div className="clinic-empty">در حال دریافت نوبت‌ها…</div> : <AppointmentTable appointments={filtered} onSelect={(item) => { setSelected(item); setMessage(""); }} selectedId={selected?.id}/>}
    </section>
    {selected && <div className="clinic-modal-backdrop" onClick={() => setSelected(null)}><section className="clinic-detail" role="dialog" aria-modal="true" aria-labelledby="clinic-detail-title" onClick={(event) => event.stopPropagation()}><div className="clinic-detail-head"><div><span className="clinic-eyebrow">جزئیات نوبت</span><h2 id="clinic-detail-title">{selected.petName}</h2></div><button aria-label="بستن" onClick={() => setSelected(null)}><X size={21}/></button></div><dl><div><dt>تاریخ و ساعت</dt><dd>{persianDate(appointmentDateKey(selected.scheduledAtUtc))}، {appointmentTime(selected.scheduledAtUtc)}</dd></div><div><dt>دامپزشک</dt><dd>دکتر {selected.vetFirstName} {selected.vetLastName}</dd></div><div><dt>مدت</dt><dd>{selected.durationMinutes} دقیقه</dd></div><div><dt>علت مراجعه</dt><dd>{selected.chiefComplaint || "ثبت نشده"}</dd></div><div><dt>وضعیت</dt><dd>{STATUS[selected.status]?.label || selected.status}</dd></div><div><dt>شناسه نوبت</dt><dd dir="ltr" className="clinic-id">{selected.id}</dd></div></dl><p className="clinic-detail-note">نام و شماره صاحب حیوان در پاسخ فعلی API نوبت‌ها وجود ندارد.</p>{canConfirm && selected.status === "Pending" && <button className="clinic-primary" disabled={actionId === selected.id} onClick={confirmSelected}><Check size={18}/>{actionId === selected.id ? "در حال تأیید…" : "تأیید نوبت"}</button>}{error && <p role="alert" className="clinic-error">{error}</p>}</section></div>}
  </>;
}
