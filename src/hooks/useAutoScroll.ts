import { useEffect, useRef } from "react";

export function useAutoScroll<T extends HTMLElement>(dep: number) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [dep]);

  return ref;
}
