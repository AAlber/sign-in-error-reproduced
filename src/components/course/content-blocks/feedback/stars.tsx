import clsx from "clsx";
import { StarIcon } from "lucide-react";
import React, { useMemo } from "react";

interface RatingProps {
  score: number;
  onClick?: (idx: number) => void;
}

const Stars: React.FC<RatingProps> = (props) => {
  const { onClick, score } = props;

  /**
   * returns an array of boolean
   * example: [true, true, true, false, false]
   * this would later on equate to 3 out of 5 stars
   */
  const filled = useMemo(() => {
    const arr = new Array<boolean>(5).fill(false);
    for (let i = 0; i < score; i++) {
      if (!arr[i]) {
        arr.pop();
        arr.unshift(true);
      }
    }

    return arr;
  }, [score]);

  const handleClick = (index: number) => () => {
    onClick?.(index);
  };

  return (
    <span className="inline-flex space-x-1 pb-1">
      {filled.map((isFilled, idx) => {
        return (
          <button
            key={idx}
            onClick={handleClick(idx)}
            disabled={!onClick}
            className={clsx(
              !!onClick &&
                "transition-transform hover:scale-150 active:scale-110",
            )}
          >
            <StarIcon
              className={clsx(
                "h-4 w-4",
                isFilled
                  ? "fill-primary text-primary"
                  : "fill-primary text-primary opacity-20",
              )}
            />
          </button>
        );
      })}
    </span>
  );
};

export default Stars;
