"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

interface PasswordDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  onSetPassword: (password: string) => void;
  onRemovePassword?: () => void;
  isEncrypted?: boolean;
  mode: 'set' | 'enter' | 'remove';
  title: string;
  description: string;
}

const formSchema = z.object({
  password: z.string().min(4, 'Password must be at least 4 characters.'),
});

export const PasswordDialog = ({
  isOpen,
  onOpenChange,
  onSetPassword,
  onRemovePassword,
  isEncrypted,
  mode,
  title,
  description
}: PasswordDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onSetPassword(values.password);
    onOpenChange?.(false);
    form.reset();
  }
  
  if (mode === 'remove') {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">Are you sure you want to remove password protection for this note?</p>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={() => {
                        onRemovePassword?.();
                        onOpenChange?.(false);
                    }}>Remove Protection</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => onOpenChange?.(false)}>Cancel</Button>
                <Button type="submit">Confirm</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
