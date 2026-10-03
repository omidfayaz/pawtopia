const zone = "Asia/Tehran";

export function localDateKey(value = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(value);
  const part = (type) => parts.find((item) => item.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function appointmentDateKey(utc) { return localDateKey(new Date(utc)); }

export function persianDate(iso) {
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: "UTC", weekday: "long", year: "numeric", month: "long", day: "numeric",
  }).format(new Date(`${iso}T12:00:00Z`));
}

export function appointmentTime(utc) {
  return new Intl.DateTimeFormat("fa-IR", {
    timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date(utc));
}

export function shiftDate(iso, days) {
  const date = new Date(`${iso}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export const STATUS = {
  Pending: { label: "در انتظار تأیید", tone: "waiting" },
  Confirmed: { label: "تأیید شده", tone: "confirmed" },
  Completed: { label: "تکمیل شده", tone: "completed" },
  Cancelled: { label: "لغو شده", tone: "cancelled" },
};
