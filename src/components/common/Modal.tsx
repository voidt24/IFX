"use client";
import { Context } from "@/context/Context";
import { useContext } from "react";
import { useDispatch } from "react-redux";
import { RemoveScroll } from "react-remove-scroll";

interface ModalProps {
  modalActive: boolean;
  setModalActive: (value: boolean) => void;
  children: React.ReactNode;
  customClasses?: string;
  closeBtnToLeft?: boolean;
}
const Modal = ({ modalActive, setModalActive, children, customClasses, closeBtnToLeft = false }: ModalProps) => {
  const { sheetsRef } = useContext(Context);
  const dispatch = useDispatch();
  return modalActive ? (
    <>
      <RemoveScroll shards={[sheetsRef]}>
        <div className={`flex fixed z-[9999] h-screen w-full top-0 left-0 max-sm:p-1.5 flex-col justify-center items-center`}>
          <div
            className="overlay"
            onClick={() => {
              setModalActive(false);
            }}
          ></div>

          <div
            className={`user-options bg-surface-modal backdrop-blur-md  relative flex flex-col gap-3 items-center justify-center text-white z-30 border border-white/10 px-6 py-8 w-full sm:w-3/4 lg:w-[50%] xl:w-[35%] 2xl:w-[45%] rounded-lg ${customClasses}`}
          >
            <button
              onClick={() => {
                setModalActive(false);
              }}
              className={` rounded-full bg-[#0f1118] leading-1 hover:bg-surface-hover z-20 absolute top-2 ${closeBtnToLeft ? "left-2 " : "right-2"} px-2 py-1`}
              type="button"
              title="close-btn"
            >
              <i className="bi bi-x text-xl"></i>
            </button>
            {children}
          </div>
        </div>
      </RemoveScroll>
    </>
  ) : null;
};

export default Modal;
