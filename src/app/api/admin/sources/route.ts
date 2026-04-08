import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const where = session.role === "ADMIN" ? {} : { clubId: session.assignedTeam }
    const sources = await prisma.dataSource.findMany({
      where,
      orderBy: { lastScraped: 'desc' },
      include: { user: { select: { username: true } } }
    })
    return NextResponse.json(sources)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load sources" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { name, type, url, clubId, matchId } = await request.json()
    
    // Authorization check
    if (session.role !== "ADMIN" && session.assignedTeam !== clubId) {
      return NextResponse.json({ error: "Unauthorized for this team" }, { status: 403 })
    }

    const source = await prisma.dataSource.create({
      data: {
        name,
        type, // 'HASHTAG' | 'ACCOUNT'
        url,
        clubId,
        matchId,
        userId: session.userId
      }
    })
    return NextResponse.json(source)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const { id } = await request.json()
    const source = await prisma.dataSource.findUnique({ where: { id } })
    
    if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Authorization check
    if (session.role !== "ADMIN" && source.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await prisma.dataSource.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 })
  }
}
