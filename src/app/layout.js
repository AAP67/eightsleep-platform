import './globals.css'

export const metadata = {
  title: 'Eight Sleep Platform — The Outcome Layer for Every Health App',
  description: 'A product vision prototype demonstrating how Eight Sleep can become the platform that closes the feedback loop for the entire health ecosystem.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
