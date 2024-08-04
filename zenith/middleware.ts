import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Code to protect a few routes(/dashboard in our case) since all other will be public by default.

/* export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) auth().protect();
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/conversation(.*)',
  '/code(.*)',
  '/music(.*)',
  '/image(.*)',
  '/video(.*)',
  // '/forum(.*)',
]); */

// Code to protect a few routes(/dashboard in our case) since all other will be public by default.

//Code to make all routes private and a few public

const isPublicRoute = createRouteMatcher([
  '/', '/api/webhook', '/sign-in(.*)', '/sign-up(.*)'
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) auth().protect();
});


//Code to make all routes private and a few public

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};