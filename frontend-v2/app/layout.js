import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Mew - L'IA qui vous propulse",
  description: "Optimisez votre carrière, votre fiscalité et votre communication grâce à l'intelligence artificielle. Simple, rapide, efficace.",
  keywords: "IA, intelligence artificielle, CV, recherche emploi, fiscalité, comptabilité, marketing, communication",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}