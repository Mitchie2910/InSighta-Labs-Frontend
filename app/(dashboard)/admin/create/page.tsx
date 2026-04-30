"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-guard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Profile } from "@/lib/types";
import { ProfileCard } from "@/components/profile-card";
import { ArrowLeft, Plus, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AdminCreateProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdProfile, setCreatedProfile] = useState<Profile | null>(null);

  const isAdmin = user?.role === "ROLE_ADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    setLoading(true);
    setError(null);
    setCreatedProfile(null);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create profile");
      }

      setCreatedProfile(data.data);
      setName("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create profile");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>

        <Card className="border-destructive/50 bg-destructive/5">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShieldAlert className="mb-4 h-12 w-12 text-destructive" />
            <h2 className="mb-2 text-xl font-semibold text-foreground">Access Denied</h2>
            <p className="mb-4 text-center text-muted-foreground">
              You need administrator privileges to access this page.
            </p>
            <Badge variant="outline" className="text-muted-foreground">
              Current role: {user?.role || "Unknown"}
            </Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-foreground">Create Profile</h1>
          <p className="text-muted-foreground">
            Generate a new profile by entering a name
          </p>
        </div>
        <Badge className="bg-success/20 text-success">Admin</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              New Profile
            </CardTitle>
            <CardDescription>
              Enter a name to generate profile data including gender prediction,
              age estimation, and country inference.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter a name (e.g., Emmanuel, Ella, John)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                    autoFocus
                  />
                  {error && <FieldError >{error}</FieldError>}
                </Field>
              </FieldGroup>

              <Button type="submit" disabled={loading || !name.trim()} className="w-full">
                {loading ? (
                  <>
                    <Spinner className="mr-2 h-4 w-4" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Profile
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {createdProfile && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Created Profile</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/profile/${createdProfile.id}`)}
              >
                View Full Details
              </Button>
            </div>
            <ProfileCard profile={createdProfile} />
          </div>
        )}

        {!createdProfile && (
          <Card className="flex items-center justify-center border-dashed">
            <CardContent className="py-12 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">
                Created profile will appear here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
