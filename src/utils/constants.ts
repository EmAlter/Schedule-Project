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
    title: 'Congregation Standing Song',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Sabbath School Opening Prayer',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Sabbath School',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '10:50',
    type: 'standard',
    title: 'Mission Video',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Sabbath Offerings Hymn',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Prayer',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '11:00',
    type: 'standard',
    title: 'Announcements',
    details: 'Presented by: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Preparation (Song 1)',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Preparation (Song 2)',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '11:15',
    type: 'standard',
    title: 'Entrance and Invocation',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Standing Doxology',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '11:20',
    type: 'standard',
    title: 'Children Message',
    details: 'Presented by: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Congregation Standing Song',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '11:30',
    type: 'verse',
    title: 'Bible Reading',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Prayer',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Special Song',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Sermon',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Closing Sermon Prayer',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '12:00',
    type: 'song',
    title: 'Offering Hymn',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Offering Prayer',
    details: 'By: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'song',
    title: 'Congregation Standing Song',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    type: 'standard',
    title: 'Blessing',
    details: 'Pastor/Elder: ',
    lastModifiedBy: 'System'
  },
  {
    id: crypto.randomUUID(),
    time: '12:15',
    type: 'song',
    title: 'Exit Music',
    lastModifiedBy: 'System'
  }
];