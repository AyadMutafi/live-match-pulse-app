import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { BottomNav } from '@/components/BottomNav'
import { TopHeader } from '@/components/TopHeader'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/context/LanguageContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const viewport: Viewport = {
  themeColor: '#04050f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents pinch-zoom for that native app feel
}

export const metadata: Metadata = {
  metadataBase: new URL('https://fanpulse.app'),
  title: 'Fan Pulse | Live Football Sentiment',
  description: 'Real-time AI-powered fan sentiment tracking for Champions League',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fan Pulse',
  },
  openGraph: {
    title: 'Fan Pulse | Live Football Sentiment',
    description: 'Track real-time fan emotions for your favorite clubs natively.',
    url: 'https://fanpulse.app',
    siteName: 'Fan Pulse',
    images: [
      {
        url: '/og-image.png', // We'll assume a placeholder for now
        width: 1200,
        height: 630,
        alt: 'Fan Pulse Dashboard',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fan Pulse | Live Football Sentiment',
    description: 'Track real-time fan emotions for your favorite clubs with AI.',
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="bg-background">
              <div
                className="relative mx-auto flex flex-col min-h-[100dvh] bg-background shadow-2xl border-x border-border"
                style={{ maxWidth: 430 }}
              >
                <TopHeader />
                <main className="flex-1 relative z-10 pb-24 overflow-x-hidden">
                  {children}
                </main>
                <BottomNav />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
