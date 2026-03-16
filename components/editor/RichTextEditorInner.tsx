'use client';

import React, { useCallback } from 'react';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export interface RichTextEditorInnerProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const EDITOR_CONFIG: any = {
  toolbar: [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'blockQuote',
    'insertTable',
    '|',
    'undo',
    'redo',
  ],
  heading: {
    options: [
      { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
      { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
      { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
      { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
    ],
  },
  table: {
    contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells'],
  },
};

export function RichTextEditorInner({
  value,
  onChange,
  placeholder,
  readOnly = false,
  className,
}: RichTextEditorInnerProps) {

  const handleChange = useCallback(
    (_event: unknown, editor: any) => {
      onChange(editor.getData());
    },
    [onChange]
  );

  return (
    <div className={className}>
      <CKEditor
        editor={ClassicEditor as any}
        data={value}
        config={{
          ...(EDITOR_CONFIG as any),
          placeholder,
        }}
        onChange={handleChange}
        disabled={readOnly}
      />
    </div>
  );
}