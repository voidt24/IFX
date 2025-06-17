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
        <link rel="icon" type="image/png" href="/favicon-196.png" />
        <link rel="apple-touch-icon" href="/apple-icon-180.png" />
        <link rel="manifest" href="/site.webmanifest"></link>

        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1170-2532.jpg"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1290-2796.jpg"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1179-2556.jpg"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash-1284-2778.jpg"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
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
