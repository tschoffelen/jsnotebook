import * as esbuild from "esbuild-wasm";
import axios from "axios";

import localForage from "localforage";

const fileCache = localForage.createInstance({
  name: "file-cache",
});

const fetchViaProxy = async (url: string) => {
  url = `/proxy?url=${encodeURIComponent(url)}`;
  return axios.get(url);
};

export const fetchPlugin = (input: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      // handle root user input code
      build.onLoad({ filter: /^input\.ts$/ }, () => {
        return {
          loader: "tsx",
          contents: input,
        };
      });

      // if not cached, carry on to the reamining load functions
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const cachedResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );
        if (cachedResult) {
          return cachedResult;
        }
      });

      // handle css files
      build.onLoad({ filter: /\.css$/ }, async (args: esbuild.OnLoadArgs) => {
        const { data, request } = await fetchViaProxy(args.path);
        const contents = `
                        const style = document.createElement('style');
                        style.innerText = ${JSON.stringify(data)};
                        document.head.appendChild(style);
                    `;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });

      // handle js and jsx files
      build.onLoad({ filter: /.*/ }, async (args: esbuild.OnLoadArgs) => {
        const {
          data: contents,
          headers,
          request,
        } = await fetchViaProxy(args.path);
        const contentType =
          headers["content-type"] || "application/octet-stream";
        let loader: esbuild.Loader = "js";
        if (args.path.includes(".ts")) loader = "ts";
        if (args.path.includes(".tsx")) loader = "tsx";
        if (args.path.includes(".jsx")) loader = "jsx";
        if (contentType.includes("text/")) loader = "text";
        const result: esbuild.OnLoadResult = {
          loader,
          contents,
          resolveDir: new URL("./", request.responseURL).pathname,
        };
        await fileCache.setItem(args.path, result);
        return result;
      });
    },
  };
};
