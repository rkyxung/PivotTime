"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../styles/getFever.scss";
import InfoBox from "../components/InfoBox";
import { GETFEVER2 } from "../components/svgCode";

gsap.registerPlugin(ScrollTrigger);

const TIMELINE_MARKS = [
  { label: "2023", className: "year-marker__2023" },
  { label: "2024", className: "year-marker__2024" },
  { label: "2025", className: "year-marker__2025" },
];

export default function GetFever() {
  const heroRef = useRef(null);
  const archiveRef = useRef(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    const archiveEl = archiveRef.current;
    if (!heroEl || !archiveEl) return undefined;

    const ctx = gsap.context(() => {
      gsap.set(heroEl, {
        "--hero-shift-x": "0vw",
        "--hero-shift-y": "0vh",
        "--hero-scale": 1,
        "--hero-rotation": "0deg",
      });

      gsap.set(archiveEl, {
        "--archive-shift-x": "0vw",
        "--archive-shift-y": "0vh",
        "--archive-scale": 1,
        "--archive-rotation": "0deg",
      });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: heroEl,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        })
        .to(heroEl, {
          "--hero-shift-x": "-12vw",
          "--hero-shift-y": "32vh",
          "--hero-scale": 0.65,
          "--hero-rotation": "-140deg",
          ease: "none",
          immediateRender: false,
        });

      gsap
        .timeline({
          scrollTrigger: {
            trigger: archiveEl,
            start: "top 90%",
            end: "top center",
            scrub: true,
          },
        })
        .fromTo(
          archiveEl,
          {
            "--archive-shift-x": "40vw",
            "--archive-shift-y": "-10vh",
            "--archive-scale": 0.8,
            "--archive-rotation": "-60deg",
          },
          {
            "--archive-shift-x": "0vw",
            "--archive-shift-y": "0vh",
            "--archive-scale": 1,
            "--archive-rotation": "-20deg",
            ease: "none",
          }
        );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="getFever">
      <section className="hero" ref={heroRef}>
        <img className="webImage" src="/images/getFever.png" alt="getFever" />

        <div className="hero-txt">
          <div className="logo">
            <GETFEVER2 />
          </div>
          <div className="slogan">
            입학부터 졸업까지, 열정 가득한 우리의 이야기를 확인해 보세요.
          </div>
        </div>

        <div className="object hero-object">
          <div className="object-shell">
            <div className="orbit-layer">
              <div className="svg-container">
                <svg
                  viewBox="0 0 1876 1876"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M939.665 1874.12C1456.79 1873.32 1875.36 1453.46 1874.56 936.339C1873.77 419.213 1453.91 0.645529 936.781 1.44182C419.656 2.2381 1.0879 422.097 1.88419 939.223C2.68048 1456.35 422.539 1874.92 939.665 1874.12Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M939.589 1721.44C1372.3 1720.77 1722.55 1369.45 1721.88 936.734C1721.21 504.019 1369.89 153.775 937.176 154.441C504.461 155.108 154.217 506.432 154.883 939.147C155.55 1371.86 506.874 1722.11 939.589 1721.44Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M938.689 1240.43C1105.84 1240.17 1241.13 1104.46 1240.87 937.315C1240.61 770.166 1104.91 634.874 937.757 635.131C770.608 635.389 635.316 771.098 635.573 938.247C635.831 1105.4 771.54 1240.69 938.689 1240.43Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                  <path
                    opacity="0.9"
                    d="M939.064 1484.39C1240.95 1483.93 1485.3 1238.82 1484.83 936.939C1484.37 635.055 1239.26 390.707 937.381 391.172C635.497 391.637 391.149 636.739 391.614 938.623C392.079 1240.51 637.181 1484.85 939.064 1484.39Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                  <path
                    opacity="0.45"
                    d="M938.87 1358.05C1170.98 1357.69 1358.85 1169.24 1358.49 937.134C1358.14 705.025 1169.68 517.154 937.576 517.511C705.468 517.869 517.596 706.32 517.954 938.428C518.311 1170.54 706.762 1358.41 938.87 1358.05Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                  <path opacity="0.5" d="M1042.25 937.62L1874.56 936.339" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M833.162 938L1.4419 939.281" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M938.388 1041.81L939.67 1874.13" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M938.056 833.161L936.776 1.44729" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M1011.81 1011.14L1601.34 1598.85" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M864.038 863.837L275.108 276.718" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M864.575 1011.67L277.154 1600.9" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M1011.88 863.898L1599.29 274.671" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M841.732 977.932L73.7107 1297.44" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M1034.42 897.758L1802.73 578.129" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M898.502 1034.1L581.235 1803.4" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M978.062 841.16L1295.2 72.1698" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M978.153 1033.77L1297.87 1802.29" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M897.979 841.083L578.557 73.276" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M841.39 897.862L72.5997 580.805" stroke="#E1E1E1" />
                  <path opacity="0.5" d="M1034.33 977.423L1803.83 1294.77" stroke="#E1E1E1" />
                  <path
                    d="M938.088 1041.81C995.705 1041.72 1042.34 994.942 1042.25 937.325C1042.16 879.708 995.384 833.072 937.767 833.161C880.15 833.249 833.514 880.029 833.603 937.646C833.691 995.263 880.471 1041.9 938.088 1041.81Z"
                    stroke="#E1E1E1"
                    strokeMiterlimit="10"
                  />
                </g>
              </svg>
              </div>

              {TIMELINE_MARKS.map((mark) => (
                <div className={`year-marker ${mark.className}`} key={mark.label}>
                  <span />
                  <p>{mark.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scrollGuide">
          <p>SCROLL DOWN</p>
          <svg viewBox="0 0 20 11" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.553 0.55L9.525 9.578L18.497 0.55" stroke="white" strokeWidth="1.56" />
          </svg>
        </div>

        <div className="infoBox">
          <InfoBox />
        </div>
      </section>

      <section className="archive-nav" ref={archiveRef}>
        <div className="archive-object">
          <div className="object-shell">
            <div className="orbit-layer">
              <div className="svg-container">
                <svg
                  viewBox="0 0 1876 1876"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g opacity="0.5">
                  <path
                    d="M939.665 1874.12C1456.79 1873.32 1875.36 1453.46 1874.56 936.339C1873.77 419.213 1453.91 0.645529 936.781 1.44182C419.656 2.2381 1.0879 422.097 1.88419 939.223C2.68048 1456.35 422.539 1874.92 939.665 1874.12Z"
                    stroke="#2b2b2b"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M939.589 1721.44C1372.3 1720.77 1722.55 1369.45 1721.88 936.734C1721.21 504.019 1369.89 153.775 937.176 154.441C504.461 155.108 154.217 506.432 154.883 939.147C155.55 1371.86 506.874 1722.11 939.589 1721.44Z"
                    stroke="#2b2b2b"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M938.689 1240.43C1105.84 1240.17 1241.13 1104.46 1240.87 937.315C1240.61 770.166 1104.91 634.874 937.757 635.131C770.608 635.389 635.316 771.098 635.573 938.247C635.831 1105.4 771.54 1240.69 938.689 1240.43Z"
                    stroke="#2b2b2b"
                    strokeMiterlimit="10"
                  />
                  <path
                    d="M898.502 1034.1L581.235 1803.4"
                    stroke="#2b2b2b"
                  />
                </g>
              </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="archive-card">
          <span></span>
          <svg
            width="159"
            height="90"
            viewBox="0 0 159 90"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M125.124 0L136.319 0V78.3712H125.124V0Z" fill="#E1E1E1" />
            <path
              d="M113.927 33.5873C113.927 39.7706 108.915 44.7832 102.732 44.7832L102.732 22.3914L113.927 22.3914L113.927 33.5873Z"
              fill="#E1E1E1"
            />
            <path
              d="M147.515 89.5664C141.332 89.5664 136.32 84.5538 136.32 78.3705L158.711 78.3705L158.711 89.5664L147.515 89.5664Z"
              fill="#E1E1E1"
            />
            <path
              d="M113.927 89.5664C120.111 89.5664 125.123 84.5538 125.123 78.3705L102.732 78.3705L102.732 89.5664L113.927 89.5664Z"
              fill="#E1E1E1"
            />
            <path
              d="M125.123 22.3926L113.927 22.3926L113.927 11.1967L125.123 11.1967L125.123 22.3926Z"
              fill="#E1E1E1"
            />
            <path
              d="M0 22.3912C0 16.2079 5.01257 11.1953 11.1959 11.1953L11.1959 78.3707C5.01257 78.3707 0 73.3581 0 67.1748L0 22.3912Z"
              fill="#E1E1E1"
            />
            <path
              d="M55.9794 -4.89387e-07C62.1627 -2.19106e-07 67.1753 5.01257 67.1753 11.1959L11.1958 11.1959C11.1958 5.01257 16.2084 -2.22783e-06 22.3917 -1.95755e-06L55.9794 -4.89387e-07Z"
              fill="#E1E1E1"
            />
            <path
              d="M55.9794 89.5664C62.1627 89.5664 67.1753 84.5538 67.1753 78.3705L11.1958 78.3705C11.1958 84.5538 16.2084 89.5664 22.3917 89.5664L55.9794 89.5664Z"
              fill="#E1E1E1"
            />
            <path
              d="M78.3711 22.3926L67.1752 22.3926L67.1752 11.1967C73.3585 11.1967 78.3711 16.2093 78.3711 22.3926Z"
              fill="#E1E1E1"
            />
            <path
              d="M78.3711 22.3906L67.1752 22.3906L67.1752 78.3701C73.3585 78.3701 78.3711 73.3575 78.3711 67.1742L78.3711 22.3906Z"
              fill="#E1E1E1"
            />
          </svg>
          <div className="txt">
            <div>1학년 1학기</div>
            <p>낯설지만 설레는 첫걸음</p>
          </div>
        </div>
      </section>
    </div>
  );
}
