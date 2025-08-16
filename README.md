# SorcererXtreme AI

## Project Overview

SorcererXtreme AI is a full-stack web application built with Next.js that leverages AI to provide mystical insights and services. This platform offers features such as astrology readings, numerology analysis, tarot card readings, and an AI-powered chat for personalized guidance. It aims to provide an engaging and insightful experience for users interested in esoteric knowledge.

## Features

-   **User Authentication:** Secure user registration and login.
-   **User Profiles:** Manage personal information and preferences.
-   **Astrology Readings:** Generate and interpret astrological charts.
-   **Numerology Analysis:** Provide insights based on numerological calculations.
-   **Tarot Card Readings:** Interactive tarot card spreads with AI interpretations.
-   **AI Chat:** A conversational AI assistant for mystical guidance and queries.
-   **Responsive Design:** Optimized for various devices and screen sizes.

## Technologies Used

-   **Frontend:**
    -   Next.js (React Framework)
    -   TypeScript
    -   Tailwind CSS (for styling)
-   **Backend:**
    -   Next.js API Routes
    -   Node.js
    -   Prisma (ORM for database interaction)
    -   NextAuth.js (for authentication)
-   **Database:**
    -   PostgreSQL (or other compatible database)
-   **AI Integration:**
    -   Google Gemini API (or similar AI models for chat and interpretations)
-   **Deployment:**
    -   Vercel (recommended for Next.js applications)

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (LTS version recommended)
-   npm or Yarn or pnpm or Bun
-   Git
-   PostgreSQL (or your preferred database system)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PTCuong-1102/sorcererxstreme-ai_FullStack_NextJS.git
    cd sorcererxstreme-ai_FullStack_NextJS
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

### Environment Variables

Create a `.env.local` file in the root of the project based on `.env.local.example` and fill in your environment variables.

```
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"
NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
# Add any other API keys or secrets here
```

-   `DATABASE_URL`: Your database connection string.
-   `NEXTAUTH_SECRET`: A random string used to encrypt NextAuth.js sessions. You can generate one using `openssl rand -base64 32`.
-   `NEXTAUTH_URL`: The URL of your application (e.g., `http://localhost:3000` for local development).
-   `GOOGLE_GEMINI_API_KEY`: Your API key for accessing the Google Gemini AI model.

### Database Setup

This project uses Prisma for database management.

1.  **Run Prisma migrations to set up your database schema:**
    ```bash
    npx prisma migrate dev --name init
    ```

2.  **Generate Prisma client:**
    ```bash
    npx prisma generate
    ```

### Running the Development Server

To start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## API Endpoints

The application exposes several API endpoints under `/api` for various functionalities:

-   `/api/auth`: User authentication (login, register).
-   `/api/profile`: User profile management.
-   `/api/astrology`: Astrology-related data and interpretations.
-   `/api/numerology`: Numerology calculations and insights.
-   `/api/tarot/reading`: Tarot card reading logic.
-   `/api/chat`: AI-powered chat interactions.
-   `/api/chat/history`: Chat history management.
-   `/api/fortune`: Fortune-telling related endpoints.

## Project Structure

```
.
├── app/                  # Next.js pages, API routes, and global styles
│   ├── api/              # Backend API routes
│   ├── (routes)/         # Frontend pages
│   ├── globals.css       # Global CSS styles
│   └── layout.tsx        # Root layout
├── components/           # Reusable React components
│   ├── astrology/
│   ├── fortune/
│   ├── layout/
│   ├── tarot/
│   └── ui/               # UI primitives
├── lib/                  # Utility functions, AI prompts, auth logic, etc.
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
├── .env.local.example    # Example environment variables
├── .gitignore            # Git ignore file
├── package.json          # Project dependencies and scripts
├── postcss.config.mjs    # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project README
```

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

Please ensure your code adheres to the project's coding style and conventions.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.