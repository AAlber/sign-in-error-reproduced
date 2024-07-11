import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Spinner from "@/src/components/spinner";
import {
  checkInAttendence,
  checkInWithRotatingQr,
} from "../client-functions/client-appointment-attendence";
import FuxamBotLayoutWithBox from "../components/reusable/fuxam-bot-layout-box";

export default function Invitation() {
  const router = useRouter();
  const { appointmentData, key, token } = router.query as {
    appointmentData: string;
    key: string;
    token?: string;
  };

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [appointment, setAppointment] = useState<Params | null>(null);

  useEffect(() => {
    // wait for router to be ready and query to be complete
    if (!router.isReady) return;
    if (!token && (!appointmentData || !key)) {
      setSuccess(false);
      setError("checkin-unknown-error");
      return;
    }
    // parse appointment data from query string
    try {
      let data: string;
      let dataJson = {} as Params;

      if (!!appointmentData) {
        data = decodeURIComponent(appointmentData);
        dataJson = JSON.parse(data) as Params;
      }

      const request = !!token
        ? checkInWithRotatingQr(token)
        : checkInAttendence(dataJson.id, key);

      if (!!dataJson) setAppointment(dataJson);
      request.then((checkInStatus) => {
        setLoading(false);
        setSuccess(checkInStatus.success);
        if (!checkInStatus.success) setError(checkInStatus.error!);
      });
    } catch (e) {
      return setSuccess(false);
    }
    setLoading(true);
  }, [router.isReady]);

  const { t } = useTranslation("page");

  return (
    <>
      <Head>
        <title>{t("attendence_checkin.title")}</title>
        <meta name="description" content={t("attendence_checkin.title")} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen">
        <FuxamBotLayoutWithBox
          state={success ? "welcome" : error ? "error" : "neutral"}
        >
          <FuxamBotLayoutWithBox.Heading>
            <div className="flex items-center gap-2">
              {loading ? <Spinner size="w-6 md:w-7" /> : null}
              {loading
                ? t("attendence_checkin.progress")
                : success
                ? t("attendence_checkin.success")
                : t(error)}
            </div>
          </FuxamBotLayoutWithBox.Heading>
          <FuxamBotLayoutWithBox.Description>
            {loading
              ? t("attendence_checkin.progress_description")
              : success
              ? t("attendence_checkin.success_description")
              : t("attendence_checkin.error_description")}
          </FuxamBotLayoutWithBox.Description>
          <FuxamBotLayoutWithBox.Children>
            {appointment && !("token" in appointment) ? (
              <div className="mt-5 flex flex-wrap gap-x-2">
                <h1 className="text-sm text-contrast">{appointment.title}</h1>
                <p className="text-sm text-muted-contrast">
                  {dayjs(appointment.dateTime).format("DD. MMM YYYY")}
                </p>
                <p className="text-sm text-muted-contrast">
                  {appointment.layer}
                </p>
              </div>
            ) : null}
          </FuxamBotLayoutWithBox.Children>
        </FuxamBotLayoutWithBox>
      </main>
    </>
  );
}

type Params = {
  id: string;
  title: string;
  dateTime: string;
  layer: string;
};
