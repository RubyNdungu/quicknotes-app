# QuickNotes API Design

## REST Endpoints

| Method | Path              | Description                               | Success Status |
| ------ | ----------------- | ----------------------------------------- | -------------- |
| GET    | `/api/notes`      | List all notes for the authenticated user | 200 OK         |
| POST   | `/api/notes`      | Create a new note                         | 201 Created    |
| GET    | `/api/notes/{id}` | Retrieve a specific note by its ID        | 200 OK         |
| PUT    | `/api/notes/{id}` | Update an entire existing note            | 200 OK         |
| DELETE | `/api/notes/{id}` | Delete a specific note                    | 204 No Content |
| GET    | `/api/tags`       | List all tags created by the user         | 200 OK         |

## Request and Response Examples

### Listing Notes (GET `/api/notes`)

**Response:**

```json
[
  {
    "id": 101,
    "title": "Meeting Notes",
    "body": "Discussed system architecture for Q4.",
    "created_at": "2026-10-25T10:00:00Z"
  }
]
```
