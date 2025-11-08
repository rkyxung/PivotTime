"use client";

import { useEffect, useState } from "react";
import { PIVOTTIME } from "../components/svgCode";
import Line3D from "../components/mainSections/3dKeyVisual/line3D";
import "../styles/countDown.scss";

const EVENT_START = new Date("2025-11-21T10:00:00+09:00");
const COUNTDOWN_CAMERA_DISTANCE = 520;
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

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeRemaining());
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const segments = [
    formatSegment(timeLeft.days),
    formatSegment(timeLeft.hours),
    formatSegment(timeLeft.minutes),
    formatSegment(timeLeft.seconds),
  ];

  return (
    <div className="d-day">
      <div className="delight">2025 DELIGHT INSIGHT</div>
      <div className="logo">
        <PIVOTTIME />
      </div>
      <div className="object">
        <Line3D cameraDistance={400} />
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
