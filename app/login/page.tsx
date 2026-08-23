'use client';

import { useActionState } from 'react';
import { loginAction } from '@/lib/actions/auth';

export default function LoginPage() {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--ink)] px-6">
      <div className="w-full max-w-sm">
        <p className="kicker mb-2 text-[var(--paper)]">Dashboard</p>
        <h1 className="font-[family-name:var(--font-display)] text-3xl text-[var(--paper)]">
          Sign in
        </h1>

        <form action={formAction} className="mt-8 space-y-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-[var(--paper)]/70">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--paper)]/20 bg-transparent px-4 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-[var(--paper)]/70">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--paper)]/20 bg-transparent px-4 py-2.5 text-[var(--paper)] outline-none focus:border-[var(--accent)]"
            />
          </div>

          {error && <p className="text-sm text-[var(--accent)]">{error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-dim)] disabled:opacity-60"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
