"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Github, Mail, Shield, LogOut, User as UserIcon } from "lucide-react";

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/me", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-muted-foreground">Failed to load account information</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Account
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your account settings
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">
                {user.username}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                Connected via GitHub
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Account Details */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <UserIcon className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Username</p>
                <p className="font-medium text-foreground">{user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Mail className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Github className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GitHub ID</p>
                <p className="font-mono font-medium text-foreground">
                  {user.github_id}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Shield className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="secondary" className="mt-1 capitalize">
                  {user.role}
                </Badge>
              </div>
            </div>
          </div>

          {/* Session Info */}
          <div className="rounded-lg border border-border p-4">
            <h3 className="text-sm font-medium text-foreground">
              Session Information
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              You are currently signed in with your GitHub account. Your session is
              secured with HTTP-only cookies.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50 bg-card">
        <CardHeader>
          <CardTitle className="text-lg text-foreground">Sign Out</CardTitle>
          <CardDescription>
            End your current session and return to the login page
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={loggingOut}
            className="gap-2"
          >
            {loggingOut ? (
              <>
                <Spinner className="h-4 w-4" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
