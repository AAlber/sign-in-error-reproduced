const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}", "!./src/translations/*.{ts,tsx,json}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        contrast: "hsl(var(--contrast))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          contrast: "hsl(var(--primary-contrast))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          contrast: "hsl(var(--secondary-contrast))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          contrast: "hsl(var(--destructive-contrast))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          contrast: "hsl(var(--warning-contrast))",
        },
        positive: {
          DEFAULT: "hsl(var(--positive))",
          contrast: "hsl(var(--positive-contrast))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          contrast: "hsl(var(--muted-contrast))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          contrast: "hsl(var(--accent-contrast))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / 0.7)",
          contrast: "hsl(var(--popover-contrast))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          contrast: "hsl(var(--card-contrast))",
        },
      },
      // borderRadius: {
      //   lg: `var(--radius)`,
      //   md: `calc(var(--radius) - 2px)`,
      //   sm: "calc(var(--radius) - 4px)",
      // },
      // fontFamily: {
      //   sans: ["var(--font-sans)", ...fontFamily.sans],
      // },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "shimmer": {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-slow2": "spin 9s linear infinite",
        "spin-slow3": "spin 19s linear infinite",
        "ping-slow": "ping 3s cubic-bezier(0, 0, 0.2, 1) infinite",
        "bounce-slow": "bounce 2s infinite",
        "wiggle-slow": "wiggle 5s infinite",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.2s ease-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      gap: {
        sm: "0.5rem",
        md: "1rem",
      },
      blur: {},
      screens: {
        "3xl": "1600px",
        "4xl": "1800px",
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: "#ffffff",
      neutral: colors.neutral,
      gray: colors.gray,
      emerald: colors.emerald,
      orange: colors.orange,
      lime: colors.lime,
      indigo: colors.indigo,
      red: colors.red,
      teal: colors.teal,
      sky: colors.sky,
      teal: colors.teal,
      rose: colors.rose,
      yellow: colors.yellow,
      purple: colors.purple,
      blue: colors.blue,
      "fuxam-pink": {
        900: "#2B0E14",
        800: "#4D1A23",
        700: "#812B3B",
        600: "#AB3A4E",
        500: "#D54862",
        DEFAULT: "#FF5675",
        300: "#FF7A93",
        200: "#FFA8B8",
        100: "#FFE0E6",
      },
      "fuxam-orange": "#fe7b67",
      "fuxam-yellow": "#e89f4c",
      "fuxam-green": "#59a356",
      "fuxam-blue": "#5777ff",
      "fuxam-darkgreen": "#072a2b",
      offwhite: {
        1: "#F1F1F1",
        2: "#E2E2E2",
        3: "#D4D4D4",
        4: "#C5C5C5",
        5: "#646464",
      },
      offblack: {
        1: "#10131D",
        2: "#141824",
        3: "#181C2A",
        4: "#252938",
        5: "#333645",
        6: "#464856",
        7: "#4F515E",
        8: "#8F92AC",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    plugin(function ({ addVariant }) {
      addVariant("not-last", "&:not(:last-child)");
    }),
  ],
};
