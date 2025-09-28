import { config } from 'dotenv';
config();

import '@/ai/flows/ai-summarization.ts';
import '@/ai/flows/ai-tag-suggestions.ts';
import '@/ai/flows/grammar-check.ts';
import '@/ai/flows/ai-glossary-highlighting.ts';