import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  InfoIcon,
  XOctagon,
} from "lucide-react";

const LogLine = ({ type, args }) => {
  let icon = null;
  switch (type) {
    case "ERR":
      icon = <XOctagon className="w-3.5 h-3.5 text-red-500" />;
      break;
    case "INFO":
      icon = <InfoIcon className="w-3.5 h-3.5 text-blue-500" />;
      break;
    case "WARN":
      icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      break;
    case "LOG":
    case "RESULT":
    case "HTML":
      icon = <ArrowRight className="w-3.5 h-3.5 text-gray-500" />;
      break;
  }

  let output = args.join(" ");
  if (type === "HTML") {
    output = <div dangerouslySetInnerHTML={{ __html: output }} />;
  }

  if (type === "TIME") {
    return (
      <div className="text-gray-500 text-xs px-3 py-2 flex items-center gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
        <span>Finished running in {output}ms</span>
      </div>
    );
  }

  return (
    <div className="font-mono text-sm px-3 py-2 border-t border-gray-100 flex items-center gap-2">
      {icon} <div className="flex-1">{output}</div>
    </div>
  );
};

export default LogLine;
