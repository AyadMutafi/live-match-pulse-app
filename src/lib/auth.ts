import { cookies } from "next/headers"
import crypto from "crypto"
import prisma from "./prisma"

const SESSION_SECRET = process.env.SESSION_SECRET || "fan-pulse-secret-key-2026"
const COOKIE_NAME = "pulse_session"

export type Session = {
  userId: string
  username: string
  role: 'ADMIN' | 'EDITOR'
  assignedTeam?: string | null
}

/**
 * Signs a session object and returns a string
 */
function signSession(session: Session): string {
  const data = JSON.stringify(session)
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(data)
    .digest("hex")
  return `${Buffer.from(data).toString("base64")}.${signature}`
}

/**
 * Verifies and parses a session string
 */
function verifySession(sessionStr: string): Session | null {
  try {
    const [dataBase64, signature] = sessionStr.split(".")
    const data = Buffer.from(dataBase64, "base64").toString("utf-8")
    
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
      .update(data)
      .digest("hex")
    
    if (signature !== expectedSignature) return null
    return JSON.parse(data) as Session
  } catch {
    return null
  }
}

export async function createSession(user: { id: string, username: string, role: string, assignedTeam?: string | null }) {
  const session: Session = {
    userId: user.id,
    username: user.username,
    role: user.role as any,
    assignedTeam: user.assignedTeam
  }
  
  const sessionStr = signSession(session)
  const cookieStore = await cookies()
  
  cookieStore.set(COOKIE_NAME, sessionStr, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7 // 1 week
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionStr = cookieStore.get(COOKIE_NAME)?.value
  if (!sessionStr) return null
  return verifySession(sessionStr)
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

/**
 * Checks if current user is an Admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.role === "ADMIN"
}

/**
 * Checks if current user is authorized for a specific team
 */
export async function canManageTeam(teamName: string): Promise<boolean> {
  const session = await getSession()
  if (!session) return false
  if (session.role === "ADMIN") return true
  return session.assignedTeam === teamName
}
