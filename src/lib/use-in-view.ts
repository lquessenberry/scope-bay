import { useEffect, useState, type RefObject } from "react";

export function useInView(
  ref: RefObject<Element | null>,
  rootMargin = "30% 0px",
  initial = false,
) {
  const [inView, setInView] = useState(initial);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { root: null, rootMargin, threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);

  return inView;
}
