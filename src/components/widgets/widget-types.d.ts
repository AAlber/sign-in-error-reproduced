type WidgetDataResponse = {
  primaryData: string;
  secondaryData: string;
  variables?: string[];
};

type Widget = {
  identifier: string;
  title: string;
  icon: JSX.Element;
  promise: () => Promise<WidgetDataResponse>;
};
