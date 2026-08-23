'use client';

import { motion } from 'framer-motion';
import ParticleField from './ParticleField';
import MagneticLink from './MagneticLink';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero({ github }: { github: string }) {
  return (
    <section id="top" className="section-ink relative flex min-h-screen items-center overflow-hidden">
      <ParticleField />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--ink)]" />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pt-24 pb-16 md:px-10">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={reveal}
          className="kicker mb-6"
        >
          Software Engineer · WeThinkCode_
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={reveal}
          className="font-[family-name:var(--font-display)] text-[13vw] leading-[0.95] tracking-tight text-[var(--paper)] md:text-[6.5rem]"
        >
          Thato Junior
          <br />
          <span className="italic text-[var(--accent)]">Maluleka</span>
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={reveal}
          className="mt-8 max-w-xl text-lg text-[var(--paper)]/75"
        >
          I build production systems, then go find out where they break. This is the evidence —
          the projects, the shipped code, and the rooms I showed up in to get better at it.
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={reveal}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticLink href="#work">View the work</MagneticLink>
          <MagneticLink href={github} variant="outline" external>
            <span className="text-[var(--paper)]">GitHub ↗</span>
          </MagneticLink>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 text-xs uppercase tracking-[0.3em] text-[var(--paper)]/50 md:block">
        Scroll
      </div>
    </section>
  );
}
