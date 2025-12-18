/**
 * Core Note interface representing a single note entity
 * 
 * Design decisions:
 * - id: string (UUID format) - ensures uniqueness and is JSON-safe
 * - timestamps: string (ISO 8601) - JSON serialization compatible, easily parseable
 * - title: string - required field for note identification
 * - content: string - main note body, can be empty string
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a new note
 * Excludes auto-generated fields (id, timestamps)
 */
export interface CreateNoteDto {
  title: string;
  content: string;
}

/**
 * DTO for updating an existing note
 * All fields are optional to support partial updates
 */
export interface UpdateNoteDto {
  title?: string;
  content?: string;
}

/**
 * Query parameters for listing notes with pagination and search
 */
export interface NoteQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

/**
 * Paginated response structure
 * Provides metadata for frontend pagination UI
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Custom error class for application-specific errors
 * Extends native Error to include HTTP status codes
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}