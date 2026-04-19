import type { Metadata, Viewport } from 'next'
import './globals.css'
import { BottomNav, SidebarNav } from '@/components/Navigation'
import { TopHeader } from '@/components/TopHeader'
import { ThemeProvider } from '@/components/ThemeProvider'
import { LanguageProvider } from '@/context/LanguageContext'

export const viewport: Viewport = {
  themeColor: '#04050f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents pinch-zoom for that native app feel
}

// ... keeping metadata the same

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
        url: '/og-image.png',
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="bg-background min-h-[100dvh] flex flex-col items-center">
              <div className="w-full max-w-md md:max-w-[1440px] flex flex-col min-h-[100dvh]">
                <TopHeader />
                <div className="flex flex-1 flex-col md:flex-row relative w-full border-x border-border shadow-2xl">
                  {/* Desktop Sidebar will align automatically */}
                  <SidebarNav />
                  
                  <main className="flex-1 relative z-10 pb-24 md:pb-8 overflow-x-hidden md:px-0">
                    {children}
                  </main>
                </div>
                <BottomNav />
              </div>
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
