import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";

function EditButton() {
  const { edit } = useSelector((state: RootState) => state.listsManagement);
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
      </div>
    </div>
  );
}

export default EditButton;
