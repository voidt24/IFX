import { Context } from "@/context/Context";
import React, { Dispatch, SetStateAction, useContext } from "react";
interface Props {
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
}
function ListOptionsBar({ setConfirmDialog }: Props) {
  const { edit, setEdit, checkedMedia, setCheckedMedia } = useContext(Context);

  return (
    <div className="options-btns flex-col-center gap-1 max-md:text-[85%]">
      <div className="flex-row-center gap-4">
        <button
          className="border-0 bg-none hover:bg-transparent"
          onClick={() => {
            setEdit(!edit);
            setCheckedMedia([]);
          }}
        >
          <i className="bi bi-pencil-square"></i> {edit ? "Cancel" : "Edit"}
        </button>

        {edit && checkedMedia.length > 0 && (
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

      {edit && <p className="italic text-content-third ">{checkedMedia.length} selected</p>}
    </div>
  );
}

export default ListOptionsBar;
