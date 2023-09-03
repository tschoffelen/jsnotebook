"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Editor from "@/components/Editor";
import { saveNotebook } from "@/lib/api/notebooks";
import { loadEsbuild } from "@/lib/bundler";

const Draft = ({ notebook }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(notebook.content);
  const [title, setTitle] = useState(notebook.title || 'Untitled notebook');

  const save = async () => {
    setLoading(true);

    try {
      await saveNotebook({
        ...notebook,
        title,
        content,
      });
    } catch (e) {
      alert(
        "Sorry, we failed to save the changes. Check your internet connection and try again."
      );
    }

    setLoading(false);
  };

  const createNew = async () => {
    setLoading(true);

    // create empty notebook
    const id = await saveNotebook({
      content: "<p></p><p></p><p></p>"
    });

    router.push(`/${id}`);
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

  useEffect(() => {
    try {
      loadEsbuild();
    } catch (_) {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-screen">
      {/* --- Menu bar --- */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <Link href="/">📘</Link>
        <div className="flex items-center gap-6 text-blue-500 text-sm font-medium">
          {!loading && <button onClick={createNew}>New</button>}
          {loading && (
            <span className="text-gray-500 font-normal">Loading...</span>
          )}
          {!loading && notebook.id && <button onClick={save}>Save</button>}
          {!loading && !notebook.id && (
            <a href="https://github.com/includable/jsnotebook">
              View on GitHub
            </a>
          )}
        </div>
      </div>

      {/* --- Editor --- */}
      <div className="flex flex-col items-center justify-between">
        <div className="max-w-5xl w-full">
          <div className="p-12 md:p-24 pb-0 md:pb-0">
            <input
              type="text"
              className="w-full border-0 shadow-none text-5xl p-2 -m-2 rounded-md font-extrabold text-gray-900"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Editor content={notebook.content} onUpdate={setContent} />
        </div>
      </div>
    </main>
  );
};

export default Draft;
