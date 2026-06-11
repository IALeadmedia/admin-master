import { useState } from "react";
import { useForm } from "react-hook-form";
import { ContextMenu } from "radix-ui";
import { Pen, Trash } from "lucide-react";

import type { IBaseMessage } from ".";
import { Button } from "@/chat-uberich/components/ui/button";
import { differenceInHours, differenceInMinutes } from "date-fns";
import { Visible } from "@/chat-uberich/components/common/visible";
import { DialogConfirm } from "@/chat-uberich/components/common/dialog-confirm";
import { Modal } from "@/chat-uberich/components/common/modal";
import { DialogClose, DialogFooter } from "@/chat-uberich/components/ui/dialog";
import { MessageFormatter } from "@/chat-uberich/utils/messages-formatter";


interface ITextMessage extends IBaseMessage {
  onDeleteMessage: () => void;
  onEditMessage: (text: string) => void;
  wasEdited: boolean;
  text: string;
  highlightTerm?: string;
  isCurrentMatch: boolean;
}

export const TextMessage = ({
  text,
  messageTime,
  wasEdited,
  onDeleteMessage,
  onEditMessage,
  highlightTerm,
  isCurrentMatch,
}: ITextMessage) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { register, handleSubmit } = useForm<{ message: string }>();

  const changeMessageWithSearchedTerm = (
    highlightTerm: string,
    formattedText: string,
    isCurrentMatch: boolean,
  ) => {
    const regex = new RegExp(`(${highlightTerm})`, "gi");
    const highlightClass = isCurrentMatch ? "bg-yellow-300" : "bg-yellow-700";

    return formattedText.replace(
      regex,
      `<mark class="${highlightClass}">$1</mark>`,
    );
  };

  let formattedText = MessageFormatter.transformText(text);

  if (highlightTerm) {
    formattedText = changeMessageWithSearchedTerm(
      highlightTerm,
      formattedText,
      isCurrentMatch,
    );
  }

  const handleDeleteMessage = async () => {
    try {
      await onDeleteMessage();
      setMenuOpen(false);
    } catch (error) {
      console.error("Error in handleDeleteMessage:", error);
      // O erro já será tratado pela mutation
    }
  };

  const onSubitEditMessage = ({ message }: { message: string }) => {
    onEditMessage(message);
    setIsEditModalOpen(false);
  };

  const formatedMssageTime = new Date(messageTime).toLocaleString("pt-BR", {
    timeStyle: "medium",
    dateStyle: "short",
  });

  const canEdit = differenceInMinutes(new Date(), new Date(messageTime)) <= 15;

  const canDelete = differenceInHours(new Date(), new Date(messageTime)) <= 60;

  return (
    <>
      <ContextMenu.Root onOpenChange={setMenuOpen}>
        <ContextMenu.Trigger asChild>
          <div className=" relative flex flex-col gap-2 max-w-[60%] w-max ml-auto">
            <div className="bg-white  shadow-md p-3 rounded-md w-full flex gap-1 justify-between relative">
              <Visible when={menuOpen}>
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-blue-500 rounded-l-md animate-pulse" />
              </Visible>

              <p
                className="text-neutral-500  text-sm"
                dangerouslySetInnerHTML={{ __html: formattedText }}
              />
              <Visible when={wasEdited}>
                <span className="text-[10px] absolute bottom-1 right-1 text-neutral-400  italic pr-2 pt-2">
                  editada
                </span>
              </Visible>
            </div>

            <small className="flex items-center text-[11px] font-normal text-neutral-500  justify-end">
              {formatedMssageTime}
            </small>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content className="shadow-sm bg-white rounded-md p-2 z-50">
          <ContextMenu.Item
            disabled={!canEdit}
            className="px-4 py-2 text-sm hover:bg-gray-100  cursor-pointer"
            onSelect={() => setIsEditModalOpen(true)}
          >
            <p
              className={`flex items-center gap-2 font-bold ${canEdit ? "text-blue-400" : "text-muted"
                }`}
            >
              <Pen size={14} />
              Editar
            </p>
          </ContextMenu.Item>

          <button
            type="button"
            disabled={!canDelete}
            className="px-4 py-2 text-sm hover:bg-gray-100  cursor-pointer"
          >
            <DialogConfirm
              title="Deseja remover essa mensagem?"
              confirmText="Remover"
              onConfirm={() => handleDeleteMessage()}
            >
              <p
                className={`flex items-center gap-2 font-bold ${canDelete ? "text-red-500" : "text-muted"
                  }`}
              >
                <Trash size={14} />
                Apagar
              </p>
            </DialogConfirm>
          </button>
        </ContextMenu.Content>
      </ContextMenu.Root>
      <Modal
        title="Edição 🖋️"
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      >
        <form onSubmit={handleSubmit(onSubitEditMessage)}>
          <div className="gap-6 my-2 text-muted-foreground flex flex-col min-w-[30vw] max-w-[40vw]">
            <div className="grid col-span-1 items-start gap-2">
              <textarea
                defaultValue={formattedText}
                placeholder="Mensagem"
                className="flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                {...register("message")}
                ref={(e) => {
                  if (e) {
                    register("message").ref(e);
                    e.focus();
                    e.selectionStart = e.selectionEnd = e.value.length;
                  }
                }}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogFooter className="mt-2">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  className="shadow-md hover:bg-slate-100   "
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit">Editar</Button>
            </DialogFooter>
          </DialogFooter>
        </form>
      </Modal>
    </>
  );
};
