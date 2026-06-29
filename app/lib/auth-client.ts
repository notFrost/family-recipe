import { createAuthClient } from "better-auth/react";

// Browser-side Better Auth client. Used for social sign-in (Google/Facebook);
// the base URL is inferred from the current origin.
export const authClient = createAuthClient();
