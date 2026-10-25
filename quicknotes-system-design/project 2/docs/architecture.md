# QuickNotes System Architecture

## Requirements

- **Functional:** Users can create, read, update, and delete text notes. Notes must support categories (Personal, Work, Study). Users can search and filter notes.
- **Non-Functional:** High availability (99.9% uptime), low latency (sub-200ms reads), and secure data isolation between users.

## Load Estimates (1 Million Users)

- **Active Users:** ~100,000 Daily Active Users (DAU).
- **Reads per second (RPS):** Assuming 10 reads per user/day = 1,000,000 reads/day ≈ 12 RPS.
- **Writes per second (WPS):** Assuming 2 writes per user/day = 200,000 writes/day ≈ 2.5 WPS.
- **Storage per year:** 1 million users _ 50 notes/year _ 2KB per note = ~100 GB/year.

## Architecture Diagram

```text
[ Client (Browser/Mobile UI) ]
       |
       v
    [ DNS ] -----> [ CDN (Caches Dark Mode CSS & JS) ]
       |
       v
[ Load Balancer ]
       |
  +----+----+
  |         |
[App 1]   [App 2] ---> [ Cache (Redis) ]
  |         |
  +----+----+
       |
 [ Primary DB (Write) ] ---> [ Read Replica DB (Read) ]
       |
 [ Queue ] ---> [ Worker (Search Indexing) ]
```

## Component Explanations

- **DNS:** Routes the user's browser to the nearest entry point for the QuickNotes service.
- **CDN:** Serves static frontend files (like `index.html`, the custom `style.css` for dark mode, and `api.js`) directly from global edge servers, reducing bandwidth on our main application servers.
- **Load Balancer:** Distributes incoming API traffic across multiple App Servers to prevent overloading a single machine.
- **App Servers (2+):** Executes backend logic, handles data validation (like the 100-character title limit), and processes API requests.
- **Cache (Redis):** Stores frequently accessed user notes in memory, allowing instant retrieval without hitting the database.
- **Primary DB:** Handles all data writes (POST, DELETE) to ensure strict consistency when a user creates or removes a note.
- **Read Replica DB:** Handles GET requests, absorbing the heavy read traffic generated when users load their note lists.
- **Queue & Worker:** Processes background tasks asynchronously, such as updating text-search indices so the frontend search input works smoothly without delaying the API response.

## Request Flows

- **GET /notes:** The client clicks "Load Notes". The request hits the Load Balancer, which routes to App Server 1. The server checks Redis for the user's notes. On a cache miss, it queries the Read Replica DB, saves the array to Redis, and returns the JSON to the client to render in the UI.
- **POST /notes:** The client submits the form. The request payload (including title, body, and category) hits the App Server. The server validates the payload, writes the new record to the Primary DB, invalidates the user's cached notes in Redis, and responds with `201 Created`.

## Trade-Offs and Avoiding Single Points of Failure (SPOF)

- **Trade-off:** We use a Read Replica to handle the read-heavy load of users checking their notes. The trade-off is _eventual consistency_—if a user creates a note and instantly refreshes, the replica might take a few milliseconds to sync with the primary, occasionally resulting in outdated reads.
- **SPOF Avoidance:** The architecture avoids single points of failure by employing a Load Balancer paired with multiple App Servers. If App Server 1 crashes, the Load Balancer instantly routes all traffic to App Server 2. Similarly, if the Primary DB goes down, the Read Replica can be promoted to Primary to maintain uptime.
