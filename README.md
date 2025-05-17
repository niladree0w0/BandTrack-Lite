
# BandTrack Lite

BandTrack Lite is a web application designed to help small to medium-sized businesses in the manufacturing or assembly sector manage material dispatch to subcontractors, track returns, and maintain an employee/subcontractor roster. It provides a clean, user-friendly interface for overseeing key operational metrics.

## Core Features

*   **Dashboard View**: Displays key metrics such as total dispatched materials, returns, subcontractor payments, and active subcontractors.
*   **Dispatch Manager**: Streamlines material dispatch to subcontractors with options for quantity and material type.
*   **Return Logger**: Simplified form to record finished goods returned by subcontractors, focusing on quantity and quality status.
*   **Employee Roster**: Maintains a list of subcontractors (categorized by DNR capacity) and in-house employees, including work type (for in-house), and basic contact info. Supports CRUD operations (Create, Read, Update, Delete).
*   **User Authentication**: Secure login for different user roles (Admin, Manager, Proprietor).
*   **User Profile**: Displays basic information for the logged-in user.
*   **Settings Page**: Provides access to application settings, including a logout option.
*   **Responsive Design**: Adapts to various screen sizes for use on desktop and mobile devices.

## Technologies Used

*   **Frontend Framework**: [Next.js](https://nextjs.org/) (with App Router)
*   **UI Library**: [React](https://reactjs.org/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**:
    *   [Tailwind CSS](https://tailwindcss.com/)
    *   [ShadCN UI](https://ui.shadcn.com/): Pre-built and customizable UI components.
    *   CSS Variables for theming (see `src/app/globals.css`).
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Form Handling**: [React Hook Form](https://react-hook-form.com/)
*   **Schema Validation**: [Zod](https://zod.dev/)
*   **State Management**: React Context API (for Authentication)
*   **AI Integration (Planned)**: [Genkit](https://firebase.google.com/docs/genkit) (for future AI-powered features)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository** (if applicable, or use the Firebase Studio environment):
    ```bash
    git clone <your-repository-url>
    cd bandtrack-lite
    ```

2.  **Install dependencies**:
    Using npm:
    ```bash
    npm install
    ```
    Or using yarn:
    ```bash
    yarn install
    ```

### Running the Development Server

To start the development server, which includes hot-reloading:

Using npm:
```bash
npm run dev
```
Or using yarn:
```bash
yarn dev
```
The application will typically be available at `http://localhost:9002`.

## Available Scripts

In the project directory, you can run the following scripts:

*   `npm run dev` or `yarn dev`: Runs the app in development mode with Turbopack.
*   `npm run build` or `yarn build`: Builds the app for production.
*   `npm run start` or `yarn start`: Starts the production server (after building).
*   `npm run lint` or `yarn lint`: Lints the codebase using Next.js's built-in ESLint configuration.
*   `npm run typecheck` or `yarn typecheck`: Runs TypeScript to check for type errors.
*   `npm run genkit:dev` or `yarn genkit:dev`: Starts the Genkit development server (for AI flows).
*   `npm run genkit:watch` or `yarn genkit:watch`: Starts the Genkit development server with watch mode.

## Authentication

The application uses a simple hardcoded authentication system for demonstration purposes.

**Credentials:**

*   **Admin**:
    *   Username: `admin`
    *   Password: `admin123`
*   **Proprietor**:
    *   Username: `proprietor`
    *   Password: `proprietor123`
*   **Manager**:
    *   Username: `manager`
    *   Password: `manager123`

**Note**: This authentication is **not secure for production environments**. A proper backend authentication system should be implemented for a live application.

## Project Structure

A brief overview of the main directories:

*   `src/app/`: Contains the pages and layouts for the Next.js App Router.
    *   `src/app/(authenticated_routes)/`: Pages accessible after login (e.g., dashboard, dispatch).
    *   `src/app/login/`: The login page.
    *   `src/app/globals.css`: Global styles and CSS variable definitions for theming.
    *   `src/app/layout.tsx`: The root layout for the application.
*   `src/components/`: Reusable UI components.
    *   `src/components/ui/`: ShadCN UI components.
    *   `src/components/layout/`: Layout-specific components like `AppShell`, `PageHeader`.
    *   `src/components/employees/`: Components related to the Employee Roster feature.
*   `src/context/`: React Context providers (e.g., `AuthContext`).
*   `src/hooks/`: Custom React Hooks (e.g., `useToast`, `useIsMobile`).
*   `src/lib/`: Utility functions, type definitions, and placeholder data.
    *   `src/lib/definitions.ts`: TypeScript type definitions for the application.
    *   `src/lib/placeholder-data.ts`: Sample data used for prototyping.
*   `src/ai/`: (Planned) For Genkit AI flows and related code.
*   `public/`: Static assets.

## Styling

*   The application uses **Tailwind CSS** for utility-first styling.
*   **ShadCN UI** provides a set of accessible and customizable components.
*   The overall theme (colors, radius, etc.) is configured via CSS HSL variables in `src/app/globals.css` and applied through Tailwind's configuration in `tailwind.config.ts`.

## Future Enhancements (Potential)

*   **Database Integration**: Replace placeholder data with a real database (e.g., Firebase Firestore, Supabase, PostgreSQL).
*   **Advanced Permissions**: Implement a system where Admins can define specific permissions for Manager and Proprietor roles.
*   **Reporting**: Generate reports based on dispatch, returns, and payment data.
*   **AI-Powered Insights**: Utilize Genkit to provide insights, suggestions, or automate tasks.
*   **Image Uploads**: Allow uploading actual images instead of using placeholders.
*   **Notifications**: Implement a more robust notification system.

---

This README should provide a good overview of the BandTrack Lite application.
