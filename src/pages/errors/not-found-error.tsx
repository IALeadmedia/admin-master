import { useNavigate, useRouter } from "@tanstack/react-router";
import type { JSX } from "react";
import { Button } from "antd";

export function NotFoundError(): JSX.Element {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <div className="flex w-full h-screen">
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] leading-tight font-bold">404</h1>
        <span className="font-medium">Oops! Página não encontrada!</span>
        <p className="text-center text-muted-foreground">
          Parece que a página que você está procurando <br />
          não existe ou pode ter sido removida.
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
