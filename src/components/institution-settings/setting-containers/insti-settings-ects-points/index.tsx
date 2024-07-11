import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import {
  getEctsPdfUploadKeys,
  setEctsPdfUploadKey,
} from "@/src/client-functions/client-ects";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import Skeleton from "@/src/components/skeleton";
import type { EctsPdfUploads } from "@/src/types/ects.types";
import PageSection from "./page-section";

export default function EctsPointsSettings() {
  const { data, isLoading } = useQuery({
    queryFn: getEctsPdfUploadKeys,
    staleTime: 10,
    queryKey: ECTS_FILE_UPLOAD_QUERY_KEY,
    refetchOnMount: true,
  });

  const { mutateAsync } = useMutation({
    mutationFn: (body: EctsPdfUploads) => setEctsPdfUploadKey(body),
  });

  if (isLoading) return <Skeleton />;
  return (
    <SettingsSection
      title="ects_settings.title"
      subtitle="ects_settings.subtitle"
      noFooter={true}
      footerButtonText=""
      footerButtonDisabled={true}
      footerButtonAction={async () => console.log("")}
    >
      <div className="space-y-12">
        <PageSection
          title="ects_settings.section.introductory_page.title"
          subtitle="ects_settings.section.introductory_page.subtitle"
          fileKey={data?.introductoryKey}
          uploadPathData={{
            type: "institution",
            subPath: "ects-points/introductory-pdf",
          }}
          onUploadFinish={async (introductoryKey) => {
            await mutateAsync({ introductoryKey });
          }}
        />
        <PageSection
          title="ects_settings.section.appendix_page.title"
          subtitle="ects_settings.section.appendix_page.subtitle"
          fileKey={data?.appendixKey}
          uploadPathData={{
            type: "institution",
            subPath: "ects-points/appendix-pdf",
          }}
          onUploadFinish={async (appendixKey) => {
            await mutateAsync({ appendixKey });
          }}
        />
      </div>
    </SettingsSection>
  );
}

export const ECTS_FILE_UPLOAD_QUERY_KEY = ["ects-file-keys"];
