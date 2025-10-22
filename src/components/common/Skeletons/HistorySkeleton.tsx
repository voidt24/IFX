function HistorySkeleton() {
  return (
    <>
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={`skeleton-group-${i}`} className="animate-pulse flex flex-col items-center justify-center gap-12 p-6 rounded-lg bg-surface-modal w-full">
          {/* HEADER */}
          <header className="flex-row-between w-full bg-slate-500/20 m-auto rounded-lg px-4 py-2">
            <div className="h-5 w-1/4 bg-gray-700 rounded"></div>
            <div className="h-5 w-16 bg-gray-700 rounded"></div>
          </header>

          {/* HISTORY CARDS */}
          <div className="transition-all duration-200 flex items-center justify-center gap-6 h-auto flex-col rounded-lg w-full sm:w-[85%] lg:w-[80%] m-auto overflow-auto">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={`skeleton-card-${i}-${j}`} className="relative flex-col-center lg:flex-row w-[95%] lg:w-[95%] gap-4 rounded-lg border border-white/10 p-4 bg-surface-modal">
                {/* IMAGE AREA */}
                <div className="relative rounded-md w-full md:w-[80%] lg:w-[140%] xl:w-[55%] 2xl:w-[45%]">
                  <div className="block w-full h-40 rounded-md bg-gray-700"></div>
                  <span className="absolute left-2 bottom-2 h-4 w-16 rounded-full bg-gray-700"></span>
                </div>

                {/* TEXT AREA */}
                <div className="w-full p-4 text-center sm:w-[75%] lg:w-[95%] xl:w-[80%] 2xl:w-[50%] 4k:w-[40%] m-auto flex-col-center gap-2">
                  <div className="h-6 w-2/3 bg-gray-700 rounded"></div>
                  <div className="h-4 w-1/3 bg-gray-700 rounded"></div>
                </div>

                {/* OPTIONS MENU PLACEHOLDER */}
                <div className="absolute right-2 bottom-2 h-2 w-5 bg-gray-700 rounded-full"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default HistorySkeleton;
