import { io } from "socket.io-client";

export const messagesSocket = io("https://evolution.bigdates.com.br:3400", {
  transports: ["websocket"],
  autoConnect: false,
});

export const notificationsSocket = io(
  "https://evolution.bigdates.com.br:3300",
  {
    transports: ["websocket"],
    autoConnect: false,
  },
);
