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
    <div className="relative">
      <div className="px-4 py-3 rounded-lg border border-zinc-800 bg-surface-modal text-content-primary flex items-center justify-between pointer-events-none">
        <span>{selected || selectDefaultName}</span>

        <svg className="ml-3 w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>

      <select
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer bg-surface-modal"
        id="select"
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
