import { useEffect, useState } from "react";

export function useLoadingSteps(loadingSteps: string[]) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep(Math.floor(Math.random() * loadingSteps.length));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return loadingSteps[step];
}
