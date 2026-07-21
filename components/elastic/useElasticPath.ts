"use client";

import gsap from "gsap";
import { RefObject, useCallback, useEffect, useRef } from "react";
import { circularIndexDistance, clamp, createCapsuleNodes, createMorphPath, findNearestSegment } from "@/components/elastic/elasticMath";
import type { ElasticNode } from "@/components/elastic/elasticMath";
import type { ElasticPointer } from "@/components/elastic/usePointerTracker";

const MAX_STRETCH = 18;
const INFLUENCE_RADIUS = 48;
const INFLUENCE_RADIUS_SQUARED = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
const SEGMENT_NEIGHBORHOOD = 6;
const PATH_STIFFNESS = 300;
const PATH_DAMPING = 24;
const MAGNETIC_MAX_X = 16;
const MAGNETIC_MAX_Y = 11;
const MAGNETIC_STIFFNESS = 170;
const MAGNETIC_DAMPING = 30;
const MAX_FRAME_SECONDS = 1 / 30;
const VELOCITY_INFLUENCE = 0.16;
const SETTLED_EPSILON = 0.015;
const ENTRY_START_SCALE = 0.9;
const ENTRY_OPACITY_START_SCALE = 0.84;
const ENTRY_STIFFNESS = 240;
const ENTRY_DAMPING = 21;
const LOADING_TRACE_DURATION = 0.9;
const LOADING_TRACE_FADE_START = 0.72;

type ElasticPathOptions = {
  width: number;
  height: number;
  pathRef: RefObject<SVGPathElement | null>;
  outlineRef: RefObject<SVGPathElement | null>;
  loadingTraceRef: RefObject<SVGPathElement | null>;
  buttonRef: RefObject<HTMLButtonElement | null>;
  pointerRef: RefObject<ElasticPointer>;
  reducedMotion: boolean;
};

/** Integrates an under-damped spring in place without allocating in the animation loop. */
function stepNodeSpring(node: ElasticNode, target: number, deltaTime: number) {
  node.velocity += (target - node.displacement) * PATH_STIFFNESS * deltaTime;
  node.velocity *= Math.exp(-PATH_DAMPING * deltaTime);
  node.displacement += node.velocity * deltaTime;

  return Math.abs(target - node.displacement) > SETTLED_EPSILON || Math.abs(node.velocity) > SETTLED_EPSILON;
}

/** Integrates a generic scalar spring for the magnetic offset and load-in scale. */
function stepScalarSpring(spring: { value: number; velocity: number }, target: number, stiffness: number, damping: number, deltaTime: number) {
  spring.velocity += (target - spring.value) * stiffness * deltaTime;
  spring.velocity *= Math.exp(-damping * deltaTime);
  spring.value += spring.velocity * deltaTime;

  return Math.abs(target - spring.value) > SETTLED_EPSILON || Math.abs(spring.velocity) > SETTLED_EPSILON;
}

/**
 * Runs the elastic path and magnetic springs from one requestAnimationFrame loop.
 * React is deliberately not involved in frame updates: only SVG attributes and
 * inline transforms are written after physics has settled for the frame.
 */
