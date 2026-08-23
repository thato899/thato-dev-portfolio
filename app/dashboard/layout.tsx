import Link from 'next/link';
import { auth } from '@/lib/auth';
import { logoutAction } from '@/lib/actions/auth';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/events', label: 'Events' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#fafaf8] text-[#1a1a1a]">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-60 shrink-0 border-r border-black/10 px-6 py-8 md:block">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            ← Back to site
          </Link>
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-black/70 hover:bg-black/5 hover:text-black"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-black/10 px-6 py-4 md:px-10">
            <div className="text-sm text-black/50">{session?.user?.email}</div>
            <form action={logoutAction}>
              <button className="rounded-full border border-black/15 px-4 py-1.5 text-sm font-medium hover:bg-black/5">
                Log out
              </button>
            </form>
          </header>
          <main className="px-6 py-10 md:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
