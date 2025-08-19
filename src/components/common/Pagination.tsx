import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PaginationMUI from "@mui/material/Pagination";

const MAX_NUMBER_OF_PAGES = 20;

function Pagination({ queryName, pageActive, numberOfPages }: { queryName: string; pageActive: number; numberOfPages: number }) {
  const [lengthOfPag, setLengthOfPag] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  useEffect(() => {
    if (!pageActive || !Number(pageActive)) {
      params.set(queryName, "1");
      router.replace(`?${params.toString()}`);
    }
  }, [pageActive]);

  useEffect(() => {
    setLengthOfPag(numberOfPages > MAX_NUMBER_OF_PAGES ? MAX_NUMBER_OF_PAGES : numberOfPages);
  }, [numberOfPages]);

  return (
    <PaginationMUI
      page={pageActive}
      count={lengthOfPag}
      color="primary"
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#fff",
          "&.Mui-selected": {
            backgroundColor: "#1976d2",
            color: "#fff",
          },
        },
      }}
      onChange={(_, value: number) => {
        params.set(queryName, `${value.toString()}`);
        router.push(`?${params.toString()}`);
      }}
    />
  );
}

export default Pagination;
