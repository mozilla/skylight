import * as React from "react"

import { types } from "@mozilla/nimbus-shared";
import { BranchInfo, RecipeOrBranchInfo, experimentColumns, FxMSMessageInfo, fxmsMessageColumns } from "./columns";
import { getDashboard, getDisplayNameForTemplate, getTemplateFromMessage, _isAboutWelcomeTemplate, getPreviewLink } from "../lib/messageUtils.ts";
import { NimbusRecipeCollection } from "../lib/nimbusRecipeCollection"
import { _substituteLocalizations } from "../lib/experimentUtils.ts";

import { cn } from "@/lib/utils"
import { InfoIcon } from "@/components/ui/infoicon.tsx";
import { NimbusRecipe } from "../lib/nimbusRecipe.ts"
import { MessageTable } from "./message-table";
import Link from "next/link";
import { Apple, Menu } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"

function getASRouterLocalColumnFromJSON(messageDef: any) : FxMSMessageInfo {
  let fxmsMsgInfo : FxMSMessageInfo = {
    product: 'Desktop',
    id: messageDef.id,
    template: messageDef.template,
    surface: getDisplayNameForTemplate(getTemplateFromMessage(messageDef)),
    segment: 'some segment',
    metrics: 'some metrics',
    ctrPercent: .5, // getMeFromLooker
    ctrPercentChange: 2, // getMeFromLooker
    previewLink: getPreviewLink(messageDef),
  };

  fxmsMsgInfo.ctrDashboardLink = getDashboard(messageDef.template, messageDef.id,
    "release")

  return fxmsMsgInfo
}

let columnsShown = false;

type NimbusExperiment = types.experiments.NimbusExperiment;


async function getASRouterLocalMessageInfoFromFile(): Promise<FxMSMessageInfo[]> {
  const fs = require("fs");

  let data = fs.readFileSync(
    "lib/asrouter-local-prod-messages/123-nightly-in-progress.json",
    "utf8");
  let json_data = JSON.parse(data);

  let messages : FxMSMessageInfo[] =
    json_data.map((messageDef : any) : FxMSMessageInfo => getASRouterLocalColumnFromJSON(messageDef));

  return messages;
}

async function getMsgExpRecipeCollection(
  recipeCollection: NimbusRecipeCollection
): Promise<NimbusRecipeCollection> {
  const expOnlyCollection = new NimbusRecipeCollection();
  expOnlyCollection.recipes = recipeCollection.recipes.filter((recipe) =>
    recipe.isExpRecipe()
  );
  console.log("expOnlyCollection.length = ", expOnlyCollection.recipes.length);

  const msgExpRecipeCollection = new NimbusRecipeCollection();
  msgExpRecipeCollection.recipes = expOnlyCollection.recipes.filter((recipe) =>
    recipe.usesMessagingFeatures()
  );
  console.log(
    "msgExpRecipeCollection.length = ",
    msgExpRecipeCollection.recipes.length
  );

  return msgExpRecipeCollection;
}

async function getMsgRolloutCollection(
  recipeCollection: NimbusRecipeCollection
): Promise<NimbusRecipeCollection> {
  const msgRolloutRecipeCollection = new NimbusRecipeCollection();
  msgRolloutRecipeCollection.recipes = recipeCollection.recipes.filter(
    (recipe) => recipe.usesMessagingFeatures() && !recipe.isExpRecipe()
  );
  console.log(
    "msgRolloutRecipeCollection.length = ",
    msgRolloutRecipeCollection.recipes.length
  );

  return msgRolloutRecipeCollection;
}

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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
  )
})
ListItem.displayName = "ListItem"

export default async function Dashboard() {
  const recipeCollection = new NimbusRecipeCollection()
  await recipeCollection.fetchRecipes()
  console.log('recipeCollection.length = ', recipeCollection.recipes.length)

  // XXX await Promise.allSettled for all three loads concurrently
  const localData = await getASRouterLocalMessageInfoFromFile()
  const msgExpRecipeCollection = await getMsgExpRecipeCollection(recipeCollection)
  const msgRolloutRecipeCollection = await getMsgRolloutCollection(recipeCollection)

  // get in format useable by MessageTable
  const experimentAndBranchInfo : RecipeOrBranchInfo[] =
    msgExpRecipeCollection.recipes.map(
      (recipe : NimbusRecipe) => recipe.getRecipeInfo())

  const totalExperiments = msgExpRecipeCollection.recipes.length

  const msgRolloutInfo: RecipeOrBranchInfo[] =
    msgRolloutRecipeCollection.recipes.map(
      (recipe : NimbusRecipe) => recipe.getRecipeInfo())

  const totalRolloutExperiments = msgRolloutRecipeCollection.recipes.length;

  return (
    <div>
      <div>
        <div className="flex justify-between mx-20 py-8">
          <h4 className="scroll-m-20 text-3xl font-semibold">
            Skylight
          </h4>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger><Menu /></NavigationMenuTrigger>
                <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <a
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        href="/"
                      >
                        <Apple className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          shadcn/ui
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Beautifully designed components that you can copy and
                          paste into your apps. Accessible. Customizable. Open
                          Source.
                        </p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                  <ListItem href="/docs" title="Introduction">
                    Re-usable components built using Radix UI and Tailwind CSS.
                  </ListItem>
                  <ListItem href="/docs/installation" title="Installation">
                    How to install dependencies and structure your app.
                  </ListItem>
                  <ListItem href="/docs/primitives/typography" title="Typography">
                    Styles for headings, paragraphs, lists...etc
                  </ListItem>
                </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <ul className='list-[circle] mx-20 text-sm'>
          <li>
            To make the preview URLs work: load <code>about:config</code> in Firefox, and set <code>browser.newtabpage.activity-stream.asrouter.devtoolsEnabled</code> to <code>true</code>; <b>a Firefox 126 build from March 29 or newer</b> is required.
          </li>

          <li>
          Feedback of all kinds accepted in <Link href="https://mozilla.slack.com/archives/C05N15KHCLC">#skylight-messaging-system</Link>
          </li>

          <li>
            <b>(*)</b> Production Messages - Release Channel is currently a partial list. Nimbus rollouts, remote-settings messages, and a small number of others are planned.
          </li>
        </ul>
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Messages Released on Firefox
        <InfoIcon
          iconSize={16}
          content="All messages listed in this table are in the release channel and are either currently live or have been live on Firefox at one time."
        />
      </h5>
      <h5 className="scroll-m-20 text-lg font-semibold text-center">
        (Partial List) 
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={fxmsMessageColumns} data={localData} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current Message Rollouts
      </h5>
      <h5 className="scroll-m-20 text-lg font-semibold text-center">
        Total: {totalRolloutExperiments}
      </h5>
      <div className="container mx-auto py-10">
        <MessageTable columns={experimentColumns} data={msgRolloutInfo} />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Current Message Experiments
      </h5>
      <h5 className="scroll-m-20 text-lg font-semibold text-center">
        Total: {totalExperiments}
      </h5>

      <div className="container mx-auto py-10">
        <MessageTable columns={experimentColumns} data={experimentAndBranchInfo} />
      </div>
    </div>
  );
}
