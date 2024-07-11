"use client";

import { useTranslation } from "react-i18next";
import type { SupportPackages } from "@/src/client-functions/client-stripe/price-id-manager";
import { getSupportPackageInfo } from "@/src/client-functions/client-stripe/price-id-manager";
import CheckList from "../../check-list";

export function FeatureList({
  supportPackage,
}: {
  supportPackage: SupportPackages;
}) {
  const packageInfo = getSupportPackageInfo(supportPackage);
  const { t } = useTranslation("page");
  return (
    <CheckList className="text-muted-contrast">
      {packageInfo?.featureList.map((feature, idx) => {
        if (!feature) return null;
        return (
          <CheckList.Item
            key={idx}
            variant="positive"
            text={t(feature.title)}
            secondaryText={t(feature.duration)}
          />
        );
      })}
    </CheckList>
  );
}
