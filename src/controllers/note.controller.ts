import { Request, Response } from 'express';
import noteService from '../services/note.service';
import { CreateNoteDto, UpdateNoteDto, NoteQueryParams } from '../types/note';
import { asyncHandler } from '../middlewares/error.middleware';

export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateNoteDto = req.body;
  const note = await noteService.createNote(dto);
  
  res.status(201).json({
    message: 'Note created successfully',
    data: note
  });
});

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

export const getNoteById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await noteService.getNoteById(id);
  
  res.status(200).json({
    message: 'Note retrieved successfully',
    data: note
  });
});

export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateNoteDto = req.body;
  
  const note = await noteService.updateNote(id, dto);
  
  res.status(200).json({
    message: 'Note updated successfully',
    data: note
  });
});

export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const note = await noteService.deleteNote(id);
  
  res.status(200).json({
    message: 'Note deleted successfully',
    data: note
  });
});