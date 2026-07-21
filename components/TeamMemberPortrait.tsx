"use client";

import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";

type TeamMemberPortraitProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconSize?: number;
};

/** Renders a team photo and degrades gracefully to a clear default avatar when unavailable. */
export function TeamMemberPortrait({ src, alt, className = "", fallbackClassName = "", iconSize = 42 }: TeamMemberPortraitProps) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  if (failed) {
    return (
      <div className={`grid place-items-center bg-[radial-gradient(circle_at_50%_34%,rgba(244,244,240,0.2)_0_9%,transparent_9.7%),radial-gradient(ellipse_at_50%_75%,rgba(216,167,92,0.24)_0_30%,transparent_30.7%),linear-gradient(145deg,#182a30,#071015_70%,#02090e)] ${fallbackClassName}`} role="img" aria-label={alt}>
        <span className="grid h-[clamp(76px,8vw,112px)] w-[clamp(76px,8vw,112px)] place-items-center rounded-full border border-[#edc77f76] bg-[#02090e69] text-[#edc77f] backdrop-blur">
          <UserRound size={iconSize} strokeWidth={1.25} aria-hidden="true" />
        </span>
      </div>
    );
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt} onError={() => setFailed(true)} />;
}
