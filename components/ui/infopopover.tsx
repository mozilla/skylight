import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Info } from "lucide-react";

type InfoProps = {
    iconSize: number;
    content: string;
  };
  
  export function InfoPopover({ iconSize, content }: InfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info size={iconSize} className="ml-2 cursor-pointer hover:text-foreground"/>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {content}
        </div>
      </PopoverContent>
    </Popover>
  )
}
