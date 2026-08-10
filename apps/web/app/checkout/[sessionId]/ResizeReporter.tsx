"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ResizeReporter({
  sessionId,
  className,
  children,
}: {
  sessionId: string;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const report = () => {
      window.parent.postMessage({ type: "upay:resize", sessionId, height: el.offsetHeight }, "*");
    };

    const observer = new ResizeObserver(report);
    observer.observe(el);
    report();

    return () => observer.disconnect();
  }, [sessionId]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
