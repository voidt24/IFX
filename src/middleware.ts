import { NextRequest, NextResponse } from "next/server";
import { ID_TOKEN_COOKIE_NAME, VERIFY_TOKEN_ROUTE } from "./firebase/firebase.config";

export const middleware = async (req: NextRequest) => {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/tvshows/") && path.includes("/watch")) {
    return getTvURLParamsMiddleware(req);
  }

  if (["/account", "/lists", "/history"].includes(path)) {
    if (!req.cookies.has(ID_TOKEN_COOKIE_NAME)) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      await fetch(VERIFY_TOKEN_ROUTE, {
        method: "POST",
        body: JSON.stringify({ token: req.cookies.get(ID_TOKEN_COOKIE_NAME)?.value }),
      });
    } catch (error) {
      return new NextResponse("Error validating token");
    }
  }
  return NextResponse.next();
};

export function getTvURLParamsMiddleware(req: NextRequest) {
  const url = new URL(req.url);
  const season = url.searchParams.get("season") || "";
  const episode = url.searchParams.get("episode") || "";

  const res = NextResponse.next();
  res.headers.set("x-season", season);
  res.headers.set("x-episode", episode);

  return res;
}
