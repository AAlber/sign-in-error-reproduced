import React from "react";
import { useTranslation } from "react-i18next";

type HighlightTagProps = {
  text: string;
  children: React.ReactNode;
  className?: string;
  offset?: {
    x: number;
    y: number;
  };
  disabled?: boolean;
};

const HighlightTag: React.FC<HighlightTagProps> = ({
  text,
  children,
  className = "",
  offset = { x: -50, y: -100 },
  disabled = false,
}) => {
  const { t } = useTranslation("page");

  if (disabled) {
    return <>{children}</>;
  }
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="absolute left-1/2 top-0 z-40 flex items-center justify-center"
        style={{
          transform: `translate(${offset.x}%, ${offset.y}%)`,
        }}
      >
        <div className="relative animate-bounce-slow">
          <div className="absolute -bottom-1.5 left-1/2 size-3 -translate-x-1/2 rotate-45 border-b border-r border-border bg-foreground" />
          <button className="cursor-pointer rounded-md border border-border bg-foreground px-3 py-1.5">
            <span className="font-semibold text-contrast">{t(text)}</span>
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default HighlightTag;
