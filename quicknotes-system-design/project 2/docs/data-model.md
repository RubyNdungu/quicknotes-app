# QuickNotes Data Model

## Entities and Relationships

To support the QuickNotes application (including the new category selection feature), the database consists of four primary entities:

1. **users**: Stores account and authentication information.
2. **notes**: Stores individual notes, including the newly added `category` field (Personal, Work, Study).
3. **tags**: Stores custom labels that users can create for deeper organization beyond the basic categories.
4. **note_tags**: A join table mapping notes to multiple tags.

**Relationships:**

- **One-to-Many:** A `user` can author many `notes`. A `user` can create many custom `tags`.
- **Many-to-Many:** A `note` can have multiple `tags` applied to it, and a `tag` can be applied to multiple `notes`. The `note_tags` table resolves this relationship.

## Database Schema (CREATE TABLE statements)

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    body TEXT,
    category VARCHAR(50) DEFAULT 'Personal',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE note_tags (
    note_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (note_id, tag_id),
    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```
