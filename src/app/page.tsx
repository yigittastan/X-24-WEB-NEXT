"use client";

import React, { useEffect, useState } from "react";
import { getCookie } from "@/app/utils/cookies";
import { ChevronRight, MessageSquare, Video, BarChart3, Clock, Calendar, CheckCircle } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

interface BenefitItemProps {
  number: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  delay = 0,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`feature-card ${
        isVisible ? "animate-fade-in-up" : "opacity-0"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

const BenefitItem: React.FC<BenefitItemProps> = ({
  number,
  title,
  description,
}) => (
  <div className="benefit-item">
    <div className="benefit-number">{number}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
);

const X24LandingPage: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
            Roboto, sans-serif;
          line-height: 1.6;
          color: #334155;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .header {
          background: ${scrollY > 100
            ? "rgba(255, 255, 255, 0.98)"
            : "rgba(255, 255, 255, 0.95)"};
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          position: fixed;
          width: 100%;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          transition: background 0.3s ease;
        }

        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
        }

        .logo {
          font-size: 2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          cursor: pointer;
        }

        .nav-links {
          display: flex;
          list-style: none;
          gap: 2rem;
          align-items: center;
        }

        .nav-link {
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .nav-link:hover {
          color: #667eea;
        }

        .cta-btn {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
        }

        .hero {
          padding: 120px 0 80px;
          text-align: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .hero h1 {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .hero p {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2.5rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-illustration {
          width: 100%;
          max-width: 800px;
          height: 400px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          margin: 3rem auto;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .dashboard-mockup {
          width: 90%;
          height: 80%;
          background: white;
          border-radius: 15px;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
          position: relative;
          overflow: hidden;
        }

        .mockup-header {
          height: 40px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          padding: 0 15px;
          gap: 8px;
        }

        .mockup-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot-red {
          background: #ef4444;
        }
        .dot-yellow {
          background: #f59e0b;
        }
        .dot-green {
          background: #10b981;
        }

        .mockup-content {
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          height: calc(100% - 40px);
        }

        .mockup-card {
          background: #f8fafc;
          border-radius: 10px;
          padding: 15px;
          border: 1px solid #e2e8f0;
        }

        .mockup-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #475569;
          margin-bottom: 10px;
        }

        .mockup-item {
          height: 8px;
          background: #cbd5e1;
          border-radius: 4px;
          margin-bottom: 8px;
        }

        .mockup-item.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .main-content {
          background: white;
          margin-top: -50px;
          border-radius: 50px 50px 0 0;
          position: relative;
          z-index: 10;
        }

        .section {
          padding: 100px 0;
        }

        .section-gray {
          background: #f8fafc;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .section-subtitle {
          text-align: center;
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 4rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-top: 3rem;
          color: black;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 20px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
        }

        .feature-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          color: white;
        }

        .feature-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #64748b;
          line-height: 1.6;
        }

        .preview-container {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .preview-image {
          width: 100%;
          height: 500px;
          background: linear-gradient(135deg, #f8fafc, #e2e8f0);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          color: #64748b;
          border: 2px dashed #cbd5e1;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-top: 3rem;
        }

        .benefit-item {
          text-align: center;
        }

        .benefit-number {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }

        .benefit-item h3 {
          font-size: 1.3rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .pricing-card {
          background: white;
          border-radius: 20px;
          padding: 3rem 2rem;
          text-align: center;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          max-width: 400px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
        }

        .pricing-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #667eea, #764ba2);
        }

        .price {
          font-size: 3rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .price-subtitle {
          color: #64748b;
          margin-bottom: 2rem;
        }

        .features-list {
          list-style: none;
          margin-bottom: 2rem;
          text-align: left;
        }

        .features-list li {
          padding: 0.5rem 0;
          color: #64748b;
          position: relative;
          padding-left: 1.5rem;
        }

        .features-list li::before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }

        .footer {
          background: #1e293b;
          color: white;
          padding: 60px 0 30px;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .footer-section ul {
          list-style: none;
        }

        .footer-section ul li {
          margin-bottom: 0.5rem;
        }

        .footer-link {
          color: #94a3b8;
          cursor: pointer;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: white;
        }

        .footer-bottom {
          border-top: 1px solid #334155;
          padding-top: 2rem;
          text-align: center;
          color: #94a3b8;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }

        @media (max-width: 768px) {
          .hero h1 {
            font-size: 2.5rem;
          }

          .nav-links {
            display: none;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .hero-illustration {
            height: 300px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <nav className="nav container">
          <div className="logo" onClick={() => scrollToSection("hero")}>
            X-24
          </div>
          <ul className="nav-links">
            <li
              className="nav-link"
              onClick={() => scrollToSection("features")}
            >
              Özellikler
            </li>
            <li
              className="nav-link"
              onClick={() => scrollToSection("dashboard")}
            >
              Dashboard
            </li>
            <li className="nav-link" onClick={() => scrollToSection("pricing")}>
              Fiyatlandırma
            </li>
            <li className="nav-link" onClick={() => scrollToSection("contact")}>
              İletişim
            </li>
            <li>
              <button
                className="cta-btn"
                onClick={() => {
                  const token = getCookie("auth_token");
                  if (token) {
                    window.location.href = "/dashboard";
                  } else {
                    window.location.href = "/auth/register";
                  }
                }}
              >
                Ücretsiz Başla
              </button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero">
        <div className="container">
          <h1>Proje ve Ekibinizi Verimli Şekilde Yönetin</h1>
          <p>
            X-24 ile ekip çalışmalarınızı organize edin, görevlerinizi takip
            edin ve projelerinizi başarıyla tamamlayın. Tüm ihtiyaçlarınız tek
            platformda!
          </p>
          <button className="cta-btn">
            Ücretsiz Başlayın
            <ChevronRight className="inline ml-2" size={20} />
          </button>

          <div className="hero-illustration">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dot dot-red"></div>
                <div className="mockup-dot dot-yellow"></div>
                <div className="mockup-dot dot-green"></div>
              </div>
              <div className="mockup-content">
                <div className="mockup-card">
                  <div className="mockup-title">Aktif Projeler</div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item"></div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-title">Ekip Mesajları</div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item active"></div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-title">Görev Durumu</div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item active"></div>
                </div>
                <div className="mockup-card">
                  <div className="mockup-title">Performans</div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item"></div>
                  <div className="mockup-item active"></div>
                  <div className="mockup-item active"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="main-content">
        {/* Features Section */}
        <section id="features" className="section">
          <div className="container">
            <h2 className="section-title">Güçlü Özellikler</h2>
            <p className="section-subtitle">
              X-24&apos;ün sunduğu kapsamlı özelliklerle ekip çalışmalarınızı bir üst
              seviyeye taşıyın
            </p>

            <div className="features-grid">
              <FeatureCard
                icon={<CheckCircle size={24} />}
                title="Proje & Görev Yönetimi"
                description="Projelerinizi organize edin, görevleri ekip üyelerine atayın ve ilerlemeyi gerçek zamanlı takip edin."
                delay={100}
              />

              <FeatureCard
                icon={<MessageSquare size={24} />}
                title="Gerçek Zamanlı Mesajlaşma"
                description="Ekibinizle anlık mesajlaşma, grup sohbetleri ve dosya paylaşımı ile iletişimi güçlendirin."
                delay={200}
              />

              <FeatureCard
                icon={<Video size={24} />}
                title="Video Görüşmeler"
                description="Sesli ve görüntülü aramalar ile uzaktan çalışan ekibinizle yüz yüze toplantılar yapın."
                delay={300}
              />

              <FeatureCard
                icon={<BarChart3 size={24} />}
                title="Performans Analizi"
                description="Detaylı raporlar ve analizlerle ekip performansınızı ölçün ve gelişim alanlarını belirleyin."
                delay={400}
              />

              <FeatureCard
                icon={<Clock size={24} />}
                title="Çalışma Saati Takibi"
                description="Günlük çalışma saatlerini kaydedin, zaman takibi yapın ve verimlilik raporları alın."
                delay={500}
              />

              <FeatureCard
                icon={<Calendar size={24} />}
                title="Takvim Entegrasyonu"
                description="Görevlerinizi ve toplantılarınızı takvimde görüntüleyin, Google Takvim ile senkronize edin."
                delay={600}
              />
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section id="dashboard" className="section section-gray">
          <div className="container">
            <h2 className="section-title">Kullanıcı Dostu Dashboard</h2>
            <p className="section-subtitle">
              Tüm projelerinizi, görevlerinizi ve ekip aktivitelerini tek
              ekrandan yönetin
            </p>

            <div className="preview-container">
              <div className="preview-image">
                <span>
                  🎯 Dashboard Önizlemesi - Projeler, Görevler ve Ekip Durumu
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="section">
          <div className="container">
            <h2 className="section-title">
              Neden Ekipler X-24&apos;ü Tercih Ediyor?
            </h2>
            <p className="section-subtitle">
              Binlerce ekip zaten X-24 ile verimliliklerini artırdı
            </p>

            <div className="benefits-grid">
              <BenefitItem
                number="85%"
                title="Verimlilik Artışı"
                description="Ekipler X-24 kullanarak ortalama %85 daha verimli çalışmaya başladı"
              />

              <BenefitItem
                number="24/7"
                title="Sürekli Erişim"
                description="İstediğiniz her yerden, her zaman projelerinize erişim sağlayın"
              />

              <BenefitItem
                number="99.9%"
                title="Güvenilirlik"
                description="%99.9 uptime garantisi ile kesintisiz hizmet deneyimi"
              />
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="section section-gray">
          <div className="container">
            <h2 className="section-title">Basit ve Şeffaf Fiyatlandırma</h2>
            <p className="section-subtitle">
              Tüm özellikler dahil, gizli maliyet yok
            </p>

            <div className="pricing-card">
              <div className="price">Ücretsiz</div>
              <div className="price-subtitle">Sınırsız kullanım</div>

              <ul className="features-list">
                <li>Sınırsız proje ve görev</li>
                <li>Ekip mesajlaşması</li>
                <li>Video görüşmeler</li>
                <li>Performans analizi</li>
                <li>Çalışma saati takibi</li>
                <li>Takvim entegrasyonu</li>
                <li>24/7 destek</li>
              </ul>

              <button className="cta-btn">Hemen Başlayın</button>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>X-24</h4>
              <p>
                Ekip çalışmalarınızı bir üst seviyeye taşıyan modern proje
                yönetim platformu.
              </p>
            </div>

            <div className="footer-section">
              <h4>Ürün</h4>
              <ul>
                <li>
                  <span className="footer-link">Özellikler</span>
                </li>
                <li>
                  <span className="footer-link">Fiyatlandırma</span>
                </li>
                <li>
                  <span className="footer-link">API Dokümantasyonu</span>
                </li>
                <li>
                  <span className="footer-link">Entegrasyonlar</span>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Şirket</h4>
              <ul>
                <li>
                  <span className="footer-link">Hakkımızda</span>
                </li>
                <li>
                  <span className="footer-link">Blog</span>
                </li>
                <li>
                  <span className="footer-link">Kariyer</span>
                </li>
                <li>
                  <span className="footer-link">Basın Kiti</span>
                </li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Destek</h4>
              <ul>
                <li>
                  <span className="footer-link">Yardım Merkezi</span>
                </li>
                <li>
                  <span className="footer-link" id="contact">
                    İletişim
                  </span>
                </li>
                <li>
                  <span className="footer-link">Gizlilik Politikası</span>
                </li>
                <li>
                  <span className="footer-link">Kullanım Şartları</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 X-24. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default X24LandingPage;
