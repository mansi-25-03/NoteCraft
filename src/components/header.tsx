"use client";

import { NoteCraftLogo } from './notecraft-logo';
import { Button } from './ui/button';
import { FilePlus2 } from 'lucide-react';

interface HeaderProps {
  onNewNote: () => void;
}

export const Header = ({ onNewNote }: HeaderProps) => {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-border px-4 md:px-6">
      <NoteCraftLogo />
      <Button onClick={onNewNote} size="sm">
        <FilePlus2 className="mr-2 h-4 w-4" />
        New Note
      </Button>
    </header>
  );
};
