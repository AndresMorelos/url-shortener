import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/toaster'

export const metadata: Metadata = {
  title: 'Url Shortener',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
