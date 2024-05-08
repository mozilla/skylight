"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function InfoButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className: "bg-background p-1 hover:text-primary/70 hover:bg-background",
            })}
          >
            <Info size={16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">
            All messages listed in this table are in the release channel and are
            either currently live or have been live on Firefox at one time.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
