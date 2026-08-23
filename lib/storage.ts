import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

/**
 * Stores an uploaded image and returns its public URL.
 *
 * - If BLOB_READ_WRITE_TOKEN is set (production, Vercel Blob connected),
 *   the file is uploaded to Vercel Blob — required on serverless, where the
 *   local filesystem is read-only/ephemeral.
 * - Otherwise (local development), the file is written under
 *   /public/uploads/<category>/ so image upload works out of the box with
 *   zero setup.
 */
export async function storeImage(file: File, category: 'projects' | 'events'): Promise<string> {
  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase();
  const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  if (!allowed.includes(extension)) {
    throw new Error('Only JPG, PNG, GIF & WEBP images are allowed.');
  }

  const filename = `${category}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extension}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import('@vercel/blob');
    const blob = await put(`${category}/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });
    return blob.url;
  }

  const dir = path.join(process.cwd(), 'public', 'uploads', category);
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${category}/${filename}`;
}
