import { Loader, Pause, Play, Text } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useChatController } from "../../controller";
import { ArrowUp, ArrowDown, Search, X } from "lucide-react";
import { Separator } from "@/chat-uberich/components/ui/separator";
import { Thermometer } from "@/chat-uberich/components/common/thermometer";
import { FireFromThermometer } from "@/chat-uberich/components/common/fire-from-thermometer";

import { MessagesService } from "@/chat-uberich/service/messages";
import { useChatContext } from "@/chat-uberich/hooks/use-chat";
import { Modal } from "@/chat-uberich/components/common/modal";
import { Tooltip } from "@/chat-uberich/components/common/tooltip";
import { Input } from "@/chat-uberich/components/ui/input";
import { formatPhoneNumber } from "@/chat-uberich/utils/format_number";
import { Button } from "@/chat-uberich/components/ui/button";
import anonymousAvatar from "@/assets/anonymous_avatar.png";
const messagesService = new MessagesService();

const ChatHeaderActions = () => {
  const { selectedChat, pauseConversation, resumeConversation } =
    useChatContext();

  // Proteção contra currentChat undefined
  if (!selectedChat) {
    return null;
  }

  const { prospect } = selectedChat;
  const isPaused = prospect.data?.conversa_pausada;
  const [isModalTOpen, setIsModalTOpen] = useState(false);

  const pauseConversationMutation = useMutation({
    mutationFn: async () => {
      await messagesService.pauseConversation(prospect.id);
    },
    onSuccess: () => {
      pauseConversation(prospect.id);
    },
  });

  const resumeConversationMutation = useMutation({
    mutationFn: async () => {
      await messagesService.resumeConversation(prospect.id);
    },
    onSuccess: () => {
      resumeConversation(prospect.id);
    },
  });

  const updateConversationSummary = useMutation({
    mutationFn: async () => {
      await messagesService.updateConversationSummary(
        prospect.bot.platformId,
        prospect.externalId,
      );
    },
  });

  function changeBotActivity() {
    if (isPaused) {
      resumeConversationMutation.mutate();
    } else {
      pauseConversationMutation.mutate();
    }
  }

  const isPeding =
    pauseConversationMutation.isPending || resumeConversationMutation.isPending;
  const resumoConversa = prospect?.data?.resumo_da_conversa;

  return (
    <div className="flex items-center text-neutral-500">
      {isPeding ? (
        <div className="items-center grid animate-spin duration-2000">
          <Loader
            size={16}
            className="animate-pulse duration-1000 text-blue-700"
          />
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Modal
            isOpen={isModalTOpen}
            onClose={() => setIsModalTOpen(false)}
            title="Resumo da Conversa"
          >
            <Separator />
            <div className="max-h-[30dvh] max-w-[30dvw] flex items-center justify-center overflow-auto p-4">
              {resumoConversa ? (
                <p className="w-auto h-auto">{resumoConversa}</p>
              ) : (
                <p className="w-auto h-auto">
                  Essa conversa não possui um resumo.
                </p>
              )}
            </div>
          </Modal>

          <Tooltip
            info={resumoConversa || "Essa conversa não possui um resumo."}
            className="text-slate-200 bg-[#646464] w-64"
          >
            <div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setIsModalTOpen(true);
                  updateConversationSummary.mutate();
                }}
              >
                <p>
                  <Text size={16} />
                </p>
              </Button>
            </div>
          </Tooltip>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={changeBotActivity}
          >
            {isPaused ? (
              <Tooltip
                info="Retomar Bot"
                className="text-slate-200 bg-[#646464]"
              >
                <Play size={16} />
              </Tooltip>
            ) : (
              <Tooltip
                info="Pausar Bot"
                className="text-slate-200 bg-[#646464]"
              >
                <Pause size={16} />
              </Tooltip>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export const ChatHeader = ({
  prospect,
  changeSearchedTerm,
  goToNext,
  goToPrevious,
  isCurrentChatChanged,
  changeIsCurrentChatChanged,
  searchedTerm,
  currentIndex,
  totalMatchedMessages,
  isByGlobalSearch,
}: {
  prospect: any;
  changeSearchedTerm: (term: string) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  isCurrentChatChanged: boolean;
  changeIsCurrentChatChanged: (newIsCurrentChatChanged: boolean) => void;
  searchedTerm: string;
  currentIndex: number;
  totalMatchedMessages: number;
  isByGlobalSearch: boolean;
}) => {
  const { clientsIdQuery } = useChatController();

  const phoneNumber = formatPhoneNumber(prospect.externalId);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const min = 0;
  const clientMaxTemperature =
    clientsIdQuery.data?.[0]?.countTowardsTemperature?.length ?? 0;
  const value = Number(prospect?.data?.temperatura_lead ?? 0);
  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (clientMaxTemperature - min)) * 100),
  );

  const isClienteMaxTemperatureDefined =
    clientMaxTemperature !== undefined && clientMaxTemperature > 0;

  const shottedName =
    typeof prospect.data?.nome === "string" && prospect.data.nome.length > 50
      ? `${prospect.data.nome.slice(0, 50)}...`
      : prospect.data?.nome ||
      (prospect.platformData?.name?.length > 50
        ? `${prospect.platformData.name.slice(0, 50)}...`
        : prospect.platformData?.name);

  return (
    <div className="flex items-center gap-2 justify-between w-full">
      <div className="flex items-start gap-2">
        <Button
          variant="link"
          className="text-xs font-normal p-0 text-muted-foreground"
          onClick={() => setIsModalOpen(true)}
        >
          <p className="flex items-center text-muted-foreground gap-1">
            <img
              className="w-10 rounded-full"
              src={
                prospect.platformData?.picture ?? anonymousAvatar
              }
              alt="Avatar"
            />
          </p>
        </Button>

        <div className="flex items-center gap-3">
          <div>
            <p
              style={{ fontWeight: "bold" }}
              className="text-sm font-bold text-neutral-500 "
            >
              {shottedName || prospect.externalId}
            </p>
            <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-500 ">
              <span className="text-xs text-neutral-500 ">{phoneNumber}</span>
              {prospect.platformData?.name && (
                <span className="text-xs text-neutral-500  w-full sm:w-auto">
                  {prospect.platformData?.name}
                </span>
              )}
              {/* {prospect.data?.classificacao && (
                <span className="text-xs text-neutral-500 dark:text-neutral-300 bg-gray-300 p-1 rounded-sm dark:bg-slate-800 font-medium">
                  {prospect.data?.classificacao}
                </span>
              )} */}
              {prospect.data?.status && (
                <span className="text-xs text-neutral-500  bg-gray-300 p-1 rounded-sm  font-medium">
                  {prospect.data?.status}
                </span>
              )}
            </div>
          </div>

          {isClienteMaxTemperatureDefined && (
            <div className="flex w-50 h-2 items-center gap-1 mr-4">
              <Thermometer
                min={0}
                max={clientMaxTemperature}
                value={Number(prospect?.data?.temperatura_lead) || 0}
              />

              <FireFromThermometer
                value={Number(value)}
                max={clientMaxTemperature}
                percentage={percentage}
                showIcons={true}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <>
          {!isCurrentChatChanged && !isByGlobalSearch ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  changeIsCurrentChatChanged(true);
                  changeSearchedTerm("");
                }}
                className="p-1 h-6"
              >
                <X size={12} />
              </Button>
              <div className="relative w-37.5">
                <Input
                  style={{ fontSize: "12px", color: "#8b8e8f" }}
                  type="text"
                  value={searchedTerm}
                  placeholder="Buscar mensagem..."
                  className="w-37.5 text-xs"
                  onChange={(e) => changeSearchedTerm(e.target.value)}
                />
                {searchedTerm && (
                  <Button
                    style={{ fontSize: "12px", color: "#8b8e8f" }}
                    variant="ghost"
                    onClick={() => changeSearchedTerm("")}
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full h-1/2 py-3 
                      px-1.25 bg-transparent text-muted-foreground "
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <Tooltip info="Pesquisar" className="text-slate-200 bg-[#646464]">
              <Button
                style={{ fontSize: "12px", color: "#8b8e8f" }}
                variant="outline"
                disabled={isByGlobalSearch}
                size="icon"
                onClick={() => {
                  changeIsCurrentChatChanged(false);
                }}
              >
                <Search size={16} />
              </Button>
            </Tooltip>
          )}
          {(!isCurrentChatChanged || isByGlobalSearch) && (
            <div className="flex items-center gap-2">
              <Button
                style={{ fontSize: "12px", color: "#8b8e8f" }}
                variant="ghost"
                onClick={goToPrevious}
                disabled={searchedTerm === ""}
                className="p-1 h-6"
              >
                <ArrowUp size={12} />
              </Button>
              <Button
                style={{ fontSize: "12px", color: "#8b8e8f" }}
                variant="ghost"
                onClick={goToNext}
                disabled={searchedTerm === ""}
                className="p-1 h-6"
              >
                <ArrowDown size={12} />
              </Button>

              <p
                className="text-muted-foreground text-xs w-12.5"
                style={{ fontSize: "12px", color: "#8b8e8f" }}
              >
                {searchedTerm === ""
                  ? "0 de 0"
                  : `${currentIndex} de ${totalMatchedMessages}`}
              </p>
            </div>
          )}
        </>

        <ChatHeaderActions />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Foto de perfil"
      >
        <img
          className="rounded-md max-h-[70vh] max-w-[70vw] items-center flex"
          src={prospect.platformData?.picture ?? anonymousAvatar}
          alt="Avatar"
        />
      </Modal>
    </div>
  );
};
