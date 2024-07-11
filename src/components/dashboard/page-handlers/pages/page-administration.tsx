import { ListTree } from "lucide-react";
import AdministrationTree from "@/src/components/administration";
import AdministrationToolbar from "@/src/components/administration/header";
import { PageBuilder } from "../page-registry";

const administration = new PageBuilder("STRUCTURE")
  .withIconComponent(<ListTree size={18} />)
  .withAccessRoles(["moderator", "admin"])
  .withNavigationType("without-secondary-navigation")
  .withContentComponent(<AdministrationTree />)
  .withToolbarComponent(<AdministrationToolbar />)
  .build();

export { administration };
