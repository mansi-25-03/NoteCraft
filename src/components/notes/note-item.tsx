"use client";

import type { Note } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Pin, Trash2, Lock, PinOff } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { formatDistanceToNow } from 'date-fns';

interface NoteItemProps {
  note: Note;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onPin: (id: string) => void;
}

export const NoteItem = ({ note, isSelected, onSelect, onDelete, onPin }: NoteItemProps) => {
  
  const plainTextContent = note.content.replace(/<[^>]*>/g, '');

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };
  
  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPin(note.id);
  };

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all duration-200 hover:border-primary',
        isSelected && 'border-primary bg-primary/10'
      )}
      onClick={() => onSelect(note.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-headline font-semibold">{note.title}</h3>
          <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
             <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handlePin}>
              {note.isPinned ? <PinOff className="h-4 w-4 text-primary" /> : <Pin className="h-4 w-4" />}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your note.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {note.isEncrypted ? 'This note is encrypted.' : plainTextContent}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
           {note.isEncrypted && <Lock className="h-3 w-3" />}
           <time dateTime={new Date(note.updatedAt).toISOString()}>
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </time>
        </div>
      </CardContent>
    </Card>
  );
};
