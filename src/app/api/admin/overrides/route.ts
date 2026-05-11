import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { type, id, isManual, manualSentiment, manualHomeSentiment, manualAwaySentiment } = await request.json()

  if (type === 'player') {
    const updated = await db.player.update({
      where: { id },
      data: { 
        isManual, 
        manualSentiment: manualSentiment !== undefined ? parseInt(manualSentiment) : undefined,
        sentiment: isManual ? parseInt(manualSentiment) : undefined
      }
    })
    return NextResponse.json(updated)
  } else if (type === 'match') {
    const updated = await db.match.update({
      where: { id },
      data: { 
        isManual, 
        manualHomeSentiment: manualHomeSentiment !== undefined ? parseInt(manualHomeSentiment) : undefined,
        manualAwaySentiment: manualAwaySentiment !== undefined ? parseInt(manualAwaySentiment) : undefined,
        homeSentiment: isManual ? parseInt(manualHomeSentiment) : undefined,
        awaySentiment: isManual ? parseInt(manualAwaySentiment) : undefined
      }
    })
    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 })
}
