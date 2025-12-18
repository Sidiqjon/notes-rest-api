# Notes API - DanAds Internship Task

A professional RESTful API for managing notes, built with Node.js, Express, and TypeScript.

## 🎯 Project Overview

This project implements a complete CRUD (Create, Read, Update, Delete) API for note management with advanced features including pagination, search, input validation, and comprehensive error handling.

### Key Features

- ✅ **Full CRUD Operations** - Create, read, update, and delete notes
- ✅ **Input Validation** - Robust validation using express-validator
- ✅ **Pagination** - Efficient data handling for large datasets
- ✅ **Search Functionality** - Keyword search in titles and content
- ✅ **Centralized Error Handling** - Consistent error responses across all endpoints
- ✅ **Swagger Documentation** - Interactive API documentation
- ✅ **TypeScript** - Full type safety and modern JavaScript features
- ✅ **Clean Architecture** - Separation of concerns (routes → controllers → services)

## 🏗️ Project Structure

```
notes-api/
│
├── src/
│   ├── app.ts                    # Express application setup
│   ├── server.ts                 # Server entry point
│   │
│   ├── routes/
│   │   └── note.routes.ts        # API route definitions
│   │
│   ├── controllers/
│   │   └── note.controller.ts    # HTTP request handlers
│   │
│   ├── services/
│   │   └── note.service.ts       # Business logic layer
│   │
│   ├── validators/
│   │   └── note.validator.ts     # Request validation rules
│   │
│   ├── middlewares/
│   │   └── error.middleware.ts   # Centralized error handling
│   │
│   ├── types/
│   │   └── note.ts              # TypeScript interfaces & types
│   │
│   ├── utils/
│   │   └── file.helper.ts       # File I/O utilities
│   │
│   ├── config/
│   │   └── swagger.config.ts    # Swagger/OpenAPI configuration
│   │
│   └── data/
│       └── notes.json           # Data storage (JSON file)
│
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Build for Production

```bash
npm run build
npm start
```

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api/notes
```

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/notes` | Create a new note |
| GET | `/notes` | Get all notes (with pagination & search) |
| GET | `/notes/:id` | Get a single note by ID |
| PATCH | `/notes/:id` | Update an existing note (partial update) |
| DELETE | `/notes/:id` | Delete a note |

### Detailed API Documentation

#### 1. Create Note
```http
POST /api/notes
Content-Type: application/json

{
  "title": "Meeting Notes",
  "content": "Discussed Q4 goals and project timeline"
}
```

**Response (201 Created)**
```json
{
  "message": "Note created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Meeting Notes",
    "content": "Discussed Q4 goals and project timeline",
    "createdAt": "2024-12-18T15:30:00.000Z",
    "updatedAt": "2024-12-18T15:30:00.000Z"
  }
}
```

**Note:** All timestamps are in Uzbekistan timezone (UTC+5)

#### 2. Get All Notes (with Pagination & Search)
```http
GET /api/notes?page=1&limit=10&search=meeting
```

**Query Parameters**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10, max: 100)
- `search` (optional) - Search keyword in title/content

**Response (200 OK)**
```json
{
  "message": "Notes retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Meeting Notes",
      "content": "Discussed Q4 goals",
      "createdAt": "2024-12-18T15:30:00.000Z",
      "updatedAt": "2024-12-18T15:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

#### 3. Get Single Note
```http
GET /api/notes/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK)**
```json
{
  "message": "Note retrieved successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Meeting Notes",
    "content": "Discussed Q4 goals",
    "createdAt": "2024-12-18T15:30:00.000Z",
    "updatedAt": "2024-12-18T15:30:00.000Z"
  }
}
```

#### 4. Update Note (Partial Update)
```http
PATCH /api/notes/123e4567-e89b-12d3-a456-426614174000
Content-Type: application/json

{
  "title": "Updated Meeting Notes"
}
```

**Note:** You can update `title`, `content`, or both. At least one field is required. This is a PATCH request (partial update), not PUT (full replacement).

**Response (200 OK)**
```json
{
  "message": "Note updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Updated Meeting Notes",
    "content": "Discussed Q4 goals",
    "createdAt": "2024-12-18T15:30:00.000Z",
    "updatedAt": "2024-12-18T16:00:00.000Z"
  }
}
```

#### 5. Delete Note
```http
DELETE /api/notes/123e4567-e89b-12d3-a456-426614174000
```

**Response (200 OK)**
```json
{
  "message": "Note deleted successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "title": "Meeting Notes",
    "content": "Discussed Q4 goals",
    "createdAt": "2024-12-18T15:30:00.000Z",
    "updatedAt": "2024-12-18T15:30:00.000Z"
  }
}
```

## 🔒 Validation Rules

### Create Note
- `title`: Required, 3-100 characters, string
- `content`: Optional, max 10,000 characters, string

### Update Note
- `title`: Optional, 3-100 characters, string
- `content`: Optional, max 10,000 characters, string
- At least one field must be provided
- Uses PATCH method for partial updates

### Query Parameters
- `page`: Must be positive integer
- `limit`: Must be 1-100
- `search`: Max 100 characters

## ❌ Error Handling

All errors return JSON responses with appropriate HTTP status codes:

### Validation Error (400)
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "title",
      "message": "Title must be between 3 and 100 characters",
      "value": "ab"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "error": "Note with id 123 not found",
  "statusCode": 404
}
```

