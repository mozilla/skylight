import { RecipeOrBranchInfo, experimentColumns } from "./../columns";
import { _isAboutWelcomeTemplate } from "../../lib/messageUtils.ts";

import { NimbusRecipeCollection } from "../../lib/nimbusRecipeCollection";
import { _substituteLocalizations } from "../../lib/experimentUtils.ts";

import { NimbusRecipe } from "../../lib/nimbusRecipe.ts";
import { MessageTable } from "./../message-table";

import { MenuButton } from "@/components/ui/menubutton.tsx";
import { Timeline } from "@/components/ui/timeline.tsx";

const isLookerEnabled = process.env.IS_LOOKER_ENABLED === "true";

function compareFn(a: any, b: any) {
  if (a._rawRecipe.startDate < b._rawRecipe.startDate) {
    return -1;
  } else if (a._rawRecipe.startDate > b._rawRecipe.startDate) {
    return 1;
  }
  // a must be equal to b
  return 0;
}

async function getMsgExpRecipeCollection(
  recipeCollection: NimbusRecipeCollection,
): Promise<NimbusRecipeCollection> {
  const expOnlyCollection = new NimbusRecipeCollection(true);
  expOnlyCollection.recipes = recipeCollection.recipes.filter((recipe) =>
    recipe.isExpRecipe(),
  );
  console.log("expOnlyCollection.length = ", expOnlyCollection.recipes.length);

  const msgExpRecipeCollection = new NimbusRecipeCollection(true);
  msgExpRecipeCollection.recipes = expOnlyCollection.recipes
    .filter((recipe) => recipe.usesMessagingFeatures())
    .sort(compareFn);
  console.log(
    "msgExpRecipeCollection.length = ",
    msgExpRecipeCollection.recipes.length,
  );

  return msgExpRecipeCollection;
}

async function getMsgRolloutCollection(
  recipeCollection: NimbusRecipeCollection,
): Promise<NimbusRecipeCollection> {
  const msgRolloutRecipeCollection = new NimbusRecipeCollection(true);
  msgRolloutRecipeCollection.recipes = recipeCollection.recipes
    .filter((recipe) => recipe.usesMessagingFeatures() && !recipe.isExpRecipe())
    .sort(compareFn);
  console.log(
    "msgRolloutRecipeCollection.length = ",
    msgRolloutRecipeCollection.recipes.length,
  );

  return msgRolloutRecipeCollection;
}

export default async function CompleteExperimentsDashboard() {
  // Check to see if Auth is enabled
  const isAuthEnabled = process.env.IS_AUTH_ENABLED === "true";

  const recipeCollection = new NimbusRecipeCollection(true);
  await recipeCollection.fetchRecipes();
  console.log("recipeCollection.length = ", recipeCollection.recipes.length);

  // XXX await Promise.allSettled for all three loads concurrently
  const msgExpRecipeCollection =
    await getMsgExpRecipeCollection(recipeCollection);
  const msgRolloutRecipeCollection =
    await getMsgRolloutCollection(recipeCollection);

  // Get in format useable by MessageTable
  const experimentAndBranchInfo: RecipeOrBranchInfo[] = isLookerEnabled
    ? // Update branches inside recipe infos with CTR percents
      await msgExpRecipeCollection.getExperimentAndBranchInfos()
    : msgExpRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
      );

  const totalExperiments = msgExpRecipeCollection.recipes.length;

  const msgRolloutInfo: RecipeOrBranchInfo[] = isLookerEnabled
    ? // Update branches inside recipe infos with CTR percents
      await msgRolloutRecipeCollection.getExperimentAndBranchInfos()
    : msgRolloutRecipeCollection.recipes.map((recipe: NimbusRecipe) =>
        recipe.getRecipeInfo(),
      );

  const totalRolloutExperiments = msgRolloutRecipeCollection.recipes.length;

  return (
    <div>
      <div className="flex justify-between mx-20 py-8">
        <h4 className="scroll-m-20 text-3xl font-semibold">Skylight</h4>
        <MenuButton />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Complete Desktop Message Rollouts
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalRolloutExperiments}
      </h5>
      <div className="flex justify-center">
        <Timeline active="rollout" />
      </div>
      <div className="container mx-auto py-10">
        <MessageTable
          columns={experimentColumns}
          data={msgRolloutInfo}
          defaultExpanded={true}
        />
      </div>

      <h5 className="scroll-m-20 text-xl font-semibold text-center pt-4">
        Complete Desktop Message Experiments
      </h5>
      <h5 className="scroll-m-20 text-sm text-center">
        Total: {totalExperiments}
      </h5>
      <div className="flex justify-center">
        <Timeline active="experiment" />
      </div>
      <div className="space-y-5 container mx-auto py-10">
        <MessageTable
          columns={experimentColumns}
          data={experimentAndBranchInfo}
          defaultExpanded={true}
        />
      </div>
    </div>
  );
}
