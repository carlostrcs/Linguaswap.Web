# LinguaSwap Frontend

Frontend application for **LinguaSwap**, a vocabulary practice app for learning languages.

Users can try a public demo without creating an account, or register and create their own private vocabulary libraries. Each library can contain vocabulary items with terms in different languages, and users can practice them through interactive sessions.

## Features

* Home page with app overview
* Public demo libraries
* User authentication flow
* Private user libraries
* Create, edit and delete vocabulary items
* Create, edit and delete terms
* Practice sessions from public or private libraries
* Progress dashboard with basic statistics
* Protected private routes
* Guest-only login/register routes
* Theme support with multiple themes
* Reusable UI components

## Tech Stack

* React
* TypeScript
* Vite
* React Router
* CSS variables
* JWT authentication

## Project Structure

```txt
src/
  api/
    auth.ts
    http.ts
    libraries.ts
    practice.ts
    progress.ts
    vocab.ts

  app/
    router.tsx

  components/
    AppShell.tsx
    Button.tsx
    Card.tsx
    ErrorMessage.tsx
    TextInput.tsx
    TopNav.tsx

  features/
    auth/
    home/
    libraries/
    practice/
    progress/

  routes/
    GuestOnlyRoute.tsx
    PrivateRoute.tsx

  styles/
    base.css
    theme.css

  theme/
    ThemeProvider.tsx
    theme.ts
```

## Getting Started

### Prerequisites

You need:

* Node.js
* npm
* The LinguaSwap backend API running locally

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the frontend root:

```env
VITE_API_BASE_URL=https://localhost:7001
```

Adjust the value depending on the port used by your backend API.

You can also create a `.env.example` file to document the required environment variables:

```env
VITE_API_BASE_URL=https://localhost:7001
```

The `.env` file should not be committed. The `.env.example` file can be committed as a template.

### Run the Development Server

```bash
npm run dev
```

The app will usually run at:

```txt
http://localhost:5173
```

## Available Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Main Routes

| Route                   | Description            |
| ----------------------- | ---------------------- |
| `/`                     | Home page              |
| `/demo`                 | Public demo libraries  |
| `/login`                | Login page             |
| `/register`             | Register page          |
| `/libraries`            | User private libraries |
| `/libraries/:libraryId` | Library detail page    |
| `/practice/:sessionId`  | Practice session       |
| `/progress`             | Progress dashboard     |

## Authentication

The frontend uses a JWT access token for authenticated requests.

Private routes are protected with `PrivateRoute`. Guest-only pages such as login and register are protected with `GuestOnlyRoute`.

When the user logs out, the token is cleared and the user is redirected to the login page.

## Practice Flow

1. The user selects a public or private library.
2. The frontend starts a practice session using the backend API.
3. The app navigates to `/practice/:sessionId`.
4. The user answers prompts and receives immediate feedback.

## Progress Dashboard

The progress page shows a first version of user statistics:

* Total accuracy
* Total attempts
* Practiced words
* Progress history
* Stats by language
* Stats by language pair
* Top mistakes

## Styling

The app uses plain CSS with CSS variables.

Global styles are split into:

```txt
src/styles/theme.css
src/styles/base.css
```

Themes are applied using a `data-theme` attribute on the document root.

## Related Repositories

* Backend API: `https://github.com/carlostrcs/Linguaswap.Api`

## Current Status

This project is currently an MVP. The main user flows are implemented and the app is usable, but there are still planned improvements.

## Planned Improvements

* Better expired token handling
* Refresh token authentication
* More complete backend validation
* Improved progress statistics
* Internationalization
* Better responsive design
* More polished UI states
* More user-friendly error messages
