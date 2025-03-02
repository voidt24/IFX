import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface MediaItem {
  id: number;
  media_type: "movie" | "tv";
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: string;
}
interface Props {
  currentListData: MediaItem[];
  setCurrentListData: Dispatch<SetStateAction<MediaItem[] | null>>;
  listSelectedChange: boolean;
}

export default function SelectDropdown({ currentListData, setCurrentListData, listSelectedChange }: Props) {
  const [selected, setSelected] = useState("Filter by");
  const [currentList, setCurrentList] = useState<MediaItem[] | []>([]);
  const filterOptions = ["Movies", "TV Shows"];

  useEffect(() => {
    setCurrentList(currentListData);
    setSelected("Filter by");
  }, [listSelectedChange]);

  useEffect(() => {
    switch (selected) {
      case "All":
        setCurrentListData(currentList);
        break;
      case filterOptions[0]:
        const sortedMovies = [...currentList];

        const resultMovies = sortedMovies.filter((obj) => {
          return obj.media_type == "movie";
        });
        setCurrentListData(resultMovies);
        break;
      case filterOptions[1]:
        const sortedTV = [...currentList];

        const resultTV = sortedTV.filter((obj) => {
          return obj.media_type == "tv";
        });
        setCurrentListData(resultTV);
        break;
    }
  }, [selected]);

  return (
    <div className="relative inline-block text-left">
      <select title="select" value={selected} onChange={(e) => setSelected(e.target.value)} className="px-4 rounded-lg py-1.5 w-40 border border-zinc-500 bg-gray-900 text-gray-200 outline-none">
        <option value="Filter by" disabled>
          Filter by
        </option>
        {selected != "Filter by" && <option value={"All"}>All</option>}
        {filterOptions.map((option) => (
          <>
            <option key={option} value={option}>
              {option}
            </option>
          </>
        ))}
      </select>
    </div>
  );
}
