"use client";

import { appointmentTime, STATUS } from "./date";

export default function AppointmentTable({ appointments, onSelect, selectedId }) {
  if (!appointments.length) return <div className="clinic-empty">برای این بازه نوبتی پیدا نشد.</div>;
  return <div className="clinic-table-scroll"><table className="clinic-table">
    <thead><tr><th>زمان</th><th>حیوان</th><th>دامپزشک</th><th>نوع مراجعه</th><th>وضعیت</th><th>جزئیات</th></tr></thead>
    <tbody>{appointments.map((item) => {
      const status = STATUS[item.status] || { label: item.status, tone: "waiting" };
      return <tr key={item.id} className={selectedId === item.id ? "selected" : ""}>
        <td className="clinic-time" dir="ltr">{appointmentTime(item.scheduledAtUtc)}</td>
        <td><span className="clinic-pet-avatar">🐾</span><strong>{item.petName}</strong></td>
        <td>دکتر {item.vetFirstName} {item.vetLastName}</td>
        <td>{item.chiefComplaint || "ویزیت عمومی"}</td>
        <td><span className={`clinic-status ${status.tone}`}>{status.label}</span></td>
        <td><button type="button" className="clinic-row-button" onClick={() => onSelect(item)} aria-label={`جزئیات نوبت ${item.petName}`}>مشاهده</button></td>
      </tr>;
    })}</tbody>
  </table></div>;
}
