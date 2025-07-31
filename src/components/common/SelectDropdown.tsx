import { RootState } from "@/store";
import {  useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";

interface Props {
  listSelectedChange?: boolean;
  selectDefaultName: string;
  selectOptions: string[];
  actionWhenSelectChange: (selected: string) => void;
}

export default function SelectDropdown({ listSelectedChange, selectDefaultName, selectOptions, actionWhenSelectChange }: Props) {
  // const {  setEdit, setCheckedMedia } = useContext(Context);

  const [selected, setSelected] = useState(selectDefaultName);

  const { edit } = useSelector((state: RootState) => state.listsManagement);

  useEffect(() => {
    //applicable to /lists only when selecting a new list: "favorites to watchlist" or vice versa
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
        className="px-4 rounded-lg py-1.5 border border-zinc-500 bg-surface-modal text-content-primary outline-none w-full"
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
