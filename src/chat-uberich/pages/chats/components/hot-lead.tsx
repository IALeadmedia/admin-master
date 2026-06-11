import { Image } from "@/components/chat/common/image";
import { Tooltip } from "@/components/chat/common/tooltip";
import { IChat } from "@/interfaces/chat/chat";
import { formatPhoneNumber } from "@/utils/format_number";

interface IHotLeadProps {
  chat: IChat;
  onClick: () => void;
}

export function HotLead({ chat, onClick }: IHotLeadProps) {
  return (
    <>
      <Tooltip
        info={`${chat.prospect.platformData.name || "Nome indisponível"} | ${
          formatPhoneNumber(chat.prospect.externalId) || "Número indisponível"
        }`}
        className="text-slate-200 bg-[#646464]"
      >
        <button
          type="button"
          onClick={onClick}
          className="flex-col hover:shadow-md hover:bg-slate-300/[.2] p-1 rounded-lg duration-200 flex items-center justify-between relative cursor-pointer my-1"
        >
          <div className="flex bg-[#d63535] rounded-3xl w-12 h-12 items-center gap-3 relative">
            <div className="relative left-1">
              <Image
                className="rounded-full min-w-10 max-w-10"
                src={
                  chat.prospect.platformData?.picture ||
                  "/assets/anonymous_avatar.png"
                }
                fallback="/assets/anonymous_avatar.png"
              />
            </div>
            <div className="text-2xl absolute top-[20px] left-[20px] ml-2 fire-glow text-red-800 flex items-center justify-center">
              🔥
              <span className="relative right-[20px] top-1 text-gray-200 text-xs font-bold">
                {chat.prospect.data.temperatura_lead}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-neutral-500  font-bold pt-1">
            {chat.prospect.data.nome ||
              chat.prospect.platformData?.name ||
              chat.prospect.externalId ||
              "Nome indisponível"}
          </p>
          {/* <p className="text-[10px] text-neutral-500 dark:text-neutral-300 font-bold pt-1">
            Temp: {chat.prospect.data.temperatura_lead}
          </p> */}
        </button>
      </Tooltip>
    </>
  );
}
