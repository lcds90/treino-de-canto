## 1. Setup and Authentication Store

- [x] 1.1 Create Pinia authentication store in `src/stores/auth-store.ts` handling registration, login, logout, and state persistence via Firebase Auth listener.
- [x] 1.2 Integrate Firebase Auth initialization inside the application entry points.

## 2. Route Guarding and Integration

- [x] 2.1 Add navigation guard in `src/router/index.ts` to block anonymous users on `/treino` and settings pages.
- [x] 2.2 Define login (`/login`) and signup (`/cadastro`) routes in `src/router/routes.ts`.

## 3. UI Components for Login and Signup

- [x] 3.1 Create `LoginPage.vue` under `src/pages/LoginPage.vue` with form validation, submission logic, and modern premium styling.
- [x] 3.2 Create `RegisterPage.vue` under `src/pages/RegisterPage.vue` with form validation and registration logic.
- [x] 3.3 Add Login/Logout and profile controls to `MainLayout.vue` layout.
- [x] 3.5 All pages need to resolve QPage needs to be a deep child of QLayout to ensure the layout's reactive auth state updates are reflected in the UI and Quasar being used correctly.

## 4. User-Scoped Firestore Data

- [x] 4.1 Update `RoutineService.ts` to save and read tasks scoped under user uid.
- [x] 4.2 Update `WorkoutService.ts` to save and read sessions scoped under user uid.
- [x] 4.3 Update `SettingsService.ts` to save and read configurations scoped under user uid.
