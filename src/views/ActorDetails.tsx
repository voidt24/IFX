"use client";
import { IPersonDetails } from "@/Types/person";
import ActorProfile from "@/components/byRoute/ActorDetails/ActorProfile";
import ActorBiography from "@/components/byRoute/ActorDetails/ActorBiography";
import ActorGallery from "@/components/byRoute/ActorDetails/ActorGallery";
import ActorFilmography from "@/components/byRoute/ActorDetails/ActorFilmography";
import useHideDrawers from "@/Hooks/useHideDrawers";
import Wrapper from "@/components/common/Wrapper/Wrapper";

export const ActorDetails = ({ person }: { person: IPersonDetails }) => {
  useHideDrawers(true);

  const cast = person.combined_credits?.cast || [];
  const crew = person.combined_credits?.crew || [];
  // The main profile_path is already shown in ActorProfile — skip it in the gallery.
  const gallery = (person.images?.profiles || []).filter((img) => img.file_path !== person.profile_path);

  return (
    <Wrapper customClasses="flex flex-col lg:flex-row gap-8 lg:gap-12 !pt-20">
      <ActorProfile person={person} />

      <div className="flex flex-col gap-8 w-full min-w-0">
        <div className="flex flex-col gap-3">
          <h1 className="text-2xl lg:text-3xl font-semibold text-content-primary">{person.name}</h1>
          <ActorBiography biography={person.biography} />
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-content-primary">Filmography</h2>
          <ActorFilmography cast={cast} />
        </div>
        {gallery.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-content-primary">Photos</h2>
            <ActorGallery images={gallery} name={person.name} />
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default ActorDetails;
