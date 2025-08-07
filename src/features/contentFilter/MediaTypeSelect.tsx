import SelectDropdown from "@/components/common/SelectDropdown";
import { selectFilterCategories } from "@/helpers/constants";
import { RootState } from "@/store";
import { IMediaData } from "@/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";

function MediaTypeSelect({
  originalListData,
  setOriginalListData,
  currentListData,
  setCurrentListData,
  listSelectedChange,
  setLoading,
}: {
  originalListData: IMediaData[];
  setOriginalListData: Dispatch<SetStateAction<IMediaData[]>>;
  currentListData: IMediaData[];
  setCurrentListData: Dispatch<SetStateAction<IMediaData[]>>;
  listSelectedChange: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}) {
  const dispatch = useDispatch();
  const { edit } = useSelector((state: RootState) => state.listsManagement);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const media = searchParams.get("media");

  useEffect(() => {
    if (currentListData) {
      setOriginalListData(currentListData);
    }
    setLoading(false);
  }, [listSelectedChange]);

  useEffect(() => {
    if (!media || !["Filter by", "TV Shows", "Movies", "All"].includes(media)) {
      params.set("media", "Filter by");
      router.replace(`?${params.toString()}`);
    }
  }, [media]);

  useEffect(() => {
    if (originalListData.length < 1) return;
    switch (media) {
      case "All":
        setCurrentListData(originalListData);
        break;
      case selectFilterCategories[0]:
        setCurrentListData(originalListData.filter((obj) => obj.media_type === "movie"));
        break;
      case selectFilterCategories[1]:
        setCurrentListData(originalListData.filter((obj) => obj.media_type === "tv"));
        break;
      default:
        setCurrentListData(originalListData);
    }

    if (edit) {
      dispatch(setEdit(false));
      dispatch(setCheckedMedia([]));
    }
  }, [media]);

  return <SelectDropdown type="listMediaType" selected={media} selectDefaultName="Filter by" selectOptions={selectFilterCategories} />;
}

export default MediaTypeSelect;
