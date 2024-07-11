import type { ComponentProps } from "react";
import classNames from "@/src/client-functions/client-utils";

type Props = React.PropsWithChildren<ComponentProps<"div">>;

export default function SwitchGroup({ children, className, ...rest }: Props) {
  return (
    <div
      className={classNames(
        "flex flex-col divide-y divide-border rounded-md border border-border bg-foreground px-3",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
