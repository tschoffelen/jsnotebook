import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root entry file of user input
      build.onResolve({ filter: /(^input\.ts$)/ }, () => {
        return { path: "input.ts", namespace: "app" };
      });

      // handle relative imports inside a module
      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          path: new URL(args.path, "https://unpkg.com" + args.resolveDir + "/")
            .href,
          namespace: "app",
        };
      });

      // handle main file of a module
      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        return {
          path: `https://unpkg.com/${args.path}`,
          namespace: "app",
        };
      });
    },
  };
};
