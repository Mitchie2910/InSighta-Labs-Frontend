"use client";

import { ProfileFilters } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface FiltersPanelProps {
  filters: ProfileFilters;
  onFiltersChange: (filters: ProfileFilters) => void;
  onReset: () => void;
}

export function FiltersPanel({
  filters,
  onFiltersChange,
  onReset,
}: FiltersPanelProps) {
  const updateFilter = <K extends keyof ProfileFilters>(
    key: K,
    value: ProfileFilters[K]
  ) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 });
  };

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) =>
      value !== undefined &&
      value !== "" &&
      key !== "page" &&
      key !== "limit"
  );

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-8 gap-1 text-muted-foreground hover:text-foreground"
          >
            <X className="h-3 w-3" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Gender */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Gender</label>
          <Select
            value={filters.gender || "all"}
            onValueChange={(value) =>
              updateFilter("gender", value === "all" ? undefined : (value as "male" | "female"))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All genders" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All genders</SelectItem>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Age Group */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Age Group</label>
          <Select
            value={filters.age_group || "all"}
            onValueChange={(value) =>
              updateFilter("age_group", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All groups</SelectItem>
              <SelectItem value="child">Child</SelectItem>
              <SelectItem value="teen">Teen</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Country */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Country Code</label>
          <Input
            placeholder="e.g., US, NG"
            value={filters.country_id || ""}
            onChange={(e) =>
              updateFilter("country_id", e.target.value.toUpperCase() || undefined)
            }
            className="h-9"
            maxLength={2}
          />
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Sort By</label>
          <Select
            value={filters.sort_by || "created_at"}
            onValueChange={(value) =>
              updateFilter(
                "sort_by",
                value as "age" | "created_at" | "gender_probability"
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at">Created Date</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="gender_probability">Gender Probability</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Min Age */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Min Age</label>
          <Input
            type="number"
            placeholder="0"
            value={filters.min_age || ""}
            onChange={(e) =>
              updateFilter(
                "min_age",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9"
            min={0}
          />
        </div>

        {/* Max Age */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Max Age</label>
          <Input
            type="number"
            placeholder="100"
            value={filters.max_age || ""}
            onChange={(e) =>
              updateFilter(
                "max_age",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9"
            min={0}
          />
        </div>

        {/* Min Gender Probability */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Min Gender Prob.</label>
          <Input
            type="number"
            placeholder="0.0"
            value={filters.min_gender_probability || ""}
            onChange={(e) =>
              updateFilter(
                "min_gender_probability",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9"
            min={0}
            max={1}
            step={0.1}
          />
        </div>

        {/* Order */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Order</label>
          <Select
            value={filters.order || "desc"}
            onValueChange={(value) =>
              updateFilter("order", value as "asc" | "desc")
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Min Country Probability */}
        <div className="space-y-2">
          <label className="text-xs text-muted-foreground">Min Country Prob.</label>
          <Input
            type="number"
            placeholder="0.0"
            value={filters.min_country_probability || ""}
            onChange={(e) =>
              updateFilter(
                "min_country_probability",
                e.target.value ? Number(e.target.value) : undefined
              )
            }
            className="h-9"
            min={0}
            max={1}
            step={0.1}
          />
        </div>
      </div>
    </div>
  );
}
