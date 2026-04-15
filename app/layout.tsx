import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EventIn — Discover Local Events in Bangalore",
  description: "Find and book the best local events near you — music, comedy, food, sports, art and more.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
