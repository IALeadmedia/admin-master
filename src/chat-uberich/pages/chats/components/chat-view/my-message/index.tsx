import { memo } from "react";
import { Ban } from "lucide-react";
import { ImageMessage } from "./image";
import { TextMessage } from "./text";
import { AudioMessage } from "./audio";
import { DocumentMessage } from "./document";
import { useMutation } from "@tanstack/react-query";
import type { IMessage } from "@/chat-uberich/interfaces/message";
import { MessagesService } from "@/chat-uberich/service/messages";
import { AlertMessage } from "@/chat-uberich/components/common/alert-message";
import { useChatContext } from "@/chat-uberich/hooks/use-chat";

export interface IBaseMessage {
  messageTime: string;
}

interface IMyMessage {
  message: IMessage;
  searchedTerm?: string;
  isCurrentMatch: boolean;
}

const messageService = new MessagesService();

export const MyMessage = memo(
  ({ message, searchedTerm, isCurrentMatch }: IMyMessage) => {
    const { deleteMessage, updateMessage } = useChatContext();

    const wasDeleted = !!message.deletedAt;
    const wasEdited = !!message.editedAt;

    const messageTime = new Date(message.sentAt).toLocaleString("pt-BR", {
      timeStyle: "medium",
      dateStyle: "short",
    });

    const messageType = message.data.messageType;

    const { mutate: deleteMessageMutate } = useMutation({
      mutationFn: async () => messageService.deleteMessage(message.id),
      onSuccess: () => {
        deleteMessage(message.prospectId, message.id);
        AlertMessage("Mensagem removida com sucesso.", "success");
      },
      onError: (error) => {
        console.error("Error deleting message:", error);
        AlertMessage(
          "Houve um erro ao remover a mensage, tente mais tarde. ",
          "error",
        );
      },
    });

    const { mutate: editMessageMutate } = useMutation({
      mutationFn: async (text: string) => {
        await messageService.updateMessage(message.id, text);
        return text;
      },
      onSuccess: (text: string) => {
        updateMessage(message.prospectId, message.id, text);
        AlertMessage("Mensagem editada com sucesso.", "success");
      },
      onError: (error) => {
        console.error("Error deleting message:", error);

        AlertMessage(
          "Houve um erro ao editar a mensage, tente mais tarde. ",
          "error",
        );
      },
    });

    if (wasDeleted) {
      return (
        <div className="flex flex-col gap-2 max-w-[60%] w-max ml-auto">
          <div className="bg-white shadow-md p-2 rounded-md w-full flex gap-1 justify-between">
            <p className="text-sm text-neutral-400  wrap-break-words flex items-center gap-1 italic">
              <Ban size={12} /> Mensagem apagada
            </p>
          </div>
        </div>
      );
    }

    switch (messageType) {
      case "conversation":
        return (
          <TextMessage
            text={message.data.content}
            messageTime={message.sentAt}
            wasEdited={wasEdited}
            onDeleteMessage={deleteMessageMutate}
            onEditMessage={editMessageMutate}
            highlightTerm={searchedTerm}
            isCurrentMatch={isCurrentMatch}
          />
        );
      case "imageMessage":
        return (
          <ImageMessage
            imageUrl={message.data.content}
            messageTime={messageTime}
          />
        );
      case "stickerMessage":
        return (
          <ImageMessage
            imageUrl={message.data.content}
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
      case "audioMessage":
        return (
          <AudioMessage
            audioSource={message.data.content}
            messageTime={messageTime}
          />
        );
      default:
        return null;
    }
  },
);
