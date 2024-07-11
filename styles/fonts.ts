import localFont from "next/font/local";

export const geist = localFont({
  src: [
    { path: "../public/fonts/Geist/Geist-Thin.otf", weight: "100" },
    { path: "../public/fonts/Geist/Geist-UltraLight.otf", weight: "200" },
    { path: "../public/fonts/Geist/Geist-Light.otf", weight: "300" },
    { path: "../public/fonts/Geist/Geist-Regular.otf", weight: "400" },
    { path: "../public/fonts/Geist/Geist-Medium.otf", weight: "500" },
    { path: "../public/fonts/Geist/Geist-SemiBold.otf", weight: "600" },
    { path: "../public/fonts/Geist/Geist-Bold.otf", weight: "700" },
    { path: "../public/fonts/Geist/Geist-Black.otf", weight: "800" },
    { path: "../public/fonts/Geist/Geist-UltraBlack.otf", weight: "900" },
  ],
  display: "swap",
  variable: "--font-geist-sans",
});
