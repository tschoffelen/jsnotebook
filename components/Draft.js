"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import Editor from "@/components/Editor";
import { saveNotebook } from "@/lib/api/notebooks";

const Draft = ({ notebook }) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(notebook.content);

  const save = async () => {
    setLoading(true);

    try {
      await saveNotebook({
        ...notebook,
        content,
      });
    } catch (e) {
      alert(
        "Sorry, we failed to save the changes. Check your internet connection and try again."
      );
    }

    setLoading(false);
  };

  const keyboardShortcutSave = (e) => {
    if (e.key === "s" && e.metaKey) {
      e.preventDefault();

      save();
    }
  };

  useEffect(() => {
    if (!notebook.id) {
      return;
    }
    window.addEventListener("keydown", keyboardShortcutSave);
    return () => window.removeEventListener("keydown", keyboardShortcutSave);
  }, []);

  return (
    <main className="min-h-screen">
      {/* --- Menu bar --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/">📘</Link>
        <div className="flex items-center gap-6 text-blue-500 text-sm font-medium">
          <a href="/new">New</a>
          {loading && (
            <span className="text-gray-500 font-normal">Loading...</span>
          )}
          {!loading && notebook.id && <button onClick={save}>Save</button>}
        </div>
      </div>

      {/* --- Editor --- */}
      <div className="flex flex-col items-center justify-between">
        <div className="max-w-5xl w-full">
          <Editor content={notebook.content} onUpdate={setContent} />
        </div>
      </div>
    </main>
  );
};

export default Draft;
