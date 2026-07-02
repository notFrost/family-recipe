import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Family Recipe",
  description:
    "Store your family recipes, discover new ones, and keep your family's cooking together — even when you move out.",
  // Installed-PWA polish (iOS reads these, not the manifest).
  appleWebApp: {
    capable: true,
    title: "Family Recipe",
    statusBarStyle: "default",
  },
};

// Browser chrome matches the amber brand in light and the mocha canvas in dark.
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#d97706" },
    { media: "(prefers-color-scheme: dark)", color: "#241a12" },
  ],
};

// Set the theme class before first paint so dark mode doesn't flash. Reads the
// saved preference, falling back to the OS setting.
const themeScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: the inline themeScript adds the `dark` class to
    // <html> before React hydrates, so the server markup (no class) and the
    // hydrated DOM intentionally differ on this element. Scoped to <html> only.
    <html
      lang="en"
      className={`${nunito.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
