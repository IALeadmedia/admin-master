import { useChatContext } from "@/chat-uberich/hooks/use-chat";
import { MessagesService } from "@/chat-uberich/service/messages";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
interface SendFileMutationProps {
  base64Content: string;
  name: string;
}

const messageService = new MessagesService();

export function ChatInputMessageController() {
  const hookForm = useForm<{ message: string; file: any; image: any }>();
  const { selectedChat } = useChatContext();

  // const sendMessageMutate = useMutation({
  //   mutationKey: ["sendMessage"],
  //   mutationFn: async (message: string) => {
  //     await messageService.sendMessage(selectedChat!.prospect.id, {
  //       text: message,
  //     });
  //   },
  // });

  const sendMessageMutate = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (message: string) => {
      if (!selectedChat) {
        throw new Error("Nenhum chat selecionado");
      }
      await messageService.sendMessage(selectedChat.prospect.id, message);
    },
  });

  const sendImageMutate = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async (base64Content: string) => {
      if (!selectedChat) {
        throw new Error("Nenhum chat selecionado");
      }
      await messageService.sendImage(selectedChat.prospect.id, {
        base64Content: base64Content,
      });
    },
  });

  const sendFileMutate = useMutation({
    mutationKey: ["sendMessage"],
    mutationFn: async ({ base64Content, name }: SendFileMutationProps) => {
      if (!selectedChat) {
        throw new Error("Nenhum chat selecionado");
      }
      await messageService.sendFile(selectedChat.prospect.id, {
        name: name,
        base64Content: base64Content,
      });
    },
  });

  const toBase64 = (file: any) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Content = base64String.split(",")[1];
        resolve({ base64Content, name: file.name });
      };
      reader.onerror = (error) => reject(error);
    });

  const onSubmit = (data: any) => {
    if (!selectedChat || sendMessageMutate.isPending) return;

    // if (data.image) {
    //   const image = data.image;
    //   toBase64(image).then((base64Content) => {
    //     sendImageMutate.mutate(base64Content as string);
    //   });
    //   hookForm.reset();
    //   return;
    // }

    // if (data.image) {
    //   const image = data.image;
    //   toBase64(image).then((base64Content) => {
    //     sendImageMutate.mutate(base64Content as string);
    //   });
    //
    //   return;
    // }

    sendMessageMutate.mutate(data.message);
    hookForm.reset();
  };

  const sendFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toBase64(file).then((res) => {
      const { base64Content, name } = res as any;

      const payload = {
        base64Content: base64Content as string,
        name: name as string,
      };

      sendFileMutate.mutate(payload);
    });
    return;
  };

  const sendImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (!image) return;

    toBase64(image).then((res) => {
      const { base64Content } = res as any;
      sendImageMutate.mutate(base64Content as string);
    });
  };

  return {
    sendMessageMutate,
    sendImageMutate,
    sendFileMutate,
    hookForm,
    sendFile,
    sendImage,
    onSubmit,
  };
}
