"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { ProfileCard } from "@/components/profile-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, RefreshCw } from "lucide-react";

interface ProfileDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function ProfileDetailPage({ params }: ProfileDetailPageProps) {
  const { id } = use(params);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/profiles/${id}`, {
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Profile not found");
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.data || data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Profile Details
            </h1>
            <p className="mt-1 font-mono text-sm text-muted-foreground">{id}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchProfile}
          disabled={loading}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center">
          <p className="text-lg font-medium text-destructive">{error}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            The profile with ID &quot;{id}&quot; could not be found or loaded.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4">
            <Link href="/profile">
              <Button variant="outline">Try another ID</Button>
            </Link>
            <Button onClick={fetchProfile}>Retry</Button>
          </div>
        </div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : profile ? (
        <ProfileCard profile={profile} />
      ) : null}
    </div>
  );
}
