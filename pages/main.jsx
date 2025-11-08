"use client";
import { useEffect, useRef } from "react"; // 1. useRef 임포트 확인
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

import "../styles/main.scss";

import Nav from "../components/nav";
import HeroSection from "../components/mainSections/HeroSection";
import VideoSection from "../components/mainSections/VideoSection";
import KeywordsSection from "../components/mainSections/KeywordsSection";
import ConceptSection from "../components/mainSections/conceptSection";
import VisualSection from "../components/mainSections/VisualSection";
import TypographySection from "../components/mainSections/TypographySection";
import SloganSection from "../components/mainSections/SloganSection";
import MainFooterSection from "../components/mainSections/MainFooterSection";
import Footer from "../components/footer";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Main() {
  const mainRef = useRef(null);

  useEffect(() => {
    // 기본(window) 스크롤 사용. 스냅/옵저버 로직 제거.
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <main ref={mainRef}>
      <Nav />
      <div>
        <section className="hero-section">
          <HeroSection />
        </section>

        <section className="video-section">
          <VideoSection />
        </section>

        <section className="keywords-section">
          <KeywordsSection />
        </section>

        <section className="concept-section">
          <ConceptSection />
        </section>

        <section className="visual-section">
          <VisualSection />
        </section>

        <section className="typography-section">
          <TypographySection />
        </section>

        <section className="slogan-section">
          <SloganSection />
        </section>

        <section className="footer-section">
          <MainFooterSection />
        </section>
      </div>
      <Footer/>
    </main>
  );
}
