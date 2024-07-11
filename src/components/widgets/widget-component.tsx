import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { replaceVariablesInString } from "@/src/client-functions/client-utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../reusable/shadcn-ui/card";
import Skeleton from "../skeleton";
import SortableItem from "./widget-sortable";

const WidgetComponent = ({
  widget,
  isInTheStore,
}: {
  widget: Widget;
  isInTheStore: boolean;
}) => {
  const { t } = useTranslation("page");
  const [loading, setLoading] = useState(false);
  const [primaryData, setPrimaryData] = useState("");
  const [secondaryData, setSecondaryData] = useState("");
  const [variables, setVariables] = useState<string[]>([]);

  const secondaryDataWithVariables = t(secondaryData).split(/(\{[0-9]+\})/);

  const formatter = Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  useEffect(() => {
    setLoading(true);
    widget.promise().then((data) => {
      setPrimaryData(data.primaryData);
      setSecondaryData(data.secondaryData);
      setVariables(data.variables!);
      setLoading(false);
    });
  }, []);

  return (
    <SortableItem
      id={widget.identifier}
      isDragging={false}
      isInTheStore={isInTheStore}
    >
      <Card className="group !max-h-[120px] overflow-hidden transition-all duration-300 ease-in-out">
        {!loading ? (
          <>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-contrast">
                {t(widget.title)}
              </CardTitle>
              {widget.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-contrast">
                <span>{primaryData}</span>
              </div>

              <p className="text-xs text-muted-contrast">
                {replaceVariablesInString(t(secondaryData), variables)}
              </p>
            </CardContent>
          </>
        ) : (
          <div className="max-h-[120px] overflow-hidden">
            <Skeleton />
          </div>
        )}
      </Card>
    </SortableItem>
  );
};

export default WidgetComponent;
