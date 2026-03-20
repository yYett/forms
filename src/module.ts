import { defineNuxtModule, addPlugin, createResolver } from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    // Usually the npm package name of your module
    name: "@aj/forms",
    // The key in `nuxt.config` that holds your module options
    configKey: "forms",
    // Compatibility constraints
    compatibility: {
      // Semver version of supported nuxt versions
      nuxt: ">=3.0.0",
    },
  },

  // Default configuration options for your module, can also be a function returning those
  defaults: {
    fields: {
      //
    },
  },

  // Shorthand sugar to register Nuxt hooks
  hooks: {},

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    // // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    // addPlugin(resolver.resolve('./runtime/plugin'))
  },
});
