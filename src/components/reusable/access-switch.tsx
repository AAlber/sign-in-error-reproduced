import type { ReactNode } from "react";
import React from "react";
import { hasRolesWithAccess } from "@/src/client-functions/client-user-management";
import { useAsyncData } from "@/src/client-functions/client-utils/hooks";

type AccessStateProps = {
  state: "loading" | "hasAccess" | "noAccess";
  children: ReactNode;
};

const State: React.FC<AccessStateProps> = ({ children }) => <>{children}</>;

type AccessSwitchProps = {
  layerId?: string;
  layerIds?: string[];
  rolesWithAccess: Role[];
  defaultState?: "auto" | "hasAccess" | "noAccess";
  children:
    | React.ReactElement<AccessStateProps>[]
    | React.ReactElement<AccessStateProps>;
};

const AccessSwitch: React.FC<AccessSwitchProps> & { State: typeof State } = ({
  layerId,
  layerIds,
  rolesWithAccess,
  defaultState = "auto",
  children,
}) => {
  const { loading, data: hasAccess } = useAsyncData(() =>
    hasRolesWithAccess({
      layerIds: layerId ? [layerId] : layerIds ? layerIds : [],
      rolesWithAccess: rolesWithAccess,
    }),
  );

  return (
    <>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement<AccessStateProps>(child) &&
          child.type === State
        ) {
          if (
            (child.props.state === "loading" && loading) ||
            (child.props.state === "hasAccess" && hasAccess && !loading) ||
            (child.props.state === "noAccess" && !hasAccess && !loading)
          ) {
            return child;
          } else if (
            defaultState === "hasAccess" &&
            child.props.state === "hasAccess"
          ) {
            return child;
          } else if (
            defaultState === "noAccess" &&
            child.props.state === "noAccess"
          ) {
            return child;
          }
        } else {
          throw new Error(
            "AccessSwitch children must be of type AccessSwitch.State",
          );
        }
        return null;
      })}
    </>
  );
};

AccessSwitch.State = State;

export default AccessSwitch;
