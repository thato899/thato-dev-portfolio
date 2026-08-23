'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';

/**
 * A pill button/link that leans gently toward the cursor on hover — the one
 * bit of tactile "this was designed, not templated" polish on primary CTAs.
 */
export default function MagneticLink({
  href,
  children,
  variant = 'solid',
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: 'solid' | 'outline';
  external?: boolean;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 });

  function onMouseMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  }
  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const base =
    'inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-colors focus-ring';
  const styles =
    variant === 'solid'
      ? `${base} bg-[var(--accent)] text-white hover:bg-[var(--accent-dim)]`
      : `${base} border border-current hover:bg-current/10`;

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: springX, y: springY }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={styles}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </motion.a>
  );
}

export function InlineLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 hover:text-[var(--accent)] transition-colors">
      {children}
    </Link>
  );
}
