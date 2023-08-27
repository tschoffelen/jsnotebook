"use client";

import { EditorContent, useEditor, ReactNodeViewRenderer } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import { lowlight } from "lowlight";

import CodeBlockNode from "./block/CodeBlockNode";
import SlashCommand from "./editor/SlashCommand";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import debounce from "@/lib/hooks/debounce";

lowlight.registerLanguage("js", js);
lowlight.registerLanguage("ts", ts);

const CustomDocument = Document.extend({
  content: "heading block*",
});

const extensions = [
  CustomDocument,
  StarterKit.configure({
    document: false,
    bulletList: {
      HTMLAttributes: {
        class: "-mt-2",
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: "-mt-2",
      },
    },
    listItem: {
      HTMLAttributes: {
        class: "-mb-2",
      },
    },
    code: {
      HTMLAttributes: {
        spellcheck: "false",
      },
      spellcheck: "false",
    },
    codeBlock: false,
    dropcursor: {
      color: "#DBEAFE",
      width: 4,
    },
    gapcursor: false,
  }),
  Placeholder.configure({
    placeholder: ({ node }) => {
      if (node.type.name === "heading") {
        return "Untitled notebook";
      }
      if (node.type.name === "paragraph") {
        return "Press '/' for commands, or start typing...";
      }
    },
  }),
  CodeBlockLowlight.extend({
    addNodeView() {
      return ReactNodeViewRenderer(CodeBlockNode);
    },
    addAttributes() {
      return {
        language: {
          default: "ts",
        },
        result: {
          default: null,
        },
        inputHash: {
          default: null,
        },
      };
    },
  }).configure({ lowlight }),
  Highlight,
  Typography,
  Link,
  SlashCommand,
];

const Editor = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate: debounce((e) => {
      onUpdate(e.editor.getHTML());
    }),
    autofocus: content === "" ? "end" : false,
  });

  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
};

export default Editor;
