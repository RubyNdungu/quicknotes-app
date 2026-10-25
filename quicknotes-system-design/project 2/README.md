### `README.md`

```markdown
# QuickNotes System Architecture & Rich API Client

## Description

QuickNotes is a scalable web-based note-taking application. This repository contains the front-end API client integration demonstrating asynchronous CRUD operations against a mock backend (JSONPlaceholder). It features a rich, responsive UI with custom categorizations, live search filtering, word/character counting, and a dynamic Dark Mode toggle. The repository also includes backend system design documentation intended to scale the platform to 1,000,000 users.

## How to Run the API Client

1. Open the repository in a code editor like Visual Studio Code.
2. Open `index.html`.
3. Launch via the Live Server extension.
4. The page will load in your browser. You can test creating notes (with categories), deleting notes, toggling Dark Mode, and filtering loaded notes using the live search bar.

## Documentation Links

- [API Design](docs/api-design.md)
- [Data Model](docs/data-model.md)
- [System Architecture](docs/architecture.md)

## What I Learned

1. **Async JavaScript & Error Handling:** I learned how to manage DOM states (loading, success, error) cleanly while making asynchronous `fetch` requests inside a `try/catch/finally` block, ensuring the UI always responds to network conditions.
2. **Advanced DOM Manipulation:** I learned how to integrate API data with complex local UI features, such as filtering DOM elements dynamically via a search input and calculating real-time character/word counts on user input.
3. **System Scalability & Architecture:** I learned how to calculate load estimates (Reads/Writes per second) and structure an architecture diagram to remove single points of failure using Load Balancers and Primary-Replica database setups.
4. **Relational Database Modeling:** I learned how to utilize SQL foreign keys and join tables to properly link notes to categories and tags while maintaining strict data integrity.
```
