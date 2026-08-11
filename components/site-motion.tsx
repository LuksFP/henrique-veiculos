"use client";

import { useEffect, useRef, useState } from "react";

const REDUCED = "(prefers-reduced-motion: reduce)";

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia(REDUCED).matches;
}

/**
 * Loop único de scroll: parallax, barra de progresso e header condensado.
 * O parallax usa a propriedade `translate` (não `transform`) de propósito —
 * assim não briga com as animações de transform que já existem nos elementos.
 */
export function useScrollMotion() {
  useEffect(() => {
    if (prefersReduced()) return;

    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const faders = Array.from(document.querySelectorAll<HTMLElement>("[data-fade-out]"));
    const bar = document.querySelector<HTMLElement>(".scroll-progress-fill");
    const masthead = document.querySelector<HTMLElement>(".site-masthead");
    let ticking = false;

    function frame() {
      ticking = false;
      const vh = window.innerHeight;

      for (const el of layers) {
        const speed = Number.parseFloat(el.dataset.parallax ?? "0");
        const rect = el.getBoundingClientRect();
        // Distância do centro do elemento até o centro da tela.
        const offset = rect.top + rect.height / 2 - vh / 2;
        el.style.translate = `0 ${(-offset * speed).toFixed(2)}px`;
      }

      for (const el of faders) {
        const fade = Math.min(window.scrollY / (vh * 0.62), 1);
        el.style.opacity = String(1 - fade * 0.9);
      }

      if (bar) {
        const max = document.documentElement.scrollHeight - vh;
        bar.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
      }

      masthead?.classList.toggle("is-stuck", window.scrollY > 48);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(frame);
    }

    frame();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
}

/**
 * Entrada em cascata de qualquer `[data-reveal]`. Reexecuta quando a lista muda.
 *
 * O estado escondido é aplicado aqui pelo JS, e só no que está abaixo da dobra:
 * assim o conteúdo do primeiro quadro pinta na hora e nada some se o JS falhar
 * ou demorar para hidratar.
 */
export function useReveal(watch: unknown) {
  useEffect(() => {
    if (prefersReduced()) return;

    const limit = window.innerHeight * 0.85;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")).filter(
      (el) => el.getBoundingClientRect().top > limit,
    );

    els.forEach((el) => el.classList.add("will-reveal"));

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );

    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [watch]);
}

/** Inclinação 3D + brilho seguindo o cursor nos `[data-tilt]`. Só no mouse. */
export function useTilt() {
  useEffect(() => {
    if (prefersReduced() || window.matchMedia("(hover: none)").matches) return;

    const cards = Array.from(document.querySelectorAll<HTMLElement>("[data-tilt]"));

    function onMove(event: MouseEvent) {
      const el = event.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
      el.style.transform = `perspective(760px) rotateX(${((0.5 - y) * 7).toFixed(2)}deg) rotateY(${((x - 0.5) * 7).toFixed(2)}deg)`;
    }

    function onLeave(event: MouseEvent) {
      (event.currentTarget as HTMLElement).style.transform = "";
    }

    cards.forEach((card) => {
      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
    });

    return () => {
      cards.forEach((card) => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);
}

/** Contador que sobe de 0 até o valor na primeira vez que aparece na tela. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLElement>(null);
  const animated = useRef(false);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (animated.current) {
      setShown(value);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (prefersReduced()) {
      animated.current = true;
      setShown(value);
      return;
    }

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        obs.disconnect();
        animated.current = true;

        const start = performance.now();
        const duration = 900;

        function tick(now: number) {
          const p = Math.min((now - start) / duration, 1);
          setShown(Math.round(value * (1 - (1 - p) ** 3)));
          if (p < 1) requestAnimationFrame(tick);
        }

        setShown(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <strong ref={ref}>{shown}</strong>;
}
