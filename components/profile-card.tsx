"use client";

import { Profile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Calendar,
  MapPin,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

interface ProfileCardProps {
  profile: Profile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-2xl font-semibold text-foreground">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="text-2xl text-foreground">
                {profile.name}
              </CardTitle>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={
                    profile.gender === "male"
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-pink-500/10 text-pink-400"
                  }
                >
                  {profile.gender}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {profile.age_group}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Age */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <User className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="text-lg font-semibold text-foreground">
                {profile.age} years
              </p>
            </div>
          </div>

          {/* Country */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <MapPin className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country</p>
              <p className="text-lg font-semibold text-foreground">
                {profile.country_id}
              </p>
            </div>
          </div>

          {/* Sample Size */}
          <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <Users className="h-5 w-5 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Country Name</p>
              <p className="text-lg font-semibold text-foreground">
                {profile.country_name.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Probabilities */}
        <div className="rounded-lg border border-border p-4">
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            Confidence Scores
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Gender Probability
                </span>
                <span className="font-semibold text-foreground">
                  {(profile.gender_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{ width: `${profile.gender_probability * 100}%` }}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  Country Probability
                </span>
                <span className="font-semibold text-foreground">
                  {(profile.country_probability * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted">
                <div
                  className="h-2 rounded-full bg-success"
                  style={{ width: `${profile.country_probability * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-6 border-t border-border pt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              Created: {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {new Date(profile.created_at).toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* ID */}
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Profile ID</p>
          <p className="mt-1 font-mono text-sm text-foreground">{profile.id}</p>
        </div>
      </CardContent>
    </Card>
  );
}
