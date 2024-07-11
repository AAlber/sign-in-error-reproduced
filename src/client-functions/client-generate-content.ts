import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import type {
  ClientGenerateContent,
  ClientGenerateContentFromPDF,
  ClientGenerateContentFromPDFText,
  ClientGenerateContentFromText,
  ServerGenerateContentResponse,
} from "../types/soon_deprecated_ai";
import { readPDF } from "./client-workbench";

export async function generateContent(
  data: ClientGenerateContent,
): Promise<ServerGenerateContentResponse | null> {
  switch (data.type) {
    case "pdf":
      return generateContentFromPDF(data);
    default:
      return generateContentFromPrompt(data);
  }
}

async function generateContentFromPrompt(
  data: ClientGenerateContentFromText,
): Promise<ServerGenerateContentResponse | null> {
  const response = await fetch(api.generateContent, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 402) {
      toast.warning("toast_workbench_warning1_title", {
        icon: "🤚",
        description: "toast_workbench_warning1_subtitle",
      });
      return null;
    }
    toast.responseError({
      response,
      title: "toast_workbench_warning1_error",
    });
    return null;
  }
  const aiResponse = await response.json();
  return aiResponse.content;
}

async function generateContentFromPDF(
  data: ClientGenerateContentFromPDF,
): Promise<ServerGenerateContentResponse | null> {
  const text = await readPDF(data.file);

  if (text.length < 1000) {
    toast.warning("toast_workbench_warning2_title", {
      icon: "🤏",
      description: "toast_workbench_warning2_subtitle",
    });
    return null;
  }

  const pdfTextData: ClientGenerateContentFromPDFText = {
    ...data,
    pdfText: text,
  };

  const response = await fetch(api.generateContentForPdf, {
    method: "POST",
    body: JSON.stringify(pdfTextData),
  });

  if (!response.ok) {
    if (response.status === 402) {
      toast.warning("toast_workbench_warning1_title", {
        icon: "🤚",
        description: "toast_workbench_warning1_subtitle",
      });
      return null;
    }
    toast.responseError({
      response,
      title: "toast_workbench_warning1_error",
    });
    return null;
  }
  const aiResponse = await response.json();
  return aiResponse.content;
}
