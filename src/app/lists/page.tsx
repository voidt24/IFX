import { Suspense } from "react";
import Lists from "@/views/Lists";

export default function ListsPage() {
  return (
    <Suspense fallback={<div>Loading list options...</div>}>
      <Lists />
    </Suspense>
  );
}
