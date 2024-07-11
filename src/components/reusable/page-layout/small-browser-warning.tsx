import { useTranslation } from "react-i18next";

export default function SmallBrowserWarning() {
  const { t } = useTranslation("page");
  return (
    <div className="milkblur-light pointer-events-none absolute z-50 flex h-screen w-screen flex-col items-center justify-center gap-2 bg-popover/50 text-center md:hidden">
       
      <svg
        data-icon="BrowserResize"
        aria-hidden="true"
        focusable="false"
        width="52"
        height="40"
        viewBox="0 0 52 40"
        className="bem-Svg h-20 w-20 text-destructive"
      >
        <path
          d="M26 32v-2h-4.586l6.293-6.293L32 19.414V24h2v-8h-8v2h4.586l-4.293 4.293L20 28.586V24h-2v8h8zM2 8h48V2H2v6zm0 30h48V10H2v28zM52 0v40H0V0h52zM11 6a1 1 0 100-2 1 1 0 000 2zM8 6a1 1 0 100-2 1 1 0 000 2zM4 5a1 1 0 112 0 1 1 0 01-2 0z"
          fill="currentColor"
        ></path>
      </svg>
      <h2 className="text-lg font-semibold text-contrast">
        {t("small-browser-warning")}
      </h2>
      <p className="mx-10 max-w-[400px] text-sm text-muted-contrast">
        {t("small-browser-warning-description")}
      </p>
    </div>
  );
}
