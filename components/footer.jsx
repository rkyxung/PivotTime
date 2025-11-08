"use client";
import "../styles/footer.scss";
import { PIVOTTIME } from "./svgCode";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="34" rx="10" stroke="#E1E1E1" strokeWidth="2" />
        <circle cx="18" cy="18" r="7" stroke="#E1E1E1" strokeWidth="2" />
        <circle cx="28" cy="9" r="2" fill="#E1E1E1" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="34" rx="10" stroke="#E1E1E1" strokeWidth="2" />
        <path
          d="M16.012 23.752c-.664.45-1.56-.026-1.56-.828V12.885c0-.802.896-1.278 1.56-.828l7.412 5.02a1 1 0 0 1 0 1.656l-7.412 5.02Z"
          fill="#E1E1E1"
        />
      </svg>
    ),
  },
  {
    href: "https://www.kaywon.ac.kr/",
    label: "Kaywon Blog",
    icon: (
      <svg viewBox="0 0 36 36" fill="none" aria-hidden="true">
        <rect x="1" y="1" width="34" height="34" rx="10" stroke="#E1E1E1" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__logo">
          <PIVOTTIME />
        </div>

        <div className="footer__center">
          <div className="footer__address">
            <span>
              16038 경기도 의왕시 계원대학교로 66(내손동) 계원예술대학교
            </span>
            <span>66 Kaywondaehaengno (Naeson-dong), Uiwang-si, Gyeonggi-do, Korea</span>
          </div>

          <p className="footer__copyright">
            ©2025. Delight Insight PIVOTTIME All Right Reserved.
          </p>
        </div>

        <div className="footer__right">
          <div className="footer__social">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="footer__social-link"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>

          <dl className="footer__contact">
            <dt>Tell</dt>
            <dd>031-424-7509</dd>
            <dt>Fax</dt>
            <dd>1899-5823</dd>
            <dt>E-Mail</dt>
            <dd>
              <a href="mailto:kaywon@kaywon.ac.kr">kaywon@kaywon.ac.kr</a>
            </dd>
          </dl>
        </div>
      </div>
    </footer>
  );
}
