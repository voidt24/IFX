import Link from "next/link";
import { ReactNode } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

function HomeCarouselSection({ title, link, children }: { title: string; link?: string; children: ReactNode[] }) {
  if (!children || children.length === 0) return null;

  return (
    <div className="w-full">
      <span className="flex justify-between items-center w-full px-3 sm:px-6 pb-2">
        <h1 className="text-lg lg:text-2xl font-medium text-white">{title}</h1>
        {link && (
          <Link className="hover:underline text-[85%] lg:text-[90%] text-content-secondary" href={link}>
            See all &gt;
          </Link>
        )}
      </span>

      <Carousel className="w-full" opts={{ loop: true, align: "start" }} plugins={[WheelGesturesPlugin()]}>
        <CarouselContent>
          {children.map((child, index) => (
            <CarouselItem key={index} className="basis-[47%] md:basis-[23%] lg:basis-1/5 2xl:basis-[13%] 4k:basis-[10%]">
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 z-50 max-lg:hidden" />
        <CarouselNext className="right-4 z-50 max-lg:hidden" />
      </Carousel>
    </div>
  );
}

export default HomeCarouselSection;
