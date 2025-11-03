"use client";
import { useEffect, useRef } from "react"; // 1. useRef 임포트 확인
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import "../styles/main.scss";

import Nav from "../components/nav";
import HeroSection from "../components/mainSections/HeroSection";
import VideoSection from "../components/mainSections/VideoSection";
import KeywordsSection from "../components/mainSections/KeywordsSection";
import ConceptSection from "../components/mainSections/conceptSection";
import VisualSection from "../components/mainSections/VisualSection";
// import TypographySection from "../components/mainSections/TypographySection";
// import SloganSection from "../components/mainSections/SloganSection";
// import MainFooterSection from "../components/mainSections/MainFooterSection";

gsap.registerPlugin(ScrollTrigger, Observer, ScrollToPlugin);

export default function Main() {
  const mainRef = useRef(null);
  const obs = useRef(null); // 2. Observer를 ref로 관리

  useEffect(() => {
    const scroller = mainRef.current.querySelector(".snap-container");
    const sections = gsap.utils.toArray(".snap-section");
    let isAnimating = false;
    let currentSection = 0;

    const goToSection = (index, direction) => {
      // Debounce
      if (isAnimating) return;

      isAnimating = true;
      currentSection = index;

      gsap.to(scroller, {
        scrollTo: { y: sections[index].offsetTop, autoKill: false },
        duration: 1.2,
        ease: "power2.inOut",
        onComplete: () => {
          isAnimating = false;
        },
      });
    };

    // 3. Observer 인스턴스를 ref에 할당
    obs.current = Observer.create({
      target: window,
      type: "wheel,touch,pointer",

      onUp: (self) => {
        if (isAnimating || !self.isEnabled) return;

        if (currentSection === 0) {
          return;
        }

        self.event.preventDefault();
        const prevSection = currentSection - 1;
        if (prevSection >= 0) {
          goToSection(prevSection, -1);
        }
      },

      onDown: (self) => {
        if (isAnimating || !self.isEnabled) return;

        self.event.preventDefault();

        if (currentSection === 0) {
          isAnimating = true;
          setTimeout(() => {
            isAnimating = false;
            goToSection(1, 1);
          }, 600);
          return;
        }

        const nextSection = currentSection + 1;
        if (nextSection < sections.length) {
          goToSection(nextSection, 1);
        }
      },
      tolerance: 15,
      preventDefault: false,
    });

    // Set the default scroller for all ScrollTriggers
    ScrollTrigger.defaults({ scroller: scroller });

    // ⚠️ [덜컹거림(Jitter) 해결]
    // 이 onUpdate 트리거는 Observer와 충돌하므로 반드시 삭제해야 합니다.
    // (이미 주석 처리 되어있지만, 확실히 삭제합니다.)

    return () => {
      obs.current.kill(); // 4. ref에서 kill() 호출
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main ref={mainRef}>
      <Nav />
      <div className="snap-container">
        <section className="snap-section hero-section">
          <HeroSection />
        </section>

        <section className="snap-section video-section">
          <VideoSection />
        </section>

        <section className="snap-section keywords-section">
          <KeywordsSection />
        </section>

        <section className="snap-section concept-section">
          {/* 5. ConceptSection에 obsRef prop 전달 */}
          <ConceptSection obsRef={obs} />
        </section>

        <section className="snap-section visual-section">
          <VisualSection />
        </section>

        {/*
        <section className="snap-section typography-section">
          <TypographySection />
        </section>

        <section className="snap-section slogan-section">
          <SloganSection />
        </section>

        <section className="snap-section snap-section--auto footer-section">
          <MainFooterSection />
        </section> */}
      </div>
    </main>
  );
}
