import MagneticLink from './MagneticLink';

export default function Footer({
  email,
  github,
  linkedin,
}: {
  email: string;
  github: string;
  linkedin: string;
}) {
  return (
    <footer id="contact" className="section-ink px-6 py-28 md:px-10">
      <div className="mx-auto max-w-4xl text-center">
        <p className="kicker mb-6">04 — Get in touch</p>
        <h2 className="font-[family-name:var(--font-display)] text-4xl leading-tight text-[var(--paper)] md:text-6xl">
          Let&rsquo;s build something <span className="italic text-[var(--accent)]">worth shipping</span>.
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <MagneticLink href={`mailto:${email}`}>Email me</MagneticLink>
          <MagneticLink href={github} variant="outline" external>
            <span className="text-[var(--paper)]">GitHub</span>
          </MagneticLink>
          <MagneticLink href={linkedin} variant="outline" external>
            <span className="text-[var(--paper)]">LinkedIn</span>
          </MagneticLink>
        </div>

        <p className="mt-20 text-xs uppercase tracking-[0.2em] text-[var(--paper)]/40">
          Designed &amp; built by Thato Junior Maluleka
        </p>
      </div>
    </footer>
  );
}
