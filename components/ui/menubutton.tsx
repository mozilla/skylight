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
} from "@/components/ui/navigation-menu";
import { Menu, Slack } from "lucide-react";
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
            className
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

export function MenuButton() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
            <a
              className="no-underline flex text-primary hover:bg-accent hover:text-accent-foreground visited:text-inherit"
              href="https://mozilla.slack.com/archives/C05N15KHCLC"
            >
              <Slack size={20} className="mr-1" />
              Help/Feedback
            </a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Menu className="mr-1" /> Messaging Info
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <ListItem
                href="https://mozilla-hub.atlassian.net/wiki/spaces/FIREFOX/pages/11043366/Onboarding+Messaging+Communication+OMC+Engineering+Team"
                title="OMC General Info"
              />
              <ListItem
                href="https://experimenter.info/messaging/desktop-messaging-surfaces/"
                title="Messaging Surfaces"
              />
              <ListItem
                href="https://firefox-source-docs.mozilla.org/browser/components/newtab/content-src/asrouter/docs/"
                title="New Tab Technical Documentation"
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
