"use client";
import "../styles/footer.scss";
import { PIVOTTIME } from "./svgCode";

const socialLinks = [
  {
    href: "https://www.instagram.com/",
    label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M15.5 12C15.5 13.933 13.933 15.5 12 15.5C10.067 15.5 8.5 13.933 8.5 12C8.5 10.067 10.067 8.5 12 8.5C13.933 8.5 15.5 10.067 15.5 12Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <circle cx="17.25" cy="6.75" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: "https://www.youtube.com/",
    label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="4"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M11 9.5L15 12L11 14.5V9.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    href: "https://www.kaywon.ac.kr/",
    label: "Kaywon Blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect
          x="3"
          y="3"
          width="18"
          height="18"
          rx="5"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M8.5 8.5H15.5V11.5C15.5 13.9853 13.4853 16 11 16C8.51472 16 6.5 13.9853 6.5 11.5V8.5H8.5Z"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M9 8.5V6.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M15 8.5V6.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__branding">
          <div className="site-footer__logo">
            <PIVOTTIME />
          </div>
          <address className="site-footer__address">
            <span>16038 경기도 의왕시 계원대학교로 66(내손동) 계원예술대학교</span>
            <span>
              66 Kaywondaehaengno (Naeson-dong), Uiwang-si, Gyeonggi-do, Korea
            </span>
          </address>
        </div>

        <div className="site-footer__right">
          <div className="site-footer__social">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="site-footer__social-link"
                aria-label={label}
              >
                {icon}
              </a>
            ))}
          </div>

          <dl className="site-footer__contact">
            <div>
              <dt>Tell</dt>
              <dd>031-424-7509</dd>
            </div>
            <div>
              <dt>Fax</dt>
              <dd>1899-5823</dd>
            </div>
            <div>
              <dt>E-Mail</dt>
              <dd>
                <a href="mailto:kaywon@kaywon.ac.kr">kaywon@kaywon.ac.kr</a>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <p className="site-footer__copyright">
        ©2025. Delight Insight PIVOTTIME All Right Reserved.
      </p>
    </footer>
  );
}
