"use client";

import * as React from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function PreviewLinkButton(linkObject: any) {
  const copyPreviewLink = () => {
    return navigator.clipboard.writeText(linkObject.previewLink);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className={buttonVariants({
              variant: "secondary",
              size: "sm",
              className:
                "active:bg-slate-500 font-normal border  border-slate-700 text-2xs px-4 py-1 h-6",
            })}
            onClick={copyPreviewLink}
          >
            <Copy className="me-2" size={11} />
            Copy Preview URL
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="w-80">
            To preview, set{" "}
            <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code>{" "}
            to true; Firefox 128 or newer is required.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
