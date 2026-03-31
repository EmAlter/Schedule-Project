// src/utils/constants.ts
import type { Block } from '../types';

export const BIBLE_BOOKS = [
  // Old Testament
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra', 'Nehemiah',
  'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
  'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos', 'Obadiah',
  'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  // New Testament
  'Matthew', 'Mark', 'Luke', 'John', 'Acts of the Apostles', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export const AVAILABLE_LANGUAGES = [
  { code: 'it', label: 'ITA' },
  { code: 'gb', label: 'ENG' },
  { code: 'fr', label: 'FRA' },
  { code: 'es', label: 'ESP' },
  { code: 'de', label: 'DEU' },
  { code: 'pt', label: 'PRT' },
  { code: 'ro', label: 'ROU' },
  { code: 'gh', label: 'GHA' },
  { code: 'et', label: 'ETH' },
  { code: 'nl', label: 'NLD' },
  { code: 'ru', label: 'RUS' },
  { code: 'cn', label: 'CHN' }
];

export const generateDefaultSchedule = (): Block[] => [
  {
    id: crypto.randomUUID(),
    time: '10:00',
    type: 'standard',
    title: 'Welcome and Opening',
    details: 'Greet: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'verse',
    title: 'Bible Reading',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Song',
    lastModifiedBy: 'System'
  }
];