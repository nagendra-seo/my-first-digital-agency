module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  parserOptions: { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true } },
  settings: { react: { version: "detect" } },
  plugins: ["react-refresh"],
  rules: {
    // Hard rule, not a suggestion: nothing may ever print to the browser
    // console. Catches an accidental console.log before it ships.
    "no-console": "error",
    "no-debugger": "error",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "react-refresh/only-export-components": "warn",
  },
};
