# Job Tracker

A full-stack MERN application for tracking job applications.

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas, Mongoose

## Features

- Add job applications with company and role
- Update application status (Applied, Interviewing, Rejected, Offer)
- Delete applications
- Filter by status

## Getting Started

### Prerequisites

- Node.js
- MongoDB Atlas account

### Installation

1. Clone the repo

```bash
   git clone https://github.com/Bugs23/job-tracker.git
```

2. Install server dependencies

```bash
   cd server
   npm install
```

3. Create `server/.env`

```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

4. Install client dependencies

```bash
   cd ../client
   npm install
```

5. Start the server

```bash
   cd ../server
   node index.js
```

6. Start the client

```bash
   cd ../client
   npm run dev
```
