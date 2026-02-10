import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
  description:
    'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
  openGraph: {
    title: 'Samuell Goldfinch — Creative Director · Filmmaker · DJ',
    description:
      'Paris-based creative director, filmmaker, and international DJ. Founder of Blaze Production and Kolasi Agency.',
    type: 'website',
    url: 'https://samuellgoldfinch.com',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                }
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
