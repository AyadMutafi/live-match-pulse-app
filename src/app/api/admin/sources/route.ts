import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const sources = await prisma.dataSource.findMany({
      orderBy: { lastScraped: 'desc' }
    })
    return NextResponse.json(sources)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load sources" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { name, type, url, account, hashtag, clubId } = await request.json()

    const source = await prisma.dataSource.create({
      data: { name, type, url, account, hashtag, clubId }
    })
    return NextResponse.json(source)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create source" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json()
    const source = await prisma.dataSource.findUnique({ where: { id } })

    if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.dataSource.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete source" }, { status: 500 })
  }
}
