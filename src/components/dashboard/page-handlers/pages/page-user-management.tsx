import { Users } from "lucide-react";
import InstitutionUserManagement from "@/src/components/institution-user-management";
import { DataTableToolbar } from "@/src/components/institution-user-management/data-table/toolbar";
import { PageBuilder } from "../page-registry";

const userManagement = new PageBuilder("USERMANAGEMENT")
  .withIconComponent(<Users size={18} />)
  .withAccessRoles(["admin"])
  .withNavigationType("without-secondary-navigation")
  .withContentComponent(<InstitutionUserManagement />)
  .withToolbarComponent(<DataTableToolbar />)
  .build();

export { userManagement };
