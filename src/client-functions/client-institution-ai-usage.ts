import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type { AIUsageReport } from "../types/ai";

export async function getInstitutionAIUsageReport(): Promise<AIUsageReport> {
  const response = await fetch(api.getUsageReport, { method: "GET" });
  if (!response.ok) {
    toast.responseError({
      response: response,
      title: "toast_ai_usage_error",
    });
  }
  return await response.json();
}
