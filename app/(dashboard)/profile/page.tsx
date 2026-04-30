"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, ArrowRight } from "lucide-react";

export default function ProfileLookupPage() {
  const [profileId, setProfileId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedId = profileId.trim();
    if (!trimmedId) {
      setError("Please enter a profile ID");
      return;
    }

    // Basic UUID validation
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(trimmedId)) {
      setError("Please enter a valid UUID format");
      return;
    }

    router.push(`/profile/${trimmedId}`);
  };

  return (
    <div className="flex items-center justify-center py-12">
      <Card className="w-full max-w-lg border-border bg-card">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent">
            <Search className="h-6 w-6 text-foreground" />
          </div>
          <CardTitle className="text-2xl text-foreground">
            Profile Lookup
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter a profile ID to view its details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="profileId"
                className="text-sm font-medium text-foreground"
              >
                Profile ID
              </label>
              <Input
                id="profileId"
                type="text"
                placeholder="e.g., b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12"
                value={profileId}
                onChange={(e) => {
                  setProfileId(e.target.value);
                  setError(null);
                }}
                className="font-mono"
              />
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            <Button type="submit" className="w-full gap-2">
              View Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4">
            <h3 className="text-sm font-medium text-foreground">
              UUID Format
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Profile IDs follow the UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
            </p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              Example: b3f9c1e2-7d4a-4c91-9c2a-1f0a8e5b6d12
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
