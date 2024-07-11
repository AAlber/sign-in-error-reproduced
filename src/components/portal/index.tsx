/* eslint-disable react/display-name */
import React, { type PropsWithChildren, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  elementId: string;
  portalId: string;
}

const Portal: React.FC<PropsWithChildren<PortalProps>> = (props) => {
  const [el] = useState(document.createElement("div"));
  const [mount] = useState(
    props.elementId === "body"
      ? document.querySelector("body")
      : document.getElementById(props.elementId),
  );

  useEffect(() => {
    el.setAttribute("id", props.portalId);
    mount?.appendChild(el);
    return () => {
      mount?.removeChild(el);
    };
  }, []);

  if (!mount) return null;
  return createPortal(props.children, el);
};

/**
 * @param node The component to mount
 * @param parentId the id of the element to append the component to, defaults to document body
 * @param portalId the id of the created portal element, we can create multiple portals as long as they have different ids
 * @param delayMountMs set delay for when trying to mount to a transitioning component
 * @returns JSX.Element
 */

export function withPortal<T extends object>(
  node: React.FC<T>,
  parentId = "body",
  portalId = "fuxam_root_portal",
  delayMountMs = 10,
): React.FC<T> {
  return (props) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      const timeout = setTimeout(() => {
        setIsMounted(true);
      }, delayMountMs);

      return () => {
        clearTimeout(timeout);
      };
    }, [isMounted]);

    if (!isMounted) return null;
    return (
      <Portal elementId={parentId} portalId={portalId}>
        {React.createElement(node, props)}
      </Portal>
    );
  };
}
