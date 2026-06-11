
import { Tooltip } from "@/chat-uberich/components/ui/tooltip";
import { Star } from "lucide-react";
import { memo } from "react";

interface IFavorite {
  isFavorited: boolean;
  onFavoriteChange: () => void;
}

export const FavoriteButton = memo(
  ({ isFavorited, onFavoriteChange }: IFavorite) => {
    return (
      <Tooltip info="Favoritar" className="text-slate-200 bg-[#646464]">
        <div
          className="absolute bottom-[-5px] left-[-5px]"
          onClick={onFavoriteChange}
        >
          {isFavorited ? (
            <Star size={16} className="fill-red-500 text-red-500" />
          ) : (
            <Star size={16} className=" text-red-500" />
          )}
        </div>
      </Tooltip>
    );
  },
);
