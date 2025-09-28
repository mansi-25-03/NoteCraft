"use client";

import type { Note } from '@/lib/types';
import { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from './rich-text-editor';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, Save, Unlock } from 'lucide-react';
import { PasswordDialog } from './password-dialog';
import { AIFeatures } from './ai-features';
import { useIsMobile } from '@/hooks/use-mobile';
import { useToast } from '@/hooks/use-toast';

interface NoteEditorProps {
  note: Note;
  onSave: (note: Partial<Note> & { id: string }) => void;
  onClose: () => void;
}

export const NoteEditor = ({ note, onSave, onClose }: NoteEditorProps) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isLocked, setIsLocked] = useState(note.isEncrypted);
  const [password, setPassword] = useState(note.password);
  const [isUnlocked, setIsUnlocked] = useState(!note.isEncrypted);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSave = useCallback(() => {
    onSave({ id: note.id, title, content, isEncrypted: isLocked, password });
    toast({
        title: "Note Saved!",
        description: "Your changes have been saved successfully.",
      });
  }, [onSave, note.id, title, content, isLocked, password, toast]);

  const handleUnlock = (enteredPassword: string) => {
    if (enteredPassword === password) {
      setIsUnlocked(true);
      toast({
        title: "Note Unlocked",
        description: "You can now view and edit the note.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Incorrect Password",
        description: "Please try again.",
      });
    }
  };
  
  const handleSetPassword = (newPassword: string) => {
    setPassword(newPassword);
    setIsLocked(true);
    handleSave();
    toast({
        title: "Note Encrypted",
        description: "Your note is now password protected.",
      });
  };

  const handleRemovePassword = () => {
    setIsLocked(false);
    setPassword(undefined);
    onSave({id: note.id, title, content, isEncrypted: false, password: undefined})
    toast({
        title: "Encryption Removed",
        description: "Your note is no longer password protected.",
      });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== note.title || content !== note.content) {
        handleSave();
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, content, note.title, note.content, handleSave]);
  
  if (!isUnlocked) {
    return <PasswordDialog isOpen={true} onSetPassword={handleUnlock} mode="enter" title="Enter Password" description="This note is password protected. Please enter the password to view." />;
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-col p-4 md:p-6 space-y-4">
        <div className="flex items-center gap-4">
            {isMobile && (
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
            )}
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title"
            className="h-12 flex-1 border-0 bg-transparent px-0 text-2xl font-bold font-headline shadow-none focus-visible:ring-0 md:text-3xl"
          />
          <Button variant="ghost" size="icon" onClick={() => setIsPasswordDialogOpen(true)}>
             {isLocked ? <Lock className="h-5 w-5 text-primary" /> : <Unlock className="h-5 w-5" />}
          </Button>
          <Button onClick={handleSave} className="hidden md:flex">
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
        </div>
        <AIFeatures noteContent={content} onUpdateNote={setContent} />
      </div>

      <RichTextEditor value={content} onChange={setContent} />

      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onSetPassword={handleSetPassword}
        onRemovePassword={handleRemovePassword}
        isEncrypted={isLocked}
        mode={isLocked ? "remove" : "set"}
        title={isLocked ? "Manage Encryption" : "Set Password"}
        description={isLocked ? "Remove the password from this note." : "Protect this note with a password."}
      />
    </div>
  );
};
