// components/BackgroundGrid.jsx

"use client";

import React from "react";
import "../styles/grid.scss"; // 경로 확인 필요

export default function BackgroundGrid() {
  const rows = 8; // 세로 8줄
  const cols = 8; // 가로 8칸

  const gridCells = Array.from({ length: rows * cols }, (_, i) => (
    <div key={i} className="grid-cell" />
  ));

  return (
    // ⚠️ HeroSection의 크기를 채우고, 넘치는 부분을 hidden 처리할 컨테이너
    <div className="background-grid-container">
      <div className="grid-overlay">
        {gridCells}
      </div>
    </div>
  );
}