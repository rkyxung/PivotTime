"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

const DEFAULT_IDLE_CAMERA = { fov: 20, z: 5229 };
const DEFAULT_ACTIVE_CAMERA = { fov: 75, z: 1200 };
const DEFAULT_PIVOT_POSITION = { x: 0, y: 0, z: 0 };
const DEFAULT_PIVOT_SCALE = { x: 2.2, y: 2.2, z: 2.2 };

/**
 * 범용 3D 오브젝트 뷰어
 * - SVG를 로드해 라인 렌더링
 * - 마우스 드래그로 회전 및 카메라 줌 전환
 * - widthVW / heightVW 로 뷰포트 기준 크기 제어
 */
const Object3DItem = ({
  svgUrl,
  color = "#004AFF",
  widthVW = 15,
  heightVW = 15,
  idleCamera = DEFAULT_IDLE_CAMERA,
  activeCamera = DEFAULT_ACTIVE_CAMERA,
  pivotPosition = DEFAULT_PIVOT_POSITION,
  pivotScale = DEFAULT_PIVOT_SCALE,
  pointsPerSubPath = 200,
  className = "",
  style = {},
}) => {
  const mountRef = useRef(null);
  const isDraggingRef = useRef(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const previousMouseRef = useRef({ x: 0, y: 0 });
  const cameraStateRef = useRef(idleCamera);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount || !svgUrl) return;

    let animationFrameId = null;
    const scene = new THREE.Scene();

    const getCanvasSize = () => {
      const base = typeof window !== "undefined" ? window.innerWidth : 1920;
      return {
        width: (widthVW * base) / 100,
        height: (heightVW * base) / 100,
      };
    };

    const { width: canvasWidth, height: canvasHeight } = getCanvasSize();

    const camera = new THREE.PerspectiveCamera(
      cameraStateRef.current.fov,
      canvasWidth / canvasHeight,
      1,
      6000
    );
    camera.position.set(0, 0, cameraStateRef.current.z);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvasWidth, canvasHeight);
    currentMount.appendChild(renderer.domElement);

    const pivot = new THREE.Group();
    pivot.position.set(
      pivotPosition.x,
      pivotPosition.y,
      pivotPosition.z
    );
    pivot.scale.set(pivotScale.x, pivotScale.y, pivotScale.z);
    scene.add(pivot);

    const loader = new SVGLoader();
    loader.load(
      svgUrl,
      (data) => {
        const svgGroup = new THREE.Group();

        data.paths.forEach((path) => {
          const material = new THREE.LineBasicMaterial({
            color: new THREE.Color(color),
          });

          path.subPaths.forEach((subPath) => {
            const points = subPath.getPoints(pointsPerSubPath);
            if (!points.length) return;

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(geometry, material);
            line.rotation.x = Math.PI;
            svgGroup.add(line);
          });
        });

        const box = new THREE.Box3().setFromObject(svgGroup);
        const center = box.getCenter(new THREE.Vector3());
        svgGroup.position.sub(center);
        pivot.add(svgGroup);
      },
      undefined,
      (error) => {
        console.error(`SVG 로드 실패 (${svgUrl}):`, error);
      }
    );

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      previousMouseRef.current = { x: e.clientX, y: e.clientY };
      cameraStateRef.current = activeCamera;
      currentMount.style.cursor = "grabbing";
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      cameraStateRef.current = idleCamera;
      currentMount.style.cursor = "grab";
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - previousMouseRef.current.x;
      const deltaY = e.clientY - previousMouseRef.current.y;

      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;

      previousMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleResize = () => {
      const { width, height } = getCanvasSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

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

    currentMount.style.cursor = "grab";
    currentMount.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    animate();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mousemove", handleMouseMove);
      if (currentMount) {
        currentMount.removeEventListener("mousedown", handleMouseDown);
        while (currentMount.firstChild) {
          currentMount.removeChild(currentMount.firstChild);
        }
      }
      renderer.dispose();
      scene.traverse((child) => {
        if (child.isMesh || child.isLine) {
          child.geometry?.dispose();
          child.material?.dispose();
        }
      });
    };
  }, [
    activeCamera,
    heightVW,
    idleCamera,
    pivotPosition.x,
    pivotPosition.y,
    pivotPosition.z,
    pivotScale.x,
    pivotScale.y,
    pivotScale.z,
    pointsPerSubPath,
    svgUrl,
    widthVW,
    color,
  ]);

  return (
    <div
      ref={mountRef}
      className={className}
      style={{
        width: `${widthVW}vw`,
        height: `${heightVW}vw`,
        ...style,
      }}
    />
  );
};

export default Object3DItem;
