// 클라이언트 환경에서만 실행되도록 지정
"use client";

// React의 useEffect(렌더링 이후 실행용), useRef(DOM 요소를 직접 제어하기 위한 참조용) 불러오기
import { useEffect, useRef } from "react";

// three.js의 모든 기능을 불러옴 (3D 장면, 카메라, 오브젝트, 재질 등)
import * as THREE from "three";

// GSAP(자바스크립트 애니메이션 전용 라이브러리) 불러오기
import { gsap } from "gsap";

// 1. isZoomed prop을 받도록 수정
export default function Circle3D({ isZoomed }) {
  // three.js가 생성한 캔버스를 붙일 HTML 요소를 가리키는 참조 생성
  const containerRef = useRef(null);
  
  // 2. 카메라의 '목표 Z거리'를 저장할 Ref를 생성합니다. (초기값 420)
  const targetCameraZRef = useRef(420);
  
  // 3. 카메라 객체 자체를 저장할 Ref 생성
  const cameraRef = useRef(null);

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 부분
  useEffect(() => {
    // 클린업(정리) 함수에서 접근할 수 있도록 변수 선언
    let renderer, geometry, material;

    // ===== Scene(3D 무대 역할) 생성 =====
    const scene = new THREE.Scene(); // 장면을 생성하여 모든 3D 객체를 담을 공간 생성

    // ===== 현재 화면 크기 가져오기 =====
    const canvasWidth = window.innerWidth; // 브라우저 창 너비
    const canvasHeight = window.innerHeight; // 브라우저 창 높이

    // ===== 원근 카메라 설정 =====
    const camera = new THREE.PerspectiveCamera(
      75, // 시야각(FOV)
      canvasWidth / canvasHeight, // 종횡비(가로/세로 비율)
      0.1, // 가까운 클리핑 평면 (이 거리보다 가까운 객체는 보이지 않음)
      3000 // 먼 클리핑 평면 (이 거리보다 먼 객체는 보이지 않음)
    );
    camera.position.set(0, -20, 420); // 카메라를 Z축 방향으로 뒤로 이동시켜 장면 전체를 볼 수 있게 설정
    cameraRef.current = camera; // 4. ref에 현재 카메라 인스턴스 저장

    // ===== 렌더러(WebGLRenderer) 설정 =====
    renderer = new THREE.WebGLRenderer({ // 변수에 할당
      antialias: true, // 가장자리를 부드럽게 처리
      alpha: true, // 배경을 투명하게 설정
    });

    renderer.setSize(canvasWidth, canvasHeight); // 렌더러의 출력 크기를 현재 화면 크기에 맞게 설정
    renderer.setClearColor(0x000000, 0); // 배경색을 투명으로 설정
    
    // DOM에 추가 (클린업을 위해 ref.current를 변수에 저장)
    const currentContainer = containerRef.current;
    if (currentContainer) {
        currentContainer.appendChild(renderer.domElement); // 렌더러가 생성한 캔버스를 HTML에 추가
    } else {
        console.error("Container ref is not set.");
        return;
    }

    // ===== 3D 오브젝트 그룹 생성 =====
    const objectGroup = new THREE.Group(); // 여러 오브젝트를 하나로 묶기 위한 그룹 생성
    scene.add(objectGroup); // 그룹을 장면에 추가

    // ===== 가로 원을 세로로 회전시켜 가로축 기준으로 회전시키는 구조 생성 =====
    const R = 150; // 궤적(큰 원)의 반지름 설정
    const r = 150; // 작은 원(프로필 원)의 반지름 설정

    const MIN_LINES = 34;
    const BASE_LINES = 34;
    const MAX_LINES = 100;

    material = new THREE.LineBasicMaterial({ // 변수에 할당
      color: 0xffffff, // 선 색상 흰색 지정
      transparent: true, // 투명도 설정 가능하도록 활성화
      opacity: 0.7, // 선의 투명도 설정
    });

    // ===== 단일 원(프로필 형태) 정의 =====
    const circlePoints = []; // 원의 각 점들을 담을 배열 생성
    const segments = 64; // 원을 구성할 세분화 정도 (값이 높을수록 매끄러운 원)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2; // 각 점의 각도 계산
      circlePoints.push(
        new THREE.Vector3(
          r * Math.cos(theta), // X 좌표 계산
          r * Math.sin(theta), // Y 좌표 계산
          0 // Z 좌표는 0으로 설정 (2D 평면상의 원)
        )
      );
    }
    geometry = new THREE.BufferGeometry().setFromPoints(circlePoints); // 변수에 할당. 계산된 점들을 이용해 원형 선 지오메트리 생성

    const linePivots = [];
    // ===== 궤적을 구성할 선 생성 =====
    for (let i = 0; i < MAX_LINES; i++) {
      const line = new THREE.Line(geometry, material); // 원형 라인을 생성하고 재질 적용
      line.position.y = R; // 선을 위로 이동시켜 중심축을 기준으로 회전할 수 있게 설정
      const pivot = new THREE.Group(); // 회전 기준이 될 피벗 그룹 생성
      pivot.add(line); // 피벗에 선 추가
      objectGroup.add(pivot); // 피벗 그룹을 메인 오브젝트 그룹에 추가
      linePivots.push(pivot);
    }

    let targetLineCount = BASE_LINES;
    let currentLineCount = BASE_LINES;
    let lastAppliedLineCount = -1;

    const applyLineDistribution = (count) => {
      const clamped = THREE.MathUtils.clamp(count, MIN_LINES, MAX_LINES);
      const step = (Math.PI * 2) / clamped;
      for (let i = 0; i < linePivots.length; i++) {
        const pivot = linePivots[i];
        const visible = i < clamped;
        pivot.visible = visible;
        if (visible) {
          pivot.rotation.x = step * i;
        }
      }
      lastAppliedLineCount = clamped;
    };

    applyLineDistribution(BASE_LINES);

    // ===== 오브젝트 그룹 전체를 가로 방향으로 눕히기 =====
    objectGroup.rotation.z = Math.PI / 2; // 그룹 전체를 Z축 기준으로 90도 회전시켜 가로로 눕힘

    // ===== 마우스 움직임에 따라 회전할 목표값 초기화 =====
    // ===== 마우스 인터랙션 및 초기 각도 설정 =====
    const initialRotationX = 0;
    const initialRotationY = 0;
    const initialRotationZ = objectGroup.rotation.z; // Z축 초기값(90도) 저장
    let targetX = initialRotationX;
    let targetY = initialRotationY;
    let targetZ = initialRotationZ;

    const sensitivity = Math.PI / 2.5; 
    const sensitivityZ = Math.PI / 5; // Z축 회전을 위한 별도 감도 (Y축 감도의 절반)
    const DRAG_SENSITIVITY = 0.35; // 우클릭 드래그 시 라인 밀도 변화 감도
    
    // 5. MIN, BASE, MAX Z값을 정의합니다.
    const MIN_CAMERA_Z = 260;
    const BASE_CAMERA_Z = camera.position.z; // 420
    const MAX_CAMERA_Z = 700;
    const CAMERA_DRAG_SENSITIVITY = 0.4;

    let isRightDragging = false;
    let dragStartX = 0;
    let dragStartCount = BASE_LINES;
    let isLeftDragging = false;
    let leftDragStartY = 0;
    
    // 6. 드래그 시작 시점의 Z값을 Ref에서 가져옵니다.
    let leftDragStartCameraZ = targetCameraZRef.current;
    let leftDragMoved = false;

    // 7. '현재' 카메라 Z값을 Ref의 값으로 초기화합니다.
    let currentCameraZ = targetCameraZRef.current;

    // ===== 마우스 움직임 감지 함수 정의 =====
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // 마우스의 X좌표를 -1~1 범위로 정규화
      const y = (e.clientY / window.innerHeight) * 2 - 1; // 마우스의 Y좌표를 -1~1 범위로 정규화
      targetY = initialRotationY + (x * sensitivity); // 마우스 좌우 움직임으로 Y축 회전값 설정
      targetX = initialRotationX + (y * sensitivity * -1); // 마우스 상하 움직임으로 X축 회전값 설정
      
      // 1. 마우스 좌우(x) 움직임이 Z축(롤링)에도 영향을 주도록 추가
      targetZ = initialRotationZ + (x * sensitivityZ); 

      if (isRightDragging) {
        const delta = e.clientX - dragStartX;
        const ratio = THREE.MathUtils.clamp(
          delta / (window.innerWidth * DRAG_SENSITIVITY),
          -1,
          1
        );
        const desired =
          dragStartCount + ratio * (MAX_LINES - MIN_LINES);
        targetLineCount = THREE.MathUtils.clamp(
          desired,
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
          deltaY / (window.innerHeight * CAMERA_DRAG_SENSITIVITY),
          -1,
          1
        );
        const desiredCamera =
          leftDragStartCameraZ + ratio * (MAX_CAMERA_Z - MIN_CAMERA_Z);
        
        // 8. 마우스 드래그 시, Ref의 값을 업데이트합니다.
        targetCameraZRef.current = THREE.MathUtils.clamp(
          desiredCamera,
          MIN_CAMERA_Z,
          MAX_CAMERA_Z
        );
      }
    };
    window.addEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트 등록

    const handleMouseDown = (e) => {
      if (e.button === 2) {
        isRightDragging = true;
        dragStartX = e.clientX;
        dragStartCount = targetLineCount;
      }
      if (e.button === 0) {
        isLeftDragging = true;
        leftDragStartY = e.clientY;
        // 9. 드래그 시작 시 Ref의 현재 값으로 시작점을 설정합니다.
        leftDragStartCameraZ = targetCameraZRef.current;
        leftDragMoved = false;
      }
    };

    const handleMouseUp = (e) => {
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
      if (containerRef.current && containerRef.current.contains(e.target)) {
        e.preventDefault();
      }
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("contextmenu", handleContextMenu);

    // ===== 애니메이션 함수 정의 =====
    const animate = () => {
      requestAnimationFrame(animate); // 매 프레임마다 animate 함수 반복 실행
      currentLineCount += (targetLineCount - currentLineCount) * 0.1;
      const rounded = Math.round(currentLineCount);
      if (rounded !== lastAppliedLineCount) {
        applyLineDistribution(rounded);
      }

      // 10. animate 루프가 Ref의 '목표' 값을 향해 '현재' 값을 갱신합니다.
      currentCameraZ += (targetCameraZRef.current - currentCameraZ) * 0.1;
      
      // 11. 갱신된 '현재' 값으로 카메라 위치를 설정합니다. (Ref 사용)
      cameraRef.current.position.z = currentCameraZ;

      gsap.to(objectGroup.rotation, {
        x: targetX, // 목표 X축 회전값으로 애니메이션
        y: targetY, // 목표 Y축 회전값으로 애니메이션
        z: targetZ, // Z축 회전값도 GSAP에 전달
        duration: 1, // 애니메이션 지속 시간
        ease: "power2.out", // 감속 애니메이션 적용
      });
      // 12. Ref의 카메라로 렌더링합니다.
      renderer.render(scene, cameraRef.current); // 현재 장면을 카메라 시점에서 렌더링
    };

    animate(); // 애니메이션 실행 시작

    // ===== 창 크기 변경 시 반응형 처리 =====
    const handleResize = () => {
      // 13. Ref의 카메라를 사용합니다.
      cameraRef.current.aspect = window.innerWidth / window.innerHeight; // 카메라의 종횡비를 새 창 크기에 맞게 조정
      cameraRef.current.updateProjectionMatrix(); // 카메라 투영 행렬 업데이트
      renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기도 새 창 크기에 맞게 조정
    };
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    // ===== 컴포넌트가 사라질 때 실행되는 정리 코드 =====
    return () => {
      window.removeEventListener("mousemove", handleMouseMove); // 마우스 이벤트 제거
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("resize", handleResize); // 리사이즈 이벤트 제거
      
      // DOM 요소 안전하게 제거
      if (currentContainer && renderer.domElement) {
        currentContainer.removeChild(renderer.domElement); // DOM에서 렌더러 제거
      }
      
      // Three.js 자원 해제
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []); // useEffect는 처음 렌더링될 때 한 번만 실행

  // 14. 줌(스크롤)을 위한 별도의 useEffect (컴포넌트 최상위 레벨)
  useEffect(() => {
    // 15. 이 훅은 Ref의 값만 변경합니다.
    // 줌 아웃(true)시 500, 줌 인(false)시 300으로 설정
    if (isZoomed) { // 줌 아웃 (true)
      targetCameraZRef.current = 500; 
    } else { // 줌 인 (false)
      targetCameraZRef.current = 420;
    }
  }, [isZoomed]); // isZoomed prop이 변경될 때만 실행됩니다.


  // ===== three.js 캔버스를 표시할 HTML 요소 반환 =====
  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}