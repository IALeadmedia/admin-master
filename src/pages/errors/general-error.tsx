import { useNavigate, useRouter } from "@tanstack/react-router";
import { Button } from "antd";

export function GeneralError() {
  const navigate = useNavigate();
  const { history } = useRouter();
  return (
    <div className="h-screen w-full">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">500</h1>

        <span className="font-medium">Ops! Algo deu errado {`:')`}</span>
        <p className="text-center text-muted-foreground">
          Pedimos desculpas pelo inconveniente. <br /> Por favor, tente
          novamente mais tarde.
        </p>

        <div className="mt-6 flex gap-4">
          <Button type="default" onClick={() => history.go(-1)}>
            Voltar
          </Button>
          <Button type="primary" onClick={() => navigate({ to: "/app" })}>
            Voltar a Home
          </Button>
        </div>
      </div>
    </div>
  );
}
