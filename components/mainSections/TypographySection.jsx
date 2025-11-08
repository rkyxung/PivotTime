import "../../styles/mainSections/_typography.scss";
import { useEffect, useRef } from "react";

export default function TypographySection() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const sectionEl = sectionRef.current;
    const videoEl = videoRef.current;
    if (!sectionEl || !videoEl) return;

    // IntersectionObserver: 섹션이 30% 이상 보이면 재생, 아니면 일시정지/리셋
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.intersectionRatio >= 0.3) {
            // 보이기 시작하면 재생
            const playPromise = videoEl.play();
            if (playPromise && typeof playPromise.then === "function") {
              playPromise.catch(() => {});
            }
          } else {
            // 보이지 않으면 일시정지 후 처음으로
            videoEl.pause();
            videoEl.currentTime = 0;
          }
        });
      },
      { threshold: [0, 0.3, 1] }
    );

    observer.observe(sectionEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="typography" ref={sectionRef}>
      <div className="typo-video">
        <video
          ref={videoRef}
          src="/videos/typoVideo.mp4"
          loop
          muted
          playsInline
        />
      </div>
      <div className="txt-wrap">
        <div className="title">Typography</div>
        <p className="description">
          각 세부전공이 상징하는 기본 형태인 선, 원, 사각형을 기반으로, 열정이
          그려낸
          <br />
          궤적을 그리드 위에 구성했습니다. 알파벳은 하나의 경로처럼 구성되어
          있으며,
          <br />
          그리드 위를 따라 움직이는 선의 흐름을 우리의 열정이 지나간 흔적을
          보여줍니다.
        </p>
      </div>
    </div>
  );
}
