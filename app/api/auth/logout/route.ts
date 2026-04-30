import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        cookie: request.headers.get("cookie") || "",
        "X-API-Version": "1",
      },
      credentials: "include",
    });

    const data = await response.json();

    // Clear cookies on the client side as well
    const res = NextResponse.json(data, { status: response.status });
    
    // Clear the session cookie
    res.cookies.delete("session");

    return res;
  } catch (error) {
    console.error("Error logging out:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to logout" },
      { status: 500 }
    );
  }
}
