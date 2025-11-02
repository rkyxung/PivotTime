"use client";

import "../../styles/mainSections/_keywords.scss";
import { PIVOTTIME } from "../svgCode";
import { useEffect, useRef } from "react";

export default function KeywordsSection() {
  const keywordsRef = useRef(null);

  // IntersectionObserver 로직 추가
  useEffect(() => {
    const currentRef = keywordsRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // 화면에 보이면 'in-view' 클래스 추가
          currentRef.classList.add("in-view");
          observer.unobserve(currentRef); // 한번 실행 후 감시 중단
        }
      },
      {
        threshold: 0.1, // 섹션이 10% 보였을 때 실행
      }
    );

    observer.observe(currentRef);

    return () => {
      observer.disconnect(); // 컴포넌트 언마운트 시 정리
    };
  }, []); // []: 마운트 시 한번만 실행

  return (
    // 4. ref 연결
    <div className="keywords" ref={keywordsRef}>
      <img className="webImage" src="/images/keywords.png" alt="keywords.png" />

      <div className="graphics">
        {/* === Circle SVG === */}
        <svg
          className="circle"
          viewBox="0 0 439 385"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="c1"
            pathLength="1000"
            cx="281.191"
            cy="227.941"
            r="156.377"
            stroke="url(#paint0_linear_1816_3918)"
          />
          <circle
            className="c2"
            cx="156.877"
            cy="156.877"
            r="156.377"
            stroke="url(#paint1_linear_1816_3918)"
          />

          <circle
            className="c3"
            cx="209.368"
            cy="204.909"
            r="156.377"
            stroke="url(#paint2_linear_1816_3918)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1816_3918"
              x1="281.191"
              y1="71.064"
              x2="281.191"
              y2="384.819"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1816_3918"
              x1="156.877"
              y1="0"
              x2="156.877"
              y2="313.755"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1816_3918"
              x1="209.368"
              y1="48.0312"
              x2="209.368"
              y2="361.786"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* === Line SVG === */}
        <svg
          className="line"
          viewBox="0 0 927 459"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            className="l1"
            pathLength="1000"
            d="M300.41 441.213L604.699 22.8159"
            stroke="url(#paint0_linear_1816_3919)"
          />
          <path
            className="l2"
            pathLength="1000"
            d="M627.736 423.757L270.195 49.8425"
            stroke="url(#paint1_linear_1816_3919)"
          />

          <path
            className="l3"
            pathLength="1000"
            d="M0.22168 458.449L926.705 0.448464"
            stroke="url(#paint2_linear_1816_3919)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1816_3919"
              x1="452.554"
              y1="22.8159"
              x2="452.554"
              y2="441.213"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7B7B7B" stopOpacity="0.5" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1816_3919"
              x1="243.109"
              y1="199.556"
              x2="654.822"
              y2="274.043"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7B7B7B" stopOpacity="0.5" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1816_3919"
              x1="463.463"
              y1="0.448242"
              x2="463.463"
              y2="458.449"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7B7B7B" stopOpacity="0.5" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#7B7B7B" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        {/* === Rectangle SVG === */}
        <svg
          className="rectangle"
          viewBox="0 0 351 386"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            className="r1"
            pathLength="1000"
            x="66.5176"
            y="45.498"
            width="283.787"
            height="283.787"
            stroke="url(#paint0_linear_1816_3920)"
          />
          <rect
            className="r2"
            x="0.5"
            y="0.5"
            width="283.787"
            height="283.787"
            stroke="url(#paint1_linear_1816_3920)"
          />

          <rect
            className="r3"
            x="33.5815"
            y="101.285"
            width="283.787"
            height="283.787"
            stroke="url(#paint2_linear_1816_3920)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_1816_3920"
              x1="208.411"
              y1="44.998"
              x2="208.411"
              y2="329.785"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_1816_3920"
              x1="142.394"
              y1="0"
              x2="142.394"
              y2="284.787"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint2_linear_1816_3920"
              x1="175.475"
              y1="100.785"
              x2="175.475"
              y2="385.572"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="txt">
        <div className="title">
          <div className="delight">2025 DELIGHT INSIGHT</div>
          <div className="logo">
            <PIVOTTIME/>
          </div>
        </div>

        <p>
          Delight insight는 계원예술대학교 디지털미디어디자인과 졸업 전시의
          대주제입니다.
          <br />
          이번 주제는 한 지점을 중심으로 방향을 바꾸거나 모색한다는 의미의
          PIVOT을 활용해,
          <br />
          우리가 쌓아온 경험과 배움을 토대로 더 넓은 가능성을 향해 움직이는
          순간을 그립니다.
        </p>
      </div>
    </div>
  );
}
