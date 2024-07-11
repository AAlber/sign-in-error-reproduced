import { Dimensions } from "../../dimensions";

export const ItemsSection: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
      style={{ width: Dimensions.Navigation.Primary.Width }}
      className="flex flex-col items-center"
    >
      {children}
    </div>
  );
};
