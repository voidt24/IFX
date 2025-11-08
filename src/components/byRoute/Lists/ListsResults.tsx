import { IMediaData } from "@/Types/index";
import MediaGrid from "@/components/MediaGrid/MediaGrid";

export const ListsResults = ({ currentListData }: { currentListData: IMediaData[] }) => {
  return (
    <div className="flex flex-col gap-2 h-full relative w-full min-h-screen">
      <MediaGrid mediaData={currentListData} canBeEdited={true} />
    </div>
  );
};
