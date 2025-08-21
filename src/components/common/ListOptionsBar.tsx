import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";

interface Props {
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
}
function ListOptionsBar({ setConfirmDialog }: Props) {
  const { edit, checkedMedia } = useSelector((state: RootState) => state.listsManagement);
  const dispatch = useDispatch();

  return (
    <div className="options-btns flex-col-center gap-1 max-md:text-[85%]">
      <div className="flex-row-center gap-4">
        <button
          className="border-0 bg-none hover:bg-transparent"
          onClick={() => {
            dispatch(setEdit(!edit));
            dispatch(setCheckedMedia([]));
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
