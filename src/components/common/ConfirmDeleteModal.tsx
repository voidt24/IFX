import { Dispatch, SetStateAction, useContext } from "react";
import Modal from "./Modal";
import deleteFromFireStore from "@/firebase/deleteFromFirebase";
import { Context } from "@/context/Context";

interface Props {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
  listName: string;
  firebaseActiveUser: { email: string | null; uid: string | null };
  setEdit: Dispatch<SetStateAction<boolean>>;
  checkedMedia: (number | string)[];
  setCheckedMedia: Dispatch<SetStateAction<(number | string)[]>>;
  setMessage: Dispatch<SetStateAction<{ message: string; severity: string; open: boolean }>>;
}
function ConfirmDeleteModal({ confirmDialog, setConfirmDialog, listName, firebaseActiveUser, setEdit, checkedMedia, setCheckedMedia, setMessage }: Props) {
  const { listChanged, setListChanged } = useContext(Context);

  return (
    <Modal modalActive={confirmDialog} setModalActive={setConfirmDialog}>
      <div className="flex flex-col gap-4 max-md:text-sm py-4">
        <p className="">Do you really you want to delete this data from {listName}?</p>

        <div className="delete-options flex gap-4">
          <button
            type="submit"
            className="w-full rounded-full bg-zinc-800 hover:bg-zinc-700 px-4 py-1"
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
                await deleteFromFireStore(firebaseActiveUser, listName, checkedMedia);
                setEdit(false);
                setCheckedMedia([]);
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
