import { IhistoryMedia } from "@/Types";
import HistoryCard from "./HistoryCard/HistoryCard";
import { useState } from "react";

function HistoryGroup({ result, index }: { result: [string, IhistoryMedia[]]; index: number }) {
  const [expandedItems, setExpandedItems] = useState<{ [key: number]: boolean }>({});

  const toggleItem = (id: number) => {
    setExpandedItems((element) => ({
      ...element,
      [id]: !element[id],
    }));
  };
  return (
    <div className="flex flex-col items-center justify-center gap-12 p-6 rounded-lg bg-surface-modal w-full" key={`date-${result[0]}`}>
      <header className="flex-row-between w-full bg-slate-500/20 m-auto rounded-lg px-4 py-2">
        <p className="date lg:text-lg   text-content-secondary font-semibold ">
          {(() => {
            const dateString = result[0];
            const parts = dateString.split("-");
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const day = parseInt(parts[2], 10);
            return new Date(year, month, day).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          })()}{" "}
          <span className="count text-[80%] font-normal">
            ({result[1].length} {result[1].length == 1 ? "item" : "items"})
          </span>
        </p>

        <button onClick={() => toggleItem(index)} className="flex-row-center gap-1 text-[90%] hover:text-content-primary">
          <p className="text-[90%] text-white">{expandedItems[index] ? "Expand" : "Minimize"}</p>

          <i className={`bi bi-caret-${expandedItems[index] ? "down" : "up"}  leading-none`}></i>
        </button>
      </header>

      <div
        className={`${
          expandedItems[index] ? " max-h-0 opacity-0 p-0" : " opacity-1 p-2"
        } transition-all duration-200 flex items-center  justify-center gap-6 h-auto flex-col rounded-lg sm:w-[85%] lg:w-[80%] m-auto overflow-auto`}
      >
        {[...result[1]].reverse().map((data, childIndex) => (
          <HistoryCard key={index} result={result} data={data} index={index} childIndex={childIndex} />
        ))}
      </div>
    </div>
  );
}

export default HistoryGroup;
