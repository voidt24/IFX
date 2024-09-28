import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "New productions",
  description: "Access and save your favorite films and series, discover new productions and save them into your watchlists or any other custom lists!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={``}
      >
        {children}
      </body>
    </html>
  );
}
