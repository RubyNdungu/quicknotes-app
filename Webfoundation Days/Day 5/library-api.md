# Library API Design: Books Resource

## Endpoints

### 1. List All Books

- **Method:** `GET`
- **Path:** `/books`
- **Description:** Retrieves a complete list of all books in the library.
- **Success Status Code:** `200 OK`

### 2. Get One Book

- **Method:** `GET`
- **Path:** `/books/{id}`
- **Description:** Retrieves the details of a single book by its unique ID.
- **Success Status Code:** `200 OK`

### 3. Create a Book

- **Method:** `POST`
- **Path:** `/books`
- **Description:** Adds a new book to the library collection.
- **Request Body Example:**
  ```json
  {
    "title": "The Hobbit",
    "author": "J.R.R. Tolkien",
    "publishedYear": 1937
  }
  ```
