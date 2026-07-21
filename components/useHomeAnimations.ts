"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Keeps the homepage motion in one place so content components stay focused on
 * markup. Every animation is scoped to the supplied root and reverted on
 * unmount, which also prevents duplicate ScrollTriggers during Fast Refresh.
 */
export function useHomeAnimations(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    const context = gsap.context(() => {
      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const select = gsap.utils.selector(root);
        const hero = select<HTMLElement>("[data-hero]")[0];
        const heroMedia = select<HTMLElement>("[data-hero-media]");
        const heroContent = select<HTMLElement>("[data-hero-content]");
        const heroStats = select<HTMLElement>("[data-hero-stats]");
        const heroStatItems = select<HTMLElement>("[data-hero-stat]");
        const heroStatValues = select<HTMLElement>("[data-hero-stat-value]");
        const headerProgress = select<HTMLElement>("[data-header-progress]");
        const homeLogoMark = select<SVGElement>("[data-home-logo] [data-logo-mark]");
        const homeLogoWordmark = select<SVGElement>("[data-home-logo] [data-logo-wordmark]");
        const homeLogoTagline = select<SVGElement>("[data-home-logo] [data-logo-tagline]");

        const intro = gsap.timeline({
          defaults: { ease: "power3.out" },
        });

        const setCounterValue = (element: HTMLElement, value: number) => {
          const prefix = element.dataset.counterPrefix ?? "";
          const suffix = element.dataset.counterSuffix ?? "";
          element.textContent = `${prefix}${Math.round(value)}${suffix}`;
        };

        const resetHeroCounters = () => {
          heroStatValues.forEach((element) => setCounterValue(element, 0));
        };

        const animateHeroCounters = () => {
          heroStatValues.forEach((element, index) => {
            const target = Number(element.dataset.counterTarget ?? 0);
            const counter = { value: 0 };

            gsap.to(counter, {
              value: target,
              duration: 0.82,
              delay: index * 0.08,
              ease: "power2.out",
              onUpdate: () => setCounterValue(element, counter.value),
            });
          });
        };

        resetHeroCounters();

        intro
          .from(select("[data-home-header]"), { autoAlpha: 0, y: -22, duration: 0.7 })
          .from(homeLogoMark, { autoAlpha: 0, y: 12, scale: 0.78, rotation: -5, transformOrigin: "57px 57px", duration: 0.5, ease: "back.out(1.55)" }, 0.26)
          .from(homeLogoWordmark, { autoAlpha: 0, x: 18, scaleX: 0.86, transformOrigin: "114px 44px", duration: 0.44, ease: "power4.out" }, 0.68)
          .from(homeLogoTagline, { autoAlpha: 0, y: 7, scaleX: 0.9, transformOrigin: "114px 75px", duration: 0.34, ease: "power3.out" }, 1.05)
          .from(select("[data-hero-media]"), { autoAlpha: 0, scale: 1.1, duration: 1.65, ease: "power2.out" }, 0)
          .from(select("[data-hero-scroll]"), { autoAlpha: 0, x: -12, duration: 0.55 }, 0.35)
          .from(select("[data-hero-kicker]"), { autoAlpha: 0, y: 18, duration: 0.56 }, 0.45)
          .from(select("[data-hero-line]"), { autoAlpha: 0, yPercent: 115, rotation: 2, duration: 0.82, stagger: 0.09 }, 0.55)
          .from(select("[data-hero-description]"), { autoAlpha: 0, y: 22, duration: 0.62 }, 0.92)
          .from(select("[data-hero-stats]"), { autoAlpha: 0, y: 28, duration: 0.72 }, 1.06)
          .from(select("[data-hero-stat]"), { autoAlpha: 0, y: 14, duration: 0.42, stagger: 0.07 }, 1.22);

        const enableStatsHandoff = () => {
          if (!hero || !heroStats.length) return;

          // Let the entrance animation finish before the scroll timeline takes
          // ownership of these same properties. This prevents stale transforms
          // or hidden children when a visitor repeatedly reverses direction.
          gsap.set([...heroStats, ...heroStatItems], { clearProps: "transform,opacity,visibility" });

          const statsHandoff = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: hero,
              start: "52% top",
              end: "bottom top",
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          });

          statsHandoff
            .to(heroStats, { y: 58, scale: 0.976, transformOrigin: "center bottom", duration: 0.58 }, 0)
            .to(heroStatItems, { opacity: 0, y: 16, duration: 0.34, stagger: { each: 0.055, from: "edges" } }, 0.4)
            .to(heroStats, { opacity: 0, duration: 0.2 }, 0.72);
        };

        intro.eventCallback("onComplete", () => {
          animateHeroCounters();
          enableStatsHandoff();
        });

        if (headerProgress.length) {
          gsap.to(headerProgress, {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "max",
              scrub: 0.2,
            },
          });
        }

        gsap.to(select("[data-scroll-pulse]"), {
          scaleY: 0.52,
          transformOrigin: "top center",
          duration: 1.35,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        if (hero) {
          gsap.to(heroMedia, {
            yPercent: 9,
            scale: 1.065,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.85,
            },
          });

          gsap.to(heroContent, {
            y: window.matchMedia("(min-width: 761px)").matches ? -54 : -24,
            autoAlpha: 0.22,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "28% top",
              end: "bottom top",
              scrub: 0.65,
            },
          });

        }

        select<HTMLElement>("[data-story-section]").forEach((section) => {
          const sectionSelect = gsap.utils.selector(section);
          const copy = sectionSelect<HTMLElement>("[data-story-copy]");
          const visuals = sectionSelect<HTMLElement>("[data-story-visual]");
          const items = sectionSelect<HTMLElement>("[data-story-item]");
          const animated = [...copy, ...visuals, ...items];

          if (!animated.length) {
            return;
          }

          if (section.id === "sectors") {
            const mosaic = sectionSelect<HTMLElement>("[data-sector-mosaic]")[0];
            const mosaicAura = sectionSelect<HTMLElement>(".sector-diamond-matrix-aura")[0];
            const diamondTiles = sectionSelect<HTMLElement>("[data-sector-diamond-tile]");
            const squareTiles = sectionSelect<HTMLElement>("[data-sector-square-tile]");

            const createSectorReveal = (trigger: HTMLElement, tiles: HTMLElement[], offset: number) => {
              const timeline = gsap.timeline({
                scrollTrigger: {
                  trigger,
                  start: "top 86%",
                  end: "top 24%",
                  scrub: 0.65,
                  invalidateOnRefresh: true,
                },
              });

              timeline.fromTo(
                tiles,
                { autoAlpha: 0, y: offset, scale: 0.72 },
                {
                  autoAlpha: 1,
                  y: 0,
                  scale: 1,
                  duration: 1,
                  ease: "power2.out",
                  stagger: { each: 0.08, from: "center" },
                },
              );

              return timeline;
            };

            media.add("(min-width: 1280px)", () => {
              if (!mosaic || !diamondTiles.length) return;

              const reveal = createSectorReveal(mosaic, diamondTiles, 72);
              const aura = mosaicAura
                ? gsap.fromTo(
                    mosaicAura,
                    { autoAlpha: 0.18, scale: 0.82 },
                    {
                      autoAlpha: 1,
                      scale: 1.12,
                      ease: "none",
                      scrollTrigger: {
                        trigger: mosaic,
                        start: "top 88%",
                        end: "bottom 24%",
                        scrub: 0.9,
                        invalidateOnRefresh: true,
                      },
                    },
                  )
                : null;

              return () => {
                reveal.kill();
                aura?.kill();
              };
            });

            media.add("(max-width: 1279px)", () => {
              if (!squareTiles.length) return;

              const slideshow = squareTiles[0]?.closest<HTMLElement>(".swiper");

              if (!slideshow) return;

              const reveal = createSectorReveal(slideshow, squareTiles, 36);

              return () => reveal.kill();
            });
          }

          const reveal = gsap.timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: {
              trigger: section,
              start: section.id === "sectors" ? "top 66%" : "top 78%",
              once: true,
            },
          });

          if (copy.length) {
            reveal.from(copy, { autoAlpha: 0, y: 42, duration: 0.7, stagger: 0.1 });
          }

          if (visuals.length) {
            reveal.from(visuals, { autoAlpha: 0, y: 52, scale: 0.975, duration: 0.82, stagger: 0.1 }, copy.length ? "<0.08" : 0);
          }

          if (items.length) {
            reveal.from(items, { autoAlpha: 0, y: 28, duration: 0.54, stagger: 0.07 }, (copy.length || visuals.length) ? "<0.16" : 0);
          }

          // Returning control of transform and opacity to Tailwind keeps hover
          // states and Swiper's own inline transforms working after the reveal.
          reveal.set(animated, { clearProps: "transform,opacity,visibility" });
        });

        select<SVGElement>("[data-footer-logo]").forEach((footerLogo) => {
          const logoSelect = gsap.utils.selector(footerLogo);
          const mark = logoSelect<SVGElement>("[data-logo-mark]");
          const wordmark = logoSelect<SVGElement>("[data-logo-wordmark]");
          const tagline = logoSelect<SVGElement>("[data-logo-tagline]");

          const footerLogoReveal = gsap.timeline({
            scrollTrigger: {
              trigger: footerLogo,
              start: "top 86%",
              once: true,
            },
          });

          footerLogoReveal
            .from(mark, { autoAlpha: 0, y: 14, scale: 0.78, rotation: -5, transformOrigin: "57px 57px", duration: 0.5, ease: "back.out(1.55)" })
            .from(wordmark, { autoAlpha: 0, x: 18, scaleX: 0.86, transformOrigin: "114px 44px", duration: 0.44, ease: "power4.out" }, ">-0.04")
            .from(tagline, { autoAlpha: 0, y: 7, scaleX: 0.9, transformOrigin: "114px 75px", duration: 0.34, ease: "power3.out" }, ">-0.05")
            .set([mark, wordmark, tagline], { clearProps: "transform,opacity,visibility" });
        });
      });

      return () => media.revert();
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
