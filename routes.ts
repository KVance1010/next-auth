/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
  "/",
  "/verification",
];

/**
 * An array of routes that are accessible to authenticated users
 * These routes require authentication
 * @type {string[]}
 */
export const authRoutes = [
  "/register",
  "/login",
  "/verification",
  "/reset",
  "/new-password",
];

/**
 * The prefix for API auth routes
 * Routes that starts with this prefix are used for API authentication purposes.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default login redirect URL
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/settings";
