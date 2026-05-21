import type { JSX } from "react";

export function HomePage(): JSX.Element {

  return (
    <div className=" min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="m-auto flex ">
        <img src="/megalead.png" className=" w-50" />
      </div>
    </div>
  )
}
