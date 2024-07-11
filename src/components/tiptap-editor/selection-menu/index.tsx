import * as PopoverPrimitive from "@radix-ui/react-popover";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import React from "react";
import classNames from "@/src/client-functions/client-utils";
import { Button as ShadCnButton } from "@/src/components/reusable/shadcn-ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/reusable/shadcn-ui/popover";

const SelectionMenu = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-auto w-max items-center divide-x divide-border rounded-md border border-border bg-foreground shadow-md">
      {children}
    </div>
  );
};
SelectionMenu.displayName = "SelectionMenu";

const Section = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center p-1">{children}</div>;
};
Section.displayName = "Section";

const IconButton = ({
  icon,
  onClick,
  active = false,
}: {
  icon: JSX.Element;
  onClick?: () => void;
  active?: boolean;
}) => {
  return (
    <ShadCnButton
      variant={"ghost"}
      size={"icon"}
      className={classNames(
        "text-muted-contrast hover:text-contrast",
        active && "bg-accent/50",
      )}
      onClick={onClick}
    >
      {icon}
    </ShadCnButton>
  );
};
IconButton.displayName = "IconButton";

const Button = ({ children }: { children: React.ReactNode }) => {
  return (
    <ShadCnButton
      variant={"ghost"}
      className="font-normal text-muted-contrast hover:text-contrast"
    >
      {children}
    </ShadCnButton>
  );
};
Button.displayName = "Button";

const Dropdown = Popover;
Dropdown.displayName = "Menu";

const Menu = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref): JSX.Element => (
    <div
      ref={ref}
      {...props}
      className={classNames(
        "milkblur z-50 m-2 w-max rounded-md border border-border bg-popover p-1 text-popover-contrast shadow-md outline-none ",
        className,
      )}
    >
      {children}
    </div>
  ),
);
Menu.displayName = "Menu2";

const DropdownTrigger = PopoverTrigger;
DropdownTrigger.displayName = "MenuTrigger";

const DropdownClose = PopoverPrimitive.PopoverClose;
DropdownClose.displayName = "MenuClose";

const DropdownContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, ...props }, ref) => (
  <PopoverContent
    className={classNames("flex w-max flex-col gap-y-1 p-1", className)}
    {...props}
    ref={ref}
  />
));
DropdownContent.displayName = "MenuContent";

const DropdownItem = React.forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(
  ({ className, ...props }, ref): JSX.Element => (
    <button
      className={classNames(
        "relative flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2.5 py-1.5 text-sm outline-none transition-colors hover:bg-accent/50 hover:text-accent-contrast focus:bg-accent/50 focus:text-accent-contrast data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className,
      )}
      {...props}
      ref={ref}
    />
  ),
);

DropdownItem.displayName = "DropdownItem";

SelectionMenu.Section = Section;
SelectionMenu.IconButton = IconButton;
SelectionMenu.Button = Button;
SelectionMenu.Dropdown = Dropdown;
SelectionMenu.DropdownTrigger = DropdownTrigger;
SelectionMenu.DropdownClose = DropdownClose;
SelectionMenu.DropdownContent = DropdownContent;
SelectionMenu.DropdownItem = DropdownItem;
SelectionMenu.Menu = Menu;

export default SelectionMenu;
