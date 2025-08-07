import SelectDropdown from "@/components/common/SelectDropdown";
import { selectFilterProviders } from "@/helpers/constants";
import { useRouter, useSearchParams } from "next/navigation";
import {  useEffect } from "react";

function PlatformSelect({ selected }: { selected: string | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);

  const platform = searchParams.get("platform");

  useEffect(() => {
    if (!platform) return;
    if (!selectFilterProviders.includes(platform)) {
      params.set("platform", "All");
      router.replace(`?${params.toString()}`);
    }
  }, [platform]);

  return <SelectDropdown type="platform" selected={selected} selectDefaultName="Platform" selectOptions={selectFilterProviders} />;
}

export default PlatformSelect;
