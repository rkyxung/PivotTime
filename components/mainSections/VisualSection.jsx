"use client";

import { useEffect, useRef } from "react";
import "../../styles/mainSections/_visual.scss";
import { GOPIVOT } from "../svgCode";
import Line3D from "./3dKeyVisual/line3D";
import Circle3D from "./3dKeyVisual/circle3D";
import Square3D from "./3dKeyVisual/square3D";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function VisualSection() {
  const sectionRef = useRef(null);
  const objectsRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const objectsEl = objectsRef.current;
    if (!sectionEl || !objectsEl) return;

    const line = objectsEl.querySelector(".line");
    const circle = objectsEl.querySelector(".circle");
    const square = objectsEl.querySelector(".square");

    const linePos = { x: "0vw", y: "0vh", rotation: 0 };
    const circlePos = { x: "-40vw", y: "-50vh", rotation: -45 };
    const squarePos = { x: "80vw", y: "-100vh", rotation: -45 };

    gsap.set(line, { ...linePos, autoAlpha: 1 });
    gsap.set(circle, { ...linePos, autoAlpha: 0 });
    gsap.set(square, { ...circlePos, autoAlpha: 0 });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        scroller: ".snap-container",
        start: "top center",
        end: "bottom center",
        scrub: 1,
        pin: false, // pin 기능 비활성화
      },
    });

    const moveDuration = 2.0;
    const fadeDuration = 0.5;
    const holdDuration = 1.0;

    timeline.to({}, { duration: holdDuration });

    timeline.to(line, { autoAlpha: 0, duration: fadeDuration }, "lineToCircle");
    timeline.to(circle, { autoAlpha: 1, duration: fadeDuration }, "lineToCircle");
    timeline.to(
      circle,
      {
        motionPath: {
          path: [{ x: circlePos.x, y: circlePos.y }],
          curviness: 1.2,
          autoRotate: true,
        },
        duration: moveDuration,
        ease: "power1.inOut",
      },
      "lineToCircle"
    );

    timeline.to({}, { duration: holdDuration });

    timeline.to(circle, { autoAlpha: 0, duration: fadeDuration }, "circleToSquare");
    timeline.to(square, { autoAlpha: 1, duration: fadeDuration }, "circleToSquare");
    timeline.to(
      square,
      {
        motionPath: {
          path: [{ x: squarePos.x, y: squarePos.y }],
          curviness: 1.2,
          autoRotate: true,
        },
        duration: moveDuration,
        ease: "power1.inOut",
      },
      "circleToSquare"
    );

    timeline.to({}, { duration: 1.0 });

    return () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
    };
  }, []);

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
            <Line3D interactive={false} />
          </div>
          <div className="graphic-slot circle">
            <Circle3D interactive={false} isZoomed={false} />
          </div>
          <div className="graphic-slot square">
            <Square3D interactive={false} />
          </div>
        </div>

        <div className="label kor">도전</div>
        <div className="label en">CHALLENGE</div>
      </div>
    </div>
  );
}
