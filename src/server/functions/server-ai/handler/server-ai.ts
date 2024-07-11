import { getCurrentInstitutionId } from "../../server-user";
import { ServerAiHandler } from "./server-ai-handler";

export async function getAIServerHandler(
  id: string,
  idType: "user" | "institution" = "user",
): Promise<ServerAiHandler> {
  if (idType === "institution") {
    return new ServerAiHandler(id);
  }

  const institutionId = await getCurrentInstitutionId(id);
  if (!institutionId) throw new Error("No institution id");

  return new ServerAiHandler(institutionId);
}
