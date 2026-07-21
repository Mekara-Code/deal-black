"use client";

import { ButtonHTMLAttributes, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createCapsuleNodes, createMorphPath } from "@/components/elastic/elasticMath";
import { useElasticPath } from "@/components/elastic/useElasticPath";
import { usePointerTracker } from "@/components/elastic/usePointerTracker";

const HOME_SURFACE = "#061218";
const HOME_GOLD = "#EDC77F";
const HOME_GOLD_PRESSED = "#D29C4C";
const HOME_TEXT = "#F5F5F0";
const HOME_INK = "#071016";
const HOME_BORDER = "#D8A75C";

const sizes = {
  sm: { width: 176, height: 56 },
  md: { width: 220, height: 64 },
  lg: { width: 260, height: 72 },
} as const;

export type ElasticButtonSize = keyof typeof sizes | { width: number; height: number };

export type ButtonElasticProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "color" | "size"> & {
  children: ReactNode;
  size?: ElasticButtonSize;
  color?: string;
};

/** Detects the platform preference once, without affecting pointer-frame performance. */
function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

/** Production-ready magnetic SVG button with local elastic Bézier deformation. */
export function ButtonElastic({ children, className = "", color = HOME_SURFACE, disabled = false, size = "md", onPointerEnter, onPointerLeave, onPointerMove, onPointerDown, onPointerUp, onFocus, onBlur, onKeyDown, onKeyUp, ...buttonProps }: ButtonElasticProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const outlineRef = useRef<SVGPathElement>(null);
  const loadingTraceRef = useRef<SVGPathElement>(null);
  const contentRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<() => void>(() => undefined);
  const reducedMotion = useReducedMotion();
  const dimensions = useMemo(() => typeof size === "string" ? sizes[size] : size, [size]);
  const initialPath = useMemo(() => createMorphPath(createCapsuleNodes(dimensions.width, dimensions.height)), [dimensions.height, dimensions.width]);
  const colors = useMemo(() => color === HOME_SURFACE
    ? {
        base: { fill: HOME_SURFACE, text: HOME_TEXT, border: HOME_BORDER, highlight: HOME_GOLD },
        hover: { fill: HOME_GOLD, text: HOME_INK, border: "#F6E1A5", highlight: "#FFF1CA" },
        pressed: { fill: HOME_GOLD_PRESSED, text: HOME_INK, border: "#F2D48A", highlight: "#FFE8AA" },
      }
    : {
        base: { fill: color, text: HOME_TEXT, border: HOME_BORDER, highlight: HOME_GOLD },
        hover: { fill: color, text: HOME_TEXT, border: HOME_BORDER, highlight: HOME_GOLD },
        pressed: { fill: color, text: HOME_TEXT, border: HOME_BORDER, highlight: HOME_GOLD },
      }, [color]);
  const { pointerRef, pointerHandlers, deactivate } = usePointerTracker({ elementRef: buttonRef, disabled: disabled || reducedMotion, onActivity: () => wakeRef.current() });
  const { wake } = useElasticPath({ width: dimensions.width, height: dimensions.height, pathRef, outlineRef, loadingTraceRef, buttonRef, pointerRef, reducedMotion: reducedMotion || disabled });

  useEffect(() => {
    wakeRef.current = wake;
  }, [wake]);

  const setVisual = useCallback((visual: typeof colors.base) => {
    pathRef.current?.setAttribute("fill", visual.fill);
    pathRef.current?.setAttribute("stroke", visual.border);
    outlineRef.current?.setAttribute("stroke", visual.highlight);
    if (contentRef.current) contentRef.current.style.color = visual.text;
  }, []);

  const resetVisual = useCallback(() => setVisual(colors.base), [colors.base, setVisual]);

  useEffect(() => {
    resetVisual();
  }, [resetVisual]);

  return (
    <button
      {...buttonProps}
      ref={buttonRef}
      type={buttonProps.type ?? "button"}
      disabled={disabled}
      onPointerEnter={(event) => {
        setVisual(colors.hover);
        pointerHandlers.onPointerEnter(event);
        onPointerEnter?.(event);
      }}
      onPointerMove={(event) => {
        pointerHandlers.onPointerMove(event);
        onPointerMove?.(event);
      }}
      onPointerLeave={(event) => {
        resetVisual();
        pointerHandlers.onPointerLeave(event);
        onPointerLeave?.(event);
      }}
      onPointerDown={(event) => {
        setVisual(colors.pressed);
        onPointerDown?.(event);
      }}
      onPointerUp={(event) => {
        setVisual(colors.hover);
        onPointerUp?.(event);
      }}
      onFocus={(event) => {
        setVisual(colors.hover);
        onFocus?.(event);
      }}
      onBlur={(event) => {
        resetVisual();
        deactivate();
        onBlur?.(event);
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") setVisual(colors.pressed);
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") setVisual(colors.hover);
        onKeyUp?.(event);
      }}
      className={`relative isolate inline-flex items-center justify-center overflow-visible border-0 bg-transparent p-0 text-[#f5f5f0] outline-none [font-family:var(--font-persian)] font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#edc77f] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ width: `${dimensions.width}px`, height: `${dimensions.height}px` }}
    >
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${dimensions.width} ${dimensions.height}`} preserveAspectRatio="none">
        <path ref={pathRef} d={initialPath} fill={colors.base.fill} stroke={colors.base.border} strokeOpacity="0.78" strokeWidth="1" />
        <path ref={outlineRef} d={initialPath} fill="none" stroke={colors.base.highlight} strokeOpacity="0.3" strokeWidth="0.55" />
        <path ref={loadingTraceRef} d={initialPath} fill="none" stroke="#EDC77F" strokeWidth="1.3" strokeLinecap="round" pathLength="100" strokeDasharray="14 86" strokeDashoffset="100" opacity="0" />
      </svg>
      <span ref={contentRef} className="relative z-10 inline-flex items-center justify-center gap-2 whitespace-nowrap px-8 text-[12px] uppercase tracking-[0.05em]">{children}</span>
    </button>
  );
}
