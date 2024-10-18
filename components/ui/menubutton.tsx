"use client";

import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
  navigationMenuItemStyle,
} from "@/components/ui/navigation-menu";
import {
  Menu,
  Hash,
  Book,
  AppWindow,
  Table,
  FileSearch,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground visited:text-inherit focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

type MenuButtonProps = {
  isComplete: boolean;
};

export function MenuButton({ isComplete }: MenuButtonProps) {
  const navMenuItemClassName =
    "no-underline flex gap-x-1 text-primary hover:bg-accent hover:text-accent-foreground visited:text-inherit";
  const iconSize = 20;
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuItemStyle()}>
            <a
              className={navMenuItemClassName}
              href="https://drive.google.com/drive/u/0/search?q=parent:1Jx7X_aFqvVCQYah9eOALvypZJdMf21F2"
            >
              <FileSearch size={iconSize} />
              Search Briefs
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuItemStyle()}>
            <a
              className={navMenuItemClassName}
              href="https://mozilla.github.io/limelight/"
            >
              <Lightbulb size={iconSize} />
              Create A New Message
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuItemStyle()}>
            <a
              className={navMenuItemClassName}
              href={isComplete ? "/" : "/complete"}
            >
              <Table size={iconSize} />
              {`See ${isComplete ? "Live" : "Completed"} Experiments`}
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuItemStyle()}>
            <a
              className={navMenuItemClassName}
              href="https://mozilla.slack.com/archives/C05N15KHCLC"
            >
              <Hash size={iconSize} />
              Help/Feedback
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Menu size={iconSize} className="mr-1" /> Messaging Info
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-4 md:w-[300px] lg:w-[400px]">
              <ListItem
                href="https://experimenter.info/messaging/desktop-messaging-surfaces/"
                title="Messaging Surfaces"
              />
              <ListItem
                href="https://firefox-source-docs.mozilla.org/browser/components/asrouter/docs/index.html"
                title="Technical Docs"
              />
              <ListItem
                href="https://mozilla-hub.atlassian.net/wiki/spaces/FIREFOX/pages/11043366/Onboarding+Messaging+Communication+OMC+Engineering+Team"
                title="OMC Team Info"
              />
              <ListItem
                href="https://mozilla.cloud.looker.com/dashboards/1461?Normalized+Channel=release"
                title="Looker Top 20 Messages Dashboard"
              />
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
