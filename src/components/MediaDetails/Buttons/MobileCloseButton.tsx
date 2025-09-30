import { useRouter } from "next/navigation";

function MobileCloseButton() {
  const router = useRouter();
  return (
    <button className="lg:hidden text-content-primary text-2xl font-semibold fixed top-6 right-3 bg-black/50 backdrop-blur-lg rounded-full px-1.5 py-0.5 z-[9999]" title="close-btn">
      <i
        className="bi bi-x"
        onClick={() => {
          if (sessionStorage.getItem("navigatingFromApp") === "1") {
            router.back();
          } else {
            router.push("/");
          }
        }}
      ></i>
    </button>
  );
}

export default MobileCloseButton;
