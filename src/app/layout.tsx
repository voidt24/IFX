import type { Metadata } from "next";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.scss";
import "../sass/main.scss";
import Navbar from "../components/Navbar";
import ContextWrapper from "../context/Context";
import Trailer from "@/components/Trailer";

export const metadata: Metadata = {
  title: "Prods",
  description: "Access and save your favorite films and series, discover new productions and save them into your watchlists or any other custom lists!",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="Prods" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <ContextWrapper>
          <Navbar />
          {children}
          <Trailer />
        </ContextWrapper>
      </body>
    </html>
  );
}
