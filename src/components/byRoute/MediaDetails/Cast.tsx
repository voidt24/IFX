import { useContext } from "react";
import { Context } from "@/context/Context";
import { imageWithSize } from "@/helpers/api.config";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import { ICast } from "@/Types/cast";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

export const Cast = ({ cast }: { cast: ICast[] }) => {
  const { castError } = useContext(Context);
  if (castError) {
    return <p className="p-2 text-gray-500 text-center">Error loading cast </p>;
  }

  return (
    cast && (
      <>
        {cast.length > 0 ? (
          <Carousel
            className="w-full flex items-center justify-center py-2 sm:w-[55%]  mx-auto"
            opts={{
              loop: true,
              align: "start",
            }}
            plugins={[WheelGesturesPlugin()]}
          >
            <CarouselContent className="w-full">
              {cast &&
                cast.map((cast: ICast) => {
                  return (
                    <CarouselItem key={cast.id} className="basis-[30%] lg:basis-[25%] lg:px-4">
                      <div className="cast__member flex-col-center text-[65%] text-center" key={cast.id + 543425}>
                        <img
                          src={
                            cast.profile_path
                              ? `${imageWithSize("185")}${cast.profile_path}`
                              : "https://static.vecteezy.com/system/resources/previews/008/442/086/non_2x/illustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg"
                          }
                          className="size-[65px] rounded-full object-cover"
                          alt="cast-member"
                        />
                        <p className="cast__member__name font-semibold">{cast.name}</p>
                        <p className="cast__member__character text-content-secondary">{cast.character}</p>
                      </div>
                    </CarouselItem>
                  );
                })}
            </CarouselContent>
            <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
            <CarouselNext className="right-4 z-50 max-lg:hidden" />
          </Carousel>
        ) : (
          <p className="text-gray-500 text-center">No cast available</p>
        )}
      </>
    )
  );
};

export default Cast;
