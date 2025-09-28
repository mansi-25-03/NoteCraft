"use client";

import * as React from 'react';
import { useState, useMemo } from 'react';
import { useNotes } from '@/hooks/use-notes';
import type { Note } from '@/lib/types';

import { NotesList } from '@/components/notes/notes-list';
import { NoteEditor } from '@/components/editor/note-editor';
import { Header } from '@/components/header';
import { SearchBar } from '@/components/search-bar';
import { EmptyState } from '@/components/empty-state';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';

export default function Home() {
  const { notes, addNote, updateNote, deleteNote, pinNote } = useNotes();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useIsMobile();

  const handleNewNote = () => {
    const newNote = addNote();
    setSelectedNoteId(newNote.id);
  };

  const handleSelectNote = (id: string) => {
    setSelectedNoteId(id);
  };

  const filteredNotes = useMemo(() => {
    if (!searchTerm) return notes;
    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [notes, searchTerm]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );
  
  const editorVisible = selectedNote && (!isMobile || (isMobile && selectedNoteId));
  const listVisible = !isMobile || (isMobile && !selectedNoteId);

  return (
    <div className="flex h-screen flex-col bg-background font-body">
      <Header onNewNote={handleNewNote} />
      <main className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            'flex-shrink-0 border-r border-border transition-all duration-300 md:w-1/3 lg:w-1/4',
            listVisible ? 'w-full' : 'w-0'
          )}
        >
          <div className="flex h-full flex-col">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <NotesList
              notes={filteredNotes}
              selectedNoteId={selectedNoteId}
              onSelectNote={handleSelectNote}
              onDeleteNote={deleteNote}
              onPinNote={pinNote}
            />
          </div>
        </div>

        <div className={cn('flex-1 transition-all duration-300', editorVisible ? 'w-full md:w-2/3 lg:w-3/4' : 'w-0')}>
          {selectedNote ? (
            <NoteEditor
              key={selectedNote.id}
              note={selectedNote}
              onSave={updateNote}
              onClose={() => setSelectedNoteId(null)}
            />
          ) : (
            <div className={cn('h-full', isMobile ? 'hidden' : 'flex')}>
              <EmptyState onNewNote={handleNewNote} />
            </div>
          )}
        </div>
      </main>
      <Toaster />
    </div>
  );
}
