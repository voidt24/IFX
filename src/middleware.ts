import { NextRequest, NextResponse } from "next/server";
import { ID_TOKEN_COOKIE_NAME, VERIFY_TOKEN_ROUTE } from "./firebase/firebase.config";

export const middleware = async (req: NextRequest) => {
  if (!req.cookies.has(`${ID_TOKEN_COOKIE_NAME}`)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    //had to do  the token verify outside of middleware, due to nodejs errors,
    await fetch(VERIFY_TOKEN_ROUTE, {
      method: "POST",
      body: JSON.stringify({ token: req.cookies.get(`${ID_TOKEN_COOKIE_NAME}`)?.value }),
    });
  } catch (er) {
    return new NextResponse("Error validating token");
  }
  return NextResponse.next();
};

export const config = {
  matcher: ["/lists", "/settings"],
};
