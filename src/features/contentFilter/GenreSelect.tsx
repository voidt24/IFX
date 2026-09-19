import SelectDropdown from "@/components/common/SelectDropdown";
import { selectFilterMovieCategories, selectFilterTVCategories } from "@/helpers/constants";
import { mediaProperties } from "@/helpers/mediaProperties.config";
import { RootState } from "@/store";
import { MediaTypeUrl } from "@/Types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

interface Props {
  selected: string | null;
  // Opcional: fuerza el tipo de media (ej. "movies" en Upcoming) en vez de leerlo de Redux
  mediaType?: MediaTypeUrl;
}

function GenreSelect({ selected, mediaType }: Props) {
  const { currentMediaType } = useSelector((state: RootState) => state.mediaDetails);
  const activeMediaType = mediaType ?? currentMediaType;

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const genre = searchParams.get("genre");
  const isMovie = activeMediaType == mediaProperties.movie.route;
  const options = isMovie ? selectFilterMovieCategories : selectFilterTVCategories;

  useEffect(() => {
    if (!genre || genre === "All") return;

    if (!options.includes(genre)) {
      params.set("genre", "All");
      router.replace(`?${params.toString()}`);
    }
  }, [genre]);

  return <SelectDropdown type="genre" selected={selected} selectDefaultName="Genre" selectOptions={options} />;
}

export default GenreSelect;
