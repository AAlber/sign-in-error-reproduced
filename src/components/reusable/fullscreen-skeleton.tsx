import dynamic from "next/dynamic";
import React from "react";
import ContentLoader from "react-content-loader";

function FullScreenSkeleton() {
  return (
    <div className="h-screen w-screen bg-background">
      <ContentLoader
        opacity={0.06}
        backgroundColor="#000000"
        foregroundColor="#ecebeb"
        style={{ height: "100vh", width: "100vw" }}
      >
        <rect x="0" y="0" className="h-full w-full" />
      </ContentLoader>
    </div>
  );
}

export default dynamic(() => Promise.resolve(FullScreenSkeleton), {
  ssr: false,
});
