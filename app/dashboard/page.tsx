import Link from 'next/link';
import { prisma } from '@/lib/db';

export default async function DashboardOverview() {
  const [projectCount, eventCount] = await Promise.all([
    prisma.project.count(),
    prisma.event.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>
      <p className="mt-1 text-black/50">Everything you publish here shows up on the site immediately.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/dashboard/projects"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/25"
        >
          <div className="text-4xl font-semibold">{projectCount}</div>
          <div className="mt-1 text-black/60">Projects</div>
          <div className="mt-4 text-sm font-medium text-[#ff5a1f]">Manage projects →</div>
        </Link>

        <Link
          href="/dashboard/events"
          className="rounded-2xl border border-black/10 bg-white p-6 transition hover:border-black/25"
        >
          <div className="text-4xl font-semibold">{eventCount}</div>
          <div className="mt-1 text-black/60">Events</div>
          <div className="mt-4 text-sm font-medium text-[#ff5a1f]">Manage events →</div>
        </Link>
      </div>
    </div>
  );
}
