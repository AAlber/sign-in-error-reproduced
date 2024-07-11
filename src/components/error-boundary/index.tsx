import React from "react";
import { log } from "@/src/utils/logger/logger";
import ErrorDisplay from "./error-display";

type Props = React.PropsWithChildren<{
  onReset?: (e: Error, closeComponent: () => void) => Promise<void> | void;
  resetButtonText?: string;
}>;

type State = {
  hasError: boolean;
  theError?: Error;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, theError: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    log.error(error, errorInfo);
  }

  resetState() {
    this.setState({ hasError: false, theError: undefined });
  }

  render() {
    if (this.state.hasError && this.state.theError) {
      return (
        <ErrorDisplay
          resetButtonText={this.props.resetButtonText}
          onReset={() => {
            if (this.props.onReset) {
              this.props.onReset(this.state.theError!, () => this.resetState());
            } else this.resetState();
          }}
        />
      );
    }
    return this.props.children;
  }
}
