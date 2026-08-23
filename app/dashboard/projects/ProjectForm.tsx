'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

export type ProjectFormValues = {
  title: string;
  tagline: string;
  description: string;
  content: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
  imageUrl: string | null;
};

const EMPTY: ProjectFormValues = {
  title: '',
  tagline: '',
  description: '',
  content: '',
  techStack: '',
  liveUrl: '',
  githubUrl: '',
  featured: false,
  imageUrl: null,
};

export default function ProjectForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  defaultValues?: Partial<ProjectFormValues>;
  submitLabel: string;
  onSuccess?: () => void;
}) {
  const values = { ...EMPTY, ...defaultValues };
  const [state, formAction, pending] = useActionState(action, undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const submittedRef = useRef(false);
  const [preview, setPreview] = useState<string | null>(values.imageUrl);

  useEffect(() => {
    if (!pending && submittedRef.current && state === undefined) {
      submittedRef.current = false;
      onSuccess?.();
    } else if (!pending) {
      submittedRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      onSubmit={() => {
        submittedRef.current = true;
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={values.title} required />
        <Field label="Tagline" name="tagline" defaultValue={values.tagline} required />
      </div>

      <TextArea label="Short description" name="description" defaultValue={values.description} required rows={2} />
      <TextArea label="Long description (optional)" name="content" defaultValue={values.content} rows={4} />

      <Field
        label="Tech stack (comma separated)"
        name="techStack"
        defaultValue={values.techStack}
        placeholder="Next.js, Prisma, PostgreSQL"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Live URL" name="liveUrl" type="url" defaultValue={values.liveUrl} />
        <Field label="GitHub URL" name="githubUrl" type="url" defaultValue={values.githubUrl} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-black/70">Cover image</label>
        <input
          type="file"
          name="image"
          accept="image/png,image/jpeg,image/gif,image/webp"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setPreview(URL.createObjectURL(file));
          }}
          className="block w-full text-sm file:mr-4 file:rounded-full file:border-0 file:bg-black/5 file:px-4 file:py-2 file:text-sm file:font-medium"
        />
        {preview && (
          <div className="relative mt-3 h-32 w-32 overflow-hidden rounded-lg">
            <Image src={preview} alt="Preview" fill className="object-cover" unoptimized={preview.startsWith('blob:')} />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" defaultChecked={values.featured} className="h-4 w-4" />
        Feature this project
      </label>

      {state && <p className="text-sm text-red-600">{state}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-[#ff5a1f] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c94517] disabled:opacity-60"
      >
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  required,
  type = 'text',
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-black/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#ff5a1f]"
      />
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  required,
  rows = 3,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium text-black/70">
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        defaultValue={defaultValue}
        rows={rows}
        className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#ff5a1f]"
      />
    </div>
  );
}
