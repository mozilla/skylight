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

type InfoProps = {
  iconSize: number
  content: string
}

export function InfoIcon( {iconSize, content}: InfoProps ) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className:
                "bg-background p-2 hover:text-primary/70 hover:bg-background",
            })}
          >
            <Info size={iconSize} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-normal">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
