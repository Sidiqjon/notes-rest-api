import { Request, Response } from 'express';
import noteService from '../services/note.service';
import { CreateNoteDto, UpdateNoteDto, NoteQueryParams } from '../types/note';
import { asyncHandler } from '../middlewares/error.middleware';

/**
 * Controller layer for handling HTTP requests
 * 
 * RESPONSIBILITIES:
 * - Extract data from request (body, params, query)
 * - Call service layer for business logic
 * - Format and send HTTP response
 * - Set appropriate status codes
 * 
 * WHY CONTROLLERS ARE THIN:
 * - Business logic in service layer
 * - Controllers only handle HTTP concerns
 * - Easy to test service independently
 * - Easy to swap HTTP framework if needed
 */

/**
 * Create a new note
 * POST /notes
 * 
 * REQUEST BODY: { title: string, content: string }
 * RESPONSE: 201 Created + note object
 * 
 * STATUS CODE CHOICE:
 * - 201: Resource successfully created
 * - Not 200: 200 means "OK" but doesn't indicate creation
 */
export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateNoteDto = req.body;
  const note = await noteService.createNote(dto);
  
  res.status(201).json({
    message: 'Note created successfully',
    data: note
  });
});

/**
 * Get all notes with pagination and search
 * GET /notes?page=1&limit=10&search=keyword
 * 
 * QUERY PARAMS:
 * - page: number (optional, default: 1)
 * - limit: number (optional, default: 10)
 * - search: string (optional)
 * 
 * RESPONSE: 200 OK + paginated data
 */
export const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const params: NoteQueryParams = {
    page: req.query.page ? Number(req.query.page) : undefined,
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    search: req.query.search as string | undefined
  };

  const result = await noteService.getAllNotes(params);
  
  res.status(200).json({
    message: 'Notes retrieved successfully',
    ...result
  });
});

/**
 * Get single note by ID
 * GET /notes/:id
 * 
 * URL PARAM: id (UUID)
 * 
 * RESPONSE:
 * - 200: Note found
 * - 404: Note not found (handled by service -> error middleware)
 */
export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await noteService.getNoteById(id);
  
  res.status(200).json({
    message: 'Note retrieved successfully',
    data: note
  });
});

/**
 * Update existing note (partial update)
 * PATCH /notes/:id
 * 
 * URL PARAM: id (UUID)
 * REQUEST BODY: { title?: string, content?: string }
 * 
 * RESPONSE:
 * - 200: Note updated
 * - 404: Note not found
 * - 400: Validation error
 * 
 * WHY PATCH not PUT:
 * - PATCH = partial update (only provided fields)
 * - PUT = full replacement (all fields required)
 * - We support partial updates, so PATCH is semantically correct
 */
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateNoteDto = req.body;
  
  const note = await noteService.updateNote(id, dto);
  
  res.status(200).json({
    message: 'Note updated successfully',
    data: note
  });
});

/**
 * Delete note
 * DELETE /notes/:id
 * 
 * URL PARAM: id (UUID)
 * 
 * RESPONSE:
 * - 200: Note deleted (returns deleted note)
 * - 404: Note not found
 * 
 * WHY 200 NOT 204:
 * - 204 means "No Content" - no response body
 * - We return deleted note for confirmation
 * - 200 is appropriate when returning data
 */
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await noteService.deleteNote(id);
  
  res.status(200).json({
    message: 'Note deleted successfully',
    data: note
  });
});