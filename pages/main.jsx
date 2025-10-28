"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "../styles/main.scss";

import Nav from "../components/nav";
import HeroSection from "../components/mainSections/HeroSection";
import KeywordsSection from "../components/mainSections/KeywordsSection";
import VideoSection from "../components/mainSections/VideoSection";
import ConceptSection from "../components/mainSections/ConceptSection";
import VisualSection from "../components/mainSections/VisualSection";
import TypographySection from "../components/mainSections/TypographySection";
import HighlightSection from "../components/mainSections/HighlightSection";
import MainFooterSection from "../components/mainSections/MainFooterSection";

gsap.registerPlugin(ScrollTrigger);

export default function main() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    const container = mainRef.current;

    if (!container) {
      return;
    }

    const ctx = gsap.context(() => {
      const sections = Array.from(container.children).filter(
        (child) => child instanceof HTMLElement
      );
      const conceptSection = container.querySelector(".concept");

      if (sections.length > 1) {
        const snapTo = 1 / (sections.length - 1);

        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo,
            duration: 0.7,
            delay: 0.05,
            ease: "power1.inOut",
          },
        });

        ScrollTrigger.create({
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          snap: {
            snapTo,
            duration: 0.8,
            delay: 0.05,
            ease: "power3.inOut",
          },
        });
      }

      if (!conceptSection) {
        console.warn("Concept section not found, skipping internal ScrollTrigger setup.");
        return;
      }

      const newGraphics = Array.from(
        conceptSection.querySelectorAll(".new-graphic")
      );

      if (!newGraphics.length) {
        return;
      }

      newGraphics.forEach((graphic) => {
        gsap.fromTo(
          graphic,
          { autoAlpha: 0, y: 50 },
          {
            autoAlpha: 1,
            y: 0,
            scrollTrigger: {
              trigger: conceptSection,
              scroller: "body",
              start: () =>
                `top top+=${graphic.offsetTop - window.innerHeight * 0.8}`,
              end: () =>
                `top top+=${graphic.offsetTop - window.innerHeight * 0.5}`,
              scrub: 1,
            },
          }
        );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div>
      <img className="webImage" src="/images/main.png" alt="main.png" />

      <Nav />

      <main ref={mainRef}>
        <HeroSection />
        <KeywordsSection />
        <VideoSection />
        <ConceptSection />
        <VisualSection />
        <TypographySection />
        <HighlightSection />
        <MainFooterSection />
      </main>
    </div>
  );
}
