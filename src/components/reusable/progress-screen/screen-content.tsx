import type { ReactNode } from "react";

export const Content = ({ children }: { children: ReactNode }) => {
  return (
    <div className="absolute right-0 z-50 flex min-h-screen w-full min-w-[400px] flex-col items-center justify-center border border-white bg-clip-padding shadow-2xl backdrop-blur-3xl md:w-1/2">
      {children}
    </div>
  );
};
