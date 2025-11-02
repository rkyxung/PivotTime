"use client";

import "../styles/main.scss";

import Nav from "../components/nav";
import HeroSection from "../components/mainSections/HeroSection";
import VideoSection from "../components/mainSections/VideoSection";
import KeywordsSection from "../components/mainSections/KeywordsSection";
import ConceptSection from "../components/mainSections/ConceptSection";
import VisualSection from "../components/mainSections/VisualSection";
import TypographySection from "../components/mainSections/TypographySection";
import SloganSection from "../components/mainSections/SloganSection";
import MainFooterSection from "../components/mainSections/MainFooterSection";

export default function Main() {
  return (
    <main>
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
          <ConceptSection />
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
