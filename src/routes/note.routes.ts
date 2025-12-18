import { Router } from 'express';
import * as noteController from '../controllers/note.controller';
import {
  validateCreateNote,
  validateUpdateNote,
  validateNoteId,
  validateQueryParams
} from '../validators/note.validator';

/**
 * Note routes configuration
 * 
 * ROUTE STRUCTURE:
 * - All routes start with /notes (defined in app.ts)
 * - RESTful design following standard conventions
 * - Validation middleware runs before controllers
 * 
 * REQUEST FLOW:
 * 1. Request hits route
 * 2. Validation middleware checks input
 * 3. If valid -> controller handles request
 * 4. If invalid -> 400 error returned immediately
 * 5. Controller calls service
 * 6. Response sent back to client
 */

const router = Router();

/**
 * @route   POST /notes
 * @desc    Create a new note
 * @access  Public
 * @validation title (required, 3-100 chars), content (optional, max 10000 chars)
 * 
 * Example request body:
 * {
 *   "title": "Meeting Notes",
 *   "content": "Discussed Q4 goals"
 * }
 */
router.post(
  '/',
  validateCreateNote,
  noteController.createNote
);

/**
 * @route   GET /notes
 * @desc    Get all notes with pagination and search
 * @access  Public
 * @query   page (optional, default: 1), limit (optional, default: 10), search (optional)
 * 
 * Example: GET /notes?page=2&limit=5&search=meeting
 */
router.get(
  '/',
  validateQueryParams,
  noteController.getAllNotes
);

/**
 * @route   GET /notes/:id
 * @desc    Get single note by ID
 * @access  Public
 * @param   id - UUID of the note
 * 
 * Example: GET /notes/123e4567-e89b-12d3-a456-426614174000
 */
router.get(
  '/:id',
  validateNoteId,
  noteController.getNoteById
);

/**
 * @route   PATCH /notes/:id
 * @desc    Update an existing note (partial update)
 * @access  Public
 * @param   id - UUID of the note
 * @validation At least one field (title or content) required
 * 
 * Example request body:
 * {
 *   "title": "Updated Title"
 * }
 */
router.patch(
  '/:id',
  validateUpdateNote,
  noteController.updateNote
);

/**
 * @route   DELETE /notes/:id
 * @desc    Delete a note
 * @access  Public
 * @param   id - UUID of the note
 * 
 * Example: DELETE /notes/123e4567-e89b-12d3-a456-426614174000
 */
router.delete(
  '/:id',
  validateNoteId,
  noteController.deleteNote
);

export default router;