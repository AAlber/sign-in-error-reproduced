import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { setMoodleCrendentials } from "@/src/client-functions/client-moodle-integration";
import Form from "@/src/components/reusable/formlayout";
import SettingsSection from "@/src/components/reusable/settings/settings-section";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { Input } from "@/src/components/reusable/shadcn-ui/input";
import type { MoodleCredentialsSchemaType, MoodleIntegration } from "./schema";
import { MOODLE_QUERY_KEY, moodleCredentialsSchema } from "./schema";

type Props = {
  credentials?: MoodleIntegration;
};

export default function MoodleCredentialSettings({ credentials }: Props) {
  const { t } = useTranslation("page");
  const queryClient = useQueryClient();
  const [isUpdatingDisabled, setUpdatingDisabled] = useState(
    !!credentials?.apiKey,
  );

  const { control, handleSubmit, formState, watch } =
    useForm<MoodleCredentialsSchemaType>({
      resolver: zodResolver(moodleCredentialsSchema),
      defaultValues: {
        apiKey: credentials?.apiKey,
        siteUrl: credentials?.siteUrl,
      },
    });

  const fields = watch(["apiKey", "siteUrl"]);
  const isInvalid =
    !!Object.keys(formState.errors).length || fields.some((field) => !field);

  const { mutateAsync, isLoading } = useMutation({
    mutationFn: setMoodleCrendentials,
    onSuccess: () => {
      setUpdatingDisabled(true);
      queryClient.invalidateQueries(MOODLE_QUERY_KEY);
    },
  });

  return (
    <SettingsSection
      title="moodle.settings.title"
      subtitle="moodle.settings.subtitle"
      loading={false}
      noFooter
    >
      <Form>
        <Controller
          control={control}
          name="siteUrl"
          render={({ field }) => (
            <Form.Item label="moodle.site_url" description="">
              <Input
                placeholder={t("moodle.site_url_input")}
                disabled={isUpdatingDisabled}
                {...field}
              />
            </Form.Item>
          )}
        />
        <Controller
          control={control}
          name="apiKey"
          render={({ field }) => (
            <Form.Item
              label="moodle.api_key_label"
              description="moodle.api_key_description"
            >
              <Input
                placeholder={t("moodle.api_key_placeholder")}
                type="password"
                disabled={isUpdatingDisabled}
                {...field}
              />
            </Form.Item>
          )}
        />
      </Form>
      <div className="mt-4 text-right">
        {isUpdatingDisabled ? (
          <Button onClick={() => setUpdatingDisabled(false)} variant="default">
            {t("moodle.update_credentials")}
          </Button>
        ) : (
          <Button
            onClick={() => handleSubmit((v) => mutateAsync(v))()}
            variant="cta"
            disabled={isInvalid}
            loading={isLoading}
          >
            {t("general.save")}
          </Button>
        )}
      </div>
    </SettingsSection>
  );
}
