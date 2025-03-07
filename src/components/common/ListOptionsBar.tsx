import { Context } from "@/context/Context";
import React, { Dispatch, SetStateAction, useContext } from "react";
interface Props {
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
  actionOnClick: () => void;
}
function ListOptionsBar({ setConfirmDialog, actionOnClick }: Props) {
  const { edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  return (
    <div className="options-btns flex gap-4 max-md:text-[85%]">
      <button
        className="border-0 bg-none hover:bg-transparent"
        onClick={() => {
          setEdit(!edit);
          if (edit) {
            actionOnClick();
          }
          setCheckedMedia([]);
        }}
      >
        <i className="bi bi-pencil-square"></i> {edit ? "Done" : "Edit"}
      </button>

      {checkedMedia.length > 0 && (
        <button
          className="border-0 bg-none hover:bg-transparent"
          onClick={() => {
            setConfirmDialog(true);
          }}
        >
          <i className="bi bi-trash3"></i> Delete
        </button>
      )}
    </div>
  );
}

export default ListOptionsBar;
