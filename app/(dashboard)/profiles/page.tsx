"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Profile, ProfileFilters, PaginatedResponse } from "@/lib/types";
import { FiltersPanel } from "@/components/filters-panel";
import { ProfileTable } from "@/components/profile-table";
import { PaginationControls } from "@/components/pagination-controls";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Download, Filter, RefreshCw } from "lucide-react";

export default function ProfilesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Parse filters from URL
  const getFiltersFromUrl = useCallback((): ProfileFilters => {
    return {
      gender: searchParams.get("gender") as ProfileFilters["gender"] || undefined,
      age_group: searchParams.get("age_group") || undefined,
      country_id: searchParams.get("country_id") || undefined,
      min_age: searchParams.get("min_age")
        ? Number(searchParams.get("min_age"))
        : undefined,
      max_age: searchParams.get("max_age")
        ? Number(searchParams.get("max_age"))
        : undefined,
      min_gender_probability: searchParams.get("min_gender_probability")
        ? Number(searchParams.get("min_gender_probability"))
        : undefined,
      min_country_probability: searchParams.get("min_country_probability")
        ? Number(searchParams.get("min_country_probability"))
        : undefined,
      sort_by:
        (searchParams.get("sort_by") as ProfileFilters["sort_by"]) || "created_at",
      order: (searchParams.get("order") as ProfileFilters["order"]) || "desc",
      page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 10,
    };
  }, [searchParams]);

  const [filters, setFilters] = useState<ProfileFilters>(getFiltersFromUrl());

  // Update URL when filters change
  const updateUrl = useCallback(
    (newFilters: ProfileFilters) => {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });
      router.push(`/profiles?${params.toString()}`);
    },
    [router]
  );

  // Fetch profiles
  const fetchProfiles = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/profiles?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profiles");
      }

      const data: PaginatedResponse<Profile> = await response.json();
      setProfiles(data.data);
      setTotal(data.total);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  // Sync filters from URL on mount and URL changes
  useEffect(() => {
    setFilters(getFiltersFromUrl());
  }, [getFiltersFromUrl]);

  const handleFiltersChange = (newFilters: ProfileFilters) => {
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handlePageChange = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: ProfileFilters = {
      sort_by: "created_at",
      order: "desc",
      page: 1,
      limit: 10,
    };
    setFilters(defaultFilters);
    updateUrl(defaultFilters);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      // Build export params - exclude page/limit
      const params = new URLSearchParams();
      const exportFilters = { ...filters };
      delete exportFilters.page;
      delete exportFilters.limit;

      Object.entries(exportFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== "") {
          params.set(key, String(value));
        }
      });

      const response = await fetch(`/api/profiles/export?${params.toString()}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get the blob and trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `profiles-export-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profiles
          </h1>
          <p className="mt-1 text-muted-foreground">
            Browse and filter profile records
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={exporting || loading}
            className="gap-2"
          >
            <Download className={`h-4 w-4 ${exporting ? "animate-pulse" : ""}`} />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfiles}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {showFilters && (
        <FiltersPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onReset={handleReset}
        />
      )}

      {error ? (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchProfiles}
            className="mt-2"
          >
            Try again
          </Button>
        </div>
      ) : loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="h-8 w-8" />
        </div>
      ) : (
        <>
          <ProfileTable profiles={profiles} />
          <PaginationControls
            page={filters.page || 1}
            totalPages={totalPages}
            total={total}
            limit={filters.limit || 10}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
