"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Note } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'notecraft-notes';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const items = window.localStorage.getItem(STORAGE_KEY);
      if (items) {
        setNotes(JSON.parse(items));
      }
    } catch (error) {
      console.error('Failed to load notes from local storage:', error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes to local storage:', error);
      }
    }
  }, [notes, isLoaded]);

  const addNote = useCallback(() => {
    const newNote: Note = {
      id: uuidv4(),
      title: 'New Note',
      content: '<p>Start writing your note...</p>',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      isPinned: false,
      isEncrypted: false,
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    return newNote;
  }, []);

  const updateNote = useCallback((updatedNote: Partial<Note> & { id: string }) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === updatedNote.id
          ? { ...note, ...updatedNote, updatedAt: Date.now() }
          : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  const pinNote = useCallback((id:string) => {
    setNotes(prevNotes => 
        prevNotes.map(note => 
            note.id === id ? {...note, isPinned: !note.isPinned} : note
        )
    );
  }, []);

  return { notes, addNote, updateNote, deleteNote, pinNote, isLoaded };
}
