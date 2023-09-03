import Draft from "@/components/Draft";
import { defaultContent } from "@/components/editor/defaultContent";

export default function Home() {
  return <Draft notebook={{ content: defaultContent, title: 'JavaScript Notebook' }} />;
}
