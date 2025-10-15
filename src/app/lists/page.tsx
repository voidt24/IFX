import { Suspense } from "react";
import Lists from "@/views/Lists";
import { Metadata } from "next";
import { APP_NAME } from "@/helpers/api.config";

export const metadata: Metadata = {
  title: `My lists - ${APP_NAME}`,
};
export default function ListsPage() {
  return (
    <Suspense fallback={<div>Loading list options...</div>}>
      <Lists />
    </Suspense>
  );
}
