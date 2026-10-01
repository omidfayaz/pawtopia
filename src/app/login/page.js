"use client";

import { useState } from "react";
import { User, Building2, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("owner"); // "owner" | "clinic"
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <Navbar />

      <main className="login-page">
        <div className="login-card">

          {/* Header */}
          <div className="login-header">
            <span className="login-logo">🐾</span>
            <h1 className="login-title">ورود به پاتوپیا</h1>
            <p className="login-subtitle">خوش برگشتی! حساب خود را انتخاب کنید</p>
          </div>

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${activeTab === "owner" ? "active" : ""}`}
              onClick={() => setActiveTab("owner")}
            >
              <User size={18} />
              صاحب حیوان خانگی
            </button>
            <button
              className={`login-tab ${activeTab === "clinic" ? "active" : ""}`}
              onClick={() => setActiveTab("clinic")}
            >
              <Building2 size={18} />
              کلینیک / دامپزشک
            </button>
          </div>

          {/* Form - Pet Owner */}
          {activeTab === "owner" && (
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">شماره موبایل</label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label className="form-label">رمز عبور</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  مرا به خاطر بسپار
                </label>
                <a href="#" className="form-link">فراموشی رمز عبور؟</a>
              </div>

              <button type="submit" className="btn-submit">
                ورود به حساب
              </button>

              <p className="form-footer-text">
                حساب ندارید؟{" "}
                <a href="#" className="form-link">ثبت نام کنید</a>
              </p>
            </form>
          )}

          {/* Form - Clinic */}
          {activeTab === "clinic" && (
            <form className="login-form" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label className="form-label">کد کلینیک یا ایمیل</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="clinic@example.com"
                  dir="ltr"
                />
              </div>

              <div className="form-group">
                <label className="form-label">رمز عبور</label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-input"
                    placeholder="رمز عبور خود را وارد کنید"
                  />
                  <button
                    type="button"
                    className="input-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-row">
                <label className="checkbox-label">
                  <input type="checkbox" />
                  مرا به خاطر بسپار
                </label>
                <a href="#" className="form-link">فراموشی رمز عبور؟</a>
              </div>

              <button type="submit" className="btn-submit btn-submit-clinic">
                ورود به پنل کلینیک
              </button>

              <p className="form-footer-text">
                کلینیک ثبت نشده؟{" "}
                <a href="#" className="form-link">همین حالا ثبت کنید</a>
              </p>
            </form>
          )}

        </div>
      </main>

      <style>{`
        .login-page {
          min-height: calc(100vh - 68px - 73px);
          background: linear-gradient(135deg, #f0faf6 0%, #fff 60%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 20px;
        }

        .login-card {
          background: #fff;
          border-radius: 24px;
          padding: 40px;
          width: 100%;
          max-width: 440px;
          box-shadow: 0 8px 40px rgba(10, 171, 156, 0.1);
          border: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .login-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .login-logo { font-size: 40px; }

        .login-title {
          font-size: 22px;
          font-weight: 800;
          color: #111;
        }

        .login-subtitle {
          font-size: 14px;
          color: var(--color-text-muted);
        }

        /* Tabs */
        .login-tabs {
          display: flex;
          background: var(--color-bg-soft);
          border-radius: var(--radius-md);
          padding: 4px;
          gap: 4px;
        }

        .login-tab {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 10px;
          border: none;
          border-radius: var(--radius-sm);
          background: transparent;
          color: var(--color-text-muted);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .login-tab.active {
          background: #fff;
          color: var(--color-primary);
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }

        /* Form */
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }

        .form-input {
          width: 100%;
          padding: 12px 14px;
          border: 1.5px solid #e0e0e0;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-family: var(--font-base);
          color: var(--color-text);
          background: var(--color-bg);
          transition: border-color 0.2s;
          outline: none;
        }

        .form-input:focus {
          border-color: var(--color-primary);
        }

        .form-input::placeholder { color: #bbb; }

        .input-wrapper {
          position: relative;
        }

        .input-wrapper .form-input {
          padding-left: 42px;
        }

        .input-icon-btn {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #aaa;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .input-icon-btn:hover { color: var(--color-primary); }

        .form-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: #555;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          accent-color: var(--color-primary);
          width: 15px;
          height: 15px;
          cursor: pointer;
        }

        .form-link {
          font-size: 13px;
          color: var(--color-primary);
          font-weight: 600;
          transition: opacity 0.2s;
        }

        .form-link:hover { opacity: 0.75; }

        .btn-submit {
          width: 100%;
          padding: 13px;
          background: var(--color-primary);
          color: #fff;
          border: none;
          border-radius: var(--radius-md);
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s;
          margin-top: 4px;
        }

        .btn-submit:hover { background: var(--color-primary-dark); }

        .btn-submit-clinic {
          background: var(--color-accent);
        }

        .btn-submit-clinic:hover { background: var(--color-accent-hover); }

        .form-footer-text {
          text-align: center;
          font-size: 13px;
          color: var(--color-text-muted);
        }

        @media (max-width: 480px) {
          .login-card { padding: 28px 20px; }
          .login-tab { font-size: 12px; }
        }
      `}</style>

      <Footer />
    </>
  );
}