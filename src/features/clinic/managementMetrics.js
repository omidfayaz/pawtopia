import { appointmentDateKey, shiftDate } from "./date";

export function managementMetrics(appointments, vets, members, today, days) {
  const firstDay = shiftDate(today, 1 - days);
  const inRange = appointments.filter((item) => {
    const date = appointmentDateKey(item.scheduledAtUtc);
    return date >= firstDay && date <= today;
  });
  const todayAppointments = inRange.filter((item) => appointmentDateKey(item.scheduledAtUtc) === today);
  const pastNonCancelled = inRange.filter((item) => {
    const date = appointmentDateKey(item.scheduledAtUtc);
    return date < today && item.status !== "Cancelled";
  });
  const completedPast = pastNonCancelled.filter((item) => item.status === "Completed").length;
  const completionRate = pastNonCancelled.length ? Math.round(completedPast / pastNonCancelled.length * 100) : null;
  const activeMembers = members.filter((member) => member.isActive);
  const doctorRows = vets.map((vet) => {
    const assigned = inRange.filter((item) => item.vetId === vet.id);
    return {
      id: vet.id,
      name: `دکتر ${vet.firstName} ${vet.lastName}`,
      specialty: vet.specialization || "دامپزشک",
      total: assigned.length,
      completed: assigned.filter((item) => item.status === "Completed").length,
    };
  }).sort((a, b) => b.total - a.total);
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = shiftDate(today, index - 6);
    const daily = appointments.filter((item) => appointmentDateKey(item.scheduledAtUtc) === date);
    return { date, total: daily.length, completed: daily.filter((item) => item.status === "Completed").length };
  });

  return {
    firstDay, todayAppointments, inRange, completionRate, pastCount: pastNonCancelled.length,
    pending: inRange.filter((item) => item.status === "Pending").length,
    confirmed: inRange.filter((item) => item.status === "Confirmed").length,
    completed: inRange.filter((item) => item.status === "Completed").length,
    cancelled: inRange.filter((item) => item.status === "Cancelled").length,
    activeMembers,
    secretaries: activeMembers.filter((member) => member.roleInClinic === "Secretary").length,
    doctors: activeMembers.filter((member) => member.roleInClinic === "Vet").length,
    doctorRows, week,
  };
}
