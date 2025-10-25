"use client"; // Next.js 클라이언트 사이드 렌더링 활성화

import React, { useEffect, useRef } from "react"; // React 훅들 import
import * as THREE from "three"; // Three.js 3D 라이브러리
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'; // SVG 파일 로더

/**
 * Object3D_four 컴포넌트 - 다각형 패턴 3D 오브젝트
 * - SVG 파일을 로드하여 3D 라인으로 렌더링
 * - 마우스 드래그 시 회전 및 카메라 뷰 전환 인터랙션
 * - 반응형 크기 조정 지원
 */
const Object3D_four = () => {
  const mountRef = useRef(null); // 3D 렌더러가 마운트될 DOM 요소 참조

  // 인터랙션 상태를 관리하는 Ref들
  const isDraggingRef = useRef(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const cameraStateRef = useRef({ fov: 20, z: 5229 }); // 기본 상태 (크기 키움, 왜곡 없음)

  useEffect(() => {
    const currentMount = mountRef.current; // 현재 마운트 요소 참조
    if (!currentMount) return;

    const scene = new THREE.Scene(); // 3D 씬 생성

    // ===== 캔버스 크기 설정 =====
    const canvasWidth = (40 * window.innerWidth) / 100;
    const canvasHeight = (50 * window.innerWidth) / 100;

    // ===== 원근 카메라 설정 =====
    const camera = new THREE.PerspectiveCamera(
      cameraStateRef.current.fov,
      canvasWidth / canvasHeight,
      1, 3000 * 2
    );
    camera.position.set(0, 0, cameraStateRef.current.z);

    // ===== WebGL 렌더러 설정 =====
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(canvasWidth, canvasHeight);
    currentMount.appendChild(renderer.domElement);

    // ===== Pivot 및 SVG 오브젝트 로드 =====
    const pivot = new THREE.Group();
    scene.add(pivot);
    pivot.position.set(-200, 200, 0);
    pivot.scale.set(1.5, 1.5, 1.5);

    const loader = new SVGLoader();
    loader.load("/objects/object04.svg", (data) => {
      const svgGroup = new THREE.Group();
      data.paths.forEach((path) => {
        const points = path.subPaths[0].getPoints(200);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: new THREE.Color("#004AFF"),
        });
        const line3D = new THREE.Line(geometry, material);
        line3D.rotation.x = Math.PI;
        svgGroup.add(line3D);
      });
      const box = new THREE.Box3().setFromObject(svgGroup);
      const center = box.getCenter(new THREE.Vector3());
      svgGroup.position.sub(center);
      pivot.add(svgGroup);
    });

    // ===== 마우스 드래그 인터랙션 핸들러 =====
    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      cameraStateRef.current = { fov: 75, z: 1200 }; // 3D 뷰로 전환 (크기 유지)
      currentMount.style.cursor = 'grabbing';
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      cameraStateRef.current = { fov: 20, z: 5229 }; // 2D 뷰로 복귀 (크기 유지)
      currentMount.style.cursor = 'grab';
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;

      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;

      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    currentMount.style.cursor = 'grab';
    currentMount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    // ===== 애니메이션 루프 함수 =====
    const animate = () => {
      requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        rotationRef.current.x *= 0.95;
        rotationRef.current.y *= 0.95;
      }

      pivot.rotation.x = rotationRef.current.x;
      pivot.rotation.y = rotationRef.current.y;

      camera.fov += (cameraStateRef.current.fov - camera.fov) * 0.05;
      camera.position.z += (cameraStateRef.current.z - camera.position.z) * 0.05;
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    };
    animate();

    // ===== 윈도우 리사이즈 이벤트 핸들러 =====
    const handleResize = () => {
      const newCanvasWidth = (40 * window.innerWidth) / 100;
      const newCanvasHeight = (50 * window.innerWidth) / 100;
      camera.aspect = newCanvasWidth / newCanvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newCanvasWidth, newCanvasHeight);
    };
    window.addEventListener("resize", handleResize);

    // ===== 클린업 함수 =====
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentMount) {
        currentMount.removeEventListener("mousedown", handleMouseDown);
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // ===== JSX 렌더링 =====
  return <div ref={mountRef} style={{ width: "40vw", height: "50vw" }} />;
};

export default Object3D_four;