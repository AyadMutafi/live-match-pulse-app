import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [players, matches] = await Promise.all([
    db.player.findMany({
      orderBy: { lastUpdated: 'desc' },
      take: 20
    }),
    db.match.findMany({
      orderBy: { date: 'desc' },
      take: 10
    })
  ])

  return NextResponse.json({ players, matches })
}
