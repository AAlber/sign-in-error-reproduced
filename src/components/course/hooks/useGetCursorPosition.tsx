import { useEffect, useState } from "react";

/**
 * Get cursor position relative to window
 * @returns "upperHalf" | "lowerHalf" | undefined
 */

const useGetCursorPosition = (enabled = true) => {
  const [cursorPositionY, setCursorPositionY] = useState<
    "upperHalf" | "lowerHalf"
  >();

  useEffect(() => {
    if (!enabled || window.innerHeight < 800) {
      setCursorPositionY(undefined);
      return;
    }

    const middleHalf = window.innerHeight / 2;
    const getCursorPosition = (e: MouseEvent) => {
      if (e.clientY > middleHalf) {
        setCursorPositionY("lowerHalf");
      } else {
        setCursorPositionY("upperHalf");
      }
    };

    document.addEventListener("mousemove", getCursorPosition);
    return () => {
      document.removeEventListener("mousemove", getCursorPosition);
    };
  }, [enabled]);

  return { cursorPositionY };
};

export default useGetCursorPosition;
