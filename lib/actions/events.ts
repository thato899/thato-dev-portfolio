'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { storeImage } from '@/lib/storage';
import { eventSchema } from '@/lib/validation';

async function requireAdmin() {
  const session = await auth();
  if (!session) throw new Error('Unauthorized');
}

function readInput(formData: FormData) {
  const raw = {
    title: String(formData.get('title') ?? ''),
    description: String(formData.get('description') ?? ''),
    story: String(formData.get('story') ?? ''),
    category: String(formData.get('category') ?? 'Community Outreach'),
    date: String(formData.get('date') ?? ''),
    location: String(formData.get('location') ?? ''),
  };
  return eventSchema.safeParse(raw);
}

export async function createEvent(
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();
  const parsed = readInput(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? 'Invalid event data';
  const data = parsed.data;

  try {
    const image = formData.get('image');
    const imageUrl = image instanceof File && image.size > 0 ? await storeImage(image, 'events') : undefined;

    const count = await prisma.event.count();

    await prisma.event.create({
      data: {
        title: data.title,
        description: data.description,
        story: data.story || null,
        category: data.category,
        date: data.date ? new Date(data.date) : null,
        location: data.location || null,
        imageUrl,
        order: count,
      },
    });
  } catch (err) {
    return err instanceof Error ? err.message : 'Something went wrong.';
  }

  revalidatePath('/');
  revalidatePath('/dashboard/events');
}

export async function updateEvent(
  id: string,
  _prevState: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  await requireAdmin();
  const parsed = readInput(formData);
  if (!parsed.success) return parsed.error.issues[0]?.message ?? 'Invalid event data';
  const data = parsed.data;

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) return 'Event not found.';

    const image = formData.get('image');
    const imageUrl =
      image instanceof File && image.size > 0 ? await storeImage(image, 'events') : existing.imageUrl;

    await prisma.event.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        story: data.story || null,
        category: data.category,
        date: data.date ? new Date(data.date) : null,
        location: data.location || null,
        imageUrl,
      },
    });
  } catch (err) {
    return err instanceof Error ? err.message : 'Something went wrong.';
  }

  revalidatePath('/');
  revalidatePath('/dashboard/events');
}

export async function deleteEvent(id: string) {
  await requireAdmin();
  await prisma.event.delete({ where: { id } });
  revalidatePath('/');
  revalidatePath('/dashboard/events');
}

export async function reorderEvents(orderedIds: string[]) {
  await requireAdmin();
  await prisma.$transaction(
    orderedIds.map((id, index) => prisma.event.update({ where: { id }, data: { order: index } })),
  );
  revalidatePath('/');
  revalidatePath('/dashboard/events');
}
