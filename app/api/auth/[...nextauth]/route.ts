import { handlers } from "@/app/lib/auth";

// NextAuth (Auth.js) v5 catch-all route handler. Exposes the GET/POST
// endpoints (sign-in, callback, session, csrf, etc.) under /api/auth/*.
export const { GET, POST } = handlers;
