"use client";
import { useState } from "react";
import { image } from "@/helpers/api.config";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Modal from "@/components/common/Modal";

export const Gallery = ({ backdrops }: { backdrops?: string[] }) => {
  const [preview, setPreview] = useState<string | null>(null);

  if (!backdrops || backdrops.length === 0) {
    return <p className="text-gray-500 text-center">No images available</p>;
  }

  return (
    <>
      <Carousel
        className="w-full flex items-center justify-center py-2 mx-auto"
        opts={{
          loop: true,
          align: "start",
        }}
        plugins={[WheelGesturesPlugin()]}
      >
        <CarouselContent className="w-full ">
          {backdrops.map((filePath) => (
            <CarouselItem key={filePath} className="basis-[85%] sm:basis-[55%] lg:basis-[40%] ">
              <img src={`${image}${filePath}`} className="w-full h-full cursor-pointer rounded-lg" onClick={() => setPreview(filePath)} alt="" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
        <CarouselNext className="right-4 z-50 max-lg:hidden" />
      </Carousel>

      <Modal modalActive={preview !== null} setModalActive={() => setPreview(null)} customClasses="!p-0 !bg-transparent !border-none !w-auto !max-w-[95vw] shadow-none">
        {preview && <img src={`${image}${preview}`} alt="" className="max-h-[85vh] max-w-full rounded-lg object-contain" />}
      </Modal>
    </>
  );
};

export default Gallery;
