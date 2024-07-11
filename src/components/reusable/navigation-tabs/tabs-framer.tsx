import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import type { resizablePopover } from ".";
import { ExcludedTabsPopover } from "./excluded-tabs-popover";
import { handleSelectTab } from "./functions";
import useResponsiveTabsFilter from "./hooks/use-responsive-tabs";
import type { NavigationTab } from "./hooks/use-tabs";

const transition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.15,
};

type TabsProps = {
  selectedTabIndex: number;
  tabs: NavigationTab[];
  setSelectedTab: (input: [number, number]) => void;
  onChange?: (id: string) => void;
  className?: string;
  resizablePopover: resizablePopover;
};

const Tabs = ({
  tabs,
  selectedTabIndex,
  setSelectedTab,
  className,
  resizablePopover,
}: TabsProps): JSX.Element => {
  const [buttonRefs, setButtonRefs] = useState<Array<HTMLButtonElement | null>>(
    [],
  );

  useEffect(() => {
    setButtonRefs((prev) => prev.slice(0, tabs.length));
  }, [tabs.length]);

  const { filteredTabs, excludedTabs } = useResponsiveTabsFilter(tabs);
  const navRef = useRef<HTMLDivElement>(null);
  const navRect = navRef.current?.getBoundingClientRect();

  const selectedRect = buttonRefs[selectedTabIndex]?.getBoundingClientRect();

  const [hoveredTabIndex, setHoveredTabIndex] = useState<number | null>(null);
  const hoveredRect =
    buttonRefs[hoveredTabIndex ?? -1]?.getBoundingClientRect();

  return (
    <nav
      ref={navRef}
      className={classNames(
        className,
        "relative z-0 flex",
        resizablePopover.side === "left" ? "flex-row-reverse" : "flex-row",
      )}
      onPointerLeave={() => setHoveredTabIndex(null)}
    >
      <div className="relative flex w-auto items-center justify-start">
        {filteredTabs.map((item, i) => (
          <motion.button
            key={i}
            className={classNames(
              "text-md relative z-20 flex h-8 cursor-pointer select-none items-center rounded-md bg-transparent px-3 text-sm transition-colors",
              hoveredTabIndex === i || selectedTabIndex === i
                ? "!text-contrast"
                : "text-muted-contrast",
            )}
            ref={(el) => (buttonRefs[i] = el)}
            onPointerEnter={() => setHoveredTabIndex(i)}
            onFocus={() => setHoveredTabIndex(i)}
            onClick={() =>
              handleSelectTab(
                item.index,
                tabs,
                setSelectedTab,
                selectedTabIndex,
              )
            }
          >
            {item.tab.tab.name}
          </motion.button>
        ))}
      </div>
      <ExcludedTabsPopover
        tabs={excludedTabs}
        allTabs={tabs}
        setSelectedTab={setSelectedTab}
        selectedTabIndex={selectedTabIndex}
        resizablePopover={resizablePopover}
      />

      <AnimatePresence>
        {hoveredRect && navRect && (
          <motion.div
            key={"hover"}
            className="absolute left-0 top-0 z-10 rounded-md bg-accent/50"
            initial={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 0,
            }}
            animate={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 1,
            }}
            exit={{
              x: hoveredRect.left - navRect.left,
              y: hoveredRect.top - navRect.top,
              width: hoveredRect.width,
              height: hoveredRect.height,
              opacity: 0,
            }}
            transition={transition}
          />
        )}
      </AnimatePresence>
      {selectedRect && navRect && (
        <motion.div
          className={"absolute -bottom-[1px] left-0 z-10 rounded-full h-[2px] bg-contrast"}
          initial={false}
          animate={{
            width: selectedRect.width * 0.8,
            x: `calc(${selectedRect.left - navRect.left}px + 10%)`,
            opacity: 1,
          }}
          transition={transition}
        />
      )}
    </nav>
  );
};

const Content = ({
  children,
  className,
  selectedTabIndex,
}: {
  selectedTabIndex: number;
  children: ReactNode;
  className?: string;
}): JSX.Element => {
  return (
    <AnimatePresence exitBeforeEnter={false}>
      <motion.div
        key={selectedTabIndex}
        transition={{ duration: 0.25 }}
        initial={"enter"}
        animate={"center"}
        exit={"exit"}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const Framer = { Tabs, Content };
