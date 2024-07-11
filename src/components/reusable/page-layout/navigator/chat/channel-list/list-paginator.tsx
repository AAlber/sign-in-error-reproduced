import React from "react";
import Spinner from "@/src/components/spinner";

const ChannelListPaginator = (props) => {
  const { loadNextPage, isLoading, hasNextPage } = props;
  const { children } = props as any;

  return (
    <div>
      <div>{children}</div>
      {isLoading && (
        <div className="flex justify-center pl-6">
          <Spinner />
        </div>
      )}
      {/* {hasNextPage && !isLoading && (
        <button
          className="my-2 w-full text-center text-sm"
          onClick={loadNextPage}
        >
          <span className="inline-block rounded-lg bg-blue-500 p-1 text-xs text-white">
            Load More
          </span>
        </button>
      )} */}
    </div>
  );
};

export default ChannelListPaginator;
