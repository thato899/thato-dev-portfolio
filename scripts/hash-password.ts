// Generates a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: npm run hash-password -- "your-new-password"
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-new-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);
// Next.js treats an unescaped `$` in .env files as a variable reference and
// silently corrupts values like this. Escape it here so copy-paste is safe.
const envSafeHash = hash.replace(/\$/g, '\\$');

console.log('\nAdd this to .env.local (and set the *unescaped* hash in Vercel\'s env var UI):\n');
console.log(`ADMIN_PASSWORD_HASH="${envSafeHash}"\n`);
