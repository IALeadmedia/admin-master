import { useState } from "react";

export function useChatSearchWordController() {
  const [searchedTerm, setSearchedTerm] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchedMessages, setMatchedMessages] = useState<string[]>([]);
  const [isCurrentChatChanged, setIsCurrentChatChanged] = useState<boolean>(true);
  const [isByGlobalSearch, setIsByGlobalSearch] = useState<boolean>(false);
  const [selectedMessageIdFoIndex, setSelectedMessageIdFoIndex] = useState<string | null>(null);

  
  const changeSearchedTerm = (newSearchedTerm: string) => {
    setSearchedTerm(newSearchedTerm);
  };

  const changeCurrentIndex = (newCurrentIndex: number) => {
    setCurrentIndex(newCurrentIndex);
  };

  const changeMatchedMessages = (newMatchedMessages: string[]) => {
    setMatchedMessages(newMatchedMessages);
  };

  const changeIsCurrentChatChanged = (newIsCurrentChatChanged: boolean) => {
    setIsCurrentChatChanged(newIsCurrentChatChanged);
  };
  const changeIsByGlobalSearch = (newIsByGlobalSearch: boolean) => {
    setIsByGlobalSearch(newIsByGlobalSearch);
  };

  // Navega para o próximo resultado
  const goToNext = () => {
    if (currentIndex < matchedMessages.length - 1) {
      changeCurrentIndex(currentIndex + 1);
    }
    if (currentIndex === matchedMessages.length - 1) {
      changeCurrentIndex(0);
    }
  };

  // Navega para o resultado anterior
  const goToPrevious = () => {
    if (currentIndex > 0) {
      changeCurrentIndex(currentIndex - 1);
    }
    if (currentIndex === 0) {
      changeCurrentIndex(matchedMessages.length - 1);
    }
  };
  return {
    searchedTerm,
    currentIndex,
    matchedMessages,
    isCurrentChatChanged,
    isByGlobalSearch,
    changeSearchedTerm,
    changeCurrentIndex,
    changeMatchedMessages,
    changeIsCurrentChatChanged,
    changeIsByGlobalSearch,
    goToNext,
    goToPrevious,
    selectedMessageIdFoIndex,
    setSelectedMessageIdFoIndex
  };
}
