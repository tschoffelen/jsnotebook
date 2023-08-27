"use client";

import * as esbuild from "esbuild-wasm";

import { unpkgPathPlugin } from "./plugins/unpkg-path-plugin";
import { fetchPlugin } from "./plugins/fetch-plugin";

interface BundledResult {
  output: string;
  error: string;
}

const esBundle = async (
  input: string,
  hasTypescript: boolean
): Promise<BundledResult> => {
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
