import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"
import crypto from "crypto"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const users = await prisma.user.findMany({
      select: { 
        id: true, 
        username: true, 
        role: true, 
        assignedTeam: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load users" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { username, password, role, assignedTeam } = await request.json()
    
    if (!username || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        assignedTeam
      }
    })
    
    return NextResponse.json({ 
      id: user.id, 
      username: user.username, 
      role: user.role, 
      assignedTeam: user.assignedTeam 
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await request.json()
    
    // Safety: Don't allow deleting the super admin via API
    const userToDelete = await prisma.user.findUnique({ where: { id } })
    if (userToDelete?.username === "admin") {
      return NextResponse.json({ error: "Cannot delete super admin" }, { status: 403 })
    }

    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 })
  }
}
