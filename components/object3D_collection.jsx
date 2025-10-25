"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// 구성 요소 개요
// ---------------------------------------------------------------------------
// 이 파일은 120개의 3D 오브젝트를 하나의 WebGL 캔버스에서 그리드 형태로 렌더링합니다.
// - 각 오브젝트는 고유한 THREE.Scene, THREE.Camera, pivot 그룹을 갖습니다.
// - 모든 씬은 하나의 WebGLRenderer로 렌더되며, 셀 단위로 viewport/scissor를 설정합니다.
// - 사용자가 셀을 드래그하면 해당 오브젝트만 회전합니다.
// - 화면 크기에 맞춰 셀 크기를 계산하여 120개 오브젝트를 한눈에 보여 줍니다.

// ---------------------------------------------------------------------------
// 1. 렌더링 기본 상수
// ---------------------------------------------------------------------------

// 사용할 기하학 타입 목록
const SHAPE_TYPES = ["box", "sphere", "cone"];

// 사용할 머티리얼 색상 목록
const COLORS = ["#004AFF", "#3374FF", "#6699FF", "#99BFFF"];

// 한 줄에 표시할 셀 수 (12 × 10 = 120개 배치)
const GRID_COLUMNS = 12;

// 셀 사이 여백 (px 단위)
const GRID_GAP = 16;

// 컨테이너 안쪽 여백 (px 단위)
const CONTAINER_PADDING = 24;

// 셀의 최소 크기 (너무 작아지는 것을 방지)
const MIN_CELL_SIZE = 40;

// ---------------------------------------------------------------------------
// 2. 데이터 생성 유틸
// ---------------------------------------------------------------------------

// 기본 데이터: 120개의 아이템을 생성하고 도형/색상을 순환 배치
const baseItems = Array.from({ length: 120 }, (_, index) => ({
  id: `pivot-object-${index + 1}`, // React key 및 식별자로 사용할 고유 ID
  shape: SHAPE_TYPES[index % SHAPE_TYPES.length], // 3종 도형 순환
  color: COLORS[index % COLORS.length], // 4종 색상 순환
}));

// 장면 공통 조명 세트 생성
const createLights = () => {
  // 조명들을 그룹으로 묶어 한 번에 장면에 추가
  const lights = new THREE.Group();

  // AmbientLight: 전체적으로 은은한 빛을 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

  // DirectionalLight: 특정 방향에서 오는 강한 빛, 하이라이트 연출
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 7.5); // 광원 위치 지정

  lights.add(ambientLight);
  lights.add(directionalLight);

  return lights;
};

// shape 타입에 따라 기하학과 머티리얼을 조합한 Mesh 생성
const createShape = (shape, color) => {
  // 금속성/거칠기를 적당히 준 표준 머티리얼 생성
  const material = new THREE.MeshStandardMaterial({
    color: new THREE.Color(color),
    metalness: 0.3,
    roughness: 0.6,
  });

  // shape 타입에 따라 다른 Geometry 사용
  let geometry;
  switch (shape) {
    case "sphere":
      geometry = new THREE.SphereGeometry(1, 32, 16);
      break;
    case "cone":
      geometry = new THREE.ConeGeometry(1, 1.5, 32);
      break;
    case "box":
    default:
      geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      break;
  }

  // Geometry + Material 조합으로 Mesh 반환
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
};

// 각 셀에서 사용할 독립적인 3D 인스턴스를 생성
const createObjectInstance = (config) => {
  // 셀마다 자체적인 Scene을 구성 (독립적인 그래프 유지)
  const scene = new THREE.Scene();

  // 오브젝트 회전의 기준이 되는 Group (pivot)
  const pivot = new THREE.Group();

  // 정투영 카메라보다 자연스러운 원근감을 위해 PerspectiveCamera 사용
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
  camera.position.z = 5; // 기본 카메라 위치 (피벗을 바라보는 위치)

  // 요청받은 도형과 색상으로 Mesh 준비
  const shape = createShape(config.shape, config.color);

  // 조명 세트를 생성하여 장면에 추가
  const lights = createLights();

  // 피벗 그룹에 Mesh 추가 후 Scene에 피벗/조명 모두 등록
  pivot.add(shape);
  scene.add(pivot);
  scene.add(lights);

  // 셀 인스턴스가 관리해야 하는 상태 묶음
  return {
    id: config.id, // 식별자 (드래그/렌더링 매칭에 사용)
    scene, // 각 셀에서 렌더할 THREE.Scene
    pivot, // 회전 대상 그룹 (모든 Mesh가 pivot 아래에 위치)
    camera, // 셀 전용 카메라
    rotation: { x: 0, y: 0 }, // 현재 회전 상태 (드래그로 갱신)
    isDragging: false, // 드래그 여부 플래그
    pointerId: null, // 현재 포인터 ID (멀티포인터 대비)
    prevPointer: { x: 0, y: 0 }, // 이전 포인터 좌표 (회전 델타 계산용)
    dispose: () => {
      // Geometry/Material/Scene을 정리하여 메모리 누수 방지
      shape.geometry.dispose();
      shape.material.dispose();
      scene.clear();
    },
  };
};

