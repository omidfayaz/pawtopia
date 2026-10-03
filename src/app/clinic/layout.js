import ClinicShell from "@/features/clinic/ClinicShell";
import "./clinic.css";

export const metadata = { title: "پنل کلینیک | پاتوپیا", description: "مدیریت نوبت‌ها و کارهای کلینیک دامپزشکی" };

export default function ClinicLayout({ children }) { return <ClinicShell>{children}</ClinicShell>; }
