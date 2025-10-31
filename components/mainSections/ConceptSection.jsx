// "use client"와 GSAP, React 훅들을 import 합니다.
"use client";
import { GETFEVER2 } from "../svgCode";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger"; // ScrollTrigger 플러그인 import
import "../../styles/mainSections/_concept.scss";

gsap.registerPlugin(ScrollTrigger); // ScrollTrigger 플러그인을 GSAP에 등록

export default function ConceptSection() {
  const sectionRef = useRef(null);
  const graphicTxtRef = useRef(null);
  const horizontalLineRef = useRef(null); // 가로선
  const radialGroupRef = useRef(null); // 방사형 선들을 담을 그룹

  const mainCircleRef = useRef(null); // 399px 크기 원
  const otherCirclesGroupRef = useRef(null); // 6개의 271px 원을 담을 그룹

  // SVG 그래픽의 기준점
  const center_x = 961;
  const center_y = 371.5;
  const horizontal_length = 1922;
  const numRadialLines = 12;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const conceptSection = sectionRef.current;
      const graphicTxt = graphicTxtRef.current;
      const horizontalLine = horizontalLineRef.current;
      const radialLines = gsap.utils.toArray(radialGroupRef.current.children);

      const mainCircle = mainCircleRef.current;
      const otherCircles = gsap.utils.toArray(
        otherCirclesGroupRef.current.children
      );

      // ⭐️ 바깥쪽 4개 원만 변수로 정의
      const outerCircles = [
        otherCircles[0],
        otherCircles[1],
        otherCircles[4],
        otherCircles[5],
      ];
      // const innerCircles = [otherCircles[2], otherCircles[3]]; // <- 이제 필요 없음

      // ⭐️ [5단계 로직을 위한 변수 정의]
      const verticalCircles = [ // 5-3에서 나타날 2개 원 (T/B)
        otherCircles[0], // 0번 원을 Top으로 재사용
        otherCircles[1], // 1번 원을 Bottom으로 재사용
      ];
      const circleSpacing = 280;
      const finalSpacing = circleSpacing + 34; // 314px 최종 간격

      // --- [준비] ---
      // (모든 준비 로직 동일)
      gsap.set(horizontalLine, {
        strokeDasharray: horizontal_length,
        strokeDashoffset: horizontal_length,
        autoAlpha: 0,
      });
      gsap.set(radialLines, {
        rotation: 0,
        autoAlpha: 0,
        transformOrigin: "center center",
      });
      gsap.set(graphicTxt, { opacity: 0, y: "1.042vw" });

      const mainCircleLength = mainCircle.getTotalLength();
      gsap.set(mainCircle, {
        strokeDasharray: mainCircleLength,
        strokeDashoffset: -mainCircleLength,
        fill: "none",
        autoAlpha: 0,
        scale: 1,
        transformOrigin: "center center",
      });
      gsap.set(otherCircles, {
        autoAlpha: 0,
        transformOrigin: "center center",
      });

      // --- [스토리텔링] ---
      const tl = gsap.timeline();

      // --- 1. 선 애니메이션 (정재생) ---
      // (동일)
      tl.to(horizontalLine, {
        autoAlpha: 1,
        strokeDashoffset: 0,
        duration: 2,
        ease: "power1.inOut",
      });
      tl.to(
        radialLines,
        {
          autoAlpha: 1,
          rotation: (i) => -(i + 1) * (9.74),
          duration: 2.5,
          ease: "power2.out",
          stagger: 0.1,
        },
        "-=0.5"
      );
      tl.to(graphicTxt, { opacity: 1, y: 0, duration: 2 }, "-=2.0");

      // --- 2. 선 애니메이션 (역재생) ---
      // (동일)
      tl.to({}, { duration: 2 });
      tl.to(graphicTxt, { opacity: 0, y: "1.042vw", duration: 3 }, "+=1");
      tl.to(
        radialLines,
        {
          autoAlpha: 0,
          rotation: 0,
          duration: 3.5,
          ease: "power2.inOut",
          stagger: { each: 0.05, from: "end" },
        },
        "-=2.5"
      );
      tl.to(
        horizontalLine,
        {
          strokeDashoffset: horizontal_length,
          autoAlpha: 0,
          duration: 3,
          ease: "power1.inOut",
        },
        "-=2.0"
      );

      // --- 3. [원 애니메이션 1/2] 원 생성 및 축소 ---
      // (동일)
      tl.to(
        mainCircle,
        {
          autoAlpha: 1,
          strokeDashoffset: 0,
          duration: 2,
          ease: "none",
        },
        "-=0.5"
      );
      tl.to(mainCircle, {
        fill: "black",
        duration: 0.5,
        ease: "none",
      });
      tl.to(mainCircle, {
        scale: 271 / 399,
        duration: 1,
        ease: "power2.out",
      });

      // --- 4. ⭐️ [원 애니메이션 3] 7개 원 정렬 및 롤링 ---

      // 4-1. 7개 원 정렬 (초기 280px 간격)
      tl.to(otherCircles, {
        autoAlpha: 1,
        x: (i) => (i < 3 ? -circleSpacing * (3 - i) : circleSpacing * (i - 2)),
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
      });

      // ⭐️ [추가] 4-2. 6개 원이 모두 최종 간격(314px)으로 벌어짐
      tl.to(otherCircles, {
        x: (i) => (i < 3 ? -finalSpacing * (3 - i) : finalSpacing * (i - 2)),
        duration: 1.5, // 벌어지는 애니메이션 시간
        ease: "power2.inOut",
      });

      // 4-3. 잠시 멈춤 (벌어진 상태 보여주기)
      tl.to({}, { duration: 0.5 });

      // ⭐️ [수정] 4-4. 4개 바깥쪽 원만 프레임 아웃
      tl.to(outerCircles, {
        autoAlpha: 0,
        rotation: (i) => (i < 2 ? -360 : 360),
        x: (i) => (i < 2 ? "-=1000" : "+=1000"),
        duration: 2.5,
        ease: "power1.in",
        stagger: 0.1,
      });
      
      
      // ⭐️ [삭제] 안쪽 원(innerCircles)을 따로 움직이는 로직 제거


      // --- 5. ⭐️ [최종 수정] T/B 원이 좌/우에서 출발하여 상/하로 이동 ---

      const swoopDuration = 1.5; // T/B 원이 움직이는 시간
      const xEase = "power2.in"; // X축 Easing (느리게 시작, 빠르게 끝: 좌우 이동이 빠르게 끝남)
      const yEase = "power2.out";  // Y축 Easing (빠르게 시작, 느리게 끝: 수직 이동이 느리게 끝남)

      // 5-1. (준비) T/B 원(0, 1)을 L/R 원과 "같은 위치"에 숨김 상태로 준비
      // (4-4 애니메이션이 끝난 "직후"에 실행됨)
      tl.set(verticalCircles, {
        x: (i) => (i === 0 ? -finalSpacing : finalSpacing), // ⭐️ [출발 X] 좌/우 위치
        y: 0,
        rotation: 0,
        autoAlpha: 0, // ⭐️ 숨겨진 상태
        transformOrigin: "center center",
      });

      // 5-2. T/B 원(0, 1)이 "나타나면서" X, Y 위치를 "호(Arc)" 경로로 이동
      tl.to(verticalCircles, {
        autoAlpha: 1, // ⭐️ 나타나기
        duration: swoopDuration,
        stagger: 0.05, // 0번 원(Top)과 1번 원(Bottom)이 0.05초 차이로 움직임
      });

      // [Top 원 - 0번] X축 애니메이션 (L -> C)
      tl.to(verticalCircles[0], {
        x: 0, // ⭐️ [도착 X] 중앙
        duration: swoopDuration,
        ease: xEase,
      }, "<"); // 5-2와 동시에 시작

      // [Top 원 - 0번] Y축 애니메이션 (C -> T)
      tl.to(verticalCircles[0], {
        y: -finalSpacing, // ⭐️ [도착 Y] 상단
        duration: swoopDuration,
        ease: yEase,
      }, "<"); // 5-2와 동시에 시작

      // [Bottom 원 - 1번] X축 애니메이션 (R -> C)
      tl.to(verticalCircles[1], {
        x: 0, // ⭐️ [도착 X] 중앙
        duration: swoopDuration,
        ease: xEase,
      }, "<0.05"); // 5-2의 stagger에 맞춰 0.05초 늦게 시작

      // [Bottom 원 - 1번] Y축 애니메이션 (C -> B)
      tl.to(verticalCircles[1], {
        y: finalSpacing, // ⭐️ [도착 Y] 하단
        duration: swoopDuration,
        ease: yEase,
      }, "<"); // 5-2의 stagger에 맞춰 0.05초 늦게 시작


      // --- [ScrollTrigger 연동] ---
      // (동일)
      ScrollTrigger.create({
        trigger: conceptSection,
        start: "top top",
        end: "bottom+=8000",
        pin: true,
        scrub: 1,
        animation: tl,
        // markers: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []); // [] : 처음 마운트될 때 한 번만 실행

  return (
    <div className="concept" ref={sectionRef}>
      <img className="webImage" src="/images/concept.png" alt="concept.png" />
      <div className="graphic">
        <svg
          viewBox="0 0 1922 743"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* --- 선 그래픽 --- */}
          <line
            ref={horizontalLineRef}
            x1="0"
            y1={center_y}
            x2={horizontal_length}
            y2={center_y}
            stroke="url(#paint0_linear_469_4682)"
            strokeWidth="1.5"
          />
          <g ref={radialGroupRef}>
            {Array.from({ length: numRadialLines }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={center_y}
                x2={horizontal_length}
                y2={center_y}
                stroke="url(#paint0_linear_469_4682)"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            ))}
          </g>

          {/* --- ⭐️ [SVG 순서: 6개 그룹이 먼저 그려져야 중앙 원 뒤로 숨음] --- */}
          
          {/* 6개 원 (먼저 그려져서 뒤에 깔림) */}
          <g ref={otherCirclesGroupRef}>
            {Array.from({ length: 6 }).map((_, i) => (
              <circle
                key={i}
                cx={center_x}
                cy={center_y}
                r="135" // 271/2
                transform={`rotate(-90 ${center_x} ${center_y})`}
                fill="black"
                stroke="url(#paint0_linear_472_4801)" // 271px 그라데이션
              />
            ))}
          </g>

          {/* 메인 원 (나중에 그려져서 "위에" 올라옴) */}
          <circle
            ref={mainCircleRef}
            cx={center_x}
            cy={center_y}
            r="199" // 399/2
            transform={`rotate(-90 ${center_x} ${center_y})`}
            fill="black"
            stroke="url(#paint0_linear_472_4801)"
          />

          <defs>
            {/* ... (defs 태그 내부는 동일) ... */}
            <linearGradient
              id="paint0_linear_469_4682"
              x1="960"
              y1="0.5"
              x2="960"
              y2="1.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint0_linear_472_4802"
              x1="199.5"
              y1="0"
              x2="199.5"
              y2="399"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient
              id="paint0_linear_472_4801"
              x1="135.5"
              y1="0"
              x2="135.5"
              y2="271"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#A4A4A4" stopOpacity="0.6" />
              <stop offset="0.471154" stopColor="#E1E1E1" />
              <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* <div className="txt" ref={graphicTxtRef}>
          <div></div>
          <p>생각을 잇고, 방향을 만드는 시작의 선</p>
        </div> */}
      </div>

      {/* 고정될 텍스트 영역 */}
      <div className="txt-wrap">
        <div className="logo">
          <GETFEVER2 />
        </div>

        <div className="description">
          <div className="title">
            <div>기획</div>
            <p>사고의 궤적</p>
          </div>

          <p>
            아이디어의 출발점과 도착점을 잇는 선은 방향을 제시하고, 흐름을 만듭니다.
            <br />
            선들이 모여 스토리라인이 되고, 그 안에서 연결과 구조가 생겨납니다.
            <br />
            플로우차트처럼 서로 이어지는 선 위에서, 기획은 전체를 조율하는 길을 그립니다.
          </p>
        </div>
      </div>
    </div>
  );
}