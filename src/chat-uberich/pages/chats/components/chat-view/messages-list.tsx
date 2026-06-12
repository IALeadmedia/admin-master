
import type { IMessage } from "@/chat-uberich/interfaces/message";
import { MyMessage } from "./my-message";
import { ProspectMessage } from "./prospect-message";
import { memo, useEffect, useRef } from "react";

interface IChatMessages {
  messages: IMessage[];
  matchedMessages: string[];
  changeMatchedMessages: (matches: string[]) => void;
  selectedMessageIdFoIndex: string | null;
  searchedTerm: string;
  currentIndex: number;
  changeCurrentIndex: (index: number) => void;
}

export const ChatMessagesList = memo(
  ({
    messages,
    matchedMessages,
    changeMatchedMessages,
    selectedMessageIdFoIndex,
    searchedTerm,
    currentIndex,
    changeCurrentIndex,
  }: IChatMessages) => {
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // Hook para centralizar na palavra caso tenha sido clicado a partir da pesquisa do campo 'Buscar' na seleção de contatos
    useEffect(() => {
      if (!selectedMessageIdFoIndex) return;

      const index = matchedMessages.indexOf(selectedMessageIdFoIndex);
      if (index !== -1 && index !== currentIndex) {
        changeCurrentIndex(index);
      }
    }, [selectedMessageIdFoIndex]);

    // Hook para salvar todas as palavras que batem nas mensagens
    useEffect(() => {
      const matches = messages
        .filter(
          (msg) =>
            msg.data.messageType === "conversation" &&
            msg.data.content.toLowerCase().includes(searchedTerm?.toLowerCase())
        )
        .map((msg) => msg.id);

      changeMatchedMessages(matches);
      changeCurrentIndex(matches.length - 1);
    }, [searchedTerm, messages]);

    // Hook para o scroll centralizar nas palavras de acordo com o index selecionado pelas setas
    useEffect(() => {
      const currentId = matchedMessages[currentIndex];
      const el = messageRefs.current[currentId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, [currentIndex, matchedMessages]);

    return messages.map((message) => {
      const isProspectMessage = message.sender === "Prospect";
      const isCurrentMatch = matchedMessages[currentIndex] === message.id;

      return (
        <div
          key={message.id}
          ref={(el) => {
            messageRefs.current[message.id] = el;
          }}
          className={`block mb-4 ${isProspectMessage ? "justify-start" : "justify-end"
            } `}
        >
          {isProspectMessage ? (
            // Mensagem do usuário (esquerda)
            <ProspectMessage
              key={message.id}
              message={message}
              searchedTerm={searchedTerm}
              isCurrentMatch={isCurrentMatch}
            />
          ) : (
            // Mensagem do bot ou usuario (direita)
            <MyMessage
              key={message.id}
              message={message}
              searchedTerm={searchedTerm}
              isCurrentMatch={isCurrentMatch}
            />
          )}
        </div>
      );
    });
  }
);
