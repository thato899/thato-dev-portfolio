'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { storeImage } from '@/lib/storage';
import { projectSchema, slugify } from '@/lib/validation';

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

function readInput(formData: FormData) {
  const raw = {
    title: String(formData.get('title') ?? ''),
    tagline: String(formData.get('tagline') ?? ''),
    description: String(formData.get('description') ?? ''),
    content: String(formData.get('content') ?? ''),
    techStack: String(formData.get('techStack') ?? ''),
    liveUrl: String(formData.get('liveUrl') ?? ''),
    githubUrl: String(formData.get('githubUrl') ?? ''),
    featured: formData.get('featured') === 'on',
  };
  return projectSchema.safeParse(raw);
}

async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title) || 'project';
  let slug = base;
  let n = 1;
  // Small, bounded loop — fine for a personal-portfolio scale of data.
  while (
    await prisma.project.findFirst({
      where: { slug, ...(ignoreId ? { NOT: { id: ignoreId } } : {}) },
    })
  ) {
    n += 1;
    slug = `${base}-${n}`;
  }
  return slug;
}

export async function createProject(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();
  const parsed = readInput(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? 'Invalid project data';
  const data = parsed.data;

  try {
    const image = formData.get('image');
    const imageUrl = image instanceof File && image.size > 0 ? await storeImage(image, 'projects') : undefined;

    const count = await prisma.project.count();

    await prisma.project.create({
      data: {
        title: data.title,
        slug: await uniqueSlug(data.title),
        tagline: data.tagline,
        description: data.description,
        content: data.content || null,
        techStack: data.techStack || '',
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl,
        featured: data.featured ?? false,
        order: count,
      },
    });
  } catch (err) {
    return err instanceof Error ? err.message : 'Something went wrong.';
  }

  revalidatePath('/');
  revalidatePath('/dashboard/projects');
}

export async function updateProject(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();
  const parsed = readInput(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? 'Invalid project data';
  const data = parsed.data;

  try {
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) return 'Project not found.';

    const image = formData.get('image');
    const imageUrl =
      image instanceof File && image.size > 0 ? await storeImage(image, 'projects') : existing.imageUrl;

    const slug = data.title === existing.title ? existing.slug : await uniqueSlug(data.title, id);

    await prisma.project.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        tagline: data.tagline,
        description: data.description,
        content: data.content || null,
        techStack: data.techStack || '',
        liveUrl: data.liveUrl || null,
        githubUrl: data.githubUrl || null,
        imageUrl,
        featured: data.featured ?? false,
      },
    });
  } catch (err) {
    return err instanceof Error ? err.message : 'Something went wrong.';
  }

  revalidatePath('/');
  revalidatePath('/dashboard/projects');
}

export async function deleteProject(id: string) {
  await requireAdmin();
  await prisma.project.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/dashboard/projects');
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.project.update({ where: { id }, data: { order: index } })),
  );
  revalidatePath('/');
  revalidatePath('/dashboard/projects');
}
