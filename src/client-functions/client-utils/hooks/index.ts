import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

/**
 * !IMPORTANT
 * To avoid dependency cycles, hooks here should only depend on native react hooks - and not other related client utils
 */

export const useDebounce = (
  effect: () => any,
  dependencies: any[],
  delay: number,
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      effect();
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [...dependencies]);
};

type UseAsyncDataReturn<T> = {
  loading: boolean;
  data: T | null;
  error: Error | null;
};

export function useAsyncData<T, R = unknown>(
  promise: () => Promise<T>,
  refreshTrigger?: R,
  debounceTime?: number,
  enabled = true,
): UseAsyncDataReturn<T> {
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const memoizedPromise = useCallback(promise, [enabled, refreshTrigger]);

  useEffect(() => {
    if (!enabled) return;
    setLoading(true);
    const callPromise = () => {
      memoizedPromise()
        .then((data) => {
          if (error) setError(null);
          setData(data);
          setLoading(false);
        })
        .catch((error) => {
          setError(error);
          setLoading(false);
        });
    };

    if (debounceTime) {
      const timeoutId = setTimeout(callPromise, debounceTime);
      return () => clearTimeout(timeoutId);
    } else {
      callPromise();
    }
  }, [memoizedPromise, refreshTrigger, debounceTime]);

  return { loading, data, error };
}

/** from https://github.com/uidotdev/usehooks */
export function useThrottle<T>(value: T, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number | null>(null);

  useEffect(() => {
    const now = Date.now();

    if (lastUpdated.current && now >= lastUpdated.current + interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const id = window.setTimeout(() => {
        lastUpdated.current = now;
        setThrottledValue(value);
      }, interval);

      return () => window.clearTimeout(id);
    }
  }, [value, interval]);

  return throttledValue;
}

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<"mobile" | "desktop">("desktop");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setDeviceType("mobile");
      } else {
        setDeviceType("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceType;
};

export const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
};

/** checks whether the window is in background or in focus */
export function useIsWindowVisible() {
  const [isWindowVisible, setIsVisible] = useState(!document.hidden);
  useEffect(() => {
    window.onblur = () => {
      setIsVisible(false);
    };
    window.onfocus = () => {
      setIsVisible(true);
    };

    return () => {
      window.onblur = null;
      window.onfocus = null;
    };
  }, []);

  return { isWindowVisible };
}

export interface useCopyToClipboardProps {
  timeout?: number;
}

export function useCopyToClipboard({
  timeout = 2000,
}: useCopyToClipboardProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copyToClipboard = (value: string) => {
    if (typeof window === "undefined" || !navigator.clipboard?.writeText) {
      return;
    }

    if (!value) {
      return;
    }

    navigator.clipboard.writeText(value).then(() => {
      setIsCopied(true);

      setTimeout(() => {
        setIsCopied(false);
      }, timeout);
    });
  };

  return { isCopied, copyToClipboard };
}

export function useRotatingText(words: string[], interval = 2000) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (index === words.length - 1) {
        setIndex(0);
        return;
      }
      setIndex((index) => index + 1);
    }, interval);

    return () => clearInterval(intervalId);
  }, [words, interval]);

  return { rotatingWord: words[index] };
}

export function useDynamicGlobalEventListener(eventType, handler, isActive) {
  // Using a ref to track the current active status to avoid unnecessary removals/additions
  const activeStatusRef = useRef(isActive);

  useEffect(() => {
    // Function to attach or detach the event listener based on isActive
    const updateEventListener = (active) => {
      if (active) {
        window.addEventListener(eventType, handler);
      } else {
        window.removeEventListener(eventType, handler);
      }
    };

    // Check for changes in the active status to update the event listener accordingly
    if (activeStatusRef.current !== isActive) {
      updateEventListener(isActive);
      activeStatusRef.current = isActive;
    }

    // Cleanup function to ensure the event listener is removed when the component unmounts
    return () => {
      if (activeStatusRef.current) {
        window.removeEventListener(eventType, handler);
      }
    };
  }, [eventType, handler, isActive]); // Re-run effect if any of these dependencies change
}
