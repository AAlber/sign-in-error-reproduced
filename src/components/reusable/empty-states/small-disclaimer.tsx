import PropTypes from "prop-types";
import React from "react";
import { useTranslation } from "react-i18next";

const SmallEmptyStateDisclaimer = ({
  icon: Icon,
  header,
  message,
  children,
}) => {
  const { t } = useTranslation("page");

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-2 px-2 text-center">
      {Icon && <Icon className="h-6 w-6 text-muted-contrast" />}
      <div className="flex flex-col text-center">
        <h2 className="font-medium text-contrast">{t(header)}</h2>
        <p className="text-sm text-muted-contrast">{t(message)}</p>
      </div>
      {children}
    </section>
  );
};

SmallEmptyStateDisclaimer.propTypes = {
  icon: PropTypes.elementType,
  header: PropTypes.node.isRequired,
  message: PropTypes.node.isRequired,
  children: PropTypes.node,
};

SmallEmptyStateDisclaimer.defaultProps = {
  children: null,
};

export default SmallEmptyStateDisclaimer;
