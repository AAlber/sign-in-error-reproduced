import { motion } from "framer-motion";
import { PlusSquare } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import useWidgetStore from "../zustand";

export default function AddWidget() {
  const { t } = useTranslation("page");
  const [isHovered, setIsHovered] = useState(false);
  const { setOpen } = useWidgetStore();

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <motion.div
      className="!h-[120px] rounded-lg border border-dashed border-border bg-background hover:cursor-pointer "
      onMouseEnter={handleHover}
      onMouseLeave={handleHover}
      initial={{ width: 200, height: "auto" }}
      whileHover={{ scale: 1.1 }}
    >
      <div
        className="z-20 flex h-full flex-col-reverse items-center justify-center gap-1 dark:text-offwhite-3"
        onClick={() => setOpen(true)}
      >
        <span className=" text-sm">{t("admin_dashboard.add_widget")}</span>
        <PlusSquare size={24} />
      </div>
    </motion.div>
  );
}
