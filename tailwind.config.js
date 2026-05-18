// Build-time config for the precompiled stylesheet (dist/styles.css).
// Scans this package's source AND @booga/vui's dist. Consumers running
// their own Tailwind pipeline should apply @booga/vtheme/preset directly.
import vtheme from "@booga/vtheme/preset";

export default {
  presets: [vtheme],
  content: [
    "./src/**/*.{ts,tsx}",
    "./node_modules/@booga/vui/dist/**/*.js",
  ],
};
