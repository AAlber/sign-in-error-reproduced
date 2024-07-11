import * as Sentry from "@sentry/nextjs";
import React from "react";
import { courseDrive } from "@/src/client-functions/client-drive/drive-builder";
import useCourse from "../course/zustand";
import Skeleton from "../skeleton";
import { useCourseDrive } from "./zustand";

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
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, theError: error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(error, errorInfo);
    console.log("error boundary - drive");
    Sentry.captureException(error, errorInfo);

    courseDrive.api.listFilesInDrive(
      { type: "course-drive", layerId: useCourse.getState().course.layer_id },
      useCourseDrive.getState().r2Objects.length > 0,
    );
  }

  resetState() {
    this.setState({ hasError: false, theError: undefined });
  }

  render() {
    if (this.state.hasError && this.state.theError) {
      return <Skeleton />;
    }
    return this.props.children;
  }
}
