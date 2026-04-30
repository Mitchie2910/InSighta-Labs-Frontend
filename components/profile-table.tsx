"use client";

import Link from "next/link";
import { Profile } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProfileTableProps {
  profiles: Profile[];
}

export function ProfileTable({ profiles }: ProfileTableProps) {
  if (profiles.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">No profiles found</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-muted-foreground">Name</TableHead>
            <TableHead className="text-muted-foreground">Gender</TableHead>
            <TableHead className="text-muted-foreground">Age</TableHead>
            <TableHead className="text-muted-foreground">Age Group</TableHead>
            <TableHead className="text-muted-foreground">Country</TableHead>
            <TableHead className="text-muted-foreground">Gender Prob.</TableHead>
            <TableHead className="text-muted-foreground">Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {profiles.map((profile) => (
            <TableRow
              key={profile.id}
              className="cursor-pointer transition-colors hover:bg-accent"
            >
              <TableCell>
                <Link
                  href={`/profile/${profile.id}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {profile.name}
                </Link>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell className="text-foreground">{profile.age}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {profile.age_group}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-mono text-sm text-foreground">
                  {profile.country_id}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {(profile.gender_probability * 100).toFixed(0)}%
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(profile.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
