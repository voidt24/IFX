import { RootState } from "@/store";
import { setCheckedMedia, setEdit } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";

function DeletionToolbar({ setConfirmDialog }: { setConfirmDialog: () => void }) {
  const { edit, checkedMedia } = useSelector((state: RootState) => state.listsManagement);
  const dispatch = useDispatch();

  return (
    <div className="sticky max-sm:bottom-[75px] bottom-3 w-full sm:w-[65%] md:w-1/2 xl:w-[25%] max-lg:text-[90%] bg-white border border-gray-500 text-black rounded-full text-center py-3 flex justify-center items-center  mx-auto z-[999]">
      <p className="border-r border-r-gray-300 px-4 xs:px-6">
        <span className="font-medium ">{checkedMedia.length} </span>

        <span className="font-normal">selected</span>
      </p>
      <button
        className="border-r border-r-gray-300 px-4 xs:px-6 text-center hover:font-medium"
        onClick={() => {
          dispatch(setEdit(!edit));
          dispatch(setCheckedMedia([]));
        }}
      >
        Cancel
      </button>

      {edit && checkedMedia.length > 0 && (
        <button className="text-red-700 px-4 xs:px-6 text-center hover:font-medium" onClick={setConfirmDialog}>
          Delete <i className="bi bi-trash3"></i>
        </button>
      )}
    </div>
  );
}

export default DeletionToolbar;
