"use client";
const Modal = ({ modalActive, setModalActive,children }) => {

  return modalActive ? (
    <>
      <div className={`flex fixed z-50 h-screen w-full top-0 left-0 max-sm:p-6 flex-col justify-center items-center `}>
        <div
          className="overlay bg-black opacity-85 absolute left-0 top-0 w-full h-full"
          onClick={() => {
            setModalActive(false);
          }}
        ></div>

        <div className="user-options bg-black relative flex flex-col gap-3 items-center justify-center text-white z-30 border border-gray-600 px-6 py-8 w-full  sm:w-3/4 lg:w-3/6 xl:w-1/4">
          <button
            onClick={() => {
              setModalActive(false);
            }}
            type="button"
            className="border-none  rounded-lg  hover:text-[var(--primary)] hover:bg-gray-700/20 absolute top-2 right-2 p-0"
          >
            <i className="bi bi-x text-xl"></i>
          </button>
          {children}
        </div>
      </div>
    </>
  ) : null;
};

export default Modal;
