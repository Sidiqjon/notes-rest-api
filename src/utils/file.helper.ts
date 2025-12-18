import fs from 'fs/promises';
import path from 'path';
import { Note } from '../types/note';

const DATA_FILE = path.join(__dirname, '../data/notes.json');

/**
 * Ensures the data directory and file exist
 * Creates them if they don't exist
 * 
 * WHY ASYNC: File I/O is blocking operation - async prevents blocking event loop
 */
async function ensureDataFile(): Promise<void> {
  try {
    const dir = path.dirname(DATA_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    try {
      await fs.access(DATA_FILE);
    } catch {
      // File doesn't exist, create it with empty array
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to ensure data file: ${error}`);
  }
}

/**
 * Reads all notes from JSON file
 * 
 * IMPORTANT: This is where async behavior matters!
 * - Under high load, multiple requests could read simultaneously
 * - Async allows Node.js to handle other requests while waiting for I/O
 * - Without async, the entire server would block on each file read
 * 
 * POTENTIAL RACE CONDITION:
 * If 2 requests read simultaneously, then both write, last write wins
 * Solution for production: Use proper database with ACID guarantees
 */
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

/**
 * Writes notes array to JSON file
 * 
 * WHY ASYNC MATTERS HERE:
 * - Writing large JSON files can be slow
 * - Async prevents blocking other API requests
 * - Server remains responsive during write operations
 * 
 * UNDER LOAD SCENARIO (1000+ users):
 * - Multiple concurrent writes = race condition
 * - File could be corrupted or data lost
 * - Production solution: Queue writes or use database
 */
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

/**
 * Initialize data file on module load
 * Ensures file exists before any operations
 */
ensureDataFile().catch(console.error);