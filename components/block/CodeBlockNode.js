import { useMemo } from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";

import Preview from "./Preview";

const getText = (node) => {
  let result = "";
  node.descendants((n) => {
    if (n.type.name === "text") {
      result += n.text;
    }
  });
  return result;
};

export default ({ node, updateAttributes }) => {
  const nodeText = useMemo(() => getText(node), [node]);

  return (
    <NodeViewWrapper className="border rounded-md overflow-hidden">
      <pre className="m-[-1px] rounded-b-none p-6" spellcheck="false">
        <NodeViewContent as="code" />
      </pre>
      <div contentEditable={false}>
        <Preview
          input={nodeText}
          attributes={node.attrs}
          updateAttributes={updateAttributes}
        />
      </div>
    </NodeViewWrapper>
  );
};
