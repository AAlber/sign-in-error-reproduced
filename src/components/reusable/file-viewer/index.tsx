import { useTheme } from "next-themes";
import { useEffect, useRef } from "react";
import { proxyCloudflareReadRequest } from "@/src/client-functions/client-cloudflare/utils";
import useThemeStore from "../../dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import useFileViewer from "./zustand";

type FileViewerProps = {
  url: string;
  secure?: boolean;
};

const toolsInSecureMode = ["zoom", "outline", "thumbnails", "search"];
const defaultTools = [
  "zoom",
  "export",
  "print",
  "outline",
  "thumbnails",
  "search",
];

export default function FileViewer({ url, secure = false }: FileViewerProps) {
  const containerRef = useRef(null);
  const { resolvedTheme } = useTheme();
  const { setPSPDFKit } = useFileViewer();
  const isDark = resolvedTheme === "dark";
  const { instiTheme } = useThemeStore();

  const getCSSPath = (theme: string) => {
    switch (theme) {
      case "blue":
        if (isDark) return "/styles/blue-dark.css";
        return "/styles/blue.css";
      case "green":
        if (isDark) return "/styles/green-dark.css";
        return "/styles/green.css";
      case "red":
        if (isDark) return "/styles/red-dark.css";
        return "/styles/red.css";
      case "yellow":
        if (isDark) return "/styles/yellow-dark.css";
        return "/styles/yellow.css";
      case "violet":
        if (isDark) return "/styles/violet-dark.css";
        return "/styles/violet.css";
      case "orange":
        if (isDark) return "/styles/orange-dark.css";
        return "/styles/orange.css";
      case "classic":
        if (isDark) return "/styles/classic-dark.css";
        return "/styles/classic.css";
      case "gray":
        if (isDark) return "/styles/gray-dark.css";
        return "/styles/gray.css";
      case "rose":
        if (isDark) return "/styles/rose-dark.css";
        return "/styles/rose.css";
      default:
        if (isDark) return "/styles/blue-dark.css";
        return "/styles/blue.css";
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    let PSPDFKit;

    (async function () {
      PSPDFKit = await import("pspdfkit");
      const cssPath = getCSSPath(instiTheme);

      if (PSPDFKit && container) {
        PSPDFKit.unload(container);
      }
      const finalUrl = await proxyCloudflareReadRequest(url);
      const instance = await PSPDFKit.load({
        licenseKey: process.env.NEXT_PUBLIC_PSPDFKIT_LICENSE,
        container,
        document: finalUrl,
        baseUrl: `${window.location.protocol}//${window.location.host}/`,
        theme: isDark ? PSPDFKit.Theme.DARK : PSPDFKit.Theme.LIGHT,
        disableTextSelection: secure,
        initialViewState: new PSPDFKit.ViewState({
          allowPrinting: !secure,
          zoom: PSPDFKit.ZoomMode.FIT_TO_WIDTH,
        }),
        styleSheets: [cssPath],
      });

      const newIcons = {
        "zoom-in": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-in"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
        "zoom-out": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zoom-out"><circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/></svg>`,
        "export-pdf": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
        print: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-printer"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/></svg>`,
        search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
        "sidebar-thumbnails": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-layout-grid"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>`,
        "sidebar-document-outline": `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rows-4"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M21 7.5H3"/><path d="M21 12H3"/><path d="M21 16.5H3"/></svg>`,
      };

      const items = instance.toolbarItems.map((item) => {
        if (newIcons[item.type]) {
          return { ...item, icon: newIcons[item.type] };
        }
        return item;
      });

      setPSPDFKit(instance);

      console.log("instance", secure);
      instance.setToolbarItems(
        items.filter((item) =>
          [...(secure ? toolsInSecureMode : defaultTools)].some((i) =>
            item.type.includes(i),
          ),
        ),
      );
    })();

    return () => PSPDFKit && PSPDFKit.unload(container);
  }, [resolvedTheme, url, secure]);

  return <div ref={containerRef} style={{ height: "100vh" }} />;
}
