
import { ChatMessagesList } from "./messages-list";
import { ChatInputMessage } from "./input-message/input-message";
import { ChatHeader } from "./header";

import { forwardRef, useRef, useLayoutEffect, useEffect } from "react";
import type { IChat } from "@/chat-uberich/interfaces/chat";
import { Loader } from "@/chat-uberich/components/common/loader";
;

interface IChatProps {
  currentChat: IChat;
  selectedMessageIdFoIndex: string | null;
  searchedTerm: string;
  changeSearchedTerm: (term: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isCurrentChatChanged: boolean;
  changeIsCurrentChatChanged: (newIsCurrentChatChanged: boolean) => void;
  currentIndex: number;
  matchedMessages: string[];
  changeMatchedMessages: (matches: string[]) => void;
  changeCurrentIndex: (index: number) => void;
  isByGlobalSearch: boolean;
  isLoading?: boolean;
}

const InvisibleDivToScroll = forwardRef<HTMLDivElement>((_, ref) => {
  return <div ref={ref} />;
});

export const ChatView = ({
  currentChat,
  selectedMessageIdFoIndex,
  changeSearchedTerm,
  goToNext,
  goToPrevious,
  isCurrentChatChanged,
  isByGlobalSearch,
  changeCurrentIndex,
  changeIsCurrentChatChanged,
  searchedTerm,
  currentIndex,
  matchedMessages,
  changeMatchedMessages,
  isLoading = false,
}: IChatProps) => {
  const { id, prospect, messages } = currentChat;
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Hook para resetar a barra de pesquisa quando muda de chat pesquisando pelo chat
  useEffect(() => {
    if (!isByGlobalSearch) {
      changeSearchedTerm("");
      changeIsCurrentChatChanged(true);
    }
  }, [currentChat]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useLayoutEffect(() => {
    // Realiza o scroll apenas ao trocar de conversa
    if (!searchedTerm) {
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [id, messages]); // Dependência apenas no ID do chat

  return (
    <>
      <ChatHeader
        prospect={prospect}
        changeSearchedTerm={changeSearchedTerm}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        isCurrentChatChanged={isCurrentChatChanged}
        changeIsCurrentChatChanged={changeIsCurrentChatChanged}
        searchedTerm={searchedTerm}
        currentIndex={currentIndex + 1}
        totalMatchedMessages={matchedMessages.length}
        isByGlobalSearch={isByGlobalSearch}
      />
      <div className="w-full h-full flex flex-col gap-8 rounded-md border border-[#e2e2e2] ] overflow-x-hidden overflow-y-auto scrollbar-thin relative">
        {/* Loading overlay apenas na área das mensagens */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 rounded-md">
            <Loader />
          </div>
        )}
        <div className="h-117.5 overflow-y-auto scrollbar-thin p-2">
          <ChatMessagesList
            messages={messages}
            matchedMessages={matchedMessages}
            selectedMessageIdFoIndex={selectedMessageIdFoIndex}
            changeMatchedMessages={changeMatchedMessages}
            searchedTerm={searchedTerm}
            currentIndex={currentIndex}
            changeCurrentIndex={changeCurrentIndex}
          />
          <InvisibleDivToScroll ref={scrollRef} />
        </div>
      </div>
      <ChatInputMessage />
    </>
  );
};
