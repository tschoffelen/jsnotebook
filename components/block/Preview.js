import React, { useCallback, useRef, useEffect, useState, useId } from "react";
import * as crc32 from "crc-32";

import esBundle from "@/lib/bundler";
import LogLine from "./LogLine";
import debounce from "@/lib/hooks/debounce";

const html = `
<html>
  <head>
    <body>
      <div id = "root"></div>
      <script>
        const process = {env: {NODE_ENV: "production"}}
      </script>
      <script id="sc"></script>
      <script>
        let hist = [];

        const handleError = (error) => {
          const root = document.querySelector('#root');
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + error + '</div>';
          console.error(error);
          hist.push(["ERR", error.toString()]);
        }

        window.addEventListener('error', (event) => {
          // handle asynchronous run-time error
          handleError(event.error)
        });

        const origConsoleLog = window.console.log;

        console.log = function (...args) {
          hist.push(["LOG", ...args.map(anythingToString)]);
          origConsoleLog(...args)
        }
        console.info = function (...args) {
          hist.push(["INFO", ...args.map(anythingToString)]);
          origConsoleLog(...args)
        }
        console.error = function (...args) {
          hist.push(["ERR", ...args.map(anythingToString)]);
          origConsoleLog(...args)
        }
        console.warn = function (...args) {
          hist.push(["WARN", ...args.map(anythingToString)]);
          origConsoleLog(...args)
        }

        const html = (...args) => {
          hist.push(["HTML", ...args.map(anythingToString)]);
        }

        const anythingToString = (anything) => {
          if (typeof anything === 'string') {
            return anything;
          } else if (typeof anything === 'number') {
            return anything.toString();
          } else if (typeof anything === 'function') {
            return "[Function]";
          } else {
            return JSON.stringify(anything);
          }
        };

        window.addEventListener("message", (event) => {
            const { code, id } = event.data;
            hist = [];
            if (code) {
              (async () => {
                try {
                  eval(code);
                  const result = await window.codeRunner();
                  if (result !== undefined) {
                    hist.push(['RESULT', anythingToString(result)]);
                  }
                } catch(error) {
                  handleError(error);
                }
                window.parent.postMessage({ id, result: hist }, "*");
              })();
            }
          }, false)
      </script>
    </body>
  </head>
</html>
`;

const Preview = ({ input, attributes, updateAttributes }) => {
  const iframe = useRef();
  const id = useId();
  const [loading, setLoading] = useState(false);
  const [inputHash, setInputHash] = useState();
  const [result, setResult] = useState(
    () => (attributes.result && JSON.parse(attributes.result)) || []
  );

  useEffect(() => {
    const newHash = crc32.str(input);
    if (newHash === attributes.inputHash) {
      console.log("skipping recompile");
      return;
    }

    setInputHash(newHash);
    compile();
  }, [input]);

  useEffect(() => {
    if (!inputHash || !result || !result.length) {
      return;
    }

    updateAttributes({
      result: JSON.stringify(result),
      inputHash,
    });
    console.log("Result updated");
  }, [result, inputHash]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.id === id) {
        console.log("Message received", event.data);
        setResult(event.data.result || []);
      }
    });
  }, []);

  const compile = useCallback(
    debounce(async () => {
      console.log("Compiling", input);
      input = input.trim();
      if (!input) return;

      setLoading(true);
      const { output, error } = await esBundle(input, true);
      if (error) {
        setResult([["ERR", error.toString()]]);
      } else {
        const code = `window.codeRunner = async function () { \n${output}\n }`;
        iframe.current?.contentWindow?.postMessage({ id, code }, "*");
      }
      setLoading(false);
    }),
    [input]
  );

  return (
    <div className="preview-wrapper">
      <iframe
        title="preview"
        ref={iframe}
        sandbox="allow-scripts"
        srcDoc={html}
        style={{ height: 0, width: 0, border: 0, opacity: 0 }}
      />
      {loading ? (
        <div className="px-3 py-2 text-sm text-gray-500">Loading</div>
      ) : (
        result?.map(([type, ...args], i) => (
          <LogLine key={i} type={type} args={args} />
        ))
      )}
    </div>
  );
};

export default React.memo(Preview);
