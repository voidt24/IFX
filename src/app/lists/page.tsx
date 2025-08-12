"use client";
import { ListsResults } from "@/components/ListsResults";
import useVerifyToken from "@/Hooks/useVerifyToken";
import Wrapper from "@/components/common/Wrapper/Wrapper";
import SavedListOptions from "../../features/contentFilter/savedListsSelection";
import { Suspense } from "react";
import useHideDrawers from "@/Hooks/useHideDrawers";

export default function Lists() {
  useVerifyToken();
  useHideDrawers();

  return (
    <Wrapper>
      <div className="flex-col-center gap-4">
        <Suspense fallback={<div>Loading list options...</div>}>
          <SavedListOptions />
        </Suspense>
        <Suspense fallback={<div>Loading content...</div>}>
          <ListsResults />
        </Suspense>
      </div>
    </Wrapper>
  );
}
