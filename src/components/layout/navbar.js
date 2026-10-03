import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link href="/" className="navbar-logo">
        <span>🐾</span>
        پاتوپیا
      </Link>

      <ul className="navbar-links">
        <li><Link href="/" className="active">صفحه اصلی</Link></li>
        <li><a href="#">خدمات</a></li>
        <li><Link href="/clinic">برای کلینیک‌ها</Link></li>
        <li><a href="#">وبلاگ</a></li>
        <li><a href="#">درباره ما</a></li>
      </ul>

      <div className="navbar-actions">
        <Link href="/login" className="btn-outline">ورود</Link>
        <Link href="/sign_up" className="btn-primary">ثبت نام</Link>
      </div>
    </nav>
  );
}
