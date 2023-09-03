"use client";

import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

interface BundledResult {
  output: string;
  error: string;
}

let loaded = false;
let isLoading = false;

export const loadEsbuild = async () => {
  if (loaded) {
    return;
  }

  if (isLoading) {
    await new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!isLoading) {
          clearInterval(interval);
          resolve("");
        }
      }, 100);
    });
    return;
  }

  try {
    await esbuild.initialize({
      worker: true,
      wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
    });
    loaded = true;
  } catch (error) {
    console.log(error);
  }
  isLoading = false;
};

const esBundle = async (
  input: string,
  hasTypescript: boolean
): Promise<BundledResult> => {
  await loadEsbuild();
  try {
    const result = await esbuild.build({
      entryPoints: ["index.js"],
      bundle: true,
      minify: false,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input, hasTypescript)],
      define: {
        global: "window",
      },
    });
    return {
      output: result.outputFiles[0].text,
      error: "",
    };
  } catch (error) {
    return {
      output: "",
      error: error.message,
    };
  }
};

export default esBundle;
