// Message encapsulation layer for transforming message objects into UI-ready data for branch info

import {
  getTemplateFromMessage,
  getSurfaceData,
  getPreviewLink,
} from "./messageUtils";
import { _substituteLocalizations } from "./experimentUtils";

// This function takes a message (feature.value, or a message from a multi) and returns an object
// with the UI-relevant data for BranchInfo. This is a first step and can be extended for more message types.
export function encapsulateMessageForBranchInfo({
  message,
  rawRecipe,
  branch,
}: {
  message: any;
  rawRecipe: any;
  branch: any;
}): {
  template: string;
  surface: string;
  id?: string;
  previewLink?: string;
} {
  // Use message.template if present, otherwise try to infer
  let template = message.template || getTemplateFromMessage(message);
  let result: any = {
    template,
    surface: getSurfaceData(template).surface,
  };

  switch (template) {
    case "aboutwelcome": {
      result.id = message.id;
      if (message.hasOwnProperty("screens")) {
        let spotlightFake = {
          id: rawRecipe.id,
          template: "spotlight",
          targeting: true,
          content: message,
        };
        spotlightFake.content.modal = "tab";
        spotlightFake.content.backdrop =
          message.backdrop ||
          "var(--mr-welcome-background-color) var(--mr-welcome-background-gradient)";
        let localizedWelcome = _substituteLocalizations(
          spotlightFake,
          rawRecipe.localizations?.[Object.keys(rawRecipe.localizations)[0]],
        );
        result.previewLink = getPreviewLink(localizedWelcome);
      }
      break;
    }
    case "feature_callout": {
      result.id = message.content?.screens?.[0]?.id?.split(":")[0];
      let localizedFeatureCallout = _substituteLocalizations(
        message,
        rawRecipe.localizations?.[Object.keys(rawRecipe.localizations)[0]],
      );
      result.previewLink = getPreviewLink(localizedFeatureCallout);
      break;
    }
    case "infobar": {
      result.id = message.id;
      let localizedInfobar = _substituteLocalizations(
        message.content,
        rawRecipe.localizations?.[Object.keys(rawRecipe.localizations)[0]],
      );
      result.previewLink = getPreviewLink(localizedInfobar);
      break;
    }
    case "toast_notification": {
      if (!message?.id) return result;
      result.id = message.content?.tag;
      break;
    }
    case "spotlight": {
      result.id = message.id;
      let localizedSpotlight = _substituteLocalizations(
        message,
        rawRecipe.localizations?.[Object.keys(rawRecipe.localizations)[0]],
      );
      result.previewLink = getPreviewLink(localizedSpotlight);
      break;
    }
    case "multi": {
      // For now, just encapsulate the first message recursively
      if (message.messages && message.messages.length > 0) {
        const encapsulated = encapsulateMessageForBranchInfo({
          message: message.messages[0],
          rawRecipe,
          branch,
        });
        // Ensure template is set to multi for the test
        encapsulated.template = "multi";
        return encapsulated;
      }
      break;
    }
    case "momentsUpdate": {
      // Not fully supported
      break;
    }
    default: {
      if (message?.messages && message.messages.length > 0) {
        result.id = message.messages[0].id;
      }
      break;
    }
  }
  return result;
}
