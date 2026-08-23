'use client';

import { motion } from 'framer-motion';

const STATS = [
  { value: '4+', label: 'Production systems shipped' },
  { value: '3', label: 'Years writing software' },
  { value: '10+', label: 'Projects, from CLIs to full-stack apps' },
  { value: '100%', label: "Of this dashboard I actually maintain myself" },
];

export default function StatsSection() {
  return (
    <section className="section-paper border-y hairline">
      <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ delay: i * 0.06, duration: 0.6 }}
            className="border-b border-r hairline px-6 py-12 [&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:[&:nth-child(4n)]:border-r-0 md:border-b-0"
          >
            <div className="index-number text-5xl font-semibold text-[var(--accent)] md:text-6xl">
              {stat.value}
            </div>
            <p className="mt-3 max-w-[16ch] text-sm text-[var(--ink)]/70">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
