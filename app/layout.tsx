import type { Metadata } from "next";
import "./globals.css";
import OnboardingCheck from "@/components/OnboardingCheck";

export const metadata: Metadata = {
  title: "ワンネスキングダム - Oneness Kingdom",
  description: "愛と貢献のメタソーシャルプラットフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;700;800&family=Noto+Sans+JP:wght@400;500;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background-light text-text-light-primary dark:bg-background-dark dark:text-text-dark-primary">
        <OnboardingCheck />
        {children}
      </body>
    </html>
  );
}
