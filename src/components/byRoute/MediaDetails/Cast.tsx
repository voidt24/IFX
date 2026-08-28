import { useContext } from "react";
import { Context } from "@/context/Context";
import { imageWithSize } from "@/helpers/api.config";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import { ICast } from "@/Types/cast";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Link from "next/link";

export const Cast = ({ cast }: { cast: ICast[] }) => {
  const { castError } = useContext(Context);
  if (castError) {
    return <p className="p-2 text-gray-500 text-center">Error loading cast </p>;
  }

  return (
    cast && (
      <>
        {cast.length > 0 ? (
          cast.length <= 5 ? (
            <div className="w-full flex flex-wrap items-center justify-center gap-6 py-4 sm:w-[80%] mx-auto">
              {cast.map((member: ICast) => (
                <Link href={`/actor/${member.id}`} className="cast__member flex-col-center group text-[74%] text-center w-24" key={member.id}>
                  <img
                    src={
                      member.profile_path
                        ? `${imageWithSize("185")}${member.profile_path}`
                        : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                    }
                    className="size-[4.5rem] lg:size-[6rem] rounded-full object-cover group-hover:scale-105 transition-all"
                    alt="cast-member"
                  />
                  <p className="cast__member__name font-semibold group-hover:text-brand-primary transition-colors">{member.name}</p>
                  <p className="cast__member__character text-content-secondary">{member.character}</p>
                </Link>
              ))}
            </div>
          ) : (
            <Carousel
              className="w-full flex items-center justify-center py-2 sm:w-[80%] mx-auto"
              opts={{
                loop: cast.length > 4, // Solo activa el loop si hay más de 4 elementos
                align: cast.length <= 4 ? "center" : "start", // Los centra si son pocos
              }}
              plugins={[WheelGesturesPlugin()]}
            >
              <CarouselContent className="w-full">
                {cast &&
                  cast.map((cast: ICast) => {
                    return (
                      <CarouselItem key={cast.id} className="basis-[27%] sm:basis-[21%] lg:basis-[14%]">
                        <Link href={`/actor/${cast.id}`} className="cast__member flex-col-center group text-[74%] text-center" key={cast.id + 543425}>
                          <img
                            src={
                              cast.profile_path
                                ? `${imageWithSize("185")}${cast.profile_path}`
                                : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                            }
                            className="size-[4.5rem] lg:size-[6rem] rounded-full object-cover group-hover:scale-105 transition-all"
                            alt="cast-member"
                          />
                          <p className="cast__member__name font-semibold group-hover:text-brand-primary transition-colors">{cast.name}</p>
                          <p className="cast__member__character text-content-secondary">{cast.character}</p>
                        </Link>
                      </CarouselItem>
                    );
                  })}
              </CarouselContent>
              <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
              <CarouselNext className="right-4 z-50 max-lg:hidden" />
            </Carousel>
          )
        ) : (
          <p className="text-gray-500 text-center">No cast available</p>
        )}
      </>
    )
  );
};

export default Cast;
