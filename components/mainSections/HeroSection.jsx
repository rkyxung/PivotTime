// components/mainSections/HeroSection.jsx

"use client";

import { GETFEVER, GOPIVOT } from "../svgCode";
import "../../styles/mainSections/_hero.scss";
// 1. 훅들(useEffect, useRef)을 import 합니다.
import { useState, useCallback, useEffect, useRef } from "react";
import Line3D from "./3dKeyVisual/line3D";
import Circle3D from "./3dKeyVisual/circle3D";
import Square3D from "./3dKeyVisual/square3D";

// 2. props로 isZoomed를 받지 않습니다.
export default function HeroSection() {
  // 그리드 셀 배열
  const rows = 14;
  const cols = 14;

  const gridCells = Array.from({ length: rows * cols }, (_, i) => (
    <div key={i} className="grid-cell" />
  ));

  // 클릭 순서와 객체 목록을 미리 정의합니다.
  const objectOrder = ["line", "circle", "square"];

  // 현재 객체를 저장할 state.
  const [currentObject, setCurrentObject] = useState(() => {
    const randomIndex = Math.floor(Math.random() * objectOrder.length);
    return objectOrder[randomIndex];
  });

  // 클릭 시 객체를 순환시키는 핸들러 함수
  const handleClick = useCallback(() => {
    setCurrentObject((prevObject) => {
      const currentIndex = objectOrder.indexOf(prevObject);
      const nextIndex = (currentIndex + 1) % objectOrder.length;
      return objectOrder[nextIndex];
    });
  }, []);

  // 3. 줌 상태와 스크롤 로직을 HeroSection이 직접 가집니다.
  const [isZoomed, setIsZoomed] = useState(false);
  const isZoomedRef = useRef(isZoomed);
  isZoomedRef.current = isZoomed;

  // 4. 스크롤 이벤트 로직 (가장 중요)
  useEffect(() => {
    // Nav 컴포넌트의 <nav> 태그를 DOM에서 직접 찾습니다.
    const navElement = document.querySelector('nav');
    
    // nav 태그가 없으면(오류 방지) 아무것도 하지 않습니다.
    if (!navElement) return;

    const handleWheel = (e) => {
      if (e.deltaY < 0 && window.scrollY === 0) {
        // 스크롤 위로 + 최상단
        e.preventDefault();
        setIsZoomed(true);
        // Nav에 zoom_out 클래스 추가
        navElement.classList.add('zoom_out'); 
      } else if (e.deltaY > 0 && isZoomedRef.current) {
        // 스크롤 아래로 + 줌아웃 상태
        e.preventDefault();
        setIsZoomed(false);
        // Nav에서 zoom_out 클래스 제거
        navElement.classList.remove('zoom_out'); 
      }
    };

    // HeroSection이 보일 때만 휠 이벤트를 window에 추가
    window.addEventListener("wheel", handleWheel, { passive: false });

    // 5. 클린업 함수
    return () => {
      // 이 컴포넌트가 사라지면(다른 페이지 이동 시) 이벤트 리스너 제거
      window.removeEventListener("wheel", handleWheel);
      // 페이지를 떠날 때 Nav가 숨겨진 상태로 남지 않도록 클래스 제거
      navElement.classList.remove('zoom_out');
    };
  }, []); // 빈 배열: 이 컴포넌트가 마운트될 때 1번만 실행

  return (
    // 6. HeroSection 자신에게도 isZoomed 상태에 따라 클래스 적용
    <div className={`hero ${isZoomed ? "zoom_out" : ""}`.trim()}>
      <div className="grid-container">
        <div className="grid">{gridCells}</div>
      </div>
      <div
        className="main-object"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        {currentObject === "line" && <Line3D isZoomed={isZoomed} />}
        {currentObject === "circle" && <Circle3D isZoomed={isZoomed} />}
        {currentObject === "square" && <Square3D isZoomed={isZoomed} />}
      </div>
      <div className="hero-text">
        <div className="gF-gP">
          <div className="gf">
            <GETFEVER />
          </div>

          <div className="gp">
            <GOPIVOT />
          </div>
        </div>

        <div className="main-logo">
          <svg
            className="pivot"
            viewBox="0 0 672 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M166.029 20.5035C166.029 9.17975 175.209 0 186.533 0V163.776H166.029V20.5035Z"
              fill="#E1E1E1"
            />

            <path
              d="M0 41.0067C0 29.6829 9.17974 20.5032 20.5035 20.5032V164.028H0V41.0067Z"
              fill="#E1E1E1"
            />

            <path
              d="M102.514 -8.96239e-07C113.838 -4.0126e-07 123.018 9.17974 123.018 20.5035L20.4999 20.5035C20.4999 9.17974 29.6797 -4.07993e-06 41.0034 -3.58495e-06L102.514 -8.96239e-07Z"
              fill="#E1E1E1"
            />

            <path
              d="M123.018 82.0173C123.018 93.3411 113.838 102.521 102.514 102.521L61.507 102.521L61.507 82.0173L123.018 82.0173Z"
              fill="#E1E1E1"
            />

            <path
              d="M143.523 61.5138C143.523 72.8376 134.344 82.0173 123.02 82.0173L123.02 20.5067C134.344 20.5067 143.523 29.6865 143.523 41.0103L143.523 61.5138Z"
              fill="#E1E1E1"
            />

            <path
              d="M229.545 82.0349H250.048V143.546C238.725 143.546 229.545 134.366 229.545 123.042V82.0349Z"
              fill="#E1E1E1"
            />

            <path
              d="M311.561 82.0349H332.064V123.042C332.064 134.366 322.884 143.546 311.561 143.546V82.0349Z"
              fill="#E1E1E1"
            />

            <path
              d="M311.561 143.491C311.561 154.815 302.381 163.994 291.057 163.994L270.553 163.994C259.23 163.994 250.05 154.815 250.05 143.491L311.561 143.491Z"
              fill="#E1E1E1"
            />

            <path
              d="M352.57 61.5314C352.57 72.8552 343.391 82.0349 332.067 82.0349L332.067 0.0207788L352.57 0.0207806L352.57 61.5314Z"
              fill="#E1E1E1"
            />

            <path
              d="M229.545 82.0349C218.221 82.0349 209.041 72.8552 209.041 61.5314L209.041 0.0207788L229.545 0.0207806L229.545 82.0349Z"
              fill="#E1E1E1"
            />

            <path
              d="M568.614 -8.96238e-07C579.937 -4.01259e-07 589.117 9.17974 589.117 20.5035L527.607 20.5035L527.607 -2.68871e-06L568.614 -8.96238e-07Z"
              fill="#E1E1E1"
            />

            <path
              d="M671.129 0L671.129 20.5035L609.618 20.5035C609.618 9.17974 618.798 -2.28745e-06 630.122 -1.79248e-06L671.129 0Z"
              fill="#E1E1E1"
            />

            <rect
              x="609.615"
              y="164.03"
              width="20.5035"
              height="143.525"
              transform="rotate(-180 609.615 164.03)"
              fill="#E1E1E1"
            />

            <path
              d="M481.095 0.198486C498.08 0.198706 511.849 13.969 511.85 30.9543V61.7092H511.848V133.283C511.847 150.269 498.077 164.038 481.092 164.038H450.337V163.912H429.839V164.035H399.083C382.098 164.035 368.328 150.265 368.328 133.28V102.525H388.832V123.029C388.832 134.35 398.009 143.527 409.33 143.531V143.408H470.841V143.535L471.37 143.529C482.449 143.247 491.344 134.179 491.344 123.032V102.529H450.337V102.528H491.344V41.0159C491.242 29.7797 482.103 20.7024 470.843 20.7024H450.339V0.198486H481.095ZM390.146 21.8254C389.289 24.6526 388.828 27.6521 388.828 30.759V102.521H368.324V51.2629C368.324 37.3844 377.517 25.6531 390.146 21.8254ZM450.338 20.5081H399.079C395.972 20.5081 392.973 20.9686 390.146 21.8254C393.973 9.19686 405.705 0.00416884 419.583 0.00415039H450.338V20.5081Z"
              fill="#E1E1E1"
            />
          </svg>

          <svg
            className="time"
            viewBox="0 0 550 165"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M165.66 0.367676H186.164V143.64C186.164 154.964 176.984 164.144 165.66 164.144V0.367676Z"
              fill="#E1E1E1"
            />

            <path
              d="M208.309 41.3719C208.309 30.0481 217.488 20.8684 228.812 20.8684V164.393H208.309V41.3719Z"
              fill="#E1E1E1"
            />

            <path
              d="M351.831 41.3719C351.831 30.0481 342.651 20.8684 331.328 20.8684V164.393H351.831V41.3719Z"
              fill="#E1E1E1"
            />

            <path
              d="M290.318 20.8684H269.815V164.393H290.318V20.8684Z"
              fill="#E1E1E1"
            />

            <path
              d="M269.814 0.365967L269.814 20.8695L228.807 20.8695C228.807 9.54571 237.987 0.365965 249.311 0.365966L269.814 0.365967Z"
              fill="#E1E1E1"
            />

            <path
              d="M290.318 0.365967L290.318 20.8695L331.325 20.8695C331.325 9.54571 322.146 0.365965 310.822 0.365966L290.318 0.365967Z"
              fill="#E1E1E1"
            />

            <path
              d="M367.588 41.3719C367.588 30.0481 376.768 20.8684 388.091 20.8684V61.8755H367.588V41.3719Z"
              fill="#E1E1E1"
            />

            <path
              d="M367.588 123.382C367.588 134.706 376.768 143.885 388.091 143.885V82.3749H367.588V123.382Z"
              fill="#E1E1E1"
            />

            <path
              d="M470.102 0.365966C481.426 0.365966 490.605 9.54571 490.605 20.8695L388.088 20.8695C388.088 9.54571 397.268 0.365963 408.591 0.365963L470.102 0.365966Z"
              fill="#E1E1E1"
            />

            <path
              d="M470.102 164.395C481.426 164.395 490.605 155.216 490.605 143.892L388.088 143.892C388.088 155.216 397.268 164.395 408.591 164.395L470.102 164.395Z"
              fill="#E1E1E1"
            />

            <path
              d="M490.605 61.8682L490.605 82.3717L388.088 82.3717L388.088 61.8682L490.605 61.8682Z"
              fill="#E1E1E1"
            />

            <path
              d="M511.11 41.3716L490.607 41.3716L490.607 20.868C501.931 20.868 511.11 30.0478 511.11 41.3716Z"
              fill="#E1E1E1"
            />

            <path
              d="M511.11 102.88L490.607 102.88L490.607 143.887C501.931 143.887 511.11 134.707 511.11 123.383L511.11 102.88Z"
              fill="#E1E1E1"
            />

            <path
              d="M143.516 0.11084L143.516 20.6144L82.005 20.6144C82.005 9.29058 91.1848 0.110838 102.509 0.110838L143.516 0.11084Z"
              fill="#E1E1E1"
            />

            <rect
              x="82.0059"
              y="164.141"
              width="20.5035"
              height="143.525"
              transform="rotate(-180 82.0059 164.141)"
              fill="#E1E1E1"
            />

            <path
              d="M41.0082 0.106689C52.332 0.106689 61.5117 9.28643 61.5117 20.6102L0.00111204 20.6102L0.00111294 0.106687L41.0082 0.106689Z"
              fill="#E1E1E1"
            />

            <path
              d="M549.609 0V102.982H549.64H528.903H528.976V0H528.903H549.64"
              fill="#E1E1E1"
            />

            <path
              d="M549.464 144.27C549.464 155.629 540.258 164.839 528.903 164.839L528.976 164.912V123.638H528.903H549.64H549.609V144.28H549.464V144.27Z"
              fill="#E1E1E1"
            />
          </svg>
        </div>

        <div className="infoBox">
          <div className="left">
            <div className="title">
              Kaywon University of Arts & Design
              <br />
              32nd Delight Insight
            </div>

            <div className="link">
              Digital-media.kr
              <br />
              degreeshow/2025
            </div>
          </div>

          <div className="location">
            Kaywon Design Hall 5F
            <br />
            Nov. 22. FRI - Nov. 24. SUN
          </div>
        </div>
      </div>
    </div>
  );
}