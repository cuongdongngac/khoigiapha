'use client';

import dynamic from 'next/dynamic';
import type { RichTextEditorInnerProps } from './RichTextEditorInner';

const RichTextEditorInner = dynamic(
  () => import('./RichTextEditorInner').then((mod) => mod.RichTextEditorInner),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-8"
        style={{ minHeight: 350 }}
      >
        <span className="text-sm text-gray-500">Loading editor...</span>
      </div>
    ),
  }
);

export interface RichTextEditorProps {
  /** Current HTML content. Use for initial value and controlled updates. For DB-loaded content, pass a unique `editorKey` when switching documents to remount with new content. */
  value: string;
  /** Called when content changes. Use with setState for controlled usage. */
  onChange: (value: string) => void;
  /** Placeholder text when editor is empty */
  placeholder?: string;
  /** When true, editor is read-only */
  readOnly?: boolean;
  /** Optional CSS class for the wrapper */
  className?: string;
  /** Optional key to force remount when content source changes (e.g. document ID). Use when loading different content from DB. */
  editorKey?: string | number;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className,
  editorKey,
}: RichTextEditorProps) {
  return (
    <RichTextEditorInner
      key={editorKey}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      className={className}
    />
  );
}
