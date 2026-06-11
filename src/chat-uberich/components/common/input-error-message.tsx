import { CircleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MessageProps {
  message: string | undefined;
}

export function InputErrorMessage({ message }: MessageProps) {
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <CircleAlert size={16} className="fill-red-400 stroke-white" />
          </TooltipTrigger>
          <TooltipContent className="bg-red-500 text-gray-200">
            {message}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}
