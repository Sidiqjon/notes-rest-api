import fs from 'fs/promises';
import path from 'path';
import { Note } from '../types/note';

const DATA_FILE = path.join(__dirname, '../data/notes.json');

async function ensureDataFile(): Promise<void> {
  try {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to ensure data file: ${error}`);
  }
}

export async function readNotes(): Promise<Note[]> {
  try {
    await ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data) as Note[];
  } catch (error) {
    console.error('Error reading notes:', error);
    return [];
  }
}

export async function writeNotes(notes: Note[]): Promise<void> {
  try {
    await ensureDataFile();
    await fs.writeFile(
      DATA_FILE,
      JSON.stringify(notes, null, 2),
      'utf-8'
    );
  } catch (error) {
    throw new Error(`Failed to write notes: ${error}`);
  }
}

ensureDataFile().catch(console.error);