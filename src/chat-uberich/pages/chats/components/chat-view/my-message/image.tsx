import { memo, useState } from "react";
import type { IBaseMessage } from ".";
import { Button } from "@/chat-uberich/components/ui/button";
import { Modal } from "@/chat-uberich/components/common/modal";
interface IImageMessage extends IBaseMessage {
  imageUrl: string;
}

export const ImageMessage = memo(({ imageUrl, messageTime }: IImageMessage) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2 max-w-[60%] w-max ml-auto">
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
      <div className="bg-white shadow-md p-2 rounded-md w-full">
        <Button
          variant="ghost"
          className="h-full relative"
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
      </div>
      <small className="flex items-center text-[11px] font-normal text-neutral-500  justify-end">
        {messageTime}
      </small>
    </div>
  );
});
