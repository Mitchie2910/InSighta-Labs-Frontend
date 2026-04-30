"use client";

import { useState } from "react";
import { Profile, PaginatedResponse } from "@/lib/types";
import { ProfileTable } from "@/components/profile-table";
import { PaginationControls } from "@/components/pagination-controls";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Sparkles } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const limit = 10;

  const handleSearch = async (searchPage: number = 1) => {
    if (!query.trim()) {
      setError("Please enter a search query");
      return;
    }

    setLoading(true);
    setError(null);
    setPage(searchPage);

    try {
      const params = new URLSearchParams({
        q: query.trim(),
        page: String(searchPage),
        limit: String(limit),
      });

      const response = await fetch(`/api/profiles/search?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data: PaginatedResponse<Profile> = await response.json();
      setProfiles(data.data);
      setTotal(data.total);
      setTotalPages(data.total_pages);
      setHasSearched(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(1);
  };

  const handlePageChange = (newPage: number) => {
    handleSearch(newPage);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Search Profiles
        </h1>
        <p className="mt-1 text-muted-foreground">
          Use natural language to search for profiles
        </p>
      </div>

      {/* Search Form */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg text-foreground">
              Natural Language Search
            </CardTitle>
          </div>
          <CardDescription>
            Describe what you&apos;re looking for in plain language
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="e.g., Find all adult males from Nigeria with high gender probability"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError(null);
                }}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Spinner className="h-4 w-4" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </form>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Example Queries */}
      {!hasSearched && (
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">
              Example Queries
            </CardTitle>
            <CardDescription>
              Click on any example to try it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {[
                "Find adult males from the US",
                "Show me females over 30 years old",
                "Profiles from Nigeria with high confidence",
                "Teenagers from European countries",
                "Senior citizens with gender probability above 90%",
              ].map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery(example);
                    setError(null);
                  }}
                  className="text-left"
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {hasSearched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Search Results
            </h2>
            {total > 0 && (
              <p className="text-sm text-muted-foreground">
                Found {total.toLocaleString()} profiles
              </p>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner className="h-8 w-8" />
            </div>
          ) : profiles.length > 0 ? (
            <>
              <ProfileTable profiles={profiles} />
              <PaginationControls
                page={page}
                totalPages={totalPages}
                total={total}
                limit={limit}
                onPageChange={handlePageChange}
              />
            </>
          ) : (
            <Card className="border-border bg-card">
              <CardContent className="flex h-48 flex-col items-center justify-center">
                <Search className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium text-foreground">
                  No results found
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your search query
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
