import { toast } from "@/src/components/reusable/toaster/toast";
import api from "@/src/pages/api/api";

export async function generateBigBlueButtonLink(
  layerIds: string[],
  title: string,
  duration: number,
) {
  const reponse = await fetch(api.generateBBBLink, {
    method: "POST",
    body: JSON.stringify({
      layerIds,
      title,
      duration,
    }),
  });

  if (!reponse.ok) {
    if (reponse.status === 405) {
      toast.warning("toast.bigbluebutton_warning_title", {
        icon: "⚙️",
        description: "toast.bigbluebutton_warning_subtitle",
      });
      return null;
    }
    toast.error("toast.bigbluebutton_error", {
      description: "toast.bigbluebutton_error_desc",
    });
    return null;
  }

  const data: {
    url: string;
    modUrl: string;
  } = await reponse.json();

  return data;
}
