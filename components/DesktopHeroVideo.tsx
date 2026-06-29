"use client";

import { useEffect, useState } from "react";

type DesktopHeroVideoProps = {
  src: string;
};

const desktopMediaQuery = "(min-width: 1024px)";

export default function DesktopHeroVideo({ src }: DesktopHeroVideoProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(desktopMediaQuery);
    const syncDesktopState = () => setIsDesktop(mediaQuery.matches);

    syncDesktopState();
    mediaQuery.addEventListener("change", syncDesktopState);

    return () => mediaQuery.removeEventListener("change", syncDesktopState);
  }, []);

  if (!isDesktop) return null;

  return (
    <video
      aria-hidden="true"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      className="absolute inset-0 h-full w-full object-contain opacity-20"
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
