import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

type InfoProps = {
  content: any;
  iconStyle?: string;
};

export function InfoPopover({ content, iconStyle }: InfoProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Info className={iconStyle} role="img" aria-label="Info" />
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">{content}</div>
      </PopoverContent>
    </Popover>
  );
}
