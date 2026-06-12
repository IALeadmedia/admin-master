import {
  Tooltip as RadixTooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";

export const Tooltip: React.FC<{
  info: string;
  children: React.ReactNode;
  sideOffset?: number;
  className?: string;
}> = ({ info, children, sideOffset = 4, className }) => (
  <TooltipProvider delayDuration={10}>
    <RadixTooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={sideOffset} className={className}>
        {info}
      </TooltipContent>
    </RadixTooltip>
  </TooltipProvider>
);
