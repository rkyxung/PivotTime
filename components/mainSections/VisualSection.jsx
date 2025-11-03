"use client";
import { useEffect, useRef } from "react";
import "../../styles/mainSections/_visual.scss";
import { GOPIVOT } from "../svgCode";
import Line3D from "./3dKeyVisual/line3D";
import Circle3D from "./3dKeyVisual/circle3D";
import Square3D from "./3dKeyVisual/square3D";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// MotionPathPlugin은 더 이상 필요 없으므로 제거합니다.

export default function VisualSection() {
  const sectionRef = useRef(null);
  const objectsRef = useRef(null);
  const labelKorRef = useRef(null); // 1. 한글 라벨 Ref 추가
  const labelEngRef = useRef(null); // 2. 영문 라벨 Ref 추가

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const objectsEl = objectsRef.current;
    if (!sectionEl || !objectsEl) return;

    // 3. ScrollTrigger만 등록
    gsap.registerPlugin(ScrollTrigger);

    const line = objectsEl.querySelector(".line");
    const circle = objectsEl.querySelector(".circle");
    const square = objectsEl.querySelector(".square");
    const labelKor = labelKorRef.current; // 4. 라벨 element 가져오기
    const labelEng = labelEngRef.current; // 4. 라벨 element 가져오기

    // --- 5. [수정] 초기 상태 설정 ---
    gsap.set(line, { autoAlpha: 1 });
    gsap.set(circle, { autoAlpha: 0 });
    gsap.set(square, { autoAlpha: 0 });
    // 라벨은 기본 텍스트("도전")로 보이게 설정
    gsap.set([labelKor, labelEng], { autoAlpha: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: "top top",
        end: "+=4000", // 스크롤 길이
        scrub: 1,
        pin: true, // 섹션 고정
      },
    });

    // --- 6. [수정] 라벨 텍스트를 포함한 페이드인/아웃 타임라인 ---
    const fadeDuration = 0.8; // 교체(페이드)되는 시간 (스크롤 기준)
    const holdDuration = 3.0; // 각 위치에서 잠시 머무는 시간 (스크롤 기준)

    // 1. "Line" + "도전" 상태로 1초간 머뭄
    tl.to({}, { duration: holdDuration });

    // 2. "Line" + "도전" -> "Circle" + "창의성" 교체
    tl.addLabel("change1");
    // "Line"과 "도전" 라벨 동시 페이드 아웃
    tl.to(
      [line, labelKor, labelEng],
      {
        autoAlpha: 0,
        duration: fadeDuration,
      },
      "change1"
    );

    // 페이드 아웃 직후, 텍스트와 *위치*를 즉시 변경(set)
    tl.set(labelKor, {
      textContent: "창의성",
      top: "9.5vw", // (여기에 '창의성' KOR top 위치 입력)
      left: "13vw", // (여기에 '창의성' KOR left 위치 입력)
      right: "auto",
    });
    tl.set(
      labelEng,
      {
        textContent: "CREATIVITY",
        top: "32vw", // (여기에 '창의성' ENG top 위치 입력)
        right: "3.5vw", // (여기에 '창의성' ENG right 위치 입력)
        left: "auto",
      },
      "<" // "<" = labelKor와 동시에 실행
    );

    // "Circle"과 "창의성" 라벨 동시 페이드 인
    tl.to([circle, labelKor, labelEng], {
      autoAlpha: 1,
      duration: fadeDuration,
    });

    // 3. "Circle" + "창의성" 상태로 1초간 머뭄
    tl.to({}, { duration: holdDuration });

    // 4. "Circle" + "창의성" -> "Square" + "균형" 교체
    tl.addLabel("change2");
    // "Circle"과 "창의성" 라벨 동시 페이드 아웃
    tl.to(
      [circle, labelKor, labelEng],
      {
        autoAlpha: 0,
        duration: fadeDuration,
      },
      "change2"
    );

    // 페이드 아웃 직후, 텍스트와 *위치*를 즉시 변경(set)
    tl.set(labelKor, {
      textContent: "균형", // (플레이스홀더)
      top: "38.7vw", // (여기에 새 KOR top 위치 입력)
      left: "12vw", // (여기에 새 KOR left 위치 입력)
      right: "auto", // (필요시 'auto'로 초기화)
    });
    tl.set(
      labelEng,
      {
        textContent: "BALANCE", // (플레이스홀더)
        top: "6.1vw", // (여기에 새 ENG top 위치 입력)
        right: "2vw", // (여기에 새 ENG right 위치 입력)
        left: "auto", // (필요시 'auto'로 초기화)
      },
      "<"
    ); // "<" = labelKor와 동시에 실행

    // "Square"와 "균형" 라벨 동시 페이드 인 (새 위치에서)
    tl.to([square, labelKor, labelEng], {
      autoAlpha: 1,
      duration: fadeDuration,
    });

    // 5. "Square" + "균형" 상태로 1초간 머뭄
    tl.to({}, { duration: 1.0 });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, []); // useEffect 끝

  return (
    <div className="visual" ref={sectionRef}>
      <img className="webImage" src="/images/visual.png" alt="visual.png" />

      <div className="txt-wrap">
        <div className="logo">
          <GOPIVOT />
        </div>
        <p>
          세 가지 원동력은 각자의 방향과 힘을 지닌 채 움직이며,
          <br /> 다양한 열정이 하나의 궤적을 이루는 순간을 표현합니다.
        </p>
      </div>

      <div className="graphic">
        <div className="graphic-objects" ref={objectsRef}>
          <div className="graphic-slot line">
            {/* Line3D는 interactive prop이 없으므로 기본값이 true라고 가정 */}
            <Line3D />
          </div>
          <div className="graphic-slot circle">
            {/* ⚠️ 수정: interactive={false} -> interactive={true} */}
            <Circle3D interactive={true} isZoomed={false} />
          </div>
          <div className="graphic-slot square">
            {/* ⚠️ 수정: interactive={false} -> interactive={true} */}
            <Square3D interactive={true} />
          </div>
        </div>

        {/* 7. 라벨에 ref 연결 */}
        <div className="label kor" ref={labelKorRef}>
          도전
        </div>
        <div className="label en" ref={labelEngRef}>
          CHALLENGE
        </div>
      </div>
    </div>
  );
}
