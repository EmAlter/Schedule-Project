export type BlockType = 'standard' | 'song' | 'verse';

// Interface for a verse reference, including book, chapter, and verses
export interface VerseReference {
  book: string;
  chapter: string;
  verses: string;
}

// Interface for a reader of a verse block, including their name and the language they will read in
export interface Reader {
  name: string;
  languageCode: string; // Es. 'it'
  languageLabel: string; // Es. 'ITA'
}

// Main interface for a schedule block, which can be of different types (standard, song, verse) and includes common properties like id, title, time, details, and last modified by. It also includes optional properties specific to verse blocks (verseReferences and readers).
export interface Block {
  id: string;
  type: BlockType;
  title: string;
  time?: string;
  details?: string;
  lastModifiedBy: string;
  verseReferences?: VerseReference[];
  readers?: Reader[];
}