// 클라이언트 환경에서만 실행되도록 지정
"use client";

// React의 useEffect(렌더링 이후 실행용), useRef(DOM 요소를 직접 제어하기 위한 참조용) 불러오기
import { useEffect, useRef } from "react";

// three.js의 모든 기능을 불러옴 (3D 장면, 카메라, 오브젝트, 재질 등)
import * as THREE from "three";

// GSAP(자바스크립트 애니메이션 전용 라이브"G"SAP" 애니메이션 전용 라이브러리) 불러오기
import { gsap } from "gsap";

// ThreeScene 컴포넌트를 정의 (3D 장면을 생성하고 렌더링하는 역할)
export default function Square3D({ interactive = true } = {}) {
  // three.js가 생성한 캔버스를 붙일 HTML 요소를 가리키는 참조 생성
  const containerRef = useRef(null);
  const interactiveRef = useRef(interactive);
  interactiveRef.current = interactive;

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 부분
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

    // 클린업을 위해 변수 선언
    let renderer, geometry, baseMaterial;
    let animationFrameId; // 애니메이션 프레임 ID 저장을 위해 추가

    // ===== Scene(3D 무대 역할) 생성 =====
    const scene = new THREE.Scene(); // 장면을 생성하여 모든 3D 객체를 담을 공간 생성

    // ===== 현재 화면 크기 가져오기 =====
    const { width: canvasWidth, height: canvasHeight } = getContainerSize();

    // ===== 원근 카메라 설정 =====
    const camera = new THREE.PerspectiveCamera(
      75, // 시야각(FOV)
      canvasWidth / canvasHeight, // 종횡비(가로/세로 비율)
      0.1, // 가까운 클리핑 평면 (이 거리보다 가까운 객체는 보이지 않음)
      3000 // 먼 클리핑 평면 (이 거리보다 먼 객체는 보이지 않음)
    );
    camera.position.set(300, 0, 550); // 카메라를 Z축 방향으로 뒤로 이동시켜 장면 전체를 볼 수 있게 설정

    // ===== 렌더러(WebGLRenderer) 설정 =====
    renderer = new THREE.WebGLRenderer({ // 변수에 할당
      antialias: true, // 가장자리를 부드럽게 처리
      alpha: true, // 배경을 투명하게 설정
    });

    renderer.setSize(canvasWidth, canvasHeight); // 렌더러의 출력 크기를 현재 화면 크기에 맞게 설정
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0x000000, 0); // 배경색을 투명으로 설정

    // ===== 렌더러 DOM에 추가 =====
    currentContainer.appendChild(renderer.domElement); // 렌더러가 생성한 캔버스를 HTML에 추가

    // ===== 3D 오브젝트 그룹 생성 (마우스 인터랙션으로 이 그룹이 회전함) =====
    const objectGroup = new THREE.Group(); // 여러 오브젝트를 하나로 묶기 위한 그룹 생성
    scene.add(objectGroup); // 그룹을 장면에 추가

    // ==================================================================
    // ▼▼▼▼▼▼▼▼▼▼▼▼▼ [Square3D 로직: "휘어진 리본" 궤적] ▼▼▼▼▼▼▼▼▼▼▼
    // ==================================================================

    const MIN_LINES = 10;
    const BASE_LINES = 40;
    const MAX_LINES = 160;
    const baseRotation = THREE.MathUtils.degToRad(3); 
    const baseOpacity = 0.95; 
    const baseDepth = 20; 
    const baseScale = 1; 

    // ===== 단일 사각형(프로필 형태) 정의 =====
    const squareSize = 300; 
    const squarePoints = [
      new THREE.Vector3(-squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, -squareSize / 2, 0),
      new THREE.Vector3(squareSize / 2, squareSize / 2, 0),
      new THREE.Vector3(-squareSize / 2, squareSize / 2, 0),
    ];
    geometry = new THREE.BufferGeometry().setFromPoints(squarePoints); // 변수에 할당

    // ===== 기준 재질 생성 =====
    baseMaterial = new THREE.LineBasicMaterial({ // 변수에 할당
      color: 0xffffff, 
      transparent: true, 
    });

    // ===== 궤적을 구성할 사각형(선) 생성 =====
    const lineLoops = [];
    const configureLine = (line, index) => {
      const scale = Math.pow(baseScale, index);
      line.scale.set(scale, scale, scale);
      line.rotation.z = index * baseRotation;
      const angle = index * 0.15;
      line.position.x = Math.sin(angle * 0.5) * 150;
      line.position.y = Math.cos(angle * 0.5) * 100;
      line.position.z = -index * baseDepth;
      line.userData.initialRotationZ = line.rotation.z;
    };

    for (let i = 0; i < MAX_LINES; i++) {
      const material = baseMaterial.clone();
      material.opacity = Math.max(0.05, Math.pow(baseOpacity, i) * 0.9 + 0.05);

      const line = new THREE.LineLoop(geometry, material);
      configureLine(line, i);

      line.visible = i < BASE_LINES;
      lineLoops.push(line);
      objectGroup.add(line);
    }

    // ==================================================================
    // ▲▲▲▲▲▲▲▲▲▲▲▲▲ [로직 종료] ▲▲▲▲▲▲▲▲▲▲▲▲▲
    // ==================================================================

    // ===== 1. 마우스 인터랙션 로직 수정 =====
    
    // 1-1. Raycaster와 마우스 좌표 변수 생성
    const raycaster = new THREE.Raycaster();
    raycaster.params.Line.threshold = 12; // 선과의 거리 여유 폭을 늘려 호버 감지 허용
    const mouse = new THREE.Vector2(-100, -100); // (초기값은 화면 밖)
    
    // 1-2. 현재 회전 중인 객체와 이탈 프레임 수를 추적
    const activeRotations = new Map();
    const EXIT_FRAME_THRESHOLD = 6; // 교차가 끊긴 프레임 허용치

    // 1-3. 초기 각도 설정 (이건 그대로 유지)
    // "측면으로 보여주는 거"
    const initialRotationX = THREE.MathUtils.degToRad(10);
    const initialRotationY = THREE.MathUtils.degToRad(-90);
    const initialRotationZ = THREE.MathUtils.degToRad(0);

    objectGroup.rotation.x = initialRotationX;
    objectGroup.rotation.y = initialRotationY;
    objectGroup.rotation.z = initialRotationZ;

    const wrapAngle = gsap.utils.wrap(0, Math.PI * 2);
    const DRAG_SENSITIVITY = 0.35;

    const MIN_SCALE = 0.6;
    const BASE_SCALE = 1;
    const MAX_SCALE = 2;
    let targetScale = BASE_SCALE;
    let currentScale = BASE_SCALE;

    let targetLineCount = BASE_LINES;
    let currentLineCount = BASE_LINES;
    let lastAppliedLineCount = BASE_LINES;

    const normalizeRotation = (line) => {
      if (!line) return 0;
      const base = line.userData.initialRotationZ || 0;
      const offset = wrapAngle(line.rotation.z - base);
      line.rotation.z = base + offset;
      return base;
    };

    const startHoverRotation = (line) => {
      if (!line) return;
      if (line.userData.hoverTween) {
        activeRotations.set(line, 0);
        return;
      }
      const base = normalizeRotation(line);
      line.userData.hoverTween = gsap.to(line.rotation, {
        z: "+=" + Math.PI * 2,
        duration: 2,
        ease: "none",
        repeat: -1,
        modifiers: {
          z: (value) => base + wrapAngle(parseFloat(value) - base),
        },
      });
      activeRotations.set(line, 0);
    };

    const stopHoverRotation = (line) => {
      if (!line) return;
      if (line.userData.hoverTween) {
        line.userData.hoverTween.kill();
        line.userData.hoverTween = null;
      }
      const base = normalizeRotation(line);
      gsap.to(line.rotation, {
        z: base,
        duration: 0.5,
        ease: "power2.out",
      });
      activeRotations.delete(line);
    };

    const applyLineVisibility = (count) => {
      const clamped = THREE.MathUtils.clamp(count, MIN_LINES, MAX_LINES);
      lineLoops.forEach((line, index) => {
        const shouldShow = index < clamped;
        if (!shouldShow && activeRotations.has(line)) {
          stopHoverRotation(line);
        }
        line.visible = shouldShow;
      });
      lastAppliedLineCount = clamped;
    };
    applyLineVisibility(BASE_LINES);

    let isRightDragging = false;
    let rightDragStartX = 0;
    let rightDragStartCount = BASE_LINES;
    let isLeftDragging = false;
    let leftDragStartY = 0;
    let leftDragStartScale = BASE_SCALE;
    let leftDragMoved = false;

    // ===== 마우스 움직임 감지 함수 정의 =====
    const handleMouseMove = (e) => {
      if (!interactiveRef.current) {
        return;
      }
      // 1-5. 마우스 위치를 -1에서 1 사이의 3D 좌표로 변환
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1; // Y좌표 방향 뒤집기 (Three.js는 위쪽이 +)


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
        const desiredScale =
          leftDragStartScale + ratio * (MAX_SCALE - MIN_SCALE);
        targetScale = THREE.MathUtils.clamp(
          desiredScale,
          MIN_SCALE,
          MAX_SCALE
        );
      }
    };
    const handleMouseDown = (e) => {
      if (!interactiveRef.current) {
        return;
      }
      if (e.button === 2) {
        isRightDragging = true;
        rightDragStartX = e.clientX;
        rightDragStartCount = targetLineCount;
      }
      if (e.button === 0) {
        isLeftDragging = true;
        leftDragStartY = e.clientY;
        leftDragStartScale = targetScale;
        leftDragMoved = false;
      }
    };

    const handleMouseUp = (e) => {
      if (!interactiveRef.current) {
        return;
      }
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
        leftDragMoved = false;
      }
    };

    const handleContextMenu = (e) => {
      if (!interactiveRef.current) {
        return;
      }
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };
    const bindPointerEvents = interactiveRef.current;

    if (bindPointerEvents) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("contextmenu", handleContextMenu);
    }

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate); // 애니메이션 프레임 ID 저장

      if (!interactiveRef.current) {
        mouse.set(-100, -100);
        targetLineCount += (BASE_LINES - targetLineCount) * 0.12;
        targetScale += (BASE_SCALE - targetScale) * 0.12;
      }

      raycaster.setFromCamera(mouse, camera); // Raycaster 업데이트

      const intersects = raycaster.intersectObjects(objectGroup.children, true);
      const currentHits = new Set(
        intersects.map((hit) => hit.object)
      );

      currentHits.forEach((obj) => {
        startHoverRotation(obj);
      });

      activeRotations.forEach((missCount, obj) => {
        if (currentHits.has(obj)) {
          activeRotations.set(obj, 0);
        } else {
          const nextCount = missCount + 1;
          if (nextCount > EXIT_FRAME_THRESHOLD) {
            stopHoverRotation(obj);
          } else {
            activeRotations.set(obj, nextCount);
          }
        }
      });

      currentLineCount += (targetLineCount - currentLineCount) * 0.12;
      const roundedCount = Math.round(currentLineCount);
      if (roundedCount !== lastAppliedLineCount) {
        applyLineVisibility(roundedCount);
      }

      currentScale += (targetScale - currentScale) * 0.12;
      objectGroup.scale.set(currentScale, currentScale, currentScale);

      renderer.render(scene, camera); // 현재 장면을 카메라 시점에서 렌더링
    };

    animate(); // 애니메이션 실행 시작

    // ===== 창 크기 변경 시 반응형 처리 =====
    // ... (handleResize 로직은 동일) ...
    const handleResize = () => {
      const { width, height } = getContainerSize();
      camera.aspect = width / height; 
      camera.updateProjectionMatrix(); 
      renderer.setSize(width, height); 
    };
    window.addEventListener("resize", handleResize); 

    // ===== 컴포넌트가 사라질 때 실행되는 정리 코드 =====
    // ... (return () => { ... } 로직은 동일) ...
    return () => {
      cancelAnimationFrame(animationFrameId); 
      if (bindPointerEvents) {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mousedown", handleMouseDown);
        window.removeEventListener("mouseup", handleMouseUp);
        window.removeEventListener("contextmenu", handleContextMenu);
      }
      window.removeEventListener("resize", handleResize); 
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement); 
      }
      geometry.dispose(); 
      baseMaterial.dispose(); 
      activeRotations.forEach((_, obj) => stopHoverRotation(obj));
      activeRotations.clear();

      objectGroup.children.forEach(child => {
        if (child.userData?.hoverTween) {
          child.userData.hoverTween.kill();
          child.userData.hoverTween = null;
        }
        if (child.material) child.material.dispose();
      });

      renderer.dispose(); 
    };
  }, []); // useEffect는 처음 렌더링될 때 한 번만 실행

  // ===== three.js 캔버스를 표시할 HTML 요소 반환 =====
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
    />
  );
}
