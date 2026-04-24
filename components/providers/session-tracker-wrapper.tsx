
"use client";

import { SessionTracker } from "./session-tracker";
import { useAuth } from "./auth-provider";

export function SessionTrackerWrapper() {
  const { isAuthenticated } = useAuth();
  return <SessionTracker isAuthenticated={isAuthenticated} />;
}

export { SessionTracker };
