import {
  defineNuxtModule,
  addPlugin,
  createResolver,
  addComponentsDir,
} from "@nuxt/kit";

// Module options TypeScript interface definition
export interface ModuleOptions {
  fields: {
    select: "default" | "custom";
  };
}

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
      select: "default",
    },
  },

  // Shorthand sugar to register Nuxt hooks
  hooks: {},

  setup(_options, _nuxt) {
    const resolver = createResolver(import.meta.url);

    _nuxt.hook("vite:serverCreated", (server) => {
      server.middlewares.use((err: any, _req: any, _res: any, next: any) => {
        console.error("[module error]", err);
        next(err);
      });
    });

    addComponentsDir({
      path: resolver.resolve("./runtime/base/components"),
      global: true,
    });
  },
});
