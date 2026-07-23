const {colors} = require('./app/theme/colors');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: colors.brand.yellow,
          orange: colors.brand.orange,
          'orange-light': colors.brand.orangeLight,
          'orange-soft': colors.brand.orangeSoft,
          'orange-muted': colors.brand.orangeMuted,
          'yellow-soft': colors.brand.yellowSoft,
          'yellow-muted': colors.brand.yellowMuted,
        },
        ink: {
          DEFAULT: colors.ink.DEFAULT,
          soft: colors.ink.soft,
          muted: colors.ink.muted,
          faint: colors.ink.faint,
        },
        surface: {
          DEFAULT: colors.surface.DEFAULT,
          soft: colors.surface.soft,
          muted: colors.surface.muted,
          border: colors.surface.border,
        },
        status: {
          success: colors.status.success,
          'success-soft': colors.status.successSoft,
          warning: colors.status.warning,
          'warning-soft': colors.status.warningSoft,
          error: colors.status.error,
          'error-soft': colors.status.errorSoft,
          info: colors.status.info,
          'info-soft': colors.status.infoSoft,
          closed: colors.status.closed,
          'closed-soft': colors.status.closedSoft,
        },
        // Back-compat aliases used across the app
        app: {
          gray: colors.gray,
          yellow: colors.brand.yellow,
          orange: colors.brand.orange,
        },
      },
    },
  },
  plugins: [],
};
