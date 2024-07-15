import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";
import { Button } from "./button";

type InfoProps = {
  iconSize: number;
  content: any;
  iconStyle?: string;
  fillColor?: string;
};

export function InfoPopover({
  iconSize,
  content,
  iconStyle,
  fillColor,
}: InfoProps) {
  return (
    <Button variant="outline" size="icon" className={iconStyle}>
      <Popover>
        <PopoverTrigger asChild>
          <Info size={iconSize} role="img" aria-label="Info" />
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">{content}</div>
        </PopoverContent>
      </Popover>
    </Button>
  );
}
