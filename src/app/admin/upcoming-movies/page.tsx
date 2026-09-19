import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import { ID_TOKEN_COOKIE_NAME } from "@/firebase/firebase.config";
import { verifyAdminToken } from "@/lib/auth-admin";
import { APP_NAME } from "@/helpers/api.config";
import UpcomingMovies from "@/views/UpcomingMovies";

export const metadata: Metadata = {
  title: `Upcoming Movies - ${APP_NAME}`,
};

export default async function UpcomingMoviesPage() {
  // Server-side check, done before anything renders — this is the real gate.
  // The button on /movies (useIsAdmin) is only a UI convenience on top of this.
  const token = cookies().get(ID_TOKEN_COOKIE_NAME)?.value;
  const admin = await verifyAdminToken(token);

  if (!admin) {
    redirect("/");
  }

  return <UpcomingMovies />;
}
