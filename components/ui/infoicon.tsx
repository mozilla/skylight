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

export function InfoIcon( infoObject: any ) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className:
                "bg-background p-1 hover:text-primary/70 hover:bg-background",
            })}
          >
            <Info size={infoObject.iconSize} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">{infoObject.content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
