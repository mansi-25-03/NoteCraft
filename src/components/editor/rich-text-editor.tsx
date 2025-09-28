"use client";

import { useRef, useEffect, useState } from 'react';
import { Toolbar } from './toolbar';
import { ScrollArea } from '../ui/scroll-area';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<Selection | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && value !== editor.innerHTML) {
      editor.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    const editor = editorRef.current;
    if (editor) {
      onChange(editor.innerHTML);
    }
  };

  const handleSelectionChange = () => {
    setSelection(document.getSelection());
  }

  useEffect(() => {
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
        <Toolbar editorRef={editorRef} selection={selection} />
        <ScrollArea className="flex-1">
            <div
                ref={editorRef}
                contentEditable
                onInput={handleInput}
                className="prose prose-lg h-full max-w-none p-4 md:p-8 text-base focus:outline-none"
                suppressContentEditableWarning={true}
            />
        </ScrollArea>
    </div>
  );
};
