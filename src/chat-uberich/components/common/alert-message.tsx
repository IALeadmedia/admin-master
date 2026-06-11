import { Bounce, toast, ToastOptions } from "react-toastify";

const config: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
  transition: Bounce,
};

type AlertMessageTypes = "error" | "success";

export function AlertMessage(message: string, type: AlertMessageTypes) {
  return (
    <>
      {type === "error" && toast.error(`${message}`, config)}
      {type === "success" && toast.success(`${message}`, config)}
    </>
  );
}
