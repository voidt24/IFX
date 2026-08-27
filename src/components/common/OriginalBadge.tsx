import useProviderLogos from "@/Hooks/useProviderLogos";
import { cn } from "@/lib/Shadcn/utils";

interface OriginalBadgeProps {
  /** Provider name resolved via getOriginalProvider (e.g. "Netflix"). Falsy => renders nothing. */
  provider: string | null | undefined;
  /** Optional: pass the shortLogo directly if the parent already has it (skips the internal fetch). */
  logo?: string | null;
  /** Override position/z-index/sizing — merged with the default top-left pill via tailwind-merge. */
  parentClassName?: string;
  imgClassName?: string;
  originalTextClassName?: string;
}

/**
 * "Original Content" pill: [platform logo] + "Original", top-left over a poster/backdrop.
 * Self-positioning (absolute top-2 left-2) like the other MediaCard badges — drop it
 * inside any `relative` container. Renders nothing if there's no provider.
 */
function OriginalBadge({ provider, logo, parentClassName, imgClassName, originalTextClassName }: OriginalBadgeProps) {
  // Only hit /api/tmdb/providers when we actually need to resolve a logo ourselves —
  // most cards aren't Originals, and callers that already have `logo` skip this entirely.
  const shouldResolveLogo = Boolean(provider) && logo === undefined;
  const { logos } = useProviderLogos(shouldResolveLogo);

  if (!provider) return null;

  const resolvedLogo = logo !== undefined ? logo : (logos[provider]?.shortLogo ?? null);

  return (
    <span
      className={cn(
        "original-badge absolute top-2 left-2 z-[2] flex items-center gap-1 rounded-md bg-black/60 backdrop-blur-md px-1 md:px-2 py-1 text-xs font-semibold text-white shadow-sm",
        parentClassName,
      )}
    >
      {resolvedLogo && <img src={resolvedLogo} alt={provider} className={cn("h-4 w-4 md:h-5 md:w-5 shrink-0 rounded-[2px] object-contain", imgClassName)} />}
      <span className={cn("leading-none", originalTextClassName)}>Original</span>
    </span>
  );
}

export default OriginalBadge;
