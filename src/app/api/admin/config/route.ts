import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let config = await db.systemConfig.findUnique({ where: { id: 'global' } })
  
  if (!config) {
    config = await db.systemConfig.create({
      data: {
        id: 'global',
        isAgentEnabled: true,
        matchDayMode: false,
        maintenanceMode: false
      }
    })
  }

  return NextResponse.json(config)
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { isAgentEnabled, matchDayMode, maintenanceMode } = await request.json()

  const config = await db.systemConfig.upsert({
    where: { id: 'global' },
    update: { isAgentEnabled, matchDayMode, maintenanceMode },
    create: { id: 'global', isAgentEnabled, matchDayMode, maintenanceMode }
  })

  return NextResponse.json(config)
}
