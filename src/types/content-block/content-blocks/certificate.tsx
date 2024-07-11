import { Award } from "lucide-react";
import { ContentBlockBuilder } from "../registry";

export const certificate = new ContentBlockBuilder("Certificate")
  .withName("certificate")
  .withStatus("comingsoon")
  .withDescription("certificate-description")
  .withHint("LOL")
  .withStyle({
    icon: <Award className="h-4 w-4" />,
  })
  .build();

export default certificate;
