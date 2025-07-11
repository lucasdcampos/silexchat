# Silex Chat

> Disclaimer: This project is currently under heavy development. Features, architecture, and the database schema are subject to change without notice.

## About The Project

Silex is a hobby project aimed at building a secure, end-to-end encrypted chat application.

The core principle is to provide a user-friendly encrypted communication platform where users have full control over their private keys. The server acts only as a relay for encrypted data and a directory for public keys, never having access to the content of the messages.

Users can also run their own server instance.

## Key Features (Current & Planned)
- End-to-End Encryption: Using asymmetric keys for secure communication.

- Local Private Key Storage: Users are responsible for their own private keys, which are never sent to the server.

- Direct & Group Chats: Support for both one-on-one and group conversations.

- Real-time Communication: Built with WebSockets for instant message delivery.

## Tech Stack

Monorepo: Managed with npm workspaces.

### Backend (apps/api):

- Node.js
- Express.js
- TypeScript
- Prisma (ORM)
- PostgreSQL
- Socket.IO

### Frontend (apps/client):

- React
- Vite
- TypeScript
- Tailwind CSS

## Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites
- Node.js (v18 or later)
- npm (v8 or later)
- A running PostgreSQL instance

### Installation & Setup

1. Clone the monorepo:

    ```bash
    git clone https://github.com/lucasdcampos/silexchat
    cd silexchat
    ```

2. Install dependencies:
    From the root directory, run npm install. This will install dependencies for both the api and client workspaces.

    ```
    npm install
    ```

3. Configure Backend (apps/api):

    - Navigate to the apps/api directory.
    - Create a .env file.
    - Set the DATABASE_URL and JWT_SECRET variables.

    ```md
    # .env for the API
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"
    JWT_SECRET="your-super-secret-key-generated-with-crypto"
    ```

    - Apply the database migrations:

    ```
    npx prisma migrate dev
    ```

4. Configure Frontend (apps/client):

    - Navigate to the apps/client directory.
    - Create a .env file.
    - Set the VITE_API_URL to point to your local backend server.

    ```md
    # .env for the Client
    VITE_API_URL=http://localhost:3000
    ```

### Running the Application

You need to run the API and the Client in two separate terminal windows, both from the root directory of the monorepo.

1. Start the Backend API:
    ```
    npm run dev:api
    ```
2. Start the Frontend Client:
    ```
    npm run dev:client
    ```
The client should now be running (usually on http://localhost:5173) and communicating with the backend API (on http://localhost:3000).

## License
Distributed under the Apache 2.0 License. See LICENSE for more information.