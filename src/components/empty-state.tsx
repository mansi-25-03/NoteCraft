"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from './ui/button';
import { FilePlus2 } from 'lucide-react';

interface EmptyStateProps {
  onNewNote: () => void;
}

export const EmptyState = ({ onNewNote }: EmptyStateProps) => {
  const emptyStateImage = PlaceHolderImages.find(img => img.id === 'empty-state');

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
      {emptyStateImage && (
         <div className="relative h-64 w-full max-w-md">
            <Image
              src={emptyStateImage.imageUrl}
              alt={emptyStateImage.description}
              fill
              className="rounded-lg object-cover"
              data-ai-hint={emptyStateImage.imageHint}
            />
         </div>
      )}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold font-headline">Welcome to NoteCraft</h2>
        <p className="max-w-md text-muted-foreground">
          Select a note from the list to start editing, or create a new one to capture your thoughts.
        </p>
      </div>
      <Button onClick={onNewNote}>
        <FilePlus2 className="mr-2 h-4 w-4" />
        Create a New Note
      </Button>
    </div>
  );
};
