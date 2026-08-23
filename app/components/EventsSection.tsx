'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export type EventData = {
  id: string;
  title: string;
  description: string;
  story: string | null;
  category: string;
  date: string | null;
  location: string | null;
  imageUrl: string | null;
};

function EventRow({ event, index }: { event: EventData; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: (index % 6) * 0.05 }}
      className="grid gap-6 border-b hairline py-10 last:border-b-0 sm:grid-cols-[140px_1fr]"
    >
      <div className="text-sm text-[var(--paper)]/50">
        {event.date && <div className="font-medium text-[var(--paper)]/80">{event.date}</div>}
        <div className="mt-1">{event.location}</div>
      </div>

      <div className="flex gap-6">
        {event.imageUrl && (
          <div className="relative hidden h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:block">
            <Image src={event.imageUrl} alt={event.title} fill sizes="96px" className="object-cover" />
          </div>
        )}
        <div>
          <span className="kicker">{event.category}</span>
          <h3 className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[var(--paper)]">
            {event.title}
          </h3>
          <p className="mt-2 max-w-[60ch] text-[var(--paper)]/65">{event.description}</p>

          {event.story && (
            <>
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 max-w-[60ch] overflow-hidden text-[var(--paper)]/55"
                  >
                    {event.story}
                  </motion.p>
                )}
              </AnimatePresence>
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 text-sm font-semibold text-[var(--accent)] focus-ring"
              >
                {expanded ? 'Show less' : 'Read the full story →'}
              </button>
            </>
          )}
        </div>
      </div>
    </motion.article>
  );
}

export default function EventsSection({ events }: { events: EventData[] }) {
  return (
    <section id="evidence" className="section-ink px-6 py-28 md:px-10">
      <div className="mx-auto max-w-4xl">
        <p className="kicker mb-4">03 — Evidence</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl text-[var(--paper)] md:text-5xl">
          Community &amp; events
        </h2>

        {events.length === 0 ? (
          <p className="mt-12 text-[var(--paper)]/50">Nothing here yet — add an event from the dashboard.</p>
        ) : (
          <div className="mt-12">
            {events.map((event, i) => (
              <EventRow key={event.id} event={event} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
