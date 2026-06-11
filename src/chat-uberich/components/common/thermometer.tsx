import { memo } from "react";

interface Props {
  value: number;
  max: number;
  min: number;
  showIcons?: boolean;
}

export const Thermometer = memo(({ value, max, min, showIcons }: Props) => {
  const percentage = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );

  const stagePercentage = 100 / max;

  return (
    <div className="relative flex flex-row items-center w-full h-full">
      {/* Ice icon on the far left */}
      {showIcons && <div className="text-lg mr-2">❄️</div>}

      {/* Thermometer container */}
      <div className="relative flex-1 h-full rounded-full overflow-hidden shadow-md">
        {/* Fundo cinza */}
        <div className="absolute inset-0 bg-gray-200 rounded-full"></div>

        {/* Contêiner do gradiente completo (sempre presente, mas escondido) */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          {/* Gradiente completo como referência */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgb(0, 102, 255), rgb(255, 204, 0), rgb(255, 0, 0))",
            }}
          ></div>

          {/* Máscara para ocultar parte do gradiente */}
          <div
            className="absolute top-0 right-0 h-full bg-gray-200 transition-all duration-500"
            style={{
              width: `${100 - percentage}%`,
            }}
          ></div>

          {/* Efeito de brilho sobre o gradiente visível */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.4))",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.6)",
            }}
          ></div>
        </div>
        {/* Barras de marcação */}
        <div className="absolute inset-0 flex justify-between">
          {Array.from({ length: max + 1 }).map((_, index) => (
            <div
              key={index}
              className="h-full border-r border-gray-400 "
              style={{
                left: `${index * stagePercentage}%`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center pl-2 h-full">
        <p className="text-[12px] text-gray-500  font-medium">{value}</p>
      </div>
      {/* Fire icon on the far right */}
      {/* {[showIcons, value === max].some(Boolean) && (
        <div
          className={`text-lg ml-2 ${
            percentage === 100 ? "fire-glow text-red-800" : ""
          }`}
        >
          🔥
        </div>
      )} */}
    </div>
  );
});
