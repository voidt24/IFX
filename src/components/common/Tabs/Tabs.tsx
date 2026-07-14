import React, { ReactNode, useState } from "react";

function Tabs({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState(0);
  const childrenArray = React.Children.toArray(children);
  const titles = childrenArray.map((child) => (React.isValidElement(child) ? child.props.title : "Tab"));
  return (
    <div className="flex-col-start gap-4 w-full h-full ">
      <div className="flex-row-center gap-4 ">
        {titles.map((tab, index) => {
          return (
            <div className="flex-col-center gap-1" key={index}>
              <button
                type="button"
                className={` text-lg sm:text-xl transition-all duration-300 ${activeTab == index ? "text-content-primary " : "text-content-muted"}`}
                onClick={() => {
                  setActiveTab(index);
                }}
              >
                {tab}
              </button>
              <div className={`transition-all duration-400 left-0  ${activeTab == index ? " w-full " : " w-0 "}  h-[2px] bg-brand-primary`}></div>
            </div>
          );
        })}
      </div>

      <div key={activeTab} className="tab-content w-full min-h-[320px] sm:min-h-[380px] lg:min-h-[440px] animate-tab-fade-in">
        {childrenArray[activeTab]}
      </div>
    </div>
  );
}

export default Tabs;
