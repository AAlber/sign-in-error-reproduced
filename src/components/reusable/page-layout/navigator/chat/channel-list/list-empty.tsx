import { useEffect, useState } from "react";
import classNames from "@/src/client-functions/client-utils";
import NoChats from "../no-chats";

export default function ListEmpty() {
  // delay mount, transition effect
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsReady(true);
    }, 100);
  }, []);

  return (
    <div
      className={classNames(
        isReady ? "opacity-100" : "opacity-0",
        "flex grow transition-opacity",
      )}
    >
      <NoChats />
    </div>
  );
}
