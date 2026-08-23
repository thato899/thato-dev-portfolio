'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export type ProjectData = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  content: string | null;
  techStack: string;
  liveUrl: string | null;
  githubUrl: string | null;
  imageUrl: string | null;
};

function ProjectRow({ project, index }: { project: ProjectData; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const reversed = index % 2 === 1;
  const tech = project.techStack
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="border-b hairline py-16 first:pt-0 last:border-b-0"
    >
      <div className={`grid gap-10 md:grid-cols-2 md:items-center ${reversed ? 'md:[&>*:first-child]:order-2' : ''}`}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-[var(--paper-soft)]">
          {project.imageUrl ? (
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              sizes="(min-width: 768px) 40vw, 90vw"
              className="object-cover transition-transform duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-[family-name:var(--font-display)] text-6xl text-[var(--ink)]/15">
              {String(index + 1).padStart(2, '0')}
            </div>
          )}
        </div>

        <div>
          <span className="index-number text-sm text-[var(--ink)]/40">
            {String(index + 1).padStart(2, '0')}
          </span>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-3xl md:text-4xl">
            {project.title}
          </h3>
          <p className="mt-2 text-[var(--accent)] font-medium">{project.tagline}</p>
          <p className="mt-4 max-w-[50ch] text-[var(--ink)]/75">{project.description}</p>

          {project.content && (
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 max-w-[50ch] overflow-hidden text-[var(--ink)]/65"
                >
                  {project.content}
                </motion.p>
              )}
            </AnimatePresence>
          )}

          {tech.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {tech.map((t) => (
                <li key={t} className="rounded-full bg-[var(--ink)]/5 px-3 py-1 text-xs font-medium">
                  {t}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-5 text-sm font-semibold">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 focus-ring">
                Live demo ↗
              </a>
            )}
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-[var(--accent)] decoration-2 underline-offset-4 focus-ring">
                Source ↗
              </a>
            )}
            {project.content && (
              <button onClick={() => setExpanded((v) => !v)} className="text-[var(--ink)]/50 hover:text-[var(--ink)] focus-ring">
                {expanded ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection({ projects }: { projects: ProjectData[] }) {
  return (
    <section id="work" className="section-paper px-6 py-28 md:px-10">
      <div className="mx-auto max-w-6xl">
        <p className="kicker mb-4">01 — Selected work</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">Projects</h2>

        {projects.length === 0 ? (
          <p className="mt-12 text-[var(--ink)]/50">
            Nothing here yet — add a project from the dashboard.
          </p>
        ) : (
          <div className="mt-12">
            {projects.map((project, i) => (
              <ProjectRow key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
