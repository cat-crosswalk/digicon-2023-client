import { clsx } from 'clsx'
import React from 'react'

import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Mikage',
  description: '世界をまるごと保存。写真の中を歩く体験を',
  openGraph: {
    title: 'Mikage',
    description: '世界をまるごと保存。写真の中を歩く体験を',
    url: 'https://mikage.trap.show',
    type: 'website',
    siteName: 'Mikage',
    images: [
      {
        url: 'https://mikage.trap.show/OGP.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

const RootLayout: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <html lang='ja'>
      <head>
        <link rel='manifest' href='/manifest.json' />
      </head>
      <body className={clsx('bg-bg-primary')}>{children}</body>
    </html>
  )
}

export default RootLayout
