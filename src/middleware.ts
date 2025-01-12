import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define public routes that do not require authentication
const isPublicRoute = createRouteMatcher(["/", "/sign-in"]);

// Export the default middleware function using Clerk's middleware
export default clerkMiddleware(async (auth, req) => {
  // Destructure userId and redirectToSignIn from the auth object
  const { userId, redirectToSignIn } = await auth();

  // If the request is not for a public route and the user is not authenticated, redirect to the sign-in page
  if (!isPublicRoute(req) && !userId) {
    return redirectToSignIn();
  }

  // If the user is authenticated or the route is public, proceed with the request
  return NextResponse.next();
});

// Configuration for the middleware matcher
export const config = {
  matcher: [
    // Apply middleware to all routes except Next.js internals and static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always apply middleware to API routes
    '/(api|trpc)(.*)',
  ],
};