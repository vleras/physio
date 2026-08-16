import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import IonIcon from "./IonIcon";

export default async function Footer() {
  const t = await getTranslations("footer");
  return (
    <footer className="footer-v2">
      <div className="footer-v2-inner">
        {/* Top section: logo + columns */}
        <div className="footer-v2-top">
          {/* Logo */}
          <div className="footer-v2-brand">
            <Link href="/" className="footer-v2-logo-link">
              <Image
                src="/logo.png"
                alt="VSO Clinic"
                width={80}
                height={80}
                className="footer-v2-logo-img"
              />
            </Link>
          </div>

          {/* Quick Links */}
          <div className="footer-v2-col">
            <h3 className="footer-v2-heading">{t("quickLinks")}</h3>
            <ul className="footer-v2-list">
              <li><Link href="/">{t("homeLink")}</Link></li>
              <li><Link href="/products">{t("productsLink")}</Link></li>
            </ul>
          </div>

          {/* Working Hours */}
          <div className="footer-v2-col">
            <h3 className="footer-v2-heading">{t("workingHours")}</h3>
            <ul className="footer-v2-list">
              <li>{t("hoursWeekdays")}</li>
              <li>{t("hoursSaturday")}</li>
              <li>{t("hoursSunday")}</li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-v2-col">
            <h3 className="footer-v2-heading">{t("contactUs")}</h3>
            <ul className="footer-v2-list">
              <li>
                <a href="tel:+38349459111" className="footer-v2-contact-link">
                  <IonIcon name="call-outline" size={16} />
                  +383 49 459 111
                </a>
              </li>
              <li>
                <a href="mailto:vsoclinic@gmail.com" className="footer-v2-contact-link">
                  <IonIcon name="mail-outline" size={16} />
                  vsoclinic@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="footer-v2-col">
            <h3 className="footer-v2-heading">{t("connect")}</h3>
            <ul className="footer-v2-list">
              <li>
                <a
                  href="https://www.instagram.com/vsoclinic/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-v2-contact-link"
                >
                  <IonIcon name="logo-instagram" size={16} />
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@vsoclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-v2-contact-link"
                >
                  <IonIcon name="logo-tiktok" size={16} />
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61581763988121"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-v2-contact-link"
                >
                  <IonIcon name="logo-facebook" size={16} />
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="footer-v2-divider" />

        {/* Bottom bar */}
        <div className="footer-v2-bottom">
          <p className="footer-v2-copyright">{t("copyright")}</p>
          <p className="footer-v2-powered">{t("poweredBy")}</p>
        </div>

        {/* Large watermark text */}
        <div className="footer-v2-watermark" aria-hidden="true">
          VSO Clinic
        </div>
      </div>
    </footer>
  );
}
