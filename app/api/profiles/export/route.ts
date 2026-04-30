import { NextRequest } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Build query params for export - exclude page/limit as export returns all
  const params = new URLSearchParams();
  const allowedParams = [
    "gender",
    "age_group",
    "country_id",
    "min_age",
    "max_age",
    "min_gender_probability",
    "min_country_probability",
    "sort_by",
    "order",
  ];

  allowedParams.forEach((param) => {
    const value = searchParams.get(param);
    if (value) {
      params.set(param, value);
    }
  });

  try {
    const response = await fetch(
      `${API_URL}/profiles/export?${params.toString()}`,
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
          "x-csrf-token": request.headers.get("x-csrf-token") || "",
          "X-API-Version": "1",
          Accept: "text/csv",
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(
        JSON.stringify({
          status: "error",
          message: errorText || "Export failed",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Stream the CSV response from backend
    const headers = new Headers();
    headers.set("Content-Type", "text/csv");
    headers.set(
      "Content-Disposition",
      `attachment; filename="profiles-export-${new Date().toISOString().split("T")[0]}.csv"`
    );

    // Forward the streaming response body
    return new Response(response.body, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Export error:", error);
    return new Response(
      JSON.stringify({
        status: "error",
        message: "Failed to export profiles",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
