import { MessageType } from "@/interfaces/chat/message-type";
import { Checks } from "@phosphor-icons/react";
import { Ban, File, Image, Mic, Sticker } from "lucide-react";
import { memo } from "react";

type IMessagePreview = {
  isDeleted: boolean;
  messageType: MessageType;
  content: string;
  searchedTerm: string;
  isByGlobalSearch: boolean;
};

export const MessagePreview = memo(
  ({
    isDeleted,
    messageType,
    content,
    searchedTerm,
    isByGlobalSearch,
  }: IMessagePreview) => {
    const highlightTerm = (text: string, term: string, contextWords = 2) => {
      if (!term) return text;

      const regex = new RegExp(`(${term})`, "i");
      const match = text.match(regex);

      if (!match) return text;

      const matchIndex = match.index!;

      const words = text.split(" ");
      let charCount = 0;
      let matchWordIndex = -1;

      for (let i = 0; i < words.length; i++) {
        charCount += words[i].length + 1;
        if (charCount >= matchIndex + term.length) {
          matchWordIndex = i;
          break;
        }
      }

      if (matchWordIndex === -1) return text;

      const start = Math.max(matchWordIndex - contextWords, 0);
      const end = Math.min(matchWordIndex + contextWords + 1, words.length);
      const clippedWords = words.slice(start, end);
      const showStartEllipsis = start > 0;
      const showEndEllipsis = end < words.length;

      const clippedText = clippedWords.join(" ");
      const finalParts = clippedText.split(new RegExp(`(${term})`, "gi"));

      return (
        <>
          {showStartEllipsis && <span>... </span>}
          {finalParts.map((part, index) =>
            part.toLowerCase() === term.toLowerCase() ? (
              <span key={index} className="bg-yellow-700 text-white px-1">
                {part}
              </span>
            ) : (
              <span key={index}>{part}</span>
            ),
          )}
          {showEndEllipsis && <span> ...</span>}
        </>
      );
    };

    return (
      <div className="text-[11px] text-neutral-500  mt-1 text-left flex items-center gap-0.5 justify-between">
        <div className="flex flex-row items-center justify-start gap-1 w-full">
          <p className="flex">
            {isDeleted ? (
              <span className="text-neutral-400  break-words flex items-center gap-1 italic">
                <Ban size={12} /> Mensagem apagada
              </span>
            ) : (
              <>
                <Checks size={14} color="#b3b3b3" />
                <span className="ml-1 max-w-36 truncate text-neutral-400 ">
                  {messageType === "conversation" && isByGlobalSearch
                    ? highlightTerm(content, searchedTerm)
                    : messageType === "conversation" && content}

                  {messageType === "audioMessage" && (
                    <span className=" flex items-center gap-1 italic">
                      <Mic size={14} /> Mensagem de voz
                    </span>
                  )}

                  {messageType === "documentMessage" && (
                    <span className="flex items-center gap-1 italic">
                      <File size={14} /> Documento
                    </span>
                  )}

                  {messageType === "imageMessage" && (
                    <span className="flex items-center gap-1 italic">
                      <Image size={14} /> Imagem
                    </span>
                  )}

                  {messageType === "stickerMessage" && (
                    <span className="flex items-center gap-1 italic">
                      <Sticker size={14} /> Figurinha
                    </span>
                  )}
                </span>
              </>
            )}
          </p>
        </div>
      </div>
    );
  },
);
