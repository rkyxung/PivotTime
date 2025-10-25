// 클라이언트 환경에서만 실행되도록 지정
"use client";

// React의 useEffect(렌더링 이후 실행용), useRef(DOM 요소 참조용) 불러오기
import { useEffect, useRef } from "react";

// three.js의 모든 기능 불러오기 (3D 그래픽 구현용)
import * as THREE from "three";

// GSAP(자바스크립트 기반 애니메이션 라이브러리) 불러오기
import { gsap } from "gsap";

// Main3DObject 컴포넌트를 정의 (3D 오브젝트를 렌더링하는 역할)
export default function Main3DObject() {
  // three.js가 만든 캔버스를 붙일 HTML 요소를 가리키는 참조 생성
  const containerRef = useRef(null);

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 부분
  useEffect(() => {
    // ===== Scene(3D 공간 역할) 생성 =====
    const scene = new THREE.Scene(); // 모든 3D 오브젝트를 담는 무대 역할의 Scene 생성

    // ===== 캔버스 컨테이너의 크기 가져오기 =====
    const canvasEl = containerRef.current;
    if (!canvasEl) return undefined;

    // 렌더러를 새로 붙이기 전에 기존 자식(이전 캔버스)을 모두 제거
    while (canvasEl.firstChild) {
      canvasEl.removeChild(canvasEl.firstChild);
    }

    const canvasWidth = canvasEl.clientWidth; // 현재 컨테이너의 너비를 가져옴
    const canvasHeight = canvasEl.clientHeight; // 현재 컨테이너의 높이를 가져옴

    // ===== 원근 카메라(Perspective Camera) 설정 =====
    const camera = new THREE.PerspectiveCamera(
      75, // 시야각(FOV)
      canvasWidth / canvasHeight, // 종횡비(가로/세로 비율)
      0.1, // 가까운 클리핑 평면 (이 거리보다 가까운 객체는 보이지 않음)
      3000 // 먼 클리핑 평면 (이 거리보다 먼 객체는 보이지 않음)
    );
    camera.position.set(0, 0, 500); // 카메라를 Z축 방향으로 뒤로 이동시켜 전체 장면을 볼 수 있게 함

    // ===== WebGL 렌더러 생성 및 설정 =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 가장자리를 부드럽게 처리
      alpha: true, // 배경 투명 활성화
    });

    renderer.setSize(canvasWidth, canvasHeight); // 렌더러의 크기를 컨테이너 크기에 맞게 설정
    renderer.setClearColor(0x000000, 0); // 배경색을 투명(알파값 0)으로 설정
    canvasEl.appendChild(renderer.domElement); // 렌더러가 생성한 캔버스를 DOM에 추가

    // ===== 3D 오브젝트 그룹 생성 =====
    const objectGroup = new THREE.Group(); // 여러 개의 선들을 하나의 그룹으로 묶기 위한 그룹 생성
    scene.add(objectGroup); // 그룹을 장면(Scene)에 추가

    // ===== ‘가로 원’을 ‘세로로 회전’시켜 가로축을 중심으로 도는 구조 생성 =====
    const R = 150; // 궤적(큰 원)의 반지름 설정
    const r = 150; // 원을 구성하는 작은 원의 반지름 설정

    const lineCount = 32; // 궤적을 구성할 선의 개수 (값이 많을수록 촘촘하게 표현됨)

    const material = new THREE.LineBasicMaterial({
      color: 0x004aff, // 선 색상 파란색 설정
      transparent: true, // 투명도 조정 가능하게 설정
      opacity: 0.7, // 선의 투명도 설정
    });

    // ===== 단일 원(기본 프로필 원형) 정의 =====
    const circlePoints = []; // 원을 구성할 점 좌표를 담을 배열
    const segments = 64; // 원을 구성할 세분화 정도 (값이 클수록 원이 매끄러워짐)
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2; // 각 점의 각도 계산
      circlePoints.push(
        new THREE.Vector3(
          r * Math.cos(theta), // X 좌표 계산 (cos)
          r * Math.sin(theta), // Y 좌표 계산 (sin)
          0 // Z 좌표는 0 (2D 평면상 원)
        )
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(circlePoints); // 계산된 점들로 라인 지오메트리 생성

    // ===== 궤적 생성 (선 여러 개를 회전시켜 토러스 형태 만들기) =====
    for (let i = 0; i < lineCount; i++) {
      const line = new THREE.Line(geometry, material); // 원형 라인 생성 및 재질 적용
      line.position.y = R; // 각 선을 중심축 기준으로 위로 이동
      const pivot = new THREE.Group(); // 회전 중심 역할을 하는 그룹 생성
      pivot.add(line); // 피벗 그룹에 라인 추가
      const angle = (i / lineCount) * Math.PI * 2; // 각 선의 회전 각도 계산
      pivot.rotation.x = angle; // 각 라인을 X축 기준으로 회전시켜 토러스 형태로 배치
      objectGroup.add(pivot); // 완성된 피벗 그룹을 메인 오브젝트 그룹에 추가
    }

    // ===== 오브젝트 그룹 전체를 가로 방향으로 회전 =====
    objectGroup.rotation.z = Math.PI / 2; // 그룹 전체를 Z축 기준으로 90도 회전시켜 가로 방향으로 배치

    // ===== 마우스 움직임에 따른 회전값 초기화 =====
    let targetX = 0; // X축 회전 목표값
    let targetY = 0; // Y축 회전 목표값
    let targetZ = objectGroup.rotation.z; // Z축 회전값은 90도로 고정

    // ===== 마우스 움직임 감지 함수 정의 =====
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // 마우스의 X좌표를 -1~1 범위로 정규화
      const y = (e.clientY / window.innerHeight) * 2 - 1; // 마우스의 Y좌표를 -1~1 범위로 정규화
      targetY = x * Math.PI; // 마우스 좌우 움직임으로 Y축 회전값 설정
      targetX = y * Math.PI * -1; // 마우스 상하 움직임으로 X축 회전값 설정
    };
    canvasEl.addEventListener("mousemove", handleMouseMove); // 마우스 이벤트를 캔버스 컨테이너에 등록

    // ===== 애니메이션 함수 정의 =====
    const animate = () => {
      requestAnimationFrame(animate); // 매 프레임마다 반복 실행

      gsap.to(objectGroup.rotation, {
        x: targetX, // 목표 X축 회전값으로 부드럽게 이동
        y: targetY, // 목표 Y축 회전값으로 부드럽게 이동
        z: targetZ, // Z축 회전값은 90도로 고정
        duration: 1, // 애니메이션 지속 시간 1초
        ease: "power2.out", // 감속 애니메이션 적용
      });

      renderer.render(scene, camera); // 장면(Scene)을 카메라 시점에서 렌더링
    };

    animate(); // 애니메이션 시작

    // ===== 창 크기 변경 시 반응형 처리 =====
    const handleResize = () => {
      const newWidth = canvasEl.clientWidth; // 새 컨테이너 너비 가져오기
      const newHeight = canvasEl.clientHeight; // 새 컨테이너 높이 가져오기
      camera.aspect = newWidth / newHeight; // 카메라 종횡비를 새 크기에 맞게 조정
      camera.updateProjectionMatrix(); // 카메라 투영 행렬 업데이트
      renderer.setSize(newWidth, newHeight); // 렌더러 크기 재설정
    };
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    // ===== 컴포넌트가 사라질 때 실행되는 정리 코드 =====
    return () => {
      canvasEl.removeEventListener("mousemove", handleMouseMove); // 마우스 이벤트 제거
      window.removeEventListener("resize", handleResize); // 리사이즈 이벤트 제거
      if (canvasEl && renderer.domElement && renderer.domElement.parentElement === canvasEl) {
        canvasEl.removeChild(renderer.domElement); // DOM에서 렌더러 캔버스 제거
      }
      // WebGL 컨텍스트를 명시적으로 해제하여 누적 방지
      if (typeof renderer.forceContextLoss === "function") {
        renderer.forceContextLoss();
      } else {
        const gl = renderer.getContext();
        gl?.getExtension?.("WEBGL_lose_context")?.loseContext();
      }
      renderer.dispose(); // 렌더러 자원 해제
    };
  }, []); // useEffect는 처음 렌더링 시 한 번만 실행됨

  // ===== three.js 캔버스를 표시할 HTML 요소 반환 =====
  // 부모 컨테이너(#canvas-container)에 맞게 꽉 채우고, 화면 상단에 고정
  return (
    <div
      ref={containerRef}
      style={{
        width: "100%", // 부모 컨테이너 너비에 맞춤
        height: "100%", // 부모 컨테이너 높이에 맞춤
        position: "absolute", // 절대 위치로 상단 고정
        top: 0, // 상단 여백 0
        left: 0, // 좌측 여백 0
      }}
    />
  );
}
