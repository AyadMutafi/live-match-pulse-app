import { NextResponse } from "next/server"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    // Mock authentication: allow 'admin' to log in
    if (username === "admin" && password === "admin") {
      await createSession({
        id: "mock-admin-id",
        username: "admin",
        role: "ADMIN",
        assignedTeam: null
      })
      
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ error: "Invalid credentials (Demo: use admin/admin)" }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
