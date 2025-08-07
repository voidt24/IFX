import SelectDropdown from "@/components/common/SelectDropdown";
import { selectFilterMovieCategories, selectFilterTVCategories } from "@/helpers/constants";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function GenreSelect({ selected }: { selected: string | null }) {
  const { currentMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const genre = searchParams.get("genre");

  useEffect(() => {
    if (!genre) return;

    if (currentMediaType == mediaProperties.movie.route) {
      if (!selectFilterMovieCategories.includes(genre)) {
        params.set("genre", "All");
        router.replace(`?${params.toString()}`);
      }
    } else {
      if (!selectFilterTVCategories.includes(genre)) {
        params.set("genre", "All");
        router.replace(`?${params.toString()}`);
      }
    }
  }, [genre]);
  return (
    <SelectDropdown
      type="genre"
      selected={selected}
      selectDefaultName="Genre"
      selectOptions={currentMediaType == mediaProperties.movie.route ? selectFilterMovieCategories : selectFilterTVCategories}
    />
  );
}

export default GenreSelect;
