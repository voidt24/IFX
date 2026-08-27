import { useEffect, useRef, useState } from "react";
import { LayoutGrid, Check } from "lucide-react";
import { cn } from "@/lib/Shadcn/utils";
import useIsMobile from "@/Hooks/useIsMobile";

const ALL_PROVIDERS_VALUE = "All";

interface ProviderLogos {
  shortLogo: string | null;
  fullLogo: string | null;
}

interface Props {
  title: string;
  providers: string[];
  logos: Record<string, ProviderLogos | null>;
  selected: string;
  onSelect: (provider: string) => void;
}

function ProviderCarouselSelect({ title, providers, logos, selected, onSelect }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedProviderData = selected !== ALL_PROVIDERS_VALUE ? logos[selected] : null;
  const currentLogo = isMobile ? selectedProviderData?.shortLogo || selectedProviderData?.fullLogo : selectedProviderData?.fullLogo || selectedProviderData?.shortLogo;

  function handleSelect(provider: string) {
    onSelect(provider);
    setIsOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button type="button" aria-haspopup="listbox" aria-expanded={isOpen} onClick={() => setIsOpen((prev) => !prev)} className="flex items-center gap-2 min-w-0 group focus:outline-none">
        <h1 className="text-lg lg:text-2xl font-medium text-white whitespace-nowrap">{title} on</h1>

        <div
          className={cn(
            "flex justify-center items-center gap-0.5 md:gap-2 px-1.5 md:px-2 transition-all rounded-lg",
            isMobile ? "bg-transparent border border-white/20 py-1" : "border-2 border-transparent  bg-white/95 group-hover:border-white group-hover:bg-white/85",
          )}
        >
          {selected === ALL_PROVIDERS_VALUE ? (
            <span className={cn("py-1 rounded-md text-xs lg:text-sm font-medium whitespace-nowrap", isMobile ? "text-white" : "text-black")}>All Platforms</span>
          ) : (
            <span
              className={cn(
                "flex items-center justify-center shrink-0 transition-colors ",
                isMobile ? "h-6 w-auto max-w-none overflow-visible" : "h-7 py-1 lg:h-8 max-w-[100px] sm:max-w-[120px] lg:max-w-[150px] rounded-md",
              )}
            >
              {currentLogo ? (
                <>
                  <img src={currentLogo} alt={selected} className={cn("object-contain", isMobile ? "h-6 w-6 rounded-md" : "h-full max-w-full")} />
                  {!isMobile && selected === "Disney+" && <span className="text-black font-semibold text-[104%]">+</span>}
                </>
              ) : (
                <span className={cn("text-xs lg:text-sm font-medium truncate", isMobile ? "text-white" : "text-zinc-900")}>{selected}</span>
              )}
            </span>
          )}

          <i className={cn("transition-all bi bi-caret-down-fill", isMobile ? "text-white text-xs ml-0.5" : "text-zinc-700 max-md:text-[90%]", isOpen && "rotate-180 -translate-y-[1.5px]")}></i>
        </div>
      </button>

      {isOpen && (
        <div role="listbox" className="absolute z-50 top-full -right-10 mt-2 w-60 max-h-80 overflow-y-auto rounded-lg border border-zinc-800 bg-surface-modal backdrop-blur-md shadow-xl py-1">
          <button
            type="button"
            role="option"
            aria-selected={selected === ALL_PROVIDERS_VALUE}
            onClick={() => handleSelect(ALL_PROVIDERS_VALUE)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors",
              selected === ALL_PROVIDERS_VALUE ? "text-white bg-white/15" : "text-content-secondary hover:bg-white/10 bg-transparent",
            )}
          >
            <span className="flex items-center justify-center h-6 w-6 rounded bg-zinc-800 shrink-0">
              <LayoutGrid size={14} />
            </span>
            <span className="truncate">All Platforms</span>
            {selected === ALL_PROVIDERS_VALUE && <Check size={16} className="ml-auto shrink-0" />}
          </button>

          {providers.map((provider) => {
            const shortLogo = logos[provider]?.shortLogo;

            return (
              <button
                key={provider}
                type="button"
                role="option"
                aria-selected={selected === provider}
                onClick={() => handleSelect(provider)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors rounded-md",
                  selected === provider ? "text-white bg-white/15" : "text-content-secondary hover:bg-white/10 bg-transparent",
                )}
              >
                <span className="flex items-center justify-center h-6 w-6 rounded bg-zinc-800 shrink-0 overflow-hidden">
                  {shortLogo ? <img src={shortLogo} alt={provider} className="h-full w-full object-cover" /> : <LayoutGrid size={12} />}
                </span>
                <span className="truncate">{provider}</span>
                {selected === provider && <Check size={16} className="ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProviderCarouselSelect;
