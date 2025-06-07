"use client";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";
import { RemoveScroll } from "react-remove-scroll";

function NextModal({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return /^\/(movies|tvshows)\/[^\/]+$/.test(pathname) ? (
    <RemoveScroll>
      <div className={`fixed inset-0 z-[99] overflow-auto`}>{children}</div>
    </RemoveScroll>
  ) : null;
}

export default NextModal;
