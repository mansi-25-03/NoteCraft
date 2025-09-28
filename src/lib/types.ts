export interface Note {
  id: string;
  title: string;
  content: string; // HTML content from the editor
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  isPinned: boolean;
  isEncrypted: boolean;
  password?: string;
  summary?: string;
  tags?: string[];
}
