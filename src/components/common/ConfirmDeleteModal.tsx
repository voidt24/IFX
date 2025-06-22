import { Dispatch, SetStateAction, useContext } from "react";
import Modal from "./Modal";
import deleteFromFireStore from "@/firebase/deleteFromFirebase";
import { Context } from "@/context/Context";
import { Sheet } from "react-modal-sheet";
import useIsMobile from "@/Hooks/useIsMobile";

interface Props {
  confirmDialog: boolean;
  setConfirmDialog: Dispatch<SetStateAction<boolean>>;
  listName: string | string[];
  extraActions?: () => void | null;
  elementsToDelete: (number | string)[];
  setElementsToDelete?: Dispatch<SetStateAction<(number | string)[]>> | null;
  displayMessage?: string;
  setMessage: Dispatch<SetStateAction<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>>;
}
function ConfirmDeleteModal({ confirmDialog, setConfirmDialog, listName, extraActions, elementsToDelete, setElementsToDelete, displayMessage, setMessage }: Props) {
  const { firebaseActiveUser, listChanged, setListChanged } = useContext(Context);

  const isMobile = useIsMobile();
  async function onSubmit() {
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
            onClick={() => {
              onSubmit();
            }}
            autoFocus
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );

  // return (
  //   {isMobile ?
  //                      ""
  //     :

  //   <Modal modalActive={confirmDialog} setModalActive={setConfirmDialog}>
  //     <div className="flex flex-col gap-4 max-md:text-sm py-4">
  //       <p className="">{`Do you really you want to delete this data from ${Array.isArray(listName) ? displayMessage : listName} ?`}</p>

  //       <div className="delete-options flex gap-4">
  //         <button
  //           type="submit"
  //           className="w-full btn-secondary"
  //           onClick={() => {
  //             setConfirmDialog(false);
  //           }}
  //           autoFocus
  //         >
  //           Cancel
  //         </button>

  //         <button
  //           type="submit"
  //           className="w-full btn-primary"
  //           onClick={async () => {
  //             try {
  //               await deleteFromFireStore(firebaseActiveUser, listName, elementsToDelete);
  //               extraActions && extraActions();
  //               setElementsToDelete && setElementsToDelete([]);
  //               setMessage({ message: "List updated!", severity: "success", open: true });
  //               setListChanged(!listChanged);
  //             } catch (err) {
  //               setMessage({ message: "Error deleting data, try again later", severity: "error", open: true });
  //             } finally {
  //               setConfirmDialog(false);
  //             }
  //           }}
  //           autoFocus
  //         >
  //           Confirm
  //         </button>
  //       </div>
  //     </div>
  //   </Modal>
  //   }

  // );
}

export default ConfirmDeleteModal;
