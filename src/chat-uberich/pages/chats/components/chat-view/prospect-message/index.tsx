import { memo } from "react";
import { Ban } from "lucide-react";
import { TextMessage } from "./text";
import { ImageMessage } from "./image";
import { AudioMessage } from "./audio";
import { DocumentMessage } from "./document";
import { StickerMessage } from "./sticker";
import type { IMessage } from "@/chat-uberich/interfaces/message";

export interface IBaseMessage {
  messageTime: string;
}

interface IMyMessage {
  message: IMessage;
  searchedTerm?: string;
  isCurrentMatch: boolean;
}

export const ProspectMessage = memo(
  ({ message, searchedTerm, isCurrentMatch }: IMyMessage) => {
    const messageTime = new Date(message.sentAt).toLocaleString("pt-BR", {
      timeStyle: "medium",
      dateStyle: "short",
    });

    if (!!message.deletedAt) {
      return (
        <div className="bg-white shadow-md p-2 rounded-md w-full flex gap-1 justify-between">
          <p className="text-sm text-neutral-400  wrap-break-words flex items-center gap-1 italic">
            <Ban size={12} /> Mensagem apagada
          </p>
        </div>
      );
    }

    const messageType = message.data.messageType;

    switch (messageType) {
      case "conversation":
        return (
          <TextMessage
            text={message.data.content}
            messageTime={messageTime}
            wasEdited={Boolean(message.editedAt)}
            highlightTerm={searchedTerm}
            isCurrentMatch={isCurrentMatch}
          />
        );
      case "imageMessage":
        return (
          <ImageMessage
            imageUrl={message.data.content}
            caption={message.data.caption}
            messageTime={messageTime}
          />
        );
      case "stickerMessage":
        return (
          <StickerMessage
            imageUrl={message.data.content}
            messageTime={messageTime}
          />
        );
      case "audioMessage":
        return (
          <AudioMessage
            audioSource={message.data.content}
            messageTime={messageTime}
          />
        );
      case "documentMessage":
        return (
          <DocumentMessage
            documentUrl={message.data.content}
            messageTime={messageTime}
          />
        );
      default:
        return <p className="text-red-400">formato não suportado</p>;
    }
  },
);
