import { auth } from "@/app/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

// Better Auth catch-all route handler. Exposes the sign-in / sign-up / session
// / sign-out endpoints under /api/auth/*.
export const { GET, POST } = toNextJsHandler(auth);
