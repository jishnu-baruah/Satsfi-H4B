#  civic_usage_guide.md

# Civic Integration Guide for Satsfi (Web2 Flow)

This guide outlines the correct method for integrating Civic's Next.js authentication into the Satsfi application. This setup uses a simple, Web2-style social login and does not include any Web3 or wallet-specific logic.

---

## 1. Dependencies

Install the necessary Civic packages in the `frontend` directory. Note that we only need the base packages for this flow.

```bash
npm install @civic/auth @civic/auth/nextjs @civic/auth/react
```

---

## 2. Environment Variables

Add your Civic Client ID to the `frontend/.env.local` file. The `NEXT_PUBLIC_` prefix is essential for it to be accessible on the client.

```
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id_here
```

---

## 3. Backend & Configuration

These files configure the Next.js backend to handle Civic authentication.

### 3.1. `next.config.ts`

Update `next.config.ts` to use the `createCivicAuthPlugin`. This plugin handles most of the backend setup.

```typescript
// frontend/next.config.ts
import { createCivicAuthPlugin } from "@civic/auth/nextjs"
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // your existing config...
};

const withCivicAuth = createCivicAuthPlugin({
  // Use the NEXT_PUBLIC_ prefixed variable here
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID!,
});

export default withCivicAuth(nextConfig)
```

### 3.2. API Route Handler

Create a catch-all API route that uses the Civic `handler` to manage login, logout, and callback requests.

```typescript
// frontend/app/api/auth/[...civicauth]/route.ts
import { handler } from "@civic/auth/nextjs"

export const GET = handler()
```

### 3.3. Middleware

Create a middleware file to protect application routes, ensuring only logged-in users can access them. The `matcher` can be configured to exclude public pages.

```typescript
// frontend/middleware.ts
import { authMiddleware } from "@civic/auth/nextjs/middleware"

export default authMiddleware();

export const config = {
  matcher: [
    // Protect all routes except the homepage, static files, and API routes.
    '/((?!api|_next/static|_next/image|favicon.ico|^/$).*)',
  ],
}
```

---

## 4. Frontend Provider Setup

To avoid Server-Side Rendering (SSR) errors related to browser-only APIs (`crypto.subtle`), the provider setup must be wrapped in a component that is only rendered on the client.

### 4.1. `AppProviders` Component

Create a component to house the `CivicAuthProvider`. **Do not** pass a `clientId` prop here; it is handled automatically by the Next.js plugin.

```typescript
// frontend/components/AppProviders.tsx
"use client";

import { CivicAuthProvider } from '@civic/auth/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <CivicAuthProvider>
        {children}
      </CivicAuthProvider>
    </QueryClientProvider>
  );
}
```

### 4.2. `ClientRoot` Component

Create a dedicated client component that dynamically imports `AppProviders` with SSR turned off. This is the key to fixing the `crypto.subtle is undefined` error.

```typescript
// frontend/components/ClientRoot.tsx
"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/sonner"

const AppProviders = dynamic(() => import('@/components/AppProviders').then(mod => mod.AppProviders), {
  ssr: false,
});

export function ClientRoot({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      {children}
      <Toaster />
    </AppProviders>
  );
}
```

### 4.3. Root Layout

Finally, update the root layout to use the `ClientRoot` component.

```typescript
// frontend/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientRoot } from "@/components/ClientRoot"

const inter = Inter({ subsets: ["latin"] })

// ... (metadata)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientRoot>
            {children}
          </ClientRoot>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

---

## 5. UI Integration

To add a sign-in button and display user information, use the `UserButton` component from `@civic/auth/react`.

```typescript
// Example in frontend/components/Navbar.tsx
import { UserButton } from "@civic/auth/react";

export function Navbar() {
  return (
    <nav>
      {/* ... other navbar elements */}
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </nav>
  );
}
```
This completes the correct setup for Civic Web2 authentication. 