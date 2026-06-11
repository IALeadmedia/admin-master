interface FiteFromThermometerProps {
  showIcons: boolean;
  value: number;
  max: number;
  percentage: number;
}

export function FireFromThermometer({
  showIcons,
  value,
  max,
  percentage,
}: FiteFromThermometerProps) {
  return (
    <div>
      {showIcons && value === max && (
        <div
          className={`text-lg ml-2 ${
            percentage === 100 ? "fire-glow text-red-800" : ""
          }`}
        >
          🔥
        </div>
      )}
    </div>
  );
}
