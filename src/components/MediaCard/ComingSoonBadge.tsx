import formatReleaseDate from "@/helpers/formatReleaseDate";

function ComingSoonBadge({ release_date, first_air_date }: { release_date: string | undefined; first_air_date: string | undefined }) {
  return (
    <div className="cooming-soon block uppercase absolute bottom-10 text-center w-full left-0 right-0 z-[2] backdrop-blur-xl bg-brand-primary/20 [text-shadow:1px_1px_3px_black] py-1 text-content-primary font-bold text-[70%] lg:text-[80%]">
      coming soon
      <div className="block text-[85%]">{formatReleaseDate(release_date || first_air_date || "")}</div>
    </div>
  );
}

export default ComingSoonBadge;
