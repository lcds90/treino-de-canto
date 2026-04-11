import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
includeShadowDom: true,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
