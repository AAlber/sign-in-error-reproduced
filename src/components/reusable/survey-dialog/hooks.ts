import { useEffect } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

export function useKeydownHandler(
  handler: KeyHandler,
  deps: React.DependencyList,
) {
  useEffect(() => {
    document.addEventListener("keydown", handler);
    return () => {
      document.removeEventListener("keydown", handler);
    };
  }, [handler, ...deps]);
}
