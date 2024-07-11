import {
  hasRolesInInstitution,
  hasRolesWithAccess,
} from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";

type AccessGateProps = {
  layerId?: string;
  layerIds?: string[];
  rolesWithAccess: Role[];
  loaderElement?: JSX.Element;
  checkWholeInstitutionForAccess?: boolean;
  children: JSX.Element;
};

// This component is used to conditionally render elements based on the user's role.

export default function AccessGate(props: AccessGateProps) {
  const {
    loading,
    data: hasAccess,
    error,
  } = useAsyncData(() =>
    props.checkWholeInstitutionForAccess
      ? hasRolesInInstitution({
          roles: props.rolesWithAccess,
        })
      : hasRolesWithAccess({
          layerIds: props.layerIds
            ? props.layerIds
            : props.layerId
            ? [props.layerId]
            : [],
          rolesWithAccess: props.rolesWithAccess,
        }),
  );

  // If the component is loading or error occurred, render the loader element or null
  if (loading || error) return props.loaderElement || null;

  // If the user does not have access, render nothing.
  if (!hasAccess) return null;

  // If the user has access, render the children.
  return props.children;
}
