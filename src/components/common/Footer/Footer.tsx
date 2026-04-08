import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/Shadcn/carousel";
import WheelGesturesPlugin from "embla-carousel-wheel-gestures";
import Autoplay from "embla-carousel-autoplay";
function Footer() {
  const streamingLogos = [
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
      alt: "Netflix",
      className: "h-6 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/8/8f/Disney_logo.png",
      alt: "Disney+",
      className: "h-8 md:h-9 opacity-30 hover:opacity-100 contrast-0 hover:contrast opacity-70",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg",
      alt: "Max",
      className: "h-6 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
      alt: "Prime Video",
      className: "h-7 md:h-9 w-auto grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Hulu_logo_%282018%29.svg",
      alt: "Hulu",
      className: "h-7 md:h-7.5 grayscale opacity-20 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/9/99/AppleTV.png?_=20150702204952",
      alt: "Apple TV+",
      className: "h-8 md:h-8 w-auto opacity-40 hover:opacity-100 contrast-0 hover:contrast transition-all duration-300",
    },
    {
      src: "https://cdn.simpleicons.org/paramountplus",
      alt: "Paramount+",
      className: "h-8 md:h-10 w-auto grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://cdn.simpleicons.org/crunchyroll",
      alt: "Crunchyroll",
      className: "h-7 md:h-9 w-auto grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/f/f5/History_Logo.svg",
      alt: "History",
      className: "h-8 md:h-10 w-auto grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-300",
    },
    {
      src: "https://upload.wikimedia.org/wikipedia/commons/1/16/AMC_logo_2016.svg",
      alt: "AMC",
      className: "h-8 md:h-10 w-auto object-contain grayscale opacity-20 hover:opacity-60 hover:contrast transition-all duration-300",
    },
  ];

  return (
    <footer className="flex justify-center items-center flex-col gap-8 bg-black/50 shadow-sm text-content-muted py-4 text-center mt-10 relative text-[85%] ">
      <Carousel
        className="w-[95%] md:w-[85%] lg:w-[65%]"
        opts={{
          loop: true,
          align: "start",
          dragFree: true,
        }}
        plugins={[
          WheelGesturesPlugin(),
          Autoplay({
            delay: 400,
            stopOnMouseEnter: true,
            stopOnInteraction: false,
            playOnInit: true,
          }),
        ]}
      >
        <CarouselContent className="items-center">
          {streamingLogos &&
            streamingLogos.map((logo, index) => {
              const { src, alt, className } = logo;

              return (
                <CarouselItem key={index} className=" basis-[30%] sm:basis-[25%] md:basis-[20%] lg:basis-[20%] 4k:basis-[15%] flex items-center justify-center">
                  <img src={src} alt={alt} className={className} />{" "}
                </CarouselItem>
              );
            })}
        </CarouselContent>
      </Carousel>

      <div>
        <span className="">
          ©{" "}
          <a href="/" className="hover:underline">
            IFX
          </a>
        </span>
        <p>
          &lt;&gt; by
          <span className="text-brand-primary"> Andrey T</span> {new Date().getFullYear().toString()}{" "}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
