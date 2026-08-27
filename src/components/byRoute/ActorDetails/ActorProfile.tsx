import { imageWithSize } from "@/helpers/api.config";
import { IPersonDetails } from "@/Types/person";

const FALLBACK_AVATAR = "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

function getAge(birthday: string, deathday: string | null) {
  const end = deathday ? new Date(deathday) : new Date();
  const start = new Date(birthday);
  let age = end.getUTCFullYear() - start.getUTCFullYear();
  const hasNotHadBirthdayYet = end.getUTCMonth() < start.getUTCMonth() || (end.getUTCMonth() === start.getUTCMonth() && end.getUTCDate() < start.getUTCDate());
  if (hasNotHadBirthdayYet) age -= 1;
  return age;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-content-third text-xs uppercase tracking-wide">{label}</span>
      <span className="text-content-secondary text-sm">{value}</span>
    </div>
  );
}

const ActorProfile = ({ person }: { person: IPersonDetails }) => {
  const { name, profile_path, known_for_department, birthday, deathday, place_of_birth, also_known_as, homepage, external_ids } = person;
  const imdbId = external_ids?.imdb_id;

  return (
    <div className="flex-col-start lg:flex-col-start gap-5 w-full lg:w-[280px] lg:shrink-0">
      <img
        src={profile_path ? `${imageWithSize("342")}${profile_path}` : FALLBACK_AVATAR}
        alt={name}
        width={280}
        height={420}
        className="w-[180px] lg:w-full rounded-lg object-cover border border-content-muted/40"
      />

      <div className="flex flex-col gap-4 w-full max-lg:text-center">
        {known_for_department && <InfoRow label="Known For" value={known_for_department} />}

        {birthday && <InfoRow label={deathday ? "Birthday" : "Birthday (Age)"} value={deathday ? formatDate(birthday) : `${formatDate(birthday)} (${getAge(birthday, null)} years old)`} />}

        {deathday && birthday && <InfoRow label="Died" value={`${formatDate(deathday)} (${getAge(birthday, deathday)} years old)`} />}

        {place_of_birth && <InfoRow label="Place of Birth" value={place_of_birth} />}

        {also_known_as?.length > 0 && <InfoRow label="Also Known As" value={also_known_as.slice(0, 3).join(", ")} />}

        {(imdbId || homepage) && (
          <div className="flex-row-center max-lg:justify-center gap-4 pt-1">
            {imdbId && (
              <a href={`https://www.imdb.com/name/${imdbId}`} target="_blank" rel="noopener noreferrer" title="IMDb" className="text-content-secondary hover:text-content-primary transition-colors">
                <i className="bi bi-box-arrow-up-right"></i> IMDb
              </a>
            )}
            {homepage && (
              <a href={homepage} target="_blank" rel="noopener noreferrer" title="Website" className="text-content-secondary hover:text-content-primary transition-colors">
                <i className="bi bi-globe2"></i>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActorProfile;
