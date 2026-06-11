import { Image, Send, Loader, Mic, Paperclip } from "lucide-react";

import { ChatInputMessageController } from "./controller";
import { useMemo } from "react";
import { Button } from "@/chat-uberich/components/ui/button";
import { Label } from "@/chat-uberich/components/ui/label";
import { Input } from "@/chat-uberich/components/ui/input";
import { Visible } from "@/chat-uberich/components/common/visible";


export const ChatInputMessage = () => {
  const {
    sendMessageMutate,
    sendImageMutate,
    sendFileMutate,
    hookForm,
    sendFile,
    sendImage,
    onSubmit,
  } = ChatInputMessageController();

  const { register, handleSubmit, reset, watch } = hookForm;

  const textInputIsEmpty = useMemo(() => {
    const messageValue = watch("message")?.trim();
    return !messageValue || messageValue === "";
  }, [watch("message")]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => reset()}
      className="flex flex-row gap-2 w-full text-neutral-500 relative"
    >
      {/* <Button onClick={() => null} type="button" variant="outline" size="icon">
        <Label htmlFor="emoji" className="px-1.5 cursor-pointer">
          <Laugh size={16} />
        </Label>
      </Button> */}

      {sendFileMutate.isPending ? (
        <div className="items-center grid animate-spin duration-2000">
          <Loader
            size={16}
            className="animate-pulse duration-1000 text-blue-700"
          />
        </div>
      ) : (
        <Button type="button" variant="outline" size="icon">
          <Label htmlFor="select_file" className="px-1.5 cursor-pointer">
            <Paperclip size={16} />
          </Label>

          <Input
            type="file"
            id="select_file"
            className="hidden"
            accept="application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain"
            {...register("file")}
            onChange={sendFile}
          />
        </Button>
      )}

      {sendImageMutate.isPending ? (
        <div className="items-center grid animate-spin duration-2000">
          <Loader
            size={16}
            className="animate-pulse duration-1000 text-blue-700"
          />
        </div>
      ) : (
        <Button type="button" variant="outline" size="icon">
          <Label htmlFor="image" className="px-1.5 cursor-pointer">
            <Image size={16} />
          </Label>
          <Input
            type="file"
            id="image"
            className="hidden"
            accept="image/*"
            {...register("image")}
            onChange={sendImage}
          />
        </Button>
      )}

      <Input
        type="text"
        placeholder="Digite uma mensagem..."
        className="w-full text-neutral-500 "
        {...register("message")}
      />

      {/* verificar esse when */}
      <Visible when={!sendMessageMutate.isPending}>
        {!textInputIsEmpty ? (
          <Button
            type="submit"
            variant="outline"
            size="icon"
            disabled={sendMessageMutate.isPending}
          >
            <Send size={16} />
          </Button>
        ) : (
          <Button type="button" variant="outline" size="icon">
            <Label htmlFor="mic" className="px-1.5 cursor-pointer">
              <Mic size={16} />
            </Label>
          </Button>
        )}
      </Visible>

      <Visible when={sendMessageMutate.isPending}>
        <div className="items-center grid animate-spin duration-2000">
          <Loader
            size={16}
            className="animate-pulse duration-1000 text-blue-700"
          />
        </div>
      </Visible>
    </form>
  );
};
