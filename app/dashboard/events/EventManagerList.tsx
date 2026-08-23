'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { toast } from 'sonner';
import EventForm from './EventForm';
import { createEvent, updateEvent, deleteEvent, reorderEvents } from '@/lib/actions/events';

export type ManagedEvent = {
  id: string;
  title: string;
  description: string;
  story: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string | null;
};

function SortableItem({ id, children }: { id: string; children: (handleProps: Record<string, unknown>) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      {children({ ...attributes, ...listeners })}
    </li>
  );
}

export default function EventManagerList({ events: initial }: { events: ManagedEvent[] }) {
  const router = useRouter();
  const [events, setEvents] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // `initial` only seeds state on mount — resync when the server gives a
  // fresh copy (after router.refresh() below) so create/edit shows up
  // without a manual reload. Adjusting state during render (React docs'
  // pattern for this) instead of an effect, so it's not a render behind.
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setEvents(initial);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setEvents((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex);
      reorderEvents(next.map((i) => i.id)).catch(() => toast.error('Could not save the new order.'));
      return next;
    });
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    const prev = events;
    setEvents((items) => items.filter((i) => i.id !== id));
    try {
      await deleteEvent(id);
      toast.success('Event deleted.');
    } catch {
      setEvents(prev);
      toast.error('Failed to delete event.');
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events</h1>
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
        >
          {creating ? 'Cancel' : '+ Add event'}
        </button>
      </div>

      {creating && (
        <div className="mb-10 rounded-2xl border border-black/10 bg-white p-6">
          <EventForm
            action={createEvent}
            submitLabel="Add event"
            onSuccess={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {events.length === 0 && !creating && (
        <p className="text-black/50">No events yet — add your first one above.</p>
      )}

      <DndContext id="events-list" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={events.map((e) => e.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {events.map((e) => (
              <SortableItem key={e.id} id={e.id}>
                {(handleProps) => (
                  <div className="rounded-2xl border border-black/10 bg-white p-5">
                    <div className="flex items-start gap-4">
                      <button
                        {...handleProps}
                        className="mt-1 cursor-grab touch-none text-lg text-black/30 active:cursor-grabbing"
                        aria-label="Drag to reorder"
                      >
                        ⠿
                      </button>
                      {e.imageUrl && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                          <Image src={e.imageUrl} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{e.title}</div>
                        <div className="truncate text-sm text-black/50">
                          {e.category}
                          {e.location ? ` · ${e.location}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingId(editingId === e.id ? null : e.id)}
                        className="shrink-0 text-sm font-medium text-[#ff5a1f]"
                      >
                        {editingId === e.id ? 'Close' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(e.id, e.title)}
                        className="shrink-0 text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>

                    {editingId === e.id && (
                      <div className="mt-5 border-t border-black/10 pt-5">
                        <EventForm
                          action={updateEvent.bind(null, e.id)}
                          defaultValues={e}
                          submitLabel="Save changes"
                          onSuccess={() => {
                            setEditingId(null);
                            router.refresh();
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
