import { memo, useState } from "react";
import type { IBaseMessage } from ".";
import { Modal } from "@/chat-uberich/components/common/modal";
import { Button } from "@/chat-uberich/components/ui/button";

interface IStickerMessage extends IBaseMessage {
  imageUrl: string;
}

// prospect-message/image.tsx
export const StickerMessage = memo(
  ({ imageUrl, messageTime }: IStickerMessage) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
      <div>
        <div className="bg-primary  shadow-md p-2 rounded-md place-self-start">
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Figurinha"
          >
            <img
              src={imageUrl}
              alt="Imagem do prospect"
              className="rounded-md max-h-[35vh] max-w-[35vw] items-center flex"
            />
          </Modal>
          <Button
            variant="ghost"
            className="h-full"
            onClick={() => setIsModalOpen(true)}
          >
            <img
              src={imageUrl}
              alt="Imagem"
              width={300}
              height={500}
              className="w-25 h-32.5 object-cover rounded-md"
            />
          </Button>
        </div>
        <small className="flex items-center text-[11px] font-normal text-neutral-500  justify-start pt-2">
          {messageTime}
        </small>
      </div>
    );
  },
);
