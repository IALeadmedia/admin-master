import { memo, useState } from "react";
import type { IBaseMessage } from ".";
import { Button } from "@/chat-uberich/components/ui/button";
import { MessageFormatter } from "@/chat-uberich/utils/messages-formatter";
import { Modal } from "@/chat-uberich/components/common/modal";
import { Visible } from "@/chat-uberich/components/common/visible";
interface IImageMessage extends IBaseMessage {
  imageUrl: string;
  caption?: string;
}

export const ImageMessage = memo(
  ({ imageUrl, messageTime, caption }: IImageMessage) => {
    const formattedCaption = caption && MessageFormatter.transformText(caption);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div className="flex flex-col items-start gap-2">
        {/* Imagem com botão para abrir o modal */}
        <div className="shadow-md p-1 rounded-md ">
          <Button
            variant="ghost"
            className="h-full w-fit"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={imageUrl}
              alt="Imagem"
              width={300}
              height={500}
              className="w-62.5 h-75 object-cover rounded-md"
            />
          </Button>
          {/* Texto da legenda com quebra de linha */}
          <Visible when={!!caption}>
            <div
              style={{ border: "none" }}
              className="bg-primary shadow-md p-2 rounded-md border border-b-gray-300 max-w-62.5 wrap-break-words mx-auto mb-1"
            >
              <p
                className="text-sm text-slate-300 "
                dangerouslySetInnerHTML={{ __html: formattedCaption! }}
              />
            </div>
          </Visible>
        </div>

        {/* Horário da mensagem */}
        <small className="text-[11px] font-normal text-neutral-500 ">
          {messageTime}
        </small>

        {/* Modal para exibir a imagem em tamanho maior */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Imagem"
        >
          <img
            src={imageUrl}
            alt="Imagem do prospect"
            className="rounded-md max-h-[70vh] max-w-[70vw] items-center flex"
          />
        </Modal>
      </div>
    );
  },
);
