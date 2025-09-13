import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TutorConnect - Find Your Perfect Tutor",
  description:
    "Connect with expert tutors or become a tutor yourself. Professional tutoring platform for all subjects.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem

            dark
          >
            {children}
          </ThemeProvider>
        </body>
    </html>
  );
}
