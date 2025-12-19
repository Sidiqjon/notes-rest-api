import { v4 as uuidv4 } from 'uuid'
import { 
  Note, 
  CreateNoteDto, 
  UpdateNoteDto, 
  NoteQueryParams, 
  PaginatedResponse,
  AppError 
} from '../types/note'
import { readNotes, writeNotes } from '../utils/file.helper'

class NoteService {
  private getUzbekistanTime(): string {
    const now = new Date()
    const uzbekTime = new Date(now.getTime() + (5 * 60 * 60 * 1000))
    return uzbekTime.toISOString()
  }

  async createNote(dto: CreateNoteDto): Promise<Note> {
    const now = this.getUzbekistanTime()
    
    const newNote: Note = {
      id: uuidv4(), 
      title: dto.title,
      content: dto.content,
      createdAt: now,
      updatedAt: now
    }

    const notes = await readNotes()
    notes.push(newNote)
    await writeNotes(notes)

    return newNote
  }

  async getAllNotes(params: NoteQueryParams): Promise<PaginatedResponse<Note>> {
    const { page = 1, limit = 10, search } = params
    
    let notes = await readNotes()

    if (search && search.trim()) {
      const searchLower = search.toLowerCase()
      notes = notes.filter(note => 
        note.title.toLowerCase().includes(searchLower) ||
        note.content.toLowerCase().includes(searchLower)
      )
    }

    const total = notes.length
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit
    const paginatedNotes = notes.slice(skip, skip + limit)

    return {
      data: paginatedNotes,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    }
  }

  async getNoteById(id: string): Promise<Note> {
    const notes = await readNotes()
    const note = notes.find(n => n.id === id)

    if (!note) {
      throw new AppError(404, `Note with id ${id} not found`)
    }

    return note
  }

  async updateNote(id: string, dto: UpdateNoteDto): Promise<Note> {
    const notes = await readNotes()
    const index = notes.findIndex(n => n.id === id)

    if (index === -1) {
      throw new AppError(404, `Note with id ${id} not found`)
    }

    const updatedNote: Note = {
      ...notes[index],
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.content !== undefined && { content: dto.content }),
      updatedAt: this.getUzbekistanTime()
    }

    notes[index] = updatedNote
    await writeNotes(notes)

    return updatedNote
  }

  async deleteNote(id: string): Promise<Note> {
    const notes = await readNotes()
    const index = notes.findIndex(n => n.id === id)

    if (index === -1) {
      throw new AppError(404, `Note with id ${id} not found`)
    }

    const deletedNote = notes[index]
    notes.splice(index, 1)
    await writeNotes(notes)

    return deletedNote
  }
}

export default new NoteService()