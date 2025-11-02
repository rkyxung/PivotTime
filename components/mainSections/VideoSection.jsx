"use client";

import { useEffect, useRef, useState } from "react";
import "../../styles/mainSections/_video.scss";

export default function VideoSection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isVisible) {
            setIsVisible(true);
          }
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise?.catch) {
        playPromise.catch(() => {
          /* ignore autoplay block */
        });
      };
    }
  }, [isVisible]);

  return (
    <div
      ref={sectionRef}
      className={`video ${isVisible ? "is-visible" : ""}`}
    >
      <video
        ref={videoRef}
        className="video__player"
        src="/videos/mainVideo.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
