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

  const frameRef = useRef(null); // <<<< [추가] 사각형 틀 Ref >>>>
  const frameTopEdgeRef = useRef(null);

  const descriptionRef = useRef(null);

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

      // 바깥쪽 4개 원만 변수로 정의
      const outerCircles = [
        otherCircles[0],
        otherCircles[1],
        otherCircles[4],
        otherCircles[5],
      ];
      // const innerCircles = [otherCircles[2], otherCircles[3]]; // <- 이제 필요 없음

      // [5단계 로직을 위한 변수 정의]
      const verticalCircles = [
        // 5-3에서 나타날 2개 원 (T/B)
        otherCircles[0], // 0번 원을 Top으로 재사용
        otherCircles[1], // 1번 원을 Bottom으로 재사용
      ];
      const circleSpacing = 280;
      const finalSpacing = circleSpacing + 34; // 314px 최종 간격

      // [8단계 이후 그리드 정렬을 위한 변수]
      const finalCircleSize = 271; // 그리드 정렬 기준 크기
      const final_frame_width = finalCircleSize * 4; // 271 * 4 = 1084 (패딩 없이)
      const final_frame_height = finalCircleSize * 2; // 271 * 2 = 542 (패딩 없이)

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
          rotation: (i) => -(i + 1) * 9.74,
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

      // --- 4. [원 애니메이션 3] 7개 원 정렬 및 롤링 ---

      // 4-1. 7개 원 정렬 (초기 280px 간격)
      tl.to(otherCircles, {
        autoAlpha: 1,
        x: (i) => (i < 3 ? -circleSpacing * (3 - i) : circleSpacing * (i - 2)),
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
      });

      // [추가] 4-2. 6개 원이 모두 최종 간격(314px)으로 벌어짐
      tl.to(otherCircles, {
        x: (i) => (i < 3 ? -finalSpacing * (3 - i) : finalSpacing * (i - 2)),
        duration: 1.5, // 벌어지는 애니메이션 시간
        ease: "power2.inOut",
      });

      // 4-3. 잠시 멈춤 (벌어진 상태 보여주기)
      tl.to({}, { duration: 0.5 });

      // [수정] 4-4. 4개 바깥쪽 원만 프레임 아웃
      tl.to(outerCircles, {
        autoAlpha: 0,
        rotation: (i) => (i < 2 ? -360 : 360),
        x: (i) => (i < 2 ? "-=1000" : "+=1000"),
        duration: 2.5,
        ease: "power1.in",
        stagger: 0.1,
      });

      // [삭제] 안쪽 원(innerCircles)을 따로 움직이는 로직 제거

      // --- 6. [새 원 2개를 좌우 원과 '완전히 겹치게' 만든 후 위/아래로 보낸다] ---

      const svgNS2 = "http://www.w3.org/2000/svg"; // SVG 요소 만들 때 필요한 네임스페이스를 다시 선언함
      const groupEl2 = otherCirclesGroupRef.current; // 기존 6개 원이 들어있는 <g> 요소를 가져옴

      let topClone = null; // 위로 올라갈 새 원을 담을 변수
      let bottomClone = null; // 아래로 내려갈 새 원을 담을 변수
      let middleClone = null; // 추가 스택 용도의 새 원
      let extraDropClones = []; // 최종 드롭 단계에서 사용할 추가 클론들

      if (groupEl2) {
        // 그룹이 실제로 존재할 때만 실행
        const createCircle2 = () => {
          const c = document.createElementNS(svgNS2, "circle"); // 새 <circle> SVG 요소를 하나 만듦
          c.setAttribute("cx", String(center_x)); // 중심 x좌표를 기존 원들과 동일하게 설정
          c.setAttribute("cy", String(center_y)); // 중심 y좌표를 기존 원들과 동일하게 설정
          c.setAttribute("r", "135"); // 반지름을 135로 설정해서 271px 원을 만듦
          c.setAttribute("transform", `rotate(-90 ${center_x} ${center_y})`); // 기존 원과 똑같이 -90도 회전시켜서 스타일을 맞춤
          c.setAttribute("fill", "black"); // 내부 색을 검정으로 설정
          c.setAttribute("stroke", "url(#paint0_linear_472_4801)"); // 외곽선에 그라데이션 스트로크를 넣음
          c.setAttribute("class", "__clone2"); // 나중에 정리할 수 있도록 클래스명을 붙여둠
          return c; // 만들어진 원을 반환
        };

        // 여기서 기준이 되는 좌우 원은 애니메이션 이후에도 남아 있는 애들(가운데 3개 중 좌/우)입니다.
        const leftBase = otherCircles[2]; // 왼쪽에 남아 있는 원을 가져옴
        const rightBase = otherCircles[3]; // 오른쪽에 남아 있는 원을 가져옴
        const centerBase = leftBase || rightBase; // 새 원을 삽입할 기준

        topClone = createCircle2(); // 위로 올릴 복제 원 하나를 생성
        bottomClone = createCircle2(); // 아래로 내릴 복제 원 하나를 생성
        middleClone = createCircle2(); // 추가 스택을 위한 복제 원
        const additionalClones = Array.from({ length: 3 }, () =>
          createCircle2()
        ); // 최종 그리드를 채우기 위한 추가 복제 원
        extraDropClones = additionalClones;

        // 기준 원 바로 앞에 넣어서 z순서를 비슷하게 맞춰줌
        if (leftBase) groupEl2.insertBefore(topClone, leftBase);
        else groupEl2.appendChild(topClone); // 왼쪽 기준 원 앞에 위 원을 끼워 넣음
        if (rightBase) groupEl2.insertBefore(bottomClone, rightBase);
        else groupEl2.appendChild(bottomClone); // 오른쪽 기준 원 앞에 아래 원을 끼워 넣음
        if (centerBase) groupEl2.insertBefore(middleClone, centerBase);
        else groupEl2.appendChild(middleClone);
        additionalClones.forEach((clone) => {
          groupEl2.appendChild(clone);
        });

        //    이미 위에서 otherCircles들을 -finalSpacing / +finalSpacing 으로 벌려놨으니까
        //    그대로 그 값을 써주면 겹쳐 보임
        gsap.set(topClone, {
          autoAlpha: 0, // 처음에는 안 보이게 숨김
          x: -finalSpacing, // 왼쪽 원과 똑같은 x 위치로 강제 지정
          y: 270, // 가운데 라인과 똑같은 y
          rotation: 0, // 시작할 때는 회전 0
          svgOrigin: `${center_x} ${center_y}`, // 회전 기준을 SVG 전체 중앙으로 잡음
        });
        gsap.set(bottomClone, {
          autoAlpha: 0, // 처음에는 안 보이게 숨김
          x: finalSpacing, // 오른쪽 원과 똑같은 x 위치로 강제 지정
          y: 270, // 가운데 라인과 똑같은 y
          rotation: 0, // 시작할 때는 회전 0
          svgOrigin: `${center_x} ${center_y}`, // 회전 기준을 SVG 전체 중앙으로 잡음
        });
        gsap.set(middleClone, {
          autoAlpha: 0,
          x: 0,
          y: 270,
          rotation: 0,
          svgOrigin: `${center_x} ${center_y}`,
        });
        additionalClones.forEach((clone) => {
          gsap.set(clone, {
            autoAlpha: 0,
            x: 0,
            y: 270,
            rotation: 0,
            svgOrigin: `${center_x} ${center_y}`,
          });
        });
      }

      // 두 개 원을 위/아래로 동시에 이동시키는 애니메이션
      // ... (이전 코드: SVG 요소 생성, gsap.set()으로 초기 위치 설정 부분은 그대로 유지) ...

      // 두 원이 실제로 만들어졌을 때만 실행
      if (topClone && bottomClone) {
        // 1. 페이드 인 (동일)
        tl.to([topClone, bottomClone], {
          autoAlpha: 1,
          duration: 0.3,
        });

        // 2. X축 (수평 이동)과 Rotation은 부드럽게 진행 (Power1.inOut)
        tl.to(
          [topClone, bottomClone],
          {
            x: 0, // 중앙으로 이동
            rotation: (i) => (i === 0 ? -360 : 360), // 회전은 유지
            duration: 3,
            ease: "power1.inOut", // X축 이동은 부드럽게 시작/종료
          },
          "<"
        );

        // 3. Y축 (수직 이동)을 2단계로 분리하여 중간 정점을 만듭니다 (더 큰 포물선)

        // TopClone의 Y축 이동 (시작 위치 Y=270, 최종 Y=-40)
        // 포물선 정점을 Y=150 (중앙선보다 아래)으로 설정하여 궤적을 깊게 함
        tl.to(
          topClone,
          {
            y: -100, // 수정: 중앙선(0)을 넘어 최종 목표보다 더 위로 솟아오르도록 설정
            duration: 1.5, // 전체 시간의 절반
            ease: "power1.out",
          },
          "<" // X축 이동과 동시에 시작
        );
        tl.to(
          topClone,
          {
            y: -40, // 최종 위치
            duration: 1.5, // 나머지 절반 시간
            ease: "power1.in",
          },
          "-=1" // 이전 Y축 트윈이 끝나는 시점과 동시에 시작 (이어지도록)
        );

        // BottomClone의 Y축 이동 (시작 위치 y=270, 최종 y=finalSpacing*1.85)
        // 정점: 최종 목표(약 580)보다 더 아래(800)로 파고들도록 설정
        // finalSpacing*1.85는 약 580px이므로, 800px은 더 아래입니다.
        tl.to(
          bottomClone,
          {
            y: 600, // 수정: 최종 목표보다 더 아래로 파고들도록 설정 (800px로 임의 설정)
            duration: 1.5, // 전체 시간의 절반
            ease: "power1.out",
          },
          "<-1" // TopClone 시작 시점(-1초)에 맞춰 시작
        );
        tl.to(
          bottomClone,
          {
            y: finalSpacing * 1.85, // 최종 위치
            duration: 1.5, // 나머지 절반 시간
            ease: "power1.in",
          },
          "-=1" // 이전 Y축 트윈이 끝나는 시점과 동시에 시작 (이어지도록)
        );
      }

      tl.to({}, { duration: 0.7 });

      // [6단계 계산]: 목표 크기(212px)에 도달하기 위한 최종 스케일 비율을 계산합니다.
      const mainCircleStartSize = 399;
      const otherCircleStartSize = 271;
      const targetSize = 212;

      // 1. 중앙 원의 최종 스케일:
      //    (현재: 271/399) 에서 목표 크기(212px)로 축소해야 함. 최종 비율: 212/399
      const mainCircleFinalScale = targetSize / mainCircleStartSize;

      // 2. 나머지 4개 원의 최종 스케일:
      //    (현재: 1) 상태에서 목표 크기(212px)로 축소해야 함. 최종 비율: 212/271
      const otherCircleFinalScale = targetSize / otherCircleStartSize;

      // 1. 중앙 원 애니메이션 (기준)
      tl.to(
        mainCircle,
        {
          // scale: 현재 누적된 비율(271/399)에서 최종 목표 비율(212/399)로 축소
          scale: mainCircleFinalScale,
          y: "+=10",
          duration: 1.5,
          ease: "back.out(3)",
        },
        // 5단계 끝난 후 즉시 시작 (">")
        ">"
      );

      // 2. 주변 원 애니메이션 (중앙 원의 중간 시점에 시작)
      const resizeTargets = [
        otherCircles[2],
        otherCircles[3],
        topClone,
        bottomClone,
        middleClone,
        ...extraDropClones,
      ].filter(Boolean);
      tl.to(
        resizeTargets,
        {
          // scale: 현재 scale: 1에서 otherCircleFinalScale 비율로 축소
          scale: otherCircleFinalScale,
          y: "+=10",
          duration: 1.5,
          ease: "back.out(3)",
        },
        "<.5" // 중앙 원 애니메이션 시작 시점(<)에서 0.75초 후 시작
      );

      // // 3. 완성된 형태를 잠깐 보여주기 위한 대기
      // tl.to({}, { duration: 1.0 });
      // --- 7. 중앙을 기준으로 네 원이 서서히 가까워지는 애니메이션 ---
      // 이동 거리값을 정의 (314px → 240px 정도로 줄이기)
      const compactSpacing = finalSpacing - 74; // 약 240px, 거리감을 줄일 목표 간격
      // 1. 상하좌우 원을 모두 모아 배열로 저장
      const surroundingCircles = [
        otherCircles[2], // 좌측 원
        otherCircles[3], // 우측 원
        topClone, // 위 원
        bottomClone, // 아래 원
      ];

      // 2. 네 원이 모두 중앙으로 서서히 이동 (거리가 줄어드는 모션)
      tl.to(
        surroundingCircles,
        {
          x: (i) => {
            const anchorX = Number(gsap.getProperty(mainCircle, "x")) || 0; // 중앙 원의 현재 x 좌표
            if (i === 0) return anchorX - compactSpacing; // 왼쪽 원은 중앙 기준 왼쪽으로
            if (i === 1) return anchorX + compactSpacing; // 오른쪽 원은 중앙 기준 오른쪽으로
            return anchorX; // 위/아래 원은 x 변화 없음(중앙 값 유지)
          },

          y: (i) => {
            const anchorY = 280 || 0; // 중앙 원의 현재 y 좌표
            // i에 따라 위/아래 방향 구분
            if (i === 2) return anchorY - compactSpacing; // 위 원은 중앙 기준 위로
            if (i === 3) return anchorY + compactSpacing; // 아래 원은 중앙 기준 아래로
            return anchorY; // 좌/우 원은 y 변화 없음(중앙 값 유지)
          },
          duration: 2.2, // 부드럽게 이동하도록 시간 설정
          ease: "power3.inOut", // 천천히 시작해서 천천히 멈추는 자연스러운 이징
        },
        "< 1" // 바로 이전 스케일 축소 애니메이션이 끝난 직후 실행
      );

      // 3. 마지막 형태 유지 (5개 원이 근접한 십자 형태로 고정)
      tl.to({}, { duration: 1.0 }); // 1초 동안 정지해 결과를 보여줌

      // --- 7. 십자 원들의 낙하 애니메이션 ---
      const frame = frameRef.current;
      const [upperLeftClone, upperRightClone, bottomRightClone] =
        extraDropClones;
      const dropElements = [
        upperLeftClone,
        mainCircle,
        upperRightClone,
        otherCircles[2],
        middleClone,
        otherCircles[3],
        topClone,
        bottomClone,
        bottomRightClone,
      ];

      if (frame && dropElements.every(Boolean)) {
        const stackCandidates = dropElements;
        // 7-1. 사각 프레임 초기 상태와 낙하 전 미세 흔들림 준비
        const frameWidth = 640;
        const frameHeight = 422;
        const frameFinalWidth = 1120;
        const frameScaleDuration = 1.5;
        const frameStartY = 760; // 화면 아래에서 살짝 숨김
        const frameReadyY = 160; // 원이 떨어지기 직전 고정될 위치
        const frameFinalY = frameReadyY; // 준비 위치를 최종 위치로 사용
        const hoverLift = -320; // 낙하 전 원들을 더 높이 들어 올림
        const wobbleDistance = 16; // 원이 아래로 출렁일 거리(10~20px 사이)

        gsap.set(frame, {
          autoAlpha: 0,
          x: center_x - frameWidth / 2,
          y: frameStartY,
          transformOrigin: "center center",
          scaleX: 1,
        });
        const topEdge = frameTopEdgeRef.current;
        if (topEdge) {
          gsap.set(topEdge, {
            opacity: 0,
            strokeDasharray: frameFinalWidth,
            strokeDashoffset: frameFinalWidth,
          });
        }

        const circleRadius = targetSize / 2;
        const frameHalfWidth = frameFinalWidth / 2;
        const edgeX = frameHalfWidth - circleRadius;
        const xSpread = [
          -edgeX,
          -edgeX * 0.65,
          -edgeX * 0.35,
          -edgeX * 0.15,
          0,
          edgeX * 0.15,
          edgeX * 0.35,
          edgeX * 0.65,
          edgeX,
        ];
        const bottomRowY = 330;
        const dropInterval = frameScaleDuration / dropElements.length;

        const dropSequence = dropElements.map((el, idx) => ({
          el,
          targetX: xSpread[idx] ?? 0,
          targetY: bottomRowY,
          offset: idx * dropInterval,
        }));

        tl.addLabel("lift", ">");
        tl.to(
          stackCandidates,
          {
            y: `+=${hoverLift}`, // 위쪽으로 살짝 이동
            duration: 1,
            ease: "power2.out",
          },
          "lift"
        );
        tl.addLabel("wobbleStart", "lift+=0.5");
        tl.to(
          middleClone,
          {
            autoAlpha: 1,
            duration: 0.3,
            ease: "power1.out",
          },
          "lift+=0.2"
        );

        const wobbleKeyframes = [
          { y: `+=${wobbleDistance}`, duration: 0.3, ease: "sine.in" },
          { y: `-=${wobbleDistance}`, duration: 0.25, ease: "sine.out" },
          { y: `+=${wobbleDistance * 0.5}`, duration: 0.2, ease: "sine.inOut" },
          { y: `-=${wobbleDistance * 0.5}`, duration: 0.2, ease: "sine.out" },
          { y: `+=${wobbleDistance * 0.2}`, duration: 0.18, ease: "sine.in" },
          { y: `-=${wobbleDistance * 0.2}`, duration: 0.18, ease: "sine.out" },
        ];

        // 중앙 → 좌우 → 상하 순으로 흔들림 확산
        tl.to(mainCircle, { keyframes: wobbleKeyframes }, "wobbleStart");
        tl.to(
          [otherCircles[2], otherCircles[3]],
          { keyframes: wobbleKeyframes },
          "wobbleStart+=0.12"
        );
        tl.to(
          [
            topClone,
            bottomClone,
            middleClone,
            upperLeftClone,
            upperRightClone,
            bottomRightClone,
          ],
          { keyframes: wobbleKeyframes },
          "wobbleStart+=0.24"
        );

        // 프레임이 살짝 떠올라 등장 (크기 변화 없이)
        tl.to(
          frame,
          {
            autoAlpha: 1,
            duration: 0.8,
            ease: "power2.out",
            y: frameReadyY,
          },
          "lift+=0.2"
        );

        // 프레임이 준비된 뒤 0.2초 뒤에 첫 낙하 시작
        tl.addLabel("frameReady", "wobbleStart+=0.65");
        tl.addLabel("fall", "frameReady+=0.2");

        const dropDuration = 1.05;
        const impactDuration = 0.22;
        const reboundDuration = 0.36;
        const reboundReturnDuration = 0.28;

        const settleKeyframes = [
          { y: "+=4", duration: 0.14, ease: "sine.inOut" },
          { y: "-=3", duration: 0.12, ease: "sine.inOut" },
          { y: "+=1", duration: 0.1, ease: "sine.inOut" },
          { y: "-=1", duration: 0.1, ease: "sine.inOut" },
        ];
        const settleDuration = settleKeyframes.reduce(
          (acc, keyframe) => acc + keyframe.duration,
          0
        );

        const circleTargets = new Map();
        dropElements.forEach((el, idx) => {
          circleTargets.set(el, {
            targetX: xSpread[idx] ?? 0,
            targetY: bottomRowY,
          });
        });

        const dropSchedule = [
          { elements: [middleClone], offset: 0 },
          { elements: [mainCircle], offset: 0.24 },
          { elements: [otherCircles[2], otherCircles[3]], offset: 0.48 },
          { elements: [upperLeftClone, upperRightClone], offset: 0.74 },
          { elements: [topClone, bottomClone], offset: 1.0 },
          { elements: [bottomRightClone], offset: 1.22 },
        ];

        dropSchedule.forEach(({ elements, offset }) => {
          const group = (elements || []).filter(Boolean);
          group.forEach((el, idx) => {
            const startOffset = offset + idx * 0.05;
            const startPoint = `fall+=${startOffset}`;
            const { targetX = 0, targetY = bottomRowY } =
              circleTargets.get(el) || {};
            const overshootY = gsap.utils.random(32, 46);
            const reboundHeight = gsap.utils.random(28, 44);
            const squashScaleX = gsap.utils.random(1.08, 1.14);
            const squashScaleY = gsap.utils.random(0.8, 0.86);
            const stretchScaleX = gsap.utils.random(0.9, 0.95);
            const stretchScaleY = gsap.utils.random(1.12, 1.18);

            tl.to(
              el,
              {
                duration: dropDuration,
                ease: "power4.in",
                x: targetX,
                y: targetY + overshootY,
                autoAlpha: 1,
              },
              startPoint
            );

            tl.to(
              el,
              {
                duration: impactDuration,
                ease: "back.in(1.6)",
                x: targetX,
                y: targetY,
              },
              `${startPoint}+=${dropDuration}`
            );

            tl.to(
              el,
              {
                duration: reboundDuration,
                ease: "back.out(2.4)",
                y: targetY - reboundHeight,
              },
              `${startPoint}+=${dropDuration + impactDuration}`
            );

            tl.to(
              el,
              {
                duration: reboundReturnDuration,
                ease: "back.in(1.5)",
                y: targetY,
              },
              `${startPoint}+=${
                dropDuration + impactDuration + reboundDuration
              }`
            );

            let settleCursor =
              dropDuration +
              impactDuration +
              reboundDuration +
              reboundReturnDuration;
            settleKeyframes.forEach((keyframe) => {
              tl.to(
                el,
                {
                  y: keyframe.y ? `${keyframe.y}` : undefined,
                  duration: keyframe.duration,
                  ease: keyframe.ease ?? "back.inOut(1.15)",
                },
                `${startPoint}+=${settleCursor}`
              );
              settleCursor += keyframe.duration;
            });
          });
        });

        const lastPhase = dropSchedule[dropSchedule.length - 1];
        const lastPhaseSize = (lastPhase?.elements || []).filter(
          Boolean
        ).length;
        const lastDropStartOffset =
          (lastPhase?.offset || 0) + Math.max(0, (lastPhaseSize - 1) * 0.05);
        const postDropDelay = 0.12;
        const totalDropTime =
          lastDropStartOffset +
          dropDuration +
          impactDuration +
          reboundDuration +
          reboundReturnDuration;
        const frameLiftDuration = totalDropTime;

        // 낙하와 동시에 프레임을 최종 위치로 이동
        tl.to(
          frame,
          {
            y: frameFinalY,
            duration: frameLiftDuration,
            ease: "power3.out",
          },
          "fall"
        );

        // 프레임 가로 확장 (640 -> 1120)
        tl.to(
          frame,
          {
            scaleX: frameFinalWidth / frameWidth,
            duration: frameScaleDuration,
            ease: "power3.inOut",
          },
          "fall"
        );

        // [프레임 윗변 그리기 로직 수정]
        if (frameTopEdgeRef.current) {
          // 1. 선의 투명도(opacity)를 나타나게 함
          tl.to(
            frameTopEdgeRef.current,
            {
              opacity: 1,
              duration: 1.5,
              ease: "sine.out",
            },
            `fall+=${totalDropTime}`
          ); // 2. strokeDashoffset을 변경하여 오른쪽에서 왼쪽으로 선을 그음

          //    (초기 설정: offset: frameFinalWidth, offset을 0으로 줄이면 L->R 진행)
          //    (수정: offset을 -frameFinalWidth로 초기 설정하고 0으로 줄이면 R->L 진행)

          // 2-1. 초기 offset을 음수값으로 재설정하여 오른쪽 끝을 기준으로 만듭니다.
          gsap.set(frameTopEdgeRef.current, {
            strokeDashoffset: -frameFinalWidth,
          });

          tl.to(
            frameTopEdgeRef.current,
            {
              strokeDashoffset: 0, // <<<< 목표는 0으로 동일, 시작점만 음수 >>>>
              duration: 0.8,
              ease: "power2.inOut",
            },
            `fall+=${totalDropTime + 0.1}`
          );
        }

        // 7-4. [대기] 모든 원과 프레임이 안정된 후 잠시 상태를 보여줌
        const settleEnd = totalDropTime + settleDuration;
        const frameAnimationEnd = Math.max(
          frameLiftDuration,
          frameScaleDuration
        );
        const holdStart =
          Math.max(settleEnd, frameAnimationEnd) + postDropDelay;
        tl.to({}, { duration: 1.0 }, `fall+=${holdStart}`);
      }

      // --- [NEW] 8. 원들이 담긴 후 프레임 확장 ---
      // 이 단계는 현재 요청에서 제외되었으므로 나중을 위해 주석으로 남겨둡니다.
      /*
      tl.to(frame, {
        width: 500, // 목표 너비
        height: 300, // 목표 높이
        x: center_x - 250, // 너비의 절반만큼 왼쪽으로 이동하여 중앙 정렬 유지
        duration: 1.5,
        ease: "power3.inOut"
      }, ">");
      */

      // 3. 마지막 형태 유지 (5개 원이 근접한 십자 형태로 고정)
      tl.to({}, { duration: 1.0 }); // 1초 동안 정지해 결과를 보여줌

      // === 텍스트 동기화 로직 ===
      const sectionStates = [
        {
          name: "기획",
          sub: "사고의 궤적",
          desc: `아이디어의 출발점과 도착점을 잇는 선은 방향을 제시하고, 흐름을 만듭니다.<br/>
           선들이 모여 스토리라인이 되고, 그 안에서 연결과 구조가 생겨납니다.<br/>
           플로우차트처럼 서로 이어지는 선 위에서, 기획은 전체를 조율하는 길을 그립니다.`,
          progress: 0.1, // 선 애니메이션 구간
          offsetX: "0",
        },
        {
          name: "디자인",
          sub: "감각의 순환",
          desc: `디자인은 모든 요소가 하나의 중심을 기준으로 균형을 이루는 과정입니다.<br/>
           원의 순환처럼, 시선과 감정은 끊임없이 돌고 흐르며 감각의 리듬을 형성합니다.<br/>
           이 순환 속에서 디자인은 단순한 형태를 넘어 완성된 조화의 세계로 확장됩니다.`,
          progress: 0.25, // 원 구간
          offsetX: "-0.9vw",
        },
        {
          name: "프로그래밍",
          sub: "인터랙션의 틀",
          desc: `사각형은 그리드와 창을 상징하며, 각 요소 사이의 틀을 만듭니다.<br/>
           틀 안의 모든 요소는 정해진 규칙에 따라 배치되어 사용자와의 소통을 연결합니다.<br/>
           이 체계 속에서 프로그래밍은 구조의 언어로 생동하는 질서를 완성합니다.`,
          progress: 0.8, // 네모 구간
          offsetX: "0",
        },
      ];

      const descEl = descriptionRef.current;
      const mainEl = descEl.querySelector(".main-title");
      const subEl = descEl.querySelector(".sub-title");
      const bodyEl = descEl.querySelector(".desc-text");

      // 타임라인 진행도 기반으로 실시간 텍스트 변경
      tl.eventCallback("onUpdate", () => {
        const p = tl.progress(); // 타임라인 진행도 (0~1)
        const current =
          sectionStates.findLast((s) => p >= s.progress) || sectionStates[0];

        // 현재 표시 중인 텍스트와 다를 때만 업데이트
        if (mainEl.textContent !== current.name) {
          gsap.to([mainEl, subEl, bodyEl], {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              mainEl.textContent = current.name;
              subEl.textContent = current.sub;
              bodyEl.innerHTML = current.desc;
              gsap.to(descEl, {
                x: current.offsetX ?? "0vw",
                duration: 0.8,
                ease: "power2.out",
              });
              gsap.to([mainEl, subEl, bodyEl], { opacity: 1, duration: 0.8 });
            },
          });
        }
      });

      // --- [ScrollTrigger 연동] ---
      // ... (ScrollTrigger end 값 조정 필요: end: "bottom+=9000" 등으로 늘려야 합니다)

      ScrollTrigger.create({
        trigger: conceptSection,
        start: "top top",
        end: "bottom+=9000",
        pin: true,
        scrub: 1,
        animation: tl,
        // markers: true,
      });
    }, sectionRef);

    return () => {
      // 동적으로 생성한 클론 원 정리
      const groupEl = otherCirclesGroupRef.current;
      if (groupEl) {
        const clones = Array.from(
          groupEl.querySelectorAll("circle.__clone, circle.__clone2")
        );
        clones.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
      }
      ctx.revert();
    };
  }, []); // [] : 처음 마운트될 때 한 번만 실행

  return (
    <div className="concept" ref={sectionRef}>
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
          {/* --- [SVG 순서: 6개 그룹이 먼저 그려져야 중앙 원 뒤로 숨음] --- */}
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
          {/* --- 사각형 틀 (8단계 이후) --- */}
          <g ref={frameRef} opacity="0">
            <line
              className="frame-left"
              x1="0"
              y1="0"
              x2="0"
              y2="422"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              className="frame-right"
              x1="640"
              y1="0"
              x2="640"
              y2="422"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              className="frame-bottom"
              x1="0"
              y1="422"
              x2="640"
              y2="422"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
            />
            <line
              x1="0"
              y1="0"
              x2="640"
              y2="0"
              stroke="url(#concept_frame_gradient)"
              strokeWidth="1.5"
              strokeDasharray="640"
              strokeDashoffset="640"
              opacity="0"
              ref={frameTopEdgeRef}
            />
          </g>
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

            {/* --- 사각형 틀 그라데이션 (새로 추가) --- */}
            <linearGradient
              id="concept_frame_gradient"
              x1="320"
              y1="0"
              x2="320"
              y2="422"
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

        <div className="description" ref={descriptionRef}>
          <div className="title">
            <div className="main-title"></div>
            <p className="sub-title"></p>
          </div>

          <p className="desc-text"></p>
        </div>
      </div>
    </div>
  );
}
