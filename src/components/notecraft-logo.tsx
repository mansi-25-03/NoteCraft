import { Edit3 } from 'lucide-react';

export const NoteCraftLogo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-lg bg-primary p-2">
        <Edit3 className="h-6 w-6 text-primary-foreground" />
      </div>
      <h1 className="font-headline text-2xl font-bold tracking-tight text-foreground">
        NoteCraft
      </h1>
    </div>
  );
};
