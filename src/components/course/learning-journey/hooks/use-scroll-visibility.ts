import { useEffect, useState } from "react";

const useScrollVisibility = (scrollSectionId: string, threshold = 80) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById(scrollSectionId);
    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      const shouldBeVisible = scrollContainer.scrollTop > threshold;
      setIsVisible(shouldBeVisible);
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollSectionId, threshold]);

  return isVisible;
};

export default useScrollVisibility;
