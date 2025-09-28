"use client";

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  List,
  Pilcrow
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useEffect, useState } from 'react';

interface ToolbarProps {
  editorRef: React.RefObject<HTMLDivElement>;
  selection: Selection | null;
}

export const Toolbar = ({ editorRef, selection }: ToolbarProps) => {
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (selection) {
        setActiveFormats({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
        });
    }
  }, [selection]);


  const applyFormat = (command: string, value: string | null = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
    }
  };

  return (
    <div className="sticky top-0 z-10 flex items-center gap-1 border-b border-border bg-card p-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.bold && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('bold')}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.italic && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('italic')}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.underline && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('underline')}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.justifyLeft && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('justifyLeft')}
      >
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.justifyCenter && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('justifyCenter')}
      >
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn('h-8 w-8', activeFormats.justifyRight && 'bg-primary/20 text-primary')}
        onClick={() => applyFormat('justifyRight')}
      >
        <AlignRight className="h-4 w-4" />
      </Button>
      <Separator orientation="vertical" className="h-6 mx-1" />
       <Select onValueChange={(value) => applyFormat('formatBlock', value)}>
        <SelectTrigger className="w-auto h-8 border-none focus:ring-0 gap-1">
          <SelectValue placeholder="Style" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="p"><div className="flex items-center gap-2"><Pilcrow className="h-4 w-4" /> Paragraph</div></SelectItem>
            <SelectItem value="h1"><div className="flex items-center gap-2"><Heading1 className="h-4 w-4" /> Heading 1</div></SelectItem>
            <SelectItem value="h2"><div className="flex items-center gap-2"><Heading2 className="h-4 w-4" /> Heading 2</div></SelectItem>
            <SelectItem value="ul"><div className="flex items-center gap-2"><List className="h-4 w-4" /> Bullet List</div></SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
