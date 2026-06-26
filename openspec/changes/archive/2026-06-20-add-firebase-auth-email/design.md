## Context

Currently, the singing routine application (`rotina-canto`) operates globally without user accounts. Data fetched from Firestore services (`RoutineService`, `WorkoutService`, `SettingsService`) is global, meaning all users share the same routines and settings. To make the application useful for multiple individuals, we need to introduce user authentication using Firebase Auth and secure user-scoped data in Firestore.

## Goals / Non-Goals

**Goals:**

- Implement registration and login using Firebase Authentication with Email and Password.
- Create an Authentication Store in Pinia to manage user state.
- Secure pages displaying user data (e.g., `/treino` and subpaths) via router navigation guards.
- Modify existing Firestore services to store and retrieve data scoped by the authenticated user's `uid`.

**Non-Goals:**

- Implementing OAuth sign-in methods (Google, Apple, Facebook, etc.).
- Admin dashboards or roles.
- Email verification steps, password reset pages, or multi-factor authentication.
- Custom user profile editing (such as avatar uploads or display name changes).

## Decisions

### Decision 1: Authentication Mechanism

**Choice:** Firebase Authentication (Email/Password provider).

- **Rationale:** The application is already built with a Firebase database integration, and the dependency is installed. Using Firebase Auth matches the existing tech stack and provides secure session persistence automatically.
- **Alternatives Considered:** Building a custom Node.js auth API (requires a backend setup, increasing complexity and cost) or local Mock auth (does not persist data securely on the cloud).

### Decision 2: Store and Session Management

**Choice:** Pinia Auth Store (`src/stores/auth-store.ts`) with Firebase listener.

- **Rationale:** Pinia is the standard state management library used in this Quasar project. Setting up `onAuthStateChanged` within the store ensures the UI always responds reactively to logins, logouts, or expired sessions.
- **Alternatives Considered:** Handling auth state through global variables or directly reading from the `firebase/auth` instance on every component (leads to inconsistent reactive updates and code duplication).

### Decision 3: Route Guarding

**Choice:** Vue Router Navigation Guard (`beforeEach`) blocking `/treino` routes.

- **Rationale:** Ensures page security at the routing level. If an unauthenticated user tries to visit a protected page, they are immediately redirected to `/login`.
- **Alternatives Considered:** Rendering conditional content within pages using `v-if` (less secure, harder to manage, files still load and execute lifecycle hooks unnecessarily).

### Decision 4: Firestore Scoping

**Choice:** Storing user routines under `/users/{uid}/routines`, workouts under `/users/{uid}/workout_sessions`, and user settings directly inside the user's document `/users/{uid}`.

- **Rationale:** Storing routines and workouts in user subcollections keeps them properly isolated and structured. Storing settings directly on the user's root document (`/users/{uid}`) avoids unnecessary nesting levels and simplifies queries for basic user preferences.
- **Alternatives Considered:** Storing settings under `/users/{uid}/settings/user-settings` (adds extra subcollection layer) or storing data globally and filtering queries by `uid` field.

## Risks / Trade-offs

- **Risk:** Firebase Authentication initializes asynchronously. When a logged-in user reloads a protected page, the route guard runs before Firebase confirms the session, causing a false redirect to `/login`.
  - **Mitigation:** Implement a helper promise `isReady` in the auth store that resolves only after the first `onAuthStateChanged` event is triggered. The router guard will `await` this promise before making redirect decisions.
- **Risk:** Existing database documents will be inaccessible to newly authenticated users.
  - **Mitigation:** Since the project is in a pre-production/development stage, we do not need to migrate existing documents. Mock data can be injected per user using the Mock Data Injector component.
