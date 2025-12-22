# Notes API

> A RESTful API for managing notes with full CRUD operations, pagination, and keyword search.

[![API Documentation](https://img.shields.io/badge/API-Documentation-blue)](YOUR_RENDER_URL/api-docs)
[![Local Docs](https://img.shields.io/badge/Local-Swagger-green)](http://localhost:3000/api-docs)

**Live API**: `YOUR_RENDER_URL` _(Add after deployment)_  
**Swagger Docs**: [YOUR_RENDER_URL/api-docs](YOUR_RENDER_URL/api-docs) | [localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete notes
- 🔍 **Keyword Search** - Search notes by title or content
- 📄 **Pagination** - Efficient data retrieval with configurable page size
- ✔️ **Input Validation** - Comprehensive validation using express-validator
- 🛡️ **Error Handling** - Centralized error management with meaningful messages
- 📚 **API Documentation** - Interactive Swagger/OpenAPI documentation
- 💾 **JSON File Storage** - Simple file-based persistence
- 🔐 **CORS Enabled** - Cross-origin resource sharing support

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: express-validator
- **Documentation**: Swagger UI / OpenAPI 3.0
- **Storage**: JSON file system

---

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd notes-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Create .env file in root directory
   echo "PORT=3000" > .env
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the API**
   - API Base URL: `http://localhost:3000/api/notes`
   - Swagger Docs: `http://localhost:3000/api-docs`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/notes` | Create a new note |
| `GET` | `/api/notes` | Get all notes (with pagination & search) |
| `GET` | `/api/notes/:id` | Get a single note by ID |
| `PATCH` | `/api/notes/:id` | Update a note (partial update) |
| `DELETE` | `/api/notes/:id` | Delete a note |

### Example Requests

#### Create a Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Meeting Notes",
    "content": "Discussed project timeline and deliverables"
  }'
```

#### Get All Notes with Pagination
```bash
curl "http://localhost:3000/api/notes?page=1&limit=10&search=meeting"
```

#### Update a Note
```bash
curl -X PATCH http://localhost:3000/api/notes/<note-id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Meeting Notes"}'
```

---

## Request/Response Examples

### Create Note

**Request:**
```json
POST /api/notes
{
  "title": "Project Ideas",
  "content": "Brainstorming session results"
}
```

**Response:** `201 Created`
```json
{
  "message": "Note created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Project Ideas",
    "content": "Brainstorming session results",
    "createdAt": "2024-12-22T10:30:00.000Z",
    "updatedAt": "2024-12-22T10:30:00.000Z"
  }
}
```

### Get All Notes

**Request:**
```bash
GET /api/notes?page=1&limit=10&search=project
```

**Response:** `200 OK`
```json
{
  "message": "Notes retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Project Ideas",
      "content": "Brainstorming session results",
      "createdAt": "2024-12-22T10:30:00.000Z",
      "updatedAt": "2024-12-22T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

---

## Validation Rules

### Create Note
- `title`: Required, 3-100 characters
- `content`: Optional, max 10,000 characters

### Update Note
- `title`: Optional, 3-100 characters
- `content`: Optional, max 10,000 characters
- At least one field must be provided

### Query Parameters
- `page`: Optional, positive integer (default: 1)
- `limit`: Optional, 1-100 (default: 10)
- `search`: Optional, max 100 characters

---

## Error Responses

### Validation Error
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 3 and 100 characters"
    }
  ]
}
```

### Not Found Error
```json
{
  "error": "Note with id 123 not found",
  "statusCode": 404
}
```

### Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong on the server",
  "statusCode": 500
}
```

---

## Project Structure

```
notes-api/
├── src/
│   ├── config/
│   │   └── swagger.config.ts      # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   └── note.controller.ts     # Request handlers
│   ├── data/
│   │   └── notes.json             # JSON file storage
│   ├── middlewares/
│   │   └── error.middleware.ts    # Error handling middleware
│   ├── routes/
│   │   └── note.routes.ts         # API routes
│   ├── services/
│   │   └── note.service.ts        # Business logic
│   ├── types/
│   │   └── note.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── file.helper.ts         # File operations
│   ├── validators/
│   │   └── note.validator.ts      # Input validation
│   └── app.ts                     # Application entry point
├── .env                           # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start development server with auto-reload

# Production
npm run build        # Compile TypeScript to JavaScript
npm start            # Run compiled JavaScript

# Testing
npm test             # Run tests (not implemented yet)
```

---

## Deployment

### Deploy to Render

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Configure build settings:
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npm start`
   - Add environment variables:
     - `PORT`: (Render provides this automatically)

3. **Deploy**
   - Render will automatically build and deploy your application
   - Access your API at the provided Render URL

---

## Future Enhancements

- [ ] Add user authentication (JWT)
- [ ] Implement database integration (PostgreSQL/MongoDB)
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Add unit and integration tests
- [ ] Add note categories/tags
- [ ] Implement file attachments
- [ ] Add export functionality (PDF, Markdown)

---

## License

ISC

---

## Author

**Sidiqjon Yusufjanov**

---

## Acknowledgments

Developed as part of the DanAds Internship Task to demonstrate RESTful API development skills with Node.js, Express, and TypeScript.