// ---------------------------------------------------------------------------
// 3. 메인 컴포넌트
// ---------------------------------------------------------------------------

const Object3DCollection = ({ items }) => {
  // -----------------------------------------------------------------------
  // DOM 및 Three.js 객체에 대한 ref
  // -----------------------------------------------------------------------

  const containerRef = useRef(null); // 전체 그리드 컨테이너 DOM
  const canvasRef = useRef(null); // 공용 WebGL 캔버스 DOM
  const rendererRef = useRef(null); // THREE.WebGLRenderer 인스턴스

  const objectsRef = useRef([]); // 렌더 순서를 유지하는 인스턴스 배열
  const objectMapRef = useRef(new Map()); // id → 인스턴스 매핑 (빠른 조회)

  const animationRef = useRef(null); // requestAnimationFrame 핸들

  const cellLayoutsRef = useRef([]); // 셀 레이아웃 캐싱
  const layoutDirtyRef = useRef(true); // 레이아웃 재계산 필요 여부

  const cellSizeRef = useRef(60); // 현재 셀 크기 (ref, 즉시 접근용)
  const layoutMetaRef = useRef({
    rows: 0,
    gridLeft: 0,
    gridTop: 0,
    cellSize: 60,
    span: 60 + GRID_GAP,
    itemIds: [],
  });

  // -----------------------------------------------------------------------
  // 렌더할 아이템 목록 (props 우선, 없으면 기본 데이터)
  // -----------------------------------------------------------------------

  const renderItems = useMemo(
    () => (items?.length ? items : baseItems),
    [items]
  );

  // 각 셀 DOM을 수집하여 레이아웃 계산 시 사용
  const markLayoutDirty = useCallback(() => {
    layoutDirtyRef.current = true;
  }, []);

  // -----------------------------------------------------------------------
  // 4. 사용자 인터랙션 (포인터 드래그)
  // -----------------------------------------------------------------------

  const findInstanceAtPointer = useCallback((event) => {
    const container = containerRef.current;
    const meta = layoutMetaRef.current;
    if (!container || !meta || !meta.itemIds.length) return null;

    const rect = container.getBoundingClientRect();
    const pointerX = event.clientX - rect.left;
    const pointerY = event.clientY - rect.top;

    const localX = pointerX - meta.gridLeft;
    const localY = pointerY - meta.gridTop;
    if (localX < 0 || localY < 0) return null;

    const col = Math.floor(localX / meta.span);
    const row = Math.floor(localY / meta.span);
    if (col < 0 || col >= GRID_COLUMNS || row < 0 || row >= meta.rows) return null;

    const withinCol = localX - col * meta.span;
    const withinRow = localY - row * meta.span;
    if (withinCol > meta.cellSize || withinRow > meta.cellSize) return null;

    const index = row * GRID_COLUMNS + col;
    const itemId = meta.itemIds[index];
    if (!itemId) return null;

    const instance = objectMapRef.current.get(itemId);
    if (!instance) return null;

    return { instance, index };
  }, []);

  // 포인터가 셀을 누를 때: 해당 인스턴스에 드래그 상태 설정
  const handlePointerDown = useCallback(
    (event) => {
      const hit = findInstanceAtPointer(event);
      if (!hit) return;

      const instance = hit.instance;
      instance.isDragging = true;
      instance.pointerId = event.pointerId;
      instance.prevPointer = { x: event.clientX, y: event.clientY }; // 델타 계산 기준점

      event.currentTarget.setPointerCapture(event.pointerId); // 캔버스 컨테이너에 포인터 캡처
      event.currentTarget.style.cursor = "grabbing"; // 시각적 피드백
    },
    [findInstanceAtPointer]
  );

  // 포인터 이동 시: 이전 좌표와의 차이를 회전 값으로 누적
  const handlePointerMove = useCallback((event) => {
    const instance = objectsRef.current.find(
      (inst) => inst.pointerId === event.pointerId && inst.isDragging
    );
    if (!instance) {
      return;
    }

    const deltaX = event.clientX - instance.prevPointer.x; // 좌우 이동량
    const deltaY = event.clientY - instance.prevPointer.y; // 상하 이동량

    instance.rotation.y += deltaX * 0.01; // yaw 회전 (좌우)
    instance.rotation.x += deltaY * 0.01; // pitch 회전 (상하)
    instance.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, instance.rotation.x)); // 상하 회전 제한

    instance.prevPointer = { x: event.clientX, y: event.clientY }; // 기준점 업데이트
  }, []);

  // 포인터 캡처를 해제하고 드래그 상태를 초기화
  const releasePointer = useCallback((instance, target, pointerId) => {
    if (!instance) return;
    instance.isDragging = false;
    instance.pointerId = null;

    try {
      target?.releasePointerCapture(pointerId);
    } catch (e) {
      // 캡처가 이미 해제된 경우 무시
    }

    if (target) {
      target.style.cursor = "grab";
    }
  }, []);

  // 포인터가 셀에서 떨어질 때 드래그 종료 처리
  const handlePointerUp = useCallback(
    (event) => {
      const instance = objectsRef.current.find(
        (inst) => inst.pointerId === event.pointerId
      );
      if (!instance) return;
      releasePointer(instance, event.currentTarget, event.pointerId);
    },
    [releasePointer]
  );

  // -----------------------------------------------------------------------
  // 5. 렌더링 사이클 관리
  // -----------------------------------------------------------------------

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return; // 필수 요소가 없으면 초기화 중단

    let disposed = false; // 정리 단계 감지용 플래그

    // ----------------------------
    // 5-1. WebGLRenderer 생성
    // ----------------------------
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 고해상도 대응
    renderer.setClearColor(0x000000, 0); // 배경 투명
    renderer.autoClear = false; // 수동으로 clear 제어 (셀 별 렌더링을 위해)
    rendererRef.current = renderer;

    // ----------------------------
    // 5-2. 오브젝트 인스턴스 초기화
    // ----------------------------
    objectMapRef.current = new Map();
    objectsRef.current = renderItems.map((config) => {
      const instance = createObjectInstance(config);
      objectMapRef.current.set(config.id, instance);
      return instance;
    });
    layoutDirtyRef.current = true;

    // ----------------------------
    // 5-3. 레이아웃 계산 함수
    // ----------------------------
    const updateLayouts = () => {
      const containerRect = container.getBoundingClientRect();
      const rows = Math.max(1, Math.ceil(renderItems.length / GRID_COLUMNS)); // 필요한 행 수 계산

      // 뷰포트 전체 크기 기준으로 사용할 수 있는 너비/높이 계산
      const availableWidth = Math.max(
        containerRect.width - CONTAINER_PADDING * 2,
        GRID_COLUMNS * MIN_CELL_SIZE + (GRID_COLUMNS - 1) * GRID_GAP
      );
      const availableHeight = Math.max(
        containerRect.height - CONTAINER_PADDING * 2,
        rows * MIN_CELL_SIZE + (rows - 1) * GRID_GAP
      );

      // 실제 셀에 할당할 수 있는 폭/높이 계산
      const widthForCells = availableWidth - (GRID_COLUMNS - 1) * GRID_GAP;
      const heightForCells = availableHeight - (rows - 1) * GRID_GAP;
      const nextCellSize = Math.max(
        MIN_CELL_SIZE,
        Math.min(widthForCells / GRID_COLUMNS, heightForCells / rows)
      );

      // 셀 크기가 눈에 띄게 변하면 상태 업데이트 후 이번 프레임은 레이아웃 계산을 생략
      if (
        Number.isFinite(nextCellSize) &&
        Math.abs(nextCellSize - cellSizeRef.current) > 0.5
      ) {
        cellSizeRef.current = nextCellSize;
        layoutDirtyRef.current = true;
        return;
      }

      const innerWidth = containerRect.width - CONTAINER_PADDING * 2;
      const innerHeight = containerRect.height - CONTAINER_PADDING * 2;
      const totalWidth = GRID_COLUMNS * cellSizeRef.current + (GRID_COLUMNS - 1) * GRID_GAP;
      const totalHeight = rows * cellSizeRef.current + (rows - 1) * GRID_GAP;
      const startX = Math.max(0, (innerWidth - totalWidth) / 2);
      const startY = Math.max(0, (innerHeight - totalHeight) / 2);
      const gridLeft = CONTAINER_PADDING + startX;
      const gridTop = CONTAINER_PADDING + startY;
      const span = cellSizeRef.current + GRID_GAP;

      layoutMetaRef.current = {
        rows,
        gridLeft,
        gridTop,
        cellSize: cellSizeRef.current,
        span,
        itemIds: renderItems.map((item) => item.id),
      };

      cellLayoutsRef.current = renderItems.map((item, index) => {
        const row = Math.floor(index / GRID_COLUMNS);
        const col = index % GRID_COLUMNS;
        return {
          left: gridLeft + col * span,
          top: gridTop + row * span,
          width: cellSizeRef.current,
          height: cellSizeRef.current,
        };
      });
      layoutDirtyRef.current = false;
    };

    // ----------------------------
    // 5-4. 렌더 루프 정의
    // ----------------------------
    const renderFrame = () => {
      animationRef.current = requestAnimationFrame(renderFrame);
      if (disposed) return; // 정리 이후에는 렌더링 중단

      if (layoutDirtyRef.current) {
        updateLayouts(); // 레이아웃이 변경되었다면 먼저 재계산
      }

      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      // 렌더러 크기/클리어 설정
      renderer.setSize(containerWidth, containerHeight, false);
      renderer.setScissorTest(false);
      renderer.clear();
      renderer.setScissorTest(true);

      const pixelRatio = renderer.getPixelRatio();

      // 화면에 나타내야 하는 순서대로 렌더
      renderItems.forEach((item, index) => {
        const instance = objectMapRef.current.get(item.id);
        if (!instance) return;
        const layout = cellLayoutsRef.current[index];
        if (!layout || layout.width <= 0 || layout.height <= 0) return;

        // 셀이 화면 밖에 있으면 렌더 생략
        if (layout.top + layout.height < 0 || layout.top > containerHeight) return;

        // 카메라 종횡비와 회전 상태 갱신
        instance.camera.aspect = layout.width / layout.height;
        instance.camera.updateProjectionMatrix();

        if (!instance.isDragging) {
          // 드래그가 종료되면 천천히 원래 각도로 보간
          instance.rotation.x *= 0.92;
          instance.rotation.y *= 0.92;
        }
        instance.pivot.rotation.x = instance.rotation.x;
        instance.pivot.rotation.y = instance.rotation.y;

        // 현재 셀 영역을 렌더러 viewport/scissor로 설정
        const viewportLeft = layout.left * pixelRatio;
        const viewportBottom =
          (containerHeight - layout.top - layout.height) * pixelRatio;
        const viewportWidth = layout.width * pixelRatio;
        const viewportHeight = layout.height * pixelRatio;

        renderer.setViewport(viewportLeft, viewportBottom, viewportWidth, viewportHeight);
        renderer.setScissor(viewportLeft, viewportBottom, viewportWidth, viewportHeight);
        renderer.clearDepth(); // 깊이 버퍼 초기화 (셀 간 간섭 제거)

        renderer.render(instance.scene, instance.camera); // 실제 렌더링
      });
    };

    // ----------------------------
    // 5-5. 이벤트 리스너 등록
    // ----------------------------
    const resizeObserver = new ResizeObserver(markLayoutDirty);
    resizeObserver.observe(container); // 컨테이너 크기 변경 감지
    window.addEventListener("resize", markLayoutDirty); // 뷰포트 리사이즈 대응

    renderFrame(); // 렌더링 시작

    // ----------------------------
    // 5-6. 정리 함수
    // ----------------------------
    return () => {
      disposed = true;
      cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      window.removeEventListener("resize", markLayoutDirty);
      renderer.dispose();
      objectsRef.current.forEach((instance) => instance.dispose());
      objectsRef.current = [];
      objectMapRef.current.clear();
      cellLayoutsRef.current = [];
      layoutMetaRef.current = {
        rows: 0,
        gridLeft: 0,
        gridTop: 0,
        cellSize: cellSizeRef.current,
        span: cellSizeRef.current + GRID_GAP,
        itemIds: [],
      };
    };
  }, [renderItems, markLayoutDirty]);

  // -----------------------------------------------------------------------
  // 6. JSX 구성 (캔버스 + 그리드)
  // -----------------------------------------------------------------------

  return (
    <div
      className="object-grid-container"
      ref={containerRef}
      style={{
        position: "relative", // 캔버스와 그리드 위치 계산 기준
        width: "100%",
        height: "100vh", // 화면 높이를 가득 채워 120개가 모두 보이도록 확보
        padding: `${CONTAINER_PADDING}px`, // 그리드 주변 여백
        boxSizing: "border-box",
        overflow: "hidden", // 캔버스가 벗어나도 스크롤이 생기지 않도록 차단
      }}
    >
      <canvas
        ref={canvasRef}
        className="object-grid-canvas"
        style={{
          position: "absolute", // 그리드 아래에 깔기 위한 절대 위치
          top: 0,
          left: 0,
          zIndex: 0,
          pointerEvents: "none", // 사용자 인터랙션은 별도 레이어에서 처리
          width: "100%",
          height: "100%",
        }}
      />
      <div
        className="object-grid-interaction-layer"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onLostPointerCapture={handlePointerUp}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          cursor: "grab",
          touchAction: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 12,
          right: 16,
          zIndex: 2,
          padding: "6px 10px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontSize: 12,
          fontFamily: "monospace",
          pointerEvents: "none",
        }}
      >
        items: {renderItems.length}
      </div>
    </div>
  );
};

export default Object3DCollection;
