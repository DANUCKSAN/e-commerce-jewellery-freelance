"use client";

import { ArrowDownRight, ArrowRight, Gem, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";

import heroImage from "../../public/images/aurelle/hero-rings.webp";
import styles from "./HeroExperience.module.css";

const materials = [
  { label: "Diamond", href: "/products?category=diamond", detail: "Precise brilliance" },
  { label: "Gold", href: "/products?category=gold", detail: "Enduring warmth" },
  { label: "Silver", href: "/products?category=silver", detail: "Modern lustre" },
  { label: "Platinum", href: "/products?category=platinum", detail: "Rare strength" },
] as const;

export default function HeroExperience() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let frame = 0;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(rect.height, 1)));
      hero.style.setProperty("--scroll-progress", progress.toFixed(4));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType === "touch" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    event.currentTarget.style.setProperty("--pointer-x", x.toFixed(3));
    event.currentTarget.style.setProperty("--pointer-y", y.toFixed(3));
  }

  return (
    <section
      ref={heroRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={(event) => {
        event.currentTarget.style.setProperty("--pointer-x", "0");
        event.currentTarget.style.setProperty("--pointer-y", "0");
      }}
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.media}>
        <Image
          src={heroImage}
          alt="Diamond solitaire and gold band arranged on ivory silk"
          fill
          preload
          sizes="(max-width: 767px) 100vw, 58vw"
          className={styles.heroImage}
        />
        <div className={styles.imageWash} aria-hidden="true" />
        <p className={styles.imageNote}>
          <span>01</span>
          The Celestia Collection
        </p>
      </div>

      <div className={styles.copyPanel}>
        <div className={styles.copyInner}>
          <p className={styles.eyebrow}>
            <Sparkles aria-hidden="true" />
            The new collection · 2026
          </p>
          <h1 id="hero-title" className={styles.title}>
            Light, held
            <span>forever.</span>
          </h1>
          <p className={styles.description}>
            Modern heirlooms in diamond and precious metals, composed with
            restraint and made for every day worth remembering.
          </p>

          <div className={styles.actions}>
            <Link href="/products" className={styles.primaryAction}>
              Discover the collection
              <ArrowRight aria-hidden="true" />
            </Link>
            <Link href="#materials" className={styles.secondaryAction}>
              Shop by material
              <ArrowDownRight aria-hidden="true" />
            </Link>
          </div>

          <div className={styles.provenance}>
            <Gem aria-hidden="true" />
            <p>
              <strong>Considered by design.</strong>
              Recycled precious metals and independently certified stones.
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Shop by material" className={styles.materialNav}>
        {materials.map((material, index) => (
          <Link key={material.label} href={material.href}>
            <span className={styles.index}>{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{material.label}</strong>
              <small>{material.detail}</small>
            </span>
            <ArrowRight aria-hidden="true" />
          </Link>
        ))}
      </nav>
    </section>
  );
}
