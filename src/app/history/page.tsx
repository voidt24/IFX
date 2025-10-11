import History from "@/views/History";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "History - IFX",
};
function HistoryPage() {
  return <History />;
}

export default HistoryPage;
