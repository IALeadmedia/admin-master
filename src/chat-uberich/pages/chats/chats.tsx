import { Controller } from "react-hook-form";
import { WhatsappLogo } from "@phosphor-icons/react";
import { Flame, Hand } from "lucide-react";

// Hooks
import { useMessageSocket } from "@/hooks/use-message-socket";

// Components - UI

// Components - Common

// Local components
import { ChatView } from "./components/chat-view";
import { ContactButton } from "./components/contact-button";
import { useChatController } from "./controller";
import { useChatSearchWordController } from "./searchController";

// Interfaces

import { HotLead } from "./components/hot-lead";
import { formatPhoneNumber } from "@/utils/format_number";
import { Loader } from "@/components/chat/common/loader";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/chat/ui/resizable";
import { Button } from "@/components/chat/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/chat/ui/select";
import { IBot } from "@/services/bots";
import { Input } from "@/components/chat/ui/input";
import { Tooltip } from "@/components/chat/common/tooltip";
import { Visible } from "@/components/chat/common/visible";

export function Chats() {
  // Conecta o socket para a página de chats
  useMessageSocket();

  const {
    searchedTerm,
    currentIndex,
    matchedMessages,
    isCurrentChatChanged,
    isByGlobalSearch,
    changeCurrentIndex,
    changeMatchedMessages,
    changeSearchedTerm,
    changeIsCurrentChatChanged,
    changeIsByGlobalSearch,
    goToNext,
    goToPrevious,
    selectedMessageIdFoIndex,
    setSelectedMessageIdFoIndex,
  } = useChatSearchWordController();

  const {
    clientsIdQuery,
    query,
    allChatsList,
    selectedChat,
    isLoadingMessages,
    botsQuery,
    form,
    filters,
    selectChat,

    handHelpProspect,
    virtualChatsList,
  } = useChatController(isByGlobalSearch);

  const { control, register, setValue } = form;

  let previousType: "name" | "message" | null = null;

  const { onChange: onFormChange, ...rest } = register("searchContact");

  // const { favouritesProspects } = useAuthContext();

  // Only show full-screen loader for initial page load (when we have no chats yet)
  const isInitialLoading =
    (query.isLoading || botsQuery?.isLoading) && allChatsList.length === 0;

  if (isInitialLoading) {
    return (
      <div className="h-[calc(100vh-191px)] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (query.isError || botsQuery.error) {
    return <p>Error: {query.error?.message || botsQuery.error?.message}</p>;
  }

  // const changeFavouritesFilter = () => {
  //   setValue("favorite", !control._formValues.favorite);
  // };

  const changeHelpFilter = () => {
    setValue("help", !control._formValues.help);
  };

  // const changeWarningFilter = () => {
  //   setValue("warning", !control._formValues.warning);
  // };

  const changeHotLeadFilter = () => {
    setValue("hot_lead", !control._formValues.hot_lead);
  };

  // const favouritesCount = allChatsList.filter((chat) =>
  //   favouritesProspects.includes(chat.prospect.id),
  // ).length;

  const needHelpCount = allChatsList.reduce(
    (prev, current) =>
      prev + (!!current.prospect.data?.conversa_pendente ? 1 : 0),
    0,
  );

  const clientMaxTemperature =
    clientsIdQuery.data?.[0]?.countTowardsTemperature?.length ?? 0;

  const isClienteMaxTemperatureDefined =
    clientMaxTemperature !== undefined && clientMaxTemperature > 0;

  const hotLeadCount = allChatsList.reduce(
    (prev, current) =>
      prev +
      (current.prospect.data?.temperatura_lead === clientMaxTemperature
        ? 1
        : 0),
    0,
  );
  // const warningCount = chatsList.reduce(
  //   (prev, current) =>
  //     prev + current.prospect.warning ? 1 : 0,
  //   0
  // );

  // const onSubmitFilter = (data: any) => {};

  const onResetFilter = () => {
    form.reset();
    changeSearchedTerm("");
    changeIsByGlobalSearch(false);
  };

  // const hotLeadsOfTheDay = clientsIdQuery?.data?.[0]?.dailyStats?.hotLeadsCount;
  // const prospectsOfTheDay =
  //   clientsIdQuery?.data?.[0]?.dailyStats?.prospectsCount;

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex flex-row gap-0.5 mx-auto  px-2 h-[calc(100vh-170px)]"
      >
        <ResizablePanel
          defaultSize={25}
          minSize={24}
          maxSize={28}
          className="flex flex-col items-start gap-2 resize-x w-[27%] h-[calc(100vh-160px)] shadow-md rounded-lg p-2 min-w-64"
        >
          <aside className="flex flex-col w-full h-full  overflow-scroll">
            {/* Componentizar */}

            {/* <div className="flex  items-start justify-center div-glow gap-2 w-full pb-1">
              <div className="bg-[#e7e7e7] dark:bg-[#1b1b1b] text-[12px] w-28 h-10 flex flex-col shadow-md place-content-center items-center justify-center px-2 rounded-lg hover:bg-[#d6d6d6] dark:hover:bg-[#2a2a2a] ">
                <p className="text-center font-medium">
                  {hotLeadsOfTheDay} Hot Leads
                </p>
              </div>
              <div className="bg-[#e7e7e7] dark:bg-[#1b1b1b] div-glow  text-[12px] w-28 h-10 flex flex-col shadow-md place-content-center items-center justify-center px-2 rounded-lg hover:bg-[#d6d6d6] dark:hover:bg-[#2a2a2a] ">
                <p className="text-center font-medium ">
                  {prospectsOfTheDay} Prospect
                </p>
              </div>
            </div> */}

            <section className="flex items-center justify-between h-50 w-full px-2">
              <form className="flex flex-wrap gap-1 items-center w-full text-muted-freground">
                {/* Filtro de Bot */}
                <div className="w-full flex items-end justify-end">
                  <Button
                    className="text-[10px]"
                    type="button"
                    onClick={onResetFilter}
                    variant="ghost"
                  >
                    <p className="text-[12px] text-[#8b8e8f]">Limpar Filtros</p>
                  </Button>
                </div>
                <div className="flex justify-evenly gap-2 w-full">
                  <Controller
                    name="botId"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            style={{ fontSize: "12px", color: "#8b8e8f" }}
                            className="w-36"
                          >
                            <SelectValue
                              style={{ fontSize: "12px", color: "#8b8e8f" }}
                              className="placeholder:text-[12px] text-[12px]"
                              placeholder="Bot"
                            />
                          </SelectTrigger>
                          <SelectContent
                            style={{ fontSize: "12px", color: "#8b8e8f" }}
                          >
                            <SelectGroup>
                              {botsQuery.data?.map((bot: IBot) => (
                                <SelectItem key={bot?.id} value={bot?.id}>
                                  {bot?.evolutionData?.profileName || bot?.name}{" "}
                                  -{" "}
                                  {formatPhoneNumber(
                                    bot?.evolutionData?.phoneNumber ||
                                      bot?.phone,
                                  )}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />
                  <div className="flex items-center w-full">
                    <Input
                      type="text"
                      placeholder="Buscar..."
                      className=""
                      style={{ fontSize: "12px", color: "#8b8e8f" }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                        }
                      }}
                      onChange={(e) => {
                        onFormChange(e);
                        changeSearchedTerm(e.target.value);
                        if (e.target.value !== "") {
                          changeIsByGlobalSearch(true);
                        } else {
                          changeIsByGlobalSearch(false);
                        }
                      }}
                      {...rest}
                    />
                  </div>
                  {/* <Controller
                  name="platform"
                  control={control}
                  render={({ field }) => {
                    const platforms = [
                      {
                        name: "Whatsapp",
                        logo: <WhatsappLogo size={16} color="#22c55e" />,
                        value: "Evolution",
                      },
                    ];
                    return (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Plataforma" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {platforms.map((platform) => (
                              <SelectItem
                                key={platform.value}
                                value={platform.value}
                              >
                                <div className="flex items-center gap-2">
                                  {platform.logo && platform.logo}
                                  {platform.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    );
                  }}
                /> */}
                </div>

                <div className="flex gap-4 w-full">
                  {/* Campo de busca por nome */}
                  {/* <div className="flex items-center w-full">
                  <Input
                    type="text"
                    placeholder="Buscar..."
                    className=" text-xs"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    {...register("searchContact")}
                  />
                </div> */}

                  <Controller
                    name="platform"
                    control={control}
                    render={({ field }) => {
                      const platforms = [
                        {
                          name: "Whatsapp",
                          logo: <WhatsappLogo size={16} color="#22c55e" />,
                          value: "Evolution",
                        },
                      ];
                      return (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger
                            style={{ fontSize: "12px", color: "#8b8e8f" }}
                            className="text-xs"
                          >
                            <SelectValue
                              style={{ fontSize: "12px", color: "#8b8e8f" }}
                              className="placeholder:text-[12px] text-[12px]"
                              placeholder="Plataforma"
                            />
                          </SelectTrigger>
                          <SelectContent
                            style={{ fontSize: "12px", color: "#8b8e8f" }}
                          >
                            <SelectGroup>
                              {platforms.map((platform) => (
                                <SelectItem
                                  key={platform.value}
                                  value={platform.value}
                                >
                                  <div className="flex items-center gap-2">
                                    {platform.logo && platform.logo}
                                    {platform.name}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      );
                    }}
                  />

                  {/* Botoes de alerta, favoritos e ajuda */}
                  <div className="flex items-start gap-2">
                    {/* <Tooltip
                      info="Favoritos"
                      className="text-slate-200 bg-[#646464]"
                    >
                      <Button
                        type="button"
                        variant={filters.favorite ? "default" : "outline"}
                        size="icon"
                        className="relative mr-1"
                        onClick={changeFavouritesFilter}
                      >
                        <Star
                          size={16}
                          color="oklch(0.704 0.191 22.216)"
                          fill={
                            filters.favorite
                              ? "oklch(0.704 0.191 22.216)"
                              : "none"
                          }
                        />
                        {/* <Visible when={favouritesCount > 0}> */}
                    {/* <p className="rounded-full bg-orange-400 px-1 text-xs text-gray-100 w-5 h-5 flex items-center justify-center absolute -bottom-2 -left-2">
                          {1}
                        </p> */}
                    {/* </Visible> */}
                    {/* </Button>
                    </Tooltip>  */}

                    <Tooltip
                      info="Hot Lead"
                      className="text-slate-200 bg-[#646464]"
                    >
                      <Button
                        type="button"
                        variant={filters.hot_lead ? "default" : "outline"}
                        size="icon"
                        className="relative mr-1"
                        onClick={changeHotLeadFilter}
                      >
                        <Visible when={hotLeadCount > 0}>
                          <p className="rounded-full bg-orange-400 px-1 text-xs text-gray-100 w-5 h-5 flex items-center justify-center absolute -bottom-2 -left-2">
                            {hotLeadCount}
                          </p>
                        </Visible>

                        <Flame
                          size={16}
                          color="oklch(0.704 0.191 22.216)"
                          fill={
                            filters.hot_lead
                              ? "oklch(0.704 0.191 22.216)"
                              : "none"
                          }
                        />
                      </Button>
                    </Tooltip>

                    <Tooltip
                      info="Ajuda"
                      className="text-slate-200 bg-[#646464]"
                    >
                      <Button
                        type="button"
                        variant={filters.help ? "default" : "outline"}
                        size="icon"
                        className="relative mr-1"
                        onClick={changeHelpFilter}
                      >
                        <Visible when={needHelpCount > 0}>
                          <p className="rounded-full bg-orange-400 px-1 text-xs text-gray-100 w-5 h-5 flex items-center justify-center absolute -bottom-2 -left-2">
                            {needHelpCount}
                          </p>
                        </Visible>

                        <Hand
                          size={16}
                          color="oklch(0.704 0.191 22.216)"
                          fill={
                            filters.help ? "oklch(0.704 0.191 22.216)" : "none"
                          }
                        />
                      </Button>
                    </Tooltip>
                    {/* 
                  <Tooltip info="Alerta" className="text-slate-200">
                    <Button
                      type="button"
                      variant={filters.warning ? "default" : "outline"}
                      size="icon"
                      className="relative mr-1"
                      onClick={changeWarningFilter}
                    >
                      <Visible when={false}>
                        <p className="rounded-full bg-orange-400 px-1 text-xs text-gray-100 w-5 h-5 flex items-center justify-center absolute -bottom-2 -left-2">
                          {favouritesProspects.length}
                        </p>
                      </Visible>
                      <TriangleAlert
                        size={16}
                        color="oklch(0.704 0.191 22.216)"
                        fill={
                          filters.warning ? "oklch(0.704 0.191 22.216)" : "none"
                        }
                      />
                    </Button>
                  </Tooltip> */}
                  </div>
                </div>
              </form>
            </section>
            <section className="flex flex-col w-full h-full overflow-hidden">
              {/* Lista com scroll infinito */}
              <div
                ref={virtualChatsList.scrollContainerRef}
                className="flex-1 overflow-y-auto"
              >
                {virtualChatsList.visibleItems
                  .slice()
                  .sort((a, b) => {
                    const aIsName = a.isResultByMessage ? 1 : 0;
                    const bIsName = b.isResultByMessage ? 1 : 0;
                    return aIsName - bIsName;
                  })
                  .map((chat) => {
                    const isResultByName = chat.isResultByMessage === false;
                    const currentType: "name" | "message" = isResultByName
                      ? "name"
                      : "message";

                    const isFirstOfGroup = currentType !== previousType;
                    previousType = currentType;

                    // const isFavorite = favouritesProspects.includes(chat.id);
                    const isHandHelpButtonActive =
                      !!chat.prospect.data?.conversa_pendente;

                    return (
                      <div
                        key={`group-${chat._customKey || chat.id}`}
                        className="flex flex-col w-full "
                      >
                        {isFirstOfGroup && isByGlobalSearch ? (
                          <div
                            className="mt-4 text-xs text-neutral-500 
                       px-2 py-1 font-semibold uppercase"
                          >
                            {currentType === "name" ? "Contatos" : "Mensagens"}
                          </div>
                        ) : (
                          <div className="mt-4"></div>
                        )}
                        <ContactButton
                          botsQuery={botsQuery.data}
                          clientsIdQuery={clientsIdQuery}
                          searchedTerm={searchedTerm}
                          key={chat._customKey || chat.id}
                          chat={chat}
                          isFavorite={
                            true //isFavorite
                          }
                          isByGlobalSearch={isByGlobalSearch}
                          isSelected={selectedChat?.id === chat.id}
                          onClick={() => {
                            selectChat(chat.id);
                            setSelectedMessageIdFoIndex(
                              chat.messages[chat.messages.length - 1].id,
                            );
                          }}
                          // onFavorite={() => favoriteChat(chat.id)}
                          onHandHelpChange={() =>
                            handHelpProspect(chat.prospect.id)
                          }
                          isHandHelpButtonActive={isHandHelpButtonActive}
                        />
                      </div>
                    );
                  })}

                {/* Indicador de loading no final da lista */}
                {virtualChatsList.isLoadingMore && (
                  <div className="flex justify-center items-center p-4">
                    <Loader />
                  </div>
                )}

                {/* Mensagem quando chegou ao final */}
                {!virtualChatsList.hasMoreToLoad &&
                  virtualChatsList.totalItems > 30 && (
                    <div className="flex justify-center items-center p-4 text-xs text-muted-foreground">
                      Todos os chats foram carregados
                    </div>
                  )}
              </div>
            </section>
          </aside>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={75}
          className="flex flex-col items-start gap-2 relative w-[80%] shadow-md rounded-lg p-2"
        >
          {selectedChat ? (
            <ChatView
              currentChat={selectedChat}
              searchedTerm={searchedTerm}
              selectedMessageIdFoIndex={selectedMessageIdFoIndex}
              currentIndex={currentIndex}
              matchedMessages={matchedMessages}
              isCurrentChatChanged={isCurrentChatChanged}
              isByGlobalSearch={isByGlobalSearch}
              changeCurrentIndex={changeCurrentIndex}
              changeMatchedMessages={changeMatchedMessages}
              changeSearchedTerm={changeSearchedTerm}
              changeIsCurrentChatChanged={changeIsCurrentChatChanged}
              goToNext={goToNext}
              goToPrevious={goToPrevious}
              isLoading={isLoadingMessages}
            />
          ) : (
            <></>
            // <NoChatSelected />
          )}
        </ResizablePanel>

        {isClienteMaxTemperatureDefined && (
          <section className="flex w-24 flex-col h-full mt-2 overflow-scroll">
            {allChatsList.map((chat) => {
              if (
                chat.prospect.data?.temperatura_lead === clientMaxTemperature
              ) {
                return (
                  <HotLead chat={chat} onClick={() => selectChat(chat.id)} />
                );
              }
              return null;
            })}
          </section>
        )}
      </ResizablePanelGroup>
    </>
  );
}

// function NoChatSelected() {
//   return (
//     <div className="flex flex-col items-center justify-center w-full h-full gap-2">
//       <img src={anonymousAvatar} alt="Logo" className="w-20 h-20" />
//       <h1 className="text-3xl font-semibold text-neutral-500 dark:text-neutral-300">
//         Über-Ich
//       </h1>
//     </div>
//   );
// }
