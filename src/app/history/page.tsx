import { APP_NAME } from "@/helpers/api.config";
import History from "@/views/History";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `History - ${APP_NAME}`,
};
function HistoryPage() {
  return <History />;
}

export default HistoryPage;
