'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { EVENT_CATEGORIES } from '@/lib/validation';

export type EventFormValues = {
  title: string;
  description: string;
  story: string;
  category: string;
  date: string;
  location: string;
  imageUrl: string | null;
};

const EMPTY: EventFormValues = {
  title: '',
  description: '',
  story: '',
  category: EVENT_CATEGORIES[0],
  date: '',
  location: '',
  imageUrl: null,
};

export default function EventForm({
  action,
  defaultValues,
  submitLabel,
  onSuccess,
}: {
  action: (prevState: string | undefined, formData: FormData) => Promise<string | undefined>;
  defaultValues?: Partial<EventFormValues>;
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
      <Field label="Title" name="title" defaultValue={values.title} required />
      <TextArea label="Short description" name="description" defaultValue={values.description} required rows={2} />
      <TextArea label="Full story (optional)" name="story" defaultValue={values.story} rows={4} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="category" className="mb-1 block text-sm font-medium text-black/70">
            Category
          </label>
          <select
            id="category"
            name="category"
            defaultValue={values.category}
            className="w-full rounded-lg border border-black/15 px-3 py-2 text-sm outline-none focus:border-[#ff5a1f]"
          >
            {EVENT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <Field label="Date" name="date" type="date" defaultValue={values.date} />
        <Field label="Location" name="location" defaultValue={values.location} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-black/70">Photo</label>
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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  type?: string;
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
