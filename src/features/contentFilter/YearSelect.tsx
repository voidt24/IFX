import SelectDropdown from "@/components/common/SelectDropdown";
import { RootState } from "@/store";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

// Genera un array de strings con los años desde el actual hasta 1900 de forma descendente
const generateYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const startYear = 1900;
  const years: string[] = []; // Incluimos la opción por defecto primero

  for (let i = currentYear; i >= startYear; i--) {
    years.push(String(i));
  }
  return years;
};

function YearSelect({ selected }: { selected: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const year = searchParams.get("year");

  // useMemo para evitar recalcular el array en cada renderizado
  const selectFilterYears = useMemo(() => generateYears(), []);

  useEffect(() => {
    if (!year) return;

    // Validación: Si el año en la URL no existe en nuestra lista mapeada, lo resetea a "All"
    if (!selectFilterYears.includes(year)) {
      params.set("year", "All");
      router.replace(`?${params.toString()}`);
    }
  }, [year, selectFilterYears]);

  return <SelectDropdown type="year" selected={selected} selectDefaultName="Year" selectOptions={selectFilterYears} />;
}

export default YearSelect;
