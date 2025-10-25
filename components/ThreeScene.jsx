// 클라이언트 환경에서만 실행되도록 지정
"use client";

// React의 useEffect(렌더링 이후 실행용), useRef(DOM 요소를 직접 제어하기 위한 참조용) 불러오기
import { useEffect, useRef } from "react";

// three.js의 모든 기능을 불러옴 (3D 장면, 카메라, 오브젝트, 재질 등)
import * as THREE from "three";

// GSAP(자바스크립트 애니메이션 전용 라이브러리) 불러오기
import { gsap } from "gsap";

// ThreeScene 컴포넌트를 정의 (3D 장면을 생성하고 렌더링하는 역할)
export default function ThreeScene() {
  // three.js가 생성한 캔버스를 붙일 HTML 요소를 가리키는 참조 생성
  const containerRef = useRef(null);

  // 컴포넌트가 처음 렌더링될 때 한 번만 실행되는 부분
  useEffect(() => {
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
    camera.position.set(0, 0, 500); // 카메라를 Z축 방향으로 뒤로 이동시켜 장면 전체를 볼 수 있게 설정

    // ===== 렌더러(WebGLRenderer) 설정 =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true, // 가장자리를 부드럽게 처리
      alpha: true, // 배경을 투명하게 설정
    });

    renderer.setSize(canvasWidth, canvasHeight); // 렌더러의 출력 크기를 현재 화면 크기에 맞게 설정
    renderer.setClearColor(0x000000, 1); // 배경색을 검정으로 설정
    containerRef.current.appendChild(renderer.domElement); // 렌더러가 생성한 캔버스를 HTML에 추가

    // ===== 3D 오브젝트 그룹 생성 =====
    const objectGroup = new THREE.Group(); // 여러 오브젝트를 하나로 묶기 위한 그룹 생성
    scene.add(objectGroup); // 그룹을 장면에 추가

    // ===== 가로 원을 세로로 회전시켜 가로축 기준으로 회전시키는 구조 생성 =====
    const R = 150; // 궤적(큰 원)의 반지름 설정
    const r = 150; // 작은 원(프로필 원)의 반지름 설정

    const lineCount = 34; // 궤적을 구성할 선의 개수 (값이 많을수록 촘촘하게 표현됨)

    const material = new THREE.LineBasicMaterial({
      color: 0x004aff, // 선 색상 파란색 지정
      transparent: true, // 투명도 설정 가능하도록 활성화
      opacity: 0.3, // 선의 투명도 설정
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
    const geometry = new THREE.BufferGeometry().setFromPoints(circlePoints); // 계산된 점들을 이용해 원형 선 지오메트리 생성

    // ===== 궤적을 구성할 선 생성 =====
    for (let i = 0; i < lineCount; i++) {
      const line = new THREE.Line(geometry, material); // 원형 라인을 생성하고 재질 적용
      line.position.y = R; // 선을 위로 이동시켜 중심축을 기준으로 회전할 수 있게 설정
      const pivot = new THREE.Group(); // 회전 기준이 될 피벗 그룹 생성
      pivot.add(line); // 피벗에 선 추가
      const angle = (i / lineCount) * Math.PI * 2; // 회전 각도를 계산
      pivot.rotation.x = angle; // 각 선을 X축 기준으로 회전시켜 원 궤적 배치
      objectGroup.add(pivot); // 피벗 그룹을 메인 오브젝트 그룹에 추가
    }

    // ===== 오브젝트 그룹 전체를 가로 방향으로 눕히기 =====
    objectGroup.rotation.z = Math.PI / 2; // 그룹 전체를 Z축 기준으로 90도 회전시켜 가로로 눕힘

    // ===== 마우스 움직임에 따라 회전할 목표값 초기화 =====
    let targetX = 0; // X축 목표 회전값
    let targetY = 0; // Y축 목표 회전값
    let targetZ = objectGroup.rotation.z; // Z축 회전값은 초기 90도로 고정

    // ===== 마우스 움직임 감지 함수 정의 =====
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1; // 마우스의 X좌표를 -1~1 범위로 정규화
      const y = (e.clientY / window.innerHeight) * 2 - 1; // 마우스의 Y좌표를 -1~1 범위로 정규화
      targetY = x * Math.PI; // 마우스 좌우 움직임으로 Y축 회전값 설정
      targetX = y * Math.PI * -1; // 마우스 상하 움직임으로 X축 회전값 설정
    };
    window.addEventListener("mousemove", handleMouseMove); // 마우스 이동 이벤트 등록

    // ===== 애니메이션 함수 정의 =====
    const animate = () => {
      requestAnimationFrame(animate); // 매 프레임마다 animate 함수 반복 실행
      gsap.to(objectGroup.rotation, {
        x: targetX, // 목표 X축 회전값으로 애니메이션
        y: targetY, // 목표 Y축 회전값으로 애니메이션
        z: targetZ, // Z축 회전값은 고정 유지
        duration: 1, // 애니메이션 지속 시간
        ease: "power2.out", // 감속 애니메이션 적용
      });
      renderer.render(scene, camera); // 현재 장면을 카메라 시점에서 렌더링
    };

    animate(); // 애니메이션 실행 시작

    // ===== 창 크기 변경 시 반응형 처리 =====
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight; // 카메라의 종횡비를 새 창 크기에 맞게 조정
      camera.updateProjectionMatrix(); // 카메라 투영 행렬 업데이트
      renderer.setSize(window.innerWidth, window.innerHeight); // 렌더러 크기도 새 창 크기에 맞게 조정
    };
    window.addEventListener("resize", handleResize); // 창 크기 변경 이벤트 등록

    // ===== 컴포넌트가 사라질 때 실행되는 정리 코드 =====
    return () => {
      window.removeEventListener("mousemove", handleMouseMove); // 마우스 이벤트 제거
      window.removeEventListener("resize", handleResize); // 리사이즈 이벤트 제거
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement); // DOM에서 렌더러 제거
      }
      renderer.dispose(); // 렌더러 자원 해제
    };
  }, []); // useEffect는 처음 렌더링될 때 한 번만 실행

  // ===== three.js 캔버스를 표시할 HTML 요소 반환 =====
  return <div ref={containerRef} style={{ width: "100vw", height: "100vh" }} />;
}
