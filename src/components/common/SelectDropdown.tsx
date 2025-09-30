import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  type: string;
  selected: string | null;
  selectDefaultName: string;
  selectOptions: string[];
}

export default function SelectDropdown({ type, selected, selectDefaultName, selectOptions }: Props) {
  const router = useRouter();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  return (
    <div className="relative inline-block text-left">
      <select
        title="select"
        value={selected || selectDefaultName}
        onChange={(e) => {
          switch (type) {
            case "platform":
              params.set("platform", e.target.value);
              break;
            case "genre":
              params.set("genre", e.target.value);
              break;
            case "listMediaType":
              params.set("media", e.target.value);
              break;
          }
          router.replace(`?${params.toString()}`);
        }}
        className="px-4 rounded-lg py-1.5 border border-zinc-500 bg-surface-modal text-content-primary outline-none w-full"
      >
        <option value={selectDefaultName} disabled>
          {selectDefaultName}
        </option>
        {selected != selectDefaultName && <option value={"All"}>All</option>}
        {selectOptions.map((option) => (
          <>
            <option key={option} value={option}>
              {option}
            </option>
          </>
        ))}
      </select>
    </div>
  );
}
