import { useTranslation } from "react-i18next";
import { DropdownMenuItem } from "@/src/components/reusable/shadcn-ui/dropdown-menu";
import useWhiteBoard from "../../reusable/page-layout/navigator/whiteboard/zustand";

export default function CloudAddItemScribble() {
  const { open } = useWhiteBoard();
  const { t } = useTranslation("page");
  return (
    <DropdownMenuItem
      onClick={() => open()}
      className="flex w-full items-center px-2 py-1"
    >
      <ScribbleIcon />
      <span className="text-sm text-contrast">
        {t("cloud.create_scribble")}
      </span>
    </DropdownMenuItem>
  );
}

export const ScribbleIcon = () => {
  return (
    <svg
      fill="none"
      width="24"
      height="24"
      strokeWidth="1.75"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-3 h-4 w-4 text-contrast"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />{" "}
      <path d="M3 15c2 3 4 4 7 4s7 -3 7 -7s-3 -7 -6 -7s-5 1.5 -5 4s2 5 6 5s8.408 -2.453 10 -5" />{" "}
    </svg>
  );
};
