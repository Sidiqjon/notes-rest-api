import { Router } from 'express'
import * as noteController from '../controllers/note.controller'
import {
  validateCreateNote,
  validateUpdateNote,
  validateNoteId,
  validateQueryParams
} from '../validators/note.validator'

const router = Router()

router.post('/', validateCreateNote, noteController.createNote)

router.get('/', validateQueryParams, noteController.getAllNotes)

router.get('/:id', validateNoteId, noteController.getNoteById)

router.patch('/:id', validateUpdateNote, noteController.updateNote)

router.delete('/:id', validateNoteId, noteController.deleteNote)

export default router