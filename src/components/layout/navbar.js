export default function Navbar() {
  return (
    <nav className="navbar">
      <a href="/" className="navbar-logo">
        <span>🐾</span>
        پاتوپیا
      </a>

      <ul className="navbar-links">
        <li><a href="/" className="active">صفحه اصلی</a></li>
        <li><a href="#">خدمات</a></li>
        <li><a href="#">برای کلینیک‌ها</a></li>
        <li><a href="#">وبلاگ</a></li>
        <li><a href="#">درباره ما</a></li>
      </ul>

      <div className="navbar-actions">
        <button className="btn-outline">ورود</button>
        <button className="btn-primary">ثبت نام</button>
      </div>
    </nav>
  );
}