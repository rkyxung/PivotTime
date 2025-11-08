// 클라이언트 환경에서만 실행되도록 지정
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import seedrandom from "seedrandom";

export default function line3D({
  isZoomed = false,
  interactive = true,
  cameraDistance = null,
  autoRotate = false,
  autoRotateSpeed = 0.0045,
  enableHover = true,
} = {}) {
  const containerRef = useRef(null);
  const cameraRef = useRef(null);
  const interactiveRef = useRef(interactive);
  const autoRotateRef = useRef(autoRotate);
  const autoRotateSpeedRef = useRef(autoRotateSpeed);
  const hoverEnabledRef = useRef(enableHover);

  // 1. 카메라의 '목표 거리'를 저장할 Ref를 생성합니다.
  const targetCameraDistanceRef = useRef(null);
  interactiveRef.current = interactive;
  autoRotateRef.current = autoRotate;
  autoRotateSpeedRef.current = autoRotateSpeed;
  hoverEnabledRef.current = enableHover;

  // 3. Three.js 씬 초기 설정을 위한 useEffect (최초 1회 실행)
  useEffect(() => {
    const currentContainer = containerRef.current;
    if (!currentContainer) {
      return undefined;
    }

    const getContainerSize = () => {
      const width =
        currentContainer.clientWidth ||
        currentContainer.offsetWidth ||
        window.innerWidth ||
        1;
      const height =
        currentContainer.clientHeight ||
        currentContainer.offsetHeight ||
        window.innerHeight ||
        1;
      return { width, height };
    };

    // 클린업(정리) 함수에서 접근할 수 있도록 변수 선언
    let renderer, baseMaterial;
    let geometries = []; // 생성된 지오메트리를 담을 배열
    let animationFrameId; // ⚠️ 애니메이션 프레임 ID 추가

    // ===== Scene(3D 무대 역할) 생성 =====
    const scene = new THREE.Scene();

    // ... (카메라, 렌더러 설정) ...
    const { width: canvasWidth, height: canvasHeight } = getContainerSize();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasWidth / canvasHeight,
      0.1,
      3000
    );
    camera.position.set(0, 0, 300);
    cameraRef.current = camera; // ref에 현재 카메라 인스턴스 저장

    const baseCameraDistance = camera.position.length();
    // ⚠️ targetCameraDistanceRef의 초기값을 카메라의 실제 위치(400)로 설정
    targetCameraDistanceRef.current = baseCameraDistance;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // 변수에 할당
    renderer.setSize(canvasWidth, canvasHeight);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0);

    // DOM에 추가 (클린업을 위해 ref.current를 변수에 저장)
    currentContainer.appendChild(renderer.domElement);

    // ===== 3D 오브젝트 그룹 생성 =====
    const objectGroup = new THREE.Group();
    scene.add(objectGroup);

    // '시드'를 기반으로 한 새로운 랜덤 함수 생성
    const myRandom = seedrandom("line");

    const MIN_LINES = 40;
    const BASE_LINES = 130;
    const MAX_LINES = 220; // 우클릭 드래그로 늘어날 최대 라인 수
    const minLength = 200; // 라인의 최소 길이
    const maxLength = 300; // 라인의 최대 길이
    const lines = []; // 생성한 라인 참조를 저장

    // ===== 기준 재질 생성 =====
    baseMaterial = new THREE.LineBasicMaterial({
      // 변수에 할당
      color: 0xffffff,
      transparent: true,
    });

    // ===== 궤적을 구성할 라인 생성 =====
    for (let i = 0; i < MAX_LINES; i++) {
      // 1. 라인의 시작점 (무조건 중앙)
      const start = new THREE.Vector3(0, 0, 0);

      // 2. 라인의 끝점 (직접 랜덤 벡터 생성)
      const x = myRandom() * 2 - 1;
      const y = myRandom() * 2 - 1;
      const z = myRandom() * 2 - 1;

      const length = minLength + myRandom() * (maxLength - minLength);

      const end = new THREE.Vector3(x, y, z).normalize().multiplyScalar(length);

      // 3. 지오메트리 생성 (시작점, 끝점)
      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      geometries.push(geometry); // 클린업을 위해 지오메트리 저장

      // 4. 재질 복제 및 랜덤 투명도 설정
      const material = baseMaterial.clone();
      material.opacity = myRandom() * 0.8;

      // 5. 라인 생성
      const line = new THREE.Line(geometry, material);
      line.visible = i < BASE_LINES;
      lines.push(line);

      // 6. 그룹에 추가
      objectGroup.add(line);
    }

    // ==================================================================
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲ [로직 종료] ▲▲▲▲▲▲▲▲▲▲▲▲▲
    // ==================================================================

    // ===== 마우스 인터랙션 및 초기 각도 설정 =====
    const initialRotationX = THREE.MathUtils.degToRad(10);
    const initialRotationY = THREE.MathUtils.degToRad(0);
    const initialRotationZ = THREE.MathUtils.degToRad(25);
    objectGroup.rotation.x = initialRotationX;
    objectGroup.rotation.y = initialRotationY;
    objectGroup.rotation.z = initialRotationZ;
    let targetX = initialRotationX;
    let targetY = initialRotationY;
    let targetZ = initialRotationZ;

    // 감도 설정
    const sensitivity = Math.PI / 4;
    const sensitivityZ = Math.PI / 8;
    const DRAG_SENSITIVITY = 0.35;

    const cameraDirection = camera.position.clone().normalize();
    const BASE_CAMERA_DISTANCE = camera.position.length();
    const MIN_CAMERA_DISTANCE = BASE_CAMERA_DISTANCE * 0.5;
    const MAX_CAMERA_DISTANCE = BASE_CAMERA_DISTANCE * 1.6;

    // 2. animate 루프에서 사용할 '현재' 카메라 거리를 선언합니다.
    let currentCameraDistance = targetCameraDistanceRef.current; // Ref의 현재 값으로 초기화

    let targetLineCount = BASE_LINES;
    let currentLineCount = BASE_LINES;
    let lastAppliedLineCount = -1;

    const applyLineVisibility = (count) => {
      const clamped = THREE.MathUtils.clamp(count, MIN_LINES, MAX_LINES);
      lines.forEach((line, index) => {
        line.visible = index < clamped;
      });
      lastAppliedLineCount = clamped;
    };
    applyLineVisibility(BASE_LINES);

    let isRightDragging = false;
    let rightDragStartX = 0;
    let rightDragStartCount = BASE_LINES;
    let isLeftDragging = false;
    let leftDragStartY = 0;
    let leftDragMoved = false;
    // 3. 드래그 시작 시점의 카메라 거리를 Ref에서 가져옵니다.
    let leftDragStartCameraDistance = targetCameraDistanceRef.current;

    // ... (handleMouseMove, animate, handleResize, cleanup 로직은 동일) ...
    const handleMouseMove = (e) => {
      if (!hoverEnabledRef.current) {
        return;
      }
      // ⚠️ [수정 1/4] ⭐️
      // 마우스 좌표와 호버(회전) 로직은 항상 실행합니다.
      // (HeroSection과 VisualSection 모두 호버 회전이 필요)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetY = initialRotationY + x * sensitivity; // 감도 변수 적용
      targetX = initialRotationX + y * sensitivity * -1; // 감도 변수 적용
      targetZ = initialRotationZ + x * sensitivityZ; // Z축 회전 로직 추가

      // ⚠️ [수정 2/4] ⭐️
      // 드래그(줌/라인 수 변경) 로직은 interactive가 false일 때만 (HeroSection) 실행합니다.
      if (!interactiveRef.current) {
        if (isRightDragging) {
          const deltaX = e.clientX - rightDragStartX;
          const ratio = THREE.MathUtils.clamp(
            deltaX / (window.innerWidth * DRAG_SENSITIVITY),
            -1,
            1
          );
          const desiredCount =
            rightDragStartCount + ratio * (MAX_LINES - MIN_LINES);
          targetLineCount = THREE.MathUtils.clamp(
            desiredCount,
            MIN_LINES,
            MAX_LINES
          );
        }

        if (isLeftDragging) {
          const deltaY = e.clientY - leftDragStartY;
          if (!leftDragMoved && Math.abs(deltaY) > 3) {
            leftDragMoved = true;
          }
          const ratio = THREE.MathUtils.clamp(
            deltaY / (window.innerHeight * DRAG_SENSITIVITY),
            -1,
            1
          );
          const desiredDistance =
            leftDragStartCameraDistance +
            ratio * (MAX_CAMERA_DISTANCE - MIN_CAMERA_DISTANCE);

          targetCameraDistanceRef.current = THREE.MathUtils.clamp(
            desiredDistance,
            MIN_CAMERA_DISTANCE,
            MAX_CAMERA_DISTANCE
          );
        }
      }
    };

    const handleMouseDown = (e) => {
      // ⚠️ [수정 3/4] ⭐️
      // interactive가 true일 때 (VisualSection)는 드래그 시작을 막습니다.
      if (interactiveRef.current) {
        return;
      }

      // interactive가 false일 때 (HeroSection) 드래그 로직이 실행됩니다.
      if (e.button === 2) {
        isRightDragging = true;
        rightDragStartX = e.clientX;
        rightDragStartCount = targetLineCount;
      }
      if (e.button === 0) {
        isLeftDragging = true;
        leftDragStartY = e.clientY;
        leftDragMoved = false;
        leftDragStartCameraDistance = targetCameraDistanceRef.current;
      }
    };

    const handleMouseUp = (e) => {
      // ⚠️ [수정 4/4] ⭐️
      // interactive가 true일 때 (VisualSection)는 드래그 종료를 막습니다.
      if (interactiveRef.current) {
        return;
      }

      // interactive가 false일 때 (HeroSection) 드래그 로직이 실행됩니다.
      if (isRightDragging && e.button === 2) {
        isRightDragging = false;
      }
      if (isLeftDragging && e.button === 0) {
        isLeftDragging = false;
        if (leftDragMoved) {
          const suppressNextClick = (clickEvent) => {
            clickEvent.stopPropagation();
            clickEvent.preventDefault();
            window.removeEventListener("click", suppressNextClick, true);
          };
          window.addEventListener("click", suppressNextClick, true);
        }
      }
    };

    const handleContextMenu = (e) => {
      // 컨텍스트 메뉴는 항상 막습니다.
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    // 이벤트 리스너는 항상 바인딩합니다. (내부 로직이 interactiveRef로 분기됨)
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    camera.lookAt(0, 0, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // ⚠️ ID 저장

      // interactive=false(HeroSection) 기본 복귀 로직, 단 자동 회전 중에는 유지
      if (
        !interactiveRef.current &&
        !autoRotateRef.current &&
        !isLeftDragging &&
        !isRightDragging
      ) {
        targetX += (initialRotationX - targetX) * 0.08;
        targetY += (initialRotationY - targetY) * 0.08;
        targetZ += (initialRotationZ - targetZ) * 0.08;
        targetLineCount += (BASE_LINES - targetLineCount) * 0.1;
        // 줌 로직은 isZoomed useEffect가 담당하므로 여기서는 복귀 로직만 처리
        // (isZoomed가 false일 때 baseCameraDistance로 돌아감)
        targetCameraDistanceRef.current +=
          (baseCameraDistance - targetCameraDistanceRef.current) * 0.1;
      }

      currentLineCount += (targetLineCount - currentLineCount) * 0.15;
      const roundedCount = Math.round(currentLineCount);
      if (roundedCount !== lastAppliedLineCount) {
        applyLineVisibility(roundedCount);
      }

      if (autoRotateRef.current && !isLeftDragging && !isRightDragging) {
        targetY += autoRotateSpeedRef.current;
        targetZ += autoRotateSpeedRef.current * 0.15;
      }

      // 6. animate 루프가 Ref의 '목표' 값을 향해 '현재' 값을 갱신합니다.
      currentCameraDistance +=
        (targetCameraDistanceRef.current - currentCameraDistance) * 0.1;

      // 7. 갱신된 '현재' 값으로 카메라 위치를 설정합니다.
      if (cameraRef.current) {
        // 렌더링 전에 cameraRef가 유효한지 확인
        cameraRef.current.position.copy(
          cameraDirection.clone().multiplyScalar(currentCameraDistance)
        );
        cameraRef.current.lookAt(0, 0, 0);
      }

      gsap.to(objectGroup.rotation, {
        x: targetX,
        y: targetY,
        z: targetZ,
        duration: 1,
        ease: "power2.out",
      });

      if (renderer && cameraRef.current) {
        // 렌더러와 카메라도 유효한지 확인
        renderer.render(scene, cameraRef.current);
      }
    };
    animate();

    const handleResize = () => {
      if (!cameraRef.current || !renderer) return; // 널 체크 추가
      const { width, height } = getContainerSize();
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId); // ⚠️ 프레임 취소

      // 이벤트 리스너 제거
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);

      window.removeEventListener("resize", handleResize);
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement);
      }

      // 루프에서 생성된 모든 지오메트리 및 재질 자원 해제
      objectGroup.children.forEach((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
      // geometries 배열을 순회하며 dispose (더 확실한 방법)
      geometries.forEach((geometry) => geometry.dispose());

      if (baseMaterial) baseMaterial.dispose();
      if (renderer) renderer.dispose();
    };
  }, []); // useEffect는 처음 렌더링될 때 한 번만 실행 (의존성 배열 비움)

  // 8. 줌(스크롤)을 위한 별도의 useEffect (컴포넌트 최상위 레벨)
  useEffect(() => {
    const hasCustomDistance =
      typeof cameraDistance === "number" && Number.isFinite(cameraDistance);

    if (hasCustomDistance) {
      targetCameraDistanceRef.current = cameraDistance;
      return;
    }

    if (interactiveRef.current) {
      // interactive=true(VisualSection) 기본 거리
      targetCameraDistanceRef.current = 550;
    } else {
      // interactive=false(HeroSection)에서는 기존 isZoomed 로직 유지
      targetCameraDistanceRef.current = isZoomed ? 500 : 300;
    }
  }, [isZoomed, interactive, cameraDistance]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "auto", // JS가 제어하므로 항상 'auto'
      }}
    />
  );
}
