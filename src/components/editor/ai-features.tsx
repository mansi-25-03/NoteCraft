"use client";

import { Button } from "../ui/button";
import { Sparkles, Tags, SpellCheck, BookOpen } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast";
import { summarizeNote } from "@/ai/flows/ai-summarization";
import { suggestTags } from "@/ai/flows/ai-tag-suggestions";
import { grammarCheck } from "@/ai/flows/grammar-check";
import { aiGlossaryHighlighting } from "@/ai/flows/ai-glossary-highlighting";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";

interface AIFeaturesProps {
  noteContent: string;
  onUpdateNote: (newContent: string) => void;
}

export const AIFeatures = ({ noteContent, onUpdateNote }: AIFeaturesProps) => {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [summary, setSummary] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    
    const handleAction = async (action: string, fn: () => Promise<any>) => {
        setIsLoading(prev => ({ ...prev, [action]: true }));
        try {
            await fn();
        } catch(error) {
            console.error(`${action} failed:`, error);
            toast({
                variant: "destructive",
                title: "AI Feature Failed",
                description: `Could not perform ${action}. Please try again.`,
            });
        } finally {
            setIsLoading(prev => ({ ...prev, [action]: false }));
        }
    }

    const handleSummarize = () => handleAction('summary', async () => {
        const plainText = noteContent.replace(/<[^>]*>/g, '');
        const result = await summarizeNote({ noteContent: plainText });
        setSummary(result.summary);
        toast({ title: "Summary Generated!" });
    });

    const handleSuggestTags = () => handleAction('tags', async () => {
        const plainText = noteContent.replace(/<[^>]*>/g, '');
        const result = await suggestTags({ noteContent: plainText });
        setTags(result.tags);
        toast({ title: "Tags Suggested!" });
    });

    const handleGrammarCheck = () => handleAction('grammar', async () => {
        const plainText = noteContent.replace(/<[^>]*>/g, '');
        const { correctedText, explanation } = await grammarCheck({ text: plainText });
        
        toast({
            title: "Grammar Check Complete",
            description: (
                <div>
                    <p className="font-bold">Suggested correction:</p>
                    <p className="mt-2 rounded-md bg-muted p-2">{correctedText}</p>
                    <p className="mt-2 font-bold">Explanation:</p>
                    <p className="mt-1">{explanation}</p>
                </div>
            )
        });
    });

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleSummarize} disabled={isLoading.summary}>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Summarize
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                    <h4 className="font-medium leading-none">AI Summary</h4>
                    <Separator className="my-2" />
                    {isLoading.summary ? <Skeleton className="h-10 w-full" /> : 
                    <p className="text-sm text-muted-foreground">{summary || "Click 'Summarize' to generate a summary."}</p>}
                </PopoverContent>
            </Popover>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" onClick={handleSuggestTags} disabled={isLoading.tags}>
                        <Tags className="mr-2 h-4 w-4" />
                        Suggest Tags
                    </Button>
                </PopoverTrigger>
                <PopoverContent>
                     <h4 className="font-medium leading-none">Suggested Tags</h4>
                    <Separator className="my-2" />
                    {isLoading.tags ? <Skeleton className="h-10 w-full" /> : 
                    <div className="flex flex-wrap gap-2">
                       {tags.length > 0 ? tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>) : <p className="text-sm text-muted-foreground">Click 'Suggest Tags' to get ideas.</p>}
                    </div>}
                </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" onClick={handleGrammarCheck} disabled={isLoading.grammar}>
                <SpellCheck className="mr-2 h-4 w-4" />
                Grammar Check
            </Button>
        </div>
    );
};
