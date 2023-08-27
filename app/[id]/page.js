import Draft from "@/components/Draft";
import { notFound } from "next/navigation";

export default async function Notebook({ params: { id } }) {
  let notebook;
  try {
    const result = await fetch(
      `https://schof.link/${id}?d=${new Date().valueOf()}`
    );
    notebook = await result.json();
  } catch (e) {
    return notFound();
  }

  return <Draft notebook={notebook} />;
}
