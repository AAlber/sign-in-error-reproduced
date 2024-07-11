import Image from "next/image";

type FuxamBotLayerProps = {
  state: "welcome" | "error" | "neutral" | "not-found" | "construction";
  children: React.ReactNode;
};

export default function FuxamBotLayout({
  state,
  children,
}: FuxamBotLayerProps) {
  return (
    <div className="overflow- col-span-full row-span-full flex h-full w-full items-center justify-between text-contrast">
      <div className="relative isolate h-full w-full overflow-hidden bg-background">
        <Image
          className="hover-effect  absolute right-0 z-50 col-span-1 hidden object-cover lg:-bottom-36 lg:flex lg:h-[400px] lg:w-[400px] xl:-bottom-36 2xl:h-[600px] 2xl:w-[600px]"
          src={"/illustrations/robot/" + state + ".webp"}
          width={600}
          height={600}
          priority
          alt=""
        />
        <svg
          className="absolute inset-0 -z-10 h-full w-full stroke-border [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-border">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)"
          />
        </svg>
        <div className="mx-auto flex h-full w-full max-w-7xl px-6">
          <div className="m-auto max-w-2xl lg:mx-0 lg:ml-10 lg:max-w-xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
