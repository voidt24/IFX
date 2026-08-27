"use client";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import { imageWithSize } from "@/helpers/api.config";
import { IPersonImage } from "@/Types/person";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

const ActorGallery = ({ images, name }: { images: IPersonImage[]; name: string }) => {
  if (!images || images.length === 0) return null;

  return (
    <Carousel className="w-full" opts={{ loop: true, align: "start" }} plugins={[WheelGesturesPlugin()]}>
      <CarouselContent>
        {images.map((img, index) => (
          <CarouselItem key={img.file_path} className="basis-[42%] sm:basis-[26%] lg:basis-[18%] xl:basis-[15%]">
            <img
              src={`${imageWithSize("342")}${img.file_path}`}
              alt={`${name} - photo ${index + 1}`}
              className="rounded-md object-cover w-full aspect-[2/3] border border-content-muted/30"
              loading="lazy"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2 z-50 max-lg:hidden" />
      <CarouselNext className="right-2 z-50 max-lg:hidden" />
    </Carousel>
  );
};

export default ActorGallery;
