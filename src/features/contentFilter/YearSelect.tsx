import SelectDropdown from "@/components/common/SelectDropdown";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

// Genera un array de strings con los años desde el actual hasta 1900 de forma descendente
const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years: string[] = [];

  for (let i = currentYear; i >= startYear; i--) {
    years.push(String(i));
  }
  return years;
};

interface Props {
  selected: string | null;
  // Opcional: lista de años personalizada (ej. años futuros para Upcoming).
  // Debe ser una referencia estable (constante fuera del componente).
  years?: string[];
}

function YearSelect({ selected, years }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const year = searchParams.get("year");

  const selectFilterYears = useMemo(() => years ?? generateYears(), [years]);

  useEffect(() => {
    if (!year) return;

    // Si el año en la URL no existe en la lista, se resetea a "All"
    if (year !== "All" && !selectFilterYears.includes(year)) {
      params.set("year", "All");
      router.replace(`?${params.toString()}`);
    }
  }, [year, selectFilterYears]);

  return <SelectDropdown type="year" selected={selected} selectDefaultName="Year" selectOptions={selectFilterYears} />;
}

export default YearSelect;
