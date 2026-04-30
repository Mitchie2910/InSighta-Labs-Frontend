import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const url = `${API_URL}/api/profiles/search${queryString ? `?${queryString}` : ""}`;

    const response = await fetch(url, {
      headers: {
        cookie: request.headers.get("cookie") || "",
        "X-API-Version": "1",
      },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error searching profiles:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to search profiles" },
      { status: 500 }
    );
  }
}
