import type { JSX } from "react";

export function HomePage(): JSX.Element {
  const items = Array.from({ length: 10 }).map((_, index) => index);

  return (
    <div className=" min-h-[calc(100vh-160px)]">
      <div className="m-auto flex h-full w-full flex-col gap-2">
        <h1 className="leading-tight font-bold">LeadMedia Admin</h1>
        <p className="">
          Use o menu superior para navegar pelas diferentes seções do painel.
        </p>

        {items.map((item) => (
          <p key={item}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
            eius, aut consequatur nisi animi vitae suscipit modi aspernatur
            cumque. Consequatur eaque unde maiores ducimus reprehenderit eum,
            aut molestias fuga sequi!
          </p>
        ))}
      </div>
    </div>
  );
}
