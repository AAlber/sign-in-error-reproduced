import useThemeStore from "../components/dashboard/navigation/primary-sidebar/user-menu/theme-switcher/zustand";
import { toast } from "../components/reusable/toaster/toast";
import api from "../pages/api/api";
import useUser from "../zustand/user";

export const updateIntitutionTheme = async (
  paletteName: Theme["name"],
  customTheme?: string,
) => {
  const response = await fetch(api.updateInstitutionTheme, {
    method: "PUT",
    body: JSON.stringify({ paletteName, customTheme }),
  });

  if (!response.ok) {
    toast.responseError({ response });
    return null;
  }

  const { user, setUser } = useUser.getState();

  setUser({
    institution: {
      ...user.institution!,
      ...(customTheme ? { customThemeHEX: customTheme } : {}),
      theme: paletteName,
    },
  });

  const res = await response.json();
  toast.success("toast_theme_settings_sucess", {
    description: "toast_theme_settings_sucess_description",
  });

  return res;
};

export const setCSSClasses = (color: string) => {
  const root = document.querySelector(".main-div");
  if (!root) return;

  const themeClasses = Array.from(root.classList).filter((cls) =>
    cls.startsWith("theme-"),
  );
  themeClasses.forEach((cls) => root.classList.remove(cls));
  root.classList.add(`theme-${color}`);
};

export const verifyContrast = (color: string) => {
  switch (color) {
    case "zinc":
      return true;
    case "slate":
      return true;
    case "stone":
      return true;
    case "gray":
      return true;
    case "yellow":
      return true;
    case "green":
      return true;
    case "custom":
      if (isWhiteHSL(hsl())) return true;
    default:
      return false;
  }
};

export const convertHexToHSL = (hex: string): string => {
  if (!hex) return "0 0% 0%";
  const r: number =
    hex.length === 4
      ? parseInt("0x" + hex[1] + hex[1])
      : parseInt("0x" + hex[1] + hex[2]);
  const g: number =
    hex.length === 4
      ? parseInt("0x" + hex[2] + hex[2])
      : parseInt("0x" + hex[3] + hex[4]);
  const b: number =
    hex.length === 4
      ? parseInt("0x" + hex[3] + hex[3])
      : parseInt("0x" + hex[5] + hex[6]);

  const rNormalized: number = r / 255;
  const gNormalized: number = g / 255;
  const bNormalized: number = b / 255;

  const cmin: number = Math.min(rNormalized, gNormalized, bNormalized);
  const cmax: number = Math.max(rNormalized, gNormalized, bNormalized);
  const delta: number = cmax - cmin;

  let h = 0;
  let s = 0;
  let l = 0;

  if (delta === 0) {
    h = 0;
  } else if (cmax === rNormalized) {
    h = ((gNormalized - bNormalized) / delta) % 6;
  } else if (cmax === gNormalized) {
    h = (bNormalized - rNormalized) / delta + 2;
  } else {
    h = (rNormalized - gNormalized) / delta + 4;
  }

  h = Math.round(h * 60);

  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;

  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  //return only the numbers and not string
  return `${h} ${s} ${l}`;
};

function isWhiteHSL(hsl: string) {
  const hslArray = hsl.split(" ");
  return Number(hslArray[2]) > 50;
}

function isDarkHSL(hsl: string) {
  const hslArray = hsl.split(" ");
  return Number(hslArray[2]) < 50;
}

const background = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${hslArray[1]}% 98%`;
};

const contrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${hslArray[1]}% 4.1%`;
};

const muted = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 42} ${Number(hslArray[1]) - 69}% 88%`;
};

const mutedContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 38} ${Number(hslArray[1]) - 74.4}% 36.1%`;
};

const border = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 42} ${Number(hslArray[1]) - 70}% 88%`;
};

const primary = (hsl: string) => {
  const isWhite = isWhiteHSL(hsl);
  const hslArray = hsl.split(" ");
  if (isWhite) {
    return `${hslArray[0]} ${hslArray[1]}% ${
      Number(hslArray[2]?.split("%")[0]) - Number(hslArray[2]) / 2
    }%`;
  }
  return `${hslArray[0]} ${hslArray[1]}% ${hslArray[2]}%`;
};

const primaryContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 38} ${Number(hslArray[1]) - 11.9}% 9.1%`;
};

const secondaryContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 42} ${Number(hslArray[1]) - 44}% 11%`;
};

const accent = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0])} ${Number(hslArray[1]) - 24}% 87.9%`;
};

const darkBackground = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${Number(hslArray[1]) - 73}% 8%`;
};

const darkContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${Number(hslArray[1]) - 72.1}% 97.8%`;
};

const darkForeground = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${Number(hslArray[1]) - 69}% 9.1%`;
};

const darkSecondary = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 12} ${Number(hslArray[1]) - 76.8}% 21.1%`;
};

const darkMutedContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 22} ${Number(hslArray[1]) - 67.9}% 76%`;
};

const darkPrimary = (hsl: string) => {
  const isDark = isDarkHSL(hsl);
  const hslArray = hsl.split(" ");
  if (isDark) {
    const lightness = Number(hslArray[2]?.split("%")[0]);
    const newLightness = lightness + (100 - lightness) / 2; // Aumentar a luminosidade
    return `${hslArray[0]} ${hslArray[1]}% ${newLightness}%`;
  }
  return `${hslArray[0]} ${hslArray[1]}% ${hslArray[2]}%`;
};

const darkPrimaryContrast = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 2} ${Number(hslArray[1]) + 17}% 98%`;
};

const darkAccent = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${hslArray[0]} ${Number(hslArray[1]) - 52}% 24.1%`;
};

const darkMuted = (hsl: string) => {
  const hslArray = hsl.split(" ");
  return `${Number(hslArray[0]) - 12} ${Number(hslArray[1]) - 76.8}% 29.1%`;
};

export const setCustomCSSVars = (color: string, isDark: boolean) => {
  const { instiTheme } = useThemeStore.getState();
  const hsl = convertHexToHSL(color);
  const theme = document.getElementsByClassName("main-div")[0] as HTMLElement;

  if (instiTheme === "custom") {
    if (theme && !isDark) {
      theme.style.setProperty("--background", background(hsl));
      theme.style.setProperty("--contrast", contrast(hsl));
      theme.style.setProperty("--foreground", `0 0% 100%`);
      theme.style.setProperty("--muted", muted(hsl));
      theme.style.setProperty("--muted-contrast", mutedContrast(hsl));
      theme.style.setProperty("--card", `0 0% 100%`);
      theme.style.setProperty("--card-contrast", contrast(hsl));
      theme.style.setProperty("--popover", `0 0% 100%`);
      theme.style.setProperty("--popover-contrast", contrast(hsl));
      theme.style.setProperty("--border", border(hsl));
      theme.style.setProperty("--input", border(hsl));
      theme.style.setProperty("--primary", primary(hsl));
      theme.style.setProperty("--primary-contrast", primaryContrast(hsl));
      theme.style.setProperty("--secondary", muted(hsl));
      theme.style.setProperty("--secondary-contrast", secondaryContrast(hsl));
      theme.style.setProperty("--accent", accent(hsl));
      theme.style.setProperty("--accent-contrast", secondaryContrast(hsl));
      theme.style.setProperty("--ring", primary(hsl));
      theme.style.setProperty("--destructive", `0 84.2% 55%`);
      theme.style.setProperty("--destructive-contrast", `360 100% 15%`);
      theme.style.setProperty("--warning", `50 98% 85%`);
      theme.style.setProperty("--warning-contrast", `50 31% 15%`);
      theme.style.setProperty("--positive", `156 71.6% 40.9%`);
      theme.style.setProperty("--positive-contrast", `164 85.7% 16.5%`);
    }
    if (isDark && theme) {
      theme.style.setProperty("--background", darkBackground(hsl));
      theme.style.setProperty("--contrast", darkContrast(hsl));
      theme.style.setProperty("--foreground", darkForeground(hsl));
      theme.style.setProperty("--muted", darkMuted(hsl));
      theme.style.setProperty("--muted-contrast", darkMutedContrast(hsl));
      theme.style.setProperty("--card", darkForeground(hsl));
      theme.style.setProperty("--card-contrast", darkContrast(hsl));
      theme.style.setProperty("--popover", darkForeground(hsl));
      theme.style.setProperty("--popover-contrast", darkContrast(hsl));
      theme.style.setProperty("--border", darkSecondary(hsl));
      theme.style.setProperty("--input", darkSecondary(hsl));
      theme.style.setProperty("--primary", darkPrimary(hsl));
      theme.style.setProperty("--primary-contrast", darkPrimaryContrast(hsl));
      theme.style.setProperty("--secondary", darkSecondary(hsl));
      theme.style.setProperty("--secondary-contrast", darkContrast(hsl));
      theme.style.setProperty("--accent", darkAccent(hsl));
      theme.style.setProperty("--accent-contrast", darkContrast(hsl));
      theme.style.setProperty("--ring", darkPrimary(hsl));
      theme.style.setProperty("--destructive", `0 65% 45%`);
      theme.style.setProperty("--destructive-contrast", `360 89% 93%`);
      theme.style.setProperty("--warning", `41 96% 25%`);
      theme.style.setProperty("--warning-contrast", `41 100% 93%`);
      theme.style.setProperty("--positive", `161 93.5% 45.4%`);
      theme.style.setProperty("--positive-contrast", `152 76% 80.4%`);
    }
  }
};

export const removeCustomCSSVars = () => {
  const theme = document.getElementsByClassName("main-div")[0] as HTMLElement;
  if (theme) {
    theme.style.removeProperty("--background");
    theme.style.removeProperty("--contrast");
    theme.style.removeProperty("--foreground");
    theme.style.removeProperty("--muted");
    theme.style.removeProperty("--muted-contrast");
    theme.style.removeProperty("--card");
    theme.style.removeProperty("--card-contrast");
    theme.style.removeProperty("--popover");
    theme.style.removeProperty("--popover-contrast");
    theme.style.removeProperty("--border");
    theme.style.removeProperty("--input");
    theme.style.removeProperty("--primary");
    theme.style.removeProperty("--primary-contrast");
    theme.style.removeProperty("--secondary");
    theme.style.removeProperty("--secondary-contrast");
    theme.style.removeProperty("--accent");
    theme.style.removeProperty("--accent-contrast");
    theme.style.removeProperty("--ring");
    theme.style.removeProperty("--destructive");
    theme.style.removeProperty("--destructive-contrast");
    theme.style.removeProperty("--warning");
    theme.style.removeProperty("--warning-contrast");
    theme.style.removeProperty("--positive");
    theme.style.removeProperty("--positive-contrast");
  }
};

const hsl = () => {
  const { customTheme } = useThemeStore.getState();
  return convertHexToHSL(customTheme as any);
};

export const themes = [
  {
    name: "blue",
    label: "Default",
    activeColor: {
      light: "221.2 83.2% 53.3%",
      dark: "217.2 91.2% 59.8%",
    },
    cssVars: {
      light: {
        background: "221.2 83.2% 98%",
        foreground: "0 0% 100%",
        contrast: "222.2 84% 4.9%",
        card: "0 0% 100%",
        "card-contrast": "222.2 84% 4.9%",
        popover: "0 0% 100%",
        "popover-contrast": "222.2 84% 4.9%",
        primary: "221.2 83.2% 53.3%",
        "primary-contrast": "222.2 84% 7.5%",
        secondary: "210 40% 96.1%",
        "secondary-contrast": "222.2 47.4% 11.2%",
        muted: "210 40% 74.9%",
        "muted-contrast": "215.4 16.3% 46.9%",
        accent: "210 40% 89%",
        "accent-contrast": "222.2 47.4% 11.2%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "214.3 31.8% 91.4%",
        input: "214.3 31.8% 91.4%",
        ring: "221.2 83.2% 53.3%",
      },
      dark: {
        foreground: "222, 59%, 10%",
        background: "222.2 84% 7.5%",
        contrast: "210 40% 98%",
        card: "222.2 84% 7.5%",
        "card-contrast": "210 40% 98%",
        popover: "222.2 84% 7.5%",
        "popover-contrast": "210 40% 98%",
        primary: "217.2 91.2% 59.8%",
        "primary-contrast": "221.2 83.2% 98%",
        secondary: "217.2 32.6% 19.5%",
        "secondary-contrast": "210 40% 98%",
        muted: "217.2 32.6% 19.5%",
        "muted-contrast": "215 20.2% 65.1%",
        accent: "217.2 32.6% 29.5%",
        "accent-contrast": "210 40% 98%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "217.2 32.6% 19.5%",
        input: "217.2 32.6% 19.5%",
        ring: "224.3 76.3% 48%",
      },
    },
  },
  {
    name: "classic",
    label: "Original",
    activeColor: {
      light: "185 43% 19%",
      dark: "185 43% 29%",
    },
    cssVars: {
      light: {
        background: "185 43% 98%",
        foreground: "0 0% 100%",
        contrast: "0 0% 3.9%",
        card: "0 0% 100%",
        "card-contrast": "0 0% 3.9%",
        popover: "0 0% 100%",
        "popover-contrast": "0 0% 3.9%",
        primary: "185 43% 19%",
        "primary-contrast": "186 37% 7%",
        secondary: "185 5% 94%",
        "secondary-contrast": "185 43% 19%",
        muted: "0 0% 74.9%",
        "muted-contrast": "0 0% 45.1%",
        accent: "185 5% 88%",
        "accent-contrast": "185 43% 19%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "185 5% 92%",
        input: "185 5% 92%",
        ring: "185 43% 19%",
      },
      dark: {
        foreground: "186 37% 10.5%",
        background: "186 37% 7%",
        contrast: "0 0% 98%",
        card: "186 37% 7%",
        "card-contrast": "0 0% 98%",
        popover: "186 37% 7%",
        "popover-contrast": "0 0% 98%",
        primary: "185 43% 35%",
        "primary-contrast": "185 43% 98%",
        secondary: "185 12% 20%",
        "secondary-contrast": "0 0% 98%",
        muted: "185 12% 20%",
        "muted-contrast": "185 5% 63.9%",
        accent: "185 10% 24%",
        "accent-contrast": "0 0% 98%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "185 12% 20%",
        input: "185 12% 20%",
        ring: "185 43% 29%",
      },
    },
  },
  {
    name: "gray",
    label: "Ghost",
    activeColor: {
      light: "220 8.9% 46.1%",
      dark: "215 13.8% 34.1%",
    },
    cssVars: {
      light: {
        background: "220.9 39.3% 98%",
        foreground: "0 0% 100%",
        contrast: "224 71.4% 4.1%",
        card: "0 0% 100%",
        "card-contrast": "224 71.4% 4.1%",
        popover: "0 0% 100%",
        "popover-contrast": "224 71.4% 4.1%",
        primary: "220.9 39.3% 11%",
        "primary-contrast": "220.9 39.3% 98%",
        secondary: "220 14.3% 95.9%",
        "secondary-contrast": "220.9 39.3% 11%",
        muted: "220 14.3% 74.9%",
        "muted-contrast": "220 8.9% 46.1%",
        accent: "220 14.3% 88.9%",
        "accent-contrast": "220.9 39.3% 11%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "220 13% 91%",
        input: "220 13% 91%",
        ring: "224 71.4% 4.1%",
        radius: "0.35rem",
      },
      dark: {
        foreground: "0 0% 8%",
        background: "0 0% 5%",
        contrast: "0 0% 100%",
        card: "0 0% 15%",
        "card-contrast": "0 0% 100%",
        popover: "0 0% 12%",
        "popover-contrast": "0 0% 100%",
        primary: "0 0% 100%",
        "primary-contrast": "0 0% 100%",
        secondary: "0 0% 40%",
        "secondary-contrast": "0 0% 100%",
        muted: "0 0% 30%%",
        "muted-contrast": "0 0% 90%",
        accent: "0 0% 20%",
        "accent-contrast": "0 0% 100%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "0 0% 20%",
        input: "0 0% 25%",
        ring: "0 0% 60%",
      },
    },
  },
  {
    name: "red",
    label: "Scarlet",
    activeColor: {
      light: "0 72.2% 50.6%",
      dark: "0 72.2% 50.6%",
    },
    cssVars: {
      light: {
        background: "0 72.2% 98%",
        foreground: "0 0% 100%",
        contrast: "0 0% 3.9%",
        card: "0 0% 100%",
        "card-contrast": "0 0% 3.9%",
        popover: "0 0% 100%",
        "popover-contrast": "0 0% 3.9%",
        primary: "0 72.2% 50.6%",
        "primary-contrast": "0 0% 8.9%",
        secondary: "0 0% 96.1%",
        "secondary-contrast": "0 0% 9%",
        muted: "0 0% 74.9%",
        "muted-contrast": "0 0% 45.1%",
        accent: "0 20% 86.1%",
        "accent-contrast": "0 0% 9%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "0 0% 89.8%",
        input: "0 0% 89.8%",
        ring: "0 72.2% 50.6%",
        radius: "0.4rem",
      },
      dark: {
        foreground: "0 14.3% 9.1%",
        background: "0 10% 7%",
        contrast: "0 9.1% 97.8%",
        card: "0 14.3% 9.1%",
        "card-contrast": "0 9.1% 97.8%",
        popover: "0 14.3% 9.1%",
        "popover-contrast": "0 9.1% 97.8%",
        primary: "0 72.2% 50.6%",
        "primary-contrast": "0 72.2% 98%",
        secondary: "355 6.5% 21.1%",
        "secondary-contrast": "0 9.1% 97.8%",
        muted: "355 6.5% 21.1%",
        "muted-contrast": "350 5.4% 63.9%",
        accent: "0 22.2% 26.1%",
        "accent-contrast": "0 9.1% 97.8%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "355 6.5% 21.1%",
        input: "355 6.5% 21.1%",
        ring: "0 80% 30%",
      },
    },
  },
  {
    name: "rose",
    label: "Fleur",
    activeColor: {
      light: "346.8 77.2% 49.8%",
      dark: "346.8 77.2% 49.8%",
    },
    cssVars: {
      light: {
        background: "346.8 77.2% 98%",
        foreground: "0 0% 100%",
        contrast: "240 10% 3.9%",
        card: "0 0% 100%",
        "card-contrast": "240 10% 3.9%",
        popover: "0 0% 100%",
        "popover-contrast": "240 10% 3.9%",
        primary: "346.8 77.2% 49.8%",
        "primary-contrast": "20 14.3% 9.1%",
        secondary: "240 4.8% 95.9%",
        "secondary-contrast": "240 5.9% 10%",
        muted: "240 4.8% 74.9%",
        "muted-contrast": "240 3.8% 46.1%",
        accent: "346.8 77.2% 90.9%",
        "accent-contrast": "240 5.9% 10%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "346.8 77.2% 49.8%",
        radius: "0.5rem",
      },
      dark: {
        foreground: "345 15% 9.1%",
        background: "345 20% 7%",
        contrast: "345 10% 95%",
        popover: "345 15% 9.1%",
        "popover-contrast": "345 10% 95%",
        card: "345 15% 9.1%",
        "card-contrast": "345 10% 95%",
        primary: "346.8 77.2% 49.8%",
        "primary-contrast": "346.8 77.2% 98%",
        secondary: "345 10% 25%",
        "secondary-contrast": "345 10% 95%",
        muted: "345 10% 20%",
        "muted-contrast": "330 12% 60%",
        accent: "345 20% 25%",
        "accent-contrast": "345 10% 95%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "345 10% 20%",
        input: "345 10% 20%",
        ring: "346.8 60% 50%",
      },
    },
  },
  {
    name: "orange",
    label: "Amber",
    activeColor: {
      light: "24.6 95% 53.1%",
      dark: "20.5 90.2% 48.2%",
    },
    cssVars: {
      light: {
        background: "24.6 95% 98%",
        foreground: "0 0% 100%",
        contrast: "20 14.3% 4.1%",
        card: "0 0% 100%",
        "card-contrast": "20 14.3% 4.1%",
        popover: "0 0% 100%",
        "popover-contrast": "20 14.3% 4.1%",
        primary: "24.6 95% 53.1%",
        "primary-contrast": "20 14.3% 10.1%",
        secondary: "60 4.8% 95.9%",
        "secondary-contrast": "24 9.8% 10%",
        muted: "60 4.8% 74.9%",
        "muted-contrast": "25 5.3% 44.7%",
        accent: "24.6 95% 90.3%",
        "accent-contrast": "24 9.8% 10%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "20 5.9% 90%",
        input: "20 5.9% 90%",
        ring: "24.6 95% 53.1%",
        radius: "0.95rem",
      },
      dark: {
        foreground: "25 14.3% 9.1%",
        background: "25 10% 8%",
        contrast: "25 9.1% 97.8%",
        card: "25 14.3% 9.1%",
        "card-contrast": "25 9.1% 97.8%",
        popover: "25 14.3% 9.1%",
        "popover-contrast": "25 9.1% 97.8%",
        primary: "20.5 90.2% 48.2%",
        "primary-contrast": "24.6 95% 98%",
        secondary: "20 6.5% 21.1%",
        "secondary-contrast": "25 9.1% 97.8%",
        muted: "20 6.5% 21.1%",
        "muted-contrast": "30 5.4% 63.9%",
        accent: "20 6.5% 24.1%",
        "accent-contrast": "25 9.1% 97.8%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "20 6.5% 21.1%",
        input: "20 6.5% 21.1%",
        ring: "20.5 90.2% 48.2%",
      },
    },
  },
  {
    name: "green",
    label: "Emerald",
    activeColor: {
      light: "142.1 76.2% 36.3%",
      dark: "142.1 70.6% 45.3%",
    },
    cssVars: {
      light: {
        background: "142.1 76.2% 98%",
        foreground: "0 0% 100%",
        contrast: "240 10% 3.9%",
        card: "0 0% 100%",
        "card-contrast": "240 10% 3.9%",
        popover: "0 0% 100%",
        "popover-contrast": "240 10% 3.9%",
        primary: "142.1 76.2% 36.3%",
        "primary-contrast": "142 4.3% 11.1%",
        secondary: "240 4.8% 95.9%",
        "secondary-contrast": "240 5.9% 10%",
        muted: "240 4.8% 74.9%",
        "muted-contrast": "240 3.8% 46.1%",
        accent: "142.1 42.2% 86%",
        "accent-contrast": "240 5.9% 10%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "240 5.9% 90%",
        input: "240 5.9% 90%",
        ring: "142.1 76.2% 36.3%",
      },
      dark: {
        foreground: "0 0% 11.1%",
        background: "0 0% 9.1%",
        contrast: "0 0% 95%",
        popover: "0 0.3% 11.1%",
        "popover-contrast": "0 0% 95%",
        card: "240 14.3% 11.1%",
        "card-contrast": "0 0% 95%",
        primary: "142.1 70.6% 45.3%",
        "primary-contrast": "142.1 76.2% 98%",
        secondary: "142 4.7% 23%",
        "secondary-contrast": "0 0% 98%",
        muted: "142 4.7% 23%",
        "muted-contrast": "0 0% 68.9%",
        accent: "142 4.7% 25%",
        "accent-contrast": "0 0% 98%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "142 4.7% 23%",
        input: "142 4.7% 23%",
        ring: "142.4 71.8% 29.2%",
      },
    },
  },

  {
    name: "yellow",
    label: "Citrine",
    activeColor: {
      light: "47.9 95.8% 53.1%",
      dark: "47.9 95.8% 53.1%",
    },
    cssVars: {
      light: {
        background: "44 100% 98%",
        foreground: "0 0% 100%",
        contrast: "20 14.3% 4.1%",
        card: "0 0% 100%",
        "card-contrast": "20 14.3% 4.1%",
        popover: "0 0% 100%",
        "popover-contrast": "20 14.3% 4.1%",
        primary: "47.9 95.8% 53.1%",
        "primary-contrast": "20 14.3% 9.1%",
        secondary: "60 4.8% 95.9%",
        "secondary-contrast": "24 9.8% 10%",
        muted: "60 4.8% 74.9%",
        "muted-contrast": "25 5.3% 44.7%",
        accent: "44 70% 85%",
        "accent-contrast": "24 9.8% 10%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "20 5.9% 90%",
        input: "20 5.9% 90%",
        ring: "20 14.3% 4.1%",
        radius: "0.95rem",
      },
      dark: {
        foreground: "30 14.3% 9.1%",
        background: "30 10% 8%",
        contrast: "60 9.1% 97.8%",
        card: "20 14.3% 9.1%",
        "card-contrast": "60 9.1% 97.8%",
        popover: "20 14.3% 9.1%",
        "popover-contrast": "60 9.1% 97.8%",
        primary: "47.9 95.8% 53.1%",
        "primary-contrast": "44 100% 98%",
        secondary: "12 6.5% 21.1%",
        "secondary-contrast": "60 9.1% 97.8%",
        muted: "12 6.5% 21.1%",
        "muted-contrast": "24 5.4% 63.9%",
        accent: "30 14.3% 23.5%",
        "accent-contrast": "60 9.1% 97.8%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "12 6.5% 21.1%",
        input: "12 6.5% 21.1%",
        ring: "35.5 91.7% 32.9%",
      },
    },
  },
  {
    name: "violet",
    label: "Amethyst",
    activeColor: {
      light: "262.1 83.3% 57.8%",
      dark: "263.4 70% 50.4%",
    },
    cssVars: {
      light: {
        background: "262.1 83.3% 98%",
        foreground: "0 0% 100%",
        contrast: "224 71.4% 4.1%",
        card: "0 0% 100%",
        "card-contrast": "224 71.4% 4.1%",
        popover: "0 0% 100%",
        "popover-contrast": "224 71.4% 4.1%",
        primary: "262.1 83.3% 57.8%",
        "primary-contrast": "224 71.4% 9.1%",
        secondary: "220 14.3% 95.9%",
        "secondary-contrast": "220.9 39.3% 11%",
        muted: "220 14.3% 74.9%",
        "muted-contrast": "220 8.9% 46.1%",
        accent: "262.1 53.3% 87.9%",
        "accent-contrast": "220.9 39.3% 11%",
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
        border: "220 13% 91%",
        input: "220 13% 91%",
        ring: "262.1 83.3% 57.8%",
      },
      dark: {
        foreground: "262 14.3% 9.1%",
        background: "262 10% 8%",
        contrast: "262 9.1% 97.8%",
        card: "262 14.3% 9.1%",
        "card-contrast": "262 9.1% 97.8%",
        popover: "262 14.3% 9.1%",
        "popover-contrast": "262 9.1% 97.8%",
        primary: "270 95.8% 53.1%",
        "primary-contrast": "260 100% 98%",
        secondary: "250 6.5% 21.1%",
        "secondary-contrast": "262 9.1% 97.8%",
        muted: "250 6.5% 21.1%",
        "muted-contrast": "240 15.4% 63.9%",
        accent: "250 6.5% 24.1%",
        "accent-contrast": "262 9.1% 97.8%",
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
        border: "250 6.5% 21.1%",
        input: "250 6.5% 21.1%",
        ring: "275 91.7% 32.9%",
      },
    },
  },
  {
    name: "custom",
    label: "Custom",
    activeColor: {
      light: primary(hsl()),
      dark: darkPrimary(hsl()),
    },
    cssVars: {
      light: {
        background: background(hsl()),
        contrast: contrast(hsl()),
        foreground: "0 0% 100%",
        muted: muted(hsl()),
        "muted-contrast": mutedContrast(hsl()),
        card: "0 0% 100%",
        "card-contrast": contrast(hsl()),
        popover: "0 0% 100%",
        "popover-contrast": contrast(hsl()),
        border: border(hsl()),
        input: border(hsl()),
        primary: primary(hsl()),
        "primary-contrast": primaryContrast(hsl()),
        secondary: muted(hsl()),
        "secondary-contrast": secondaryContrast(hsl()),
        accent: accent(hsl()),
        "accent-contrast": secondaryContrast(hsl()),
        ring: primary(hsl()),
        destructive: "0 84.2% 60.2%",
        "destructive-contrast": "0 0% 98%",
        warning: "50 98% 85%",
        "warning-contrast": "50 31% 15% ",
        positive: "156 71.6% 40.9%",
        "positive-contrast": "164 85.7% 16.5%",
      },
      dark: {
        background: darkBackground(hsl()),
        contrast: darkContrast(hsl()),
        foreground: darkForeground(hsl()),
        muted: darkSecondary(hsl()),
        "muted-contrast": darkMutedContrast(hsl()),
        card: darkForeground(hsl()),
        "card-contrast": darkContrast(hsl()),
        popover: darkForeground(hsl()),
        "popover-contrast": darkContrast(hsl()),
        border: darkSecondary(hsl()),
        input: darkSecondary(hsl()),
        primary: darkPrimary(hsl()),
        "primary-contrast": darkPrimaryContrast(hsl()),
        secondary: darkSecondary(hsl()),
        "secondary-contrast": darkContrast(hsl()),
        accent: darkSecondary(hsl()),
        "accent-contrast": darkContrast(hsl()),
        ring: darkPrimary(hsl()),
        destructive: "0 65% 45%",
        "destructive-contrast": "360 89% 93%",
        warning: "41 96% 25%",
        "warning-contrast": "41 100% 93%",
        positive: "161 93.5% 45.4%",
        "positive-contrast": "152 76% 80.4%",
      },
    },
  },
] as const;

export type Theme = (typeof themes)[number];

//function to get the current theme
export function getCurrentTheme(name: string): Theme {
  return themes.find((theme) => theme.name === name) || themes["0"];
}
