import { v4 as uuidv4 } from 'uuid';
import { 
  Note, 
  CreateNoteDto, 
  UpdateNoteDto, 
  NoteQueryParams, 
  PaginatedResponse,
  AppError 
} from '../types/note';
import { readNotes, writeNotes } from '../utils/file.helper';

/**
 * Service layer for note operations
 * 
 * WHY SERVICE LAYER:
 * - Separates business logic from HTTP concerns (controllers)
 * - Reusable - can be called from controllers, CLI, tests, etc.
 * - Easier to test - no Express dependencies
 * - Single Responsibility Principle
 * 
 * ARCHITECTURE FLOW:
 * Route -> Controller (HTTP) -> Service (Logic) -> Utils (Storage)
 */
class NoteService {
  /**
   * Get current time in Uzbekistan timezone (UTC+5)
   * Returns ISO 8601 formatted string
   * 
   * WHY THIS METHOD:
   * - Ensures all timestamps are in Uzbekistan timezone
   * - Prevents confusion with server timezone
   * - ISO format is JSON-compatible and universally parseable
   */
  private getUzbekistanTime(): string {
    const now = new Date();
    // Add 5 hours for Uzbekistan timezone (UTC+5)
    const uzbekTime = new Date(now.getTime() + (5 * 60 * 60 * 1000));
    return uzbekTime.toISOString();
  }
  /**
   * Create a new note
   * 
   * LOGIC:
   * 1. Generate UUID for unique ID
   * 2. Create timestamp in Uzbekistan timezone (UTC+5)
   * 3. Read existing notes
   * 4. Add new note
   * 5. Write back to storage
   * 
   * WHY ASYNC:
   * - File I/O operations are async
   * - Allows server to handle other requests during I/O
   */
  async createNote(dto: CreateNoteDto): Promise<Note> {
    const now = this.getUzbekistanTime();
    
    const newNote: Note = {
      id: uuidv4(), // UUID ensures uniqueness
      title: dto.title,
      content: dto.content,
      createdAt: now,
      updatedAt: now
    };

    const notes = await readNotes();
    notes.push(newNote);
    await writeNotes(notes);

    return newNote;
  }

  /**
   * Get all notes with optional pagination and search
   * 
   * PAGINATION LOGIC:
   * - Default: page=1, limit=10
   * - Calculate skip = (page - 1) * limit
   * - Return slice of data + metadata
   * 
   * SEARCH LOGIC:
   * - Case-insensitive search in title and content
   * - Uses toLowerCase() for matching
   * 
   * WHY PAGINATION:
   * - Prevents loading all notes at once
   * - Essential for scalability
   * - If 1000 users with 1000 notes each, returning all would crash
   */
  async getAllNotes(params: NoteQueryParams): Promise<PaginatedResponse<Note>> {
    const { page = 1, limit = 10, search } = params;
    
    let notes = await readNotes();

    // Apply search filter if provided
    if (search && search.trim()) {
      const searchLower = search.toLowerCase();
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      );
    }

    // Calculate pagination
    const total = notes.length;
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const paginatedNotes = notes.slice(skip, skip + limit);

    return {
      data: paginatedNotes,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  /**
   * Get single note by ID
   * 
   * ERROR HANDLING:
   * - Throws AppError with 404 if note not found
   * - Controller catches and error middleware handles
   */
  async getNoteById(id: string): Promise<Note> {
    const notes = await readNotes();
    const note = notes.find(n => n.id === id);

    if (!note) {
      throw new AppError(404, `Note with id ${id} not found`);
    }

    return note;
  }

  /**
   * Update existing note (partial update)
   * 
   * PARTIAL UPDATE LOGIC:
   * - Only updates provided fields (title, content)
   * - Always updates updatedAt timestamp in Uzbekistan time (UTC+5)
   * - Preserves other fields
   * 
   * WHY THIS APPROACH:
   * - Flexible - can update just title or just content
   * - Follows REST PATCH semantics (not PUT)
   * - User-friendly API
   */
  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    const notes = await readNotes();
    const index = notes.findIndex(n => n.id === id);

    if (index === -1) {
      throw new AppError(404, `Note with id ${id} not found`);
    }

    // Partial update - only modify provided fields
    const updatedNote: Note = {
      ...notes[index],
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
      updatedAt: this.getUzbekistanTime()
    };

    notes[index] = updatedNote;
    await writeNotes(notes);

    return updatedNote;
  }

  /**
   * Delete note by ID
   * 
   * RETURN VALUE:
   * - Returns deleted note for confirmation
   * - Useful for undo functionality
   * - Confirms what was actually deleted
   */
  async deleteNote(id: string): Promise<Note> {
    const notes = await readNotes();
    const index = notes.findIndex(n => n.id === id);

    if (index === -1) {
      throw new AppError(404, `Note with id ${id} not found`);
    }

    const deletedNote = notes[index];
    notes.splice(index, 1);
    await writeNotes(notes);

    return deletedNote;
  }
}

// Export singleton instance
export default new NoteService();