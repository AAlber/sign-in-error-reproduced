import { useState } from "react";
import PopoverComponent from "../../popover";
import UserDropdownContainer from "./user-dropdown-container";
import UserDropdownSearch from "./user-dropdown-search";
import useUserDropdownView from "./zustand";

export default function UserDropdownView({
  children,
  layerId,
  showChatOption = false,
  onUserSelect,
}: {
  children: React.ReactNode;
  layerId: string;
  showChatOption?: boolean;
  onUserSelect?: (user: any) => void;
}) {
  const { open, setOpen, init } = useUserDropdownView();
  const [hasViolation, setHasViolation] = useState(false);

  const content = ({ hasViolations }) => {
    if (hasViolations && hasViolation !== hasViolations) {
      setTimeout(() => {
        setHasViolation(hasViolations);
      }, 100);
    }

    return (
      <div
        style={{
          minWidth: 170,
          marginTop: 10,
          marginRight: 5,
        }}
        className="bg-backgorund w-96 scale-100 divide-y divide-border rounded-md border border-border bg-background p-2 opacity-100 focus:outline-none"
      >
        <UserDropdownSearch />
        <UserDropdownContainer />
      </div>
    );
  };

  return (
    <td>
      <PopoverComponent
        className="z-50"
        open={open}
        setOpen={setOpen}
        content={content}
        position={["bottom", "right"]}
        align={hasViolation ? "end" : "start"}
      >
        <button
          className="w-full"
          onClick={() => {
            init({ title: "", layerId, showChatOption, onUserSelect });
            setOpen(true);
          }}
        >
          {children}
        </button>
      </PopoverComponent>
    </td>
  );
}
