import { Context } from "@/context/Context";
import React, { ReactNode, useContext } from "react";

function Wrapper({ children, customClasses }: { children: ReactNode; customClasses?: string }) {
  const { containerMargin } = useContext(Context);

  return (
    <div className={`wrapper ${customClasses || ""}`} style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      {children}
    </div>
  );
}

export default Wrapper;
