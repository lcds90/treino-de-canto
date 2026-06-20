## Why

Currently, the application allows managing vocal routines and settings, but lacks user-specific scoping. Introducing user authentication via Firebase Auth using Email and Password ensures that each user has their own secure space, protecting their personal vocal training routines, workouts, progress metrics, and preferences.

## What Changes

- **User Authentication Pages**: Add `/login` and `/cadastro` (signup) views using Quasar components, with validation for fields (email format, minimum password length).
- **Session Management**: Add a new Pinia store (`src/stores/auth-store.ts`) that listens to Firebase's auth state changes via `onAuthStateChanged` and maintains user authentication state.
- **Route Guarding**: Restrict access to the routine routes (`/treino` and subroutes) to authenticated users, redirecting anonymous visitors to `/login`.
- **User-Scoped Data**: Modify Firestore services (`RoutineService`, `WorkoutService`, `SettingsService`) to scope reads, writes, and deletions under user-specific subcollections or documents using the authenticated user's `uid`.
- **UI Integration**: Add a header profile/logout option inside `MainLayout.vue` to allow users to sign out.

## Capabilities

### New Capabilities
- `user-authentication`: Covers user registration, email-password login, session persistence, routing guards, and logout.

### Modified Capabilities
<!-- None, since there are no existing specifications yet -->

## Impact

- **Firebase Config**: Email/Password authentication must be enabled in the Firebase project console.
- **Routing**: `src/router/index.ts` will implement a Vue Router navigation guard (`beforeEach`).
- **Store & Services**: A new `auth` Pinia store is introduced, and existing services will require updates to incorporate the active user's `uid` when fetching or updating Firestore documents.
- **Layout**: The main layout will require styling adjustments to display login/logout states.
