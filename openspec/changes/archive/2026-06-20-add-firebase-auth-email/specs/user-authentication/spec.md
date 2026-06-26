## ADDED Requirements

### Requirement: Email and Password Registration

The system SHALL allow users to sign up using an email address and a password. The system SHALL validate that the email is in a valid format and the password is at least 6 characters long.

#### Scenario: Successful Signup

- **WHEN** the user inputs a valid email and a password of at least 6 characters and submits the signup form
- **THEN** the system SHALL create the account in Firebase Auth, initialize the session, and redirect the user to the routine page.

#### Scenario: Signup with Invalid Email

- **WHEN** the user inputs an invalid email format and submits the signup form
- **THEN** the system SHALL display a validation error message indicating the email format is invalid.

#### Scenario: Signup with Short Password

- **WHEN** the user inputs a password with fewer than 6 characters and submits the signup form
- **THEN** the system SHALL display a validation error message indicating the password must be at least 6 characters long.

### Requirement: Email and Password Login

The system SHALL allow registered users to log in using their email and password.

#### Scenario: Successful Login

- **WHEN** the user inputs correct credentials and submits the login form
- **THEN** the system SHALL authenticate the user via Firebase Auth, set the session state in Pinia, and redirect the user to the routine page.

#### Scenario: Login with Incorrect Credentials

- **WHEN** the user inputs incorrect credentials and submits the login form
- **THEN** the system SHALL display an error message indicating invalid credentials.

### Requirement: Authentication Session Persistence

The system SHALL persist the user session across page reloads and browser restarts using Firebase's native persistence.

#### Scenario: Session Persistence on Reload

- **WHEN** a user with an active session reloads the page
- **THEN** the system SHALL detect the active session via the Firebase auth state listener, restore the authentication state in Pinia, and retain access to protected routes.

### Requirement: Route Guarding

The system SHALL protect application routes that contain user-specific data (such as `/treino` and subroutes) from anonymous access.

#### Scenario: Anonymous Access Blocked

- **WHEN** an unauthenticated user attempts to navigate to a protected route
- **THEN** the system SHALL block navigation and redirect the user to `/login`.

#### Scenario: Authenticated Access Allowed

- **WHEN** an authenticated user navigates to a protected route
- **THEN** the system SHALL allow the route to resolve and display the page.

### Requirement: User Logout

The system SHALL allow authenticated users to log out, terminating their current session.

#### Scenario: Logout Flow

- **WHEN** the user clicks the sign-out button
- **THEN** the system SHALL sign the user out of Firebase Auth, clear the auth state in Pinia, and redirect the user to the login page.
