"use client";

import * as React from "react";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";

interface ResizablePanelGroupProps {
  className?: string;
  direction?: "horizontal" | "vertical";
  children: React.ReactNode;
}

interface ResizablePanelProps {
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: React.ReactNode;
}

interface ResizableHandleProps {
  className?: string;
  withHandle?: boolean;
}

const ResizablePanelGroup = React.forwardRef<
  HTMLDivElement,
  ResizablePanelGroupProps
>(({ className, direction = "horizontal", children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full",
        direction === "vertical" ? "flex-col" : "flex-row",
        className,
      )}
      data-panel-group-direction={direction}
      {...props}
    >
      {children}
    </div>
  );
});
ResizablePanelGroup.displayName = "ResizablePanelGroup";

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, defaultSize = 50, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 overflow-hidden", className)}
        style={{
          flexBasis: `${defaultSize}%`,
          minWidth: 0,
          minHeight: 0,
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);
ResizablePanel.displayName = "ResizablePanel";

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center bg-border",
          "hover:bg-accent transition-colors",
          "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:cursor-row-resize",
          "data-[panel-group-direction=horizontal]:w-px data-[panel-group-direction=horizontal]:h-full data-[panel-group-direction=horizontal]:cursor-col-resize",
          className,
        )}
        data-panel-resize-handle
        {...props}
      >
        {withHandle && (
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
            <DragHandleDots2Icon className="h-2.5 w-2.5" />
          </div>
        )}
      </div>
    );
  },
);
ResizableHandle.displayName = "ResizableHandle";

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
