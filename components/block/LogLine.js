import { AlertCircle, ArrowRight, InfoIcon } from "lucide-react";

const LogLine = ({type, args}) => {
    let icon = null;
    switch(type){
        case "ERR":
            icon = <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
            break;
        case "INFO":
        case "LOG":
            icon = <InfoIcon className="w-3.5 h-3.5 text-blue-500" />;
            break;
        case "RESULT":
            icon = <ArrowRight className="w-3.5 h-3.5 text-green-500" />;
            break;
    }

    return (
        <div className="font-mono text-sm px-3 py-2 border-t border-gray-100 flex items-center gap-2">
            {icon} <div className="flex-1">{args.join(" ")}</div>
        </div>
    )
}

export default LogLine;