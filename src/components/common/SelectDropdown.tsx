import { Context } from "@/context/Context";
import { useContext, useEffect, useState } from "react";

interface Props {
  listSelectedChange?: boolean;
  selectDefaultName: string;
  selectOptions: string[];
  actionWhenSelectChange: (selected: string) => void;
}

export default function SelectDropdown({ listSelectedChange, selectDefaultName, selectOptions, actionWhenSelectChange }: Props) {
  const { edit, setEdit, setCheckedMedia } = useContext(Context);

  const [selected, setSelected] = useState(selectDefaultName);

  useEffect(() => { //applicable to /lists only when selecting a new list: "favorites to watchlist" or vice versa
    setSelected(selectDefaultName);
  }, [listSelectedChange]);

  useEffect(() => {
    actionWhenSelectChange(selected);
  }, [selected]);

  return (
    <div className="relative inline-block text-left">
      <select
        title="select"
        value={selected}
        onChange={(e) => {
          setSelected(e.target.value);
          if (edit) {
            setEdit(false);
            setCheckedMedia([]);
          }
        }}
        className="px-4 rounded-lg py-1.5 border border-zinc-500 bg-gray-900 text-gray-200 outline-none text-sm xl:text-base w-full"
      >
        <option value={selectDefaultName} disabled>
          {selectDefaultName}
        </option>
        {selected != selectDefaultName && <option value={"All"}>All</option>}
        {selectOptions.map((option) => (
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
