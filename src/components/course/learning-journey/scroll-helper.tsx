import { ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/src/components/reusable/shadcn-ui/button";
import { log } from "@/src/utils/logger/logger";

export default function ScrollHelper() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionId = "learning-journey";
  const scrollSectionId = "scroll-section";

  const handleScrollUp = () => {
    log.click("Clicked on course scroll up button");
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const scrollButton = document.getElementById(scrollSectionId);
    if (!scrollButton) {
      return;
    }

    const handleScroll = () => {
      const shouldBeVisible = scrollButton.scrollTop > 100;
      setIsVisible(shouldBeVisible);
    };

    scrollButton.addEventListener("scroll", handleScroll);

    return () => {
      scrollButton.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed bottom-10 mr-[380px] md:right-0 lg:right-0">
      {isVisible && (
        <Button onClick={handleScrollUp} style={{ zIndex: 1000 }}>
          <ArrowUp className="h-4 w-4 text-contrast" />
        </Button>
      )}
    </div>
  );
}
