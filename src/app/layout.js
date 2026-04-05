import './globals.css'

export const metadata = {
  title: 'Eight Sleep Platform — The Outcome Layer for Every Health App',
  description: 'A product vision demonstrating how Eight Sleep can become the platform that closes the feedback loop for the entire health ecosystem. Health apps send interventions, Eight Sleep measures outcomes, insights flow back.',
  keywords: ['Eight Sleep', 'sleep platform', 'health API', 'sleep tracking', 'feedback loop', 'health ecosystem'],
  authors: [{ name: 'Karan', url: 'https://francium77.com' }],
  openGraph: {
    title: 'Eight Sleep Platform — The Outcome Layer for Every Health App',
    description: 'Health apps guess at outcomes. Eight Sleep measures the truth. Open that data as a two-way API, and the entire health ecosystem gets smarter.',
    type: 'website',
    siteName: 'Eight Sleep Platform Vision',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eight Sleep Platform — The Outcome Layer for Every Health App',
    description: 'Health apps guess at outcomes. Eight Sleep measures the truth.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  )
}
