import { Dispatch, SetStateAction } from "react";
import Modal from "./Modal";
import deleteFromFireStore from "@/firebase/deleteFromFirebase";
import { Sheet } from "react-modal-sheet";
import useIsMobile from "@/Hooks/useIsMobile";
import { RootState } from "@/store";
import { setListChanged } from "@/store/slices/listsManagementSlice";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
  listName: string | string[];
  extraActions?: () => void | null;
  elementsToDelete: (number | string)[];
  displayMessage?: string;
  setMessage: (message: { message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }) => void;
  isHistory: boolean;
}
function ConfirmDeleteModal({ confirmDialog, setConfirmDialog, listName, extraActions, elementsToDelete, displayMessage, setMessage, isHistory = false }: Props) {
  const { firebaseActiveUser } = useSelector((state: RootState) => state.auth);
  const { listChanged } = useSelector((state: RootState) => state.listsManagement);

  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  async function onSubmit() {
    try {
      await deleteFromFireStore(firebaseActiveUser, listName, elementsToDelete, isHistory);
      extraActions && extraActions();
      setMessage({ message: "List updated!", severity: "success", open: true });
      dispatch(setListChanged(!listChanged));
    } catch (err) {
      setMessage({ message: "Error deleting data, try again later", severity: "error", open: true });
    } finally {
      setConfirmDialog(false);
    }
  }
  return isMobile ? (
    <Sheet
      isOpen={confirmDialog}
      onClose={() => setConfirmDialog(false)}
      snapPoints={[1, 0.5, 0]}
      initialSnap={0}
      onSnap={(snapIndex) => {
        if (snapIndex === 1) setConfirmDialog(false);
      }}
    >
      <Sheet.Container style={{ backgroundColor: "#0f1118cb", height: "auto", backdropFilter: "blur(13px)" }}>
        <Sheet.Header style={{ padding: "1px 0" }} />
        <Sheet.Content className="px-4 pb-8 ">
          <p className="text-center pb-2 border-b border-b-gray-900">{`Do you really you want to delete this data from ${Array.isArray(listName) ? displayMessage : listName} ?`}</p>

          <div className="flex-col-center gap-6 mt-6 text-lg font-medium">
            <button
              className="py-2.5 active:bg-black/10 !text-red-700 w-full"
              onClick={() => {
                onSubmit();
              }}
            >
              Delete
            </button>
            <button className="py-2.5 active:bg-black/10 text-blue-600 w-full " onClick={() => setConfirmDialog(false)}>
              Cancel
            </button>
          </div>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop onTap={() => setConfirmDialog(false)} style={{ background: "rgba(0, 0, 0, 0.7)" }} />
    </Sheet>
  ) : (
    <Modal
      modalActive={confirmDialog}
      setModalActive={(value) => {
        setConfirmDialog(value);
      }}
    >
      <div className="flex flex-col gap-4 max-md:text-sm py-4">
        <p className="">{`Do you really you want to delete this data from ${Array.isArray(listName) ? displayMessage : listName} ?`}</p>

        <div className="delete-options flex gap-4">
          <button
            type="submit"
            className="w-full border border-gray-600 rounded-full "
            onClick={() => {
              setConfirmDialog(false);
            }}
            autoFocus
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full btn-primary !bg-brand-primary !text-white"
            onClick={() => {
              onSubmit();
            }}
            autoFocus
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
