"use client";
import { GETFEVER2 } from "../svgCode";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "../../styles/mainSections/_concept.scss";

gsap.registerPlugin(ScrollTrigger);

export default function ConceptSection() {
  const containerRef = useRef(null); // 새로운 루트 컨테이너, 내부 스크롤러 역할
  const sectionRef = useRef(null); // 실제 콘텐츠를 담고 pin될 요소
  const graphicTxtRef = useRef(null);
  const horizontalLineRef = useRef(null);
  const radialGroupRef = useRef(null);
  const mainCircleRef = useRef(null);
  const otherCirclesGroupRef = useRef(null);
  const frameRef = useRef(null);
  const frameTopEdgeRef = useRef(null);
  const descriptionRef = useRef(null);

  const center_x = 961;
  const center_y = 371.5;
  const horizontal_length = 1922;
  const numRadialLines = 12;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          scroller: containerRef.current, // scroller를 내부 컨테이너로 지정
          pin: true,
          scrub: 1,
          start: "top top",
          end: "+=9000", // 내부 스크롤 길이에 맞게 end 값 설정
        },
      });

      // --- 기존 애니메이션 타임라인 로직 (동일) ---
      const horizontalLine = horizontalLineRef.current;
      const radialLines = gsap.utils.toArray(radialGroupRef.current.children);
      const graphicTxt = graphicTxtRef.current;
      const mainCircle = mainCircleRef.current;
      const otherCircles = gsap.utils.toArray(
        otherCirclesGroupRef.current.children
      );
      const outerCircles = [
        otherCircles[0],
        otherCircles[1],
        otherCircles[4],
        otherCircles[5],
      ];
      const circleSpacing = 280;
      const finalSpacing = circleSpacing + 34;

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
      tl.to(otherCircles, {
        autoAlpha: 1,
        x: (i) => (i < 3 ? -circleSpacing * (3 - i) : circleSpacing * (i - 2)),
        duration: 2,
        ease: "power2.inOut",
        stagger: 0.1,
      });
      tl.to(otherCircles, {
        x: (i) => (i < 3 ? -finalSpacing * (3 - i) : finalSpacing * (i - 2)),
        duration: 1.5,
        ease: "power2.inOut",
      });
      tl.to({}, { duration: 0.5 });
      tl.to(outerCircles, {
        autoAlpha: 0,
        rotation: (i) => (i < 2 ? -360 : 360),
        x: (i) => (i < 2 ? "-=1000" : "+=1000"),
        duration: 2.5,
        ease: "power1.in",
        stagger: 0.1,
      });

      const svgNS2 = "http://www.w3.org/2000/svg";
      const groupEl2 = otherCirclesGroupRef.current;
      let topClone = null, bottomClone = null, middleClone = null, extraDropClones = [];

      if (groupEl2) {
        const createCircle2 = () => {
          const c = document.createElementNS(svgNS2, "circle");
          c.setAttribute("cx", String(center_x));
          c.setAttribute("cy", String(center_y));
          c.setAttribute("r", "135");
          c.setAttribute("transform", `rotate(-90 ${center_x} ${center_y})`);
          c.setAttribute("fill", "black");
          c.setAttribute("stroke", "url(#paint0_linear_472_4801)");
          c.setAttribute("class", "__clone2");
          return c;
        };

        const leftBase = otherCircles[2];
        const rightBase = otherCircles[3];
        const centerBase = leftBase || rightBase;

        topClone = createCircle2();
        bottomClone = createCircle2();
        middleClone = createCircle2();
        const additionalClones = Array.from({ length: 3 }, () => createCircle2());
        extraDropClones = additionalClones;

        if (leftBase) groupEl2.insertBefore(topClone, leftBase); else groupEl2.appendChild(topClone);
        if (rightBase) groupEl2.insertBefore(bottomClone, rightBase); else groupEl2.appendChild(bottomClone);
        if (centerBase) groupEl2.insertBefore(middleClone, centerBase); else groupEl2.appendChild(middleClone);
        additionalClones.forEach((clone) => { groupEl2.appendChild(clone); });

        gsap.set(topClone, { autoAlpha: 0, x: -finalSpacing, y: 270, rotation: 0, svgOrigin: `${center_x} ${center_y}` });
        gsap.set(bottomClone, { autoAlpha: 0, x: finalSpacing, y: 270, rotation: 0, svgOrigin: `${center_x} ${center_y}` });
        gsap.set(middleClone, { autoAlpha: 0, x: 0, y: 270, rotation: 0, svgOrigin: `${center_x} ${center_y}` });
        additionalClones.forEach((clone) => { gsap.set(clone, { autoAlpha: 0, x: 0, y: 270, rotation: 0, svgOrigin: `${center_x} ${center_y}` }); });
      }

      if (topClone && bottomClone) {
        tl.to([topClone, bottomClone], { autoAlpha: 1, duration: 0.3 });
        tl.to([topClone, bottomClone], { x: 0, rotation: (i) => (i === 0 ? -360 : 360), duration: 3, ease: "power1.inOut" }, "<");
        tl.to(topClone, { y: -100, duration: 1.5, ease: "power1.out" }, "<");
        tl.to(topClone, { y: -40, duration: 1.5, ease: "power1.in" }, "-=1");
        tl.to(bottomClone, { y: 600, duration: 1.5, ease: "power1.out" }, "<-1");
        tl.to(bottomClone, { y: finalSpacing * 1.85, duration: 1.5, ease: "power1.in" }, "-=1");
      }

      tl.to({}, { duration: 0.7 });

      const mainCircleStartSize = 399;
      const otherCircleStartSize = 271;
      const targetSize = 212;
      const mainCircleFinalScale = targetSize / mainCircleStartSize;
      const otherCircleFinalScale = targetSize / otherCircleStartSize;

      tl.to(mainCircle, { scale: mainCircleFinalScale, y: "+=10", duration: 1.5, ease: "back.out(3)" }, ">");
      const resizeTargets = [otherCircles[2], otherCircles[3], topClone, bottomClone, middleClone, ...extraDropClones].filter(Boolean);
      tl.to(resizeTargets, { scale: otherCircleFinalScale, y: "+=10", duration: 1.5, ease: "back.out(3)" }, "<.5");

      const compactSpacing = finalSpacing - 74;
      const surroundingCircles = [otherCircles[2], otherCircles[3], topClone, bottomClone];
      tl.to(surroundingCircles, {
          x: (i) => {
            const anchorX = Number(gsap.getProperty(mainCircle, "x")) || 0;
            if (i === 0) return anchorX - compactSpacing;
            if (i === 1) return anchorX + compactSpacing;
            return anchorX;
          },
          y: (i) => {
            const anchorY = 280 || 0;
            if (i === 2) return anchorY - compactSpacing;
            if (i === 3) return anchorY + compactSpacing;
            return anchorY;
          },
          duration: 2.2,
          ease: "power3.inOut",
        }, "< 1");
      tl.to({}, { duration: 1.0 });

      const frame = frameRef.current;
      const [upperLeftClone, upperRightClone, bottomRightClone] = extraDropClones;
      const dropElements = [upperLeftClone, mainCircle, upperRightClone, otherCircles[2], middleClone, otherCircles[3], topClone, bottomClone, bottomRightClone];

      if (frame && dropElements.every(Boolean)) {
        const stackCandidates = dropElements;
        const frameWidth = 640, frameHeight = 422, frameFinalWidth = 1120, frameScaleDuration = 1.5;
        const frameStartY = 760, frameReadyY = 160, frameFinalY = frameReadyY;
        const hoverLift = -320, wobbleDistance = 16;

        gsap.set(frame, { autoAlpha: 0, x: center_x - frameWidth / 2, y: frameStartY, transformOrigin: "center center", scaleX: 1 });
        const topEdge = frameTopEdgeRef.current;
        if (topEdge) {
          gsap.set(topEdge, { opacity: 0, strokeDasharray: frameFinalWidth, strokeDashoffset: frameFinalWidth });
        }

        const circleRadius = targetSize / 2;
        const frameHalfWidth = frameFinalWidth / 2;
        const edgeX = frameHalfWidth - circleRadius;
        const xSpread = [-edgeX, -edgeX * 0.65, -edgeX * 0.35, -edgeX * 0.15, 0, edgeX * 0.15, edgeX * 0.35, edgeX * 0.65, edgeX];
        const bottomRowY = 330;
        const dropInterval = frameScaleDuration / dropElements.length;

        const dropSequence = dropElements.map((el, idx) => ({ el, targetX: xSpread[idx] ?? 0, targetY: bottomRowY, offset: idx * dropInterval }));

        tl.addLabel("lift", ">");
        tl.to(stackCandidates, { y: `+=${hoverLift}`, duration: 1, ease: "power2.out" }, "lift");
        tl.addLabel("wobbleStart", "lift+=0.5");
        tl.to(middleClone, { autoAlpha: 1, duration: 0.3, ease: "power1.out" }, "lift+=0.2");

        const wobbleKeyframes = [
          { y: `+=${wobbleDistance}`, duration: 0.3, ease: "sine.in" },
          { y: `-=${wobbleDistance}`, duration: 0.25, ease: "sine.out" },
          { y: `+=${wobbleDistance * 0.5}`, duration: 0.2, ease: "sine.inOut" },
          { y: `-=${wobbleDistance * 0.5}`, duration: 0.2, ease: "sine.out" },
          { y: `+=${wobbleDistance * 0.2}`, duration: 0.18, ease: "sine.in" },
          { y: `-=${wobbleDistance * 0.2}`, duration: 0.18, ease: "sine.out" },
        ];

        tl.to(mainCircle, { keyframes: wobbleKeyframes }, "wobbleStart");
        tl.to([otherCircles[2], otherCircles[3]], { keyframes: wobbleKeyframes }, "wobbleStart+=0.12");
        tl.to([topClone, bottomClone, middleClone, upperLeftClone, upperRightClone, bottomRightClone], { keyframes: wobbleKeyframes }, "wobbleStart+=0.24");

        tl.to(frame, { autoAlpha: 1, duration: 0.8, ease: "power2.out", y: frameReadyY }, "lift+=0.2");
        tl.addLabel("frameReady", "wobbleStart+=0.65");
        tl.addLabel("fall", "frameReady+=0.2");

        const dropDuration = 1.05, impactDuration = 0.22, reboundDuration = 0.36, reboundReturnDuration = 0.28;
        const settleKeyframes = [
          { y: "+=4", duration: 0.14, ease: "sine.inOut" },
          { y: "-=3", duration: 0.12, ease: "sine.inOut" },
          { y: "+=1", duration: 0.1, ease: "sine.inOut" },
          { y: "-=1", duration: 0.1, ease: "sine.inOut" },
        ];
        const settleDuration = settleKeyframes.reduce((acc, keyframe) => acc + keyframe.duration, 0);
        const circleTargets = new Map();
        dropElements.forEach((el, idx) => { circleTargets.set(el, { targetX: xSpread[idx] ?? 0, targetY: bottomRowY }); });

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
            const { targetX = 0, targetY = bottomRowY } = circleTargets.get(el) || {};
            const overshootY = gsap.utils.random(32, 46);
            const reboundHeight = gsap.utils.random(28, 44);

            tl.to(el, { duration: dropDuration, ease: "power4.in", x: targetX, y: targetY + overshootY, autoAlpha: 1 }, startPoint);
            tl.to(el, { duration: impactDuration, ease: "back.in(1.6)", x: targetX, y: targetY }, `${startPoint}+=${dropDuration}`);
            tl.to(el, { duration: reboundDuration, ease: "back.out(2.4)", y: targetY - reboundHeight }, `${startPoint}+=${dropDuration + impactDuration}`);
            tl.to(el, { duration: reboundReturnDuration, ease: "back.in(1.5)", y: targetY }, `${startPoint}+=${dropDuration + impactDuration + reboundDuration}`);
            
            let settleCursor = dropDuration + impactDuration + reboundDuration + reboundReturnDuration;
            settleKeyframes.forEach((keyframe) => {
              tl.to(el, { y: keyframe.y ? `${keyframe.y}` : undefined, duration: keyframe.duration, ease: keyframe.ease ?? "back.inOut(1.15)" }, `${startPoint}+=${settleCursor}`);
              settleCursor += keyframe.duration;
            });
          });
        });

        const lastPhase = dropSchedule[dropSchedule.length - 1];
        const lastPhaseSize = (lastPhase?.elements || []).filter(Boolean).length;
        const lastDropStartOffset = (lastPhase?.offset || 0) + Math.max(0, (lastPhaseSize - 1) * 0.05);
        const postDropDelay = 0.12;
        const totalDropTime = lastDropStartOffset + dropDuration + impactDuration + reboundDuration + reboundReturnDuration;
        const frameLiftDuration = totalDropTime;

        tl.to(frame, { y: frameFinalY, duration: frameLiftDuration, ease: "power3.out" }, "fall");
        tl.to(frame, { scaleX: frameFinalWidth / frameWidth, duration: frameScaleDuration, ease: "power3.inOut" }, "fall");

        if (frameTopEdgeRef.current) {
          tl.to(frameTopEdgeRef.current, { opacity: 1, duration: 1.5, ease: "sine.out" }, `fall+=${totalDropTime}`);
          gsap.set(frameTopEdgeRef.current, { strokeDashoffset: -frameFinalWidth });
          tl.to(frameTopEdgeRef.current, { strokeDashoffset: 0, duration: 0.8, ease: "power2.inOut" }, `fall+=${totalDropTime + 0.1}`);
        }

        const settleEnd = totalDropTime + settleDuration;
        const frameAnimationEnd = Math.max(frameLiftDuration, frameScaleDuration);
        const holdStart = Math.max(settleEnd, frameAnimationEnd) + postDropDelay;
        tl.to({}, { duration: 1.0 }, `fall+=${holdStart}`);
      }

      tl.to({}, { duration: 1.0 });

      const sectionStates = [
        { name: "기획", sub: "사고의 궤적", desc: `아이디어의 출발점과 도착점을 잇는 선은 방향을 제시하고, 흐름을 만듭니다.<br/> 선들이 모여 스토리라인이 되고, 그 안에서 연결과 구조가 생겨납니다.<br/> 플로우차트처럼 서로 이어지는 선 위에서, 기획은 전체를 조율하는 길을 그립니다.`, progress: 0.1 },
        { name: "디자인", sub: "감각의 순환", desc: `디자인은 모든 요소가 하나의 중심을 기준으로 균형을 이루는 과정입니다.<br/> 원의 순환처럼, 시선과 감정은 끊임없이 돌고 흐르며 감각의 리듬을 형성합니다.<br/> 이 순환 속에서 디자인은 단순한 형태를 넘어 완성된 조화의 세계로 확장됩니다.`, progress: 0.25 },
        { name: "프로그래밍", sub: "인터랙션의 틀", desc: `사각형은 그리드와 창을 상징하며, 각 요소 사이의 틀을 만듭니다.<br/> 틀 안의 모든 요소는 정해진 규칙에 따라 배치되어 사용자와의 소통을 연결합니다.<br/> 이 체계 속에서 프로그래밍은 구조의 언어로 생동하는 질서를 완성합니다.`, progress: 0.8 },
      ];

      const descEl = descriptionRef.current;
      const mainEl = descEl.querySelector(".main-title");
      const subEl = descEl.querySelector(".sub-title");
      const bodyEl = descEl.querySelector(".desc-text");

      tl.eventCallback("onUpdate", () => {
        const p = tl.progress();
        const current = sectionStates.findLast((s) => p >= s.progress) || sectionStates[0];
        if (mainEl.textContent !== current.name) {
          gsap.to([mainEl, subEl, bodyEl], {
            opacity: 0,
            duration: 0.8,
            onComplete: () => {
              mainEl.textContent = current.name;
              subEl.textContent = current.sub;
              bodyEl.innerHTML = current.desc;
              gsap.to([mainEl, subEl, bodyEl], { opacity: 1, duration: 0.8 });
            },
          });
        }
      });
    }, containerRef); // 컨텍스트 범위를 containerRef로 변경

    return () => {
      const groupEl = otherCirclesGroupRef.current;
      if (groupEl) {
        const clones = Array.from(groupEl.querySelectorAll("circle.__clone, circle.__clone2"));
        clones.forEach((el) => el.parentNode && el.parentNode.removeChild(el));
      }
      ctx.revert();
    };
  }, []);

  return (
    <div className="concept-container" ref={containerRef}>
      <div className="concept" ref={sectionRef}>
        <img className="webImage" src="/images/concept.png" alt="concept.png" />
        <div className="graphic">
          <svg viewBox="0 0 1922 743" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line ref={horizontalLineRef} x1="0" y1={center_y} x2={horizontal_length} y2={center_y} stroke="url(#paint0_linear_469_4682)" strokeWidth="1.5" />
            <g ref={radialGroupRef}>
              {Array.from({ length: numRadialLines }).map((_, i) => (
                <line key={i} x1="0" y1={center_y} x2={horizontal_length} y2={center_y} stroke="url(#paint0_linear_469_4682)" strokeWidth="1" strokeOpacity="0.7" />
              ))}
            </g>
            <g ref={otherCirclesGroupRef}>
              {Array.from({ length: 6 }).map((_, i) => (
                <circle key={i} cx={center_x} cy={center_y} r="135" transform={`rotate(-90 ${center_x} ${center_y})`} fill="black" stroke="url(#paint0_linear_472_4801)" />
              ))}
            </g>
            <circle ref={mainCircleRef} cx={center_x} cy={center_y} r="199" transform={`rotate(-90 ${center_x} ${center_y})`} fill="black" stroke="url(#paint0_linear_472_4801)" />
            <g ref={frameRef} opacity="0">
              <line className="frame-left" x1="0" y1="0" x2="0" y2="422" stroke="url(#concept_frame_gradient)" strokeWidth="1.5" />
              <line className="frame-right" x1="640" y1="0" x2="640" y2="422" stroke="url(#concept_frame_gradient)" strokeWidth="1.5" />
              <line className="frame-bottom" x1="0" y1="422" x2="640" y2="422" stroke="url(#concept_frame_gradient)" strokeWidth="1.5" />
              <line x1="0" y1="0" x2="640" y2="0" stroke="url(#concept_frame_gradient)" strokeWidth="1.5" strokeDasharray="640" strokeDashoffset="640" opacity="0" ref={frameTopEdgeRef} />
            </g>
            <defs>
              <linearGradient id="paint0_linear_469_4682" x1="960" y1="0.5" x2="960" y2="1.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A4A4A4" stopOpacity="0.6" />
                <stop offset="0.471154" stopColor="#E1E1E1" />
                <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="paint0_linear_472_4802" x1="199.5" y1="0" x2="199.5" y2="399" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A4A4A4" stopOpacity="0.6" />
                <stop offset="0.471154" stopColor="#E1E1E1" />
                <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="paint0_linear_472_4801" x1="135.5" y1="0" x2="135.5" y2="271" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A4A4A4" stopOpacity="0.6" />
                <stop offset="0.471154" stopColor="#E1E1E1" />
                <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
              </linearGradient>
              <linearGradient id="concept_frame_gradient" x1="320" y1="0" x2="320" y2="422" gradientUnits="userSpaceOnUse">
                <stop stopColor="#A4A4A4" stopOpacity="0.6" />
                <stop offset="0.471154" stopColor="#E1E1E1" />
                <stop offset="1" stopColor="#A4A4A4" stopOpacity="0.6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
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
      {/* The spacer div to create scroll distance for the inner scroller */}
      <div style={{ height: "9000px" }}></div>
    </div>
  );
}
