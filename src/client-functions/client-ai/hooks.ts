import { useCallback, useRef, useState } from "react";
import type { z } from "zod";

export const useStreamedObject = <T>(
  endpoint: string,
  expectedSchema: z.ZodSchema<T>,
) => {
  const [data, setData] = useState<Partial<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setStreaming] = useState<boolean>(true);

  const resetData = () => {
    setData(null);
    setError(null);
  };

  // Use a ref to manage the EventSource instance
  const eventSourceRef = useRef<EventSource | null>(null);

  const startStream = useCallback(
    (prompt: string) => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close(); // Ensure any existing stream is closed
      }
      eventSourceRef.current = new EventSource(
        endpoint + "?prompt=" + encodeURIComponent(prompt),
      );

      setStreaming(true);
      eventSourceRef.current.addEventListener("message", (event) => {
        try {
          const result = JSON.parse(event.data);
          setData(result);
          setError(null);
        } catch (err) {
          console.error("Error parsing streamed data:", err);
          setError("Error parsing streamed data");
        }
      });

      eventSourceRef.current.addEventListener("close", () => {
        setStreaming(false);
        console.log("Stream ended by the server.");
        eventSourceRef.current?.close();
      });

      eventSourceRef.current.onerror = (err) => {
        console.error("EventSource failed:", err);
        setError("EventSource failed");
        if (eventSourceRef.current) {
          setStreaming(false);
          eventSourceRef.current.close();
        }
      };
    },
    [endpoint],
  );

  const closeStream = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setStreaming(false);
    }
  }, []);

  return { data, isStreaming, startStream, closeStream, resetData, error };
};
