"use client";

import type { Note } from '@/lib/types';
import { NoteItem } from './note-item';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';
import { NotebookPen } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  selectedNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string) => void;
  onPinNote: (id: string) => void;
}

export const NotesList = ({ notes, selectedNoteId, onSelectNote, onDeleteNote, onPinNote }: NotesListProps) => {
  const sortedNotes = useMemo(() => {
    return [...notes].sort((a, b) => {
      if (a.isPinned !== b.isPinned) {
        return a.isPinned ? -1 : 1;
      }
      return b.updatedAt - a.updatedAt;
    });
  }, [notes]);
  
  const pinnedNotes = sortedNotes.filter(n => n.isPinned);
  const otherNotes = sortedNotes.filter(n => !n.isPinned);

  if (notes.length === 0) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center text-muted-foreground">
            <NotebookPen className="h-12 w-12" />
            <p className="text-lg font-medium">No Notes Yet</p>
            <p className="max-w-xs text-sm">Create your first note to get started!</p>
        </div>
    );
  }

  return (
    <ScrollArea className="h-full flex-1">
      <div className="p-4 pt-0">
        {pinnedNotes.length > 0 && (
          <div className="mb-4">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Pinned</h3>
            <div className="space-y-2">
              {pinnedNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  onSelect={onSelectNote}
                  onDelete={onDeleteNote}
                  onPin={onPinNote}
                />
              ))}
            </div>
          </div>
        )}
        
        {otherNotes.length > 0 && (
          <div>
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Notes</h3>
            <div className="space-y-2">
              {otherNotes.map((note) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  isSelected={note.id === selectedNoteId}
                  onSelect={onSelectNote}
                  onDelete={onDeleteNote}
                  onPin={onPinNote}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
