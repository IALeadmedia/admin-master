import { memo, useEffect, useRef, useState } from "react";
import { Clock, Pause, Play } from "lucide-react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import type { IBaseMessage } from ".";
import { Button } from "@/chat-uberich/components/ui/button";

interface IAudioMessage extends IBaseMessage {
  audioSource: string;
}

export const AudioMessage = memo(
  ({ audioSource, messageTime }: IAudioMessage) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
      const audio = audioRef.current;
      if (!audio) return;

      const setAudioData = () => {
        setDuration(Math.ceil(audio.duration));
      };

      const setAudioTime = () => {
        setCurrentTime(audio.currentTime);
      };

      const onEnded = () => {
        setCurrentTime(Math.ceil(audio.duration));
        setIsPlaying(false);
      };

      audio.addEventListener("ended", onEnded);
      audio.addEventListener("loadedmetadata", setAudioData);
      audio.addEventListener("timeupdate", setAudioTime);

      return () => {
        audio.removeEventListener("ended", onEnded);
        audio.removeEventListener("loadedmetadata", setAudioData);
        audio.removeEventListener("timeupdate", setAudioTime);
        audioRef.current = null; // Clean up the audio reference
      };
    }, [audioSource]);

    const play = () => {
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
    };

    const pause = () => {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    const setTime = (time: number) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time); // Update currentTime state
      }
    };

    const timeToShow = isPlaying ? Math.ceil(currentTime) : duration;

    return (
      <div className="flex flex-col gap-2 w-[25%] ml-auto">
        <div className="bg-white shadow-md p-2 rounded-md flex-row gap-1 w-full">
          <div className="w-full flex items-center">
            <audio ref={audioRef} src={audioSource} />

            {isPlaying ? (
              <Button
                variant="ghost"
                className="text-white p-2 rounded-md"
                onClick={pause}
              >
                <Pause size={20} className="text-blue-500" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                className="text-white p-2 rounded-md"
                onClick={play}
              >
                <Play size={20} className="text-blue-500" />
              </Button>
            )}

            <SliderPrimitive.Root
              className="SliderRoot h-5 relative flex items-center select-none touch-none w-full"
              step={1}
              max={duration}
              value={[currentTime]}
              onValueChange={(value: number[]) => {
                setTime(value[0]);
              }}
              onValueCommit={(value: number[]) => {
                setTime(value[0]);
              }}
            >
              <SliderPrimitive.Track className="SliderTrack bg-zinc-200 relative grow rounded-full h-1.25">
                <SliderPrimitive.Range className="SliderRange absolute bg-blue-500 rounded-full h-full" />
              </SliderPrimitive.Track>
              <SliderPrimitive.Thumb className="SliderThumb block w-3.75 h-3.75 bg-blue-500 rounded-full shadow-[0_0_0_5px_rgba(0,0,0,.12)] focus:outline-none focus:shadow-[0_0_0_5px_rgba(0,0,0,.12),0_0_2px_2px_rgba(0,0,0,.3)]" />
            </SliderPrimitive.Root>
          </div>
        </div>
        <div className="justify-between items-center flex w-full">
          <div className="flex items-center gap-1 pt-1">
            <Clock size={16} className="text-blue-500" />
            <small className="flex items-center text-[11px] font-normal text-neutral-500  justify-start">
              {String(Math.floor(timeToShow / 60)).padStart(1, "0")}:
              {String(timeToShow % 60).padStart(2, "0")}
            </small>
          </div>
          <small className="text-[11px] font-normal text-neutral-500  ">
            {messageTime}
          </small>
        </div>
      </div>
    );
  },
);
