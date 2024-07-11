module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix", "eslint"],
  "**/*.ts?(x)": () => "npm run check-types",
  "*.{json,yaml}": ["prettier --write"],
  "prisma/schema.prisma": [
    "npx prisma format",
    // also push updated schema to test db
    "doppler run -c github -- npx prisma db push --accept-data-loss",
  ],
};
