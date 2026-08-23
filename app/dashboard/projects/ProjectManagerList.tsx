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
import ProjectForm from './ProjectForm';
import { createProject, updateProject, deleteProject, reorderProjects } from '@/lib/actions/projects';

export type ManagedProject = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  content: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
  imageUrl: string | null;
  featured: boolean;
};

function SortableItem({ id, children }: { id: string; children: (handleProps: Record<string, unknown>) => React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  return (
    <li ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }}>
      {children({ ...attributes, ...listeners })}
    </li>
  );
}

export default function ProjectManagerList({ projects: initial }: { projects: ManagedProject[] }) {
  const router = useRouter();
  const [projects, setProjects] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  // `initial` is only used to seed state on mount — resync whenever the
  // server gives us a fresh copy (e.g. after router.refresh() below), so a
  // create/edit doesn't require a manual page reload to show up here.
  // ("Adjusting state during render" per https://react.dev/learn/you-might-not-need-an-effect
  //  instead of an effect, so it commits in the same render instead of flashing stale data.)
  const [prevInitial, setPrevInitial] = useState(initial);
  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setProjects(initial);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setProjects((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      const next = arrayMove(items, oldIndex, newIndex);
      reorderProjects(next.map((i) => i.id)).catch(() => toast.error('Could not save the new order.'));
      return next;
    });
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    const prev = projects;
    setProjects((items) => items.filter((i) => i.id !== id));
    try {
      await deleteProject(id);
      toast.success('Project deleted.');
    } catch {
      setProjects(prev);
      toast.error('Failed to delete project.');
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <button
          onClick={() => setCreating((v) => !v)}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white"
        >
          {creating ? 'Cancel' : '+ Add project'}
        </button>
      </div>

      {creating && (
        <div className="mb-10 rounded-2xl border border-black/10 bg-white p-6">
          <ProjectForm
            action={createProject}
            submitLabel="Add project"
            onSuccess={() => {
              setCreating(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {projects.length === 0 && !creating && (
        <p className="text-black/50">No projects yet — add your first one above.</p>
      )}

      <DndContext id="projects-list" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
          <ul className="space-y-3">
            {projects.map((p) => (
              <SortableItem key={p.id} id={p.id}>
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
                      {p.imageUrl && (
                        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                          <Image src={p.imageUrl} alt="" fill className="object-cover" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-semibold">{p.title}</div>
                        <div className="truncate text-sm text-black/50">{p.tagline}</div>
                      </div>
                      <button
                        onClick={() => setEditingId(editingId === p.id ? null : p.id)}
                        className="shrink-0 text-sm font-medium text-[#ff5a1f]"
                      >
                        {editingId === p.id ? 'Close' : 'Edit'}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="shrink-0 text-sm font-medium text-red-600"
                      >
                        Delete
                      </button>
                    </div>

                    {editingId === p.id && (
                      <div className="mt-5 border-t border-black/10 pt-5">
                        <ProjectForm
                          action={updateProject.bind(null, p.id)}
                          defaultValues={p}
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
