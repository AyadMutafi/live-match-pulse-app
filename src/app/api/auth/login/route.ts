import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createSession } from "@/lib/auth"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    
    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    
    const user = await prisma.user.findUnique({
      where: { username }
    })

    if (!user || user.password !== hashedPassword) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 })
    }

    await createSession(user)
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        username: user.username, 
        role: user.role, 
        assignedTeam: user.assignedTeam 
      } 
    })
  } catch (error: any) {
    console.error("Login Error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