export function useElasticPath({ width, height, pathRef, outlineRef, loadingTraceRef, buttonRef, pointerRef, reducedMotion }: ElasticPathOptions) {
  const frameRef = useRef<number | null>(null);
  const stepRef = useRef<(time: number) => void>(() => undefined);

  const wake = useCallback(() => {
    if (frameRef.current === null) frameRef.current = window.requestAnimationFrame(stepRef.current);
  }, []);

  useEffect(() => {
    const path = pathRef.current;
    const outline = outlineRef.current;
    const loadingTrace = loadingTraceRef.current;
    const button = buttonRef.current;
    if (!path || !outline || !loadingTrace || !button) return;

    const nodes: ElasticNode[] = createCapsuleNodes(width, height);
    const magnetic = { x: 0, y: 0, velocityX: 0, velocityY: 0 };
    const entrance = { value: reducedMotion ? 1 : ENTRY_START_SCALE, velocity: 0 };
    let loadingElapsed = reducedMotion ? LOADING_TRACE_DURATION : 0;
    let previousTime = 0;
    const initialPath = createMorphPath(nodes);
    const setTransform = gsap.quickSetter(button, "transform");
    const setOpacity = gsap.quickSetter(button, "opacity");

    // GSAP is used only for initial SVG state and layer promotion. Physics remains rAF-driven.
    gsap.set(path, { attr: { d: initialPath } });
    gsap.set(button, { willChange: "transform,opacity", force3D: true, opacity: reducedMotion ? 1 : 0 });
    path.setAttribute("d", initialPath);
    outline.setAttribute("d", initialPath);
    loadingTrace.setAttribute("d", initialPath);
    loadingTrace.setAttribute("opacity", "0");

    const step = (time: number) => {
      const deltaTime = previousTime ? Math.min((time - previousTime) / 1000, MAX_FRAME_SECONDS) : 1 / 60;
      previousTime = time;
      const pointer = pointerRef.current;
      const stickyInteractionActive = pointer.isSticky && !reducedMotion;
      const nearestSegment = stickyInteractionActive ? findNearestSegment(nodes, pointer.x, pointer.y) : -1;
      const pointerSpeed = Math.hypot(pointer.velocityX, pointer.velocityY);
      const loadingActive = loadingElapsed < LOADING_TRACE_DURATION;
      if (loadingActive) loadingElapsed = Math.min(LOADING_TRACE_DURATION, loadingElapsed + deltaTime);
      let hasMotion = (reducedMotion ? false : stepScalarSpring(entrance, 1, ENTRY_STIFFNESS, ENTRY_DAMPING, deltaTime)) || loadingActive;

      for (let index = 0; index < nodes.length; index += 1) {
        const node = nodes[index];
        let target = 0;

        if (nearestSegment >= 0) {
          const deltaX = pointer.x - node.baseX;
          const deltaY = pointer.y - node.baseY;
          const distanceSquared = deltaX * deltaX + deltaY * deltaY;
          const inverseDistanceWeight = INFLUENCE_RADIUS_SQUARED / (INFLUENCE_RADIUS_SQUARED + distanceSquared);
          const segmentDistance = circularIndexDistance(index, nearestSegment, nodes.length);
          const localSegmentWeight = Math.max(0, 1 - segmentDistance / SEGMENT_NEIGHBORHOOD);
          const directionalPull = clamp((deltaX * node.normalX + deltaY * node.normalY) / INFLUENCE_RADIUS, -1, 1);
          const velocityAlongNormal = clamp((pointer.velocityX * node.normalX + pointer.velocityY * node.normalY) / Math.max(pointerSpeed, 1), -1, 1);
          // Momentum can amplify the pull, but never reverse it away from the pointer.
          const velocityPull = Math.sign(directionalPull) * Math.max(0, velocityAlongNormal * Math.sign(directionalPull)) * VELOCITY_INFLUENCE;

          target = clamp((directionalPull + velocityPull) * MAX_STRETCH * inverseDistanceWeight * localSegmentWeight, -MAX_STRETCH, MAX_STRETCH);
        }

        hasMotion = stepNodeSpring(node, target, deltaTime) || hasMotion;
        node.x = node.baseX + node.normalX * node.displacement;
        node.y = node.baseY + node.normalY * node.displacement;
      }

      const magneticTargetX = stickyInteractionActive ? clamp((pointer.x / width - 0.5) * MAGNETIC_MAX_X * 2, -MAGNETIC_MAX_X, MAGNETIC_MAX_X) : 0;
      const magneticTargetY = stickyInteractionActive ? clamp((pointer.y / height - 0.5) * MAGNETIC_MAX_Y * 2, -MAGNETIC_MAX_Y, MAGNETIC_MAX_Y) : 0;
      magnetic.velocityX += (magneticTargetX - magnetic.x) * MAGNETIC_STIFFNESS * deltaTime;
      magnetic.velocityY += (magneticTargetY - magnetic.y) * MAGNETIC_STIFFNESS * deltaTime;
      magnetic.velocityX *= Math.exp(-MAGNETIC_DAMPING * deltaTime);
      magnetic.velocityY *= Math.exp(-MAGNETIC_DAMPING * deltaTime);
      magnetic.x += magnetic.velocityX * deltaTime;
      magnetic.y += magnetic.velocityY * deltaTime;
      hasMotion = hasMotion || Math.abs(magneticTargetX - magnetic.x) > SETTLED_EPSILON || Math.abs(magneticTargetY - magnetic.y) > SETTLED_EPSILON || Math.abs(magnetic.velocityX) > SETTLED_EPSILON || Math.abs(magnetic.velocityY) > SETTLED_EPSILON;

      const nextPath = createMorphPath(nodes);
      const opacity = reducedMotion ? 1 : clamp((entrance.value - ENTRY_OPACITY_START_SCALE) / (1 - ENTRY_OPACITY_START_SCALE), 0, 1);
      path.setAttribute("d", nextPath);
      outline.setAttribute("d", nextPath);
      loadingTrace.setAttribute("d", nextPath);
      if (loadingActive) {
        const loadingProgress = loadingElapsed / LOADING_TRACE_DURATION;
        const fadeProgress = loadingProgress <= LOADING_TRACE_FADE_START ? 1 : 1 - (loadingProgress - LOADING_TRACE_FADE_START) / (1 - LOADING_TRACE_FADE_START);
        loadingTrace.setAttribute("stroke-dashoffset", `${(1 - loadingProgress) * 100}`);
        loadingTrace.setAttribute("opacity", `${fadeProgress}`);
      } else {
        loadingTrace.setAttribute("opacity", "0");
      }
      setOpacity(opacity);
      setTransform(`translate3d(${magnetic.x.toFixed(2)}px, ${magnetic.y.toFixed(2)}px, 0) scale(${entrance.value.toFixed(3)})`);

      if (pointer.isSticky || hasMotion) {
        frameRef.current = window.requestAnimationFrame(step);
      } else {
        frameRef.current = null;
        setOpacity(1);
        setTransform("translate3d(0px, 0px, 0) scale(1)");
      }
    };

    stepRef.current = step;
    wake();

    return () => {
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
      gsap.set(button, { clearProps: "willChange,transform,opacity" });
    };
  }, [buttonRef, height, loadingTraceRef, outlineRef, pathRef, pointerRef, reducedMotion, wake, width]);

  return { wake };
}
