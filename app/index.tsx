'use client';

import { useUser } from "@auth0/nextjs-auth0/client";
import Dashboard from "./page";

export default function Index() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (user) {
    return (
      <div>
        <Dashboard />
      </div>
    );
  }

  return <a href="/api/auth/login">Login</a>;
}
