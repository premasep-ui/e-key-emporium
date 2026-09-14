/**
 * Global decorative background: dark gradient, thin grid, blurred orbs,
 * abstract shapes and soft glowing dots. Purely presentational and
 * pointer-events-none so it never blocks or dims the content above it.
 */
export function BackgroundDecor() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.18_0.02_265),var(--background)_45%,oklch(0.15_0.016_265))]" />

      {/* subtle grid, faded at the edges */}
      <div className="bg-line-grid decor-fade-mask absolute inset-0 opacity-70" />

      {/* diagonal abstract lines */}
      <div className="bg-diagonal-lines absolute -right-24 top-40 h-[520px] w-[520px] rotate-12 opacity-60" />

      {/* blurred gradient orbs */}
      <div className="decor-orb animate-drift absolute -left-32 top-[-120px] size-[420px] opacity-60" />
      <div className="decor-orb animate-float absolute right-[-140px] top-[38%] size-[380px] opacity-40" />
      <div className="decor-orb animate-drift absolute bottom-[-160px] left-1/3 size-[440px] opacity-30" />

      {/* decorative circles */}
      <div className="absolute left-1/2 top-24 size-[520px] -translate-x-1/2 rounded-full border border-white/5" />
      <div className="absolute left-1/2 top-56 size-[760px] -translate-x-1/2 rounded-full border border-white/[0.03]" />

      {/* abstract polygon */}
      <div className="animate-float absolute right-[12%] top-[18%] size-24 rotate-12 border border-primary/20 bg-primary/5 [clip-path:polygon(50%_0%,100%_38%,82%_100%,18%_100%,0%_38%)]" />

      {/* small glowing dots */}
      <div className="bg-dot-grid animate-glow-pulse absolute inset-x-0 bottom-0 h-[45vh] opacity-40" />
    </div>
  );
}
