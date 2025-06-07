import { Dispatch, SetStateAction, useContext } from "react";
import Modal from "./Modal";
import deleteFromFireStore from "@/firebase/deleteFromFirebase";
import { Context } from "@/context/Context";

interface Props {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
  listName: string | string[];
  extraActions?: () => void | null;
  elementsToDelete: (number | string)[];
  setElementsToDelete?: Dispatch<SetStateAction<(number | string)[]>> | null;
  displayMessage?: string ;
  setMessage: Dispatch<SetStateAction<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>>;
}
function ConfirmDeleteModal({ confirmDialog, setConfirmDialog, listName, extraActions, elementsToDelete, setElementsToDelete,displayMessage, setMessage }: Props) {
  const { firebaseActiveUser, listChanged, setListChanged } = useContext(Context);

  return (
    <Modal modalActive={confirmDialog} setModalActive={setConfirmDialog}>
      <div className="flex flex-col gap-4 max-md:text-sm py-4">
        <p className="">{`Do you really you want to delete this data from ${Array.isArray(listName) ? displayMessage : listName} ?`}</p>

        <div className="delete-options flex gap-4">
          <button
            type="submit"
            className="w-full btn-secondary"
            onClick={() => {
              setConfirmDialog(false);
            }}
            autoFocus
          >
            Cancel
          </button>

          <button
            type="submit"
            className="w-full btn-primary"
            onClick={async () => {
              try {
                await deleteFromFireStore(firebaseActiveUser, listName, elementsToDelete);
                extraActions && extraActions();
                setElementsToDelete && setElementsToDelete([]);
                setMessage({ message: "List updated!", severity: "success", open: true });
                setListChanged(!listChanged);
              } catch (err) {
                setMessage({ message: "Error deleting data, try again later", severity: "error", open: true });
              } finally {
                setConfirmDialog(false);
              }
            }}
            autoFocus
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;
