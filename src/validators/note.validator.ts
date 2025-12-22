import { body, param, query, validationResult } from 'express-validator'
import { Request, Response, NextFunction } from 'express'

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorMap = new Map<string, { field: string; message: string; value?: unknown }>()
    
    errors.array().forEach(err => {
      if (err.type === 'field') {
        const fieldName = err.path
        if (!errorMap.has(fieldName)) {
          errorMap.set(fieldName, {
            field: fieldName,
            message: err.msg,
            ...(err.value !== undefined && err.value !== '' ? { value: err.value } : {})
          })
        }
      } else if (err.type === 'alternative' || err.type === 'alternative_grouped') {
        return
      } else {
        const fieldName = (err as any).path || 'body'
        if (!errorMap.has(fieldName)) {
          errorMap.set(fieldName, {
            field: fieldName,
            message: err.msg,
            ...((err as any).value !== undefined ? { value: (err as any).value } : {})
          })
        }
      }
    })

    res.status(400).json({
      error: 'Validation failed',
      details: Array.from(errorMap.values())
    })
    return
  }
  
  next()
}

export const validateCreateNote = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .isString()
    .withMessage('Title must be a string'),
  
  body('content')
    .trim()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),
  
  handleValidationErrors
]

export const validateUpdateNote = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Note ID is required')
    .isUUID()
    .withMessage('Invalid note ID format'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters')
    .isString()
    .withMessage('Title must be a string'),
  
  body('content')
    .optional()
    .trim()
    .isString()
    .withMessage('Content must be a string')
    .isLength({ max: 10000 })
    .withMessage('Content must not exceed 10000 characters'),
  
  (req: Request, res: Response, next: NextFunction): void => {
    const { title, content } = req.body
    
    if (Object.keys(req.body).length === 0 || (title === undefined && content === undefined)) {
      res.status(400).json({
        error: 'Validation failed',
        details: [
          {
            field: 'body',
            message: 'At least one field (title or content) must be provided'
          }
        ]
      })
      return
    }
    
    next()
  },
  
  handleValidationErrors
]

export const validateNoteId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Note ID is required')
    .isUUID()
    .withMessage('Invalid note ID format'),
  
  handleValidationErrors
]

export const validateQueryParams = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  
  query('search')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Search query must not exceed 100 characters')
    .isString()
    .withMessage('Search must be a string'),
  
  handleValidationErrors
]