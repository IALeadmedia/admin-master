import { memo, useState } from "react";
import { File } from "lucide-react";
import type { IBaseMessage } from ".";
import { Modal } from "@/chat-uberich/components/common/modal";
interface IDocumentMessage extends IBaseMessage {
  documentUrl: string;
}

export const DocumentMessage = memo(
  ({ documentUrl, messageTime }: IDocumentMessage) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
      <div>
        <div className="bg-primary shadow-md p-2 rounded-md place-self-start">
          <Modal
            title="Documento"
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          >
            <div className="h-[85dvh] w-[80dvw] flex items-center justify-center overflow-auto p-8">
              <embed
                src={documentUrl}
                className="w-full h-full"
                title="Embedded PDF Viewer"
              />
            </div>
          </Modal>
          <button
            className="p-1 cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <p className="text-sm font-semibold text-slate-300  break-all relative flex items-center gap-2">
              <File size={14} /> Abrir documento
            </p>
          </button>
        </div>
        <small className="flex items-center text-[11px] font-normal text-neutral-500 justify-start pt-2">
          {messageTime}
        </small>
      </div>
    );
  },
);
