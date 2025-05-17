
# BandTrack Lite

BandTrack Lite is a web application designed to help small to medium-sized businesses in the manufacturing or assembly sector manage material dispatch to subcontractors, track returns, and maintain an employee/subcontractor roster. It provides a clean, user-friendly interface for overseeing key operational metrics, with role-based access control for different user types.

## Core Features

*   **Dashboard View**: Displays key metrics such as total dispatched materials, returns, subcontractor payments, and active subcontractors. (Permission: `viewDashboard`)
*   **Dispatch Manager**: Streamlines material dispatch to subcontractors with options for quantity and material type. (Permission: `manageDispatch`)
*   **Return Logger**: Simplified form to record finished goods returned by subcontractors, focusing on quantity and quality status. (Permission: `manageReturns`)
*   **Employee Roster**: Maintains a list of subcontractors (categorized by DNR capacity) and in-house employees, including work type (for in-house), and basic contact info. Supports CRUD operations (Create, Read, Update, Delete). (Permissions: `viewEmployees`, `manageEmployees`)
*   **User Authentication**: Secure login using Firebase Authentication (Email/Password).
*   **Role-Based Access Control (RBAC)**:
    *   Defines roles (Admin, Proprietor, Manager) with specific permissions.
    *   Permissions are managed in Firestore (`roles` collection) and assigned to users via the `users` collection.
    *   Controls access to pages and features within the application.
*   **User Profile**: Displays basic information for the logged-in user, their role, and effective permissions. (Permission: `viewProfile`)
*   **Settings Page**: Provides access to application settings, including a logout option. (Permission: `manageSettings`)
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
*   **Authentication**: [Firebase Authentication](https://firebase.google.com/docs/auth) (Email/Password)
*   **Database (for Roles/Permissions)**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
*   **State Management**: React Context API (for Authentication)
*   **AI Integration (Planned)**: [Genkit](https://firebase.google.com/docs/genkit) (for future AI-powered features)

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (version 18.x or later recommended)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A [Firebase Project](https://console.firebase.google.com/)

### Configuration

1.  **Firebase Project Setup:**
    *   Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Email/Password** sign-in method in Authentication -> Sign-in method.
    *   Register a new web app in your Firebase project settings.
    *   Firebase will provide you with a configuration object.

2.  **Environment Variables:**
    *   Create a file named `.env.local` in the root of your project (alongside `package.json`).
    *   Add your Firebase project configuration details to this file. You can copy the structure from `.env.local.example` and replace the placeholder values:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_FIREBASE_API_KEY"
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_FIREBASE_AUTH_DOMAIN"
        NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_FIREBASE_PROJECT_ID"
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_FIREBASE_STORAGE_BUCKET"
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_FIREBASE_MESSAGING_SENDER_ID"
        NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_FIREBASE_APP_ID"
        # NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_FIREBASE_MEASUREMENT_ID" # Optional

        # This email is used to initially grant admin privileges.
        NEXT_PUBLIC_ADMIN_EMAIL="admin@example.com"
        ```
    *   **Important:** The Firebase configuration in `src/lib/firebase.ts` is currently hardcoded for easier setup. If you wish to use the `.env.local` file for these credentials (recommended for security and flexibility), you'll need to modify `src/lib/firebase.ts` to read from `process.env.NEXT_PUBLIC_FIREBASE_...` variables.

3.  **Firestore Setup for Roles and Permissions:**
    *   In your Firebase project, go to Firestore Database.
    *   **Create `users` collection:**
        *   For each authenticated user (after they are created in Firebase Authentication), create a document in this collection.
        *   The **Document ID** must be the Firebase **User UID**.
        *   Each document should have a field: `role: string` (e.g., `"admin"`, `"proprietor"`, `"manager"`).
            *   Example: Document ID: `USER_UID_XYZ` -> `{ role: "admin" }`
    *   **Create `roles` collection:**
        *   **Admin Role:**
            *   Document ID: `admin`
            *   Field: `permissions` (Type: `array`)
            *   Value: `["fullAccess"]` (or a list of all specific permissions)
        *   **Proprietor Role:**
            *   Document ID: `proprietor`
            *   Field: `permissions` (Type: `array`)
            *   Value: (e.g., `["viewDashboard", "manageDispatch", "manageEmployees", ...]`) - Add all permissions the proprietor needs.
        *   **Manager Role:**
            *   Document ID: `manager`
            *   Field: `permissions` (Type: `array`)
            *   Value: (e.g., `["viewDashboard", "viewEmployees", ...]`) - Add all permissions the manager needs.
        *   Refer to `src/lib/definitions.ts` for the list of available permission strings.

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

The application uses **Firebase Authentication** (Email/Password).

1.  **Create Users:** Add users in your Firebase project console (Authentication -> Users tab).
2.  **Assign Roles:**
    *   For each user created in Firebase Auth, get their UID.
    *   In your Firestore `users` collection, create a document with the UID as the document ID.
    *   Add a `role` field (string) to this document with the desired role (`"admin"`, `"proprietor"`, or `"manager"`).
    *   The email specified in `NEXT_PUBLIC_ADMIN_EMAIL` in your `.env.local` file will be automatically recognized as an admin within the app if their Firestore `users/{uid}` document also assigns them the `admin` role.

The application then reads permissions for the assigned role from the `roles` collection in Firestore.

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
*   `src/lib/`: Utility functions, type definitions, Firebase setup, and placeholder data.
    *   `src/lib/definitions.ts`: TypeScript type definitions for the application, including roles and permissions.
    *   `src/lib/firebase.ts`: Firebase initialization and configuration.
    *   `src/lib/permissions.ts`: Logic for checking user permissions.
    *   `src/lib/placeholder-data.ts`: Sample data used for prototyping (note: employees, dispatches, returns are currently using this placeholder data, not Firestore).
*   `src/ai/`: (Planned) For Genkit AI flows and related code.
*   `public/`: Static assets.
*   `.env.local.example`: Example file for Firebase environment variables.

## Styling

*   The application uses **Tailwind CSS** for utility-first styling.
*   **ShadCN UI** provides a set of accessible and customizable components.
*   The overall theme (colors, radius, etc.) is configured via CSS HSL variables in `src/app/globals.css` and applied through Tailwind's configuration in `tailwind.config.ts`.

## Future Enhancements (Potential)

*   **Full Firestore Integration**: Migrate all data (employees, dispatches, returns) from placeholder data to Firestore.
*   **Admin UI for RBAC**: An interface for Admins to manage roles and their associated permissions directly within the app (updating Firestore).
*   **Admin UI for User Role Assignment**: An interface for Admins to assign roles to users.
*   **Reporting**: Generate reports based on dispatch, returns, and payment data.
*   **AI-Powered Insights**: Utilize Genkit to provide insights, suggestions, or automate tasks.
*   **Image Uploads**: Allow uploading actual images instead of using placeholders.
*   **Notifications**: Implement a more robust notification system.

---
