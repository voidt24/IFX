import { RootState } from "@/store";
import { ReactNode } from "react";
import { useSelector } from "react-redux";

function Wrapper({ children, customClasses }: { children: ReactNode; customClasses?: string }) {
  const { containerMargin } = useSelector((state: RootState) => state.ui);

  return (
    <div className={`wrapper ${customClasses || ""}`} style={{ marginTop: containerMargin ? `${containerMargin}px` : undefined }}>
      {children}
    </div>
  );
}

export default Wrapper;
