"use client";

import dynamic from "next/dynamic";
import { Toaster } from "@/components/ui/toaster"

// Dynamically import AppProviders to ensure it only runs on the client-side
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