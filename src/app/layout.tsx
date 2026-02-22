import type { Metadata } from "next";
import "./globals.css";
import { AuthWrapper } from "./auth-wrapper";

export const metadata: Metadata = {
  title: "Nexofi — AI-Powered Project & Team Management",
  description:
    "Plan projects with AI-generated blueprints, manage hybrid teams in a beautiful 2D office space, and track performance in real time.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  );
}
