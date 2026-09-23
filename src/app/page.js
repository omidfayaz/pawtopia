import { Bell, Calendar, FileText, Building2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <div className="hero-eyebrow">سلامتی حیوانات خانگی، آرامش خاطر شما</div>

          <h1 className="hero-title">
            مراقبت بهتر،<br />
            برای همراه <span className="accent">همیشگی شما</span>
          </h1>

          <p className="hero-desc">
            پاتوپیا پلتفرمی برای مدیریت سلامت حیوانات خانگی، ارتباط با دامپزشکان
            و دریافت خدمات دامپزشکی به ساده‌ترین شکل ممکن است.
          </p>

          <div className="hero-ctas">
            <button className="btn-hero-primary">
              شروع رایگان ←
            </button>
            <button className="btn-hero-secondary">
              <Building2 size={24} />
              پنل کلینیک
            </button>
          </div>

          <div className="hero-social-proof">
            <div className="avatars">
              {["🐕", "🐈", "🐇", "🐾"].map((emoji, i) => (
                <div key={i} className="avatar-placeholder">{emoji}</div>
              ))}
            </div>
            <p className="social-proof-text">
              <strong>+۵٬۰۰۰</strong> حیوان خانگی سالم‌تر<br />با پاتوپیا
            </p>
          </div>
        </div>

        <img src="/images/cat2.jpg" className="hero-bg-img" alt="گربه" />
      </section>

      {/* Feature Cards */}
      <section className="features">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-teal">
              <Calendar size={24} color="#0AAB9C" />
            </div>
            <h3>نوبت‌گیری آسان</h3>
            <p>
              دریافت نوبت از کلینیک‌های معتبر در چند دقیقه،
              بدون تماس تلفنی.
            </p>
            <a href="#" className="feature-link">مشاهده کلینیک‌ها ←</a>
          </div>

          <div className="feature-card feature-card-warm">
            <div className="feature-icon-wrap feature-icon-orange">
              <Bell size={24} color="#FC6D65" />
            </div>
            <h3>یادآوری هوشمند</h3>
            <p>
              یادآوری واکسن‌ها، داروها و معاینات برای اینکه
              هیچ‌وقت سلامت عزیزتان فراموش نشود.
            </p>
            <a href="#" className="feature-link">اطلاع بیشتر ←</a>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrap feature-icon-teal">
              <FileText size={26} color="#0AAB9C" />
            </div>
            <h3>پرونده سلامت</h3>
            <p>
              تمام سوابق پزشکی، واکسیناسیون و معاینات در یک
              مکان امن و همیشه در دسترس.
            </p>
            <a href="#" className="feature-link">شروع کنید ←</a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}