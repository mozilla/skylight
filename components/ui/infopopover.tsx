import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Info } from "lucide-react";

type InfoProps = {
    iconSize: number;
    content: any;
    iconStyle?: string;
  };
  
  export function InfoPopover({ iconSize, content, iconStyle }: InfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info size={iconSize} className={iconStyle} role="info"/>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          {content}
        </div>
      </PopoverContent>
    </Popover>
  )
}
