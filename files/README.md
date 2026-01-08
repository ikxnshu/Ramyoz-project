# Next.js + MongoDB Notes App

Simple full-stack notes app using Next.js (pages), MongoDB (Mongoose), and Tailwind CSS.

Features:
- Create note (title, content)
- View list of notes (with creation timestamp)
- Edit a note
- Delete a note

Requirements:
- Node.js 16+ (or as required by your Next version)
- A MongoDB connection string (MongoDB Atlas recommended)

Setup:
1. Clone or copy the files into a directory.
2. Create an `.env.local` file in the project root with:
   ```
   MONGODB_URI="your_mongodb_connection_string_here"
   ```
3. Install:
   ```
   npm install
   ```
4. Run development server:
   ```
   npm run dev
   ```
5. Open http://localhost:3000

Notes:
- API endpoints:
  - GET /api/notes -> list notes
  - POST /api/notes -> create note (JSON body: { title, content })
  - GET /api/notes/:id -> get single note
  - PUT /api/notes/:id -> update note (JSON body: { title, content })
  - DELETE /api/notes/:id -> delete note                 
