import ChannelListPlaceholder from "./list-placeholder";

const LoadingIndicator = () => (
  <div className="h-full bg-foreground">
    <ChannelListPlaceholder iterations={4} />
  </div>
);

export default LoadingIndicator;
