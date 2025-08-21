export default function LoadingScreen() {
  return (
    <div className={`flex fixed z-[99999] bg-black  h-screen w-full top-0 left-0 max-sm:p-6 flex-col justify-center items-center `}>
      <img src="/logo.png" alt="" className="animate-bounce z-30 w-[175px]" />
    </div>
  );
}
