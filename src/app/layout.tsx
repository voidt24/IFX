import type { Metadata } from "next";
import "../../node_modules/bootstrap-icons/font/bootstrap-icons.scss";
import "../styles/styles.scss";
import ContextWrapper from "../context/Context";
import Trailer from "@/components/Trailer";
import DefaultLayout from "@/components/layout/DefaultLayout";
export const metadata: Metadata = {
  title: "IFX",
  description: "Watch and save your favorite films and series, discover new productions and save them into your watchlists!",
};

export default function RootLayout({ children, modal }: Readonly<{ children: React.ReactNode; modal: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest"></link>
      </head>
      <body>
        <ContextWrapper>
          <DefaultLayout>
            {children}
            {modal}
            <Trailer />
          </DefaultLayout>
        </ContextWrapper>
      </body>
    </html>
  );
}
