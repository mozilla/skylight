"use client"

import * as React from "react"
import { Button, buttonVariants } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function PreviewLinkButton( linkObject: any ) {
  
  const copyPreviewLink = () => {
    return navigator.clipboard.writeText(linkObject.previewLink);
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={
              buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  className: "active:bg-slate-500 font-normal border  border-slate-700 text-2xs px-4 py-1 h-6"
              })
            }
            onClick={copyPreviewLink}>
            <Copy className="me-2" size={11} />
              Copy Preview URL (Fx 126 >= March 29 only)
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>After clicking to copy, paste in URL bar for message preview</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
