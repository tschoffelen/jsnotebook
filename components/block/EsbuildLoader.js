"use client";

import { useState, useEffect } from "react";
import * as esbuild from "esbuild-wasm";

const EsBuildLoader = ({ children }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await esbuild.initialize({
        worker: true,
        wasmURL: "https://unpkg.com/esbuild-wasm/esbuild.wasm",
      });
      setLoaded(true);
    })();
  }, []);

  if (!loaded) {
    return <div>Loading...</div>; // TODO: add a spinner
  }
  return children;
};

export default EsBuildLoader;
