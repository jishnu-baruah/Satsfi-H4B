import { authMiddleware } from "@civic/auth/nextjs/middleware"

export default authMiddleware();

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  // - / (the homepage)
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|^/$).*)'],
} 