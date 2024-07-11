export type BlockStatus = "PUBLISHED" | "COMING_SOON" | "DRAFT" | "DISABLED";

export type BlockStatusType = {
  identifier: BlockStatus;
  name: string;
  color: string;
  isEditable: boolean;
  visible: boolean;
};

export const blockStatus: BlockStatusType[] = [
  {
    identifier: "PUBLISHED",
    name: "course_main_content_block_status_dropdown_published",
    color: "bg-emerald-400",
    isEditable: false,
    visible: true,
  },
  {
    identifier: "COMING_SOON",
    name: "course_main_content_block_status_dropdown_coming_soon",
    color: "bg-yellow-400",
    isEditable: true,
    visible: true,
  },
  {
    identifier: "DRAFT",
    name: "course_main_content_block_status_dropdown_draft",
    color: "bg-gray-400",
    isEditable: true,
    visible: false,
  },
  {
    identifier: "DISABLED",
    name: "course_main_content_block_status_dropdown_disabled",
    color: "bg-red-400",
    isEditable: false,
    visible: false,
  },
];
