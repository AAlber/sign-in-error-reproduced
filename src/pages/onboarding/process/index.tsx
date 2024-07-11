import * as Sentry from "@sentry/nextjs";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Suspense, useEffect } from "react";
import Onboarding from "@/src/components/institution-onboarding/onboarding";
import useInstitutionOnboarding from "@/src/components/institution-onboarding/zustand";
import Spinner from "@/src/components/spinner";

const StepOne = dynamic(
  () => import("@/src/components/institution-onboarding/steps/step-1"),
  { suspense: true },
);
const StepTwo = dynamic(
  () => import("@/src/components/institution-onboarding/steps/step-2"),
  { suspense: true },
);
const StepThree = dynamic(
  () => import("@/src/components/institution-onboarding/steps/step-3"),
  { suspense: true },
);

export default function InstitutionOnboarding() {
  const { step, setStep } = useInstitutionOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (
      router.query.institutionId ||
      router.query.name ||
      router.query.paymentSettings
    ) {
      Sentry.addBreadcrumb({ message: "onboarding - skipping to step 3" });
      setStep(3);
    }
  }, [router.isReady]);
  return (
    <Onboarding>
      <Suspense fallback={<Spinner />}>
        {step === 1 && <StepOne />}
        {step === 2 && <StepTwo />}
        {step === 3 && <StepThree />}
      </Suspense>
    </Onboarding>
  );
}