### Internal Server Error (500)
```json
{
  "error": "Internal Server Error",
  "message": "Something went wrong on the server",
  "statusCode": 500
}
```

## 📖 Interactive Documentation

Access the Swagger UI documentation at:
```
http://localhost:3000/api-docs
```

Features:
- Interactive API testing
- Request/response examples
- Schema definitions
- Try-it-out functionality

## 🏗️ Architecture

### Request Flow
```
Request → Routes → Validators → Controllers → Services → Utils → Storage
                                                                    ↓
Response ← Controllers ← Services ← Utils ← Storage ← File System
```

### Layer Responsibilities

1. **Routes** - Define API endpoints and attach middleware
2. **Validators** - Validate request data before processing
3. **Controllers** - Handle HTTP requests/responses
4. **Services** - Contain business logic
5. **Utils** - Helper functions (file I/O)
6. **Middlewares** - Cross-cutting concerns (errors, logging)

## 🧪 Testing the API

### Using cURL

**Create a note:**
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Note","content":"This is a test"}'
```

**Get all notes:**
```bash
curl http://localhost:3000/api/notes
```

**Get note by ID:**
```bash
curl http://localhost:3000/api/notes/YOUR_NOTE_ID
```

**Update a note:**
```bash
curl -X PATCH http://localhost:3000/api/notes/YOUR_NOTE_ID \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title"}'
```

**Delete a note:**
```bash
curl -X DELETE http://localhost:3000/api/notes/YOUR_NOTE_ID
```

### Using Postman

1. Import the API: `http://localhost:3000/api-docs`
2. Use the Swagger UI to generate requests
3. Test all endpoints interactively

## 💡 Technical Decisions

### Why JSON File Storage?
- Simple and meets requirements (no database needed)
- Easy to inspect and debug
- Demonstrates async file I/O handling
- Production apps would use PostgreSQL/MongoDB

### Why UUID for IDs?
- Globally unique, no collision risk
- URL-safe and JSON-compatible
- Standard in distributed systems

### Why ISO 8601 Timestamps in Uzbekistan Time?
- All timestamps use Uzbekistan timezone (UTC+5)
- ISO 8601 format is universal and JSON-compatible
- Easy to parse in any programming language
- Timezone-aware and prevents confusion

### Why PATCH instead of PUT?
- PATCH = partial update (only provided fields)
- PUT = full replacement (all fields required)
- PATCH is more flexible and user-friendly
- Follows RESTful best practices for partial updates

### Why Centralized Error Handling?
- Consistent error format
- Single place to modify responses
- Cleaner controllers (no try-catch everywhere)
- Easy to add logging/monitoring

### Why Service Layer?
- Separates business logic from HTTP concerns
- Reusable across different contexts
- Easier to test independently
- Follows SOLID principles

## 🚦 Scalability Considerations

### Current Limitations (Under High Load)
1. **File I/O Race Conditions** - Multiple concurrent writes
2. **No Caching** - Each request reads from disk
3. **No Connection Pooling** - Not applicable (file-based)
4. **Memory Constraints** - All notes loaded into memory

### Production Improvements
1. **Database** - PostgreSQL with connection pooling
2. **Redis Caching** - Reduce database queries
3. **Queue System** - Bull/RabbitMQ for write operations
4. **Load Balancing** - Horizontal scaling with nginx
5. **Monitoring** - Prometheus + Grafana

## 📝 Scripts

```json
{
  "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
}
```

- `npm run dev` - Development with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build

## 🛠️ Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe JavaScript
- **express-validator** - Request validation
- **uuid** - Unique ID generation
- **Swagger** - API documentation
- **cors** - Cross-origin resource sharing

## 👤 Author

**Your Name**  
DanAds Global Software Internship Program - 2024

## 📄 License

ISC

---

**Note:** This project was created as part of the DanAds internship selection process to demonstrate REST API development skills, TypeScript proficiency, and software architecture understanding.