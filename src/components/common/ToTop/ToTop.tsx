function ToTop() {
  return (
    <button
      className="to-top fixed max-sm:bottom-[10%] bottom-[5%] right-[5%] px-2 py-1 bg-surface-modal hover:bg-zinc-700 rounded-full border z-50 hover:scale-125 transition duration-200 ease-in-out"
      onClick={() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }}
      title="toTop"
    >
      <i className="bi bi-arrow-up "></i>
    </button>
  );
}

export default ToTop;
