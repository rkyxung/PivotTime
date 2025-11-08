"use client";

import { useEffect, useState } from "react";
import { PIVOTTIME } from "../components/svgCode";
import Line3D from "../components/mainSections/3dKeyVisual/line3D";
import "../styles/countDown.scss";

const EVENT_START = new Date("2025-11-21T10:00:00+09:00");
const COUNTDOWN_CAMERA_DISTANCE = 520;
const COUNTDOWN_CAMERA_DISTANCE_MOBILE = 450;
const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;

const getTimeRemaining = () => {
  const now = Date.now();
  const target = EVENT_START.getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / MS_IN_DAY);
  const hours = Math.floor((diff % MS_IN_DAY) / MS_IN_HOUR);
  const minutes = Math.floor((diff % MS_IN_HOUR) / MS_IN_MINUTE);
  const seconds = Math.floor((diff % MS_IN_MINUTE) / MS_IN_SECOND);

  return { days, hours, minutes, seconds };
};

const formatSegment = (value) => String(value).padStart(2, "0");

export default function CountDown() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeRemaining());
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const updateMatch = (event) => setIsMobile(event.matches);

    // 초기 상태 동기화
    setIsMobile(mediaQuery.matches);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", updateMatch);
    } else {
      mediaQuery.addListener(updateMatch);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", updateMatch);
      } else {
        mediaQuery.removeListener(updateMatch);
      }
    };
  }, []);

  const segments = [
    formatSegment(timeLeft.days),
    formatSegment(timeLeft.hours),
    formatSegment(timeLeft.minutes),
    formatSegment(timeLeft.seconds),
  ];

  const cameraDistance = isMobile
    ? 650
    : 400;

  return (
    <div className="d-day">
      <img className="webImage" src="/images/mobile.png" alt="mobile.png" />
      <div className="delight">2025 DELIGHT INSIGHT</div>
      <div className="logo">
        <PIVOTTIME />
      </div>
      <div className="object">
        <Line3D cameraDistance={cameraDistance} />
      </div>
      <div className="countDown" role="timer" aria-live="polite">
        {segments.map((value, index) => (
          <div className="countDown-segment" key={`segment-${index}`}>
            <span className="countDown-value">{value}</span>
            {index < segments.length - 1 && (
              <span className="countDown-colon" aria-hidden="true">
                :
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="info">
        <p>
          Kaywon University of Arts & Design
          <br /> 32nd Delight Insight
        </p>
        <p>
          66 Kaywondaehangno, Uiwang-si, Gyeonggi-do, Korea
          <br /> ©2025. Delight Insight PIVOTTIME All Right Reserved.
        </p>
        <p>
          Kaywon Design Hall 5F
          <br /> Nov. 21. FRI - Nov. 23. SUN
        </p>
      </div>
    </div>
  );
}
