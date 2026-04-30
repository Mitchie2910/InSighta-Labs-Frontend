# InSighta Labs Frontend
[![Ask DeepWiki](https://devin.ai/assets/askdeepwiki.png)](https://deepwiki.com/Mitchie2910/InSighta-Labs-Frontend.git)

This is the frontend for the InSighta Labs Profiles Portal, a web application for managing and analyzing user profile data. Built with Next.js and TypeScript, it features a modern, responsive interface for browsing, filtering, and searching profiles, with authentication handled via GitHub OAuth.

## Features

*   **GitHub Authentication**: Secure login and session management using GitHub credentials, proxied through a backend service.
*   **Dashboard**: A central hub providing an at-a-glance overview of key metrics, such as the total number of profiles.
*   **Profile Browsing & Filtering**: A paginated table view of all profiles with a comprehensive filtering panel. Users can filter by gender, age group, country, age range, and confidence probabilities.
*   **Natural Language Search**: An intuitive search interface that allows users to find profiles using plain English queries (e.g., "adult males from Nigeria").
*   **Detailed Profile View**: A dedicated page to view the complete details of a single profile, including predicted attributes and confidence scores.
*   **Admin Role**: Users with an admin role have access to special features, such as the ability to create new profiles.
*   **CSV Export**: Functionality to export the currently filtered list of profiles to a CSV file.
*   **Account Management**: A page for users to view their own account details and securely sign out.
*   **Responsive Design**: The UI, built with Shadcn/ui and Tailwind CSS, is fully responsive and provides a seamless experience on both desktop and mobile devices.

## Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/) component library
*   **State Management**: React Hooks (`useState`, `useEffect`, `useContext`)
*   **Forms**: [React Hook Form](https://react-hook-form.com/) for form handling and validation with [Zod](https://zod.dev/).
*   **API Communication**: The browser's `fetch` API, with Next.js API routes acting as a proxy to a separate backend service.
*   **Linting & Formatting**: ESLint
*   **CI/CD**: GitHub Actions for continuous integration.

## Project Structure

The repository is organized following Next.js App Router conventions:

```
/
├── app/                      # Next.js App Router directory
│   ├── (dashboard)/          # Authenticated routes and layout
│   │   ├── dashboard/
│   │   ├── profiles/
│   │   ├── search/
│   │   └── admin/
│   ├── api/                  # API routes acting as a proxy to the backend
│   │   ├── auth/
│   │   └── profiles/
│   ├── login/                # Login page
│   └── layout.tsx            # Root layout
├── components/               # Reusable React components
│   ├── ui/                   # Shadcn/ui components
│   └── *.tsx                 # Custom application components
├── hooks/                    # Custom React hooks (e.g., useToast)
├── lib/                      # Shared utilities, types, and API client logic
├── public/                   # Static assets
└── .github/                  # CI/CD workflows
```

## Getting Started

To run this project locally, follow these steps:

### Prerequisites

*   Node.js (v20 or later)
*   npm (or your preferred package manager like pnpm or yarn)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/mitchie2910/insighta-labs-frontend.git
    cd insighta-labs-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a file named `.env.local` in the root of the project and add the URL of your backend API service.

    ```.env.local
    NEXT_PUBLIC_API_URL=http://localhost:8000
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.

## Available Scripts

The `package.json` file contains several scripts for managing the application:

*   `npm run dev`: Starts the Next.js development server.
*   `npm run build`: Builds the application for production.
*   `npm run start`: Starts the production server after a build.
*   `npm run lint`: Runs ESLint to check for code quality and style issues.
*   `npm run test`: Runs the test suite (currently configured with Jest).

## API Proxy

This frontend is designed to work with a separate backend API. To avoid CORS issues and to keep the backend URL private from the client-side code, all API requests are proxied through Next.js API routes located in the `app/api/` directory.

For example, a client-side request to `/api/profiles` is forwarded by the Next.js server to `${NEXT_PUBLIC_API_URL}/api/profiles`, along with the necessary session cookies. This architecture provides a clean separation of concerns and enhances security.