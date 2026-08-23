import { prisma } from '@/lib/db';
import EventManagerList from './EventManagerList';

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { order: 'asc' } });

  const managed = events.map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    story: e.story ?? '',
    category: e.category,
    date: e.date ? e.date.toISOString().slice(0, 10) : '',
    location: e.location ?? '',
    imageUrl: e.imageUrl,
  }));

  return <EventManagerList events={managed} />;
}
