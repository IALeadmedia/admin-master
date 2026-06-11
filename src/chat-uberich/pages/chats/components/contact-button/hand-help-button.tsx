
import { Tooltip } from "@/chat-uberich/components/common/tooltip";
import { Hand } from "lucide-react";
import { memo } from "react";

interface IHandHelp {
  isHandHelpButtonActive: boolean;
  onHandHelpChange: () => void;
}

export const HandHelpButton = memo(
  ({ isHandHelpButtonActive, onHandHelpChange }: IHandHelp) => {
    return (
      <Tooltip info="Ajuda" className="text-slate-200 bg-[#646464]">
        <div onClick={onHandHelpChange}>
          {isHandHelpButtonActive ? (
            <Hand size={16} className=" text-red-500" />
          ) : (
            <Hand size={16} className=" text-red-500" />
          )}
        </div>
      </Tooltip>
    );
  },
);
