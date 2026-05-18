import type { JSX } from "react";

export function ExamplePage(nameBusiness: string): JSX.Element {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        Exemplo de Página - {nameBusiness}
      </h1>
      <p>
        Esta é uma página de exemplo para demonstrar a estrutura do projeto.
      </p>
    </div>
  );
}
