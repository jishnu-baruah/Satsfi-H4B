#  civic_usage_guide.md

# Civic Integration Guide for Satsfi

This guide outlines the method for integrating Civic's Next.js authentication into the Satsfi application, combining it with `wagmi` for wallet management. This setup uses a simple, Web2-style social login for identity and `wagmi` for all blockchain interactions.

---

## 1. Dependencies

Install the necessary packages in the `frontend` directory.

```bash
# Civic for authentication
npm install @civic/auth/nextjs @civic/auth/react

# Wagmi for wallet interaction
npm install wagmi @tanstack/react-query
```

---

## 2. Environment Variables

Add your Civic Client ID to the `frontend/.env.local` file. This variable is exposed to the client.

```env
# Get this from the Civic developer dashboard
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id_here
```

---

## 3. Backend & Configuration (Civic)

These files configure the Next.js server to handle Civic authentication callbacks.

### 3.1. API Route Handler

Create a catch-all API route that uses the Civic `handler` to manage login, logout, and session requests.

```typescript
// frontend/app/api/auth/[...civicauth]/route.ts
import { handler } from "@civic/auth/nextjs"

export const GET = handler()
export const POST = handler() // Also handle POST requests
```

### 3.2. Middleware for Route Protection

Create a middleware file to protect application routes, redirecting unauthenticated users. The `matcher` is configured to protect all dashboard-related pages.

```typescript
// frontend/middleware.ts
import { authMiddleware } from "@civic/auth/nextjs/middleware"

export default authMiddleware();

export const config = {
  // Protect all routes under /dashboard, /history, etc.
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|^/$).*)',
  ],
}
```

---

## 4. Frontend Provider Setup

To avoid Server-Side Rendering (SSR) errors, all providers (`Civic`, `Wagmi`, `QueryClient`) must be wrapped in a component that is only rendered on the client.

### 4.1. `AppProviders` Component

This component configures and houses all necessary providers.

```typescript
// frontend/components/AppProviders.tsx
"use client";

import { CivicAuthProvider } from '@civic/auth/nextjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { coreDao } from 'wagmi/chains';

// Wagmi configuration
const wagmiConfig = createConfig({
  chains: [coreDao],
  transports: {
    [coreDao.id]: http(),
  },
});

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CivicAuthProvider>
          {children}
        </CivicAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 4.2. `ClientRoot` Component

This dedicated client component dynamically imports `AppProviders` with SSR turned off. This is the key to fixing potential hydration errors. It also includes the `Toaster` for sitewide notifications.

```typescript
// frontend/components/ClientRoot.tsx
"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster"

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

Finally, the root layout uses `ClientRoot` to wrap the main application content.

```typescript
// frontend/app/layout.tsx
import { ClientRoot } from "@/components/ClientRoot"
// ... other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
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

Use the `UserButton` from Civic for login/logout and the `ConnectWalletButton` (custom component using `wagmi` hooks) for wallet actions.

```typescript
// Example in frontend/components/Navbar.tsx
import { UserButton } from "@civic/auth/react";
import { ConnectWalletButton } from "./ConnectWalletButton";

export function Navbar() {
  return (
    <nav>
      {/* ... other navbar elements */}
      <div className="flex items-center gap-4">
        <ConnectWalletButton />
        <UserButton />
      </div>
    </nav>
  );
}
```
This completes the setup for Civic social login combined with `wagmi` wallet management. 