import { IMediaData } from "@/Types/index";
import MediaGrid from "./MediaGrid/MediaGrid";

export const ListsResults = ({ currentListData }: { currentListData: IMediaData[] }) => {
  return (
    <div className="flex flex-col gap-2 h-full relative w-full">
      <MediaGrid mediaData={currentListData} canBeEdited={true} />
    </div>
  );
};
