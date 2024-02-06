import { Button, buttonVariants } from "@/components/ui/button";
import { Copy } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type PreviewLinkProps = {
  linkUrl : URL
}

// unless / until we expose via UITour (or MAKE_LINKABLE?)
async function copyPreviewLink (linkUrl : URL) : Promise<void> {
  return navigator.clipboard.writeText(linkUrl.toString());
}

export function PreviewLink({linkUrl} : PreviewLinkProps) {
  return (
      <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
            <Button
              className={
                buttonVariants({
                    variant: "secondary",
                    size: "sm",
                    className: "active:bg-slate-500 font-normal border  border-slate-700"
                })
              }
              onClick={async () => await copyPreviewLink(linkUrl)}>
            <Copy className="me-2" />
            Copy Preview URL
          </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>After clicking to copy, paste in URL bar for message preview</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
  )
}
