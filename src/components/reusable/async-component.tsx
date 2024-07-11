import { useAsyncData } from "@/src/client-functions/client-utils/hooks";

type AsyncComponentProps<T> = {
  promise: () => Promise<T>;
  loaderElement?: JSX.Element;
  errorElement?: (error: InstanceType<typeof Error>) => JSX.Element;
  component: (data: T) => JSX.Element;
  refreshTrigger?: number | string;
};

function AsyncComponent<T>(props: AsyncComponentProps<T>) {
  const { loading, data, error } = useAsyncData(
    props.promise,
    props.refreshTrigger,
  );

  if (loading) return props.loaderElement || null;
  if (error && props.errorElement) return props.errorElement(error) || null;
  if (!data) return null;

  return props.component(data);
}

export default AsyncComponent;
