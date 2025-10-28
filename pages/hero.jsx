"use client"; // Next.js 클라이언트 사이드 렌더링 활성화

// React 훅들과 함수들을 import
import React, { useEffect, useRef, useState, useCallback } from "react";
// import Object3DCollection from "../components/object3D_collection"; // 3D 오브젝트 그리드
import "../styles/hero.css";
import Main3DObject from "../components/Main3DObject";

const Hero = () => {
  // DOM 요소 참조를 위한 useRef 훅들
  const canvasContainerRef = useRef(null); // 캔버스 컨테이너 DOM 요소 참조
  const canvasRef = useRef(null); // 2D 캔버스 DOM 요소 참조
  const ctxRef = useRef(null); // 2D 캔버스 컨텍스트 참조
  const mainRef = useRef(null); // 메인 컨테이너 DOM 요소 참조

  // 줌 상태 관리를 위한 state와 ref
  const [isZoomed, setIsZoomed] = useState(false); // 줌 아웃 상태를 관리하는 state
  const isZoomedRef = useRef(isZoomed); // isZoomed의 최신 값을 참조하기 위한 ref (클로저 문제 해결)
  isZoomedRef.current = isZoomed; // ref 값을 항상 최신 state로 동기화
  const [show3D, setShow3D] = useState(false); // 3D 오브젝트 렌더링 지연 토글

  // ===== 2D 캔버스 애니메이션을 위한 데이터 =====
  // p5.js 스케치에서 가져온 원본 SVG 경로 데이터 (베지어 곡선들)
  const originalPathDs = [
    "M604.274 1501.48C937.71 1501.48 1208.01 1165.48 1208.01 751.007C1208.01 336.533 937.71 0.536133 604.274 0.536133C270.839 0.536133 0.536255 336.533 0.536255 751.007C0.536255 1165.48 270.839 1501.48 604.274 1501.48Z",
    "M694.411 1501.48C978.062 1501.48 1208.01 1165.48 1208.01 751.007C1208.01 336.533 978.062 0.536133 694.411 0.536133C410.761 0.536133 180.817 336.533 180.817 751.007C180.817 1165.48 410.761 1501.48 694.411 1501.48Z",
    "M784.544 1501.48C1018.41 1501.48 1208 1165.48 1208 751.007C1208 336.533 1018.41 0.536133 784.544 0.536133C550.673 0.536133 361.083 336.533 361.083 751.007C361.083 1165.48 550.673 1501.48 784.544 1501.48Z",
    "M874.676 1501.48C1058.77 1501.48 1208 1165.48 1208 751.007C1208 336.533 1058.77 0.536133 874.676 0.536133C690.585 0.536133 541.349 336.533 541.349 751.007C541.349 1165.48 690.585 1501.48 874.676 1501.48Z",
    "M964.821 1501.48C1099.13 1501.48 1208 1165.48 1208 751.007C1208 336.533 1099.13 0.536133 964.821 0.536133C830.514 0.536133 721.637 336.533 721.637 751.007C721.637 1165.48 830.514 1501.48 964.821 1501.48Z",
    "M1054.95 1501.48C1139.48 1501.48 1208 1165.48 1208 751.007C1208 336.533 1139.48 0.536133 1054.95 0.536133C970.426 0.536133 901.903 336.533 901.903 751.007C901.903 1165.48 970.426 1501.48 1054.95 1501.48Z",
    "M1145.09 1501.48C1179.83 1501.48 1208 1165.48 1208 751.007C1208 336.533 1179.83 0.536133 1145.09 0.536133C1110.34 0.536133 1082.17 336.533 1082.17 751.007C1082.17 1165.48 1110.34 1501.48 1145.09 1501.48Z",
    "M1208 1501.48C1217.11 1501.48 1224.5 1165.48 1224.5 751.007C1224.5 336.533 1217.11 0.536133 1208 0.536133C1198.89 0.536133 1191.5 336.533 1191.5 751.007C1191.5 1165.48 1198.89 1501.48 1208 1501.48Z",
    "M1270.92 1501.48C1305.67 1501.48 1333.83 1165.48 1333.83 751.007C1333.83 336.533 1305.67 0.536133 1270.92 0.536133C1236.17 0.536133 1208 336.533 1208 751.007C1208 1165.48 1236.17 1501.48 1270.92 1501.48Z",
    "M1361.05 1501.48C1445.58 1501.48 1514.1 1165.48 1514.1 751.007C1514.1 336.533 1445.58 0.536133 1361.05 0.536133C1276.52 0.536133 1208 336.533 1208 751.007C1208 1165.48 1276.52 1501.48 1361.05 1501.48Z",
    "M1451.19 1501.48C1585.5 1501.48 1694.37 1165.48 1694.37 751.007C1694.37 336.533 1585.5 0.536133 1451.19 0.536133C1316.88 0.536133 1208.01 336.533 1208.01 751.007C1208.01 1165.48 1316.88 1501.48 1451.19 1501.48Z",
    "M1541.33 1501.48C1725.42 1501.48 1874.66 1165.48 1874.66 751.007C1874.66 336.533 1725.42 0.536133 1541.33 0.536133C1357.24 0.536133 1208 336.533 1208 751.007C1208 1165.48 1357.24 1501.48 1541.33 1501.48Z",
    "M1631.46 1501.48C1865.33 1501.48 2054.92 1165.48 2054.92 751.007C2054.92 336.533 1865.33 0.536133 1631.46 0.536133C1397.59 0.536133 1208 336.533 1208 751.007C1208 1165.48 1397.59 1501.48 1631.46 1501.48Z",
    "M1721.6 1501.48C2005.25 1501.48 2235.2 1165.48 2235.2 751.007C2235.2 336.533 2005.25 0.536133 1721.6 0.536133C1437.95 0.536133 1208.01 336.533 1208.01 751.007C1208.01 1165.48 1437.95 1501.48 1721.6 1501.48Z",
    "M1811.74 1501.48C2145.17 1501.48 2415.48 1165.48 2415.48 751.007C2415.48 336.533 2145.17 0.536133 1811.74 0.536133C1478.3 0.536133 1208 336.533 1208 751.007C1208 1165.48 1478.3 1501.48 1811.74 1501.48Z",
  ];

  // ===== 2D 캔버스에 그려질 사각형 데이터 =====
  // 원본 SVG에서 추출한 사각형들의 위치, 크기, 색상 정보
  const originalRects = [
    { x: 758.056, y: 329.042, width: 10, height: 10, fill: "#014BFF" }, // 첫 번째 사각형 (작은 크기)
    { x: 1307.75, y: 183.523, width: 10, height: 10, fill: "#014BFF" }, // 두 번째 사각형 (작은 크기)
    {
      x: 1952.34, // X 좌표
      y: 78.2216, // Y 좌표
      width: 16.4656, // 너비
      height: 16.4656, // 높이
      fill: "#014BFF", // 파란색 채우기
    },
    { x: 325.951, y: 207.83, width: 16.4656, height: 16.4656, fill: "#014BFF" }, // 네 번째 사각형 (중간 크기)
    { x: 1652.22, y: 343.802, width: 10, height: 10, fill: "#014BFF" }, // 다섯 번째 사각형 (작은 크기)
  ];

  // ===== 마우스 인터랙션 관련 변수들 =====
  let entryXRef = useRef(null); // 마우스가 캔버스에 진입한 X 좌표를 저장하는 ref
  let initialEntryXRef = useRef(null); // 마우스가 처음 진입한 X 좌표를 저장하는 ref (기준점)
  const animatedPathsRef = useRef(15); // 애니메이션될 경로 개수를 저장하는 ref

  // ===== 스케일링된 데이터를 저장하는 ref들 =====
  const scaledOriginalPathDataRef = useRef([]); // 원본 경로 데이터를 화면 크기에 맞게 스케일링한 배열
  const scaledRectDataRef = useRef([]); // 원본 사각형 데이터를 화면 크기에 맞게 스케일링한 배열
  const scaledExtraPathDataRef = useRef([]); // 인터랙션 시 추가로 생성되는 경로 데이터 배열

  // ===== 애니메이션 및 인터랙션 상수들 =====
  const activeRatio = 0.89; // 마우스 인터랙션이 활성화되는 영역 비율 (89%)
  const MAX_DENSITY_LEVEL = 100; // 최대 밀도 레벨 (추가 경로 생성 개수 제한)
  let rectOpacityRef = useRef(1.0); // 사각형의 투명도를 관리하는 ref (줌 아웃 시 페이드 아웃용)
  let animationFrameId = null; // 애니메이션 프레임 ID (정리 시 사용)

  // ===== 유틸리티 함수들 =====
  /**
   * vw 단위를 픽셀로 변환하는 함수
   * @param {number} value - vw 값 (예: 50 = 50vw)
   * @returns {number} - 픽셀 값
   */
  const vw = useCallback((value) => (value * window.innerWidth) / 100, []);

  /**
   * 두 경로 데이터 사이를 보간하는 함수 (부드러운 애니메이션을 위해)
   * @param {Array} arr1 - 첫 번째 경로 데이터 배열
   * @param {Array} arr2 - 두 번째 경로 데이터 배열
   * @param {number} t - 보간 비율 (0~1, 0=arr1, 1=arr2)
   * @returns {Array} - 보간된 경로 데이터 배열
   */
  const interpolatePathData = useCallback((arr1, arr2, t) => {
    return arr1.map((n, i) => n * (1 - t) + arr2[i] * t); // 선형 보간 공식 적용
  }, []);

  /**
   * 경로 데이터를 사용하여 캔버스에 베지어 곡선을 그리는 함수
   * @param {CanvasRenderingContext2D} ctx - 2D 캔버스 컨텍스트
   * @param {Array} data - 경로 데이터 배열 (26개 요소: 시작점 + 4개 베지어 곡선)
   * @param {string|CanvasGradient} strokeStyle - 선 색상 또는 그라데이션
   * @param {number} strokeWidth - 선 두께
   */
  const drawPathFromData = useCallback(
    (ctx, data, strokeStyle, strokeWidth) => {
      ctx.beginPath(); // 새로운 경로 시작
      ctx.moveTo(data[0], data[1]); // 시작점으로 이동 (data[0]=x, data[1]=y)

      // 첫 번째 베지어 곡선 그리기 (제어점1, 제어점2, 끝점)
      ctx.bezierCurveTo(data[2], data[3], data[4], data[5], data[6], data[7]);

      // 두 번째 베지어 곡선 그리기
      ctx.bezierCurveTo(
        data[8],
        data[9],
        data[10],
        data[11],
        data[12],
        data[13]
      );

      // 세 번째 베지어 곡선 그리기
      ctx.bezierCurveTo(
        data[14],
        data[15],
        data[16],
        data[17],
        data[18],
        data[19]
      );

      // 네 번째 베지어 곡선 그리기
      ctx.bezierCurveTo(
        data[20],
        data[21],
        data[22],
        data[23],
        data[24],
        data[25]
      );

      ctx.strokeStyle = strokeStyle; // 선 색상/그라데이션 설정
      ctx.lineWidth = strokeWidth; // 선 두께 설정
      ctx.stroke(); // 경로를 실제로 그리기
    },
    [] // 의존성 배열이 비어있음 (순수 함수)
  );

  /**
   * 모든 데이터를 화면 크기에 맞게 스케일링하는 함수
   * - 원본 SVG 크기(2416x1502)를 현재 캔버스 크기로 비례 조정
   * - 경로 데이터, 사각형 데이터, 추가 경로 데이터를 모두 스케일링
   * @param {number} canvasWidth - 현재 캔버스 너비
   * @param {number} canvasHeight - 현재 캔버스 높이
   */
  const scaleAllData = useCallback(
    (canvasWidth, canvasHeight) => {
      // 원본 SVG의 크기 (고정값)
      const originalSvgWidth = 2416; // 원본 SVG 너비
      const originalSvgHeight = 1502; // 원본 SVG 높이

      // ===== 경로 데이터 스케일링 =====
      // SVG 경로 문자열을 파싱하여 숫자 배열로 변환 후 스케일링
      scaledOriginalPathDataRef.current = originalPathDs.map((d) => {
        const nums = d.match(/-?\d*\.?\d+/g).map(Number); // SVG 경로에서 모든 숫자 추출
        return nums.map((num, i) => {
          return i % 2 === 0 // 짝수 인덱스는 X좌표
            ? num * (canvasWidth / originalSvgWidth) // X좌표 스케일링
            : num * (canvasHeight / originalSvgHeight); // Y좌표 스케일링
        });
      });

      // ===== 사각형 데이터 스케일링 =====
      // 사각형들의 위치, 크기를 화면 크기에 맞게 조정
      scaledRectDataRef.current = originalRects.map((r) => ({
        x: r.x * (canvasWidth / originalSvgWidth), // X 위치 스케일링
        y: r.y * (canvasHeight / originalSvgHeight), // Y 위치 스케일링
        width: r.width * (canvasWidth / originalSvgWidth), // 너비 스케일링
        height: r.height * (canvasHeight / originalSvgHeight), // 높이 스케일링
        fill: r.fill, // 색상은 그대로 유지
      }));

      // ===== 추가 경로 데이터 생성 (인터랙션용) =====
      // 인접한 경로들 사이에 보간된 경로들을 생성하여 부드러운 애니메이션 구현
      scaledExtraPathDataRef.current = []; // 추가 경로 배열 초기화
      const pathsPerSegment = 10; // 각 세그먼트당 생성할 보간 경로 개수

      // 인접한 경로들 사이에 보간 경로 생성
      for (let i = 0; i < scaledOriginalPathDataRef.current.length - 1; i++) {
        const pathA = scaledOriginalPathDataRef.current[i]; // 현재 경로
        const pathB = scaledOriginalPathDataRef.current[i + 1]; // 다음 경로
        for (let j = 1; j <= pathsPerSegment; j++) {
          const t = j / pathsPerSegment; // 보간 비율 (0~1)
          const interpolatedData = interpolatePathData(pathA, pathB, t); // 보간된 경로 생성
          scaledExtraPathDataRef.current.push(interpolatedData); // 추가 경로 배열에 추가
        }
      }
    },
    [interpolatePathData, originalPathDs, originalRects] // 의존성 배열
  );

  /**
   * 메인 렌더링 함수 - 매 프레임마다 호출되어 캔버스에 그리기
   * - 경로(베지어 곡선) 그리기
   * - 마우스 인터랙션에 따른 추가 경로 생성
   * - 사각형 그리기 (줌 상태에 따른 페이드 효과)
   */
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isZoomedOut = isZoomedRef.current;
    const mouseX = entryXRef.current !== null ? entryXRef.current : -1;

    let targetPaths;

    if (mouseX === -1) {
      // 마우스가 캔버스 밖에 있으면 기본 경로 개수(15)를 목표로 설정
      initialEntryXRef.current = null;
      targetPaths = 15;
    } else {
      // 마우스가 캔버스 안에 있을 때: 진입점 기준 계산
      if (initialEntryXRef.current === null) {
        initialEntryXRef.current = mouseX;
      }

      const movementFromEntry = mouseX - initialEntryXRef.current;

      const basePaths = 15;
      const maxPaths = 109;
      const minPaths = 15;

      const movementRatio = Math.max(
        -1,
        Math.min(1, movementFromEntry / (canvas.width * 0.2))
      );

      let calculatedPaths;
      if (movementRatio >= 0) {
        calculatedPaths = basePaths + (maxPaths - basePaths) * movementRatio;
      } else {
        calculatedPaths = basePaths + (basePaths - minPaths) * movementRatio;
      }
      targetPaths = Math.max(minPaths, calculatedPaths);
    }

    // 목표 경로 개수를 향해 현재 경로 개수를 부드럽게 보간 (Easing)
    animatedPathsRef.current += (targetPaths - animatedPathsRef.current) * 0.05;
    const totalPaths = Math.round(animatedPathsRef.current);

    // ===== 통합된 경로 그리기 로직 =====
    const sourcePaths = scaledOriginalPathDataRef.current;
    if (sourcePaths.length > 0) {
      const sourcePathCount = sourcePaths.length;
      const sourceMaxIndex = sourcePathCount - 1;
      const targetMaxIndex = totalPaths - 1;

      for (let i = 0; i < totalPaths; i++) {
        const t_new = targetMaxIndex <= 0 ? 0 : i / targetMaxIndex;
        const t_original_space = t_new * sourceMaxIndex;

        const floor = Math.floor(t_original_space);
        const ceil = Math.ceil(t_original_space);
        const t_interp = t_original_space - floor;

        const pathA = sourcePaths[floor];
        const pathB = sourcePaths[ceil];

        if (!pathA || !pathB) continue;

        const interpolatedData = interpolatePathData(pathA, pathB, t_interp);

        const pathCenterX = interpolatedData[0];
        const grad = ctx.createLinearGradient(
          pathCenterX,
          0,
          pathCenterX,
          canvas.height
        );
        grad.addColorStop(0.25, "#004AFF");
        grad.addColorStop(0.36, "rgba(0, 74, 255, 0.4)");

        drawPathFromData(ctx, interpolatedData, grad, isZoomedOut ? 3 : 1);
      }
    }

    // ===== 2. 사각형(Rect) 그리기 - 페이드 아웃/인 효과 =====
    const targetOpacity = isZoomedOut ? 0.0 : 1.0; // 목표 투명도 (줌 아웃시 0, 줌 인시 1)

    // 현재 투명도를 목표 투명도로 부드럽게 보간 (LERP: Linear Interpolation)
    rectOpacityRef.current =
      rectOpacityRef.current + (targetOpacity - rectOpacityRef.current) * 0.1;

    // 투명도가 0.01보다 클 때만 사각형 그리기 (성능 최적화)
    if (rectOpacityRef.current > 0.01) {
      for (const r of scaledRectDataRef.current) {
        // 16진수 색상(#014BFF)을 RGBA로 변환하여 투명도 적용
        ctx.fillStyle = `rgba(${parseInt(r.fill.slice(1, 3), 16)}, ${parseInt(
          r.fill.slice(3, 5),
          16
        )}, ${parseInt(r.fill.slice(5, 7), 16)}, ${rectOpacityRef.current})`;
        ctx.fillRect(r.x, r.y, r.width, r.height); // 사각형 그리기
      }
    }

    animationFrameId = requestAnimationFrame(draw); // 다음 프레임에서 다시 draw 함수 호출
  }, [
    drawPathFromData, // 경로 그리기 함수
    isZoomedRef, // 줌 상태 ref
    scaledOriginalPathDataRef, // 스케일링된 원본 경로 데이터
    scaledRectDataRef, // 스케일링된 사각형 데이터
    interpolatePathData, // 경로 보간 함수
    activeRatio, // 인터랙션 영역 비율
  ]);

  /**
   * 컴포넌트 마운트 시 캔버스 초기화 및 이벤트 리스너 설정
   * - 캔버스 크기 설정 및 2D 컨텍스트 획득
   * - 데이터 스케일링 및 초기 렌더링
   * - 마우스 이벤트 리스너 등록
   */
  useEffect(() => {
    // ===== 1. 캔버스 DOM 요소 참조 및 2D 컨텍스트 설정 =====
    const canvas = canvasRef.current; // JSX의 <canvas> 태그 참조
    if (!canvas) return; // 캔버스가 없으면 종료

    const ctx = canvas.getContext("2d"); // 2D 렌더링 컨텍스트 획득
    ctxRef.current = ctx; // 컨텍스트를 ref에 저장 (다른 함수에서 사용)

    // ===== 2. 캔버스 크기 설정 함수 =====
    /**
     * 캔버스 크기를 설정하고 데이터를 스케일링하는 함수
     * - 고해상도 디스플레이 지원 (devicePixelRatio)
     * - vw 단위를 사용한 반응형 크기 설정
     * - 데이터를 화면 크기에 맞게 스케일링
     */
    const setupCanvas = () => {
      const container = canvasContainerRef.current; // 캔버스 컨테이너 참조
      if (!container) return; // 컨테이너가 없으면 종료

      const dpr = window.devicePixelRatio || 1; // 디바이스 픽셀 비율 (고해상도 지원)
      const displayWidth = vw(125.83); // 화면 너비의 125.83% (vw 단위)
      const displayHeight = vw(78.23); // 화면 높이의 78.23% (vw 단위)

      // CSS 스타일 크기 설정 (실제 표시 크기)
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      // 캔버스 내부 해상도 설정 (고해상도 디스플레이 대응)
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr); // 컨텍스트 스케일 조정 (고해상도 대응)

      scaleAllData(displayWidth, displayHeight); // 모든 데이터를 새로운 캔버스 크기에 맞게 스케일링
    };

    // ===== 3. 윈도우 리사이즈 핸들러 함수 =====
    /**
     * 윈도우 크기가 변경될 때 호출되는 함수
     * - 캔버스 크기를 새로운 화면 크기에 맞게 재설정
     * - 데이터를 새로운 크기에 맞게 재스케일링
     */
    const handleResize = () => {
      setupCanvas(); // 캔버스 크기 재설정 및 데이터 재스케일링
    };

    // ===== 4. 마우스 이동 이벤트 핸들러 함수 =====
    /**
     * 마우스가 캔버스 위에서 이동할 때 호출되는 함수
     * - 마우스 X좌표를 저장하여 인터랙션 계산에 사용
     * - 경로 밀도 조절을 위한 기준점 제공
     */
    const handleMouseMove = (e) => {
      const currentCanvas = canvasRef.current; // 현재 캔버스 참조
      if (!currentCanvas || isZoomedRef.current) {
        // 캔버스가 없거나 줌 아웃 상태면 마우스 좌표 초기화
        entryXRef.current = null;
        return;
      }

      const rect = currentCanvas.getBoundingClientRect(); // 캔버스의 화면상 위치 정보
      const mouseX = e.clientX - rect.left; // 캔버스 내부의 상대적 X좌표
      const mouseY = e.clientY - rect.top; // 캔버스 내부의 상대적 Y좌표

      // 마우스가 캔버스 영역 내부에 있는지 확인
      if (
        mouseX > 0 && // 왼쪽 경계 확인
        mouseX < currentCanvas.width / (window.devicePixelRatio || 1) && // 오른쪽 경계 확인
        mouseY > 0 && // 위쪽 경계 확인
        mouseY < currentCanvas.height / (window.devicePixelRatio || 1) // 아래쪽 경계 확인
      ) {
        entryXRef.current = mouseX; // 캔버스 내부에 있으면 X좌표 저장
      } else {
        entryXRef.current = null; // 캔버스 밖에 있으면 null로 설정
      }
    };

    // ===== 5. 초기 설정 및 애니메이션 시작 =====
    setupCanvas(); // 캔버스 크기 설정 및 데이터 스케일링
    animationFrameId = requestAnimationFrame(draw); // 애니메이션 루프 시작

    // ===== 6. 이벤트 리스너 등록 =====
    // 윈도우 리사이즈와 마우스 이동 이벤트에 핸들러 함수 연결
    window.addEventListener("resize", handleResize); // 윈도우 크기 변경 이벤트
    window.addEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트

    // ===== 7. 클린업 함수 (컴포넌트 언마운트 시 실행) =====
    /**
     * 컴포넌트가 언마운트될 때 실행되는 정리 함수
     * - 이벤트 리스너 제거
     * - 애니메이션 프레임 취소
     * - 메모리 누수 방지
     */
    return () => {
      window.removeEventListener("resize", handleResize); // 리사이즈 이벤트 리스너 제거
      window.removeEventListener("mousemove", handleMouseMove); // 마우스 이벤트 리스너 제거
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId); // 애니메이션 프레임 취소
      }
    };
  }, [draw, scaleAllData, vw]); // 의존성 배열

  /**
   * 스크롤 이벤트 처리 useEffect
   * - 스크롤 위치에 따라 줌 상태 변경
   * - 줌 아웃 시 3D 오브젝트들 표시
   * - 줌 인 시 3D 오브젝트들 숨김
   */
  useEffect(() => {
    let timerId = null;
    if (isZoomed) {
      timerId = setTimeout(() => {
        setShow3D(true);
      }, 450); // 줌 애니메이션이 끝나갈 때 3D 표시
    } else {
      setShow3D(false);
    }
    return () => {
      if (timerId) clearTimeout(timerId);
    };
  }, [isZoomed]);

  useEffect(() => {
    const mainEl = mainRef.current; // 메인 컨테이너 DOM 요소 참조
    if (!mainEl) return; // 메인 요소가 없으면 종료

    /**
     * 마우스 휠 이벤트 핸들러
     * - 스크롤 위로 할 때 줌 아웃 상태로 변경 (3D 오브젝트들 표시)
     * - 스크롤 아래로 할 때 줌 인 상태로 변경 (3D 오브젝트들 숨김)
     */
    const handleWheel = (e) => {
      if (e.deltaY < 0 && window.scrollY === 0) {
        // 스크롤 위로 + 페이지 최상단
        e.preventDefault(); // 기본 스크롤 동작 방지
        setIsZoomed(true); // 줌 아웃 상태로 변경 (3D 오브젝트들 표시)
      } else if (e.deltaY > 0 && isZoomedRef.current) {
        // 스크롤 아래로 + 줌 아웃 상태
        e.preventDefault(); // 기본 스크롤 동작 방지
        setIsZoomed(false); // 줌 인 상태로 변경 (3D 오브젝트들 숨김)
      }
    };

    // 휠 이벤트 리스너 등록 (passive: false로 preventDefault 허용)
    window.addEventListener("wheel", handleWheel, { passive: false });

    // 클린업 함수: 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isZoomedRef]);

  // ===== JSX 렌더링 부분 =====
  return (
    <main
      ref={mainRef}
      className={`${isZoomed ? "zoom_out" : ""} ${show3D ? "three_active" : ""}`.trim()}
    >
            {/* ... (nav, dots, txtBox 등 다른 JSX는 그대로 둡니다) ... */}
      {/* 💡 2. 여기가 수정될 부분입니다 💡 */}     {" "}
      {/* 네비게이션 바 */}
      <nav>
        <div className="logo">Pivot Time</div> {/* 로고 텍스트 */}
        <ul className="Tab_Switcher">
          {" "}
          {/* 탭 스위처 메뉴 */}
          <li className="fever_btn">FEVER</li> {/* FEVER 버튼 */}
          <li className="line">
            {" "}
            {/* 구분선 */}
            <svg
              width="0.1vw" // 너비 (화면 너비의 0.1%)
              height="1.24vw" // 높이 (화면 너비의 1.24%)
              viewBox="0 0 2 24" // SVG 뷰박스
              fill="none" // 채우기 없음
              xmlns="http://www.w3.org/2000/svg" // SVG 네임스페이스
            >
              <path
                opacity="0.2" // 20% 투명도
                d="M0.685059 0.708984V23.293" // 수직선 경로
                stroke="white" // 흰색 선
              />
            </svg>
          </li>
          <li className="fever_btn">PIVOT</li> {/* PIVOT 버튼 */}
        </ul>
        <div className="toggle&nav">
          {" "}
          {/* 토글 및 네비게이션 컨테이너 */}
          <div className="toggle_btn"></div> {/* 토글 버튼 */}
          <ul className="nav">
            {" "}
            {/* 네비게이션 메뉴 */}
            <li className="project_btn">Project</li> {/* Project 버튼 */}
            <li className="line">
              {" "}
              {/* 구분선 */}
              <svg
                width="0.1vw" // 너비
                height="1.24vw" // 높이
                viewBox="0 0 2 24" // 뷰박스
                fill="none" // 채우기 없음
                xmlns="http://www.w3.org/2000/svg" // SVG 네임스페이스
              >
                <path
                  opacity="0.2" // 20% 투명도
                  d="M1.45801 0.84375V23.4277" // 수직선 경로
                  stroke="white" // 흰색 선
                />
              </svg>
            </li>
            <li className="student_btn">Student</li> {/* Student 버튼 */}
            <li className="hamburger_btn">
              {" "}
              {/* 햄버거 메뉴 버튼 */}
              <svg
                width="1.51vw" // 너비
                height="1.4vw" // 높이
                viewBox="0 0 29 27" // 뷰박스
                fill="none" // 채우기 없음
                xmlns="http://www.w3.org/2000/svg" // SVG 네임스페이스
              >
                <path
                  d="M4.2627 6.58984H25.1399" // 첫 번째 수평선
                  stroke="white" // 흰색 선
                  strokeWidth="1.81946" // 선 두께
                />
                <path
                  d="M4.2627 13.7305H25.1399" // 두 번째 수평선
                  stroke="white" // 흰색 선
                  strokeWidth="1.81946" // 선 두께
                />
                <path
                  d="M4.2627 20.8711H25.1399" // 세 번째 수평선
                  stroke="white" // 흰색 선
                  strokeWidth="1.81946" // 선 두께
                />
              </svg>
            </li>
          </ul>
        </div>
      </nav>
      <div className="dots"></div> {/* 점들 배경 요소 */}
      <div className="txtBox fever">
        {" "}
        {/* FEVER 텍스트 박스 */}
        <span>GET FEVER,</span> {/* FEVER 텍스트 */}
        <div className="slogan">우리의 전환을 담은 순간</div>{" "}
        {/* FEVER 슬로건 */}
      </div>
      <div className="txtBox pivot">
        {" "}
        {/* PIVOT 텍스트 박스 */}
        <div className="slogan">새로운 길을 향해!</div> {/* PIVOT 슬로건 */}
        <span>GO PIVOT!</span> {/* PIVOT 텍스트 */}
      </div>
      <div id="canvas-container" ref={canvasContainerRef}>
        {" "}
        {/* 2D 캔버스 컨테이너 */}
        <canvas ref={canvasRef} className="bg-canvas" /> {/* 2D 애니메이션 캔버스 */}
        {show3D && <Main3DObject />}
      </div>
      <div className="main_title">PIVOT TIME</div> {/* 메인 타이틀 */}
      <div className="info left">
        {" "}
        {/* 왼쪽 정보 박스 */}
        Kaywon University of Arts & Design {/* 대학명 */}
        <br /> {/* 줄바꿈 */}
        32nd Delight Insight {/* 졸업전시회명 */}
      </div>
      <div className="info center">
        {" "}
        {/* 중앙 정보 박스 */}
        Digital-media.kr {/* 웹사이트 주소 */}
        <br /> {/* 줄바꿈 */}
        degreeshow/2025 {/* 경로 */}
      </div>
      <div className="info right">
        {" "}
        {/* 오른쪽 정보 박스 */}
        Kaywon Design Hall 5F {/* 전시장 위치 */}
        <br /> {/* 줄바꿈 */}
        Nov. 22. FRI - Nov. 24. SUN {/* 전시 기간 */}
      </div>
    </main>
  );
};

export default Hero; // Main 컴포넌트를 기본 내보내기
