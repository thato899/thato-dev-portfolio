'use client';

import { motion } from 'framer-motion';

const SKILLS = [
  'React', 'Next.js', 'TypeScript', 'Node.js', 'PHP', 'Python', 'PostgreSQL', 'MySQL',
  'Prisma', 'Tailwind CSS', 'Git', 'REST APIs',
];

export default function AboutSection() {
  return (
    <section id="about" className="section-paper px-6 py-28 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.3fr_1fr]">
        <div>
          <p className="kicker mb-6">02 — About</p>
          <p className="font-[family-name:var(--font-display)] text-3xl italic leading-snug md:text-4xl">
            &ldquo;I&rsquo;d rather ship something small and real than talk about something big and
            hypothetical.&rdquo;
          </p>
          <div className="mt-10 space-y-5 text-[var(--ink)]/75 max-w-[55ch]">
            <p>
              I&rsquo;m a software engineering student at WeThinkCode_, building full-stack systems end
              to end — from the database schema to the pixel. This site is one of them: the
              public page you&rsquo;re reading and the dashboard behind it that lets me publish new
              work without touching code.
            </p>
            <p>
              Outside of solo builds, I show up — conferences, hackathons, community outreach —
              because the room teaches you things the editor can&rsquo;t. That&rsquo;s the &ldquo;evidence&rdquo;
              half of this portfolio.
            </p>
          </div>
        </div>

        <div>
          <p className="kicker mb-6">Stack</p>
          <ul className="flex flex-wrap gap-2">
            {SKILLS.map((skill, i) => (
              <motion.li
                key={skill}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="rounded-full border hairline px-4 py-2 text-sm"
              >
                {skill}
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
