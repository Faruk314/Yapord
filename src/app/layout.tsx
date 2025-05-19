import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { SocketProvider } from "@/context/socketContext";
import UserSettingsFooter from "@/features/auth/components/UserSettingsFooter";
import { getCurrentUser } from "@/features/auth/actions/user";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yapord",
  description: "App made for yaping",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser({
    redirectIfNotFound: true,
    withFullUser: true,
  });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}
      >
        <SocketProvider>{children}</SocketProvider>

        <Toaster position="top-right" richColors />

        <UserSettingsFooter user={user} />
      </body>
    </html>
  );
}
