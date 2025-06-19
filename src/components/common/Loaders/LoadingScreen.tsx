export default function LoadingScreen() {
  return (
    <div className={`flex fixed z-[99999] h-screen w-full top-0 left-0 max-sm:p-6 flex-col justify-center items-center `}>
      <div className="overlay bg-black opacity-95 absolute left-0 top-0 w-full h-full"></div>
      <img src="/logo.png" alt="" className="animate-bounce z-30 w-[175px]" />
    </div>
  );
}
